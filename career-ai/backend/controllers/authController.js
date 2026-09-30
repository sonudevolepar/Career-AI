const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const sendOTPEmail = require("../utils/sendEmail");


// =====================================================
// GENERATE OTP
// =====================================================

const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};


// =====================================================
// GENERATE JWT
// =====================================================

const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      role: user.role,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "7d",
    }
  );
};


// =====================================================
// REGISTER
// New user ALWAYS gets role = "user"
// =====================================================

exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Name, email and password are required",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters",
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Check existing user
    let user = await User.findOne({
      email: normalizedEmail,
    });

    // Already verified
    if (user && user.isVerified) {
      return res.status(400).json({
        success: false,
        message: "Email is already registered. Please login.",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate OTP
    const otp = generateOTP();

    const otpExpires = new Date(
      Date.now() + 10 * 60 * 1000
    );

    // =================================================
    // IMPORTANT:
    // Every new registration is USER
    // No ADMIN_EMAIL
    // No automatic admin creation
    // =================================================

    const role = "user";

    if (user) {
      user.name = name;
      user.password = hashedPassword;
      user.otp = otp;
      user.otpExpires = otpExpires;

      // Keep existing role.
      // This is important if an admin is resending
      // registration accidentally.
      if (!user.role) {
        user.role = "user";
      }

      await user.save();
    } else {
      user = await User.create({
        name,
        email: normalizedEmail,
        password: hashedPassword,

        // New users ALWAYS user
        role,

        isVerified: false,
        otp,
        otpExpires,
      });
    }

    // Send OTP
    await sendOTPEmail(
      normalizedEmail,
      name,
      otp
    );

    return res.status(201).json({
      success: true,
      message: "Registration successful. OTP sent to your email.",
      email: normalizedEmail,
    });

  } catch (error) {
    console.error("REGISTER ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while registering",
    });
  }
};


// =====================================================
// VERIFY OTP
// =====================================================

exports.verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: "Email and OTP are required",
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    const user = await User.findOne({
      email: normalizedEmail,
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (user.isVerified) {
      return res.status(400).json({
        success: false,
        message: "Email already verified",
      });
    }

    if (!user.otp || !user.otpExpires) {
      return res.status(400).json({
        success: false,
        message: "OTP not found. Please request a new OTP.",
      });
    }

    if (new Date() > user.otpExpires) {
      return res.status(400).json({
        success: false,
        message: "OTP expired. Please request a new OTP.",
      });
    }

    if (user.otp !== otp.toString()) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    // Verify user
    user.isVerified = true;
    user.otp = null;
    user.otpExpires = null;

    await user.save();

    // Generate token
    const token = generateToken(user);

    return res.status(200).json({
      success: true,
      message: "Email verified successfully",

      token,

      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });

  } catch (error) {
    console.error("VERIFY OTP ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while verifying OTP",
    });
  }
};


// =====================================================
// RESEND OTP
// =====================================================

exports.resendOTP = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    const user = await User.findOne({
      email: normalizedEmail,
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (user.isVerified) {
      return res.status(400).json({
        success: false,
        message: "Email already verified",
      });
    }

    const otp = generateOTP();

    user.otp = otp;

    user.otpExpires = new Date(
      Date.now() + 10 * 60 * 1000
    );

    await user.save();

    await sendOTPEmail(
      user.email,
      user.name,
      otp
    );

    return res.status(200).json({
      success: true,
      message: "New OTP sent to your email",
    });

  } catch (error) {
    console.error("RESEND OTP ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to resend OTP",
    });
  }
};


// =====================================================
// LOGIN
// =====================================================

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    const user = await User.findOne({
      email: normalizedEmail,
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Email verification
    if (!user.isVerified) {
      return res.status(403).json({
        success: false,
        message: "Please verify your email before login.",
        needsVerification: true,
        email: user.email,
      });
    }

    // Password
    const passwordMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!passwordMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // JWT contains role
    const token = generateToken(user);

    return res.status(200).json({
      success: true,
      message: "Login successful",

      token,

      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });

  } catch (error) {
    console.error("LOGIN ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while login",
    });
  }
};


// =====================================================
// GET CURRENT USER
// =====================================================

exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select(
      "-password -otp -otpExpires"
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      user,
    });

  } catch (error) {
    console.error("GET ME ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to get user",
    });
  }
};


// =====================================================
// GET ALL USERS
// ADMIN ONLY
// =====================================================

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select("-password -otp -otpExpires")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: users.length,
      users,
    });

  } catch (error) {
    console.error("GET ALL USERS ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to get users",
    });
  }
};


// =====================================================
// CHANGE USER ROLE
// ADMIN ONLY
// =====================================================

exports.updateUserRole = async (req, res) => {
  try {
    const { userId } = req.params;
    const { role } = req.body;

    // Only these roles are allowed
    if (!["user", "admin"].includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Role must be either user or admin",
      });
    }

    const targetUser = await User.findById(userId);

    if (!targetUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Prevent admin from removing their own admin access
    if (
      req.user.id.toString() === targetUser._id.toString() &&
      role !== "admin"
    ) {
      return res.status(400).json({
        success: false,
        message: "You cannot remove your own admin role",
      });
    }

    targetUser.role = role;

    await targetUser.save();

    return res.status(200).json({
      success: true,
      message: `User role changed to ${role}`,
      user: {
        id: targetUser._id,
        name: targetUser.name,
        email: targetUser.email,
        role: targetUser.role,
        isVerified: targetUser.isVerified,
      },
    });

  } catch (error) {
    console.error("UPDATE USER ROLE ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to update user role",
    });
  }
};


// =====================================================
// DELETE USER
// ADMIN ONLY
// =====================================================

exports.deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;

    // Admin cannot delete himself
    if (req.user.id.toString() === userId.toString()) {
      return res.status(400).json({
        success: false,
        message: "You cannot delete your own account",
      });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    await User.findByIdAndDelete(userId);

    return res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });

  } catch (error) {
    console.error("DELETE USER ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to delete user",
    });
  }
};

// ===============================
// GET ALL USERS - ADMIN ONLY
// ===============================

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select("-password -otp -otpExpires")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: users.length,
      users,
    });
  } catch (error) {
    console.error("GET ALL USERS ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Unable to fetch users",
    });
  }
};


// ===============================
// CHANGE USER ROLE - ADMIN ONLY
// ===============================

exports.updateUserRole = async (req, res) => {
  try {
    const { userId } = req.params;
    const { role } = req.body;

    // Only these roles are allowed
    if (!["user", "admin"].includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Invalid role. Role must be user or admin.",
      });
    }

    const targetUser = await User.findById(userId);

    if (!targetUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Admin cannot change his own role
    if (targetUser._id.toString() === req.user.id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You cannot change your own role.",
      });
    }

    // Already same role
    if (targetUser.role === role) {
      return res.status(400).json({
        success: false,
        message: `User is already ${role}.`,
      });
    }

    // Prevent removing the last admin
    if (targetUser.role === "admin" && role === "user") {
      const adminCount = await User.countDocuments({
        role: "admin",
      });

      if (adminCount <= 1) {
        return res.status(403).json({
          success: false,
          message: "You cannot remove the last admin.",
        });
      }
    }

    targetUser.role = role;

    await targetUser.save();

    res.status(200).json({
      success: true,
      message: `User role changed to ${role}`,
      user: {
        id: targetUser._id,
        name: targetUser.name,
        email: targetUser.email,
        role: targetUser.role,
        isVerified: targetUser.isVerified,
      },
    });
  } catch (error) {
    console.error("UPDATE USER ROLE ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Unable to update user role",
    });
  }
};


// ===============================
// CHANGE USER PASSWORD - ADMIN ONLY
// ===============================

exports.updateUserPassword = async (req, res) => {
  try {
    const { userId } = req.params;
    const { newPassword } = req.body;

    if (!newPassword) {
      return res.status(400).json({
        success: false,
        message: "New password is required",
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters",
      });
    }

    const targetUser = await User.findById(userId);

    if (!targetUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Admin cannot use this panel to change own password
    if (targetUser._id.toString() === req.user.id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You cannot change your own password from Admin Panel.",
      });
    }

    const hashedPassword = await bcrypt.hash(
      newPassword,
      10
    );

    targetUser.password = hashedPassword;

    await targetUser.save();

    res.status(200).json({
      success: true,
      message: "User password updated successfully",
    });
  } catch (error) {
    console.error("UPDATE USER PASSWORD ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Unable to update user password",
    });
  }
};


// ===============================
// DELETE USER - ADMIN ONLY
// ===============================

exports.deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const targetUser = await User.findById(userId);

    if (!targetUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Admin cannot delete himself
    if (targetUser._id.toString() === req.user.id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You cannot delete your own account.",
      });
    }

    // Prevent deleting the last admin
    if (targetUser.role === "admin") {
      const adminCount = await User.countDocuments({
        role: "admin",
      });

      if (adminCount <= 1) {
        return res.status(403).json({
          success: false,
          message: "You cannot delete the last admin.",
        });
      }
    }

    await User.findByIdAndDelete(userId);

    res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    console.error("DELETE USER ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Unable to delete user",
    });
  }
};
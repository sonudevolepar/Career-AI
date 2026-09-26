const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const sendOTPEmail = require("../utils/sendEmail");


// ===============================
// Generate OTP
// ===============================

const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};


// ===============================
// Generate JWT
// ===============================

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


// ===============================
// REGISTER
// ===============================

exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

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

    let user = await User.findOne({
      email: normalizedEmail,
    });

    // Already verified user
    if (user && user.isVerified) {
      return res.status(400).json({
        success: false,
        message: "Email is already registered. Please login.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const otp = generateOTP();

    const otpExpires = new Date(
      Date.now() + 10 * 60 * 1000
    );

    // ===============================
    // Admin detection
    // ===============================

    const role =
      normalizedEmail ===
      process.env.ADMIN_EMAIL?.toLowerCase()
        ? "admin"
        : "user";


    if (user) {
      user.name = name;
      user.password = hashedPassword;
      user.otp = otp;
      user.otpExpires = otpExpires;
      user.role = role;

      await user.save();
    } else {
      user = await User.create({
        name,
        email: normalizedEmail,
        password: hashedPassword,
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


    res.status(201).json({
      success: true,
      message:
        "Registration successful. OTP sent to your email.",
      email: normalizedEmail,
    });

  } catch (error) {
    console.error("REGISTER ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Server error while registering",
    });
  }
};


// ===============================
// VERIFY OTP
// ===============================

exports.verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: "Email and OTP are required",
      });
    }

    const user = await User.findOne({
      email: email.toLowerCase().trim(),
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

    if (user.otp !== otp) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }


    user.isVerified = true;
    user.otp = null;
    user.otpExpires = null;

    await user.save();


    const token = generateToken(user);


    res.status(200).json({
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

    res.status(500).json({
      success: false,
      message: "Server error while verifying OTP",
    });
  }
};


// ===============================
// RESEND OTP
// ===============================

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


    res.status(200).json({
      success: true,
      message: "New OTP sent to your email",
    });

  } catch (error) {
    console.error("RESEND OTP ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Unable to resend OTP",
    });
  }
};


// ===============================
// LOGIN
// ===============================

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const user = await User.findOne({
      email: email.toLowerCase().trim(),
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }


    // Email verification check
    if (!user.isVerified) {
      return res.status(403).json({
        success: false,
        message:
          "Please verify your email before login.",
        needsVerification: true,
        email: user.email,
      });
    }


    const passwordMatch =
      await bcrypt.compare(
        password,
        user.password
      );

    if (!passwordMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }


    const token = generateToken(user);


    res.status(200).json({
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

    res.status(500).json({
      success: false,
      message: "Server error while login",
    });
  }
};


// ===============================
// GET CURRENT USER
// ===============================

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

    res.status(200).json({
      success: true,
      user,
    });

  } catch (error) {
    console.error("GET ME ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Unable to get user",
    });
  }
};
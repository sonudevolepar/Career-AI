const express = require("express");

const {
  register,
  verifyOTP,
  resendOTP,
  login,
  getMe,
  getAllUsers,
  updateUserRole,
  updateUserPassword,
  deleteUser,
} = require("../controllers/authController");

const {
  protect,
  adminOnly,
} = require("../middleware/authMiddleware");

const router = express.Router();


// ==========================================
// PUBLIC ROUTES
// ==========================================

router.post("/register", register);

router.post("/verify-otp", verifyOTP);

router.post("/resend-otp", resendOTP);

router.post("/login", login);


// ==========================================
// PROTECTED USER ROUTES
// ==========================================

router.get(
  "/me",
  protect,
  getMe
);


// ==========================================
// ADMIN ONLY ROUTES
// ==========================================

// Get all users
router.get(
  "/admin/users",
  protect,
  adminOnly,
  getAllUsers
);


// Change user role
router.patch(
  "/admin/users/:userId/role",
  protect,
  adminOnly,
  updateUserRole
);


// Change user password
router.patch(
  "/admin/users/:userId/password",
  protect,
  adminOnly,
  updateUserPassword
);


// Delete user
router.delete(
  "/admin/users/:userId",
  protect,
  adminOnly,
  deleteUser
);


module.exports = router;
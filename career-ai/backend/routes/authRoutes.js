const express = require("express");

const {
  register,
  verifyOTP,
  resendOTP,
  login,
  getMe,
} = require("../controllers/authController");

const {
  protect,
  adminOnly,
} = require("../middleware/authMiddleware");


const router = express.Router();


// ===============================
// PUBLIC ROUTES
// ===============================

router.post(
  "/register",
  register
);

router.post(
  "/verify-otp",
  verifyOTP
);

router.post(
  "/resend-otp",
  resendOTP
);

router.post(
  "/login",
  login
);


// ===============================
// PROTECTED ROUTES
// ===============================

router.get(
  "/me",
  protect,
  getMe
);


// ===============================
// ADMIN TEST ROUTE
// ===============================

router.get(
  "/admin-only",
  protect,
  adminOnly,
  (req, res) => {

    res.json({
      success: true,
      message: "Welcome Admin!",
    });

  }
);


module.exports = router;
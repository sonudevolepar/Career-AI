const express = require("express");

const {
  createOrder,
  verifyPayment,
} = require("../controllers/paymentController");

const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// Create Razorpay Order
router.post("/create-order", protect, createOrder);

// Verify Razorpay Payment
router.post("/verify", protect, verifyPayment);

module.exports = router;
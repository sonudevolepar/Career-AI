
const express = require("express");

const {
  createOrder,
  verifyPayment,
} = require("../controllers/paymentController");

const {
  protect,
} = require("../middleware/authMiddleware");

const router = express.Router();

// ==========================================
// CREATE RAZORPAY ORDER
// ==========================================

router.post(
  "/create-order",
  protect,
  createOrder
);

// ==========================================
// VERIFY RAZORPAY PAYMENT
// ==========================================

router.post(
  "/verify",
  protect,
  verifyPayment
);

module.exports = router;

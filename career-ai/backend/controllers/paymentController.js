const Razorpay = require("razorpay");
const crypto = require("crypto");

const Payment = require("../models/Payment");
const User = require("../models/User");

// ==========================================
// RAZORPAY INSTANCE
// ==========================================

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// ==========================================
// CREATE RAZORPAY ORDER
// ==========================================

const createOrder = async (req, res) => {
  try {
    const userId = req.user._id;

    const amount = 49900; // ₹499
    const currency = "INR";

    const options = {
      amount,
      currency,
      receipt: `career_ai_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);

    // Save payment order in database
    const payment = await Payment.create({
      user: userId,
      razorpayOrderId: order.id,
      amount,
      currency,
      plan: "premium",
      status: "created",
    });

    res.status(200).json({
      success: true,
      message: "Razorpay order created successfully",

      order: {
        id: order.id,
        amount: order.amount,
        currency: order.currency,
      },

      paymentId: payment._id,

      key: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    console.error("Create Order Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to create payment order",
    });
  }
};

// ==========================================
// VERIFY RAZORPAY PAYMENT
// ==========================================

const verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = req.body;

    // Check required fields
    if (
      !razorpay_order_id ||
      !razorpay_payment_id ||
      !razorpay_signature
    ) {
      return res.status(400).json({
        success: false,
        message: "Payment details are missing",
      });
    }

    // Create signature
    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(
        `${razorpay_order_id}|${razorpay_payment_id}`
      )
      .digest("hex");

    // Compare signatures
    if (generatedSignature !== razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: "Payment verification failed",
      });
    }

    // Find payment
    const payment = await Payment.findOne({
      razorpayOrderId: razorpay_order_id,
    });

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: "Payment order not found",
      });
    }

    // Update payment
    payment.razorpayPaymentId = razorpay_payment_id;
    payment.razorpaySignature = razorpay_signature;
    payment.status = "paid";
    payment.paidAt = new Date();

    await payment.save();

    // Make user premium
    const user = await User.findById(payment.user);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    user.isPremium = true;
    user.premiumPlan = payment.plan;

    // Premium for 30 days
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 30);

    user.premiumExpiry = expiryDate;

    await user.save();

    res.status(200).json({
      success: true,
      message: "Payment verified successfully",
      isPremium: true,
      premiumPlan: user.premiumPlan,
      premiumExpiry: user.premiumExpiry,
    });
  } catch (error) {
    console.error("Verify Payment Error:", error);

    res.status(500).json({
      success: false,
      message: "Payment verification failed",
    });
  }
};

module.exports = {
  createOrder,
  verifyPayment,
};
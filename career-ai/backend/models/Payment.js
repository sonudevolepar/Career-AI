const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
  {
    // ===============================
    // USER
    // ===============================

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // ===============================
    // RAZORPAY ORDER
    // ===============================

    razorpayOrderId: {
      type: String,
      required: true,
    },

    // ===============================
    // RAZORPAY PAYMENT
    // ===============================

    razorpayPaymentId: {
      type: String,
      default: null,
    },

    razorpaySignature: {
      type: String,
      default: null,
    },

    // ===============================
    // PAYMENT DETAILS
    // ===============================

    amount: {
      type: Number,
      required: true,
    },

    currency: {
      type: String,
      default: "INR",
    },

    plan: {
      type: String,
      default: "premium",
    },

    status: {
      type: String,
      enum: ["created", "paid", "failed"],
      default: "created",
    },

    // ===============================
    // PAYMENT DATE
    // ===============================

    paidAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Payment", paymentSchema);
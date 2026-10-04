import React, { useState } from "react";
import "./PaymentButton.css";

const API_URL = "http://127.0.0.1:5000";

function PaymentButton() {
  const [loading, setLoading] = useState(false);

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }

      const script = document.createElement("script");

      script.src = "https://checkout.razorpay.com/v1/checkout.js";

      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);

      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    try {
      setLoading(true);

      // ===============================
      // LOAD RAZORPAY CHECKOUT
      // ===============================

      const scriptLoaded = await loadRazorpayScript();

      if (!scriptLoaded) {
        alert("Razorpay SDK load nahi ho paya.");
        return;
      }

      // ===============================
      // GET TOKEN
      // ===============================

      const token = localStorage.getItem("careerAI_token");

      if (!token) {
        alert("Please login first.");
        return;
      }

      // ===============================
      // CREATE ORDER
      // ===============================

      const orderResponse = await fetch(
        `${API_URL}/api/payment/create-order`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },

          credentials: "include",
        }
      );

      const orderData = await orderResponse.json();

      if (!orderResponse.ok || !orderData.success) {
        throw new Error(
          orderData.message || "Order create nahi hua."
        );
      }

      const { order, key } = orderData;

      // ===============================
      // RAZORPAY CHECKOUT
      // ===============================

      const options = {
        key: key,

        amount: order.amount,

        currency: order.currency,

        name: "Career AI",

        description: "Career AI Premium",

        order_id: order.id,

        handler: async function (response) {
          try {
            // ===============================
            // VERIFY PAYMENT
            // ===============================

            const verifyResponse = await fetch(
              `${API_URL}/api/payment/verify`,
              {
                method: "POST",

                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`,
                },

                credentials: "include",

                body: JSON.stringify({
                  razorpay_order_id:
                    response.razorpay_order_id,

                  razorpay_payment_id:
                    response.razorpay_payment_id,

                  razorpay_signature:
                    response.razorpay_signature,
                }),
              }
            );

            const verifyData =
              await verifyResponse.json();

            if (!verifyResponse.ok || !verifyData.success) {
              throw new Error(
                verifyData.message ||
                  "Payment verification failed."
              );
            }

            alert(
              "🎉 Payment successful! You are now a Premium user."
            );

            // Reload user data
            window.location.reload();
          } catch (error) {
            console.error(
              "Payment verification error:",
              error
            );

            alert(
              error.message ||
                "Payment verify nahi ho paya."
            );
          }
        },

        prefill: {
          name: "",
          email: "",
          contact: "",
        },

        notes: {
          product: "Career AI Premium",
        },

        theme: {
          color: "#6c63ff",
        },

        modal: {
          ondismiss: function () {
            console.log("Payment popup closed.");
          },
        },
      };

      const razorpay = new window.Razorpay(options);

      razorpay.on(
        "payment.failed",
        function (response) {
          console.error(
            "Payment failed:",
            response.error
          );

          alert(
            response.error?.description ||
              "Payment failed."
          );
        }
      );

      razorpay.open();
    } catch (error) {
      console.error("Payment Error:", error);

      alert(
        error.message ||
          "Payment start nahi ho paya."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      className="payment-button"
      onClick={handlePayment}
      disabled={loading}
    >
      {loading ? "Processing..." : "Upgrade to Premium ₹499"}
    </button>
  );
}

export default PaymentButton;
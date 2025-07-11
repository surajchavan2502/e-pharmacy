import Razorpay from "razorpay";

// Create a single Razorpay instance
const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

/**
 * Creates a Razorpay order
 * @param {number} amount - Amount in rupees
 * @param {string} currency - Currency code (default: 'INR')
 * @param {object} options - Additional options
 * @returns {Promise<object>} Razorpay order object
 */
export const createRazorpayOrder = async (
  amount,
  currency = "INR",
  options = {}
) => {
  try {
    if (!amount || isNaN(amount)) {
      throw new Error("Invalid amount provided");
    }

    const order = await razorpayInstance.orders.create({
      amount: Math.round(amount * 100), // Convert to paise and ensure integer
      currency,
      receipt: options.receipt || `order_${Date.now()}`,
      payment_capture: 1, // Auto-capture payment
      notes: options.notes || {},
    });

    console.log("Razorpay order created:", order.id);
    return order;
  } catch (error) {
    console.error("Razorpay order creation failed:", {
      error: error.error,
      description: error.error?.description,
      amount,
      currency,
    });
    throw new Error(
      error.error?.description || "Failed to create Razorpay order"
    );
  }
};

/**
 * Verifies a Razorpay payment
 * @param {string} paymentId - Razorpay payment ID
 * @returns {Promise<object>} Verification result
 */
export const verifyRazorpayPayment = async (paymentId) => {
  try {
    if (!paymentId || typeof paymentId !== "string") {
      throw new Error("Invalid payment ID");
    }

    const payment = await razorpayInstance.payments.fetch(paymentId);

    const result = {
      success: payment.status === "captured",
      data: payment,
    };

    console.log("Payment verification result:", {
      paymentId,
      status: payment.status,
      amount: payment.amount,
      success: result.success,
    });

    return result;
  } catch (error) {
    console.error("Payment verification failed:", {
      paymentId,
      error: error.error,
      description: error.error?.description,
    });
    throw new Error(error.error?.description || "Payment verification failed");
  }
};

// Export the Razorpay instance directly
export default razorpayInstance;

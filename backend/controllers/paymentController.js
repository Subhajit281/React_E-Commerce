import Razorpay from "razorpay";
import crypto from "crypto";
import Order from "../models/Order.js";
import Cart from "../models/Cart.js";
import User from "../models/user.js";
import { sendOrderInvoiceToSupplier, sendOrderConfirmationToCustomer } from "../utils/sendOrderEmail.js";

const getRazorpay = () => {
  if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET)
    throw new Error("Razorpay keys not configured in .env");
  return new Razorpay({ key_id: process.env.RAZORPAY_KEY_ID, key_secret: process.env.RAZORPAY_KEY_SECRET });
};

// ─── Resolve verified email from DB for logged-in users ──────────────────────
const resolveEmail = async (req, customer) => {
  try {
    if (req.user?._id) {
      const user = await User.findById(req.user._id).select("email name");
      if (user?.email) {
        customer.email = user.email; // ✅ always from DB — cannot be faked
        console.log("✅ Email resolved from DB:", user.email);
      } else {
        console.warn("⚠️ User found but no email in DB");
      }
    }
  } catch (err) {
    console.error("❌ resolveEmail error:", err.message);
  }
  return customer;
};

// ─── Shared: create + save order to DB ───────────────────────────────────────
const createOrderInDB = async ({
  items, address, customer, totalAmount, paymentMethod,
  userId = null, razorpayOrderId = "", razorpayPaymentId = "",
}) => {
  // Guard — email must exist before saving
  if (!customer.email) {
    throw new Error("Customer email is required to place an order");
  }

  const orderId  = `FH-${Date.now().toString().slice(-6)}`;
  const subtotal = items.reduce((acc, item) => acc + item.price * item.qty, 0);

  console.log("📦 Creating order:", { orderId, customer, totalAmount, paymentMethod });

  const order = await Order.create({
    user: userId || null,
    customer: {
      name:   customer.name   || "Customer",
      email:  customer.email,
      mobile: customer.mobile || "",
    },
    address,
    items: items.map((item) => ({
      productId:    String(item.id || item.productId || item._id),
      title:        item.title,
      price:        Number(item.price),
      qty:          Number(item.qty),
      image:        item.image || "",
      category:     item.category || "",
      selectedSize: item.selectedSize || "",
    })),
    subtotal:          Math.round(subtotal),
    shipping:          30,
    totalAmount:       Math.round(totalAmount),
    paymentMethod,
    paymentStatus:     paymentMethod === "COD" ? "pending" : "paid",
    orderStatus:       "placed",
    razorpayOrderId,
    razorpayPaymentId,
    orderId,
  });

  return order;
};

// ─── POST /api/payment/create-order ──────────────────────────────────────────
export const createOrder = async (req, res) => {
  try {
    const { amount } = req.body;
    if (!amount || amount <= 0) return res.status(400).json({ message: "Invalid amount" });

    const order = await getRazorpay().orders.create({
      amount:   Math.round(amount * 100),
      currency: "INR",
      receipt:  `receipt_${Date.now()}`,
    });

    return res.status(200).json({ success: true, orderId: order.id, amount: order.amount, currency: order.currency });
  } catch (err) {
    console.error("❌ createOrder error:", err.message);
    return res.status(500).json({ message: "Failed to create payment order", error: err.message });
  }
};

// ─── POST /api/payment/verify ─────────────────────────────────────────────────
export const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderMeta } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature)
      return res.status(400).json({ message: "Missing payment details" });

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (expectedSignature !== razorpay_signature)
      return res.status(400).json({ success: false, message: "Payment verification failed" });

    let order;
    if (orderMeta) {
      const customer = await resolveEmail(req, { ...orderMeta.customer });

      order = await createOrderInDB({
        ...orderMeta,
        customer,
        paymentMethod:     "UPI",
        userId:            req.user?._id || null,
        razorpayOrderId:   razorpay_order_id,
        razorpayPaymentId: razorpay_payment_id,
      });

      if (req.user?._id) {
        await Cart.findOneAndUpdate({ user: req.user._id }, { items: [] });
      }

      const date     = new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
      const subtotal = orderMeta.items.reduce((acc, i) => acc + i.price * i.qty, 0);

      sendOrderInvoiceToSupplier({ orderId: order.orderId, date, customer, address: orderMeta.address, items: orderMeta.items, subtotal, shipping: 30, total: orderMeta.totalAmount, paymentMethod: "UPI" });
      sendOrderConfirmationToCustomer({ orderId: order.orderId, customerEmail: customer.email, customerName: customer.name, total: orderMeta.totalAmount, paymentMethod: "UPI" });
    }

    return res.status(200).json({ success: true, message: "Payment verified", paymentId: razorpay_payment_id, orderId: order?.orderId });
  } catch (err) {
    console.error("❌ verifyPayment error:", err.message);
    return res.status(500).json({ message: "Verification error", error: err.message });
  }
};

// ─── POST /api/payment/cod-order ─────────────────────────────────────────────
export const placeCodOrder = async (req, res) => {
  try {
   

    const { items, address, totalAmount, customer: customerFromBody } = req.body;

    if (!items || !address || !totalAmount || !customerFromBody)
      return res.status(400).json({ message: "Missing order details" });

    // ✅ Spread to avoid mutating req.body directly
    const customer = await resolveEmail(req, { ...customerFromBody });

     

    const order = await createOrderInDB({
      items, address, customer, totalAmount,
      paymentMethod: "COD",
      userId: req.user?._id || null,
    });

    if (req.user?._id) {
      await Cart.findOneAndUpdate({ user: req.user._id }, { items: [] });
    }

    const date     = new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
    const subtotal = items.reduce((acc, i) => acc + i.price * i.qty, 0);

    sendOrderInvoiceToSupplier({ orderId: order.orderId, date, customer, address, items, subtotal, shipping: 30, total: totalAmount, paymentMethod: "COD" });
    sendOrderConfirmationToCustomer({ orderId: order.orderId, customerEmail: customer.email, customerName: customer.name, total: totalAmount, paymentMethod: "COD" });

    return res.status(201).json({ success: true, message: "COD order placed", orderId: order.orderId });
  } catch (err) {
    console.error("❌ placeCodOrder error:", err.message);
    console.error(err.stack);
    return res.status(500).json({ message: "Failed to place COD order", error: err.message });
  }
};

// ─── GET /api/payment/my-orders ──────────────────────────────────────────────
export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    return res.status(200).json({ success: true, orders });
  } catch (err) {
    console.error("❌ getMyOrders error:", err.message);
    return res.status(500).json({ message: "Failed to fetch orders", error: err.message });
  }
};
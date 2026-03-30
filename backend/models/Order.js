import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema({
  productId:    { type: String, required: true },
  title:        { type: String, required: true },
  price:        { type: Number, required: true },
  qty:          { type: Number, required: true },
  image:        { type: String, default: "" },
  category:     { type: String, default: "" },
  selectedSize: { type: String, default: "" },
});

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    default: null,
  },
  customer: {
    name:   { type: String, required: true },
    email:  { type: String, required: true },
    mobile: { type: String, required: true }, // ✅ NEW
  },
  address:       { type: String, required: true },
  items:         [orderItemSchema],
  subtotal:      { type: Number, required: true },
  shipping:      { type: Number, default: 30 },
  totalAmount:   { type: Number, required: true },
  paymentMethod: { type: String, enum: ["COD", "UPI", "CARD"], required: true },
  paymentStatus: { type: String, enum: ["pending", "paid", "failed"], default: "pending" },
  orderStatus:   { type: String, enum: ["placed", "confirmed", "shipped", "delivered", "cancelled"], default: "placed" },
  razorpayOrderId:   { type: String, default: "" },
  razorpayPaymentId: { type: String, default: "" },
  orderId: { type: String, unique: true },
}, { timestamps: true });

export default mongoose.model("Order", orderSchema);
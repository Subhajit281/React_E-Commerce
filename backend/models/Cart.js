import mongoose from "mongoose";

const cartItemSchema = new mongoose.Schema({
  productId:    { type: String, required: true },
  title:        { type: String, required: true },
  price:        { type: Number, required: true },
  image:        { type: String, default: "" },
  category:     { type: String, default: "" },
  selectedSize: { type: String, default: "" },
  qty:          { type: Number, required: true, min: 1 },
});

const cartSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
    unique: true, // one cart per user
  },
  items: [cartItemSchema],
}, { timestamps: true });

export default mongoose.model("Cart", cartSchema);

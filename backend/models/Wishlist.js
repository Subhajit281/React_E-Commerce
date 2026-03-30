import mongoose from "mongoose";

const wishlistItemSchema = new mongoose.Schema({
  productId: { type: String, required: true },
  title:     { type: String, required: true },
  price:     { type: Number, required: true },
  image:     { type: String, default: "" },
  category:  { type: String, default: "" },
});

const wishlistSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
    unique: true, // one wishlist per user
  },
  items: [wishlistItemSchema],
}, { timestamps: true });

export default mongoose.model("Wishlist", wishlistSchema);

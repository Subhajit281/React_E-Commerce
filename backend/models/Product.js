import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  title:       { type: String, required: true, trim: true },
  description: { type: String, required: true, trim: true },
  price:       { type: Number, required: true, min: 0 },
  discountPrice: { type: Number, default: null }, // sale price
  images:      [{ type: String }],                // array of image URLs (Cloudinary)
  category:    { type: String, required: true, trim: true, lowercase: true },
  subcategory: { type: String, default: "", trim: true, lowercase: true },

  // Sizes — only populated for clothing/footwear
  sizes: [{
    label:     { type: String },  // "S", "M", "L" or "UK 7"
    sizeType:  { type: String, enum: ["clothing", "footwear", "none"], default: "none" },
    stock:     { type: Number, default: 0 },
  }],

  // For non-sized products (electronics, jewellery etc.)
  stock: { type: Number, default: 0 },

  requiresSize: { type: Boolean, default: false }, // true for clothing/footwear

  rating: {
    rate:  { type: Number, default: 0 },
    count: { type: Number, default: 0 },
  },

  isActive: { type: Boolean, default: true }, // soft delete / unpublish
  isFeatured: { type: Boolean, default: false },
}, { timestamps: true });

// Text search index
productSchema.index({ title: "text", description: "text", category: "text" });

export default mongoose.model("Product", productSchema);

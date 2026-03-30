import Product from "../models/Product.js";

// ─── GET all products (public) ────────────────────────────────────────────────
export const getAllProducts = async (req, res) => {
  try {
    const { category, search, featured, limit = 50, page = 1 } = req.query;
    const query = { isActive: true };

    if (category) query.category = category.toLowerCase();
    if (featured === "true") query.isFeatured = true;
    if (search) query.$text = { $search: search };

    const skip = (Number(page) - 1) * Number(limit);
    const products = await Product.find(query).skip(skip).limit(Number(limit)).sort({ createdAt: -1 });
    const total = await Product.countDocuments(query);

    return res.status(200).json({ success: true, total, page: Number(page), products });
  } catch (err) {
    return res.status(500).json({ message: "Failed to fetch products", error: err.message });
  }
};

// ─── GET single product (public) ─────────────────────────────────────────────
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product || !product.isActive)
      return res.status(404).json({ message: "Product not found" });
    return res.status(200).json({ success: true, product });
  } catch (err) {
    return res.status(500).json({ message: "Error fetching product", error: err.message });
  }
};

// ─── GET products by category (public) ───────────────────────────────────────
export const getProductsByCategory = async (req, res) => {
  try {
    const products = await Product.find({
      category: req.params.category.toLowerCase(),
      isActive: true,
    }).sort({ createdAt: -1 });
    return res.status(200).json({ success: true, products });
  } catch (err) {
    return res.status(500).json({ message: "Error fetching products", error: err.message });
  }
};

// ─── GET all categories (public) ─────────────────────────────────────────────
export const getCategories = async (req, res) => {
  try {
    const categories = await Product.distinct("category", { isActive: true });
    return res.status(200).json({ success: true, categories });
  } catch (err) {
    return res.status(500).json({ message: "Error fetching categories", error: err.message });
  }
};

// ─── CREATE product (admin only) ─────────────────────────────────────────────
export const createProduct = async (req, res) => {
  try {
    const {
      title, description, price, discountPrice,
      images, category, subcategory,
      sizes, stock, requiresSize,
      isFeatured,
    } = req.body;

    if (!title || !description || !price || !category) {
      return res.status(400).json({ message: "title, description, price and category are required" });
    }

    const product = await Product.create({
      title, description,
      price: Number(price),
      discountPrice: discountPrice ? Number(discountPrice) : null,
      images: images || [],
      category: category.toLowerCase(),
      subcategory: subcategory?.toLowerCase() || "",
      sizes: sizes || [],
      stock: Number(stock) || 0,
      requiresSize: requiresSize || false,
      isFeatured: isFeatured || false,
    });

    return res.status(201).json({ success: true, message: "Product created", product });
  } catch (err) {
    return res.status(500).json({ message: "Failed to create product", error: err.message });
  }
};

// ─── UPDATE product (admin only) ─────────────────────────────────────────────
export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!product) return res.status(404).json({ message: "Product not found" });
    return res.status(200).json({ success: true, message: "Product updated", product });
  } catch (err) {
    return res.status(500).json({ message: "Failed to update product", error: err.message });
  }
};

// ─── DELETE product — soft delete (admin only) ────────────────────────────────
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });
    if (!product) return res.status(404).json({ message: "Product not found" });
    return res.status(200).json({ success: true, message: "Product removed" });
  } catch (err) {
    return res.status(500).json({ message: "Failed to delete product", error: err.message });
  }
};

import Wishlist from "../models/Wishlist.js";

// ─── GET wishlist ─────────────────────────────────────────────────────────────
export const getWishlist = async (req, res) => {
  try {
    let wishlist = await Wishlist.findOne({ user: req.user._id });
    if (!wishlist) wishlist = await Wishlist.create({ user: req.user._id, items: [] });
    return res.status(200).json({ success: true, items: wishlist.items });
  } catch (err) {
    return res.status(500).json({ message: "Failed to fetch wishlist", error: err.message });
  }
};

// ─── ADD to wishlist (toggle — adds if not exists, removes if exists) ─────────
export const toggleWishlist = async (req, res) => {
  try {
    const { productId, title, price, image, category } = req.body;
    if (!productId || !title || !price) {
      return res.status(400).json({ message: "productId, title and price required" });
    }

    let wishlist = await Wishlist.findOne({ user: req.user._id });
    if (!wishlist) wishlist = await Wishlist.create({ user: req.user._id, items: [] });

    const idx = wishlist.items.findIndex((i) => i.productId === String(productId));

    let action;
    if (idx !== -1) {
      wishlist.items.splice(idx, 1); // already in wishlist → remove
      action = "removed";
    } else {
      wishlist.items.push({ productId: String(productId), title, price: Number(price), image: image || "", category: category || "" });
      action = "added";
    }

    await wishlist.save();
    return res.status(200).json({ success: true, action, items: wishlist.items });
  } catch (err) {
    return res.status(500).json({ message: "Failed to update wishlist", error: err.message });
  }
};

// ─── REMOVE specific item ─────────────────────────────────────────────────────
export const removeFromWishlist = async (req, res) => {
  try {
    const { productId } = req.params;
    const wishlist = await Wishlist.findOne({ user: req.user._id });
    if (!wishlist) return res.status(404).json({ message: "Wishlist not found" });

    wishlist.items = wishlist.items.filter((i) => i.productId !== productId);
    await wishlist.save();
    return res.status(200).json({ success: true, items: wishlist.items });
  } catch (err) {
    return res.status(500).json({ message: "Failed to remove from wishlist", error: err.message });
  }
};

// ─── CLEAR wishlist ───────────────────────────────────────────────────────────
export const clearWishlist = async (req, res) => {
  try {
    await Wishlist.findOneAndUpdate({ user: req.user._id }, { items: [] });
    return res.status(200).json({ success: true, message: "Wishlist cleared" });
  } catch (err) {
    return res.status(500).json({ message: "Failed to clear wishlist", error: err.message });
  }
};

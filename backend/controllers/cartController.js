import Cart from "../models/Cart.js";

// ─── Helper: format items ─────────────────────────────────────────────────────
const formatItem = (item) => ({
  productId:    String(item.productId || item.id || item._id),
  title:        item.title,
  price:        Number(item.price),
  image:        item.image || "",
  category:     item.category || "",
  selectedSize: item.selectedSize || "",
  qty:          Number(item.qty) || 1,
});

// ─── GET cart (logged-in user) ────────────────────────────────────────────────
export const getCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) cart = await Cart.create({ user: req.user._id, items: [] });
    return res.status(200).json({ success: true, items: cart.items });
  } catch (err) {
    return res.status(500).json({ message: "Failed to fetch cart", error: err.message });
  }
};

// ─── SYNC cart — called right after login ─────────────────────────────────────
// Merges localStorage cart (sent from frontend) with existing DB cart
export const syncCart = async (req, res) => {
  try {
    const { localItems = [] } = req.body; // items from localStorage

    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) cart = await Cart.create({ user: req.user._id, items: [] });

    // Merge: for each local item, if it exists in DB cart increment qty, else add it
    for (const localItem of localItems) {
      const formatted = formatItem(localItem);
      const existing = cart.items.find(
        (i) => i.productId === formatted.productId && i.selectedSize === formatted.selectedSize
      );
      if (existing) {
        existing.qty += formatted.qty;
      } else {
        cart.items.push(formatted);
      }
    }

    await cart.save();
    return res.status(200).json({ success: true, message: "Cart synced", items: cart.items });
  } catch (err) {
    return res.status(500).json({ message: "Cart sync failed", error: err.message });
  }
};

// ─── ADD item to cart ─────────────────────────────────────────────────────────
export const addToCart = async (req, res) => {
  try {
    const item = formatItem(req.body);
    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) cart = await Cart.create({ user: req.user._id, items: [] });

    const existing = cart.items.find(
      (i) => i.productId === item.productId && i.selectedSize === item.selectedSize
    );
    if (existing) {
      existing.qty += 1;
    } else {
      cart.items.push(item);
    }

    await cart.save();
    return res.status(200).json({ success: true, items: cart.items });
  } catch (err) {
    return res.status(500).json({ message: "Failed to add to cart", error: err.message });
  }
};

// ─── REMOVE / decrement item ──────────────────────────────────────────────────
export const removeFromCart = async (req, res) => {
  try {
    const { productId, selectedSize = "" } = req.body;
    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    const idx = cart.items.findIndex(
      (i) => i.productId === productId && i.selectedSize === selectedSize
    );
    if (idx === -1) return res.status(404).json({ message: "Item not in cart" });

    if (cart.items[idx].qty <= 1) {
      cart.items.splice(idx, 1);
    } else {
      cart.items[idx].qty -= 1;
    }

    await cart.save();
    return res.status(200).json({ success: true, items: cart.items });
  } catch (err) {
    return res.status(500).json({ message: "Failed to remove from cart", error: err.message });
  }
};

// ─── CLEAR cart (after order placed) ─────────────────────────────────────────
export const clearCart = async (req, res) => {
  try {
    await Cart.findOneAndUpdate({ user: req.user._id }, { items: [] });
    return res.status(200).json({ success: true, message: "Cart cleared" });
  } catch (err) {
    return res.status(500).json({ message: "Failed to clear cart", error: err.message });
  }
};

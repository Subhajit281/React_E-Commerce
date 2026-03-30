const BACKEND_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

// ─── Persist to localStorage ──────────────────────────────────────────────────
const saveToLocal = (cart) => localStorage.setItem("cart", JSON.stringify(cart));

// ─── Load from localStorage on boot ──────────────────────────────────────────
const getInitialCart = () => {
  try {
    const stored = localStorage.getItem("cart");
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

// ─── Fire-and-forget backend cart calls (won't crash app if fails) ────────────
const syncAddToBackend = (item) => {
  const token = localStorage.getItem("token");
  if (!token) return; // guest — skip backend
  fetch(`${BACKEND_URL}/api/cart/add`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify(item),
  }).catch(() => {});
};

const syncRemoveFromBackend = (item) => {
  const token = localStorage.getItem("token");
  if (!token) return;
  fetch(`${BACKEND_URL}/api/cart/remove`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify({ productId: String(item.id || item.productId), selectedSize: item.selectedSize || "" }),
  }).catch(() => {});
};

const syncClearFromBackend = () => {
  const token = localStorage.getItem("token");
  if (!token) return;
  fetch(`${BACKEND_URL}/api/cart/clear`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
  }).catch(() => {});
};

// ─── Cart Reducer — state is always a flat ARRAY ──────────────────────────────
const handleCart = (state = getInitialCart(), action) => {
  let updatedCart;
  const product = action.payload;

  switch (action.type) {

    // ── Add item (or increment qty) ───────────────────────────────────────────
    case "ADDITEM": {
      const exist = state.find(
        (x) => x.id === product.id && (x.selectedSize || "") === (product.selectedSize || "")
      );
      if (exist) {
        updatedCart = state.map((x) =>
          x.id === product.id && (x.selectedSize || "") === (product.selectedSize || "")
            ? { ...x, qty: x.qty + 1 }
            : x
        );
      } else {
        updatedCart = [...state, { ...product, qty: 1 }];
      }
      saveToLocal(updatedCart);
      syncAddToBackend({ ...product, productId: String(product.id), qty: 1 });
      return updatedCart;
    }

    // ── Remove item (or decrement qty) ────────────────────────────────────────
    case "DELITEM": {
      const exist2 = state.find(
        (x) => x.id === product.id && (x.selectedSize || "") === (product.selectedSize || "")
      );
      if (!exist2) return state;
      if (exist2.qty === 1) {
        updatedCart = state.filter(
          (x) =>
            !(x.id === product.id && (x.selectedSize || "") === (product.selectedSize || ""))
        );
      } else {
        updatedCart = state.map((x) =>
          x.id === product.id && (x.selectedSize || "") === (product.selectedSize || "")
            ? { ...x, qty: x.qty - 1 }
            : x
        );
      }
      saveToLocal(updatedCart);
      syncRemoveFromBackend(product);
      return updatedCart;
    }

    // ── After login: replace local cart with merged DB cart ───────────────────
    case "SYNC_CART_FROM_DB": {
      const dbItems = (action.payload || []).map((item) => ({
        id:           item.productId,
        productId:    item.productId,
        title:        item.title,
        price:        item.price,
        image:        item.image,
        category:     item.category,
        selectedSize: item.selectedSize || "",
        qty:          item.qty,
      }));
      saveToLocal(dbItems);
      return dbItems;
    }

    // ── Clear full cart after order placed ────────────────────────────────────
    case "CLEAR_CART": {
      localStorage.removeItem("cart");
      syncClearFromBackend();
      return [];
    }

    default:
      return state;
  }
};

export default handleCart;
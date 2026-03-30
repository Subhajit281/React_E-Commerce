// Add item to Cart
export const addCart = (product) => ({ type: "ADDITEM", payload: product });

// Remove / decrement item from Cart
export const delCart = (product) => ({ type: "DELITEM", payload: product });

// Clear entire cart (after order placed)
export const clearCart = () => ({ type: "CLEAR_CART" });

// Sync cart from DB after login
export const syncCartFromDB = (items) => ({ type: "SYNC_CART_FROM_DB", payload: items });

// Buy Now — sends product directly to checkout, NEVER touches cart
export const buyNow = (product) => ({ type: "BUYNOW", payload: product });

// Clear Buy Now after order is placed
export const clearBuyNow = () => ({ type: "CLEAR_BUYNOW" });
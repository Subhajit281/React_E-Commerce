import { useEffect } from "react";
import { useDispatch } from "react-redux";

const BACKEND_URL = "http://localhost:5000";

/**
 * useCartSync — call this once after login succeeds.
 * It sends the current localStorage cart to the backend,
 * which merges it with the user's existing DB cart,
 * then updates Redux + localStorage with the merged result.
 */
const useCartSync = () => {
  const dispatch = useDispatch();

  const syncCart = async (token) => {
    try {
      const localCart = JSON.parse(localStorage.getItem("cart") || "[]");

      const res = await fetch(`${BACKEND_URL}/api/cart/sync`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ localItems: localCart }),
      });

      const data = await res.json();

      if (data.success) {
        // Replace Redux cart with merged DB cart
        dispatch({ type: "SYNC_CART_FROM_DB", payload: data.items });
        console.log("✅ Cart synced to DB:", data.items.length, "items");
      }
    } catch (err) {
      console.error("Cart sync failed:", err.message);
      // Non-critical — localStorage cart still works as fallback
    }
  };

  return { syncCart };
};

export default useCartSync;

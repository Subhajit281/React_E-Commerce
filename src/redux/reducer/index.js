import { combineReducers } from "redux";
import handleCart from "./handleCart";

// BuyNow reducer — completely separate from cart, never persisted to localStorage
const handleBuyNow = (state = null, action) => {
  switch (action.type) {
    case "BUYNOW":       return { ...action.payload, qty: action.payload.qty || 1 };
    case "CLEAR_BUYNOW": return null;
    default:             return state;
  }
};

const rootReducers = combineReducers({
  handleCart,   // always a flat array
  handleBuyNow, // single item or null
});

export default rootReducers;
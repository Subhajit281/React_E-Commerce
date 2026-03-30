import express from "express";
import { protect } from "../middlewares/authMiddleware.js";
import {
  getCart,
  syncCart,
  addToCart,
  removeFromCart,
  clearCart,
} from "../controllers/cartController.js";

const router = express.Router();

// All cart routes require authentication
router.get("/",        protect, getCart);
router.post("/sync",   protect, syncCart);
router.post("/add",    protect, addToCart);
router.post("/remove", protect, removeFromCart);
router.post("/clear",  protect, clearCart);

export default router;
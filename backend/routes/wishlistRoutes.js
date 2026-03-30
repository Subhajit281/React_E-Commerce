import express from "express";
import { getWishlist, toggleWishlist, removeFromWishlist, clearWishlist } from "../controllers/wishlistController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/",              protect, getWishlist);
router.post("/toggle",       protect, toggleWishlist);
router.delete("/:productId", protect, removeFromWishlist);
router.delete("/",           protect, clearWishlist);

export default router;

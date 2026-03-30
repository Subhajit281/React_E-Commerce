import express from "express";
import { createOrder, verifyPayment, placeCodOrder, getMyOrders } from "../controllers/paymentController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/create-order", createOrder);
router.post("/verify",       verifyPayment);
router.post("/cod-order",    placeCodOrder);
router.get("/my-orders",     protect, getMyOrders); // ✅ NEW — orders history

export default router;
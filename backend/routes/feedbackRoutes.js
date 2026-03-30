import express from "express";
import { submitFeedback, getAllFeedback } from "../controllers/feedbackController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/",   submitFeedback);          // public
router.get("/",    protect, getAllFeedback);  // admin only

export default router;

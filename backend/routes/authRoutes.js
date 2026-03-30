import express from "express";
import {handleUserSignup,handleLogin} from "../controllers/authControllers.js";
// const {protect,restrictTo} = require("../middlewares/auth");
import { protect } from "../middlewares/authMiddleware.js";
import { getMyProfile } from "../controllers/authcontrollers.js";
import { sendOtp, verifyOtp } from "../controllers/authControllers.js";
const router = express.Router();



router.post("/send-otp", sendOtp);
router.post("/verify-otp", verifyOtp);
router.post("/signup",handleUserSignup);
router.post("/login",handleLogin);
router.get("/me", protect, getMyProfile);


export default router;

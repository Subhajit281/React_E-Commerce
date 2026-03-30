import User from "../models/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import AppError from "../utils/AppError.js";
import Otp from "../models/otp.js";
import { generateOTP } from "../utils/generateOtp.js";
import { sendOtpEmail } from "../utils/sendEmail.js";


export const sendOtp = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email required" });
    }

    // cooldown check (60 sec)
    const lastOtp = await Otp.findOne({ email }).sort({ createdAt: -1 });

    if (lastOtp) {
      const diffSeconds =
        (Date.now() - new Date(lastOtp.createdAt).getTime()) / 1000;

      if (diffSeconds < 60) {
        const remaining = Math.ceil(60 - diffSeconds);

        return res.status(429).json({
          message: `Please wait ${remaining} seconds before requesting another OTP`,
          remainingSeconds: remaining,
        });
      }
    }

    const otp = generateOTP();
    const otpHash = await bcrypt.hash(otp, 10);

    await Otp.deleteMany({ email });

    await Otp.create({
      email,
      otpHash,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000),
    });

    // ✅ FIRE AND FORGET - No await! Email sends in background
    sendOtpEmail(email, otp);

    // ✅ Respond immediately without waiting for email
    return res.status(200).json({
      message: "OTP sent to email",
      remainingSeconds: 60,
    });
  } catch (err) {
    console.log("SEND OTP ERROR:", err);
    return res.status(500).json({
      message: "OTP send failed",
      error: err.message,
    });
  }
};






export const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) return res.status(400).json({ message: "Email and OTP required" });

    const otpDoc = await Otp.findOne({ email }).sort({ createdAt: -1 });
    if (!otpDoc) return res.status(400).json({ message: "OTP not found. Send OTP again." });

    if (otpDoc.expiresAt < new Date()) {
      return res.status(400).json({ message: "OTP expired. Send OTP again." });
    }

    if (otpDoc.attempts >= 5) {
      return res.status(400).json({ message: "Too many attempts. Send OTP again." });
    }

    otpDoc.attempts += 1;
    await otpDoc.save();

    const isMatch = await bcrypt.compare(otp, otpDoc.otpHash);
    if (!isMatch) return res.status(400).json({ message: "Invalid OTP" });

    otpDoc.verified = true;
    await otpDoc.save();

    res.json({ message: "OTP verified successfully" });
  } catch (err) {
    res.status(500).json({ message: "OTP verification failed", error: err.message });
  }
};







async function handleUserSignup(req, res, next) {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // 1) Check if already registered
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // 2) Check OTP verified
    const otpDoc = await Otp.findOne({ email }).sort({ createdAt: -1 });

    if (!otpDoc) {
      return res.status(400).json({ message: "OTP not found. Please send OTP first." });
    }

    if (otpDoc.expiresAt < new Date()) {
      return res.status(400).json({ message: "OTP expired. Please send OTP again." });
    }

    if (otpDoc.verified !== true) {
      return res.status(400).json({ message: "Please verify OTP before signup" });
    }

    // 3) Hash password
    const SALT_ROUNDS = Number(process.env.BCRYPT_SALT_ROUNDS) || 10;
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    // 4) Create user (verified)
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      isEmailVerified: true,
    });

    // 5) Delete OTP after successful signup
    await Otp.deleteMany({ email });

    return res.status(201).json({
      success: true,
      message: "Account created successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (err) {
    next(err);
  }
}


async function handleLogin(req, res, next) {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return next(new AppError("Invalid Credentials", 401));

    if (user.isEmailVerified === false) {
      return res.status(403).json({ message: "Please verify your email first" });
    }

    const isMatched = await bcrypt.compare(password, user.password);
    if (!isMatched) return next(new AppError("Invalid Credentials", 401));

    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    return res.status(200).json({
      success: true,
      message: "Login Successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (err) {
    next(err);
  }
}


export const getMyProfile = async (req, res, next) => {
  try {
    return res.status(200).json({
      success: true,
      user: req.user,
    });
  } catch (err) {
    next(err);
  }
};


export {handleLogin , handleUserSignup};
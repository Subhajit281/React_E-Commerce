import User from "../models/user.js";
import AppError from "../utils/AppError.js";
import bcrypt from "bcrypt";

export const uploadProfilePic = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No file uploaded" });
    }
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { profilePic: req.file.path },
      { new: true }
    ).select("-password");

    return res.status(200).json({ success: true, message: "Profile picture updated", user: updatedUser });
  } catch (err) { next(err); }
};

export const updateProfile = async (req, res, next) => {
  try {
    const { name } = req.body;
    if (!name || name.trim().length < 2) return next(new AppError("Name must be at least 2 characters", 400));

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { name: name.trim() },
      { new: true }
    ).select("-password");

    if (!updatedUser) return next(new AppError("User not found", 404));

    res.status(200).json({ success: true, message: "Profile updated successfully", user: updatedUser });
  } catch (err) { next(err); }
};

// ─── NEW: Change Password ─────────────────────────────────────────────────────
export const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: "Both current and new password are required" });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({ message: "New password must be at least 8 characters" });
    }

    // Fetch user with password
    const user = await User.findById(req.user._id);
    if (!user) return next(new AppError("User not found", 404));

    // Verify current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: "Current password is incorrect" });
    }

    // Hash and save new password
    const SALT_ROUNDS = Number(process.env.BCRYPT_SALT_ROUNDS) || 10;
    user.password = await bcrypt.hash(newPassword, SALT_ROUNDS);
    await user.save();

    return res.status(200).json({ success: true, message: "Password changed successfully" });
  } catch (err) { next(err); }
};
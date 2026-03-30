import jwt from "jsonwebtoken";
import User from "../models/user.js";
import AppError from "../utils/AppError.js";

export const protect = async (req, res, next) => {
  try {
    let token;


    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) return next(new AppError("Not logged in", 401));

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select("-password");
    if (!user) return next(new AppError("User not found", 401));

    req.user = user;
    next();
  } catch (err) {
    next(err);
  }
};


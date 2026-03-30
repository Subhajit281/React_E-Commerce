import "./config/env.js";
import express from "express";
import connectMongoDB from "./connection.js";
import errorHandler from "./middlewares/errorHandler.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import feedbackRoutes from "./routes/feedbackRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import "./config/cloudinary.js";
import cors from "cors";

const app = express();

// middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:5173",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        return callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// preflight fix
app.options(/.*/, cors());

// Connection
connectMongoDB(process.env.MONGO_URL)
  .then(() => console.log("MongoDB Connected Successfully"))
  .catch((err) => console.log(err));

app.get("/", (req, res) => {
  res.send("Backend is working ✅");
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/feedback", feedbackRoutes);
app.use("/api/cart",     cartRoutes);
app.use("/api/products", productRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});
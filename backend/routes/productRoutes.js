import express from "express";
import {
  getAllProducts,
  getProductById,
  getProductsByCategory,
  getCategories,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/productController.js";

const router = express.Router();

// Public routes
router.get("/",                        getAllProducts);
router.get("/categories",              getCategories);
router.get("/category/:category",      getProductsByCategory);
router.get("/:id",                     getProductById);

// Admin routes (add protect + isAdmin middleware later)
router.post("/",       createProduct);
router.put("/:id",     updateProduct);
router.delete("/:id",  deleteProduct);

export default router;
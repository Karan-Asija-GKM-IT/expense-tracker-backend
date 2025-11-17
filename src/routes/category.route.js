import express from "express";
import { getAllCategories } from "../controllers/category.controller.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

// Protected because only logged-in users should fetch categories
router.get("/", protect, getAllCategories);

export default router;

import express from "express";
import { protect } from "../middleware/auth.js";
import { getDashboardData } from "../controllers/dashboard.controller.js";

const router = express.Router();

router.get("/", protectRoutes, getDashboardData);

export default router;

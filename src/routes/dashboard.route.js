import express from "express";
import { getDashboardData } from "../controllers/dashboard.controller.js";
import { protectRoutes } from "../middlewares/auth.js";

const router = express.Router();

router.get("/", protectRoutes, getDashboardData);

export default router;

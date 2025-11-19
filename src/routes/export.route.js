import express from "express";
import { protectRoutes } from "../middlewares/auth.js";
import { exportTransactions } from "../controllers/export.controller.js";

const router = express.Router();


router.get("/", protectRoutes, exportTransactions);

export default router;

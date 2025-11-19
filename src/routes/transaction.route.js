import express from "express";
import { protectRoutes } from "../middleware/auth.js";

import {
  addTransaction,
  getAllTransactions,
  getSingleTransaction,
  updateTransaction,
  deleteTransaction,
  filterTransactions
} from "../controllers/transaction.controller.js";

const router = express.Router();


router.get('/', protectRoutes, getAllTransactions)
router.get('/filter', protectRoutes, filterTransactions)
router.get('/:id', protectRoutes, getSingleTransaction)
router.post('/', protectRoutes, addTransaction);
router.put('/:id', protectRoutes, updateTransaction);
router.delete('/:id', protectRoutes, deleteTransaction);

export default router;
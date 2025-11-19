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
router.get('/filter', protect, filterTransactions)
router.get('/:id', protect, getSingleTransaction)
router.post('/', protect, addTransaction);
router.put('/:id', protect, updateTransaction);
router.delete('/:id', protect, deleteTransaction);

export default router;
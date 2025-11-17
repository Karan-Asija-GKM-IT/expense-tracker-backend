import express from "express";
import { protectRoutes } from "../middleware/auth.js";

import {
  addTransaction,
  getAllTransactions,
  getSingleTransaction,
  updateTransactionById,
  deleteTransactionById,
  filterTransactions
} from "../controllers/transaction.controller.js";

const router = express.Router();


router.get('/', protectRoutes, getAllTransactions)
router.get('/filter', protect, filterTransactions)
router.get('/:id', protect, getSingleTransaction)
router.post('/', protect, addTransaction);
router.put('/:id', protect, updateTransactionById);
router.delete('/:id', protect, deleteTransactionById);

export default router;
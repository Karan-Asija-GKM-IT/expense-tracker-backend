import express from "express";
import { protect } from "../middleware/auth.js";

import {
  addTransaction,
  getAllTransactions,
  getSingleTransaction,
  updateTransactionById,
  deleteTransactionById,
  filterTransactions
} from "../controllers/transaction.controller.js";

const router = express.Router();


router.get('/', protect, getAllTransactions)
router.get('/filter', protect, filterTransactions)
router.get('/:id', protect, getSingleTransaction)
router.post('/', protect, addTransaction);
router.put('/:id', protect, updateTransactionById);
router.delete('/:id', protect, deleteTransactionById);

export default router;
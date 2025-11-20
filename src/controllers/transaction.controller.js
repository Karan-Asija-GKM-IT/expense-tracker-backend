import {
  addSingleTransaction,
  getTransactions,
  getTransactionById,
  updateTransactionById,
  deleteTransactionById,
  filterByTransactions
} from "../services/transaction.service.js";


// ADD TRANSACTION
export const addTransaction = async (req, res) => {
  try {
    const { category_id, amount, is_income, description, date_of_transaction } = req.body;

    if (!category_id || !amount || typeof is_income !== "boolean") {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const transaction = await addSingleTransaction({
      userId: req.user.id,
      categoryId: category_id,
      amount,
      isIncome: is_income,
      description,
      date: date_of_transaction || new Date(),
    });

    return res.status(201).json(transaction);

  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: err.message || "Failed to add transaction" });
  }
};


// GET ALL TRANSACTIONS
export const getAllTransactions = async (req, res) => {
  try {
    const queryUserId = req.query.userId;
    const userIdToUse =
      queryUserId && String(queryUserId) === String(req.user.id)
        ? queryUserId
        : req.user.id;

    const transactions = await getTransactions(userIdToUse);
    return res.status(200).json(transactions);

  } catch (err) {
    return res.status(500).json({ message: err.message || "Failed to fetch transactions" });
  }
};


// GET SINGLE TRANSACTION
export const getSingleTransaction = async (req, res) => {
  try {
    const transaction = await getTransactionById(req.params.id, req.user.id);

    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    return res.status(200).json(transaction);

  } catch (err) {
    return res.status(500).json({ message: err.message || "Failed to fetch transaction" });
  }
};


// UPDATE TRANSACTION
export const updateTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    const { category_id, amount, is_income, description, date_of_transaction } = req.body;

    const updated = await updateTransactionById(id, req.user.id, {
      categoryId: category_id,
      amount,
      isIncome: is_income,
      description,
      date: date_of_transaction
    });

    if (!updated) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    return res.status(200).json(updated);

  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: err.message || "Failed to update transaction" });
  }
};


// DELETE TRANSACTION
export const deleteTransaction = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await deleteTransactionById(id, req.user.id);

    if (!deleted) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    return res.status(200).json({ message: "Transaction deleted successfully" });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: err.message || "Failed to delete transaction" });
  }
};


// FILTER TRANSACTIONS
export const filterTransactions = async (req, res) => {
  try {
    const userId = req.user.id;
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      return res.status(400).json({
        message: "startDate and endDate are required"
      });
    }

    const transactions = await filterByTransactions(userId, startDate, endDate);

    return res.status(200).json({
      count: transactions.length,
      transactions
    });

  } catch (error) {
    console.error("Error filtering transactions:", error);
    return res.status(500).json({ message: error.message || "Server error" });
  }
};

import {
  createTransactionService,
  getTransactionsService,
  getTransactionByIdService,
  updateTransactionService,
  deleteTransactionService,
  filterTransactionsService
} from "../services/transaction.service.js";



export const addTransaction = async (req, res) => {
  try {
    const { category_id, amount, is_income, description, date_of_transaction } = req.body;

    if (!category_id || !amount || typeof is_income !== "boolean") {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const transaction = await createTransactionService({
      userId: req.user.id,
      categoryId: category_id,
      amount: amount,
      isIncome: is_income,
      description: description,
      date: date_of_transaction || new Date(),
    });

    res.status(201).json(transaction);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to add transaction" });
  }
};


export const getAllTransactions = async (req, res) => {
  try {
    const transactions = await getTransactionsService(req.user.id);
    res.json(transactions);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch transactions" });
  }
};

export const getSingleTransaction = async (req, res) => {
  try {
    const transaction = await getTransactionByIdService(req.params.id, req.user.id);

    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    res.json(transaction);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch transaction" });
  }
};



export const updateTransactionById = async (req, res) => {
  try {
    const { id } = req.params;

    const { category_id, amount, is_income, description, date_of_transaction } = req.body;

    const updated = await updateTransactionService(id, req.user.id, {
      categoryId: category_id,
      amount,
      isIncome: is_income,
      description,
      date: date_of_transaction
    });

    if (!updated) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update transaction" });
  }
};

export const deleteTransactionById = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await deleteTransactionService(id, req.user.id);

    if (!deleted) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    res.json({ message: "Transaction deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to delete transaction" });
  }
};

export const filterTransactions = async (req, res) => {
  try {
    const userId = req.user.id;
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      return res.status(400).json({
        message: "startDate and endDate are required"
      });
    }

    const transactions = await filterTransactionsService(
      userId,
      startDate,
      endDate
    );

    res.status(200).json({
      count: transactions.length,
      transactions
    });

  } catch (error) {
    console.error("Error filtering transactions:", error);
    res.status(500).json({ message: "Server error" });
  }
};

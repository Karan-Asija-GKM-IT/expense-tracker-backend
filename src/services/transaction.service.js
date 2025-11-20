import { pool } from "../db/db.js";
import { handleServiceError } from "../helpers/handleServiceError.js";

export const addSingleTransaction = async (data) => {
  try {
    const { userId, categoryId, amount, isIncome, description, date } = data;

    const result = await pool.query(
      'INSERT INTO transactions (user_id, category_id, amount, is_income, description, date_of_transaction) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [userId, categoryId, amount, isIncome, description, date]
    );

    return result.rows[0];
  } catch (err) {
    handleServiceError(err, "Failed to add transaction");
  }
};

export const getTransactions = async (userId) => {
  try {
    const result = await pool.query(
      'SELECT * FROM transactions WHERE user_id = $1 ORDER BY date_of_transaction DESC',
      [userId]
    );

    return result.rows;
  } catch (err) {
    handleServiceError(err, "Failed to fetch transactions");
  }
};

export const getTransactionById = async (id, userId) => {
  try {
    const result = await pool.query(
      'SELECT * FROM transactions WHERE id = $1 AND user_id = $2',
      [id, userId]
    );

    return result.rows[0];
  } catch (err) {
    handleServiceError(err, "Failed to fetch transaction");
  }
};

export const updateTransactionById = async (id, userId, data) => {
  try {
    const { categoryId, amount, isIncome, description, date } = data;

    const result = await pool.query(
      `UPDATE transactions 
       SET category_id = $1,
           amount = $2,
           is_income = $3,
           description = $4,
           date_of_transaction = $5
       WHERE id = $6 AND user_id = $7
       RETURNING *`,
      [categoryId, amount, isIncome, description, date, id, userId]
    );

    return result.rows[0];
  } catch (err) {
    handleServiceError(err, "Failed to update transaction");
  }
};

export const deleteTransactionById = async (id, userId) => {
  try {
    const result = await pool.query(
      `DELETE FROM transactions 
       WHERE id = $1 AND user_id = $2
       RETURNING *`,
      [id, userId]
    );

    return result.rows[0];
  } catch (err) {
    handleServiceError(err, "Failed to delete transaction");
  }
};

export const filterByTransactions = async (userId, startDate, endDate) => {
  try {
    const query =
      "SELECT t.id, t.date_of_transaction, t.amount, t.is_income, t.description, c.name AS category_name FROM transactions t JOIN categories c ON t.category_id = c.id WHERE t.user_id = $1 AND t.date_of_transaction BETWEEN $2 AND $3 ORDER BY t.date_of_transaction ASC;";

    const result = await pool.query(query, [userId, startDate, endDate]);

    return result.rows;
  } catch (err) {
    handleServiceError(err, "Failed to filter transactions");
  }
};

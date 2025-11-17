import { pool } from "../db/db.js";

export const getMonthlyIncome = async (userId) => {
  const query = "SELECT COALESCE(SUM(amount), 0) AS total FROM transactions WHERE user_id=$1 AND is_income=true  AND DATE_TRUNC('month', date_of_transaction) = DATE_TRUNC('month', CURRENT_DATE)";

  const result = await pool.query(query, [userId]);
  return result.rows[0].total || 0;
};

export const getMonthlyExpense = async (userId) => {
  const query = "SELECT COALESCE(SUM(amount), 0) AS total FROM transactions  WHERE user_id=$1 AND is_income=false AND DATE_TRUNC('month', date_of_transaction) = DATE_TRUNC('month', CURRENT_DATE)";

  const result = await pool.query(query, [userId]);
  return result.rows[0].total || 0;
};

export const getPreviousMonthExpense = async (userId) => {
  const query = "SELECT COALESCE(SUM(amount), 0) AS total FROM transactions WHERE user_id=$1 AND is_income=false AND DATE_TRUNC('month', date_of_transaction) = DATE_TRUNC('month', CURRENT_DATE - INTERVAL '1 month')";

  const result = await pool.query(query, [userId]);
  return result.rows[0].total || 0;
};

export const getRecentTransactions = async (userId) => {
  const query = 'SELECT * FROM transactions WHERE user_id=$1 ORDER BY date_of_transaction DESC LIMIT 5';

  const result = await pool.query(query, [userId]);
  return result.rows;
};

import { pool } from "../db/db.js";
import { Parser } from "json2csv"; 
import { handleServiceError } from "../helpers/handleServiceError.js";

export const exportTransactionsCSV = async (userId, month, year) => {
  try {
    const query = `
      SELECT t.date_of_transaction, c.name AS category_name, t.amount, t.is_income, t.description 
      FROM transactions t 
      JOIN categories c ON t.category_id = c.id 
      WHERE t.user_id = $1 
      AND EXTRACT(MONTH FROM t.date_of_transaction) = $2 
      AND EXTRACT(YEAR FROM t.date_of_transaction) = $3 
      ORDER BY t.date_of_transaction ASC
    `;

    const result = await pool.query(query, [userId, month, year]);
    const transactions = result.rows;

    if (transactions.length === 0) return null;

    const fields = ["date_of_transaction", "category_name", "amount", "is_income", "description"];
    const json2csvParser = new Parser({ fields });
    const csv = json2csvParser.parse(transactions);

    return csv;

  } catch (err) {
    handleServiceError(err, "Failed to export transactions");
  }
};

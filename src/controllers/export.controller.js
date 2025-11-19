import { exportTransactionsCSV } from "../services/export.service.js";

export const exportTransactions = async (req, res) => {
  try {
    const userId = req.user.id;
    const { month, year } = req.query;

    if (!month || !year) {
      return res.status(400).json({ message: "Month and year are required" });
    }

    const csv = await exportTransactionsCSV(userId, parseInt(month), parseInt(year));

    if (!csv) {
      return res.status(404).json({ message: "No transactions found for this month" });
    }

    // Set headers for CSV download
    res.header("Content-Type", "text/csv");
    res.attachment(`transactions_${year}_${month}.csv`);
    res.send(csv);
  } catch (error) {
    console.error("Export CSV Error:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

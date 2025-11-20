import {
  getMonthlyIncome,
  getMonthlyExpense,
  getPreviousMonthExpense,
  getRecentTransactions
} from "../services/dashboard.service.js";

export const getDashboardData = async (req, res) => {
  try {
    const userId = req.user.id;

    const monthlyIncome = await getMonthlyIncome(userId);
    const monthlyExpense = await getMonthlyExpense(userId);
    const previousMonthExpense = await getPreviousMonthExpense(userId);
    const recentTransactions = await getRecentTransactions(userId);

    return res.status(200).json({
      monthlyIncome,
      monthlyExpense,
      previousMonthExpense,
      recentTransactions,
    });

  } catch (err) {
    console.error("Dashboard Error:", err);
    return res.status(500).json({ message: err.message || "Internal server error" });
  }
};

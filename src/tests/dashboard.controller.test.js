import { jest } from "@jest/globals";

// Mock service BEFORE import
await jest.unstable_mockModule("../../src/services/dashboard.service.js", () => ({
  getMonthlyIncome: jest.fn(),
  getMonthlyExpense: jest.fn(),
  getPreviousMonthExpense: jest.fn(),
  getRecentTransactions: jest.fn(),
}));

const service = await import("../../src/services/dashboard.service.js");
const { getDashboardData } = await import("../../src/controllers/dashboard.controller.js");

describe("dashboard.controller", () => {
  let req, res;

  beforeEach(() => {
    req = { user: { id: 1 } };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    };
    jest.clearAllMocks();
  });

  test("should return dashboard data", async () => {
    service.getMonthlyIncome.mockResolvedValue(500);
    service.getMonthlyExpense.mockResolvedValue(300);
    service.getPreviousMonthExpense.mockResolvedValue(200);
    service.getRecentTransactions.mockResolvedValue([{ id: 1 }]);

    await getDashboardData(req, res);

    expect(service.getMonthlyIncome).toHaveBeenCalledWith(1);
    expect(service.getMonthlyExpense).toHaveBeenCalledWith(1);
    expect(service.getPreviousMonthExpense).toHaveBeenCalledWith(1);
    expect(service.getRecentTransactions).toHaveBeenCalledWith(1);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      monthlyIncome: 500,
      monthlyExpense: 300,
      previousMonthExpense: 200,
      recentTransactions: [{ id: 1 }]
    });
  });

  test("should handle controller errors", async () => {
    service.getMonthlyIncome.mockRejectedValue(new Error("Test Err"));

    await getDashboardData(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
  });
});

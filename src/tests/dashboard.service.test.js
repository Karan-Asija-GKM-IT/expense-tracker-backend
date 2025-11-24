import { jest } from "@jest/globals";

// ----------------------
// MOCKS BEFORE IMPORT
// ----------------------
await jest.unstable_mockModule("../../src/db/db.js", () => ({
  pool: { query: jest.fn() }
}));

await jest.unstable_mockModule("../../src/helpers/handleServiceError.js", () => ({
  handleServiceError: jest.fn((err, defMsg) => {
    if (err instanceof Error && err.message) throw new Error(err.message);
    throw new Error(defMsg);
  })
}));

const { pool } = await import("../../src/db/db.js");
const { handleServiceError } = await import("../../src/helpers/handleServiceError.js");

const {
  getMonthlyIncome,
  getMonthlyExpense,
  getPreviousMonthExpense,
  getRecentTransactions
} = await import("../../src/services/dashboard.service.js");

describe("dashboard.service", () => {
  beforeEach(() => jest.clearAllMocks());

  test("getMonthlyIncome → success", async () => {
    pool.query.mockResolvedValue({ rows: [{ total: 500 }] });

    const result = await getMonthlyIncome(1);
    expect(result).toBe(500);
  });

  test("getMonthlyIncome → error", async () => {
    pool.query.mockRejectedValue(new Error("DB Fail"));

    await expect(getMonthlyIncome(1)).rejects.toThrow("DB Fail");
    expect(handleServiceError).toHaveBeenCalled();
  });

  test("getMonthlyExpense → success", async () => {
    pool.query.mockResolvedValue({ rows: [{ total: 300 }] });

    const result = await getMonthlyExpense(1);
    expect(result).toBe(300);
  });

  test("getPreviousMonthExpense → success", async () => {
    pool.query.mockResolvedValue({ rows: [{ total: 200 }] });

    const result = await getPreviousMonthExpense(1);
    expect(result).toBe(200);
  });

  test("getRecentTransactions → success", async () => {
    const rows = [{ id: 1 }];
    pool.query.mockResolvedValue({ rows });

    const result = await getRecentTransactions(1);
    expect(result).toEqual(rows);
  });
});

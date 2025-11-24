import { jest } from "@jest/globals";

// -----------------------------
// MOCKS BEFORE IMPORTING SERVICE
// -----------------------------
await jest.unstable_mockModule("../../src/db/db.js", () => ({
  pool: { query: jest.fn() },
}));

await jest.unstable_mockModule("../../src/helpers/handleServiceError.js", () => ({
  handleServiceError: jest.fn((err, defMsg) => {
    if (err instanceof Error && err.message) throw new Error(err.message);
    throw new Error(defMsg);
  }),
}));

const { pool } = await import("../../src/db/db.js");
const { handleServiceError } = await import("../../src/helpers/handleServiceError.js");
const {
  addSingleTransaction,
  getTransactions,
  getTransactionById,
  updateTransactionById,
  deleteTransactionById,
  filterByTransactions,
} = await import("../../src/services/transaction.service.js");

// -----------------------------
// TEST SUITE
// -----------------------------
describe("transaction.service", () => {
  beforeEach(() => jest.clearAllMocks());

  test("addSingleTransaction → success", async () => {
    const fakeRow = { id: 1, amount: 100 };
    pool.query.mockResolvedValue({ rows: [fakeRow] });

    const result = await addSingleTransaction({
      userId: 1,
      categoryId: 2,
      amount: 100,
      isIncome: true,
      description: "Test",
      date: "2024-01-01",
    });

    expect(result).toEqual(fakeRow);
    expect(pool.query).toHaveBeenCalled();
  });

  test("addSingleTransaction → error", async () => {
    pool.query.mockRejectedValue(new Error("DB error"));

    await expect(
      addSingleTransaction({
        userId: 1,
        categoryId: 2,
        amount: 50,
        isIncome: false,
        description: "",
        date: "2024-01-01",
      })
    ).rejects.toThrow("DB error");

    expect(handleServiceError).toHaveBeenCalled();
  });

  test("getTransactions → success", async () => {
    const rows = [{ id: 1 }];
    pool.query.mockResolvedValue({ rows });

    const result = await getTransactions(1);
    expect(result).toEqual(rows);
  });

  test("getTransactionById → success", async () => {
    const row = { id: 1 };
    pool.query.mockResolvedValue({ rows: [row] });

    const result = await getTransactionById(1, 1);
    expect(result).toEqual(row);
  });

  test("updateTransactionById → success", async () => {
    const row = { id: 1, amount: 200 };
    pool.query.mockResolvedValue({ rows: [row] });

    const result = await updateTransactionById(1, 1, {
      categoryId: 2,
      amount: 200,
      isIncome: true,
      description: "Updated",
      date: "2024-01-02",
    });

    expect(result).toEqual(row);
  });

  test("deleteTransactionById → success", async () => {
    const row = { id: 1 };
    pool.query.mockResolvedValue({ rows: [row] });

    const result = await deleteTransactionById(1, 1);
    expect(result).toEqual(row);
  });

  test("filterByTransactions → success", async () => {
    const rows = [{ id: 1 }];
    pool.query.mockResolvedValue({ rows });

    const result = await filterByTransactions(1, "2024-01-01", "2024-01-10");
    expect(result).toEqual(rows);
  });
});

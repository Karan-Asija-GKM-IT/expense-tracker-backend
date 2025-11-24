import { jest } from "@jest/globals";

// Mock services BEFORE importing controller
await jest.unstable_mockModule("../../src/services/transaction.service.js", () => ({
  addSingleTransaction: jest.fn(),
  getTransactions: jest.fn(),
  getTransactionById: jest.fn(),
  updateTransactionById: jest.fn(),
  deleteTransactionById: jest.fn(),
  filterByTransactions: jest.fn(),
}));

const service = await import("../../src/services/transaction.service.js");
const {
  addTransaction,
  getAllTransactions,
  getSingleTransaction,
  updateTransaction,
  deleteTransaction,
  filterTransactions,
} = await import("../../src/controllers/transaction.controller.js");

describe("transaction.controller", () => {
  let req, res;

  beforeEach(() => {
    req = {
      body: {},
      params: {},
      query: {},
      user: { id: 1 },
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };

    jest.clearAllMocks();
  });

  test("addTransaction → missing fields 400", async () => {
    req.body = {};
    await addTransaction(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
  });

  test("addTransaction → success", async () => {
    const fake = { id: 1, amount: 100 };
    service.addSingleTransaction.mockResolvedValue(fake);

    req.body = {
      category_id: 1,
      amount: 100,
      is_income: true,
      description: "Test",
      date_of_transaction: "2024-01-01",
    };

    await addTransaction(req, res);
    expect(res.status).toHaveBeenCalledWith(201);
  });

  test("getAllTransactions → success", async () => {
    service.getTransactions.mockResolvedValue([{ id: 1 }]);

    await getAllTransactions(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
  });

  test("getSingleTransaction → 404 not found", async () => {
    service.getTransactionById.mockResolvedValue(null);

    req.params.id = 99;
    await getSingleTransaction(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
  });

  test("getSingleTransaction → success", async () => {
    service.getTransactionById.mockResolvedValue({ id: 1 });

    req.params.id = 1;
    await getSingleTransaction(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
  });

  test("updateTransaction → not found 404", async () => {
    service.updateTransactionById.mockResolvedValue(null);

    req.params.id = 1;
    req.body = {
      category_id: 1,
      amount: 100,
      is_income: true,
    };

    await updateTransaction(req, res);
    expect(res.status).toHaveBeenCalledWith(404);
  });

  test("deleteTransaction → not found 404", async () => {
    service.deleteTransactionById.mockResolvedValue(null);

    req.params.id = 1;
    await deleteTransaction(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
  });

  test("filterTransactions → missing params 400", async () => {
    req.query = {};
    await filterTransactions(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
  });

  test("filterTransactions → success", async () => {
    service.filterByTransactions.mockResolvedValue([{ id: 1 }]);

    req.query = { startDate: "2024-01-01", endDate: "2024-01-10" };

    await filterTransactions(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
  });
});

import { jest } from "@jest/globals";
import express from "express";
import request from "supertest";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";

// Mock protectRoutes BEFORE import
await jest.unstable_mockModule("../../src/middlewares/auth.js", () => ({
  protectRoutes: jest.fn((req, res, next) => next()),
}));

// Mock controller BEFORE import
await jest.unstable_mockModule("../../src/controllers/transaction.controller.js", () => ({
  addTransaction: jest.fn((req, res) => res.status(201).json({ ok: true })),
  getAllTransactions: jest.fn((req, res) => res.status(200).json({ ok: true })),
  getSingleTransaction: jest.fn((req, res) => res.status(200).json({ ok: true })),
  updateTransaction: jest.fn((req, res) => res.status(200).json({ ok: true })),
  deleteTransaction: jest.fn((req, res) => res.status(200).json({ ok: true })),
  filterTransactions: jest.fn((req, res) => res.status(200).json({ ok: true })),
}));

const auth = await import("../../src/middlewares/auth.js");
const controller = await import("../../src/controllers/transaction.controller.js");

// Absolute file path import
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const routerPath = resolve(__dirname, "../../src/routes/transaction.route.js");
const router = (await import(`file://${routerPath}`)).default;

// Build express app
const app = express();
app.use(express.json());
app.use("/api/transactions", router);

describe("transaction.routes", () => {
  beforeEach(() => jest.clearAllMocks());

  test("GET / → calls protectRoutes + getAllTransactions", async () => {
    await request(app).get("/api/transactions");
    expect(auth.protectRoutes).toHaveBeenCalled();
    expect(controller.getAllTransactions).toHaveBeenCalled();
  });

  test("GET /filter → filterTransactions called", async () => {
    await request(app).get("/api/transactions/filter");
    expect(controller.filterTransactions).toHaveBeenCalled();
  });

  test("GET /:id → getSingleTransaction called", async () => {
    await request(app).get("/api/transactions/1");
    expect(controller.getSingleTransaction).toHaveBeenCalled();
  });

  test("POST / → addTransaction called", async () => {
    await request(app).post("/api/transactions").send({});
    expect(controller.addTransaction).toHaveBeenCalled();
  });

  test("PUT /:id → updateTransaction called", async () => {
    await request(app).put("/api/transactions/1").send({});
    expect(controller.updateTransaction).toHaveBeenCalled();
  });

  test("DELETE /:id → deleteTransaction called", async () => {
    await request(app).delete("/api/transactions/1");
    expect(controller.deleteTransaction).toHaveBeenCalled();
  });
});

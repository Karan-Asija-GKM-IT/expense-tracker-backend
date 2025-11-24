import { jest } from "@jest/globals";
import express from "express";
import request from "supertest";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";

// 1. Mock middleware BEFORE import
await jest.unstable_mockModule("../../src/middlewares/auth.js", () => ({
  protectRoutes: jest.fn((req, res, next) => next()), // allow through
}));

// 2. Mock controller BEFORE import
await jest.unstable_mockModule("../../src/controllers/category.controller.js", () => ({
  getAllCategories: jest.fn((req, res) =>
    res.status(200).json({ categories: [{ id: 1, name: "Food" }] })
  ),
}));

const auth = await import("../../src/middlewares/auth.js");
const controller = await import("../../src/controllers/category.controller.js");

// 3. Load router using absolute file:// import
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const routerPath = resolve(__dirname, "../../src/routes/category.route.js");
const categoryRouter = (await import(`file://${routerPath}`)).default;

// Build express app
const app = express();
app.use(express.json());
app.use("/api/categories", categoryRouter);

describe("category.routes", () => {
  beforeEach(() => jest.clearAllMocks());

  test("GET /api/categories → calls protectRoutes + controller", async () => {
    const res = await request(app).get("/api/categories");

    expect(auth.protectRoutes).toHaveBeenCalled();
    expect(controller.getAllCategories).toHaveBeenCalled();

    expect(res.statusCode).toBe(200);
    expect(res.body.categories).toEqual([{ id: 1, name: "Food" }]);
  });
});

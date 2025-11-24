import { jest } from "@jest/globals";
import express from "express";
import request from "supertest";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";

// Mock protectRoutes BEFORE import
await jest.unstable_mockModule("../../src/middlewares/auth.js", () => ({
  protectRoutes: jest.fn((req, res, next) => next())
}));

// Mock controller BEFORE import
await jest.unstable_mockModule("../../src/controllers/dashboard.controller.js", () => ({
  getDashboardData: jest.fn((req, res) =>
    res.status(200).json({ ok: true })
  )
}));

const auth = await import("../../src/middlewares/auth.js");
const controller = await import("../../src/controllers/dashboard.controller.js");

// Resolve router path absolutely
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const routerPath = resolve(__dirname, "../../src/routes/dashboard.route.js");
const router = (await import(`file://${routerPath}`)).default;

// Build app
const app = express();
app.use("/api/dashboard", router);

describe("dashboard.routes", () => {
  beforeEach(() => jest.clearAllMocks());

  test("GET / → calls protectRoutes + getDashboardData", async () => {
    const res = await request(app).get("/api/dashboard");

    expect(auth.protectRoutes).toHaveBeenCalled();
    expect(controller.getDashboardData).toHaveBeenCalled();
    expect(res.statusCode).toBe(200);
  });
});

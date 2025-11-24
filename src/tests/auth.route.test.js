import { jest } from "@jest/globals";
import express from "express";
import request from "supertest";

// Mock the controller BEFORE importing router
await jest.unstable_mockModule("../../src/controllers/auth.controller.js", () => ({
  register: jest.fn((req, res) => res.status(201).json({ ok: true })),
  login: jest.fn((req, res) => res.status(200).json({ ok: true })),
  logout: jest.fn((req, res) => res.status(200).json({ ok: true })),
}));

const controller = await import("../../src/controllers/auth.controller.js");

// Import router (ESM)
const router = (await import("../../src/routes/auth.route.js")).default;

const app = express();
app.use(express.json());
app.use("/api/auth", router);

describe("auth.routes", () => {
  beforeEach(() => jest.clearAllMocks());

  test("POST /register -> calls controller.register", async () => {
    const res = await request(app).post("/api/auth/register").send({
      username: "karan",
      email: "k@example.com",
      password: "pass",
    });

    expect(controller.register).toHaveBeenCalled();
    expect(res.statusCode).toBe(201);
    expect(res.body.ok).toBe(true);
  });

  test("POST /login -> calls controller.login", async () => {
    const res = await request(app).post("/api/auth/login").send({
      email: "k@example.com",
      password: "pass",
    });

    expect(controller.login).toHaveBeenCalled();
    expect(res.statusCode).toBe(200);
  });

  test("POST /logout -> calls controller.logout", async () => {
    const res = await request(app).post("/api/auth/logout");
    expect(controller.logout).toHaveBeenCalled();
    expect(res.statusCode).toBe(200);
  });
});

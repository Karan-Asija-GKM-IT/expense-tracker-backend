import { jest } from "@jest/globals";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";

// ------------------------------
// MOCK jsonwebtoken BEFORE import
// ------------------------------
await jest.unstable_mockModule("jsonwebtoken", () => ({
  default: {
    verify: jest.fn(),
  },
}));

const jwt = (await import("jsonwebtoken")).default;

// ------------------------------
// ⭐ LOAD middleware using absolute file:// URL
// ------------------------------
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const middlewarePath = resolve(__dirname, "../middlewares/auth.js");
const { protectRoutes } = await import(`file://${middlewarePath}`);


// ------------------------------
// TEST SUITE
// ------------------------------
describe("protectRoutes middleware", () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      cookies: {},
      headers: {},
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    next = jest.fn();
    jest.clearAllMocks();
  });

  test("should respond 401 when no token provided", async () => {
    await protectRoutes(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      message: "Not authorized, no token",
    });
  });

  test("should allow access when token in cookies is valid", async () => {
    req.cookies.token = "valid.token";
    jwt.verify.mockReturnValue({ id: 1 });

    await protectRoutes(req, res, next);

    expect(jwt.verify).toHaveBeenCalledWith("valid.token", process.env.JWT_SECRET);
    expect(req.user).toEqual({ id: 1 });
    expect(next).toHaveBeenCalled();
  });

  test("should accept Bearer token in Authorization header", async () => {
    req.headers.authorization = "Bearer xyz";
    jwt.verify.mockReturnValue({ id: 10 });

    await protectRoutes(req, res, next);

    expect(jwt.verify).toHaveBeenCalledWith("xyz", process.env.JWT_SECRET);
    expect(req.user).toEqual({ id: 10 });
    expect(next).toHaveBeenCalled();
  });

  test("should respond 401 on invalid token", async () => {
    req.cookies.token = "bad.token";
    jwt.verify.mockImplementation(() => {
      throw new Error("Bad token");
    });

    await protectRoutes(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      message: "Not authorized, token failed",
    });
  });
});

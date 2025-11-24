import { jest } from "@jest/globals";

// Mock the service BEFORE importing controller
await jest.unstable_mockModule("../../src/services/auth.service.js", () => ({
  registerUser: jest.fn(),
  loginUser: jest.fn(),
  logoutUser: jest.fn(),
}));

const authService = await import("../../src/services/auth.service.js");
const { register, login, logout, cookieOptions, clearCookieOptions } = await import(
  "../../src/controllers/auth.controller.js"
);

describe("auth.controller", () => {
  let req, res;

  beforeEach(() => {
    req = { body: {}, cookies: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
      cookie: jest.fn().mockReturnThis(),
      clearCookie: jest.fn().mockReturnThis(),
    };
    jest.clearAllMocks();
  });

  test("register -> 400 when missing fields", async () => {
    req.body = {};
    await register(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: "Please provide all required fields." });
  });

  test("register -> 201 on success", async () => {
    const fakeUser = { id: 1, username: "karan", email: "k@example.com" };
    authService.registerUser.mockResolvedValue(fakeUser);

    req.body = { username: "karan", email: "k@example.com", password: "pass" };
    await register(req, res);

    expect(authService.registerUser).toHaveBeenCalledWith("karan", "k@example.com", "pass");
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      message: "User registered successfully",
      data: fakeUser,
    });
  });

  test("login -> 400 when missing fields", async () => {
    req.body = {};
    await login(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: "Please provide all required fields." });
  });

  test("login -> 200 on success and sets cookie", async () => {
    const token = "jwt.token";
    const user = { id: 1, username: "k", email: "k@example.com" };
    authService.loginUser.mockResolvedValue({ token, user });

    req.body = { email: "k@example.com", password: "pass" };
    await login(req, res);

    expect(authService.loginUser).toHaveBeenCalledWith("k@example.com", "pass");
    expect(res.cookie).toHaveBeenCalledWith("token", token, cookieOptions);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: "Login successful",
      token,
      data: user,
    });
  });

  test("logout -> clears cookie and returns message", async () => {
    authService.logoutUser.mockResolvedValue({ message: "Logged out successfully" });

    await logout(req, res);

    expect(authService.logoutUser).toHaveBeenCalledWith(req);
    expect(res.clearCookie).toHaveBeenCalledWith("token", clearCookieOptions);
    expect(res.json).toHaveBeenCalledWith({ message: "Logged out successfully" });
  });
});

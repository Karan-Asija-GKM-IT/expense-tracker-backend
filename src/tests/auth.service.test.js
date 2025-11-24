import { jest } from "@jest/globals";

// -----------------------------
// 1) Mock DB, bcrypt, jwt, helper BEFORE importing service
// -----------------------------
await jest.unstable_mockModule("../../src/db/db.js", () => ({
  pool: { query: jest.fn() },
}));

// bcrypt & jwt are imported as defaults in your service
await jest.unstable_mockModule("bcrypt", () => ({
  default: {
    hash: jest.fn(),
    compare: jest.fn(),
  },
}));

await jest.unstable_mockModule("jsonwebtoken", () => ({
  default: {
    sign: jest.fn(),
  },
}));

// Mock the handleServiceError named export
await jest.unstable_mockModule("../../src/helpers/handleServiceError.js", () => ({
  handleServiceError: jest.fn((err, defaultMessage) => {
    // emulate real behavior: throw err.message if present, otherwise default
    if (err instanceof Error && err.message) {
      throw new Error(err.message);
    }
    throw new Error(defaultMessage);
  }),
}));

// -----------------------------
// 2) Import mocks and service AFTER mocks
// -----------------------------
const { pool } = await import("../../src/db/db.js");
const bcrypt = (await import("bcrypt")).default;
const jwt = (await import("jsonwebtoken")).default;
const { handleServiceError } = await import("../../src/helpers/handleServiceError.js");

const { registerUser, loginUser, logoutUser } = await import(
  "../../src/services/auth.service.js"
);

// -----------------------------
// 3) Tests
// -----------------------------
describe("auth.service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // registerUser tests
  test("registerUser -> rejects for invalid email format", async () => {
    await expect(
      registerUser("k", "not-an-email", "pass123")
    ).rejects.toThrow("Invalid email format");

    expect(handleServiceError).toHaveBeenCalled();
  });

  test("registerUser -> rejects if user already exists", async () => {
    pool.query.mockResolvedValueOnce({ rows: [{ id: 1, email: "k@example.com" }] });

    await expect(
      registerUser("k", "k@example.com", "pass123")
    ).rejects.toThrow("User already exists");

    expect(pool.query).toHaveBeenCalled(); // select was called
    expect(handleServiceError).toHaveBeenCalled();
  });

  test("registerUser -> success returns created user", async () => {
    const fakeUser = { id: 1, username: "karan", email: "k@example.com" };

    pool.query
      .mockResolvedValueOnce({ rows: [] }) // no existing user
      .mockResolvedValueOnce({ rows: [fakeUser] }); // insert result

    bcrypt.hash.mockResolvedValue("hashed-pass");

    const result = await registerUser("karan", "k@example.com", "pass123");

    expect(bcrypt.hash).toHaveBeenCalledWith("pass123", 10);
    expect(pool.query).toHaveBeenCalledTimes(2); // select + insert
    expect(result).toEqual(fakeUser);
  });

  // loginUser tests
  test("loginUser -> rejects when email not found", async () => {
    pool.query.mockResolvedValueOnce({ rows: [] });

    await expect(loginUser("noone@example.com", "pass")).rejects.toThrow("No user found");
    expect(handleServiceError).toHaveBeenCalled();
  });

  test("loginUser -> rejects when password mismatch", async () => {
    const dbUser = { id: 1, username: "k", email: "k@example.com", password: "hashed" };
    pool.query.mockResolvedValueOnce({ rows: [dbUser] });
    bcrypt.compare.mockResolvedValue(false);

    await expect(loginUser("k@example.com", "wrong")).rejects.toThrow("Invalid credentials");
    expect(bcrypt.compare).toHaveBeenCalled();
    expect(handleServiceError).toHaveBeenCalled();
  });

  test("loginUser -> success returns token and user", async () => {
    const dbUser = { id: 1, username: "karan", email: "k@example.com", password: "hashed" };
    pool.query.mockResolvedValueOnce({ rows: [dbUser] });
    bcrypt.compare.mockResolvedValue(true);
    jwt.sign.mockReturnValue("fake.jwt.token");

    const out = await loginUser("k@example.com", "pass123");

    expect(bcrypt.compare).toHaveBeenCalledWith("pass123", "hashed");
    expect(jwt.sign).toHaveBeenCalledWith(
      { id: dbUser.id, email: dbUser.email },
      process.env.JWT_SECRET,
      { expiresIn: "30d" }
    );
    expect(out).toEqual({
      token: "fake.jwt.token",
      user: { id: dbUser.id, username: dbUser.username, email: dbUser.email },
    });
  });

  // logoutUser test
  test("logoutUser -> returns message", async () => {
    const res = await logoutUser();
    expect(res).toEqual({ message: "Logged out successfully" });
  });
});

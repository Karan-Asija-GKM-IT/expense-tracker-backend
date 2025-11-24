import { jest } from "@jest/globals";

// Mock DB + service error handler BEFORE importing service
await jest.unstable_mockModule("../../src/db/db.js", () => ({
  pool: { query: jest.fn() },
}));

await jest.unstable_mockModule("../../src/helpers/handleServiceError.js", () => ({
  handleServiceError: jest.fn((err, defaultMsg) => {
    if (err instanceof Error && err.message) {
      throw new Error(err.message);
    }
    throw new Error(defaultMsg);
  }),
}));

const { pool } = await import("../../src/db/db.js");
const { handleServiceError } = await import("../../src/helpers/handleServiceError.js");

const { getCategories } = await import("../../src/services/category.service.js");

describe("category.service", () => {
  beforeEach(() => jest.clearAllMocks());

  test("getCategories → returns list", async () => {
    const fakeRows = [
      { id: 1, name: "Food" },
      { id: 2, name: "Travel" },
    ];

    pool.query.mockResolvedValue({ rows: fakeRows });

    const result = await getCategories();

    expect(pool.query).toHaveBeenCalledWith(
      "SELECT id, name FROM categories ORDER BY id ASC"
    );
    expect(result).toEqual(fakeRows);
  });

  test("getCategories → handles errors", async () => {
    pool.query.mockRejectedValue(new Error("DB Error"));

    await expect(getCategories()).rejects.toThrow("DB Error");
    expect(handleServiceError).toHaveBeenCalled();
  });
});

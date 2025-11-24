import { jest } from "@jest/globals";

// Mock service BEFORE import
await jest.unstable_mockModule("../../src/services/category.service.js", () => ({
  getCategories: jest.fn(),
}));

const categoryService = await import("../../src/services/category.service.js");
const { getAllCategories } = await import("../../src/controllers/category.controller.js");

describe("category.controller", () => {
  let req, res;

  beforeEach(() => {
    req = {};
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    jest.clearAllMocks();
  });

  test("getAllCategories → returns list", async () => {
    const fakeCategories = [{ id: 1, name: "Food" }];
    categoryService.getCategories.mockResolvedValue(fakeCategories);

    await getAllCategories(req, res);

    expect(categoryService.getCategories).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ categories: fakeCategories });
  });

  test("getAllCategories → handles error", async () => {
    categoryService.getCategories.mockRejectedValue(new Error("DB Error"));

    await getAllCategories(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: "Internal Server Error" });
  });
});

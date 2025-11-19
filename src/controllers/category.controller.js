import { getCategories } from "../services/category.service.js";

export const getAllCategories = async (req, res) => {
  try {
    const categories = await getCategories();
    res.status(200).json({ categories });
  } catch (error) {
    console.error("Get Categories Error:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

import { getAllCategoriesService } from "../services/category.service.jsx";

export const getAllCategories = async (req, res) => {
  try {
    const categories = await getAllCategoriesService();
    res.status(200).json({ categories });x
  } catch (error) {
    console.error("Get Categories Error:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

import express from "express";
import {
  createRecipe,
  getAllRecipes,
  getRecipeById,
  updateRecipe,
  deleteRecipe,
} from "../controller/recipeController.js";

import { authMiddleware } from "../middleware/authMiddleware.js";
import { adminMiddleware } from "../middleware/adminMiddleware.js";

const router = express.Router();

// PUBLIC
router.get("/", getAllRecipes);
router.get("/:id", getRecipeById);

// ADMIN ONLY
router.post("/", authMiddleware, adminMiddleware, createRecipe);
router.put("/:id", authMiddleware, adminMiddleware, updateRecipe);
router.delete("/:id", authMiddleware, adminMiddleware, deleteRecipe);

export default router;

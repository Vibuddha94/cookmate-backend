import express from "express";
import {
  createIngredient,
  getAllIngredients,
  updateIngredient,
  deleteIngredient,
} from "../controller/ingredientController.js";

import { authMiddleware } from "../middleware/authMiddleware.js";
import { adminMiddleware } from "../middleware/adminMiddleware.js";

const router = express.Router();

// PUBLIC
router.get("/", getAllIngredients);

// ADMIN ONLY
router.post("/", authMiddleware, adminMiddleware, createIngredient);
router.put("/:id", authMiddleware, adminMiddleware, updateIngredient);
router.delete("/:id", authMiddleware, adminMiddleware, deleteIngredient);

export default router;

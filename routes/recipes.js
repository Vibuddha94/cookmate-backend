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

import { validateRequest } from "../middleware/validateRequest.js";
import {
  createRecipeSchema,
  updateRecipeSchema,
} from "../util/validators/recipeSchemas.js";

const router = express.Router();

// PUBLIC
router.get("/", getAllRecipes);
router.get("/:id", getRecipeById);

// ADMIN ONLY
router.post(
  "/",
  authMiddleware,
  adminMiddleware,
  validateRequest(createRecipeSchema),
  createRecipe
);

router.put(
  "/:id",
  authMiddleware,
  adminMiddleware,
  validateRequest(updateRecipeSchema),
  updateRecipe
);
router.delete("/:id", authMiddleware, adminMiddleware, deleteRecipe);

export default router;

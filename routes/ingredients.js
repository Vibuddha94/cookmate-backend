import express from "express";
import {
  createIngredient,
  getAllIngredients,
  updateIngredient,
  deleteIngredient,
} from "../controller/ingredientController.js";
import { validateRequest } from "../middleware/validateRequest.js";
import {
  createIngredientSchema,
  updateIngredientSchema,
} from "../util/validators/ingredientSchemas.js";

import { authMiddleware } from "../middleware/authMiddleware.js";
import { adminMiddleware } from "../middleware/adminMiddleware.js";

const router = express.Router();

// PUBLIC
router.get("/", getAllIngredients);

// ADMIN ONLY
router.post(
  "/",
  authMiddleware,
  adminMiddleware,
  validateRequest(createIngredientSchema),
  createIngredient
);

router.put(
  "/:id",
  authMiddleware,
  adminMiddleware,
  validateRequest(updateIngredientSchema),
  updateIngredient
);
router.delete("/:id", authMiddleware, adminMiddleware, deleteIngredient);

export default router;

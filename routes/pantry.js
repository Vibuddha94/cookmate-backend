import express from "express";
import {
  addToPantry,
  getMyPantry,
  updatePantryItem,
  removePantryItem,
} from "../controller/pantryController.js";

import { authMiddleware } from "../middleware/authMiddleware.js";
import { validateRequest } from "../middleware/validateRequest.js";
import {
  addPantryItemSchema,
  updatePantryItemSchema,
} from "../util/validators/pantrySchemas.js";

const router = express.Router();

router.use(authMiddleware);

router.get("/", getMyPantry);

router.post("/", validateRequest(addPantryItemSchema), addToPantry);

router.put("/:id", validateRequest(updatePantryItemSchema), updatePantryItem);

router.delete("/:id", removePantryItem);

export default router;

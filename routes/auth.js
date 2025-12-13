import express from "express";
import { login, register } from "../controller/authController.js";
import { validateRequest } from "../middleware/validateRequest.js";
import { registerSchema, loginSchema } from "../util/validators/authSchemas.js";

const router = express.Router();

// Register
router.post("/register", validateRequest(registerSchema), register);

// Login
router.post("/login", validateRequest(loginSchema), login);

export default router;

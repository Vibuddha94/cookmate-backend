import User from "../models/User.js";
import bcrypt from "bcrypt";
import { generateToken } from "../util/jwt.js";
import AppError from "../util/AppError.js";

/**
 * ============================
 * LOGIN CONTROLLER
 * ============================
 */
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // 1. Find user
    const user = await User.findOne({ where: { email } });

    if (!user) {
      throw new AppError("Invalid email or password", 401);
    }

    // 2. Compare password
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      throw new AppError("Invalid email or password", 401);
    }

    // 3. Generate JWT
    const token = generateToken({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    // 4. Success response
    res.json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * ============================
 * REGISTER CONTROLLER
 * ============================
 */
export const register = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;

    // 1. Check duplicate email
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      throw new AppError("Email already registered", 409);
    }

    // 2. Enforce single admin rule
    if (role === "admin") {
      const adminExists = await User.findOne({ where: { role: "admin" } });

      if (adminExists) {
        throw new AppError(
          "Admin account already exists. Only one admin allowed.",
          403
        );
      }
    }

    // 3. Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4. Create user
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role || "user",
    });

    // 5. Generate JWT
    const token = generateToken({
      id: newUser.id,
      email: newUser.email,
      role: newUser.role,
    });

    // 6. Success response
    res.status(201).json({
      message: "User registered successfully",
      token,
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

import Ingredient from "../models/Ingredient.js";
import AppError from "../util/AppError.js";

/**
 * ============================
 * ADMIN: Create ingredient
 * ============================
 */
export const createIngredient = async (req, res, next) => {
  try {
    const { name, unit } = req.body;

    // Check duplicate
    const exists = await Ingredient.findOne({ where: { name } });
    if (exists) {
      throw new AppError("Ingredient already exists", 409);
    }

    const ingredient = await Ingredient.create({ name, unit });

    res.status(201).json(ingredient);
  } catch (error) {
    next(error);
  }
};

/**
 * ============================
 * PUBLIC: Get all ingredients
 * ============================
 */
export const getAllIngredients = async (req, res, next) => {
  try {
    const ingredients = await Ingredient.findAll({
      order: [["name", "ASC"]],
    });

    res.json(ingredients);
  } catch (error) {
    next(error);
  }
};

/**
 * ============================
 * ADMIN: Update ingredient
 * ============================
 */
export const updateIngredient = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, unit } = req.body;

    const ingredient = await Ingredient.findByPk(id);
    if (!ingredient) {
      throw new AppError("Ingredient not found", 404);
    }

    ingredient.name = name ?? ingredient.name;
    ingredient.unit = unit ?? ingredient.unit;

    await ingredient.save();

    res.json(ingredient);
  } catch (error) {
    next(error);
  }
};

/**
 * ============================
 * ADMIN: Delete ingredient
 * ============================
 */
export const deleteIngredient = async (req, res, next) => {
  try {
    const { id } = req.params;

    const ingredient = await Ingredient.findByPk(id);
    if (!ingredient) {
      throw new AppError("Ingredient not found", 404);
    }

    await ingredient.destroy();

    res.json({ message: "Ingredient deleted successfully" });
  } catch (error) {
    next(error);
  }
};

import Ingredient from "../models/Ingredient.js";

/**
 * ADMIN: Create ingredient
 */
export const createIngredient = async (req, res) => {
  try {
    const { name, unit } = req.body;

    if (!name || !unit) {
      return res.status(400).json({ message: "Name and unit are required" });
    }

    const exists = await Ingredient.findOne({ where: { name } });
    if (exists) {
      return res.status(409).json({ message: "Ingredient already exists" });
    }

    const ingredient = await Ingredient.create({ name, unit });

    res.status(201).json(ingredient);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * PUBLIC: Get all ingredients
 */
export const getAllIngredients = async (req, res) => {
  const ingredients = await Ingredient.findAll({
    order: [["name", "ASC"]],
  });
  res.json(ingredients);
};

/**
 * ADMIN: Update ingredient
 */
export const updateIngredient = async (req, res) => {
  const { id } = req.params;
  const { name, unit } = req.body;

  const ingredient = await Ingredient.findByPk(id);
  if (!ingredient) {
    return res.status(404).json({ message: "Ingredient not found" });
  }

  ingredient.name = name ?? ingredient.name;
  ingredient.unit = unit ?? ingredient.unit;
  await ingredient.save();

  res.json(ingredient);
};

/**
 * ADMIN: Delete ingredient
 */
export const deleteIngredient = async (req, res) => {
  const { id } = req.params;

  const ingredient = await Ingredient.findByPk(id);
  if (!ingredient) {
    return res.status(404).json({ message: "Ingredient not found" });
  }

  await ingredient.destroy();
  res.json({ message: "Ingredient deleted" });
};

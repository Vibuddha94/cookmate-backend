import UserPantry from "../models/UserPantry.js";
import Ingredient from "../models/Ingredient.js";
import AppError from "../util/AppError.js";

/**
 * USER: Add ingredient to pantry
 */
export const addToPantry = async (req, res, next) => {
  try {
    const { ingredient_id, quantity, unit } = req.body;
    const userId = req.user.id;

    // Check ingredient exists
    const ingredient = await Ingredient.findByPk(ingredient_id);
    if (!ingredient) {
      throw new AppError("Ingredient not found", 404);
    }

    // Check if already exists in pantry
    const existing = await UserPantry.findOne({
      where: { user_id: userId, ingredient_id },
    });

    if (existing) {
      existing.quantity = quantity;
      existing.unit = unit;
      await existing.save();

      return res.json({
        message: "Pantry item updated",
        pantryItem: existing,
      });
    }

    const pantryItem = await UserPantry.create({
      user_id: userId,
      ingredient_id,
      quantity,
      unit,
    });

    res.status(201).json({
      message: "Ingredient added to pantry",
      pantryItem,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * USER: Get my pantry
 */
export const getMyPantry = async (req, res, next) => {
  try {
    const pantry = await UserPantry.findAll({
      where: { user_id: req.user.id },
      include: [{ model: Ingredient }],
      order: [["createdAt", "DESC"]],
    });

    res.json(pantry);
  } catch (error) {
    next(error);
  }
};

/**
 * USER: Update pantry item
 */
export const updatePantryItem = async (req, res, next) => {
  try {
    const { id } = req.params;

    const pantryItem = await UserPantry.findByPk(id);
    if (!pantryItem || pantryItem.user_id !== req.user.id) {
      throw new AppError("Pantry item not found", 404);
    }

    pantryItem.quantity = req.body.quantity ?? pantryItem.quantity;
    pantryItem.unit = req.body.unit ?? pantryItem.unit;

    await pantryItem.save();

    res.json({
      message: "Pantry item updated",
      pantryItem,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * USER: Remove pantry item
 */
export const removePantryItem = async (req, res, next) => {
  try {
    const { id } = req.params;

    const pantryItem = await UserPantry.findByPk(id);
    if (!pantryItem || pantryItem.user_id !== req.user.id) {
      throw new AppError("Pantry item not found", 404);
    }

    await pantryItem.destroy();

    res.json({ message: "Pantry item removed" });
  } catch (error) {
    next(error);
  }
};

import sequelize from "../config/database.js";
import Recipe from "../models/Recipe.js";
import RecipeIngredient from "../models/RecipeIngredient.js";
import RecipeStep from "../models/RecipeStep.js";
import Ingredient from "../models/Ingredient.js";
import AppError from "../util/AppError.js";

/**
 * ============================
 * ADMIN: Create recipe
 * ============================
 */
export const createRecipe = async (req, res, next) => {
  const transaction = await sequelize.transaction();

  try {
    const { title, description, cook_time_minutes, ingredients, steps } =
      req.body;

    /**
     * Validate ingredient references
     */
    const ingredientIds = ingredients.map((i) => i.ingredient_id);

    const existingIngredients = await Ingredient.findAll({
      where: { id: ingredientIds },
      attributes: ["id"],
    });

    const existingIds = existingIngredients.map((i) => i.id);

    const missingIds = ingredientIds.filter((id) => !existingIds.includes(id));

    if (missingIds.length > 0) {
      throw new AppError("Some ingredients do not exist", 400, {
        missingIngredientIds: missingIds,
      });
    }

    /**
     * Create recipe
     */
    const recipe = await Recipe.create(
      {
        title,
        description,
        cook_time_minutes,
        created_by: req.user.id,
      },
      { transaction }
    );

    /**
     * Create recipe ingredients
     */
    for (const item of ingredients) {
      await RecipeIngredient.create(
        {
          recipe_id: recipe.id,
          ingredient_id: item.ingredient_id,
          quantity: item.quantity,
          unit: item.unit,
          optional_flag: item.optional_flag || false,
        },
        { transaction }
      );
    }

    /**
     * Create recipe steps
     */
    for (let i = 0; i < steps.length; i++) {
      await RecipeStep.create(
        {
          recipe_id: recipe.id,
          step_number: i + 1,
          instruction: steps[i],
        },
        { transaction }
      );
    }

    await transaction.commit();

    res.status(201).json({
      message: "Recipe created successfully",
      recipe_id: recipe.id,
    });
  } catch (error) {
    await transaction.rollback();
    next(error);
  }
};

/**
 * ============================
 * PUBLIC: Get all recipes
 * ============================
 */
export const getAllRecipes = async (req, res, next) => {
  try {
    const recipes = await Recipe.findAll({
      attributes: ["id", "title", "description", "cook_time_minutes"],
      order: [["createdAt", "DESC"]],
    });

    res.json(recipes);
  } catch (error) {
    next(error);
  }
};

/**
 * ============================
 * PUBLIC: Get recipe by ID
 * ============================
 */
export const getRecipeById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const recipe = await Recipe.findByPk(id, {
      include: [
        {
          model: RecipeIngredient,
          include: [{ model: Ingredient }],
        },
        {
          model: RecipeStep,
          separate: true,
          order: [["step_number", "ASC"]],
        },
      ],
    });

    if (!recipe) {
      throw new AppError("Recipe not found", 404);
    }

    res.json(recipe);
  } catch (error) {
    next(error);
  }
};

/**
 * ============================
 * ADMIN: Update recipe
 * ============================
 */
export const updateRecipe = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, description, cook_time_minutes } = req.body;

    const recipe = await Recipe.findByPk(id);
    if (!recipe) {
      throw new AppError("Recipe not found", 404);
    }

    recipe.title = title ?? recipe.title;
    recipe.description = description ?? recipe.description;
    recipe.cook_time_minutes = cook_time_minutes ?? recipe.cook_time_minutes;

    await recipe.save();

    res.json({ message: "Recipe updated successfully" });
  } catch (error) {
    next(error);
  }
};

/**
 * ============================
 * ADMIN: Delete recipe
 * ============================
 */
export const deleteRecipe = async (req, res, next) => {
  try {
    const { id } = req.params;

    const recipe = await Recipe.findByPk(id);
    if (!recipe) {
      throw new AppError("Recipe not found", 404);
    }

    await RecipeIngredient.destroy({ where: { recipe_id: id } });
    await RecipeStep.destroy({ where: { recipe_id: id } });
    await recipe.destroy();

    res.json({ message: "Recipe deleted successfully" });
  } catch (error) {
    next(error);
  }
};

import Recipe from "../models/Recipe.js";
import RecipeIngredient from "../models/RecipeIngredient.js";
import RecipeStep from "../models/RecipeStep.js";
import Ingredient from "../models/Ingredient.js";

/**
 * ADMIN: Create recipe with ingredients & steps
 */
export const createRecipe = async (req, res) => {
  try {
    const { title, description, cook_time_minutes, ingredients, steps } =
      req.body;

    if (!title || !cook_time_minutes || !ingredients || !steps) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // 1. Create recipe
    const recipe = await Recipe.create({
      title,
      description,
      cook_time_minutes,
      created_by: req.user.id,
    });

    // 2. Save ingredients
    for (const item of ingredients) {
      await RecipeIngredient.create({
        recipe_id: recipe.id,
        ingredient_id: item.ingredient_id,
        quantity: item.quantity,
        unit: item.unit,
        optional_flag: item.optional_flag || false,
      });
    }

    // 3. Save steps
    for (let i = 0; i < steps.length; i++) {
      await RecipeStep.create({
        recipe_id: recipe.id,
        step_number: i + 1,
        instruction: steps[i],
      });
    }

    return res.status(201).json({
      message: "Recipe created successfully",
      recipe_id: recipe.id,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * PUBLIC: Get all recipes (basic list)
 */
export const getAllRecipes = async (req, res) => {
  const recipes = await Recipe.findAll({
    attributes: ["id", "title", "description", "cook_time_minutes"],
    order: [["createdAt", "DESC"]],
  });

  res.json(recipes);
};

/**
 * PUBLIC: Get single recipe with ingredients & steps
 */
export const getRecipeById = async (req, res) => {
  const { id } = req.params;

  const recipe = await Recipe.findByPk(id, {
    include: [
      {
        model: RecipeIngredient,
        include: [{ model: Ingredient }],
      },
      {
        model: RecipeStep,
        order: [["step_number", "ASC"]],
      },
    ],
  });

  if (!recipe) {
    return res.status(404).json({ message: "Recipe not found" });
  }

  res.json(recipe);
};

/**
 * ADMIN: Update recipe (title, description, time only)
 */
export const updateRecipe = async (req, res) => {
  const { id } = req.params;
  const { title, description, cook_time_minutes } = req.body;

  const recipe = await Recipe.findByPk(id);
  if (!recipe) {
    return res.status(404).json({ message: "Recipe not found" });
  }

  recipe.title = title ?? recipe.title;
  recipe.description = description ?? recipe.description;
  recipe.cook_time_minutes = cook_time_minutes ?? recipe.cook_time_minutes;

  await recipe.save();

  res.json({ message: "Recipe updated successfully" });
};

/**
 * ADMIN: Delete recipe (cascade deletes ingredients & steps)
 */
export const deleteRecipe = async (req, res) => {
  const { id } = req.params;

  const recipe = await Recipe.findByPk(id);
  if (!recipe) {
    return res.status(404).json({ message: "Recipe not found" });
  }

  await RecipeIngredient.destroy({ where: { recipe_id: id } });
  await RecipeStep.destroy({ where: { recipe_id: id } });
  await recipe.destroy();

  res.json({ message: "Recipe deleted successfully" });
};

import express from "express";
import sequelize from "./config/database.js";

// Routes
import authRoutes from "./routes/auth.js";
import ingredientRoutes from "./routes/ingredients.js";
import recipeRoutes from "./routes/recipes.js";

// Models (IMPORTANT: import all models)
import User from "./models/User.js";
import Ingredient from "./models/Ingredient.js";
import Recipe from "./models/Recipe.js";
import RecipeIngredient from "./models/RecipeIngredient.js";
import RecipeStep from "./models/RecipeStep.js";

const app = express();
app.use(express.json());

/**
 * ============================
 * Sequelize Relationships
 * ============================
 */

// Recipe ↔ RecipeIngredient
Recipe.hasMany(RecipeIngredient, { foreignKey: "recipe_id" });
RecipeIngredient.belongsTo(Recipe, { foreignKey: "recipe_id" });

// Ingredient ↔ RecipeIngredient
Ingredient.hasMany(RecipeIngredient, { foreignKey: "ingredient_id" });
RecipeIngredient.belongsTo(Ingredient, { foreignKey: "ingredient_id" });

// Recipe ↔ RecipeStep
Recipe.hasMany(RecipeStep, { foreignKey: "recipe_id" });
RecipeStep.belongsTo(Recipe, { foreignKey: "recipe_id" });

// User ↔ Recipe (created_by)
User.hasMany(Recipe, { foreignKey: "created_by" });
Recipe.belongsTo(User, { foreignKey: "created_by" });

/**
 * ============================
 * Database Sync
 * ============================
 */
sequelize
  .sync({ alter: true })
  .then(() => console.log("Database synced successfully"))
  .catch((err) => console.error("DB sync error:", err));

/**
 * ============================
 * Routes
 * ============================
 */

// Auth Routes
app.use("/api/auth", authRoutes);

// Ingredient Routes
app.use("/api/ingredients", ingredientRoutes);

// Recipe Routes
app.use("/api/recipes", recipeRoutes);

export default app;

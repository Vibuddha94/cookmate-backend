import express from "express";
import sequelize from "./config/database.js";

// Routes
import authRoutes from "./routes/auth.js";
import ingredientRoutes from "./routes/ingredients.js";
import recipeRoutes from "./routes/recipes.js";
import pantryRoutes from "./routes/pantry.js";

// Models
import User from "./models/User.js";
import Ingredient from "./models/Ingredient.js";
import Recipe from "./models/Recipe.js";
import RecipeIngredient from "./models/RecipeIngredient.js";
import RecipeStep from "./models/RecipeStep.js";
import UserPantry from "./models/UserPantry.js";

// Error handling
import { errorMiddleware } from "./middleware/errorMiddleware.js";
import AppError from "./util/AppError.js";

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

// User ↔ Recipe
User.hasMany(Recipe, { foreignKey: "created_by" });
Recipe.belongsTo(User, { foreignKey: "created_by" });

// User ↔ Pantry
User.hasMany(UserPantry, { foreignKey: "user_id" });
UserPantry.belongsTo(User, { foreignKey: "user_id" });

// Ingredient ↔ Pantry
Ingredient.hasMany(UserPantry, { foreignKey: "ingredient_id" });
UserPantry.belongsTo(Ingredient, { foreignKey: "ingredient_id" });

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
app.use("/api/auth", authRoutes);
app.use("/api/ingredients", ingredientRoutes);
app.use("/api/recipes", recipeRoutes);
app.use("/api/pantry", pantryRoutes);

/**
 * ============================
 * 404 Handler (NO ROUTE MATCHED)
 * ============================
 */
app.use((req, res, next) => {
  next(new AppError(`Route not found: ${req.originalUrl}`, 404));
});

/**
 * ============================
 * Global Error Handler
 * ============================
 */
app.use(errorMiddleware);

export default app;

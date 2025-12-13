import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const RecipeIngredient = sequelize.define(
  "RecipeIngredient",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    recipe_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    ingredient_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    quantity: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },

    unit: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    optional_flag: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    tableName: "recipe_ingredients",
    timestamps: false,
    freezeTableName: true,
  }
);

export default RecipeIngredient;

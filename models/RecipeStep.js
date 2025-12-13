import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const RecipeStep = sequelize.define(
  "RecipeStep",
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

    step_number: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    instruction: {
      type: DataTypes.STRING(500),
      allowNull: false, // Sinhala short instruction
    },
  },
  {
    tableName: "recipe_steps",
    timestamps: false,
    freezeTableName: true,
  }
);

export default RecipeStep;

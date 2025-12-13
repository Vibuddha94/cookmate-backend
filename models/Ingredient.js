import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Ingredient = sequelize.define(
  "Ingredient",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },

    unit: {
      type: DataTypes.STRING,
      allowNull: false, // pcs, g, ml, tbsp
    },
  },
  {
    tableName: "ingredient",
    timestamps: false,
    freezeTableName: true,
  }
);

export default Ingredient;

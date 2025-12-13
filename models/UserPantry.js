import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const UserPantry = sequelize.define(
  "UserPantry",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    quantity: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    unit: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    tableName: "user_pantry",
  }
);

export default UserPantry;

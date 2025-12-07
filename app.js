import express from "express";
import sequelize from "./config/database.js";
import authRoutes from "./routes/auth.js";

import "./models/User.js";

const app = express();
app.use(express.json());

// Sync DB
sequelize
  .sync({ alter: true })
  .then(() => console.log("Database synced"))
  .catch((err) => console.log(err));

//Auth Routes
app.use("/api/auth", authRoutes);

export default app;

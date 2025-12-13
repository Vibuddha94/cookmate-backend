import AppError from "../util/AppError.js";

export const errorMiddleware = (err, req, res, next) => {
  // Default values
  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal server error";
  let details = err.details || null;

  // 🔥 Log full error (for developer)
  console.error("🔥 ERROR:", {
    name: err.name,
    message: err.message,
    stack: err.stack,
    original: err.original || null,
  });

  /**
   * ============================
   * Sequelize Errors
   * ============================
   */

  // FK constraint error
  if (err.name === "SequelizeForeignKeyConstraintError") {
    statusCode = 400;
    message = "Invalid reference to related data";
    details = {
      field: err.fields,
      value: err.value,
    };
  }

  // Unique constraint (duplicate email, ingredient name, etc.)
  if (err.name === "SequelizeUniqueConstraintError") {
    statusCode = 409;
    message = "Duplicate value not allowed";
    details = err.errors.map((e) => ({
      field: e.path,
      message: e.message,
    }));
  }

  // Validation errors (allowNull, length, etc.)
  if (err.name === "SequelizeValidationError") {
    statusCode = 400;
    message = "Validation error";
    details = err.errors.map((e) => ({
      field: e.path,
      message: e.message,
    }));
  }

  /**
   * ============================
   * JWT Errors
   * ============================
   */
  if (err.name === "JsonWebTokenError") {
    statusCode = 401;
    message = "Invalid authentication token";
  }

  if (err.name === "TokenExpiredError") {
    statusCode = 401;
    message = "Authentication token expired";
  }

  /**
   * ============================
   * Custom App Errors
   * ============================
   */
  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
    details = err.details;
  }

  /**
   * ============================
   * Final Response (CLIENT)
   * ============================
   */
  res.status(statusCode).json({
    success: false,
    message,
    ...(details && { details }),
  });
};

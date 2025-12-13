import AppError from "../util/AppError.js";

export const validateRequest = (schema) => {
  return (req, res, next) => {
    try {
      schema.parse({
        body: req.body,
        params: req.params,
        query: req.query,
      });
      next();
    } catch (error) {
      const formattedErrors = error.errors.map((err) => ({
        field: err.path.join("."),
        message: err.message,
      }));

      next(
        new AppError("Invalid request data", 400, { errors: formattedErrors })
      );
    }
  };
};

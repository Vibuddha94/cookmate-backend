import { z } from "zod";

/**
 * CREATE recipe (strict)
 */
export const createRecipeSchema = z.object({
  body: z.object({
    title: z.string().min(1, "Title is required"),
    description: z.string().optional(),
    cook_time_minutes: z.number().positive("Cook time must be positive"),
    ingredients: z
      .array(
        z.object({
          ingredient_id: z.number().int().positive(),
          quantity: z.number().positive(),
          unit: z.string().min(1),
          optional_flag: z.boolean().optional(),
        })
      )
      .min(1, "At least one ingredient is required"),
    steps: z.array(z.string().min(1)).min(1, "At least one step is required"),
  }),
});

/**
 * UPDATE recipe (partial)
 */
export const updateRecipeSchema = z.object({
  params: z.object({
    id: z.string().regex(/^\d+$/, "Invalid recipe ID"),
  }),
  body: z
    .object({
      title: z.string().min(1).optional(),
      description: z.string().optional(),
      cook_time_minutes: z.number().positive().optional(),
    })
    .refine((data) => Object.keys(data).length > 0, {
      message: "At least one field must be provided for update",
    }),
});

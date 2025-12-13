import { z } from "zod";

export const createIngredientSchema = z.object({
  body: z.object({
    name: z.string().min(1, "Ingredient name is required"),
    unit: z.string().min(1, "Unit is required"),
  }),
});

export const updateIngredientSchema = z.object({
  body: z.object({
    name: z.string().optional(),
    unit: z.string().optional(),
  }),
  params: z.object({
    id: z.string().regex(/^\d+$/, "Invalid ingredient ID"),
  }),
});

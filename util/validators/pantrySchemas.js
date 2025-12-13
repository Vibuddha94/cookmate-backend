import { z } from "zod";

export const addPantryItemSchema = z.object({
  body: z.object({
    ingredient_id: z.number().int().positive(),
    quantity: z.number().positive("Quantity must be positive"),
    unit: z.string().min(1),
  }),
});

export const updatePantryItemSchema = z.object({
  params: z.object({
    id: z.string().regex(/^\d+$/, "Invalid pantry ID"),
  }),
  body: z
    .object({
      quantity: z.number().positive().optional(),
      unit: z.string().min(1).optional(),
    })
    .refine((data) => Object.keys(data).length > 0, {
      message: "At least one field is required",
    }),
});

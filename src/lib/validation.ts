import { z } from "zod";

export const wishSchema = z.object({
  name: z.string().trim().min(2, "Please enter your name").max(80),
  wish: z.string().trim().min(2, "Write a short wish").max(160, "Keep your wish under 160 characters"),
  message: z.string().trim().max(600, "Keep your message under 600 characters").optional().or(z.literal("")),
  website: z.string().max(0).optional(),
});
export type WishInput = z.infer<typeof wishSchema>;

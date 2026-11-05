import { z } from "zod";
import { EVENTS } from "./events";

const eventIds = EVENTS.map((e) => e.id);
const phone = z.string().trim().regex(/^\+?[0-9][0-9\s-]{6,17}[0-9]$/, "Enter a valid phone number");

export const rsvpSchema = z.object({
  name: z.string().trim().min(2, "Please enter your name").max(100),
  phone,
  guests: z.coerce.number().int().min(1, "At least 1 guest").max(20, "For more than 20 guests, please contact the family"),
  events: z.array(z.string().refine((id) => eventIds.includes(id), "Unknown event")).min(1, "Choose at least one celebration"),
  message: z.string().trim().max(600, "Keep your message under 600 characters").optional().or(z.literal("")),
  website: z.string().max(0).optional(), // honeypot
});
export type RsvpInput = z.infer<typeof rsvpSchema>;

export const wishSchema = z.object({
  name: z.string().trim().min(2, "Please enter your name").max(80),
  wish: z.string().trim().min(2, "Write a short wish").max(160, "Keep your wish under 160 characters"),
  message: z.string().trim().max(600, "Keep your message under 600 characters").optional().or(z.literal("")),
  website: z.string().max(0).optional(),
});
export type WishInput = z.infer<typeof wishSchema>;

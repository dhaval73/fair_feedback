import { z } from "zod";

export const FeedbackSchema = z.object({
    title: z.string()
    .min(1, { message: "Title is required and must be a string" })
    .refine((val) => /^[a-zA-Z0-9\s]+$/.test(val), { message: "Title must not contain special characters" }),
    slug: z.string(),
    isAcceptingMessage: z.enum(['true', 'false'])
  });
import { z } from "zod";

export const usernameValidation = z
    .string()
    .min(2, "Username must be at least 2 charecters")
    .max(20, "Username must be not more then 20 charecters")
    .regex(/^[a-zA-Z0-9_]+$/, "Username must be alphanumeric")
export const signUpSchema = z.object({
    username: usernameValidation,
    email: z
        .string()
        .email({ message: "Invalid email address" }),
    password: z
        .string()
        .min(6, "Password must be at least 6 charecters"),
})
import { z } from "zod";
export const registerValidation = () => {
    return z.object({
        name: z
            .string()
            .min(5, { message: "Name should be at least 5 characters" })
            .max(50, { message: "Name should not exceed 50 characters" }),
        email: z
            .string()
            .email({ message: "Please enter a valid email address" }),
        password: z
            .string()
            .min(8, { message: "Password should be at least 8 characters" })
            .max(50, { message: "Password should not exceed 50 characters" }),
    });
};

export const loginValidation = () => {
    return z.object({
        email: z
            .string()
            .email({ message: "Please enter a valid email address" }),
        password: z
            .string()
            .min(8, { message: "Password should be at least 8 characters" })
            .max(50, { message: "Password should not exceed 50 characters" }),
    });
};
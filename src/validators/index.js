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

export const createProblemValidation = () => {
    return z.object({
        title: z.string({ required_error: "Question Title is required" }),
        description: z.string({
            required_error: "Question Description is required",
        }),
        difficulty: z.enum(["EASY", "MEDIUM", "HARD"], {
            required_error: "Question Difficulty is required",
        }),
        tags: z.array(z.string(), {
            required_error: "Tags must be an array of strings",
        }),

        userId: z.string({ required_error: "UserId is required" }),

        examples: z.any().optional(),

        constraints: z.string({
            required_error: "Question Constraint String is required",
        }),

        hints: z.string().optional(),
        editorial: z.string().optional(),

        testcases: z.any().refine((val) => val !== undefined, {
            message: "Testcases are required",
        }),
        codeSnippets: z.any().refine((val) => val !== undefined, {
            message: "Code snippets are required",
        }),
        referenceSolutions: z.any().refine((val) => val !== undefined, {
            message: "Reference solution is required",
        }),
    });
};

export const updateProblemValidation = () => {
    return z.object({
        title: z.string({ required_error: "Question Title is required" }),
        description: z.string({
            required_error: "Question Description is required",
        }),
        difficulty: z.enum(["EASY", "MEDIUM", "HARD"], {
            required_error: "Question Difficulty is required",
        }),
        tags: z.array(z.string(), {
            required_error: "Tags must be an array of strings",
        }),

        examples: z.any().optional(),

        constraints: z.string({
            required_error: "Question Constraint String is required",
        }),

        hints: z.string().optional(),
        editorial: z.string().optional(),

        testcases: z.any().refine((val) => val !== undefined, {
            message: "Testcases are required",
        }),
        codeSnippets: z.any().refine((val) => val !== undefined, {
            message: "Code snippets are required",
        }),
        referenceSolutions: z.any().refine((val) => val !== undefined, {
            message: "Reference solution is required",
        }),
    });
};

export const problemParamsValidation = () => {
    return z.object({
        id: z.string().uuid({ message: "Invalid problem ID" }),
    });
};

export const executeCodeValidation = () => {
    return z
        .object({
            source_code: z.string({
                required_error: "Source code is necessary",
            }),
            language_id: z.number({
                required_error: "Language id is necessary",
            }),
            stdin: z
                .array(
                    z.string({
                        required_error: "Stdin must be an array of strings",
                    }),
                )
                .min(1, { message: "There must be at least one stdin input" }),
            expected_outputs: z.array(
                z.string({
                    required_error: "Stdin must be an array of strings",
                }),
            ),
            problemId: z.string().uuid({ message: "Invalid problem ID" }),
        })
        .refine((data) => data.expected_outputs.length === data.stdin.length, {
            path: ["expected_outputs"],
            message: "Expected outputs must be the same length as stdin",
        });
};

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
        title: z
            .string({ required_error: "Question Title is required" })
            .min(3, "Title must be at least 3 characters"),
        description: z
            .string({
                required_error: "Question Description is required",
            })
            .min(10, "Description must be at least 10 characters"),
        difficulty: z.enum(["EASY", "MEDIUM", "HARD"], {
            required_error: "Question Difficulty is required",
        }),
        tags: z
            .array(
                z.object({
                    value: z
                        .string()
                        .trim()
                        .min(1, "Tag should have some value"),
                }),
            )
            .min(1, "At least one tag is required"),

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
        tags: z
            .array(
                z.object({
                    value: z
                        .string()
                        .trim()
                        .min(1, "Tag should have some value"),
                }),
            )
            .min(1, "At least one tag is required"),

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
            source_code: z.any({
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

export const problemInPlaylistValidation = () => {
    return z.object({
        problemIds: z
            .array(z.string(), {
                required_error: "problemIds must be an array of strings",
            })
            .min(1, { message: "At least one problemId must be provided" }),
        playListId: z.string().uuid({ message: "playlist id is invalid" }),
    });
};

export const addProblemToPlaylistValidation = () => {
    return z.object({
        problemIds: z
            .array(z.string(), {
                required_error: "problemIds must be an array of strings",
            })
            .min(1, { message: "At least one problemId must be provided" }),
        playListId: z.string().uuid({ message: "playlist id is invalid" }),
    });
};

export const playlistValidation = () => {
    return z.object({
        id: z.string().uuid({ message: "Invalid playlist ID" }),
    });
};

export const editPlaylistDetailsValidation = () => {
    return z.object({
        name: z
            .string()
            .min(3, "Playlist name should have atleast 3 characters")
            .max(15, "Playlist name should have max 15 characters"),
        description: z
            .string()
            .min(3, "Playlist description should have atleast 3 characters")
            .max(250, "Playlist description should have max 15 characters"),
        userId: z.string().uuid({ message: "invalid user id" }),
        id: z.string().uuid({ message: "invalid playlist id" }),
    });
};

export const deletePlaylistValidation = () => {
    return z.object({
        id: z.string().uuid({ message: "invalid playlist id" }),
    });
};

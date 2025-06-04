import { z } from "zod";
export const registerValidation = () => {
    return z.object({
        name: z
            .string()
            .min(3, { message: "Name should be at least 3 characters" })
            .max(50, { message: "Name should not exceed 50 characters" }),
        email: z
            .string()
            .email({ message: "Please enter a valid email address" }),
        password: z
            .string()
            .min(6, "Password must be at least 6 characters")
            .max(15, "Password must be atmost 15 characters")
            .trim(),
    });
};

export const loginValidation = () => {
    return z.object({
        email: z
            .string()
            .email({ message: "Please enter a valid email address" }),
        password: z
            .string()
            .min(6, { message: "Password should be at least 6 characters" })
            .max(15, { message: "Password should not exceed 15 characters" }),
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
        languageSolutionArray: z
            .array(z.string())
            .min(1, "At least one language should  be there"),
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
        roomId: z.string().uuid().optional(),
        playlistId: z.string().uuid().optional(),
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
        languageSolutionArray: z
            .array(z.string())
            .min(1, "At least one language should  be there"),
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
        roomId: z.string().uuid({ message: "Invalid room ID" }).optional(),
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

export const changePasswordValidation = () => {
    return z
        .object({
            currentPassword: z
                .string()
                .min(6, "Password must be at least 6 characters")
                .max(15, "Password must be at most 15 characters")
                .trim(),
            newPassword: z
                .string()
                .min(6, "Password must be at least 6 characters")
                .max(15, "Password must be at most 15 characters")
                .trim(),
            confirmPassword: z
                .string()
                .min(6, "Password must be at least 6 characters")
                .max(15, "Password must be at most 15 characters")
                .trim(),
        })
        .refine((data) => data.newPassword === data.confirmPassword, {
            message: "New password and confirm password must match",
            path: ["confirmPassword"],
        });
};

export const changeAvatarValidations = () => {
    return z.object({
        avatar: z.string().min(4, "avatar name is incorrect"),
    });
};

export const forgotPasswordValidation = () => {
    return z.object({
        email: z
            .string()
            .email({ message: "Please enter a valid email address" }),
    });
};

export const resetPasswordValidation = () => {
    return z.object({
        password: z
            .string()
            .min(6, "Password must be at least 6 characters")
            .max(15, "Password must be atmost 15 characters")
            .trim(),
    });
};

export const createRoomValiation = () => {
    return z.object({
        name: z
            .string()
            .min(3, "Room name must be at least 3 characters")
            .max(15, "Room name must be atmost 15 characters")
            .trim(),
        description: z
            .string()
            .min(6, "Room description must be at least 6 characters")
            .max(35, "Room description must be atmost 35 characters")
            .trim(),
    });
};

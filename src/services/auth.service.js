import ApiError from "../utils/api-error.js";
import ApiResponse from "../utils/api-response.js";
import { db } from "../libs/db.js";

export const registerService = async(name, email, password) => {
    console.log({ name, email, password });

    const existingUser = await db.user.findUnique({
        where: {
            email,
        },
    });
    console.log(existingUser)
    if (existingUser) return new ApiError(409, 1003);

    return new ApiResponse(201, 8001);
};

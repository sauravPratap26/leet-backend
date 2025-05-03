import ApiError from "../utils/api-error.js";
import ApiResponse from "../utils/api-response.js";

export const registerService = (name, email, password) => {
    console.log({ name, email, password });
    return new ApiError(500, 1001);
};

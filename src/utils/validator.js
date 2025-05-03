import { fromZodError } from "zod-validation-error";
import ApiError from "../utils/api-error.js";

const validate = (schema) => (req, res, next) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
        return next(
            new ApiError(403, 1002, fromZodError(result.error).details),
        );
    }
    req.body = result.data;
    next();
};

export default validate
import { fromZodError } from "zod-validation-error";
import ApiError from "../utils/api-error.js";

const validate =
    ({ schema, params, query }) =>
    (req, res, next) => {
        if (schema) {
            const result = schema.safeParse(req.body);

            if (!result.success) {
                return next(
                    new ApiError(403, 1002, fromZodError(result.error).details),
                );
            }
            req.body = result.data;
        }
        if (params) {
            const result = params.safeParse(req.params);
            if (!result.success) {
                return next(
                    new ApiError(403, 1015, fromZodError(result.error).details),
                );
            }
            req.params = result.data;
        }
        if (query) {
            const result = query.safeParse(req.query);
            if (!result.success) {
                return next(
                    new ApiError(403, 1016, fromZodError(result.error).details),
                );
            }
            req.query = result.data;
        }
        next();
    };

export default validate;

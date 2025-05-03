import { RESPONSE_ERROR_MESSAGE } from "./constant.js";

class ApiError extends Error {
    constructor(
        statusCode,
        code,
        errors = [],
        stack = "",
    ) {
        const message = RESPONSE_ERROR_MESSAGE[code] || "Unknown error";
        super(message);
        this.statusCode = statusCode;
        this.success = false;
        this.errors = errors;
        this.code =code;

        if (stack) {
            this.stack = stack;
        } else {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}

export default ApiError;

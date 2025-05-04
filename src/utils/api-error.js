import { RESPONSE_ERROR_MESSAGE } from "./constant.js";

class ApiError extends Error {
    constructor(statusCode, code, errors = [], stack = "", data = {}) {
        const message = RESPONSE_ERROR_MESSAGE[code] || "Unknown error";
        super(message);
        this.statusCode = statusCode;
        this.success = false;
        this.errors = errors;
        this.code = code;
        this.message = message;
        this.data = data;

        if (stack) {
            this.stack = stack;
        } else {
            Error.captureStackTrace(this, this.constructor);
        }
    }

    toJSON() {
        return {
            statusCode: this.statusCode,
            success: this.success,
            errors: this.errors,
            code: this.code,
            message: this.message,
            data: this.data,
        };
    }
}

export default ApiError;

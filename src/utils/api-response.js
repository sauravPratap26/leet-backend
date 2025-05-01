import { RESPONSE_SUCCESS_MESSAGE } from "./constant.js";

class ApiResponse {
    constructor(statusCode, code, data = {}) {
        this.statusCode = statusCode;
        this.message = RESPONSE_SUCCESS_MESSAGE[code];
        this.data = data;
        this.success = statusCode < 400;
    }
}

export default ApiResponse;

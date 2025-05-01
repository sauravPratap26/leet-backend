import asyncHandler from "../utils/async-handler.js";
import ApiResponse from "../utils/api-response.js";

const register = asyncHandler((req, res) => {
    res.status(200).send(new ApiResponse(200, 8001, { status: "all good" }));
});
const login = asyncHandler((req, res) => {});
const logout = asyncHandler((req, res) => {});
const get = asyncHandler((req, res) => {});

export { register, login, logout, get };

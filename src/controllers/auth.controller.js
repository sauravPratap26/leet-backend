import asyncHandler from "../utils/async-handler.js";
import { registerService } from "../services/auth.service.js";

const register = asyncHandler((req, res) => {
    const { name, email, password } = req.body;
    const registerResult = registerService(name, email, password);
    res.status(registerResult.statusCode).send(registerResult);
});
const login = asyncHandler((req, res) => {});
const logout = asyncHandler((req, res) => {});
const get = asyncHandler((req, res) => {});

export { register, login, logout, get };

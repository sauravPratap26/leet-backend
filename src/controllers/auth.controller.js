import asyncHandler from "../utils/async-handler.js";
import { loginService, registerService } from "../services/auth.service.js";

const register = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;
    const registerResult = await registerService(name, email, password);
    res.cookie(registerResult.token);
    res.status(registerResult.response.statusCode).send(
        registerResult.response,
    );
});
const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const loginResult = await loginService(email, password);
    res.cookie("jwt", loginResult.token, {
        httpOnly: true,
        sameSite: "strict",
        secure: process.env.NODE_ENV !== "dev",
        maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
    });
    res.status(loginResult.response.statusCode).send(loginResult.response);
});
const logout = asyncHandler((req, res) => {});
const get = asyncHandler((req, res) => {});

export { register, login, logout, get };

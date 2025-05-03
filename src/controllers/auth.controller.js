import asyncHandler from "../utils/async-handler.js";
import { loginService, registerService } from "../services/auth.service.js";
import { COOKIE_OPTIONS } from "../utils/constant.js";

const register = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;
    const registerResult = await registerService(name, email, password);
    res.cookie("jwtRegister", registerResult.token, COOKIE_OPTIONS);
    res.status(registerResult.response.statusCode).send(
        registerResult.response,
    );
});
const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const loginResult = await loginService(email, password);
    res.cookie("jwtLogins", loginResult.token, COOKIE_OPTIONS);
    res.status(loginResult.response.statusCode).send(loginResult.response);
});
const logout = asyncHandler((req, res) => {});
const get = asyncHandler((req, res) => {});

export { register, login, logout, get };

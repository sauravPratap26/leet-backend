import asyncHandler from "../utils/async-handler.js";
import { loginService, registerService } from "../services/auth.service.js";
import { COOKIE_OPTIONS } from "../utils/constant.js";
import ApiResponse from "../utils/api-response.js";

const register = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;
    const registerResult = await registerService(name, email, password);
    res.cookie("jwt", registerResult.token, COOKIE_OPTIONS);
    res.status(registerResult.response.statusCode).send(
        registerResult.response,
    );
});
const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const loginResult = await loginService(email, password);
    res.cookie("jwt", loginResult.token, COOKIE_OPTIONS);
    res.status(loginResult.response.statusCode).send(loginResult.response);
});
const logout = asyncHandler((req, res) => {
    res.clearCookie("jwt", COOKIE_OPTIONS);
    res.status(200).send(new ApiResponse(200, 8005));
});
const get = asyncHandler((req, res) => {
    res.status(200).send(new ApiResponse(200, 8006, { user: req.user }));
});

export { register, login, logout, get };

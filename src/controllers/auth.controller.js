import asyncHandler from "../utils/async-handler.js";
import {
    forgotPasswordService,
    loginService,
    registerService,
    resetPasswordService,
} from "../services/auth.service.js";
import { COOKIE_OPTIONS } from "../utils/constant.js";
import ApiResponse from "../utils/api-response.js";

const register = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;
    const registerResult = await registerService(
        name,
        email.toLowerCase(),
        password,
    );
    if (registerResult.token != undefined)
        res.cookie("jwt", registerResult.token, COOKIE_OPTIONS);
    res.status(registerResult.response.statusCode).send(
        registerResult.response,
    );
});
const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const loginResult = await loginService(email.toLowerCase(), password);
    if (loginResult.token != undefined)
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

const forgotPassword = asyncHandler(async (req, res) => {
    const { email } = req.body;
    const result = await forgotPasswordService(email.toLowerCase());
    res.status(result.statusCode).send(result);
});

const resetPassword = asyncHandler(async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;
    const result = await resetPasswordService(token, password);
    res.status(result.statusCode).send(result);
});
export { register, login, logout, get, forgotPassword, resetPassword };

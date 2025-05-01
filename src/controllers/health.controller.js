import asyncHandler from "../utils/async-handler.js";

export const health = asyncHandler((req, res) => {
    res.status(200).json({ health: "server is up" });
});

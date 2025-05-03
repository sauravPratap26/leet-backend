import jwt from "jsonwebtoken";
import { db } from "../libs/db.js";
import asyncHandler from "../utils/async-handler.js";
import ApiError from "../utils/api-error.js";

export const authMiddleware = asyncHandler(async (req, res, next) => {
    const token = req.cookies.jwt;

    if (!token) {
        return res.status(401).send(new ApiError(400, 1007));
    }

    let decoded;

    try {
        decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
        return res.status(401).send(new ApiError(400, 1008));
    }

    const user = await db.user.findUnique({
        where: {
            id: decoded.id,
        },
        select: {
            id: true,
            image: true,
            name: true,
            email: true,
            role: true,
        },
    });

    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }

    req.user = user;
    next();
});

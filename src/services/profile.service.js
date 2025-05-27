import { db } from "../libs/db";
import ApiError from "../utils/api-error.js";
import bcrypt from "bcryptjs";
import ApiResponse from "../utils/api-response.js";
export const changePasswordService = async (
    currentPassword,
    newPassword,
    confirmPassword,
    userId,
) => {
    const user = await db.user.findUnique({
        where: {
            userId,
        },
    });
    if (!user) return new ApiError(404, 1005);
    const oldHashedPassword = await bcrypt.hash(currentPassword, 10);
    if (user.password != oldHashedPassword) {
        return new ApiError(400, 1021);
    }
    const newPasswordHash = await bcrypt.hash(newPassword, 10);
    const updatedUser = await db.user.update({
        where: {
            userId,
        },
        data: {
            password: newPasswordHash,
        },
    });
    if (!updatedUser) {
        return new ApiError(404, 1005);
    }
    return new ApiResponse(200, 8027);
};

export const changeAvatarService = async (avatar, userId) => {
    const updatedUser = await db.user.update({
        where: {
            userId,
        },
        data: {
            avatar,
        },
    });
    if (!updatedUser) {
        return new ApiError(404, 1005);
    }
    return new ApiResponse(200, 8027, { avatar: updatedUser.avatar });
};

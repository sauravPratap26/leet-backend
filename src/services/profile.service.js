import { db } from "../libs/db.js";
import ApiError from "../utils/api-error.js";
import bcrypt from "bcryptjs";
import ApiResponse from "../utils/api-response.js";
export const changePasswordService = async (
    currentPassword,
    newPassword,
    confirmPassword,
    id,
) => {
    const user = await db.user.findUnique({
        where: {
            id,
        },
    });
    if (!user) return new ApiError(404, 1005);
    const isPasswordCorrect = await bcrypt.compare(
        currentPassword,
        user.password,
    );
    if (!isPasswordCorrect) {
        return new ApiError(400, 1021);
    }
    const newPasswordHash = await bcrypt.hash(newPassword, 10);
    const updatedUser = await db.user.update({
        where: {
            id,
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

export const changeAvatarService = async (avatar, id) => {
    const updatedUser = await db.user.update({
        where: {
            id,
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

export const updateUserTags =async(tags)=>{
    
}
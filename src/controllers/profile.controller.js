import {
    changeAvatarService,
    changePasswordService,
    updateTagsService,
} from "../services/profile.service.js";
import asyncHandler from "../utils/async-handler.js";

export const changePassword = asyncHandler(async (req, res) => {
    const { currentPassword, newPassword, confirmPassword } = req.body;
    const userId = req.user.id;
    const result = await changePasswordService(
        currentPassword,
        newPassword,
        confirmPassword,
        userId,
    );
    return res.status(result.statusCode).send(result);
});

export const changeAvatar = asyncHandler(async (req, res) => {
    const { avatar } = req.body;
    const userId = req.user.id;
    const result = await changeAvatarService(avatar, userId);
    return res.status(result.statusCode).send(result);
});

export const updateTags = asyncHandler(async (req, res) => {
    const { newTags } = req.body;
    const id = req.user.id;
    const result = await updateTagsService(newTags, id);
    return res.status(result.statusCode).send(result);
});
export const updateSocials = asyncHandler((req, res) => {});

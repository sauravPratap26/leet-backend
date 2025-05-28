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

export const updateTagsService = async (newTags, id) => {
    //TODO: tags are in array from frontend, uhmm in future I shall limit no. of tags a user can create

    try {
        await db.$transaction(
            async (tx) => {
                //getting userData
                const user = await tx.user.findUnique({
                    where: { id },
                    include: { tags: true },
                });

                if (!user) {
                    throw new ApiError(404, 1005); // User not found
                }

                //finding the tags to be disconnected from user's acc
                const tagsToRemove = user.tags.filter(
                    (tag) => !newTags.includes(tag.value),
                );

                //first remove from user's acc:
                await tx.user.update({
                    where: { id },
                    data: {
                        tags: {
                            disconnect: tagsToRemove.map((tag) => ({
                                id: tag.id,
                            })),
                        },
                    },
                });

                //now delete the tags which the user removed only if that tag isn't used in any question or by any other user up until now
                for (const tag of tagsToRemove) {
                    const usedTags = await tx.tag.findUnique({
                        where: { id: tag.id },
                        include: { users: true, problems: true },
                    });
                    if (
                        usedTags &&
                        usedTags.users.length === 0 &&
                        usedTags.problems.length === 0
                    ) {
                        await tx.tag.delete({ where: { id: tag.id } });
                    }
                }

                //now adding tags to db, but first check if that is already there or not, becuase a tag name is also unique
                const finalTags = [];
                for (const tagValue of newTags) {
                    let tag = await tx.tag.findFirst({
                        where: { value: tagValue },
                    });

                    if (!tag) {
                        tag = await tx.tag.create({
                            data: { value: tagValue },
                        });
                    }

                    finalTags.push({ id: tag.id });
                }

                //now attach those tags to the user
                await tx.user.update({
                    where: { id },
                    data: {
                        tags: {
                            set: finalTags,
                        },
                    },
                });
            },
            { timeout: 30000 },
        );

        return new ApiResponse(200, 8027, { tags: newTags });
    } catch (error) {
        console.error("Failed to update tags:", error);
        return new ApiError(500, 9001);
    }
};

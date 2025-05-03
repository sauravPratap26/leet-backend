import ApiError from "../utils/api-error.js";
import ApiResponse from "../utils/api-response.js";
import { db } from "../libs/db.js";
import mailService from "../utils/mail.js";
import { registerEmail, registerEmailSubject } from "../utils/mailTemplate.js";

export const registerService = async (name, email, password) => {
    console.log({ name, email, password });

    const existingUser = await db.user.findUnique({
        where: {
            email,
        },
    });
    if (existingUser) return new ApiError(409, 1003);

    // const mailSuccess = await mailService.send({
    //     userEmail: email,
    //     subject: registerEmailSubject,
    //     mailgenContent: registerEmail({ userName: name, token: "xyz" }),
    // });

    // return mailSuccess;
};

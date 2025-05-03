import ApiError from "../utils/api-error.js";
import ApiResponse from "../utils/api-response.js";
import { db } from "../libs/db.js";
import mailService from "../utils/mail.js";
import { registerEmail, registerEmailSubject } from "../utils/mailTemplate.js";
import bcrypt from "bcryptjs";
import { date } from "zod";
import { UserRole } from "../generated/prisma/index.js";
import jwt from "jsonwebtoken";

export const registerService = async (name, email, password) => {
    console.log({ name, email, password });

    const existingUser = await db.user.findUnique({
        where: {
            email,
        },
    });
    if (existingUser) return new ApiError(409, 1003);

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await db.user.create({
        data: {
            email,
            password: hashedPassword,
            name,
            role: UserRole.USER,
        },
    });

    const token = jwt.sign(
        {
            id: newUser.id,
        },
        process.env.JWT_SECRET,
        {
            expiresIn: "7d",
        },
    );

    return {
        token,
        response: new ApiResponse(201, 8004, {
            id: newUser.id,
            email: newUser.email,
            name: newUser.name,
            role: newUser.role,
            image: newUser.image,
        }),
    };
    // const mailSuccess = await mailService.send({
    //     userEmail: email,
    //     subject: registerEmailSubject,
    //     mailgenContent: registerEmail({ userName: name, token: "xyz" }),
    // });

    // return mailSuccess;
};

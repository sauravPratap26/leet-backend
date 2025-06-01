import ApiError from "../utils/api-error.js";
import ApiResponse from "../utils/api-response.js";
import { db } from "../libs/db.js";
import mailService from "../utils/mail.js";
import {
    forgotPasswordEmail,
    forgotPasswordSubject,
    registerEmail,
    registerEmailSubject,
} from "../utils/mailTemplate.js";
import bcrypt from "bcryptjs";
import { date } from "zod";
import { UserRole } from "../generated/prisma/index.js";
import jwt from "jsonwebtoken";
import { response } from "express";

export const registerService = async (name, email, password) => {

    const existingUser = await db.user.findUnique({
        where: {
            email,
        },
    });
    if (existingUser) return { response: new ApiError(409, 1003) };

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
        response: new ApiResponse(201, 8003, {
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

export const forgotPasswordService = async (email) => {
    const user = await db.user.findUnique({
        where: {
            email,
        },
    });
    if (!user) return new ApiResponse(400, 1005);
    const token = jwt.sign(
        {
            id: user.id,
        },
        process.env.JWT_SECRET,
        {
            expiresIn: "1d",
        },
    );
    await db.user.update({
        where: { id: user.id },
        data: { token },
    });

    const mailSuccess = await mailService.send({
        userEmail: email,
        subject: forgotPasswordSubject,
        mailgenContent: forgotPasswordEmail({
            userName: user.name,
            token,
        }),
    });
    return mailSuccess;
};

export const resetPasswordService = async (token, password) => {
    let decoded;
    try {
        decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
        return new ApiError(400, 1025);
    }
    const user = await db.user.findUnique({
        where: {
            id: decoded.id,
        },
    });
    if (!user) {
        return new ApiError(404, 1026);
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const updatedUser = await db.user.update({
        where: {
            id: user.id,
        },
        data: { password: hashedPassword, token: null },
    });

    if (!updatedUser) {
        return new ApiError(404, 1026);
    }
    return new ApiResponse(200, 8030);
};

export const loginService = async (email, password) => {
    const user = await db.user.findUnique({
        where: {
            email,
        },
        include: {
            tags: true,
        },
    });

    if (!user) return { response: new ApiError(400, 1005) };

    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordMatch) return { response: new ApiError(400, 1006) };

    const token = jwt.sign(
        {
            id: user.id,
        },
        process.env.JWT_SECRET,
        {
            expiresIn: "7d",
        },
    );
    const updatedUser = { ...user, tags: user.tags.map((tag) => tag.value) };
    return {
        token,
        response: new ApiResponse(201, 8004, {
            id: updatedUser.id,
            email: updatedUser.email,
            name: updatedUser.name,
            role: updatedUser.role,
            image: updatedUser.image,
            avatar: updatedUser.avatar,
            tags: updatedUser.tags,
        }),
    };
};

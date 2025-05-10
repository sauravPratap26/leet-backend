import { db } from "../libs/db.js";
import ApiResponse from "../utils/api-response.js";

export const getAllSubmissionService = async (userId) => {
    const submission = await db.submission.findMany({
        where: {
            userId,
        },
    });
    return new ApiResponse(200, 8013, submission);
};

export const getSubmissionsForProblemService = async (userId, problemId) => {
    const submission = await db.findMany({
        where: {
            userId,
            problemId,
        },
    });
    return new ApiResponse(200, 8014, submission);
};

export const getAllTheSubmissionsForProblemService = async (problemId) => {
    const submission = await db.submission.count({
        where: {
            problemId,
        },
    });
    return new ApiResponse(200, 8015, submission);
};

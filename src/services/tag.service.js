import { db } from "../libs/db.js";
import ApiResponse from "../utils/api-response.js";

export const getTagsService = async () => {
    const tags = await db.tag.findMany({
        include: {
            users: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    submissions: {
                        select: {
                            id: true,
                        },
                    },
                    problemSolved: {
                        select: {
                            id: true,
                        },
                    },
                },
            },
            problems: {
                include: {
                    user: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                        },
                    },
                    submission: true,
                    solvedBy: true,
                },
            },
        },
    });

    const cleanedTags = tags.map((tag) => ({
        id: tag.id,
        value: tag.value,
        users: tag.users.map((user) => ({
            id: user.id,
            name: user.name,
            email: user.email,
            submissionCount: user.submissions.length,
            problemSolvedCount: user.problemSolved.length,
        })),
        problems: tag.problems.map((problem) => ({
            id: problem.id,
            title: problem.title,
            user: problem.user,
            submissionCount: problem.submission.length,
            solvedCount: problem.solvedBy.length,
            difficulty: problem.difficulty
        })),
    }));

    return new ApiResponse(200, 8026, cleanedTags);
};

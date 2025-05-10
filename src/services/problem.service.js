import { db } from "../libs/db.js";
import {
    getJudge0LanguageId,
    pollBatchResults,
    submitBatch,
} from "../libs/judge0.libs.js";
import ApiError from "../utils/api-error.js";
import ApiResponse from "../utils/api-response.js";

const checkReferenceSolutionsTestCases = async ({
    referenceSolutions,
    testcases,
}) => {
    for (const [language, soluionCode] of Object.entries(referenceSolutions)) {
        const languageId = getJudge0LanguageId(language);
        if (!languageId) {
            return new ApiError(400, 1010, [], "", {
                language: `${language} was not found`,
            });
        }
        const submissions = testcases.map(({ input, output }) => ({
            source_code: soluionCode,
            language_id: languageId,
            stdin: input,
            expected_output: output,
        }));

        const submissionResults = await submitBatch(submissions);
        const token = submissionResults.map((res) => res.token);
        const results = await pollBatchResults(token);

        for (let i = 0; i < results.length; i++) {
            const result = results[i];
            if (result.status.id !== 3) {
                return {
                    success: false,
                    error: `Testcase ${i + 1} failed for language ${language}`,
                };
            }
        }
    }
    return { success: true, error: "" };
};

export const createProblemService = async (
    title,
    description,
    difficulty,
    tags,
    examples,
    constraints,
    testcases,
    codeSnippets,
    referenceSolutions,
    userId,
) => {
    const isReferenceSolutionCorrect = await checkReferenceSolutionsTestCases({
        referenceSolutions,
        testcases,
    });
    if (!isReferenceSolutionCorrect.success) {
        return new ApiError(400, 1011, [], "", {
            error: isReferenceSolutionCorrect.error,
        });
    }
    const newProblem = await db.problem.create({
        data: {
            title,
            description,
            difficulty,
            tags,
            examples,
            constraints,
            testcases,
            codeSnippets,
            referenceSolutions,
            userId,
        },
    });

    return new ApiResponse(200, 8007, newProblem);
};

export const getAllProlemsService = async () => {
    const problems = await db.problem.findMany();
    if (!problems) {
        return new ApiError(404, 1012);
    }
    return new ApiResponse(200, 8008, problems);
};

export const getProblemByIdService = async (problemId) => {
    const problem = await db.problem.findUnique({ where: { id: problemId } });
    if (!problem) {
        return new ApiError(404, 1013);
    }
    return new ApiResponse(200, 8009, problem);
};

export const updateProblemService = async (problemId, data) => {
    const isReferenceSolutionCorrect = await checkReferenceSolutionsTestCases({
        referenceSolutions: data.referenceSolutions,
        testcases: data.testcases,
    });
    if (!isReferenceSolutionCorrect.success) {
        return new ApiError(400, 1011, [], "", {
            error: isReferenceSolutionCorrect.error,
        });
    }
    const updatedProblem = await db.problem.update({
        where: {
            id: problemId,
            userId: data.userId,
        },
        data: {
            ...data,
        },
    });

    return new ApiResponse(200, 8010, updatedProblem);
};

export const deleteProblemService = async (problemId, userId) => {
    return await db.$transaction(async (tx) => {
        const isProblemExist = await tx.problem.findFirst({
            where: {
                id: problemId,
                userId: userId,
            },
        });

        if (!isProblemExist) {
            return new ApiError(404, 1017);
        }
        await tx.problem.delete({
            where: {
                userId,
                id: problemId,
            },
        });

        return new ApiResponse(200, 8011);
    });
};

export const getAllProblemsSolvedByUserService = async (userId) => {
    const problemsSolved = await db.problem.findMany({
        where: {
            solvedBy: {
                some: {
                    userId,
                },
            },
        },
        include: {
            solvedBy: {
                where: {
                    userId,
                },
            },
        },
    });
    return new ApiResponse(200, 8016, problemsSolved);
};

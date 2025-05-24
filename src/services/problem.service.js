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
    for (const [language, solutionCode] of Object.entries(referenceSolutions)) {
        const languageId = getJudge0LanguageId(language);
        if (!languageId) {
            return new ApiError(400, 1010, [], "", {
                language: `${language} was not found`,
            });
        }
        const submissions = testcases.map(({ input, output }) => ({
            source_code: solutionCode,
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
                    details: {
                        input: testcases[i].input,
                        expected: testcases[i].output,
                        received: result.stdout || result.stderr,
                        status: result.status.description,
                    },
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
            error: {message:isReferenceSolutionCorrect.error, details:isReferenceSolutionCorrect.details},
        });
    }

    const newProblem = await db.problem.create({
        data: {
            title,
            description,
            difficulty,
            examples,
            constraints,
            testcases,
            codeSnippets,
            referenceSolutions,
            userId,
            tags: {
                connectOrCreate: tags.map((tag) => ({
                    where: { value: tag.value },
                    create: { value: tag.value },
                })),
            },
        },
        include: {
            tags: true, // Optional: if you want to include tags in the response
        },
    });
    const formattedProblem = {
        ...newProblem,
        tags: newProblem.tags.map((tag) => ({ value: tag.value })),
    };

    return new ApiResponse(200, 8007, formattedProblem);
};

export const getAllProlemsService = async () => {
    const problems = await db.problem.findMany();
    if (!problems) {
        return new ApiError(404, 1012);
    }
    return new ApiResponse(200, 8008, problems);
};

export const getProblemByIdService = async (problemId) => {
    const problem = await db.problem.findUnique({
        where: { id: problemId },
        include: { tags: true },
    });

    if (!problem) {
        return new ApiError(404, 1013);
    }

    // Optional: format tags as [{ value: "xyz" }] for frontend
    const formattedProblem = {
        ...problem,
        tags: problem.tags.map((tag) => ({ value: tag.value })),
    };

    return new ApiResponse(200, 8009, formattedProblem);
};

export const updateProblemService = async (problemId, data) => {
    const {
        title,
        description,
        difficulty,
        tags, // [{ value: 'xyz' }, { value: 'abc' }]
        examples,
        constraints,
        testcases,
        codeSnippets,
        referenceSolutions,
        userId,
    } = data;

    const isReferenceSolutionCorrect = await checkReferenceSolutionsTestCases({
        referenceSolutions,
        testcases,
    });

    if (!isReferenceSolutionCorrect.success) {
        return new ApiError(400, 1011, [], "", {
            error: isReferenceSolutionCorrect.error,
        });
    }

    const updatedProblem = await db.problem.update({
        where: {
            id: problemId,
            userId: userId,
        },
        data: {
            title,
            description,
            difficulty,
            examples,
            constraints,
            testcases,
            codeSnippets,
            referenceSolutions,
            tags: {
                set: [],
                connectOrCreate: tags.map((tag) => ({
                    where: { value: tag.value },
                    create: { value: tag.value },
                })),
            },
        },
        include: {
            tags: true,
        },
    });

    return new ApiResponse(200, 8010, {
        ...updatedProblem,
        tags: updatedProblem.tags.map((tag) => ({ value: tag.value })),
    });
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

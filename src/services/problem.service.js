import { db } from "../libs/db.js";
import {
    getJudge0LanguageId,
    pollBatchResults,
    submitBatch,
} from "../libs/judge0.libs.js";
import ApiError from "../utils/api-error.js";
import ApiResponse from "../utils/api-response.js";
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
                return new ApiError(400, 1011, [], "", {
                    error: `Testcase ${i + 1} failed for language ${language}`,
                });
            }
        }
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

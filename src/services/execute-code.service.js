import { db } from "../libs/db.js";
import {
    getLanguageName,
    pollBatchResults,
    submitBatch,
} from "../libs/judge0.libs.js";
import ApiResponse from "../utils/api-response.js";

export const executeCodeService = async (
    userId,
    problemId,
    stdin,
    expected_output,
    source_code,
    language_id,
) => {
    const submissions = stdin.map((input) => ({
        source_code,
        language_id,
        stdin: input,
    }));
    const submitResponse = await submitBatch(submissions);
    const tokens = submitResponse.map((res) => res.token);
    const results = await pollBatchResults(tokens);
    let allPassed = true;
    const detailedResults = results.map((result, i) => {
        const stdout = result.stdout?.trim();
        const expected_output1 = expected_output[i]?.trim();
        const passed = stdout === expected_output1;
        if (!passed) allPassed = false;

        return {
            testCase: i + 1,
            passed,
            stdout,
            expected: expected_output1,
            stderr: result.stderr || null,
            compile_output: result.compile_output || null,
            status: result.status.description,
            memory: result.memory ? `${result.memory} KB` : undefined,
            time: result.time ? `${result.time} s` : undefined,
        };
    });

    const language = getLanguageName(language_id).toUpperCase();
    source_code = { [language]: source_code };

    return await db.$transaction(async (tx) => {
        const submission = await tx.submission.create({
            data: {
                userId,
                problemId,
                sourceCode: source_code,
                language: getLanguageName(language_id),
                stdin: stdin.join("\n"),
                stdout: JSON.stringify(detailedResults.map((r) => r.stdout)),
                stderr: detailedResults.some((r) => r.stderr)
                    ? JSON.stringify(detailedResults.map((r) => r.stderr))
                    : null,
                compileOutput: detailedResults.some((r) => r.compile_output)
                    ? JSON.stringify(
                          detailedResults.map((r) => r.compile_output),
                      )
                    : null,
                status: allPassed ? "ACCEPTED" : "REJECTED",
                memory: detailedResults.some((r) => r.memory)
                    ? JSON.stringify(detailedResults.map((r) => r.memory))
                    : null,
                time: detailedResults.some((r) => r.time)
                    ? JSON.stringify(detailedResults.map((r) => r.time))
                    : null,
            },
        });

        if (allPassed) {
            await tx.problemSolved.upsert({
                where: {
                    userId_problemId: {
                        userId,
                        problemId,
                    },
                },
                update: {},
                create: {
                    userId,
                    problemId,
                },
            });
        }

        //save individual test cases
        const testCaseResults = detailedResults.map((result) => ({
            submissionId: submission.id,
            testCase: result.testCase,
            passed: result.passed,
            stdout: result.stdout,
            expected: result.expected,
            stderr: result.stderr,
            compileOutput: result.compile_output,
            status: result.status.toUpperCase(),
            memory: result.memory,
            time: result.time,
        }));

        await tx.testCaseResult.createMany({
            data: testCaseResults,
        });
        const submissionWithTestCase = await tx.submission.findUnique({
            where: {
                id: submission.id,
            },
            include: {
                testCases: true,
            },
        });
        return new ApiResponse(200, 8012, {
            submission: submissionWithTestCase,
        });
    });
};

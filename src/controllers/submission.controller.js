import { db } from "../libs/db.js";
import {
    getAllSubmissionService,
    getAllTheSubmissionsForProblemService,
    getSubmissionsForProblemService,
} from "../services/submission.service.js";
import asyncHandler from "../utils/async-handler.js";

export const getAllSubmission = asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const submissionResult = await getAllSubmissionService(userId);
    return res.status(submissionResult.statusCode).send(submissionResult);
});
export const getSubmissionsForProblem = asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const problemId = req.params.id;
    const submissionResult = await getSubmissionsForProblemService(
        userId,
        problemId,
    );
    return res.status(submissionResult.statusCode).send(submissionResult);
});
export const getAllTheSubmissionsForProblem = asyncHandler(async (req, res) => {
    const problemId = req.params.id;
    const submissionCount =
        await getAllTheSubmissionsForProblemService(problemId);
    return res.status(submissionCount.statusCode).send(submissionCount);
});

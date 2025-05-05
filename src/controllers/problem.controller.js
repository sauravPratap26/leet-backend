import asyncHandler from "../utils/async-handler.js";
import { createProblemService } from "../services/problem.service.js";

export const createProblem = asyncHandler(async (req, res) => {
    const {
        title,
        description,
        difficulty,
        tags,
        examples,
        constraints,
        testcases,
        codeSnippets,
        referenceSolutions,
    } = req.body;
    const createProblemResponse = await createProblemService(
        title,
        description,
        difficulty,
        tags,
        examples,
        constraints,
        testcases,
        codeSnippets,
        referenceSolutions,
        req.user.id
    );

    return res
        .status(createProblemResponse.statusCode)
        .send(createProblemResponse);
});
export const getAllProblem = asyncHandler(async (req, res) => {});
export const getProblemById = asyncHandler(async (req, res) => {});
export const updateProblemById = asyncHandler(async (req, res) => {});
export const deleteProblem = asyncHandler(async (req, res) => {});
export const getAllProblemsSolvedByUser = asyncHandler(async (req, res) => {});

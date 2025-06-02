import asyncHandler from "../utils/async-handler.js";
import {
    createProblemService,
    deleteProblemService,
    getAllProblemsSolvedByUserService,
    getAllProlemsService,
    getCreatedProblems,
    getProblemByIdService,
    problemsOfPlaylistService,
    updateProblemService,
} from "../services/problem.service.js";
import { db } from "../libs/db.js";

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
        hints,
        editorial,
        languageSolutionArray,
    } = req.body;
    const createProblemResponse = await createProblemService(
        title,
        description,
        difficulty,
        tags,
        examples,
        constraints,
        testcases,
        languageSolutionArray,
        codeSnippets,
        referenceSolutions,
        req.user.id,
        hints,
        editorial,
    );

    return res
        .status(createProblemResponse.statusCode)
        .send(createProblemResponse);
});
export const getAllProblem = asyncHandler(async (req, res) => {
    const problems = await getAllProlemsService(req.user.id);
    return res.status(problems.statusCode).send(problems);
});
export const getProblemById = asyncHandler(async (req, res) => {
    const problem = await getProblemByIdService(req.params.id);
    return res.status(problem.statusCode).send(problem);
});
export const updateProblemById = asyncHandler(async (req, res) => {
    const {
        title,
        description,
        difficulty,
        tags,
        examples,
        constraints,
        testcases,
        languageSolutionArray,
        codeSnippets,
        referenceSolutions,
    } = req.body;
    const problem = await updateProblemService(req.params.id, {
        title,
        description,
        difficulty,
        tags,
        examples,
        constraints,
        testcases,
        languageSolutionArray,
        codeSnippets,
        referenceSolutions,
        userId: req.user.id,
    });
    return res.status(problem.statusCode).send(problem);
});
export const deleteProblem = asyncHandler(async (req, res) => {
    const deletedProblem = await deleteProblemService(
        req.params.id,
        req.user.id,
    );
    return res.status(deletedProblem.statusCode).send(deletedProblem);
});
export const getAllProblemsSolvedByUser = asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const problemsSolved = await getAllProblemsSolvedByUserService(userId);
    return res.status(problemsSolved.statusCode).send(problemsSolved);
});

export const findPlaylistProblems = asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const problems = await problemsOfPlaylistService(userId);
    return res.status(problems.statusCode).send(problems);
});
export const createdProblems = asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const problems = await getCreatedProblems(userId);
    return res.status(problems.statusCode).send(problems);
});

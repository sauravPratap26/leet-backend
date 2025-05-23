import express from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import {
    addProblemToPlaylist,
    createPlaylist,
    deletePlaylist,
    getAllListDetails,
    getPlayListDetails,
    removeProblemFromPlaylist,
} from "../controllers/playlist.controller.js";
import validate from "../utils/validator.js";
import {
    playlistValidation,
    problemInPlaylistValidation,
} from "../validators/index.js";
const router = express.Router();

router.get("/", authMiddleware, getAllListDetails);
router.get(
    "/:playlistId",
    authMiddleware,
    validate({
        params: playlistValidation(),
    }),
    getPlayListDetails,
);
router.post("/create-playlist", authMiddleware, createPlaylist);
router.post(
    "/:playlistId/add-problem",
    authMiddleware,
    validate({
        params: playlistValidation(),
        schema: problemInPlaylistValidation(),
    }),
    addProblemToPlaylist,
);
router.delete(
    "/:playlistId",
    authMiddleware,
    validate({ params: playlistValidation() }),
    deletePlaylist,
);
router.delete(
    "/:playlistId/remove-problem",
    validate({
        query: playlistValidation(),
        schema: problemInPlaylistValidation(),
    }),
    authMiddleware,
    removeProblemFromPlaylist,
);
export default router;

import express from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import {
    addProblemToPlaylist,
    createPlaylist,
    deletePlaylist,
    editPlaylistDetails,
    getAllListDetails,
    getBasicPlaylistInfo,
    getPlayListDetails,
    getRoomPlayLists,
    removeProblemFromPlaylist,
} from "../controllers/playlist.controller.js";
import validate from "../utils/validator.js";
import {
    addProblemToPlaylistValidation,
    deletePlaylistValidation,
    editPlaylistDetailsValidation,
    playlistValidation,
    problemInPlaylistValidation,
} from "../validators/index.js";
const router = express.Router();

router.get("/", authMiddleware, getAllListDetails);
router.post("/room", authMiddleware, getRoomPlayLists);
router.get(
    "/:id/:roomId",
    authMiddleware,
    validate({
        params: playlistValidation(),
    }),
    getPlayListDetails,
);
router.get(
    "/:id",
    authMiddleware,
    validate({
        params: playlistValidation(),
    }),
    getPlayListDetails,
);
router.post("/create-playlist", authMiddleware, createPlaylist);
router.post(
    "/add-problem",
    authMiddleware,
    validate({
        schema: addProblemToPlaylistValidation(),
    }),
    addProblemToPlaylist,
);
router.delete(
    "/delete",
    validate({ schema: playlistValidation() }),
    authMiddleware,
    deletePlaylist,
);
router.delete(
    "/remove-problem",
    validate({
        schema: problemInPlaylistValidation(),
    }),
    authMiddleware,
    removeProblemFromPlaylist,
);
router.post(
    "/edit-playlist",
    validate({ schema: editPlaylistDetailsValidation() }),
    authMiddleware,
    editPlaylistDetails,
);

router.get(
    "/basic-room-playlist/:id/:roomId",
    authMiddleware,
    getBasicPlaylistInfo,
);
export default router;

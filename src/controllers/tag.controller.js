
import { getTagsService } from "../services/tag.service.js";
import asyncHandler from "../utils/async-handler.js";


export const getTags = asyncHandler(async (req, res) => {
    const tags = await getTagsService();
    return res.status(tags.statusCode).send(tags);
});

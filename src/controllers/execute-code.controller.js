import { executeCodeService } from "../services/execute-code.service.js";
import asyncHandler from "../utils/async-handler.js";

export const executeCode = asyncHandler(async (req, res) => {
    const { source_code, language_id, stdin, expected_outputs, problemId } =
        req.body;
    const executedCodeResult = await executeCodeService(
        req.user.id,
        problemId,
        stdin,
        expected_outputs,
        source_code,
        language_id,
    );
    return res.status(executedCodeResult.statusCode).send(executedCodeResult);
});

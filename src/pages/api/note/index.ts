import { showError } from "@/utils/apis";
import { deleteNote, getNoteById, upsertNote } from "@/utils/apis/firebase/notes";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    try {
        const { method } = req;
        const userId = req.query.userId as string;
        const projectId = req.query.projectId as string
        const databaseId = req.query.databaseId as string
        const noteId = req.query.noteId as string
        if (!userId) throw new Error("UserId not found");
        if (method == "GET") {
            if (!projectId || !databaseId) throw new Error("params not found");
            res.status(200).json(
                await getNoteById({
                    userId,
                    projectId,
                    databaseId,
                    noteId
                })
            );
        } else if (method == "POST") {
            const { projectId, databaseId, noteData, noteId } =
                req.body;
            if (
                projectId &&
                databaseId &&
                (noteData != null || noteData != undefined)
            ) {
                res.status(200).json({
                    message: "note updated",
                    id: await upsertNote({
                        projectId,
                        databaseId,
                        userId,
                        noteData,
                        noteId
                    }),
                });
            } else {
                showError(res);
            }
        } else if (method == "DELETE") {
            const { databaseId, projectId, userId, noteId } = req.query;
            if (databaseId && userId && projectId && noteId) {
                res.status(200).json({
                    message: "note deleted",
                    id: await deleteNote({
                        databaseId: databaseId as string,
                        userId: userId as string,
                        projectId: projectId as string,
                        noteId: noteId as string
                    }),
                });
            } else {
                showError(res);
            }
        } else {
            res.setHeader("Allow", ["GET", "POST", "DELETE"]);
            res.status(405).end(`Method ${method} Not Allowed`);
        }
    } catch (error) {
        console.error(error);
        showError(res);
    }
}

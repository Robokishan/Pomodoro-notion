import { showError } from "@/utils/apis";
import { updateNote } from "@/utils/apis/firebase/notes";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { method } = req;
    const userId = req.query.userId as string;
    if (!userId) throw new Error("UserId not found");
    if (method == "PUT") {
      const { projectId, databaseId, shouldPublic, noteId } = req.body;
      if (
        projectId &&
        databaseId &&
        (shouldPublic != null || shouldPublic != undefined)
      ) {
        await updateNote({
          projectId,
          databaseId,
          userId,
          isPublic: shouldPublic,
          noteId,
        });
        res.status(200).json({
          message: `Note is ${shouldPublic === true ? "Public" : "Private"}`,
          isPublic: shouldPublic,
        });
      } else {
        showError(res);
      }
    } else {
      res.setHeader("Allow", ["PUT"]);
      res.status(405).end(`Method ${method} Not Allowed`);
    }
  } catch (error) {
    console.error(error);
    showError(res);
  }
}

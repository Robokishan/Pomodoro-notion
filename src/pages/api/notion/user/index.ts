import { NextApiRequest, NextApiResponse } from "next";
import { showError } from "../../../../utils/apis";
import {
  createNotionUser,
  getUserById,
} from "../../../../utils/apis/firebase/user";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { method } = req;

    if (method == "GET") {
      const userId = req.query.userId as string;
      if (!userId) throw new Error("UserId not found");
      const users = await getUserById(userId);
      res.status(200).json(users);
    } else if (method == "POST") {
      const { accessToken, refreshToken, code } = req.body;
      if (accessToken && refreshToken && code) {
        const id = await createNotionUser({
          code,
          accessToken,
          refreshToken,
        });
        res.status(200).json({
          message: "User created",
          userId: id,
        });
      } else {
        showError(res);
      }
    } else {
      res.setHeader("Allow", ["GET", "POST"]);
      res.status(405).end(`Method ${method} Not Allowed`);
    }
  } catch (error) {
    showError(res);
  }
}

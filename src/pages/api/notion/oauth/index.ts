import { NextApiRequest, NextApiResponse } from "next";
import { showError } from "../../../../utils/apis";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { method } = req;
    if (method == "GET") {
      const { code, state } = req.query;
      if (!code || !state) throw new Error("No code or state found");
      res.status(200);
    } else {
      res.setHeader("Allow", ["GET", "POST"]);
      res.status(405).end(`Method ${method} Not Allowed`);
    }
  } catch (error) {
    showError(res);
  }
}

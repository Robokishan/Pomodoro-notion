import axios, { AxiosError } from "axios";
import { NextApiRequest, NextApiResponse } from "next";
import { showError } from "../../../../utils/apis";
import { createNotionUser } from "../../../../utils/apis/firebase/userNotion";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { method } = req;
    if (method == "GET") {
      const { code, state } = req.query;
      if (!code || !state) throw new Error("No code or state found");
      const { data } = await axios.post(
        "https://api.notion.com/v1/oauth/token",
        {
          grant_type: "authorization_code",
          code,
          redirect_uri: process.env.NEXT_PUBLIC_NOTION_AUTH_REDIRECT_URI,
        },
        {
          headers: { "Content-Type": "application/json" },
          auth: {
            username: process.env.NEXT_PUBLIC_NOTION_AUTH_CLIENT_ID as string,
            password: process.env.NOTION_CLIENT_SECRET as string,
          },
        }
      );
      const { access_token, ...workspaceData } = data;
      await createNotionUser({
        accessToken: access_token,
        email: state as string,
        workspace: workspaceData,
      });
      res.redirect("/");
      // res.status(200).json(data);
    } else {
      res.setHeader("Allow", ["GET", "POST"]);
      res.status(405).end(`Method ${method} Not Allowed`);
    }
  } catch (error) {
    const err = error as AxiosError;
    showError(res, err.message);
  }
}

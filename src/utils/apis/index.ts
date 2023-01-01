import { NextApiResponse } from "next";

export const getToken = () => process.env.NEXT_PUBLIC_NOTION_AUTH_API_KEY;

export const showError = (
  res: NextApiResponse,
  message = "Something went wrong",
  statusCode = 400
) => {
  res.status(statusCode).json({
    error: message,
  });
};

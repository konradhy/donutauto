import { NextApiRequest, NextApiResponse } from "next";
import { logAuthError } from "./authLogger";

type ApiHandler = (req: NextApiRequest, res: NextApiResponse) => Promise<void>;

export const withErrorHandler =
  (handler: ApiHandler) =>
  async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      await handler(req, res);
    } catch (error) {
      logAuthError("api_error", req.body?.userId || "unknown", {
        error: error.message,
        path: req.url,
        method: req.method,
      });
      res.status(500).json({ error: "Internal Server Error" });
    }
  };

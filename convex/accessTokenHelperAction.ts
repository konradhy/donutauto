import { v } from "convex/values";
import { Id } from "./_generated/dataModel";
import { internal } from "./_generated/api";
import { ActionCtx, internalAction } from "./_generated/server";

// Helper function for base64 encoding
function customBase64Encode(str: string): string {
  const base64chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
  let result = "";
  let i = 0;
  do {
    const a = str.charCodeAt(i++);
    const b = str.charCodeAt(i++);
    const c = str.charCodeAt(i++);
    result +=
      base64chars.charAt(a >> 2) +
      base64chars.charAt(((a & 3) << 4) | (b >> 4)) +
      base64chars.charAt(((b & 15) << 2) | (c >> 6)) +
      base64chars.charAt(c & 63);
  } while (i < str.length);

  //  padding
  const padding = str.length % 3;
  if (padding) {
    result = result.slice(0, -padding + 3) + "=".repeat(padding);
  }

  return result;
}

// Internal action to refresh the token
export const refreshCanvaToken = internalAction({
  args: { userId: v.id("users"), refreshToken: v.string() },
  handler: async (ctx, args) => {
    const { userId, refreshToken } = args;

    const CANVA_CLIENT_ID = process.env.CANVA_CLIENT_ID;
    const CANVA_CLIENT_SECRET = process.env.CANVA_CLIENT_SECRET;
    const BASE_CANVA_CONNECT_API_URL = process.env.BASE_CANVA_CONNECT_API_URL;

    if (
      !CANVA_CLIENT_ID ||
      !CANVA_CLIENT_SECRET ||
      !BASE_CANVA_CONNECT_API_URL
    ) {
      throw new Error("Missing Canva API credentials in environment variables");
    }

    const TOKEN_ENDPOINT = `${BASE_CANVA_CONNECT_API_URL}/v1/oauth/token`;

    const authHeader = customBase64Encode(
      `${CANVA_CLIENT_ID}:${CANVA_CLIENT_SECRET}`,
    );

    console.log("Attempting to refresh token with:");
    console.log("Token Endpoint:", TOKEN_ENDPOINT);
    console.log(
      "Auth Header (partially masked):",
      authHeader.substr(0, 10) + "...",
    );
    console.log(
      "Refresh Token (partially masked):",
      refreshToken.substr(0, 10) + "...",
    );

    const body = new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: refreshToken,
    }).toString();

    try {
      const response = await fetch(TOKEN_ENDPOINT, {
        method: "POST",
        headers: {
          Authorization: `Basic ${authHeader}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: body,
      });

      console.log("Response status:", response.status);
      console.log("Response headers:", JSON.stringify(response.headers));

      const responseText = await response.text();
      console.log("Response body:", responseText);

      if (!response.ok) {
        throw new Error(
          `Failed to refresh token: ${response.statusText}. Details: ${responseText}`,
        );
      }

      let data;
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        console.error("Failed to parse response as JSON:", parseError);
        throw new Error("Invalid response format from Canva API");
      }

      if (!data.access_token || !data.refresh_token || !data.expires_in) {
        console.error("Unexpected response structure:", data);
        throw new Error("Unexpected response structure from Canva API");
      }

      // Update the user record with the new tokens
      await ctx.runMutation(internal.accessTokenHelper.updateCanvaTokens, {
        userId,
        accessToken: data.access_token,
        refreshToken: data.refresh_token,
        expiresIn: data.expires_in,
      });

      return data.access_token;
    } catch (error) {
      console.error("Error in refreshCanvaToken:", error);
      throw error;
    }
  },
});

// Internal action to get the Canva access token
export const getCanvaAccessToken = internalAction({
  args: { userId: v.id("users") },
  handler: async (
    ctx: ActionCtx,
    args: { userId: Id<"users"> },
  ): Promise<string> => {
    const tokenInfo = await ctx.runQuery(
      internal.accessTokenHelper.getCanvaTokenInfo,
      { userId: args.userId },
    );

    if (tokenInfo.needsRefresh) {
      if (!tokenInfo.refreshToken) {
        throw new Error(
          "No Canva refresh token available. Please connect to Canva on the dashboard.",
        );
      }
      return await ctx.runAction(
        internal.accessTokenHelperAction.refreshCanvaToken,
        {
          userId: args.userId,
          refreshToken: tokenInfo.refreshToken,
        },
      );
    } else if (tokenInfo.accessToken) {
      return tokenInfo.accessToken;
    } else {
      throw new Error(
        "No Canva access token available. Please connect to Canva on the dashboard.",
      );
    }
  },
});

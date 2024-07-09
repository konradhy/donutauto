import { NextRequest, NextResponse } from "next/server";
import { api } from "@/convex/_generated/api";

import { OauthService } from "@/lib/canva-api";
import { getBasicAuthClient } from "@/lib/canva-api/client";
import { fetchMutation, fetchQuery } from "convex/nextjs";
import { auth } from "@clerk/nextjs/server";

export async function POST(request: NextRequest) {
  const { userId, getToken } = auth();
  if (!userId) {
    return new Response("User is not signed in.", { status: 401 });
  }

  const token = await getToken({ template: "convex" });
  if (!token) {
    return new Response("Issue getting Convex to Clerk integration token.", {
      status: 401,
    });
  }

  try {
    const refreshToken = await fetchQuery(
      api.canvaAuth.getRefreshToken,
      {},
      { token },
    );

    if (!refreshToken) {
      return NextResponse.json(
        { error: "Refresh token not found" },
        { status: 404 },
      );
    }

    // Config params.
    const params = new URLSearchParams({
      token: refreshToken,
      client_id: process.env.CANVA_CLIENT_ID!,
      client_secret: process.env.CANVA_CLIENT_SECRET!,
    });

    // Make the revoke request to Canva
    await OauthService.revokeTokens({
      client: getBasicAuthClient(),
      body: params,
      bodySerializer: (params) => params.toString(),
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    await fetchMutation(
      api.canvaAuth.updateCanvaConnectionStatus,
      {
        isConnected: false,
      },
      { token },
    );

    return NextResponse.json({ message: "Token revoked successfully" });
  } catch (error) {
    console.error("Error revoking token:", error);
    return NextResponse.json(
      { error: "Failed to revoke token" },
      { status: 500 },
    );
  }
}

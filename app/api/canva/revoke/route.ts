import { NextRequest, NextResponse } from "next/server";
import { api } from "@/convex/_generated/api";
import { ConvexHttpClient } from "convex/browser";
import { OauthService } from "@/lib/canva-api";
import { getBasicAuthClient } from "@/lib/canva-api/client";

/*
Rethink this pattern. 
- IF someone were to somehow get your tokenidentifier, they could revoke or even set your token.
- No practical ways to get it, however it isn't a secret, it's stored in the cookie.
- That said, you can get  the access token, only the refresher
- I can't think of how practically this is an issue. But I can see how it can be tighter.
- I considered if it can be fixed by using convex http route so tokenid is grabbed on the server. But I think we still 
end up passing it from the route, it's just that it's not in a cookie. Token ID is never going to be a secret so, 
once the function can be invoked by an unauth user who just has the ID then there is potential for exploit. 

Another solution, can I wrap routes in the clerk middleware / provider? To allow for identitiy verification that way

*/

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export async function POST(request: NextRequest) {
  try {
    // Get user's tokenIdentifier from  cookie
    const tokenIdentifier = request.cookies.get("tokenIdentifier")?.value;
    if (!tokenIdentifier) {
      return NextResponse.json(
        { error: "User not authenticated" },
        { status: 401 },
      );
    }
    console.log("tokenIdentifier", tokenIdentifier);

    // Get user's refresh token from Convex
    const refreshToken = await convex.query(api.canvaAuth.getRefreshToken, {
      tokenIdentifier,
    });
    if (!refreshToken) {
      return NextResponse.json(
        { error: "Refresh token not found" },
        { status: 404 },
      );
    }
    console.log("refreshToken", refreshToken);

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

    // If successful, update the user's status
    await convex.mutation(api.canvaAuth.updateCanvaConnectionStatus, {
      tokenIdentifier,
      isConnected: false,
    });

    return NextResponse.json({ message: "Token revoked successfully" });
  } catch (error) {
    console.error("Error revoking token:", error);
    return NextResponse.json(
      { error: "Failed to revoke token" },
      { status: 500 },
    );
  }
}

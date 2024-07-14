import { NextRequest, NextResponse } from "next/server";
import { OauthService } from "@/lib/canva-api";
import { getBasicAuthClient } from "@/lib/canva-api/client";
import { api } from "@/convex/_generated/api";

import { fetchMutation } from "convex/nextjs";
import { getAbsoluteUrl } from "@/lib/utils";
import {
  OAUTH_CODE_VERIFIER_COOKIE_NAME,
  OAUTH_STATE_COOKIE_NAME,
} from "@/lib/services/auth";
import { logAuthEvent } from "@/lib/logs/authLogger";
import { auth } from "@clerk/nextjs/server";

export async function GET(request: NextRequest) {
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

  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get("code");
  const state = searchParams.get("state");

  const storedState = request.cookies.get(OAUTH_STATE_COOKIE_NAME)?.value;
  const codeVerifier = request.cookies.get(
    OAUTH_CODE_VERIFIER_COOKIE_NAME,
  )?.value;

  if (!code || !state || state !== storedState || !codeVerifier) {
    return NextResponse.redirect(
      new URL(
        `/api/canva/auth-failure?error=${encodeURIComponent("Invalid request parameters")}`,
        request.url,
      ),
    );
  }

  try {
    const exchangeResult = await OauthService.exchangeAccessToken({
      client: getBasicAuthClient(),
      body: new URLSearchParams({
        grant_type: "authorization_code",
        code: code,
        code_verifier: codeVerifier,
        redirect_uri: getAbsoluteUrl("/api/canva/callback"),
      }),
      bodySerializer: (params) => params.toString(),
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    if (exchangeResult.error) {
      return NextResponse.redirect(
        new URL(
          `/canva/auth-failure?error=${encodeURIComponent(JSON.stringify(exchangeResult.error))}`,
          request.url,
        ),
      );
    }

    const tokenData = exchangeResult.data;
    if (!tokenData) {
      throw new Error("No token data received");
    }

    //Consider encoding if I decide insecure

    //error handling?

    await fetchMutation(
      api.canvaAuth.setAccessToken,
      {
        accessToken: tokenData.access_token,
        refreshToken: tokenData.refresh_token,
        expiresIn: tokenData.expires_in,
      },
      { token },
    );

    logAuthEvent("Auth attempt successful", userId || "unknown", {
      userAgent: request.headers.get("user-agent") || "Unknown",
    });

    const response = NextResponse.redirect(
      new URL("/canva/auth-success", request.url),
    );

    // Clear the OAuth cookies
    response.cookies.set(OAUTH_STATE_COOKIE_NAME, "", { maxAge: 0, path: "/" });
    response.cookies.set(OAUTH_CODE_VERIFIER_COOKIE_NAME, "", {
      maxAge: 0,
      path: "/",
    });

    return response;
  } catch (error) {
    console.log("Error might be with internet connection");
    console.error("Error in callback:", error);
    return NextResponse.redirect(
      new URL(
        `/canva/auth-failure?error=${encodeURIComponent(String(error))}`,
        request.url,
      ),
    );
  }
}

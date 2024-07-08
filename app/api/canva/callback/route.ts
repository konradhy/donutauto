import { NextRequest, NextResponse } from "next/server";
import { OauthService } from "@/lib/canva-api";
import { getBasicAuthClient } from "@/lib/canva-api/client";
import { api } from "@/convex/_generated/api";
import { ConvexHttpClient } from "convex/browser";
import { getAbsoluteUrl } from "@/lib/utils";
import {
  OAUTH_CODE_VERIFIER_COOKIE_NAME,
  OAUTH_STATE_COOKIE_NAME,
  TOKEN_IDENTIFIER_COOKIE_NAME,
} from "@/lib/services/auth";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get("code");
  const state = searchParams.get("state");

  const storedState = request.cookies.get(OAUTH_STATE_COOKIE_NAME)?.value;
  const codeVerifier = request.cookies.get(
    OAUTH_CODE_VERIFIER_COOKIE_NAME,
  )?.value;
  const tokenIdentifier = request.cookies.get(
    TOKEN_IDENTIFIER_COOKIE_NAME,
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

    if (!tokenIdentifier) {
      throw new Error("No token identifier found");
    }

    //Consider encoding if I decide insecure
    await convex.mutation(api.canvaAuth.storeAccessToken, {
      accessToken: tokenData.access_token,
      refreshToken: tokenData.refresh_token,
      expiresIn: tokenData.expires_in,
      tokenIdentifier: tokenIdentifier,
    });

    //consider a set token function similar to Demo.

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

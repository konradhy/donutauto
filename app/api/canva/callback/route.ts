// app/api/canva/callback/route.ts
import { NextRequest, NextResponse } from "next/server";
import { OauthService } from "@/lib/canva-api";
import { getBasicAuthClient } from "@/lib/canva-api/client";

export const AUTH_COOKIE_NAME = "aut";
export const OAUTH_STATE_COOKIE_NAME = "oas";
export const OAUTH_CODE_VERIFIER_COOKIE_NAME = "ocv";

function getAbsoluteUrl(path: string) {
  return `${process.env.NEXT_PUBLIC_BASE_URL}${path}`;
}

export async function GET(request: NextRequest) {
  console.log("Full cookie header:", request.headers.get("cookie"));

  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get("code");
  const state = searchParams.get("state");

  const storedState = request.cookies.get(OAUTH_STATE_COOKIE_NAME)?.value;
  const codeVerifier = request.cookies.get(
    OAUTH_CODE_VERIFIER_COOKIE_NAME,
  )?.value;

  if (!code || !state || state !== storedState || !codeVerifier) {
    return NextResponse.redirect(
      getAbsoluteUrl(
        `/api/canva/auth-failure?error=${encodeURIComponent("Invalid request parameters")}`,
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
      console.error("Token exchange error:", exchangeResult.error);
      return NextResponse.redirect(
        getAbsoluteUrl(
          `/api/canva/auth-failure?error=${encodeURIComponent(JSON.stringify(exchangeResult.error))}`,
        ),
      );
    }

    const tokenData = exchangeResult.data;
    if (!tokenData) {
      throw new Error("No token data received");
    }

    console.log("Access Token:", tokenData.access_token);
    //store access token in convex

    const response = NextResponse.redirect(
      getAbsoluteUrl("/api/canva/auth-success"),
    );

    // Clear the OAuth cookies

    response.cookies.set(OAUTH_STATE_COOKIE_NAME, "", { maxAge: 0, path: "/" });
    response.cookies.set(OAUTH_CODE_VERIFIER_COOKIE_NAME, "", {
      maxAge: 0,
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Error in callback:", error);
    return NextResponse.redirect(
      getAbsoluteUrl(
        `/api/canva/auth-failure?error=${encodeURIComponent(String(error))}`,
      ),
    );
  }
}

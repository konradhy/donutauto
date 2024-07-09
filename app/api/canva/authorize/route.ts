// app/api/canva/authorize/route.ts
import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { getAbsoluteUrl } from "@/lib/utils";
import {
  OAUTH_CODE_VERIFIER_COOKIE_NAME,
  OAUTH_STATE_COOKIE_NAME,
} from "@/lib/services/auth";
import { getAuthorizationUrl } from "@/lib/services/auth";
import { withErrorHandler } from "@/lib/logs/apiErrorHandler";
import { logAuthEvent, logAuthError } from "@/lib/logs/authLogger";
import { currentUser } from "@clerk/nextjs/server";

export async function GET(request: NextRequest) {
  try {
    const codeVerifier = crypto.randomBytes(96).toString("base64url");
    const state = crypto.randomBytes(96).toString("base64url");
    const codeChallenge = crypto
      .createHash("sha256")
      .update(codeVerifier)
      .digest("base64url");

    const user = await currentUser();
    const redirectUri = getAbsoluteUrl("/api/canva/callback");

    const authorizationUrl = getAuthorizationUrl(
      redirectUri,
      state,
      codeChallenge,
    );
    //you need to include id's
    logAuthEvent(
      `${user?.firstName} started an Auth attempt`,
      user?.id || "unknown",
      {
        path: request.url,
        ip: request.ip || request.headers.get("x-forwarded-for") || "Unknown",
        userAgent: request.headers.get("user-agent") || "Unknown",
      },
    );

    const response = NextResponse.redirect(authorizationUrl);

    response.cookies.set(OAUTH_STATE_COOKIE_NAME, state, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 20, // 20 min
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    });

    response.cookies.set(OAUTH_CODE_VERIFIER_COOKIE_NAME, codeVerifier, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 20,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    });

    return response;
  } catch (error: any) {
    logAuthError("token_identifier_retrieval_error", "unknown", {
      error: error.message,
      path: request.url,
      ip: request.ip || request.headers.get("x-forwarded-for") || "Unknown",
      userAgent: request.headers.get("user-agent") || "Unknown",
    });

    return NextResponse.error();
  }
}

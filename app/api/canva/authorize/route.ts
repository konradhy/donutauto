// app/api/canva/authorize/route.ts
import { NextResponse } from "next/server";
import crypto from "crypto";
import { getAbsoluteUrl } from "@/lib/utils";
import {
  OAUTH_CODE_VERIFIER_COOKIE_NAME,
  OAUTH_STATE_COOKIE_NAME,
} from "@/lib/services/auth";
import { getAuthorizationUrl } from "@/lib/services/auth";

export async function GET() {
  const codeVerifier = crypto.randomBytes(96).toString("base64url");
  const state = crypto.randomBytes(96).toString("base64url");
  const codeChallenge = crypto
    .createHash("sha256")
    .update(codeVerifier)
    .digest("base64url");

  const redirectUri = getAbsoluteUrl("/api/canva/callback");

  const authorizationUrl = getAuthorizationUrl(
    redirectUri,
    state,
    codeChallenge,
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
}

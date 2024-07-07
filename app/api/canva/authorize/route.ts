// app/api/canva/authorize/route.ts
import { NextResponse } from "next/server";
import crypto from "crypto";

//place in helper/util/lib file
export const AUTH_COOKIE_NAME = "aut";
export const OAUTH_STATE_COOKIE_NAME = "oas";
export const OAUTH_CODE_VERIFIER_COOKIE_NAME = "ocv";

//TODO: place in util file
function getAuthorizationUrl(
  redirectUri: string,
  state: string,
  codeChallenge: string,
): string {
  const clientId = process.env.CANVA_CLIENT_ID;
  if (!clientId) {
    throw new Error("CANVA_CLIENT_ID is not set");
  }

  const scopes = [
    "asset:read",
    "asset:write",
    "brandtemplate:content:read",
    "brandtemplate:meta:read",
    "design:content:read",
    "design:content:write",
    "design:meta:read",
    "profile:read",
  ];

  const scopeString = scopes.join(" ");
  const authorizationUrl = new URL("https://www.canva.com/api/oauth/authorize");
  authorizationUrl.searchParams.append("client_id", clientId);
  authorizationUrl.searchParams.append("response_type", "code");
  authorizationUrl.searchParams.append("redirect_uri", redirectUri);
  authorizationUrl.searchParams.append("state", state);
  authorizationUrl.searchParams.append("code_challenge", codeChallenge);
  authorizationUrl.searchParams.append("code_challenge_method", "S256");
  authorizationUrl.searchParams.append("scope", scopeString);

  return authorizationUrl.toString();
}

export async function GET() {
  const codeVerifier = crypto.randomBytes(96).toString("base64url");
  const state = crypto.randomBytes(96).toString("base64url");
  const codeChallenge = crypto
    .createHash("sha256")
    .update(codeVerifier)
    .digest("base64url");

  const redirectUri = "http://127.0.0.1:3000/api/canva/callback"; // TODO: this will break in production. Use BaseUrl or something in .env. See get absoulte url fucntion
  const authorizationUrl = getAuthorizationUrl(
    redirectUri,
    state,
    codeChallenge,
  );

  const response = NextResponse.redirect(authorizationUrl);

  response.cookies.set(OAUTH_STATE_COOKIE_NAME, state, {
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 20, // Is this 20 minutes our 20 hours?
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

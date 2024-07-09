// lib/canva-api/client.ts

import { createClient } from "@hey-api/client-fetch";
import type { client } from "@hey-api/client-fetch";

import { api } from "@/convex/_generated/api";
import { fetchMutation, fetchQuery } from "convex/nextjs";
import { auth } from "@clerk/nextjs/server";

import { OauthService } from "@/lib/canva-api/services.gen";

export function getBasicAuthClient() {
  const credentials = `${process.env.CANVA_CLIENT_ID}:${process.env.CANVA_CLIENT_SECRET}`;
  const localClient = createClient({
    global: false,
    headers: {
      Authorization: `Basic ${Buffer.from(credentials).toString("base64")}`,
    },
    baseUrl: process.env.BASE_CANVA_CONNECT_API_URL,
  });

  localClient.interceptors.response.use((res) => {
    const requestId = res.headers.get("x-request-id");
    if (res.status >= 400) {
      console.warn(
        `Response status ${res.status} on ${res.url}: request id: ${requestId}, }`,
      );
    } else {
      console.log(
        `Response status ${res.status} on ${res.url}: request id: ${requestId}`,
      );
    }
    return res;
  });

  return localClient;
}

export function getUserClient(token: string): typeof client {
  const localClient = createClient({
    global: false,
    headers: {
      Authorization: `Bearer ${token}`,
    },
    baseUrl: process.env.BASE_CANVA_CONNECT_API_URL,
  });

  localClient.interceptors.response.use((res) => {
    const requestId = res.headers.get("x-request-id");
    if (res.status >= 400) {
      console.warn(
        `Response status ${res.status} on ${res.url}: request id: ${requestId}}`,
      );
    } else {
      console.log(
        `Response status ${res.status} on ${res.url}: request id: ${requestId}`,
      );
    }
    return res;
  });

  return localClient;
}

export async function getAccessTokenForUser() {
  const { userId, getToken } = auth();
  if (!userId) {
    return new Response("User is not signed in.", { status: 401 });
  }

  const serverToken = await getToken({ template: "convex" });
  if (!serverToken) {
    return new Response("Issue getting Convex to Clerk integration token.", {
      status: 401,
    });
  }

  const token = await fetchQuery(
    api.canvaAuth.getAccessToken,
    {},
    { token: serverToken },
  );

  if (token.expiration) {
    if (token.expiration - Date.now() > 600000) {
      return token.accessToken;
    }
  }
  //otherwise refresh the token
  const refreshToken = token.refreshToken;
  if (!refreshToken) {
    throw new Error("No refresh token found");
  }

  const params = new URLSearchParams({
    grant_type: "refresh_token",
    refresh_token: refreshToken,
  });

  const result = await OauthService.exchangeAccessToken({
    client: getBasicAuthClient(),
    body: params,
    bodySerializer: (params) => params.toString(),
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    baseUrl: process.env.BASE_CANVA_CONNECT_API_URL,
  });

  if (result.error) {
    throw new Error(`Failed to refresh token $`);
  }
  if (!result.data) {
    throw new Error(
      "No data returned when exchanging oauth code for token, but no error was returned either.",
    );
  }

  const refreshedToken = result.data;
  const accessToken = refreshedToken.access_token;

  await fetchMutation(
    api.canvaAuth.setAccessToken,
    {
      accessToken: refreshedToken.access_token,
      refreshToken: refreshedToken.refresh_token,
      expiresIn: refreshedToken.expires_in,
    },
    { token: serverToken },
  );

  return accessToken;
}

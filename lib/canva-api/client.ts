// lib/canva-api/client.ts

import { createClient } from "@hey-api/client-fetch";

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
        `Response status ${res.status} on ${res.url}: request id: ${requestId}, ${res.body}`,
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

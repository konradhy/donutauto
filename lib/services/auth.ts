import { BACKEND_HOST } from "@/lib/config";

const endpoints = {
  AUTHORIZE: "/api/canva/authorize",
  REVOKE: "/api/canva/revoke",
  USER: "api/canva/user",
};

export const AUTH_COOKIE_NAME = "aut";
export const OAUTH_STATE_COOKIE_NAME = "oas";
export const OAUTH_CODE_VERIFIER_COOKIE_NAME = "ocv";

export function getAuthorizationUrl(
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

const fetchData = async <T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> => {
  const url = new URL(endpoint, BACKEND_HOST);
  const response = await fetch(url, {
    ...options,
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
};

export const getCanvaAuthorization = async (): Promise<boolean> => {
  return new Promise<boolean>((resolve, reject) => {
    if (typeof window === "undefined") {
      reject(new Error("Window is not defined"));
      return;
    }

    try {
      const url = new URL(endpoints.AUTHORIZE, BACKEND_HOST);
      const authWindow = window.open(url.toString(), "_blank");

      if (!authWindow) {
        throw new Error("Failed to open authentication window");
      }

      const checkClosed = setInterval(() => {
        if (authWindow.closed) {
          clearInterval(checkClosed);
          resolve(true); // Assume success if the window is closed
        }
      }, 500);
    } catch (error) {
      console.error("Authorization failed", error);
      reject(error);
    }
  });
};

export const revoke = async (): Promise<{
  success: boolean;
  message?: string;
}> => {
  try {
    const response = await fetchData<{ message: string }>(endpoints.REVOKE, {
      method: "POST",
    });
    return { success: true, message: response.message };
  } catch (error) {
    console.error("Error in revoke:", error);
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
};

export const getUser = async (): Promise<{
  profile: { display_name: string };
}> => {
  return fetchData<{ profile: { display_name: string } }>(endpoints.USER);
};

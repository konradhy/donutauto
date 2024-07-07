import { BACKEND_HOST } from "@/lib/config";

const endpoints = {
  AUTHORIZE: "/api/canva/authorize",
  REVOKE: "/api/canva/revoke",
  IS_AUTHORIZED: "/isauthorized",
  USER: "/user",
};

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
      // Instead of opening a popup, we'll redirect the current window
      window.location.href = url.toString();

      // Since we're redirecting, we don't need the message listener or interval check
      // The rest of the auth flow will be handled by the callback route

      // Resolve the promise immediately, as the actual auth result will be handled in the callback
      resolve(true);
    } catch (error) {
      console.error("Authorization failed", error);
      reject(error);
    }
  });
};

export const revoke = async (): Promise<boolean> => {
  const response = await fetchData<{ success: boolean }>(endpoints.REVOKE, {
    method: "POST",
  });
  return response.success;
};

export const checkAuthorizationStatus = async (): Promise<{
  status: boolean;
}> => {
  return fetchData<{ status: boolean }>(endpoints.IS_AUTHORIZED);
};

export const getUser = async (): Promise<{
  profile: { display_name: string };
}> => {
  return fetchData<{ profile: { display_name: string } }>(endpoints.USER);
};

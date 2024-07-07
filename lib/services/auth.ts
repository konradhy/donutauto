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

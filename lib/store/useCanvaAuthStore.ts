// /lib/store/useCanvaAuthStore.ts
import { create } from "zustand";
import { checkAuthorizationStatus } from "@/lib/services/auth";

// Define the shape of our state and actions
interface CanvaAuthState {
  isAuthorized: boolean; // Tracks if the user is authorized
  displayName: string; // Stores the user's display name
  errors: string[]; // Array to store error messages
  showSuccessfulConnectionAlert: boolean; // Controls visibility of success alert
  setIsAuthorized: (isAuthorized: boolean) => void; // Function to update authorization status
  setDisplayName: (displayName: string) => void; // Function to set display name
  setErrors: (errors: string[]) => void; // Function to set entire errors array
  addError: (error: string) => void; // Function to add a single error
  setShowSuccessfulConnectionAlert: (show: boolean) => void; // Function to control success alert
  checkAuthorization: () => Promise<void>; // Function to check authorization status
}

// Create the store
export const useCanvaAuthStore = create<CanvaAuthState>((set, get) => ({
  // Initial state
  isAuthorized: false,
  displayName: "",
  errors: [],
  showSuccessfulConnectionAlert: false,

  // Actions (functions that modify state)
  setIsAuthorized: (isAuthorized) => set({ isAuthorized }),
  setDisplayName: (displayName) => set({ displayName }),
  setErrors: (errors) => set({ errors }),
  addError: (error) => set((state) => ({ errors: [...state.errors, error] })),
  setShowSuccessfulConnectionAlert: (show) =>
    set({ showSuccessfulConnectionAlert: show }),

  // Asynchronous action to check authorization status
  checkAuthorization: async () => {
    try {
      const { status } = await checkAuthorizationStatus(); // Call the service function
      set({ isAuthorized: status }); // Update the isAuthorized state
    } catch (error) {
      console.error("Error checking authorization:", error);
      // Use the get function to access current state and actions
      get().addError("Failed to check authorization status");
    }
  },
}));

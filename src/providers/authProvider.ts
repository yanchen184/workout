import { AuthProvider } from "@refinedev/core";
import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "firebase/auth";
import { auth } from "../config/firebase";

// Firebase auth provider for Refine
export const firebaseAuthProvider: AuthProvider = {
  // Login function
  login: async ({ email, password }) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      return {
        success: true,
        redirectTo: "/",
      };
    } catch (error: any) {
      return {
        success: false,
        error: {
          name: "LoginError",
          message: error.message,
        },
      };
    }
  },

  // Register function
  register: async () => {
    try {
      return {
        success: true,
        redirectTo: "/",
      };
    } catch (error: any) {
      return {
        success: false,
        error: {
          name: "RegisterError",
          message: error.message,
        },
      };
    }
  },

  // Logout function
  logout: async () => {
    try {
      await signOut(auth);
      return {
        success: true,
        redirectTo: "/login",
      };
    } catch (error: any) {
      return {
        success: false,
        error: {
          name: "LogoutError",
          message: error.message,
        },
      };
    }
  },

  // Check authentication status
  check: async () => {
    return new Promise((resolve) => {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        unsubscribe();
        if (user) {
          resolve({
            authenticated: true,
          });
        } else {
          resolve({
            authenticated: false,
            redirectTo: "/login",
          });
        }
      });
    });
  },

  // Get permissions (optional)
  getPermissions: async () => {
    const user = auth.currentUser;
    if (user) {
      return user.uid;
    }
    return null;
  },

  // Get user identity
  getIdentity: async () => {
    const user = auth.currentUser;
    if (user) {
      return {
        id: user.uid,
        name: user.displayName || user.email,
        avatar: user.photoURL,
      };
    }
    return null;
  },

  // Handle authentication errors
  onError: async (error) => {
    console.error("Auth error:", error);
    return { error };
  },
};
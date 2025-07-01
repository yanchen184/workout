import { AuthProvider } from "@refinedev/core";

// Demo auth provider for development (no real Firebase needed)
export const demoAuthProvider: AuthProvider = {
  // Login function
  login: async ({ email, password }) => {
    // Simulate login delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Accept any email/password for demo
    if (email && password) {
      localStorage.setItem('demo-user', JSON.stringify({
        id: '1',
        email,
        name: email.split('@')[0]
      }));
      
      return {
        success: true,
        redirectTo: "/",
      };
    }
    
    return {
      success: false,
      error: {
        name: "LoginError",
        message: "請輸入電子郵件和密碼",
      },
    };
  },

  // Register function
  register: async ({ email, password }) => {
    // Simulate register delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (email && password) {
      localStorage.setItem('demo-user', JSON.stringify({
        id: '1',
        email,
        name: email.split('@')[0]
      }));
      
      return {
        success: true,
        redirectTo: "/",
      };
    }
    
    return {
      success: false,
      error: {
        name: "RegisterError",
        message: "請輸入電子郵件和密碼",
      },
    };
  },

  // Logout function
  logout: async () => {
    localStorage.removeItem('demo-user');
    return {
      success: true,
      redirectTo: "/login",
    };
  },

  // Check authentication status
  check: async () => {
    const user = localStorage.getItem('demo-user');
    if (user) {
      return {
        authenticated: true,
      };
    }
    
    return {
      authenticated: false,
      redirectTo: "/login",
    };
  },

  // Get permissions
  getPermissions: async () => {
    const user = localStorage.getItem('demo-user');
    if (user) {
      return JSON.parse(user).id;
    }
    return null;
  },

  // Get user identity
  getIdentity: async () => {
    const user = localStorage.getItem('demo-user');
    if (user) {
      return JSON.parse(user);
    }
    return null;
  },

  // Handle authentication errors
  onError: async (error) => {
    console.error("Auth error:", error);
    return { error };
  },
};

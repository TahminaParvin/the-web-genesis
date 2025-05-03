
import { User } from "@/types";
import { users } from "@/data/users";
import { toast } from "sonner";

// Simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
}

// Initial auth state
const initialState: AuthState = {
  isAuthenticated: false,
  user: null
};

// Use local storage to persist auth state
const loadAuthState = (): AuthState => {
  const storedState = localStorage.getItem("authState");
  if (storedState) {
    try {
      return JSON.parse(storedState);
    } catch (error) {
      console.error("Error parsing auth state:", error);
    }
  }
  return initialState;
};

// Save auth state to local storage
const saveAuthState = (state: AuthState): void => {
  localStorage.setItem("authState", JSON.stringify(state));
};

// Current auth state
let authState = loadAuthState();

export const authService = {
  // Get current auth state
  getAuthState: () => authState,

  // Login
  login: async (username: string, password: string): Promise<User> => {
    await delay(500); // Simulate network delay
    
    const user = users.find(
      u => u.username === username && u.password === password
    );
    
    if (!user) {
      toast.error("Invalid username or password");
      throw new Error("Invalid username or password");
    }
    
    // Update auth state
    authState = {
      isAuthenticated: true,
      user
    };
    
    saveAuthState(authState);
    toast.success("Login successful");
    return user;
  },
  
  // Logout
  logout: async (): Promise<void> => {
    await delay(300);
    
    // Update auth state
    authState = {
      isAuthenticated: false,
      user: null
    };
    
    saveAuthState(authState);
    toast.success("Logged out successfully");
  },
  
  // Check if user is authenticated
  isAuthenticated: (): boolean => {
    return authState.isAuthenticated && authState.user !== null;
  },
  
  // Check if user is an admin
  isAdmin: (): boolean => {
    return authState.isAuthenticated && authState.user?.isAdmin === true;
  }
};

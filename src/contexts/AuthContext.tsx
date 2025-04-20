
import React, { createContext, useContext, useState, useEffect } from "react";
import { AuthContextType, MOCK_USERS, ROLE_PERMISSIONS, User, UserRole } from "@/types/auth";

// Create the auth context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Initial loading of user from storage
const loadUserFromStorage = (): User | null => {
  if (typeof window === "undefined") return null;
  
  const storedUser = localStorage.getItem("estate-nexus-user");
  return storedUser ? JSON.parse(storedUser) : null;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Load user on initial render
  useEffect(() => {
    const loadedUser = loadUserFromStorage();
    setUser(loadedUser);
    setIsLoading(false);
  }, []);

  // Save user to storage when it changes
  useEffect(() => {
    if (user) {
      localStorage.setItem("estate-nexus-user", JSON.stringify(user));
    } else {
      localStorage.removeItem("estate-nexus-user");
    }
  }, [user]);

  // Used Check if the current user has a specific permission
  const hasPermission = (permission: string): boolean => {
    if (!user) return false;
    
    const userPermissions = ROLE_PERMISSIONS[user.role];
    return userPermissions.includes(permission);
  };

  // Check if the current user has any of the provided permissions
  const hasAnyPermission = (permissions: string[]): boolean => {
    if (!user) return false;
    
    const userPermissions = ROLE_PERMISSIONS[user.role];
    return permissions.some(permission => userPermissions.includes(permission));
  };

  // Check if the current user has all of the provided permissions
  const hasAllPermissions = (permissions: string[]): boolean => {
    if (!user) return false;
    
    const userPermissions = ROLE_PERMISSIONS[user.role];
    return permissions.every(permission => userPermissions.includes(permission));
  };

  // Get all permissions for the current user
  const getUserPermissions = (): string[] => {
    if (!user) return [];
    
    return ROLE_PERMISSIONS[user.role] || [];
  };

  // Login function - in a real app, this would call an API
  const login = async (email: string, password: string): Promise<void> => {
    setIsLoading(true);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Find user with the provided email
      const foundUser = MOCK_USERS.find(u => u.email === email);
      
      if (!foundUser) {
        throw new Error("Invalid email or password");
      }
      
      // In a real app, you would verify the password here
      // For now, we'll just log in the user
      setUser(foundUser);
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = async (): Promise<void> => {
    setIsLoading(true);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Clear user data
      setUser(null);
    } catch (error) {
      console.error("Logout error:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Signup function - in a real app, this would call an API
  const signup = async (email: string, password: string, name: string, role: UserRole): Promise<void> => {
    setIsLoading(true);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Check if user already exists
      const userExists = MOCK_USERS.some(u => u.email === email);
      
      if (userExists) {
        throw new Error("User already exists");
      }
      
      // Create new user
      const newUser: User = {
        id: `user-${Date.now()}`,
        email,
        name,
        role,
        verified: false,
        createdAt: new Date(),
      };
      
      // In a real app, you would save this user to a database
      // For now, we'll just log in the new user
      setUser(newUser);
    } catch (error) {
      console.error("Signup error:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const value: AuthContextType = {
    user,
    isLoading,
    login,
    logout,
    signup,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    getUserPermissions
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use the auth context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  
  return context;
};

// Higher-order component for protected routes
export function withAuth<T>(Component: React.ComponentType<T>, requiredPermission?: string | string[]) {
  return function ProtectedRoute(props: T) {
    const { user, isLoading, hasPermission, hasAnyPermission } = useAuth();
    
    // If still loading, show loading state
    if (isLoading) {
      return <div>Loading...</div>;
    }
    
    // If no user is logged in, redirect to login
    if (!user) {
      // In a real app, you would use React Router's redirect
      // For now, we'll just replace the URL
      window.location.href = "/login";
      return null;
    }
    
    // Check permissions
    if (requiredPermission) {
      // If requiredPermission is a string, check that single permission
      if (typeof requiredPermission === 'string' && !hasPermission(requiredPermission)) {
        return <div>You don't have permission to access this page.</div>;
      }
      
      // If requiredPermission is an array, check if user has any of those permissions
      if (Array.isArray(requiredPermission) && !hasAnyPermission(requiredPermission)) {
        return <div>You don't have permission to access this page.</div>;
      }
    }
    
    // If all checks pass, render the component
    return <Component {...props} />;
  };
}


import { useState, useEffect } from "react";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface DashboardLayoutProps {
  children: React.ReactNode;
  requiredPermission?: string;
}

export function DashboardLayout({ children, requiredPermission }: DashboardLayoutProps) {
  const { user, isLoading, hasPermission } = useAuth();
  const [isMounted, setIsMounted] = useState(false);
  const navigate = useNavigate();
  
  useEffect(() => {
    setIsMounted(true);
  }, []);
  
  // If still loading, show loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-background">
        <div className="relative">
          <div className="h-16 w-16 rounded-full border-4 border-primary/30 border-t-primary animate-spin"></div>
          <div className="mt-4 text-center text-sm text-muted-foreground">Loading...</div>
        </div>
      </div>
    );
  }
  
  // If no user is logged in, redirect to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  // If permission is required but user Mercysn't have it, show unauthorized message
  if (requiredPermission && !hasPermission(requiredPermission)) {
    return (
      <div className="flex items-center justify-center h-screen bg-background">
        <div className="text-center max-w-md p-8 card-gradient rounded-xl shadow-elevation-2 border border-border animate-fade-in">
          <div className="w-16 h-16 mx-auto bg-destructive/10 rounded-full flex items-center justify-center mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-destructive" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 9v4"></path>
              <path d="M12 17h.01"></path>
              <path d="M5.07 19H19a2 2 0 0 0 1.75-2.75L13.75 4a2 2 0 0 0-3.5 0L3.25 16.25a2 2 0 0 0 1.75 2.75"></path>
            </svg>
          </div>
          <h1 className="text-2xl font-bold mb-2">Unauthorized Access</h1>
          <p className="text-muted-foreground mb-6">You don't have permission to access this page. Please contact your administrator for assistance.</p>
          <Button onClick={() => navigate(-1)} className="bg-gradient-to-r from-primary to-secondary">Go Back</Button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar />
      <div className={`flex-1 flex flex-col overflow-hidden transition-opacity ${isMounted ? 'opacity-100' : 'opacity-0'}`}>
        <Header />
        <main className="flex-1 overflow-auto p-6 bg-background animate-fade-in">
          {children}
        </main>
      </div>
    </div>
  );
}

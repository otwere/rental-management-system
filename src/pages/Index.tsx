import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Building } from "lucide-react";
import { Button } from "@/components/ui/button";

const Index = () => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!isLoading && user) {
      // Redirect based on user role
      switch (user.role) {
        case "admin":
          navigate("/admin");
          break;
        case "agent":
          navigate("/agent");
          break;
        case "tenant":
          navigate("/tenant");
          break;
        default:
          navigate("/login");
      }
    }
  }, [user, isLoading, navigate]);
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/40">
        <div className="text-center">
          <div className="h-12 w-12 rounded-full border-4 border-primary border-t-transparent animate-spin mx-auto"></div>
          <p className="mt-4 text-lg font-medium">Loading...</p>
        </div>
      </div>
    );
  }
  
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/40 px-4">
        <div className="max-w-lg text-center">
          <div className="mx-auto h-16 w-16 rounded-full bg-primary flex items-center justify-center mb-6">
            <Building className="h-8 w-8 text-primary-foreground" />
          </div>
          <h1 className="text-4xl font-bold mb-4">Rental Management  Portal</h1>
          <p className="text-xl text-muted-foreground mb-8">
            Modern Property Management System for Admins, Agents, and Tenants
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" onClick={() => navigate("/login")}>
              Sign In
            </Button>
            <Button size="lg" variant="outline" onClick={() => navigate("/register")}>
              Create Account
            </Button>
          </div>
        </div>
      </div>
    );
  }
  
  return null;
};

export default Index;

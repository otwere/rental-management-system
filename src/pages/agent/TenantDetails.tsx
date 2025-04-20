
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import AdminTenantDetails from "../admin/TenantDetails";
import { useAuth } from "@/contexts/AuthContext";
import { DashboardLayout } from "@/components/layout/DashboardLayout";

export default function AgentTenantDetails() {
  const { id } = useParams<{ id: string }>();
  const { hasPermission } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Check if agent has permission to view tenant details
  useEffect(() => {
    if (!hasPermission("view:tenant_details")) {
      toast({
        title: "Access denied",
        description: "You don't have permission to view tenant details.",
        variant: "destructive"
      });
      navigate('/agent/tenants');
    }
  }, [hasPermission, navigate, toast]);

  // Reuse the AdminTenantDetails component with proper wrapper
  return (
    <DashboardLayout requiredPermission="view:tenant_details">
      <AdminTenantDetails />
    </DashboardLayout>
  );
}


import React, { Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import NotFound from "./pages/NotFound";
import { Footer } from "@/components/layout/Footer";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Index from "./pages/Index";

// Import admin pages
import { default as AdminDashboard } from "./pages/admin/Dashboard";
import { default as AdminProperties } from "./pages/admin/Properties";
import { default as AdminTenants } from "./pages/admin/Tenants";
import { default as AdminUsers } from "./pages/admin/Users";
import { default as AdminPayments } from "./pages/admin/Payments";
import { default as AdminReports } from "./pages/admin/Reports";
import { default as AdminSettings } from "./pages/admin/Settings";
import { default as AdminTenantDetails } from "./pages/admin/TenantDetails";
import { default as AdminAccounts } from "./pages/admin/Accounts";
import { default as AdminAccounting } from "./pages/admin/Accounting";

// Import agent pages
import { default as AgentDashboard } from "./pages/agent/Dashboard";
import { default as AgentTenantManagement } from "./pages/agent/TenantManagement";
import { default as AgentProperties } from "./pages/agent/Properties";
import { default as AgentApplications } from "./pages/agent/Applications";
import { default as AgentMaintenance } from "./pages/agent/Maintenance";
import { default as AgentSchedule } from "./pages/agent/Schedule";
import { default as AgentMessages } from "./pages/agent/Messages";
import { default as AgentPayments } from "./pages/agent/Payments";
import { default as AgentTenantDetails } from "./pages/agent/TenantDetails";

// Import tenant pages
import { default as TenantDashboard } from "./pages/tenant/Dashboard";
import { default as TenantPayments } from "./pages/tenant/Payments";

const queryClient = new QueryClient();

const RootRedirect = () => {
  const { user, isLoading } = useAuth();
  
  if (isLoading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  switch (user.role) {
    case "admin":
      return <Navigate to="/admin" replace />;
    case "agent":
      return <Navigate to="/agent" replace />;
    case "tenant":
      return <Navigate to="/tenant" replace />;
    default:
      return <Navigate to="/login" replace />;
  }
};

const App = () => (
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <div className="min-h-screen flex flex-col">
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                
                {/* Admin routes */}
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/admin/properties" element={<AdminProperties />} />
                <Route path="/admin/tenants" element={<AdminTenants />} />
                <Route path="/admin/users" element={<AdminUsers />} />
                <Route path="/admin/payments" element={<AdminPayments />} />
                <Route path="/admin/reports" element={<AdminReports />} />
                <Route path="/admin/settings" element={<AdminSettings />} />
                <Route path="/admin/tenants/:id" element={<AdminTenantDetails />} />
                <Route path="/admin/accounts" element={<AdminAccounts />} />
                <Route path="/admin/accounting" element={<AdminAccounting />} />
                
                {/* Agent routes */}
                <Route path="/agent" element={<AgentDashboard />} />
                <Route path="/agent/tenants" element={<AgentTenantManagement />} />
                <Route path="/agent/tenants/:id" element={<AgentTenantDetails />} />
                <Route path="/agent/properties" element={<AgentProperties />} />
                <Route path="/agent/applications" element={<AgentApplications />} />
                <Route path="/agent/maintenance" element={<AgentMaintenance />} />
                <Route path="/agent/schedule" element={<AgentSchedule />} />
                <Route path="/agent/messages" element={<AgentMessages />} />
                <Route path="/agent/payments" element={<AgentPayments />} />
                
                {/* Tenant routes */}
                <Route path="/tenant" element={<TenantDashboard />} />
                <Route path="/tenant/payments" element={
                  <Suspense fallback={<div className="flex items-center justify-center h-screen">Loading...</div>}>
                    <TenantPayments />
                  </Suspense>
                } />
                
                <Route path="*" element={<NotFound />} />
              </Routes>
              <Footer />
            </div>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  </React.StrictMode>
);

export default App;

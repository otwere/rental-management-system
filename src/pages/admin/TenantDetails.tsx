import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { CreditCard, FileText, Home, MessageSquare, Calendar, Bell } from "lucide-react";
import { TenantInfo } from "@/components/tenants/TenantInfo";
import { PaymentHistory } from "@/components/tenants/PaymentHistory";
import { Documents } from "@/components/tenants/Documents";
import { MaintenanceRequests } from "@/components/tenants/MaintenanceRequests";
import { Communications } from "@/components/tenants/Communications";
import { UnitInspections } from "@/components/tenants/UnitInspections";
import { LeaseViolations } from "@/components/tenants/LeaseViolations";
import { DepositRefundModal } from "@/components/tenants/DepositRefundModal";
import { AddEditTenantModal } from "@/components/tenants/AddEditTenantModal";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import type { DepositRefundData } from "@/components/tenants/DepositRefundModal";
import { ChevronDown } from "lucide-react";

export default function AdminTenantDetails() {
  const tenant = {
    id: "t1",
    name: "John Doe",
    email: "john@example.com",
    phone: "+1 (555) 123-4567",
    phoneNumber: "+1 (555) 123-4567",
    moveInDate: "2023-01-15",
    leaseEnd: "2024-01-14",
    leaseEndDate: "2024-01-14",
    unit: "Apt 301",
    rentAmount: 2500,
    deposit: 3000,
    status: "active",
    paymentStatus: "overdue" as "current" | "overdue",
    emergencyContact: {
      name: "Jane Doe",
      relationship: "Sister",
      phone: "+1 (555) 987-6543"
    },
    occupants: 2,
    balance: 2500,
    monthsDue: ["2024-03", "2024-04"],
    lastPaymentDate: "2024-02-01"
  };

  const paymentHistory = [
    { id: 1, date: "2024-03-01", amount: 2500, status: "paid", type: "Rent" },
    { id: 2, date: "2024-02-01", amount: 2500, status: "paid", type: "Rent" },
    { id: 3, date: "2024-01-01", amount: 2500, status: "paid", type: "Rent" },
  ];

  const documents = [
    { id: 1, name: "Lease Agreement", date: "2023-01-15", type: "PDF" },
    { id: 2, name: "Proof of Income", date: "2023-01-10", type: "PDF" },
    { id: 3, name: "ID Document", date: "2023-01-10", type: "Image" },
  ];

  const maintenanceRequests = [
    { id: 1, date: "2024-03-10", issue: "Plumbing", status: "pending" },
    { id: 2, date: "2024-02-15", issue: "HVAC", status: "completed" },
  ];

  const inspections = [
    { 
      id: 1, 
      date: "2024-03-01", 
      type: "Quarterly", 
      status: "passed" 
    },
    { 
      id: 2, 
      date: "2023-12-01", 
      type: "Annual", 
      status: "passed",
      findings: "Minor wall repair needed" 
    }
  ];

  const violations = [
    {
      id: 1,
      date: "2024-02-15",
      type: "Noise",
      description: "Complaint from neighbors about loud music",
      status: "resolved",
      resolution: "Verbal warning issued"
    }
  ];

  const [showEditModal, setShowEditModal] = useState(false);
  const [showDepositRefundModal, setShowDepositRefundModal] = useState(false);
  const { toast } = useToast();

  const handleEditTenant = (updatedTenant: any) => {
    toast({
      title: "Tenant Updated",
      description: "Tenant information has been successfully updated."
    });
    setShowEditModal(false);
  };

  const handleDepositRefund = (refundData: DepositRefundData) => {
    toast({
      title: "Deposit Refund Processed",
      description: `Successfully processed deposit refund of $${refundData.amount.toFixed(2)} via ${getRefundMethodText(refundData.refundMethod)}`,
    });
    
    setTimeout(() => {
      const deductionsTotal = refundData.deductions.reduce((sum, d) => sum + d.amount, 0);
      if (deductionsTotal > 0) {
        toast({
          title: "Deductions Applied",
          description: `${refundData.deductions.length} deductions totaling $${deductionsTotal.toFixed(2)} were applied to the deposit.`
        });
      }
    }, 500);
    
    setShowDepositRefundModal(false);
  };

  const getRefundMethodText = (method?: string) => {
    switch (method) {
      case 'mpesa': return 'M-Pesa';
      case 'bank_transfer': return 'Bank Transfer';
      case 'cheque': return 'Cheque';
      case 'cash': return 'Cash';
      default: return method || 'Unknown Method';
    }
  };

  return (
    <DashboardLayout requiredPermission="manage:tenants">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Tenant Details</h1>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setShowEditModal(true)}>
              <ChevronDown className="h-4 w-4 mr-2" />
              Edit Tenant
            </Button>
            <Button 
              onClick={() => setShowDepositRefundModal(true)}
              className="bg-primary"
            >
              Process Deposit Refund
            </Button>
          </div>
        </div>

        <TenantInfo tenant={tenant} />

        <Tabs defaultValue="payments" className="space-y-4">
          <TabsList>
            <TabsTrigger value="payments">
              <CreditCard className="h-4 w-4 mr-2" />
              Payments
            </TabsTrigger>
            <TabsTrigger value="documents">
              <FileText className="h-4 w-4 mr-2" />
              Documents
            </TabsTrigger>
            <TabsTrigger value="maintenance">
              <Home className="h-4 w-4 mr-2" />
              Maintenance
            </TabsTrigger>
            <TabsTrigger value="inspections">
              <Calendar className="h-4 w-4 mr-2" />
              Inspections
            </TabsTrigger>
            <TabsTrigger value="violations">
              <Bell className="h-4 w-4 mr-2" />
              Violations
            </TabsTrigger>
            <TabsTrigger value="communications">
              <MessageSquare className="h-4 w-4 mr-2" />
              Communications
            </TabsTrigger>
          </TabsList>

          <TabsContent value="payments">
            <PaymentHistory payments={paymentHistory} />
          </TabsContent>

          <TabsContent value="documents">
            <Documents documents={documents} />
          </TabsContent>

          <TabsContent value="maintenance">
            <MaintenanceRequests requests={maintenanceRequests} />
          </TabsContent>

          <TabsContent value="inspections">
            <UnitInspections inspections={inspections} />
          </TabsContent>

          <TabsContent value="violations">
            <LeaseViolations violations={violations} />
          </TabsContent>

          <TabsContent value="communications">
            <Communications />
          </TabsContent>
        </Tabs>

        <AddEditTenantModal
          open={showEditModal}
          onClose={() => setShowEditModal(false)}
          onSubmit={handleEditTenant}
          tenant={tenant}
        />

        <DepositRefundModal
          open={showDepositRefundModal}
          onClose={() => setShowDepositRefundModal(false)}
          onSubmit={handleDepositRefund}
          tenant={tenant}
        />
      </div>
    </DashboardLayout>
  );
}

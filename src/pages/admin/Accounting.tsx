
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RecordPaymentModal } from "@/components/payments/RecordPaymentModal";
import { TransactionsTable } from "@/components/payments/TransactionsTable";
import { PaymentDetailsBreakdown } from "@/components/payments/PaymentDetailsBreakdown";
import { useState } from "react";
import { 
  BadgeDollarSign, 
  Receipt, 
  Wallet, 
  ChartBar,
  CreditCard,
  Calculator
} from "lucide-react";

// Mock data - replace with real data from your backend
const mockTransactions = [
  {
    id: 1,
    date: "2024-04-20",
    reference: "TRX-001",
    amount: 1500,
    paymentMethod: "Bank Transfer",
    status: "paid",
    tenant: { name: "John Doe", unit: "A101" },
    type: "Rent Payment",
    balance: 0
  },
  {
    id: 2,
    date: "2024-04-19",
    reference: "TRX-002",
    amount: 1200,
    paymentMethod: "Credit Card",
    status: "pending",
    tenant: { name: "Jane Smith", unit: "B202" },
    type: "Deposit",
    balance: 0
  }
];

const mockSummary = {
  totalRevenue: 45000,
  outstandingPayments: 3500,
  overduePayments: 1200,
  monthlyIncome: 15000,
  expenses: 8000,
  netIncome: 7000
};

export default function AccountingPage() {
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<any>(null);

  const handleViewReceipt = (transaction: any) => {
    setSelectedTransaction(transaction);
  };

  const handleViewStatement = (transaction: any) => {
    // Implement statement view logic
    console.log("View statement for:", transaction);
  };

  // Mock tenants data
  const tenants = [
    { id: "1", name: "John Doe", unit: "A101" },
    { id: "2", name: "Jane Smith", unit: "B202" }
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Accounting</h1>
          <Button onClick={() => setIsPaymentModalOpen(true)}>
            <Receipt className="mr-2 h-4 w-4" />
            Record Payment
          </Button>
        </div>

        {/* Financial Summary Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <BadgeDollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${mockSummary.totalRevenue.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">+12% from last month</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Outstanding Payments</CardTitle>
              <Wallet className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${mockSummary.outstandingPayments.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">From 8 tenants</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Monthly Income</CardTitle>
              <ChartBar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${mockSummary.monthlyIncome.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">Net: ${mockSummary.netIncome.toLocaleString()}</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="transactions" className="space-y-4">
          <TabsList>
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
            <TabsTrigger value="analysis">Analysis</TabsTrigger>
          </TabsList>

          <TabsContent value="transactions" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Recent Transactions</CardTitle>
              </CardHeader>
              <CardContent>
                <TransactionsTable
                  transactions={mockTransactions}
                  onViewReceipt={handleViewReceipt}
                  onViewStatement={handleViewStatement}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reports" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calculator className="h-4 w-4" />
                    Income Statement
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Total Revenue</span>
                      <span className="font-medium">${mockSummary.totalRevenue.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Total Expenses</span>
                      <span className="font-medium">-${mockSummary.expenses.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between pt-2 border-t">
                      <span className="font-medium">Net Income</span>
                      <span className="font-bold text-primary">${mockSummary.netIncome.toLocaleString()}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-4 w-4" />
                    Payment Summary
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Collected</span>
                      <span className="font-medium text-green-600">
                        ${(mockSummary.totalRevenue - mockSummary.outstandingPayments).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Outstanding</span>
                      <span className="font-medium text-yellow-600">
                        ${mockSummary.outstandingPayments.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Overdue</span>
                      <span className="font-medium text-red-600">
                        ${mockSummary.overduePayments.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="analysis" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Financial Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Detailed financial analysis and trends will be displayed here.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Modals */}
        <RecordPaymentModal
          open={isPaymentModalOpen}
          onClose={() => setIsPaymentModalOpen(false)}
          onSubmit={(data) => {
            console.log("Payment recorded:", data);
            setIsPaymentModalOpen(false);
          }}
          tenants={tenants}
        />

        {selectedTransaction && (
          <PaymentDetailsBreakdown
            payment={{
              ...selectedTransaction,
              breakdown: {
                rent: selectedTransaction.amount,
                utilities: 0,
              },
            }}
          />
        )}
      </div>
    </DashboardLayout>
  );
}

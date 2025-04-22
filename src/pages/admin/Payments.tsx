import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Calendar, CreditCard, Download, FileText, Filter, Receipt, Wallet } from "lucide-react";
import { PaymentHistory } from "@/components/tenants/PaymentHistory";
import { StatementGenerator } from "@/components/tenants/StatementGenerator";
import { useToast } from "@/hooks/use-toast";
import { RecordPaymentModal } from "@/components/payments/RecordPaymentModal";
import { TransactionsTable } from "@/components/payments/TransactionsTable";
import { ReceiptGenerator } from "@/components/tenants/ReceiptGenerator";

const PAYMENT_HISTORY = [
  {
    id: 1,
    date: "2025-03-01",
    amount: 2500,
    status: "paid",
    type: "Rent",
    monthsPaid: "Mar 2025",
    paymentMode: "Bank Transfer",
    reference: "TRX2385723"
  },
  {
    id: 2,
    date: "2025-02-01",
    amount: 2500,
    status: "paid",
    type: "Rent",
    monthsPaid: "Feb 2025",
    paymentMode: "Credit Card",
    reference: "CC9876543"
  },
  {
    id: 3,
    date: "2025-01-01",
    amount: 2500,
    status: "paid",
    type: "Rent",
    monthsPaid: "Jan 2025",
    paymentMode: "Bank Transfer",
    reference: "TRX1238975"
  },
];

const TENANTS_FINANCIAL_DATA = [
  {
    id: 1,
    name: "John Smith",
    unit: "Apt 101",
    email: "john@example.com",
    balance: 0,
    deposit: 3000,
    depositStatus: "held",
    lastPayment: "2025-03-01",
    paymentStatus: "current"
  },
  {
    id: 2,
    name: "Sarah Johnson",
    unit: "Apt 205",
    email: "sarah@example.com",
    balance: 2500,
    deposit: 3000,
    depositStatus: "held",
    lastPayment: "2025-02-15",
    paymentStatus: "overdue"
  },
  {
    id: 3,
    name: "Michael Brown",
    unit: "Apt 310",
    email: "michael@example.com",
    balance: 0,
    deposit: 3000,
    depositStatus: "held",
    lastPayment: "2025-03-02",
    paymentStatus: "current"
  },
  {
    id: 4,
    name: "Lisa Wilson",
    unit: "Apt 412",
    email: "lisa@example.com",
    balance: 1200,
    deposit: 3000,
    depositStatus: "held",
    lastPayment: "2025-01-15",
    paymentStatus: "overdue"
  },
];

export default function AdminPayments() {
  const [activeTab, setActiveTab] = useState("overview");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTenant, setSelectedTenant] = useState<any>(null);
  const [showStatementDialog, setShowStatementDialog] = useState(false);
  const [statementData, setStatementData] = useState<any>(null);
  const [showRecordPaymentModal, setShowRecordPaymentModal] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState<any>(null);
  const { toast } = useToast();

  const filteredTenants = TENANTS_FINANCIAL_DATA.filter(tenant => 
    tenant.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    tenant.unit.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalRevenue = PAYMENT_HISTORY.reduce((sum, payment) => sum + payment.amount, 0);
  const overduePayments = TENANTS_FINANCIAL_DATA.filter(t => t.paymentStatus === "overdue").length;
  const collectionRate = Math.round(((TENANTS_FINANCIAL_DATA.length - overduePayments) / TENANTS_FINANCIAL_DATA.length) * 100);

  const generateStatementForTenant = (tenant: any) => {
    const statementData = {
      id: `ST-${tenant.id}-${Date.now()}`,
      tenantName: tenant.name,
      tenantEmail: tenant.email,
      unit: tenant.unit,
      period: {
        from: "2025-01-01",
        to: "2025-03-31"
      },
      charges: [
        { description: "Monthly Rent - January 2025", amount: 2500 },
        { description: "Monthly Rent - February 2025", amount: 2500 },
        { description: "Monthly Rent - March 2025", amount: 2500 },
        { description: "Late Fee - February 2025", amount: tenant.balance > 0 ? 100 : 0 }
      ],
      payments: PAYMENT_HISTORY.filter(() => Math.random() > 0.3).map(payment => ({
        date: payment.date,
        amount: payment.amount,
        reference: payment.reference
      })),
      balance: tenant.balance,
      dueDate: "2025-04-05"
    };
    
    setStatementData(statementData);
    setShowStatementDialog(true);
  };

  const handleDownloadReport = () => {
    toast({
      title: "Report Downloaded",
      description: "The financial report has been downloaded successfully.",
    });
  };

  const handleRecordPayment = (paymentData: any) => {
    toast({
      title: "Payment Recorded",
      description: "The payment has been successfully recorded.",
    });
  };

  return (
    <DashboardLayout requiredPermission="manage:payments">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h1 className="text-3xl font-bold">Payments Overview</h1>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" onClick={handleDownloadReport}>
              <Download className="h-4 w-4 mr-2" />
              Export Report
            </Button>
            <Button onClick={() => setShowRecordPaymentModal(true)}>
              <CreditCard className="h-4 w-4 mr-2" />
              Record Payment
            </Button>
          </div>
        </div>

        <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3 lg:w-auto lg:inline-flex">
            <TabsTrigger value="overview">Dashboard</TabsTrigger>
            <TabsTrigger value="tenants">Tenant Payments</TabsTrigger>
            <TabsTrigger value="history">Payment History</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-3">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle>Total Revenue</CardTitle>
                  <CardDescription>This quarter</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">${totalRevenue.toLocaleString()}</div>
                  <p className="text-sm text-muted-foreground">+12.3% from last quarter</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle>Pending Payments</CardTitle>
                  <CardDescription>Overdue accounts</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{overduePayments}</div>
                  <p className="text-sm text-muted-foreground">
                    ${TENANTS_FINANCIAL_DATA.reduce((sum, tenant) => sum + tenant.balance, 0).toLocaleString()} total outstanding
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle>Collection Rate</CardTitle>
                  <CardDescription>Current quarter</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{collectionRate}%</div>
                  <Progress value={collectionRate} className="mt-2" />
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Transactions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {PAYMENT_HISTORY.slice(0, 3).map((payment) => (
                      <div key={payment.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-4">
                          <div className="p-2 bg-primary/10 rounded-full">
                            <CreditCard className="h-4 w-4 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium">{payment.type}</p>
                            <p className="text-sm text-muted-foreground">{payment.reference}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">${payment.amount}</p>
                          <p className="text-sm text-muted-foreground">{payment.date}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Financial Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-sm text-muted-foreground">Rental Revenue</p>
                        <p className="font-medium">${totalRevenue.toLocaleString()}</p>
                      </div>
                      <Progress value={100} className="h-2" />
                    </div>
                    
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-sm text-muted-foreground">Security Deposits Held</p>
                        <p className="font-medium">
                          ${TENANTS_FINANCIAL_DATA.reduce((sum, tenant) => sum + tenant.deposit, 0).toLocaleString()}
                        </p>
                      </div>
                      <Progress value={100} className="h-2" />
                    </div>
                    
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-sm text-muted-foreground">Overdue Payments</p>
                        <p className="font-medium">
                          ${TENANTS_FINANCIAL_DATA.reduce((sum, tenant) => sum + tenant.balance, 0).toLocaleString()}
                        </p>
                      </div>
                      <Progress value={20} className="h-2 bg-muted" />
                    </div>
                    
                    <div className="pt-4 border-t">
                      <div className="flex items-center justify-between">
                        <p className="font-medium">Collection Efficiency</p>
                        <div className="text-right">
                          <p className="font-bold">{collectionRate}%</p>
                          <p className="text-xs text-muted-foreground">Target: 95%</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="tenants" className="space-y-6">
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle>Tenant Financial Status</CardTitle>
                  <div className="flex items-center gap-2">
                    <Input 
                      placeholder="Search tenants..." 
                      className="w-64" 
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <Button size="sm" variant="outline">
                      <Filter className="h-4 w-4 mr-2" />
                      Filter
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Tenant</TableHead>
                      <TableHead>Unit</TableHead>
                      <TableHead>Deposit</TableHead>
                      <TableHead>Balance</TableHead>
                      <TableHead>Last Payment</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTenants.map((tenant) => (
                      <TableRow key={tenant.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{tenant.name}</p>
                            <p className="text-sm text-muted-foreground">{tenant.email}</p>
                          </div>
                        </TableCell>
                        <TableCell>{tenant.unit}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <span>${tenant.deposit}</span>
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              tenant.depositStatus === 'held' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                            }`}>
                              {tenant.depositStatus === 'held' ? 'Held' : 'Refunded'}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className={tenant.balance > 0 ? "text-red-600 font-medium" : "text-green-600 font-medium"}>
                            ${tenant.balance}
                          </span>
                        </TableCell>
                        <TableCell>{tenant.lastPayment}</TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            tenant.paymentStatus === 'current' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {tenant.paymentStatus === 'current' ? 'Current' : 'Overdue'}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline" onClick={() => setSelectedTenant(tenant)}>
                              <Receipt className="h-4 w-4 mr-1" />
                              Payments
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => generateStatementForTenant(tenant)}>
                              <FileText className="h-4 w-4 mr-1" />
                              Statement
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            <Dialog open={!!selectedTenant} onOpenChange={(open) => !open && setSelectedTenant(null)}>
              <DialogContent className="max-w-4xl">
                <DialogHeader>
                  <DialogTitle>Payment History - {selectedTenant?.name}</DialogTitle>
                  <DialogDescription>Unit: {selectedTenant?.unit}</DialogDescription>
                </DialogHeader>
                
                {selectedTenant && (
                  <PaymentHistory 
                    payments={PAYMENT_HISTORY}
                    monthsDue={selectedTenant.balance > 0 ? ["2025-04"] : []}
                  />
                )}
              </DialogContent>
            </Dialog>
          </TabsContent>

          <TabsContent value="history" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>All Transactions</CardTitle>
                  <div className="flex items-center gap-2">
                    <Button size="sm" variant="outline">
                      <Calendar className="h-4 w-4 mr-2" />
                      Date Range
                    </Button>
                    <Button size="sm" variant="outline">
                      <Filter className="h-4 w-4 mr-2" />
                      Filter
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <TransactionsTable
                  transactions={PAYMENT_HISTORY.map(payment => ({
                    ...payment,
                    tenant: {
                      name: TENANTS_FINANCIAL_DATA.find(t => t.id === 1)?.name || "Unknown",
                      unit: TENANTS_FINANCIAL_DATA.find(t => t.id === 1)?.unit || "Unknown"
                    },
                    paymentMethod: payment.paymentMode || "Cash"
                  }))}
                  onViewReceipt={(transaction) => {
                    setSelectedReceipt({
                      id: String(transaction.id),
                      date: transaction.date,
                      tenantName: transaction.tenant.name,
                      tenantEmail: "tenant@example.com",
                      amount: transaction.amount,
                      paymentType: transaction.paymentMethod,
                      reference: transaction.reference,
                      status: transaction.status,
                      unit: transaction.tenant.unit
                    });
                  }}
                  onViewStatement={(transaction) => {
                    generateStatementForTenant({
                      name: transaction.tenant.name,
                      unit: transaction.tenant.unit,
                      id: 1,
                      email: "tenant@example.com"
                    });
                  }}
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      
      <StatementGenerator
        open={showStatementDialog}
        onClose={() => setShowStatementDialog(false)}
        statement={statementData}
      />

      <RecordPaymentModal
        open={showRecordPaymentModal}
        onClose={() => setShowRecordPaymentModal(false)}
        onSubmit={handleRecordPayment}
        tenants={TENANTS_FINANCIAL_DATA.map(tenant => ({
          id: String(tenant.id),
          name: tenant.name,
          unit: tenant.unit
        }))}
      />

      <ReceiptGenerator
        open={!!selectedReceipt}
        onClose={() => setSelectedReceipt(null)}
        receipt={selectedReceipt}
      />
    </DashboardLayout>
  );
}

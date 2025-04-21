import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { useEffect, useState } from "react";
import { formatCurrency, formatPaymentDate } from "@/utils/paymentUtils";
import { CheckCircle, Download, CreditCard, FileText } from "lucide-react";
import { TenantPaymentModal } from "@/components/tenants/TenantPaymentModal";

// Mock data for payment history
const MOCK_PAYMENT_HISTORY = [
  {
    id: "pay1",
    date: "2025-04-01",
    amount: 2500,
    status: "paid",
    reference: "MP123456",
    method: "mpesa",
    property: {
      id: "prop1",
      name: "Modern Downtown Apartment",
      unit: "Unit 205"
    }
  },
  {
    id: "pay2",
    date: "2025-03-01",
    amount: 2500,
    status: "paid",
    reference: "MP789012",
    method: "mpesa",
    property: {
      id: "prop1",
      name: "Modern Downtown Apartment",
      unit: "Unit 205"
    }
  },
  {
    id: "pay3",
    date: "2025-02-01",
    amount: 2500,
    status: "paid",
    reference: "BANK123",
    method: "bank",
    property: {
      id: "prop1",
      name: "Modern Downtown Apartment",
      unit: "Unit 205"
    }
  }
];

export default function TenantPayments() {
  const [paymentHistory, setPaymentHistory] = useState(MOCK_PAYMENT_HISTORY);
  const [paymentModal, setPaymentModal] = useState(false);
  
  // Simulate adding a new payment to history when a successful payment is made
  const handlePaymentSuccess = (paymentDetails: any) => {
    setPaymentHistory(prev => [paymentDetails, ...prev]);
  };
  
  return (
    <DashboardLayout requiredPermission="view:dashboard">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">My Payments</h1>
          <Button onClick={() => setPaymentModal(true)}>
            <CreditCard className="h-4 w-4 mr-2" />
            Make Payment
          </Button>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Payment Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="text-sm text-green-600 font-medium">Current Month</div>
                <div className="text-2xl font-bold mt-1">{formatCurrency(2500)}</div>
                <div className="text-sm text-green-700 mt-1 flex items-center">
                  <CheckCircle className="h-4 w-4 mr-1" /> Paid on {formatPaymentDate("2025-04-01")}
                </div>
              </div>
              
              <div className="bg-primary/10 p-4 rounded-lg">
                <div className="text-sm font-medium">Next Payment</div>
                <div className="text-2xl font-bold mt-1">{formatCurrency(2500)}</div>
                <div className="text-sm text-muted-foreground mt-1">Due on May 1, 2025</div>
              </div>
              
              <div className="bg-muted p-4 rounded-lg">
                <div className="text-sm font-medium">Balance</div>
                <div className="text-2xl font-bold mt-1">{formatCurrency(0)}</div>
                <div className="text-sm text-muted-foreground mt-1">Current balance</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Tabs defaultValue="history">
          <TabsList>
            <TabsTrigger value="history">Payment History</TabsTrigger>
            <TabsTrigger value="receipts">Receipts & Statements</TabsTrigger>
          </TabsList>
          
          <TabsContent value="history" className="mt-4">
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Property</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Reference</TableHead>
                      <TableHead>Method</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paymentHistory.map((payment) => (
                      <TableRow key={payment.id}>
                        <TableCell>{formatPaymentDate(payment.date)}</TableCell>
                        <TableCell>
                          <div>{payment.property.name}</div>
                          <div className="text-xs text-muted-foreground">{payment.property.unit}</div>
                        </TableCell>
                        <TableCell className="font-medium">{formatCurrency(payment.amount)}</TableCell>
                        <TableCell>{payment.reference}</TableCell>
                        <TableCell className="capitalize">{payment.method}</TableCell>
                        <TableCell>
                          <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="receipts" className="mt-4">
            <Card>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {paymentHistory.map((payment) => (
                    <div key={payment.id} className="flex justify-between items-center p-3 border rounded-lg">
                      <div>
                        <div className="font-medium">Payment Receipt - {formatPaymentDate(payment.date)}</div>
                        <div className="text-sm text-muted-foreground">{payment.reference}</div>
                      </div>
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-2" />
                        Receipt
                      </Button>
                    </div>
                  ))}
                  
                  <div className="flex justify-between items-center p-3 border rounded-lg">
                    <div>
                      <div className="font-medium">Yearly Statement - 2025</div>
                      <div className="text-sm text-muted-foreground">For tax purposes</div>
                    </div>
                    <Button variant="outline" size="sm">
                      <FileText className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      
      <TenantPaymentModal 
        open={paymentModal} 
        onClose={() => setPaymentModal(false)}
        onPaymentSuccess={handlePaymentSuccess}
      />
    </DashboardLayout>
  );
}

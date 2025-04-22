
import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CheckCircle, Circle, CreditCard, FileText, Filter, Plus, Search, Send, User, Wallet } from "lucide-react";
import { CalendarDateRangePicker } from "@/components/ui/calendar-date-range-picker"
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { Textarea } from "@/components/ui/textarea";
import { DateRange } from "react-day-picker";

type PaymentType = "rent" | "security_deposit" | "late_fee" | "utility" | "other" | "all";

interface Payment {
  id: string;
  tenantId: string;
  tenantName: string;
  propertyId: string;
  propertyName: string;
  amount: number;
  date: Date; // Required field in Payment type
  dueDate: Date;
  method: "cash" | "check" | "bank_transfer" | "credit_card";
  type: PaymentType;
  status: "pending" | "completed" | "failed";
}

export default function AgentPayments() {
  const [searchTerm, setSearchTerm] = useState("");
  const [paymentType, setPaymentType] = useState<PaymentType>("rent");
  const [paymentMethod, setPaymentMethod] = useState<string>("all");
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  const [showPaymentDetails, setShowPaymentDetails] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [amount, setAmount] = useState(100);
  const [type, setType] = useState<PaymentType>("rent");
  const { toast } = useToast();
  
  // Update mock payments to include the required date field
  const [payments, setPayments] = useState<Payment[]>([
    {
      id: "pmt-1",
      tenantId: "tenant-1",
      tenantName: "John Doe",
      propertyId: "1",
      propertyName: "Sunset Apartments",
      amount: 1500,
      date: new Date(2024, 3, 1), // Add date field
      dueDate: new Date(2024, 3, 1),
      method: "bank_transfer",
      type: "rent",
      status: "completed"
    },
    {
      id: "pmt-2",
      tenantId: "tenant-2",
      tenantName: "Jane Smith",
      propertyId: "2",
      propertyName: "Urban Lofts",
      amount: 2000,
      date: new Date(2024, 2, 15), // Add date field
      dueDate: new Date(2024, 2, 15),
      method: "cash",
      type: "rent",
      status: "completed"
    },
    {
      id: "pmt-3",
      tenantId: "tenant-3",
      tenantName: "Robert Davis",
      propertyId: "3",
      propertyName: "Maple Grove Townhomes",
      amount: 1800,
      date: new Date(2024, 2, 28), // Add date field
      dueDate: new Date(2024, 2, 28),
      method: "check",
      type: "rent",
      status: "completed"
    },
    {
      id: "pmt-4",
      tenantId: "tenant-4",
      tenantName: "Emma Johnson",
      propertyId: "2",
      propertyName: "Urban Lofts",
      amount: 1200,
      date: new Date(2024, 3, 5), // Add date field
      dueDate: new Date(2024, 3, 5),
      method: "credit_card",
      type: "rent",
      status: "pending"
    },
    {
      id: "pmt-5",
      tenantId: "tenant-1",
      tenantName: "John Doe",
      propertyId: "1",
      propertyName: "Sunset Apartments",
      amount: 50,
      date: new Date(2024, 3, 8), // Add date field
      dueDate: new Date(2024, 3, 8),
      method: "bank_transfer",
      type: "late_fee",
      status: "completed"
    },
    {
      id: "pmt-6",
      tenantId: "tenant-2",
      tenantName: "Jane Smith",
      propertyId: "2",
      propertyName: "Urban Lofts",
      amount: 75,
      date: new Date(2024, 3, 10), // Add date field
      dueDate: new Date(2024, 3, 10),
      method: "cash",
      type: "utility",
      status: "completed"
    },
  ]);
  
  // Filter payments based on search term, payment type, payment method, and date range
  const filteredPayments = payments.filter(payment => {
    const matchesSearch =
      payment.tenantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.propertyName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = paymentType === "all" || payment.type === paymentType;
    const matchesMethod = paymentMethod === "all" || payment.method === paymentMethod;
    
    const matchesDateRange = !dateRange || (
      payment.dueDate >= dateRange?.from! && payment.dueDate <= dateRange?.to!
    );
    
    return matchesSearch && matchesType && matchesMethod && matchesDateRange;
  });
  
  // Handle viewing payment details
  const handleViewPayment = (payment: Payment) => {
    setSelectedPayment(payment);
    setShowPaymentDetails(true);
  };
  
  // Function to format date
  const formatDate = (date: Date): string => {
    return format(date, "MMM dd, yyyy");
  };
  
  // Function to calculate total revenue
  const calculateTotalRevenue = (): number => {
    return payments
      .filter(payment => payment.status === "completed")
      .reduce((total, payment) => total + payment.amount, 0);
  };
  
  // Function to create a pending payment reminder
  const createPendingPayment = (dueDate: Date) => {
    const newPayment: Payment = {
      id: `pmt-${Date.now()}`,
      tenantId: "tenant-2",
      tenantName: "Jane Smith",
      propertyId: "2",
      propertyName: "Urban Lofts",
      amount: 2000,
      date: new Date(), // Add date field for new payments
      dueDate: dueDate,
      method: "bank_transfer",
      type: "rent",
      status: "pending"
    };
    
    setPayments([...payments, newPayment]);
    
    toast({
      title: "Reminder sent",
      description: `Payment reminder has been sent to Jane Smith.`
    });
  };

  return (
    <DashboardLayout requiredPermission="view:payments">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Payments & Transactions</h1>
          <div className="flex items-center gap-4">
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search payments..."
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80">
                <div className="grid gap-4">
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium leading-none">Type</h4>
                    <Select 
                      value={paymentType} 
                      onValueChange={(value: PaymentType) => setPaymentType(value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="All" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All</SelectItem>
                        <SelectItem value="rent">Rent</SelectItem>
                        <SelectItem value="security_deposit">Security Deposit</SelectItem>
                        <SelectItem value="late_fee">Late Fee</SelectItem>
                        <SelectItem value="utility">Utility</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium leading-none">Method</h4>
                    <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                      <SelectTrigger>
                        <SelectValue placeholder="All" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All</SelectItem>
                        <SelectItem value="cash">Cash</SelectItem>
                        <SelectItem value="check">Check</SelectItem>
                        <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                        <SelectItem value="credit_card">Credit Card</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium leading-none">Date Range</h4>
                    <CalendarDateRangePicker date={dateRange} onDateChange={setDateRange} />
                  </div>
                </div>
              </PopoverContent>
            </Popover>
            <Drawer>
              <DrawerTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Record Payment
                </Button>
              </DrawerTrigger>
              <DrawerContent>
                <DrawerHeader>
                  <DrawerTitle>Record New Payment</DrawerTitle>
                  <DrawerDescription>
                    Record a new payment transaction manually.
                  </DrawerDescription>
                </DrawerHeader>
                <div className="grid gap-4 p-4">
                  <div className="space-y-2">
                    <label htmlFor="amount" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed">
                      Amount
                    </label>
                    <Input
                      id="amount"
                      placeholder="Payment amount"
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(Number(e.target.value))}
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="type" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed">
                      Type
                    </label>
                    <Select 
                      value={type} 
                      onValueChange={(value: PaymentType) => setType(value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select payment type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="rent">Rent</SelectItem>
                        <SelectItem value="security_deposit">Security Deposit</SelectItem>
                        <SelectItem value="late_fee">Late Fee</SelectItem>
                        <SelectItem value="utility">Utility</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DrawerFooter>
                  <Button>Record Payment</Button>
                </DrawerFooter>
              </DrawerContent>
            </Drawer>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Revenue
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${calculateTotalRevenue()}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Pending Payments
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {payments.filter(payment => payment.status === "pending").length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Avg. Payment Amount
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${(calculateTotalRevenue() / payments.filter(payment => payment.status === "completed").length).toFixed(2) || 0}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Last Payment Date
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatDate(payments[payments.length - 1].dueDate)}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Payment Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tenant</TableHead>
                  <TableHead>Property</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Method</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPayments.map((payment) => (
                  <TableRow key={payment.id}>
                    <TableCell className="font-medium">{payment.tenantName}</TableCell>
                    <TableCell>{payment.propertyName}</TableCell>
                    <TableCell>{payment.type}</TableCell>
                    <TableCell>${payment.amount}</TableCell>
                    <TableCell>{payment.method}</TableCell>
                    <TableCell>{formatDate(payment.dueDate)}</TableCell>
                    <TableCell>
                      {payment.status === "pending" ? (
                        <Badge variant="secondary">Pending</Badge>
                      ) : payment.status === "completed" ? (
                        <Badge variant="default">Completed</Badge>
                      ) : (
                        <Badge variant="destructive">Failed</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="outline" size="sm" onClick={() => handleViewPayment(payment)}>
                        View Details
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredPayments.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-4">
                      No payments found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
      
      {/* PaymentBreakdown component */}
      <PaymentBreakdown paymentAmount={amount} paymentType={type} />
      
      {/* Payment Details Modal */}
      <Drawer open={showPaymentDetails} onOpenChange={setShowPaymentDetails}>
        <DrawerContent className="text-foreground">
          <DrawerHeader>
            <DrawerTitle>Payment Details</DrawerTitle>
            <DrawerDescription>
              View detailed information about this payment transaction.
            </DrawerDescription>
          </DrawerHeader>
          <div className="p-4">
            {selectedPayment && (
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium">Transaction Information</h3>
                  <div className="grid grid-cols-2 gap-4 mt-2">
                    <div>
                      <p className="text-sm text-muted-foreground">Tenant</p>
                      <p className="font-medium">{selectedPayment.tenantName}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Property</p>
                      <p className="font-medium">{selectedPayment.propertyName}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Amount</p>
                      <p className="font-medium">${selectedPayment.amount}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Type</p>
                      <p className="font-medium">{selectedPayment.type}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Method</p>
                      <p className="font-medium">{selectedPayment.method}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Status</p>
                      <p className="font-medium">{selectedPayment.status}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Due Date</p>
                      <p className="font-medium">{formatDate(selectedPayment.dueDate)}</p>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium">Actions</h3>
                  <div className="flex gap-2 mt-2">
                    {selectedPayment.status === "pending" && (
                      <>
                        <Button variant="default">
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Mark as Completed
                        </Button>
                        <Button variant="destructive">
                          <Circle className="h-4 w-4 mr-2" />
                          Mark as Failed
                        </Button>
                      </>
                    )}
                    <Button variant="outline">
                      <FileText className="h-4 w-4 mr-2" />
                      Generate Receipt
                    </Button>
                  </div>
                </div>
                
                {selectedPayment.status === "pending" && (
                  <div className="mt-6">
                    <Button variant="secondary" onClick={() => createPendingPayment(selectedPayment.dueDate)}>
                      <Send className="h-4 w-4 mr-2" />
                      Send Payment Reminder
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>
          <DrawerFooter>
            <DrawerClose>
              <Button variant="outline">Close</Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </DashboardLayout>
  );
}

// Update PaymentBreakdown component definition if needed
interface PaymentBreakdownProps {
  paymentAmount: number;
  paymentType: PaymentType;
}

function PaymentBreakdown({ paymentAmount, paymentType }: PaymentBreakdownProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Payment Breakdown</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <div className="flex items-center justify-between">
            <span>Amount:</span>
            <span>${paymentAmount}</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Type:</span>
            <span>{paymentType}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

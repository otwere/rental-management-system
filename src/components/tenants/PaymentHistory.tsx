import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { ReceivePaymentModal } from "./ReceivePaymentModal";
import { PaymentDetailsDialog } from "./PaymentDetailsDialog";
import { Receipt } from "lucide-react";
import { ReceiptGenerator } from "./ReceiptGenerator";
import { formatCurrency, getPaymentStatusColor } from "@/utils/paymentUtils";

/**
 * Payment interface is unchanged; expand as needed.
 */
interface Payment {
  id: number;
  date: string;
  amount: number;
  status: string;
  type: string;
  balance?: number;
  monthsPaid?: number;
  paymentMode?: string;
  details?: string;
  reference?: string;
}

interface PaymentHistoryProps {
  payments: Payment[];
  monthsDue?: string[];      // Current due months, e.g. ["2024-03", "2024-04"]
  monthsAdvance?: string[];  // Advance months, e.g. ["2024-05", "2024-06"], optional/future
  onReceivePayment?: (
    info: { monthsPaid: string[], paymentMode: string, slipOrMpesa: string, type: "due"|"advance" }
  ) => void;
}

function getMonthName(monthStr: string) {
  // "2024-03" => Mar 2024
  const [year, month] = monthStr.split("-");
  const date = new Date(Number(year), Number(month)-1, 1);
  return date.toLocaleString("default", { month: "short", year: "numeric" });
}

// Helper: Get next future months as options for paying in advance.
function getAdvanceMonths(allMonths: string[], monthsDue: string[] = []): string[] {
  return allMonths.filter(month => !monthsDue.includes(month));
}

export function PaymentHistory({ payments, monthsDue = [], monthsAdvance, onReceivePayment }: any) {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState<"due"|"advance">("due");
  const [selectedPayment, setSelectedPayment] = useState<Payment|null>(null);
  const [selectedReceipt, setSelectedReceipt] = useState<any | null>(null);

  // For demonstration, allow max 3 months in advance AFTER due months
  const today = new Date();
  function getNextMonths(num: number, skip: string[]): string[] {
    const months: string[] = [];
    const base = skip.length
      ? new Date(skip[skip.length - 1] + "-01")
      : today;
    let d = new Date(base);
    if (skip.length) d.setMonth(d.getMonth() + 1);
    for (let i = 0; i < num; i++) {
      months.push(`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2, "0")}`);
      d.setMonth(d.getMonth() + 1);
    }
    return months;
  }
  const calculatedAdvance = getNextMonths(3, monthsDue);
  const actualAdvanceMonths = monthsAdvance ?? calculatedAdvance;

  const hasDueBalance = payments.some(p => (p.balance ?? 0) > 0) || monthsDue.length > 0;

  function handleOpenModal(type: "due"|"advance") {
    setModalType(type);
    setModalOpen(true);
  }

  // Function to generate receipt data
  const generateReceiptData = (payment: any) => {
    return {
      id: payment.id,
      date: payment.date,
      tenantName: "Mercy Mayra", // This would come from props in a real app
      tenantEmail: "Simba@example.com", // This would come from props in a real app
      amount: payment.amount,
      paymentType: payment.paymentMode || "Cash",
      monthsPaid: typeof payment.monthsPaid === "string" 
        ? payment.monthsPaid.split(",")
        : Array.isArray(payment.monthsPaid)
          ? payment.monthsPaid
          : [],
      reference: payment.reference,
      status: payment.status,
      balance: payment.balance,
      unit: "Apt 301", // This would come from props in a real app
    };
  };

  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Payment History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-6 grid gap-4 md:grid-cols-4">
            <div className="rounded-lg border p-3">
              <div className="text-sm text-muted-foreground">Total Payments</div>
              <div className="mt-1 text-xl font-bold">
                {formatCurrency(payments.reduce((sum: number, p: any) => sum + p.amount, 0))}
              </div>
            </div>
            <div className="rounded-lg border p-3">
              <div className="text-sm text-muted-foreground">Outstanding Balance</div>
              <div className="mt-1 text-xl font-bold text-red-600">
                {formatCurrency(payments.reduce((sum: number, p: any) => sum + (p.balance || 0), 0))}
              </div>
            </div>
            <div className="rounded-lg border p-3">
              <div className="text-sm text-muted-foreground">Last Payment</div>
              <div className="mt-1 text-xl font-bold">
                {payments[0]?.date || 'N/A'}
              </div>
            </div>
            <div className="rounded-lg border p-3">
              <div className="text-sm text-muted-foreground ml-44">Payment Status</div>
              <div className="mt-1">
                {monthsDue.length > 0 ? (
                  <span className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-sm font-medium text-red-800">
                    {monthsDue.length} months due
                  </span>
                ) : (
                  <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-sm font-medium text-green-800 ml-52">
                    Current
                  </span>
                )}
              </div>
            </div>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Balance</TableHead>
                <TableHead>Months Paid</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payments.map((payment: any) => (
                <TableRow key={payment.id}>
                  <TableCell>{payment.date}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {payment.type}
                      {payment.paymentMode && (
                        <span className="text-xs text-gray-500">
                          via {payment.paymentMode}
                        </span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="font-semibold">{formatCurrency(payment.amount)}</span>
                  </TableCell>
                  <TableCell>
                    {typeof payment.balance === "number" ? (
                      payment.balance > 0 ? (
                        <span className="text-red-600 font-semibold">
                          {formatCurrency(payment.balance)}
                        </span>
                      ) : (
                        <span className="text-green-600 font-semibold">
                          {formatCurrency(0)}
                        </span>
                      )
                    ) : <span>-</span>}
                  </TableCell>
                  <TableCell>
                    {payment.monthsPaid ? (
                      <div className="flex flex-wrap gap-1">
                        {typeof payment.monthsPaid === "string" ? (
                          <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
                            {payment.monthsPaid}
                          </span>
                        ) : (
                          Array.isArray(payment.monthsPaid) && 
                          payment.monthsPaid.map((month: string) => (
                            <span key={month} className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
                              {month}
                            </span>
                          ))
                        )}
                      </div>
                    ) : <span>-</span>}
                  </TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs ${getPaymentStatusColor(payment.status)}`}>
                      {payment.status}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => setSelectedPayment(payment)}>
                        View
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => setSelectedReceipt(generateReceiptData(payment))}
                      >
                        <Receipt className="h-4 w-4 mr-2" />
                        Receipt
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className="flex gap-3 mt-4">
            {hasDueBalance && (
              <Button variant="outline" onClick={() => handleOpenModal("due")}>
                Receive Current Rent
              </Button>
            )}
            <Button variant="outline" onClick={() => handleOpenModal("advance")}>
              Receive Advance Payment
            </Button>
          </div>
        </CardContent>
      </Card>
      <ReceivePaymentModal
        open={modalOpen}
        onClose={()=>setModalOpen(false)}
        monthsDue={modalType === "due" ? monthsDue : actualAdvanceMonths}
        onSubmit={(info) => {
          if (onReceivePayment) {
            onReceivePayment({
              ...info,
              type: modalType
            });
          }
        }}
        modalType={modalType}
      />
      <PaymentDetailsDialog
        open={!!selectedPayment}
        onClose={() => setSelectedPayment(null)}
        payment={selectedPayment}
      />
      <ReceiptGenerator
        open={!!selectedReceipt}
        onClose={() => setSelectedReceipt(null)}
        receipt={selectedReceipt}
      />
    </div>
  );
}


import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { FileText, Receipt } from "lucide-react";
import QRCode from "react-qr-code";

interface StatementData {
  id: string;
  tenantName: string;
  tenantEmail: string;
  unit: string;
  period: {
    from: string;
    to: string;
  };
  charges: {
    description: string;
    amount: number;
  }[];
  payments: {
    date: string;
    amount: number;
    reference?: string;
  }[];
  balance: number;
  dueDate: string;
}

interface StatementGeneratorProps {
  open: boolean;
  onClose: () => void;
  statement: StatementData | null;
}

export function StatementGenerator({ open, onClose, statement }: StatementGeneratorProps) {
  if (!statement) return null;

  const statementQRData = {
    statementId: statement.id,
    tenant: statement.tenantName,
    unit: statement.unit,
    period: statement.period,
    balance: statement.balance,
    generatedAt: new Date().toISOString()
  };

  // Calculate totals with safety checks
  const totalCharges = statement.charges ? statement.charges.reduce((sum, charge) => sum + (charge.amount || 0), 0) : 0;
  const totalPayments = statement.payments ? statement.payments.reduce((sum, payment) => sum + (payment.amount || 0), 0) : 0;

  const handlePrint = () => {
    window.print();
  };

  // Helper function to safely format numbers
  const formatAmount = (amount: number | undefined): string => {
    return typeof amount === 'number' ? amount.toFixed(2) : '0.00';
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="max-w-5xl max-h-[100vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Account Statement
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 p-4 flex-1 overflow-y-auto" id="printable-statement">
          {/* Header */}
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold text-primary">ACCOUNT STATEMENT</h2>
              <p className="text-sm text-muted-foreground">Statement #{statement.id}</p>
              <p className="text-sm text-muted-foreground">Generated: {new Date().toLocaleDateString()}</p>
            </div>
            <div className="text-right">
              <p className="font-medium">Period: {statement.period.from} to {statement.period.to}</p>
              <p className="text-sm text-muted-foreground">Due Date : {statement.dueDate}</p>
            </div>
          </div>

          {/* Tenant Info */}
          <div className="grid grid-cols-2 gap-4 border p-4 rounded-lg">
            <div>
              <h3 className="font-semibold mb-2">Tenant Information</h3>
              <p>{statement.tenantName}</p>
              <p className="text-sm text-muted-foreground">{statement.tenantEmail}</p>
              <p className="text-sm text-muted-foreground">Unit : {statement.unit}</p>
            </div>
            <div className="text-right">
              <h3 className="font-semibold mb-2">Statement Summary</h3>
              <p>Total Charges : KES {formatAmount(totalCharges)}</p>
              <p>Total Payments : KES {formatAmount(totalPayments)}</p>
              <p className="font-bold mt-2">Balance Due : KES {formatAmount(statement.balance)}</p>
            </div>
          </div>

          {/* Charges */}
          <div>
            <h3 className="font-semibold mb-2">Charges</h3>
            <div className="border rounded-lg">
              <table className="w-full">
                <thead className="bg-muted">
                  <tr>
                    <th className="px-4 py-2 text-left">Description</th>
                    <th className="px-4 py-2 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {statement.charges.map((charge, index) => (
                    <tr key={index} className="border-t">
                      <td className="px-4 py-2">{charge.description}</td>
                      <td className="px-4 py-2 text-right">${formatAmount(charge.amount)}</td>
                    </tr>
                  ))}
                  <tr className="border-t bg-muted">
                    <td className="px-4 py-2 font-semibold">Total Charges</td>
                    <td className="px-4 py-2 text-right font-semibold">KES {formatAmount(totalCharges)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Payments */}
          <div>
            <h3 className="font-semibold mb-2">Payments Received</h3>
            <div className="border rounded-lg">
              <table className="w-full">
                <thead className="bg-muted">
                  <tr>
                    <th className="px-4 py-2 text-left">Date</th>
                    <th className="px-4 py-2 text-left">Reference</th>
                    <th className="px-4 py-2 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {statement.payments.map((payment, index) => (
                    <tr key={index} className="border-t">
                      <td className="px-4 py-2">{payment.date}</td>
                      <td className="px-4 py-2">{payment.reference || '-'}</td>
                      <td className="px-4 py-2 text-right">KES {formatAmount(payment.amount)}</td>
                    </tr>
                  ))}
                  <tr className="border-t bg-muted">
                    <td colSpan={2} className="px-4 py-2 font-semibold">Total Payments</td>
                    <td className="px-4 py-2 text-right font-semibold">KES {formatAmount(totalPayments)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Balance */}
          <div className="border-t pt-4">
            <div className="flex justify-between items-center text-lg">
              <span className="font-semibold">Current Balance :</span>
              <span className={statement.balance > 0 ? "text-red-600 font-bold" : "text-green-600 font-bold"}>
                KES {formatAmount(statement.balance)}
              </span>
            </div>
          </div>

          {/* QR Code */}
          <div className="flex justify-center pt-4">
            <div className="p-4 bg-white rounded-lg">
              <QRCode 
                value={JSON.stringify(statementQRData)}
                size={128}
              />
            </div>
          </div>

          {/* Footer */}
          <div className="text-center text-sm text-muted-foreground pt-4 border-t">
            <p>This is an electronically generated statement.</p>
            <p>Please retain this document for your records.</p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-4 pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button onClick={handlePrint}>
            <FileText className="h-4 w-4 mr-2" />
            Print Statement
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

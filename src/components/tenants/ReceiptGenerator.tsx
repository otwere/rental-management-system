
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { QrCode, Receipt } from "lucide-react";
import QRCode from "react-qr-code";

interface ReceiptData {
  id: string;
  date: string;
  tenantName: string;
  tenantEmail: string;
  amount: number;
  paymentType: string;
  monthsPaid?: string[];
  reference?: string;
  status: string;
  balance?: number;
  unit: string;
}

interface ReceiptGeneratorProps {
  open: boolean;
  onClose: () => void;
  receipt: ReceiptData | null;
}

export function ReceiptGenerator({ open, onClose, receipt }: ReceiptGeneratorProps) {
  if (!receipt) return null;

  const receiptQRData = {
    receiptId: receipt.id,
    date: receipt.date,
    amount: receipt.amount,
    tenant: receipt.tenantName,
    reference: receipt.reference,
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Receipt className="h-5 w-5" />
            Payment Receipt
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 p-4" id="printable-receipt">
          {/* Header */}
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold text-primary">PAYMENT RECEIPT</h2>
              <p className="text-sm text-muted-foreground">Receipt #{receipt.id}</p>
            </div>
            <div className="text-right">
              <p className="font-medium">Date: {receipt.date}</p>
              <p className="text-sm text-muted-foreground">Status: 
                <span className={
                  receipt.status === "paid" 
                    ? "ml-2 text-green-600 font-semibold"
                    : "ml-2 text-yellow-600 font-semibold"
                }>
                  {receipt.status.toUpperCase()}
                </span>
              </p>
            </div>
          </div>

          {/* Tenant Info */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold mb-2">Tenant Information</h3>
              <p>{receipt.tenantName}</p>
              <p className="text-sm text-muted-foreground">{receipt.tenantEmail}</p>
              <p className="text-sm text-muted-foreground">Unit: {receipt.unit}</p>
            </div>
            <div className="text-right">
              <h3 className="font-semibold mb-2">Payment Details</h3>
              <p className="text-xl font-bold text-primary">${receipt.amount.toFixed(2)}</p>
              <p className="text-sm text-muted-foreground">via {receipt.paymentType}</p>
              {receipt.reference && (
                <p className="text-sm text-muted-foreground">Ref: {receipt.reference}</p>
              )}
            </div>
          </div>

          {/* Payment Period */}
          {receipt.monthsPaid && receipt.monthsPaid.length > 0 && (
            <div>
              <h3 className="font-semibold mb-2">Payment Period</h3>
              <div className="flex flex-wrap gap-2">
                {receipt.monthsPaid.map((month) => (
                  <span 
                    key={month}
                    className="px-2 py-1 bg-primary/10 rounded-md text-sm"
                  >
                    {month}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Balance */}
          {typeof receipt.balance === "number" && (
            <div className="border-t pt-4">
              <div className="flex justify-between items-center">
                <span className="font-semibold">Remaining Balance:</span>
                <span className={
                  receipt.balance > 0 
                    ? "text-red-600 font-bold"
                    : "text-green-600 font-bold"
                }>
                  ${receipt.balance.toFixed(2)}
                </span>
              </div>
            </div>
          )}

          {/* QR Code */}
          <div className="flex justify-center pt-4">
            <div className="p-4 bg-white rounded-lg">
              <QRCode 
                value={JSON.stringify(receiptQRData)}
                size={128}
              />
            </div>
          </div>

          {/* Footer */}
          <div className="text-center text-sm text-muted-foreground pt-4 border-t">
            <p>This is an electronically generated receipt.</p>
            <p>Thank you for your payment!</p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-4 pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button onClick={handlePrint}>
            <Receipt className="h-4 w-4 mr-2" />
            Print Receipt
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

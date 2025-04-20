
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { PaymentDetailsBreakdown } from "@/components/payments/PaymentDetailsBreakdown";
import { getPaymentStatusColor } from "@/utils/paymentUtils";

interface PaymentDetailsDialogProps {
  open: boolean;
  onClose: () => void;
  payment: {
    id: number;
    date: string;
    amount: number;
    status: string;
    type: string;
    balance?: number;
    monthsPaid?: number | string | string[];
    details?: string;
    reference?: string;
    paymentMode?: string;
  } | null;
}

export function PaymentDetailsDialog({ open, onClose, payment }: PaymentDetailsDialogProps) {
  if (!payment) return null;

  return (
    <Dialog open={open} onOpenChange={v => !v && onClose()}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle>Payment Details</DialogTitle>
              <DialogDescription>
                Transaction ID: #{payment.id}
              </DialogDescription>
            </div>
            <div className={`px-3 py-1 rounded-full text-sm ${getPaymentStatusColor(payment.status)}`}>
              {payment.status}
            </div>
          </div>
        </DialogHeader>

        <PaymentDetailsBreakdown payment={payment} />

        <DialogFooter className="gap-2">
          <Button onClick={onClose} variant="outline">
            Close
          </Button>
          <Button variant="default">
            Download Receipt
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

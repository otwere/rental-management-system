import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { formatCurrency } from "@/utils/paymentUtils";

type PaymentMode = "mpesa" | "bank";

interface ReceivePaymentModalProps {
  open: boolean;
  onClose: () => void;
  monthsDue: string[]; // example: ["2024-01", ...]
  onSubmit: (info: { 
    monthsPaid: string[], 
    paymentMode: PaymentMode, 
    slipOrMpesa: string,
    additionalFees: { type: string; amount: number; }[]
  }) => void;
  modalType: "due" | "advance"; // now required, not optional
}

const paymentModeDescriptions: Record<PaymentMode, string> = {
  mpesa: "Use the Mpesa code from the confirmation SMS.",
  bank: "Enter the Bank Deposit slip or transaction details."
};

export function ReceivePaymentModal({ open, onClose, monthsDue, onSubmit, modalType }: ReceivePaymentModalProps) {
  const [selectedMonths, setSelectedMonths] = useState<string[]>([]);
  const [paymentMode, setPaymentMode] = useState<PaymentMode>("mpesa");
  const [slipOrMpesa, setSlipOrMpesa] = useState("");
  const [additionalFees, setAdditionalFees] = useState<{
    type: string;
    amount: number;
  }[]>([]);
  const [currentFee, setCurrentFee] = useState({ type: "", amount: 0 });
  
  const handleMonthToggle = (month: string) => {
    setSelectedMonths(prev => 
      prev.includes(month)
        ? prev.filter(m => m !== month)
        : [...prev, month]
    );
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedMonths.length === 0) {
      alert("Please select at least one month to pay for.");
      return;
    }
    
    if (!slipOrMpesa) {
      alert("Please enter payment reference.");
      return;
    }
    
    onSubmit({
      monthsPaid: selectedMonths,
      paymentMode,
      slipOrMpesa,
      additionalFees
    });
    
    // Reset form
    setSelectedMonths([]);
    setPaymentMode("mpesa");
    setSlipOrMpesa("");
    setAdditionalFees([]);
    onClose();
  };
  
  // Format month string for display: "2024-03" -> "Mar 2024"
  const formatMonth = (monthStr: string): string => {
    const [year, month] = monthStr.split("-");
    const date = new Date(Number(year), Number(month) - 1, 1);
    return date.toLocaleString('default', { month: 'short', year: 'numeric' });
  };

  const calculateTotalAmount = () => {
    const baseAmount = selectedMonths.length * 2500; // Assuming standard rent is 2500
    const feesTotal = additionalFees.reduce((sum, fee) => sum + fee.amount, 0);
    return baseAmount + feesTotal;
  };

  return (
    <Dialog open={open} onOpenChange={v => !v && onClose()}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {modalType === "due" ? "Receive Current Rent Payment" : "Receive Advance Payment"}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-4">
              <h3 className="font-medium">Select Payment Months</h3>
              <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto p-2 border rounded-lg">
                {monthsDue.map(month => (
                  <div key={month} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id={`month-${month}`}
                      checked={selectedMonths.includes(month)}
                      onChange={() => handleMonthToggle(month)}
                      className="h-4 w-4 rounded border-gray-300"
                    />
                    <label htmlFor={`month-${month}`} className="text-sm">
                      {formatMonth(month)}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-medium">Additional Fees</h3>
              <div className="flex gap-2">
                <Input
                  placeholder="Fee Description"
                  value={currentFee.type}
                  onChange={e => setCurrentFee(prev => ({ ...prev, type: e.target.value }))}
                  className="flex-1"
                />
                <Input
                  type="number"
                  placeholder="Amount"
                  value={currentFee.amount || ""}
                  onChange={e => setCurrentFee(prev => ({ ...prev, amount: Number(e.target.value) }))}
                  className="w-32"
                />
                <Button 
                  type="button"
                  variant="outline"
                  onClick={() => {
                    if (currentFee.type && currentFee.amount > 0) {
                      setAdditionalFees(prev => [...prev, currentFee]);
                      setCurrentFee({ type: "", amount: 0 });
                    }
                  }}
                >
                  Add
                </Button>
              </div>
              
              {additionalFees.length > 0 && (
                <div className="space-y-2 border rounded-lg p-3">
                  {additionalFees.map((fee, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <span className="text-sm">{fee.type}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">
                          {formatCurrency(fee.amount)}
                        </span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setAdditionalFees(prev => prev.filter((_, i) => i !== index));
                          }}
                        >
                          ×
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-medium">Payment Details</h3>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <p className="text-sm text-muted-foreground mb-2">Payment Method:</p>
                <div className="flex gap-4">
                  <div className="flex items-center">
                    <input
                      type="radio"
                      id="mpesa"
                      name="paymentMode"
                      checked={paymentMode === "mpesa"}
                      onChange={() => setPaymentMode("mpesa")}
                      className="mr-2 h-4 w-4"
                    />
                    <label htmlFor="mpesa">Mpesa</label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="radio"
                      id="bank"
                      name="paymentMode"
                      checked={paymentMode === "bank"}
                      onChange={() => setPaymentMode("bank")}
                      className="mr-2 h-4 w-4"
                    />
                    <label htmlFor="bank">Bank Transfer</label>
                  </div>
                </div>
              </div>

              <div>
                <label className="text-sm text-muted-foreground mb-2 block">
                  {paymentMode === "mpesa" ? "Mpesa Code" : "Bank Reference"}
                </label>
                <Input
                  value={slipOrMpesa}
                  onChange={(e) => setSlipOrMpesa(e.target.value)}
                  placeholder={paymentMode === "mpesa" ? "Enter Mpesa code" : "Enter bank reference"}
                  required
                />
              </div>
            </div>
          </div>

          <div className="rounded-lg bg-gray-50 p-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Base Amount ({selectedMonths.length} months)</span>
                <span>{formatCurrency(selectedMonths.length * 2500)}</span>
              </div>
              {additionalFees.map((fee, index) => (
                <div key={index} className="flex justify-between text-sm">
                  <span>{fee.type}</span>
                  <span>{formatCurrency(fee.amount)}</span>
                </div>
              ))}
              <div className="border-t pt-2 mt-2">
                <div className="flex justify-between font-medium">
                  <span>Total Amount</span>
                  <span className="text-lg">{formatCurrency(calculateTotalAmount())}</span>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              type="submit"
              disabled={selectedMonths.length === 0 || !slipOrMpesa}
            >
              Process Payment
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

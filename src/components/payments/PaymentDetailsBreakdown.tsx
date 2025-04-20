import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { formatCurrency } from "@/utils/paymentUtils";
import { Receipt, CreditCard, CalendarDays, Building } from "lucide-react";

interface PaymentBreakdownProps {
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
    fees?: {
      type: string;
      amount: number;
    }[];
    breakdown?: {
      rent: number;
      utilities?: number;
      maintenance?: number;
      other?: number;
    };
  };
}

export function PaymentDetailsBreakdown({ payment }: PaymentBreakdownProps) {
  const totalAmount = payment.amount;
  const breakdown = payment.breakdown || { rent: payment.amount };
  const isExcessPayment = payment.amount > (breakdown.rent || 0);
  const excessAmount = isExcessPayment ? payment.amount - (breakdown.rent || 0) : 0;
  
  const calculatePercentage = (amount: number) => {
    return (amount / totalAmount) * 100;
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
        <Card className="p-4 bg-primary/5">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-full">
              <CreditCard className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium">Payment Method</p>
              <p className="text-lg font-bold">{payment.paymentMode || "N/A"}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-primary/5">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-full">
              <Receipt className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium">Reference</p>
              <p className="text-lg font-bold">{payment.reference || "N/A"}</p>
            </div>
          </div>
        </Card>
      </div>

      <Card className="p-4">
        <h3 className="font-semibold mb-4">Payment Breakdown</h3>
        <div className="space-y-4">
          {/* Regular Rent Payment */}
          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <span className="text-sm">Regular Rent</span>
              <span className="font-medium">{formatCurrency(breakdown.rent || 0)}</span>
            </div>
            <Progress value={calculatePercentage(breakdown.rent || 0)} className="h-2" />
            <p className="text-xs text-muted-foreground">
              {calculatePercentage(breakdown.rent || 0).toFixed(1)}% of total
            </p>
          </div>

          {/* Excess Amount if applicable */}
          {isExcessPayment && (
            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <span className="text-sm">Excess Payment</span>
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                    Carried Forward
                  </span>
                </div>
                <span className="font-medium text-green-600">{formatCurrency(excessAmount)}</span>
              </div>
              <Progress value={calculatePercentage(excessAmount)} className="h-2 bg-green-100" />
              <p className="text-xs text-muted-foreground">
                Will be applied to next month's rent
              </p>
            </div>
          )}

          {/* Additional Fees Section */}
          {payment.fees && payment.fees.length > 0 && (
            <div className="mt-4 pt-4 border-t">
              <h4 className="font-semibold mb-2">Additional Fees</h4>
              <div className="space-y-2">
                {payment.fees.map((fee, index) => (
                  <div key={index} className="flex justify-between text-sm">
                    <span>{fee.type}</span>
                    <span className="font-medium">{formatCurrency(fee.amount)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Total Section */}
          <div className="mt-4 pt-4 border-t">
            <div className="flex justify-between items-center">
              <span className="font-semibold">Total Amount</span>
              <span className="text-lg font-bold text-primary">
                {formatCurrency(totalAmount)}
              </span>
            </div>
            {isExcessPayment && (
              <p className="text-sm text-green-600 mt-2">
                Excess amount of {formatCurrency(excessAmount)} will be applied to future rent
              </p>
            )}
          </div>
        </div>
      </Card>

      {typeof payment.monthsPaid !== "undefined" && (
        <Card className="p-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-primary/10 rounded-full">
              <CalendarDays className="h-5 w-5 text-primary" />
            </div>
            <h3 className="font-semibold">Period Coverage</h3>
          </div>
          <div className="space-y-2">
            {Array.isArray(payment.monthsPaid) ? (
              payment.monthsPaid.map((month, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-primary"></div>
                  <span>{month}</span>
                </div>
              ))
            ) : (
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-primary"></div>
                <span>{payment.monthsPaid}</span>
              </div>
            )}
          </div>
        </Card>
      )}

      {payment.details && (
        <Card className="p-4">
          <h3 className="font-semibold mb-2">Additional Notes</h3>
          <p className="text-sm text-muted-foreground">{payment.details}</p>
        </Card>
      )}
    </div>
  );
}

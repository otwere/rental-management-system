
import { Card } from "@/components/ui/card";
import { formatCurrency } from "@/utils/paymentUtils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

interface RefundReceiptProps {
  refund: {
    id: string;
    date: string;
    amount: number;
    tenant: {
      name: string;
      unit: string;
    };
    deductions: {
      type: string;
      description: string;
      amount: number;
    }[];
    originalDeposit: number;
    refundMethod: string;
    processingDate: string;
    status: string;
    reference?: string;
  };
}

export function RefundReceiptView({ refund }: RefundReceiptProps) {
  const totalDeductions = refund.deductions.reduce((sum, d) => sum + d.amount, 0);
  
  return (
    <ScrollArea className="h-full w-full p-6 print:p-0">
      <div className="max-w-2xl mx-auto space-y-8 print:space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold">Security Deposit Refund Receipt</h1>
          <p className="text-muted-foreground">Reference: #{refund.reference || refund.id}</p>
        </div>

        <Card className="p-6">
          <div className="grid gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Tenant</p>
                <p className="font-medium">{refund.tenant.name}</p>
                <p className="text-sm">Unit {refund.tenant.unit}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Date Processed</p>
                <p className="font-medium">{refund.processingDate}</p>
                <p className="text-sm text-muted-foreground mt-1">Status</p>
                <p className={refund.status.toLowerCase() === 'completed' ? 'text-green-600 font-medium' : 'text-orange-600 font-medium'}>
                  {refund.status}
                </p>
              </div>
            </div>

            <Separator className="my-4" />

            <div>
              <h3 className="font-semibold mb-3">Refund Calculation</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Original Deposit</span>
                  <span className="font-medium">{formatCurrency(refund.originalDeposit)}</span>
                </div>
                
                {refund.deductions.length > 0 && (
                  <>
                    <p className="text-sm font-medium mt-4 mb-2">Deductions:</p>
                    {refund.deductions.map((deduction, index) => (
                      <div key={index} className="flex justify-between text-sm pl-4">
                        <span className="text-muted-foreground">{deduction.type}: {deduction.description}</span>
                        <span className="text-red-600">-{formatCurrency(deduction.amount)}</span>
                      </div>
                    ))}
                  </>
                )}

                <Separator className="my-4" />

                <div className="flex justify-between font-semibold">
                  <span>Total Refund Amount</span>
                  <span className="text-lg text-primary">
                    {formatCurrency(refund.amount)}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <p className="text-sm text-muted-foreground mb-1">Payment Method</p>
              <p className="font-medium">{refund.refundMethod}</p>
            </div>
          </div>
        </Card>

        <div className="text-center text-sm text-muted-foreground print:mt-8">
          <p>This is an official receipt of security deposit refund.</p>
          <p>Please retain this document for your records.</p>
        </div>
      </div>
    </ScrollArea>
  );
}

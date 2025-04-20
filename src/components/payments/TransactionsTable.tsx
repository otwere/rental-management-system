import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Receipt, FileText } from "lucide-react";

interface Transaction {
  id: number;
  date: string;
  reference: string;
  amount: number;
  paymentMethod: string;
  status: string;
  tenant: {
    name: string;
    unit: string;
  };
  type: string;
  balance?: number;
  excessAmount?: number;
  outstandingAmount?: number;
}

interface TransactionsTableProps {
  transactions: Transaction[];
  onViewReceipt: (transaction: Transaction) => void;
  onViewStatement: (transaction: Transaction) => void;
  onViewRefund?: (transaction: Transaction) => void;
}

export function TransactionsTable({
  transactions,
  onViewReceipt,
  onViewStatement,
  onViewRefund
}: TransactionsTableProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const isRefund = (transaction: Transaction) => transaction.type.toLowerCase().includes('refund');

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Date</TableHead>
          <TableHead>Tenant</TableHead>
          <TableHead>Unit</TableHead>
          <TableHead>Reference</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Amount</TableHead>
          <TableHead>Method</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Balance</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {transactions.map((transaction) => (
          <TableRow key={transaction.id}>
            <TableCell>{transaction.date}</TableCell>
            <TableCell>{transaction.tenant.name}</TableCell>
            <TableCell>{transaction.tenant.unit}</TableCell>
            <TableCell>{transaction.reference}</TableCell>
            <TableCell>{transaction.type}</TableCell>
            <TableCell className="font-medium">{formatCurrency(transaction.amount)}</TableCell>
            <TableCell>{transaction.paymentMethod}</TableCell>
            <TableCell>
              <span className={`px-2 py-1 rounded-full text-xs ${
                transaction.excessAmount ? 'bg-green-100 text-green-800' :
                transaction.outstandingAmount ? 'bg-red-100 text-red-800' :
                transaction.status === 'paid' ? 'bg-blue-100 text-blue-800' :
                'bg-yellow-100 text-yellow-800'
              }`}>
                {transaction.excessAmount ? 'Excess' :
                 transaction.outstandingAmount ? 'Outstanding' :
                 transaction.status}
              </span>
            </TableCell>
            <TableCell>
              {transaction.excessAmount ? (
                <div className="flex flex-col">
                  <span className="text-green-600 font-medium">
                    +{formatCurrency(transaction.excessAmount)}
                  </span>
                  <span className="text-xs text-gray-500">Carried Forward</span>
                </div>
              ) : transaction.outstandingAmount ? (
                <div className="flex flex-col">
                  <span className="text-red-600 font-medium">
                    -{formatCurrency(transaction.outstandingAmount)}
                  </span>
                  <span className="text-xs text-gray-500">Outstanding</span>
                </div>
              ) : (
                <span className="text-green-600">Paid in Full</span>
              )}
            </TableCell>
            <TableCell>
              <div className="flex gap-2">
                {isRefund(transaction) ? (
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => onViewRefund?.(transaction)}
                    className="bg-green-50 hover:bg-green-100 border-green-200"
                  >
                    <Receipt className="h-4 w-4 mr-1 text-green-600" />
                    View Refund
                  </Button>
                ) : (
                  <>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => onViewReceipt(transaction)}
                    >
                      <Receipt className="h-4 w-4 mr-1" />
                      Receipt
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => onViewStatement(transaction)}
                    >
                      <FileText className="h-4 w-4 mr-1" />
                      Statement
                    </Button>
                  </>
                )}
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

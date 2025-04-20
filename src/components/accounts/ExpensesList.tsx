
import React, { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { AddExpenseDialog } from "./AddExpenseDialog";
import { formatFinancialAmount, categorizeExpenses } from "@/utils/financialUtils";

interface Expense {
  id: string;
  category: string;
  amount: number;
  date: string;
  description: string;
  type: 'fixed' | 'variable';
  recurring?: boolean;
  interval?: 'monthly' | 'quarterly' | 'yearly';
}

// Temporary mock data - replace with actual data fetching
const mockExpenses: Expense[] = [
  {
    id: "1",
    category: "Maintenance",
    amount: 500,
    date: "2024-04-20",
    description: "Building repairs",
    type: "variable"
  },
  {
    id: "2",
    category: "Utilities",
    amount: 1200,
    date: "2024-04-19",
    description: "Monthly utilities",
    type: "fixed",
    recurring: true,
    interval: "monthly"
  }
];

export const ExpensesList = () => {
  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false);
  const [expenses] = useState<Expense[]>(mockExpenses);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Expenses Management</h2>
        <Button onClick={() => setIsAddExpenseOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Expense
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Recurring</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {expenses.map((expense) => (
              <TableRow key={expense.id}>
                <TableCell>{new Date(expense.date).toLocaleDateString()}</TableCell>
                <TableCell>{expense.category}</TableCell>
                <TableCell>{expense.description}</TableCell>
                <TableCell>{formatFinancialAmount(expense.amount)}</TableCell>
                <TableCell className="capitalize">{expense.type}</TableCell>
                <TableCell>{expense.recurring ? `Yes (${expense.interval})` : 'No'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <AddExpenseDialog
        open={isAddExpenseOpen}
        onOpenChange={setIsAddExpenseOpen}
      />
    </div>
  );
};

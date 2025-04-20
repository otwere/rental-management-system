
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { calculateNetRevenue, formatFinancialAmount, calculateProfitMargin } from "@/utils/financialUtils";
import type { Revenue, Expenditure } from "@/utils/financialUtils";

export const AccountsSummary = () => {
  // Temporary mock data - replace with actual data fetching
  const revenue: Revenue[] = [
    { source: "Rent", amount: 25000, date: "2024-04", category: "rent" },
    { source: "Deposits", amount: 5000, date: "2024-04", category: "deposit" },
  ];

  const expenditures: Expenditure[] = [
    { category: "Maintenance", amount: 3000, date: "2024-04", type: "variable" },
    { category: "Utilities", amount: 2000, date: "2024-04", type: "fixed" },
    { category: "Insurance", amount: 1000, date: "2024-04", type: "fixed" },
  ];

  const netRevenue = calculateNetRevenue(revenue, expenditures);
  const totalRevenue = revenue.reduce((sum, item) => sum + item.amount, 0);
  const totalExpenses = expenditures.reduce((sum, item) => sum + item.amount, 0);
  const profitMargin = calculateProfitMargin(totalRevenue, totalExpenses);

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatFinancialAmount(totalRevenue)}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatFinancialAmount(totalExpenses)}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Net Revenue</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatFinancialAmount(netRevenue)}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Profit Margin</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{profitMargin.toFixed(2)}%</div>
        </CardContent>
      </Card>
    </div>
  );
};

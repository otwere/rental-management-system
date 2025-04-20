
import React from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { ExpensesList } from "@/components/accounts/ExpensesList";
import { AccountsSummary } from "@/components/accounts/AccountsSummary";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Accounts = () => {
  return (
    <DashboardLayout requiredPermission="manage:accounts">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Accounts Management</h1>
          <p className="text-muted-foreground">
            Manage expenses, revenue, and financial records
          </p>
        </div>

        <Tabs defaultValue="summary" className="space-y-4">
          <TabsList>
            <TabsTrigger value="summary">Summary</TabsTrigger>
            <TabsTrigger value="expenses">Expenses</TabsTrigger>
            <TabsTrigger value="revenue">Revenue</TabsTrigger>
          </TabsList>
          
          <TabsContent value="summary" className="space-y-4">
            <AccountsSummary />
          </TabsContent>
          
          <TabsContent value="expenses" className="space-y-4">
            <ExpensesList />
          </TabsContent>
          
          <TabsContent value="revenue" className="space-y-4">
            <div className="grid gap-4">
              <h2 className="text-2xl font-semibold">Revenue Tracking</h2>
              {/* Revenue components will be added in future updates */}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default Accounts;

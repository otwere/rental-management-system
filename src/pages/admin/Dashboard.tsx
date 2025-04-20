
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Building, Users, CreditCard, Home, CheckCircle, AlertCircle, TrendingUp, Activity } from "lucide-react";
import { MOCK_PROPERTIES } from "@/types/property";
import { MOCK_USERS } from "@/types/auth";

export default function AdminDashboard() {
  // In a real app, these would be fetched from an API
  const totalProperties = MOCK_PROPERTIES.length;
  const availableProperties = MOCK_PROPERTIES.filter(p => p.status === "available").length;
  const rentedProperties = MOCK_PROPERTIES.filter(p => p.status === "rented").length;
  const totalUsers = MOCK_USERS.length;
  
  const recentActivity = [
    { id: 1, action: "Property Added", description: "New property added at 123 Main St", date: "1 hour ago" },
    { id: 2, action: "Tenant Application", description: "New application received for Downtown Apartment", date: "3 hours ago" },
    { id: 3, action: "Payment Received", description: "$2,500 payment received from Simba Tenant", date: "Yesterday" },
    { id: 4, action: "Maintenance Request", description: "Urgent plumbing issue reported at Oak Ave property", date: "2 days ago" },
  ];

  const occupancyRate = ((rentedProperties / totalProperties) * 100).toFixed(1);
  const maintenanceRequests = 3; // Mock data
  const pendingApplications = 5; // Mock data
  const overduePayments = 2; // Mock data
  
  return (
    <DashboardLayout requiredPermission="view:dashboard">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <div className="flex gap-2">
            <Button variant="outline">
              <Activity className="h-4 w-4 mr-2" />
              Generate Report
            </Button>
          </div>
        </div>
        
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Properties</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold">{totalProperties}</div>
                  <div className="text-xs text-muted-foreground">
                    {availableProperties} available
                  </div>
                </div>
                <Building className="h-6 w-6 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Occupancy Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold">{occupancyRate}%</div>
                  <div className="text-xs text-muted-foreground">
                    {rentedProperties} units rented
                  </div>
                </div>
                <Progress value={+occupancyRate} className="w-20" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Active Users</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold">{totalUsers}</div>
                  <div className="text-xs text-muted-foreground">
                    {pendingApplications} pending applications
                  </div>
                </div>
                <Users className="h-6 w-6 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Maintenance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold">{maintenanceRequests}</div>
                  <div className="text-xs text-muted-foreground">
                    Active requests
                  </div>
                </div>
                <AlertCircle className="h-6 w-6 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-4">
                {recentActivity.map((activity) => (
                  <li key={activity.id} className="flex items-start gap-3 pb-4 border-b border-border last:border-0 last:pb-0">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                      {activity.action.includes("Payment") ? (
                        <CreditCard className="h-4 w-4" />
                      ) : activity.action.includes("Property") ? (
                        <Building className="h-4 w-4" />
                      ) : activity.action.includes("Tenant") ? (
                        <Users className="h-4 w-4" />
                      ) : (
                        <AlertCircle className="h-4 w-4" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{activity.action}</p>
                      <p className="text-sm text-muted-foreground">{activity.description}</p>
                      <p className="text-xs text-muted-foreground mt-1">{activity.date}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Financial Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm font-medium">Monthly Revenue</p>
                    <p className="text-2xl font-bold">KES 28,500</p>
                    <p className="text-xs text-green-600 flex items-center gap-1">
                      <TrendingUp className="h-3 w-3" /> +5.2% vs last month
                    </p>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <CreditCard className="h-6 w-6" />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Collection Rate</span>
                    <span className="font-medium">85%</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-primary rounded-full" style={{ width: '85%' }}></div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Overdue Payments</span>
                    <span className="font-medium text-red-600">{overduePayments}</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-destructive rounded-full" style={{ width: '15%' }}></div>
                  </div>
                </div>
                
                <div className="pt-4 border-t border-border">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm font-medium">Annual Projection</p>
                      <p className="text-xl font-bold">KES 342,000</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}

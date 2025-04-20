
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Activity,
  Users,
  Home,
  CreditCard,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

interface DashboardStatsProps {
  stats: {
    totalProperties: number;
    availableProperties: number;
    occupancyRate: number;
    totalUsers: number;
    pendingApplications: number;
    maintenanceRequests: number;
    totalRevenue: number;
    revenueChange: number;
  };
}

export function DashboardStats({ stats }: DashboardStatsProps) {
  return (
    <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Properties Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold">{stats.totalProperties}</div>
              <div className="text-xs text-muted-foreground">
                {stats.availableProperties} available
              </div>
            </div>
            <Home className="h-6 w-6 text-muted-foreground" />
          </div>
          <Progress 
            value={stats.occupancyRate} 
            className="mt-4 h-2 bg-secondary"
          />
          <div className="mt-2 text-xs text-muted-foreground">
            Occupancy Rate: {stats.occupancyRate}%
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            User Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold">{stats.totalUsers}</div>
              <div className="text-xs text-muted-foreground">
                {stats.pendingApplications} pending verifications
              </div>
            </div>
            <Users className="h-6 w-6 text-muted-foreground" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Monthly Revenue
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold">
                ${stats.totalRevenue.toLocaleString()}
              </div>
              <div className="text-xs text-green-600 flex items-center gap-1">
                <Activity className="h-3 w-3" />
                {stats.revenueChange > 0 ? "+" : ""}
                {stats.revenueChange}% vs last month
              </div>
            </div>
            <CreditCard className="h-6 w-6 text-muted-foreground" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Maintenance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold">{stats.maintenanceRequests}</div>
              <div className="text-xs text-muted-foreground">
                Active requests
              </div>
            </div>
            <AlertCircle className="h-6 w-6 text-muted-foreground" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}


import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building, Calendar, ClipboardCheck, MessageSquare, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MOCK_PROPERTIES } from "@/types/property";

export default function AgentDashboard() {
  // In a real app, these would be filtered based on the logged-in agent
  const agentProperties = MOCK_PROPERTIES;
  const availableProperties = agentProperties.filter(p => p.status === "available").length;
  const rentedProperties = agentProperties.filter(p => p.status === "rented").length;
  
  const pendingApplications = 3;
  const scheduledViewings = 2;
  const maintenanceRequests = 1;
  
  const upcomingViewings = [
    { id: 1, property: "Modern Downtown Apartment", client: "David Simbason", date: "Today, 2:00 PM" },
    { id: 2, property: "Spacious Family Home", client: "Sarah Williams", date: "Tomorrow, 10:00 AM" },
  ];
  
  const recentMaintenanceRequests = [
    { 
      id: 1, 
      property: "Luxury Waterfront Condo", 
      issue: "Plumbing issue in bathroom", 
      tenant: "Simba Tenant", 
      status: "Pending",
      priority: "High",
      reported: "2 days ago"
    },
  ];
  
  return (
    <DashboardLayout requiredPermission="view:dashboard">
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Agent Dashboard</h1>
        
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">My Properties</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold">{agentProperties.length}</div>
                <Building className="h-6 w-6 text-muted-foreground" />
              </div>
              <div className="flex text-xs text-muted-foreground mt-1">
                <span className="mr-2">{availableProperties} available,</span>
                <span>{rentedProperties} rented</span>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Pending Applications</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold">{pendingApplications}</div>
                <ClipboardCheck className="h-6 w-6 text-muted-foreground" />
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                {pendingApplications} requiring review
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Scheduled Viewings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold">{scheduledViewings}</div>
                <Calendar className="h-6 w-6 text-muted-foreground" />
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                {scheduledViewings} for today and tomorrow
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Maintenance Requests</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold">{maintenanceRequests}</div>
                <Settings className="h-6 w-6 text-muted-foreground" />
              </div>
              <div className="text-xs text-primary-foreground bg-primary rounded-full px-2 py-0.5 inline-block mt-1">
                {maintenanceRequests} high priority
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
          <Card className="col-span-1">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Upcoming Viewings</CardTitle>
              <Button variant="ghost" size="sm">
                <Calendar className="h-4 w-4 mr-2" />
                View Calendar
              </Button>
            </CardHeader>
            <CardContent>
              {upcomingViewings.length > 0 ? (
                <ul className="space-y-4">
                  {upcomingViewings.map((viewing) => (
                    <li key={viewing.id} className="flex items-start gap-3 pb-4 border-b border-border last:border-0 last:pb-0">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                        <Calendar className="h-5 w-5" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">{viewing.property}</p>
                        <p className="text-sm text-muted-foreground">Client: {viewing.client}</p>
                        <p className="text-xs text-muted-foreground mt-1">{viewing.date}</p>
                      </div>
                      <Button variant="outline" size="sm">Details</Button>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-center py-6">
                  <p className="text-muted-foreground">No upcoming viewings scheduled</p>
                </div>
              )}
            </CardContent>
          </Card>
          
          <Card className="col-span-1">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Maintenance Requests</CardTitle>
              <Button variant="ghost" size="sm">
                <Settings className="h-4 w-4 mr-2" />
                View All
              </Button>
            </CardHeader>
            <CardContent>
              {recentMaintenanceRequests.length > 0 ? (
                <ul className="space-y-4">
                  {recentMaintenanceRequests.map((request) => (
                    <li key={request.id} className="flex items-start gap-3 pb-4 border-b border-border last:border-0 last:pb-0">
                      <div className="h-10 w-10 rounded-full bg-destructive/10 flex items-center justify-center text-destructive">
                        <Settings className="h-5 w-5" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium">{request.property}</p>
                          <span className="text-xs bg-destructive text-destructive-foreground px-2 py-0.5 rounded-full">
                            {request.priority}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground">{request.issue}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Reported by {request.tenant} {request.reported}
                        </p>
                      </div>
                      <Button variant="outline" size="sm">Resolve</Button>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-center py-6">
                  <p className="text-muted-foreground">No maintenance requests</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Recent Messages</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center py-8">
              <div className="text-center">
                <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground/50" />
                <h3 className="mt-4 text-lg font-medium">No new messages</h3>
                <p className="mt-1 text-muted-foreground">
                  When tenants or administrators send you messages, they will appear here
                </p>
                <Button className="mt-4">Check inbox</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}

import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  Building, 
  Home, 
  FileText, 
  CreditCard, 
  AlertCircle, 
  MessageSquare, 
  Settings, 
  CheckCircle 
} from "lucide-react";
import { useState } from "react";
import { TenantMaintenanceRequestModal } from "@/components/tenants/TenantMaintenanceRequestModal";
import { TenantPaymentModal } from "@/components/tenants/TenantPaymentModal";
import { TenantContactSupportModal } from "@/components/tenants/TenantContactSupportModal";
import { TenantRentalDetailsModal } from "@/components/tenants/TenantRentalDetailsModal";
import { MyRentalDetails } from "@/components/tenants/MyRentalDetails";
import { TenantApplications } from "@/components/tenants/TenantApplications";

export default function TenantDashboard() {
  const nextPayment = {
    amount: 2500,
    dueDate: new Date("2025-05-01"),
    status: "upcoming"
  };
  
  const daysUntilDue = Math.ceil((nextPayment.dueDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
  
  const leaseEndDate = new Date("2026-04-30");
  const leaseEndingIn = Math.ceil((leaseEndDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
  const leaseProgress = 100 - Math.round((leaseEndingIn / 365) * 100);
  
  const maintenanceRequests = [
    { 
      id: 1, 
      title: "Leaking faucet in bathroom", 
      status: "scheduled", 
      scheduledDate: "Tomorrow, 10:00 AM",
      reportedDate: "3 days ago"
    },
  ];
  
  const [maintenanceModal, setMaintenanceModal] = useState(false);
  const [paymentModal, setPaymentModal] = useState(false);
  const [supportModal, setSupportModal] = useState(false);
  const [rentalDetailsModal, setRentalDetailsModal] = useState(false);

  return (
    <DashboardLayout requiredPermission="view:dashboard">
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Tenant Dashboard</h1>
        
        <MyRentalDetails />
        
        <TenantApplications />
        
        <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>My Rental</CardTitle>
              </CardHeader>
              <CardContent className="pb-6">
                <div className="flex flex-col md:flex-row gap-6 items-start">
                  <div className="w-full md:w-1/3 aspect-video bg-muted rounded-lg flex items-center justify-center">
                    <Home className="h-12 w-12 text-muted-foreground/50" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-[1rem] font-semibold">Modern Downtown Apartment</h3>
                    <p className="text-muted-foreground mt-1">Roysambu Main Home APT, Nairobi County</p>
                    
                    <div className="grid grid-cols-2 gap-4 mt-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Bedrooms</p>
                        <p className="font-medium">2</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Bathrooms</p>
                        <p className="font-medium">2</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Square Footage</p>
                        <p className="font-medium">1,200 sq ft</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Lease End Date</p>
                        <p className="font-medium">April 30, 2026</p>
                      </div>
                    </div>
                    
                    <div className="mt-4">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm">Lease Progress</span>
                        <span className="text-sm font-medium">{leaseProgress}%</span>
                      </div>
                      <Progress value={leaseProgress} className="h-2" />
                      <p className="text-xs text-muted-foreground mt-1">
                        {leaseEndingIn} days remaining on your lease
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end gap-2 border-t pt-6">
                <Button variant="outline" onClick={() => setRentalDetailsModal(true)}>View Details</Button>
                <Button variant="outline" onClick={() => setSupportModal(true)}>
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Contact Agent
                </Button>
              </CardFooter>
            </Card>
            
            <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">Maintenance Requests</CardTitle>
                </CardHeader>
                <CardContent>
                  {maintenanceRequests.length > 0 ? (
                    <ul className="space-y-4">
                      {maintenanceRequests.map((request) => (
                        <li key={request.id} className="flex items-start gap-3">
                          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                            <Settings className="h-4 w-4" />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium">{request.title}</p>
                            <div className="flex items-center mt-1">
                              <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                                {request.status === "scheduled" ? "Scheduled" : request.status}
                              </span>
                              <span className="text-xs text-muted-foreground ml-2">
                                Reported {request.reportedDate}
                              </span>
                            </div>
                            {request.status === "scheduled" && (
                              <p className="text-xs text-muted-foreground mt-1">
                                Service scheduled for {request.scheduledDate}
                              </p>
                            )}
                          </div>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="text-center py-6">
                      <CheckCircle className="h-12 w-12 mx-auto text-muted-foreground/50" />
                      <p className="mt-2 text-muted-foreground">No active maintenance requests</p>
                    </div>
                  )}
                </CardContent>
                <CardFooter className="border-t pt-4">
                  <Button className="w-full" onClick={() => setMaintenanceModal(true)}>Submit New Request</Button>
                </CardFooter>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">Documents</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    <li className="flex items-center justify-between p-2 rounded-lg hover:bg-muted">
                      <div className="flex items-center gap-2">
                        <FileText className="h-5 w-5 text-muted-foreground" />
                        <span className="text-sm">Lease Agreement</span>
                      </div>
                      <Button variant="ghost" size="sm">View</Button>
                    </li>
                    <li className="flex items-center justify-between p-2 rounded-lg hover:bg-muted">
                      <div className="flex items-center gap-2">
                        <FileText className="h-5 w-5 text-muted-foreground" />
                        <span className="text-sm">Building Rules</span>
                      </div>
                      <Button variant="ghost" size="sm">View</Button>
                    </li>
                    <li className="flex items-center justify-between p-2 rounded-lg hover:bg-muted">
                      <div className="flex items-center gap-2">
                        <FileText className="h-5 w-5 text-muted-foreground" />
                        <span className="text-sm">Move-in Inspection</span>
                      </div>
                      <Button variant="ghost" size="sm">View</Button>
                    </li>
                  </ul>
                </CardContent>
                <CardFooter className="border-t pt-4">
                  <Button variant="outline" className="w-full">All Documents</Button>
                </CardFooter>
              </Card>
            </div>
          </div>
          
          <div className="lg:col-span-1 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Next Rent Payment</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-4">
                  <div className="text-xl font-bold">KES {nextPayment.amount}</div>
                  <p className="text-muted-foreground">Due in {daysUntilDue} days</p>
                  
                  <div className="mt-6 space-y-2">
                    <div className="bg-primary/10 rounded-lg p-3">
                      <p className="text-sm">Next Payment Date</p>
                      <p className="font-medium">May 1, 2025</p>
                    </div>
                    
                    <div className="bg-muted rounded-lg p-3">
                      <p className="text-sm">Payment Method</p>
                      <p className="font-medium">Online Payment</p>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="border-t pt-4">
                <Button className="w-full" onClick={() => setPaymentModal(true)}>Make Payment</Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Payment History</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-center justify-between p-2 rounded-lg hover:bg-muted">
                    <div>
                      <p className="text-sm font-medium">April 2025</p>
                      <p className="text-xs text-muted-foreground">Paid on Apr 1, 2025</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">KES 2,500</span>
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    </div>
                  </li>
                  <li className="flex items-center justify-between p-2 rounded-lg hover:bg-muted">
                    <div>
                      <p className="text-sm font-medium">March 2025</p>
                      <p className="text-xs text-muted-foreground">Paid on Mar 1, 2025</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">KES 2,500</span>
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    </div>
                  </li>
                  <li className="flex items-center justify-between p-2 rounded-lg hover:bg-muted">
                    <div>
                      <p className="text-sm font-medium">February 2025</p>
                      <p className="text-xs text-muted-foreground">Paid on Feb 1, 2025</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">KES 2,500</span>
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    </div>
                  </li>
                </ul>
              </CardContent>
              <CardFooter className="border-t pt-4">
                <Button variant="outline" className="w-full" onClick={() => window.location.href = "/tenant/payments"}>View All Payments</Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-xl">Need Help?</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-4">
                  <AlertCircle className="h-12 w-12 mx-auto text-muted-foreground/50" />
                  <h3 className="mt-2 font-medium">Have questions or issues?</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Contact your property manager for assistance with your rental.
                  </p>
                  <Button className="mt-4 w-full" onClick={() => setSupportModal(true)}>
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Contact Support
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <TenantMaintenanceRequestModal open={maintenanceModal} onClose={()=>setMaintenanceModal(false)} />
      <TenantPaymentModal open={paymentModal} onClose={()=>setPaymentModal(false)} />
      <TenantContactSupportModal open={supportModal} onClose={()=>setSupportModal(false)} />
      <TenantRentalDetailsModal open={rentalDetailsModal} onClose={()=>setRentalDetailsModal(false)} />
    </DashboardLayout>
  );
}

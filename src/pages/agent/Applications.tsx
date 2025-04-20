import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ApplicationCard } from "@/components/properties/ApplicationCard";
import { MOCK_PROPERTIES, TenantApplication } from "@/types/property";
import { Search, Filter, ClipboardList, Check, X, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent } from "@/components/ui/dialog";

// Get all applications from all properties
const getAllApplications = () => {
  let applications: (TenantApplication & { propertyTitle?: string; unitNumber?: string })[] = [];
  
  MOCK_PROPERTIES.forEach(property => {
    // Applications for the entire property
    if (property.applications) {
      applications = [
        ...applications,
        ...property.applications.map(app => ({
          ...app,
          propertyTitle: property.title,
        }))
      ];
    }
    
    // Applications for specific units
    property.units.forEach(unit => {
      if (unit.applications) {
        applications = [
          ...applications,
          ...unit.applications.map(app => ({
            ...app,
            propertyTitle: property.title,
            unitNumber: unit.number,
          }))
        ];
      }
    });
  });
  
  return applications;
};

export default function AgentApplications() {
  const [applications, setApplications] = useState(getAllApplications());
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedApplication, setSelectedApplication] = useState<(TenantApplication & { propertyTitle?: string; unitNumber?: string }) | null>(null);
  const [showDocumentsModal, setShowDocumentsModal] = useState(false);
  const { toast } = useToast();

  // Filter applications based on search term
  const filteredApplications = applications.filter(app =>
    app.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    app.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    app.propertyTitle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    app.unitNumber?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Get applications by status
  const pendingApplications = filteredApplications.filter(app => app.status === "pending");
  const approvedApplications = filteredApplications.filter(app => app.status === "approved");
  const rejectedApplications = filteredApplications.filter(app => app.status === "rejected");

  // Handle approving an application
  const handleApproveApplication = (applicationId: string) => {
    setApplications(applications.map(app =>
      app.id === applicationId ? { ...app, status: "approved" } : app
    ));
    
    toast({
      title: "Application approved",
      description: "The tenant application has been approved successfully."
    });
  };

  // Handle rejecting an application
  const handleRejectApplication = (applicationId: string) => {
    setApplications(applications.map(app =>
      app.id === applicationId ? { ...app, status: "rejected" } : app
    ));
    
    toast({
      title: "Application rejected",
      description: "The tenant application has been rejected."
    });
  };

  // Handle viewing documents
  const handleViewDocuments = (applicationId: string) => {
    const application = applications.find(app => app.id === applicationId);
    if (application) {
      setSelectedApplication(application);
      setShowDocumentsModal(true);
    }
  };

  return (
    <DashboardLayout requiredPermission="view:applications">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Tenant Applications</h1>
          <div className="flex items-center gap-4">
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search applications..."
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Pending Applications
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingApplications.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Approved Applications
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{approvedApplications.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Rejected Applications
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{rejectedApplications.length}</div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Application Management</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="pending" className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-6">
                <TabsTrigger value="pending" className="flex items-center">
                  <ClipboardList className="h-4 w-4 mr-2" />
                  Pending
                  {pendingApplications.length > 0 && (
                    <span className="ml-1.5 bg-primary text-primary-foreground rounded-full w-5 h-5 flex items-center justify-center text-xs">
                      {pendingApplications.length}
                    </span>
                  )}
                </TabsTrigger>
                <TabsTrigger value="approved" className="flex items-center">
                  <Check className="h-4 w-4 mr-2" />
                  Approved
                </TabsTrigger>
                <TabsTrigger value="rejected" className="flex items-center">
                  <X className="h-4 w-4 mr-2" />
                  Rejected
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="pending" className="mt-0">
                {pendingApplications.length > 0 ? (
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {pendingApplications.map(application => (
                      <ApplicationCard
                        key={application.id}
                        application={application}
                        onApprove={handleApproveApplication}
                        onReject={handleRejectApplication}
                        onViewDocuments={handleViewDocuments}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <ClipboardList className="h-12 w-12 mx-auto text-muted-foreground" />
                    <h3 className="mt-4 text-lg font-medium">No pending applications</h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      There are currently no applications waiting for review.
                    </p>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="approved" className="mt-0">
                {approvedApplications.length > 0 ? (
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {approvedApplications.map(application => (
                      <ApplicationCard
                        key={application.id}
                        application={application}
                        onApprove={handleApproveApplication}
                        onReject={handleRejectApplication}
                        onViewDocuments={handleViewDocuments}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Check className="h-12 w-12 mx-auto text-muted-foreground" />
                    <h3 className="mt-4 text-lg font-medium">No approved applications</h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      There are currently no approved applications.
                    </p>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="rejected" className="mt-0">
                {rejectedApplications.length > 0 ? (
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {rejectedApplications.map(application => (
                      <ApplicationCard
                        key={application.id}
                        application={application}
                        onApprove={handleApproveApplication}
                        onReject={handleRejectApplication}
                        onViewDocuments={handleViewDocuments}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <X className="h-12 w-12 mx-auto text-muted-foreground" />
                    <h3 className="mt-4 text-lg font-medium">No rejected applications</h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      There are currently no rejected applications.
                    </p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
      
      {/* Documents Modal */}
      <Dialog open={showDocumentsModal} onOpenChange={setShowDocumentsModal}>
        <DialogContent className="sm:max-w-md">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Application Documents</h2>
              <Button variant="outline" size="sm" onClick={() => setShowDocumentsModal(false)}>
                Close
              </Button>
            </div>
            
            {selectedApplication && (
              <div>
                <div className="mb-4">
                  <p className="text-sm text-muted-foreground">Applicant</p>
                  <p className="font-medium">{selectedApplication.name}</p>
                </div>
                
                {selectedApplication.propertyTitle && (
                  <div className="mb-4">
                    <p className="text-sm text-muted-foreground">Property</p>
                    <p className="font-medium">
                      {selectedApplication.propertyTitle}
                      {selectedApplication.unitNumber && ` - Unit ${selectedApplication.unitNumber}`}
                    </p>
                  </div>
                )}
                
                <div className="border rounded-md">
                  <div className="p-3 border-b bg-muted/50">
                    <h3 className="font-medium">Documents</h3>
                  </div>
                  <ul className="divide-y">
                    {selectedApplication.documents.map((doc, idx) => (
                      <li key={idx} className="p-3 flex items-center justify-between">
                        <div className="flex items-center">
                          <FileText className="h-5 w-5 text-muted-foreground mr-2" />
                          <span>{doc}</span>
                        </div>
                        <Button variant="ghost" size="sm">
                          View
                        </Button>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}

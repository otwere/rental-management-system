import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Search, Wrench, Clock, CheckSquare, Plus, Filter, Calendar, User, Building } from "lucide-react";

interface MaintenanceRequest {
  id: string;
  property: string;
  unit: string;
  issue: string;
  description: string;
  tenant: string;
  priority: "low" | "medium" | "high";
  status: "pending" | "in_progress" | "completed";
  reportedDate: string;
  assignedTo?: string;
  completedDate?: string;
  notes?: string;
}

const MOCK_MAINTENANCE: MaintenanceRequest[] = [
  {
    id: "maint-1",
    property: "Sunset Apartments",
    unit: "101",
    issue: "Leaking faucet in kitchen",
    description: "The kitchen faucet has been leaking for two days. Water is pooling underneath the sink.",
    tenant: "John Smith",
    priority: "medium",
    status: "pending",
    reportedDate: "2024-04-15",
  },
  {
    id: "maint-2",
    property: "Urban Lofts",
    unit: "B2",
    issue: "AC not cooling",
    description: "The air conditioning unit isn't cooling the apartment. Current indoor temperature is 85°F.",
    tenant: "Emma Johnson",
    priority: "high",
    status: "in_progress",
    reportedDate: "2024-04-14",
    assignedTo: "Mike Technician",
  },
  {
    id: "maint-3",
    property: "Maple Grove Townhomes",
    unit: "T1",
    issue: "Broken light fixture in hallway",
    description: "The hallway light fixture is broken and won't turn on.",
    tenant: "Robert Davis",
    priority: "low",
    status: "completed",
    reportedDate: "2024-04-10",
    assignedTo: "Sarah Electrician",
    completedDate: "2024-04-12",
    notes: "Replaced fixture and installed LED bulb."
  },
  {
    id: "maint-4",
    property: "Sunset Apartments",
    unit: "201",
    issue: "Garbage disposal jammed",
    description: "The garbage disposal is making a loud noise and won't work.",
    tenant: "Michelle Taylor",
    priority: "medium",
    status: "pending",
    reportedDate: "2024-04-16",
  },
];

export default function AgentMaintenance() {
  const [maintenanceRequests, setMaintenanceRequests] = useState<MaintenanceRequest[]>(MOCK_MAINTENANCE);
  const [searchTerm, setSearchTerm] = useState("");
  const [showNewRequestModal, setShowNewRequestModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<MaintenanceRequest | null>(null);
  const [newRequest, setNewRequest] = useState({
    property: "",
    unit: "",
    issue: "",
    description: "",
    tenant: "",
    priority: "medium" as "low" | "medium" | "high",
  });
  const { toast } = useToast();

  const filteredRequests = maintenanceRequests.filter(request =>
    request.property.toLowerCase().includes(searchTerm.toLowerCase()) ||
    request.unit.toLowerCase().includes(searchTerm.toLowerCase()) ||
    request.issue.toLowerCase().includes(searchTerm.toLowerCase()) ||
    request.tenant.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const pendingRequests = filteredRequests.filter(req => req.status === "pending");
  const inProgressRequests = filteredRequests.filter(req => req.status === "in_progress");
  const completedRequests = filteredRequests.filter(req => req.status === "completed");

  const handleViewRequest = (request: MaintenanceRequest) => {
    setSelectedRequest(request);
    setShowDetailsModal(true);
  };

  const handleCreateRequest = () => {
    const newMaintenanceRequest: MaintenanceRequest = {
      id: `maint-${Date.now()}`,
      property: newRequest.property,
      unit: newRequest.unit,
      issue: newRequest.issue,
      description: newRequest.description,
      tenant: newRequest.tenant,
      priority: newRequest.priority,
      status: "pending",
      reportedDate: new Date().toISOString().split('T')[0],
    };
    
    setMaintenanceRequests([newMaintenanceRequest, ...maintenanceRequests]);
    setShowNewRequestModal(false);
    setNewRequest({
      property: "",
      unit: "",
      issue: "",
      description: "",
      tenant: "",
      priority: "medium",
    });
    
    toast({
      title: "Maintenance request created",
      description: "The maintenance request has been created successfully."
    });
  };

  const handleUpdateStatus = (requestId: string, newStatus: "pending" | "in_progress" | "completed") => {
    setMaintenanceRequests(maintenanceRequests.map(req => {
      if (req.id === requestId) {
        const updatedRequest = { ...req, status: newStatus };
        
        if (newStatus === "completed") {
          updatedRequest.completedDate = new Date().toISOString().split('T')[0];
        }
        
        if (selectedRequest && selectedRequest.id === requestId) {
          setSelectedRequest(updatedRequest);
        }
        
        return updatedRequest;
      }
      return req;
    }));
    
    toast({
      title: "Status updated",
      description: `Maintenance request status updated to ${newStatus.replace('_', ' ')}.`
    });
  };

  const handleAssignTechnician = (requestId: string, technicianName: string) => {
    setMaintenanceRequests(maintenanceRequests.map(req => {
      if (req.id === requestId) {
        const updatedRequest = { 
          ...req, 
          assignedTo: technicianName,
          status: req.status === "pending" ? "in_progress" : req.status 
        };
        
        if (selectedRequest && selectedRequest.id === requestId) {
          setSelectedRequest(updatedRequest);
        }
        
        return updatedRequest;
      }
      return req;
    }));
    
    toast({
      title: "Technician assigned",
      description: `${technicianName} has been assigned to the maintenance request.`
    });
  };

  const statusStyles = {
    pending: "bg-yellow-100 text-yellow-800",
    in_progress: "bg-blue-100 text-blue-800",
    completed: "bg-green-100 text-green-800"
  };

  const priorityStyles = {
    low: "bg-gray-100 text-gray-800",
    medium: "bg-blue-100 text-blue-800",
    high: "bg-red-100 text-red-800"
  };

  return (
    <DashboardLayout requiredPermission="manage:maintenance">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Maintenance Requests</h1>
          <div className="flex items-center gap-4">
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search requests..."
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
            <Button onClick={() => setShowNewRequestModal(true)}>
              <Plus className="h-4 w-4 mr-2" />
              New Request
            </Button>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Pending Requests
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingRequests.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                In Progress
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{inProgressRequests.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Completed
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{completedRequests.length}</div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Maintenance Management</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="all" className="w-full">
              <TabsList className="grid w-full grid-cols-4 mb-6">
                <TabsTrigger value="all">All Requests</TabsTrigger>
                <TabsTrigger value="pending" className="flex items-center">
                  <Clock className="h-4 w-4 mr-2" />
                  Pending
                  {pendingRequests.length > 0 && (
                    <span className="ml-1.5 bg-yellow-100 text-yellow-800 rounded-full w-5 h-5 flex items-center justify-center text-xs">
                      {pendingRequests.length}
                    </span>
                  )}
                </TabsTrigger>
                <TabsTrigger value="inProgress">In Progress</TabsTrigger>
                <TabsTrigger value="completed">Completed</TabsTrigger>
              </TabsList>
              
              <TabsContent value="all" className="mt-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Property / Unit</TableHead>
                      <TableHead>Issue</TableHead>
                      <TableHead>Tenant</TableHead>
                      <TableHead>Reported Date</TableHead>
                      <TableHead>Priority</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredRequests.length > 0 ? (
                      filteredRequests.map((request) => (
                        <TableRow key={request.id}>
                          <TableCell>
                            <div>
                              <div className="font-medium">{request.property}</div>
                              <div className="text-sm text-muted-foreground">Unit {request.unit}</div>
                            </div>
                          </TableCell>
                          <TableCell>{request.issue}</TableCell>
                          <TableCell>{request.tenant}</TableCell>
                          <TableCell>{request.reportedDate}</TableCell>
                          <TableCell>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${priorityStyles[request.priority]}`}>
                              {request.priority.charAt(0).toUpperCase() + request.priority.slice(1)}
                            </span>
                          </TableCell>
                          <TableCell>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusStyles[request.status]}`}>
                              {request.status === "in_progress" 
                                ? "In Progress" 
                                : request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                            </span>
                          </TableCell>
                          <TableCell>
                            <Button variant="outline" size="sm" onClick={() => handleViewRequest(request)}>
                              View Details
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-6 text-muted-foreground">
                          No maintenance requests found matching your search.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TabsContent>
              
              <TabsContent value="pending" className="mt-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Property / Unit</TableHead>
                      <TableHead>Issue</TableHead>
                      <TableHead>Tenant</TableHead>
                      <TableHead>Reported Date</TableHead>
                      <TableHead>Priority</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pendingRequests.length > 0 ? (
                      pendingRequests.map((request) => (
                        <TableRow key={request.id}>
                          <TableCell>
                            <div>
                              <div className="font-medium">{request.property}</div>
                              <div className="text-sm text-muted-foreground">Unit {request.unit}</div>
                            </div>
                          </TableCell>
                          <TableCell>{request.issue}</TableCell>
                          <TableCell>{request.tenant}</TableCell>
                          <TableCell>{request.reportedDate}</TableCell>
                          <TableCell>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${priorityStyles[request.priority]}`}>
                              {request.priority.charAt(0).toUpperCase() + request.priority.slice(1)}
                            </span>
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button variant="outline" size="sm" onClick={() => handleViewRequest(request)}>
                                View
                              </Button>
                              <Button 
                                size="sm" 
                                onClick={() => handleUpdateStatus(request.id, "in_progress")}
                              >
                                Start
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                          No pending maintenance requests.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TabsContent>
              
              <TabsContent value="inProgress" className="mt-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Property / Unit</TableHead>
                      <TableHead>Issue</TableHead>
                      <TableHead>Assigned To</TableHead>
                      <TableHead>Reported Date</TableHead>
                      <TableHead>Priority</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {inProgressRequests.length > 0 ? (
                      inProgressRequests.map((request) => (
                        <TableRow key={request.id}>
                          <TableCell>
                            <div>
                              <div className="font-medium">{request.property}</div>
                              <div className="text-sm text-muted-foreground">Unit {request.unit}</div>
                            </div>
                          </TableCell>
                          <TableCell>{request.issue}</TableCell>
                          <TableCell>{request.assignedTo || "Unassigned"}</TableCell>
                          <TableCell>{request.reportedDate}</TableCell>
                          <TableCell>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${priorityStyles[request.priority]}`}>
                              {request.priority.charAt(0).toUpperCase() + request.priority.slice(1)}
                            </span>
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button variant="outline" size="sm" onClick={() => handleViewRequest(request)}>
                                View
                              </Button>
                              <Button 
                                size="sm" 
                                variant="default"
                                onClick={() => handleUpdateStatus(request.id, "completed")}
                              >
                                <CheckSquare className="h-4 w-4 mr-2" />
                                Complete
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                          No in-progress maintenance requests.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TabsContent>
              
              <TabsContent value="completed" className="mt-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Property / Unit</TableHead>
                      <TableHead>Issue</TableHead>
                      <TableHead>Completed Date</TableHead>
                      <TableHead>Reported Date</TableHead>
                      <TableHead>Completed By</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {completedRequests.length > 0 ? (
                      completedRequests.map((request) => (
                        <TableRow key={request.id}>
                          <TableCell>
                            <div>
                              <div className="font-medium">{request.property}</div>
                              <div className="text-sm text-muted-foreground">Unit {request.unit}</div>
                            </div>
                          </TableCell>
                          <TableCell>{request.issue}</TableCell>
                          <TableCell>{request.completedDate}</TableCell>
                          <TableCell>{request.reportedDate}</TableCell>
                          <TableCell>{request.assignedTo || "Unknown"}</TableCell>
                          <TableCell>
                            <Button variant="outline" size="sm" onClick={() => handleViewRequest(request)}>
                              View Details
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                          No completed maintenance requests.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
      
      <Dialog open={showNewRequestModal} onOpenChange={setShowNewRequestModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Create Maintenance Request</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Select 
                value={newRequest.property}
                onValueChange={(value) => setNewRequest({...newRequest, property: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select property" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Sunset Apartments">Sunset Apartments</SelectItem>
                  <SelectItem value="Urban Lofts">Urban Lofts</SelectItem>
                  <SelectItem value="Maple Grove Townhomes">Maple Grove Townhomes</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Input 
                placeholder="Unit number" 
                value={newRequest.unit}
                onChange={(e) => setNewRequest({...newRequest, unit: e.target.value})}
              />
            </div>
            
            <div className="space-y-2">
              <Input 
                placeholder="Tenant name" 
                value={newRequest.tenant}
                onChange={(e) => setNewRequest({...newRequest, tenant: e.target.value})}
              />
            </div>
            
            <div className="space-y-2">
              <Input 
                placeholder="Issue title" 
                value={newRequest.issue}
                onChange={(e) => setNewRequest({...newRequest, issue: e.target.value})}
              />
            </div>
            
            <div className="space-y-2">
              <Textarea 
                placeholder="Description of the issue" 
                className="min-h-[100px]"
                value={newRequest.description}
                onChange={(e) => setNewRequest({...newRequest, description: e.target.value})}
              />
            </div>
            
            <div className="space-y-2">
              <Select 
                value={newRequest.priority}
                onValueChange={(value: "low" | "medium" | "high") => 
                  setNewRequest({...newRequest, priority: value})
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowNewRequestModal(false)}>Cancel</Button>
            <Button 
              onClick={handleCreateRequest}
              disabled={!newRequest.property || !newRequest.unit || !newRequest.issue || !newRequest.tenant}
            >
              Create Request
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <Dialog open={showDetailsModal} onOpenChange={setShowDetailsModal}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Maintenance Request Details</DialogTitle>
          </DialogHeader>
          {selectedRequest && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-semibold text-lg">{selectedRequest.issue}</h3>
                  <div className="text-sm text-muted-foreground">
                    {selectedRequest.property} - Unit {selectedRequest.unit}
                  </div>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusStyles[selectedRequest.status]}`}>
                  {selectedRequest.status === "in_progress" 
                    ? "In Progress" 
                    : selectedRequest.status.charAt(0).toUpperCase() + selectedRequest.status.slice(1)}
                </span>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Priority</p>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${priorityStyles[selectedRequest.priority]}`}>
                    {selectedRequest.priority.charAt(0).toUpperCase() + selectedRequest.priority.slice(1)}
                  </span>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Reported Date</p>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1 text-muted-foreground" />
                    <span>{selectedRequest.reportedDate}</span>
                  </div>
                </div>
              </div>
              
              <div>
                <p className="text-sm text-muted-foreground">Tenant</p>
                <div className="flex items-center">
                  <User className="h-4 w-4 mr-1 text-muted-foreground" />
                  <span>{selectedRequest.tenant}</span>
                </div>
              </div>
              
              <div>
                <p className="text-sm text-muted-foreground">Description</p>
                <p className="border rounded-md p-3 bg-muted/20 text-sm mt-1">
                  {selectedRequest.description}
                </p>
              </div>
              
              {(selectedRequest.status === "in_progress" || selectedRequest.status === "completed") && (
                <div>
                  <p className="text-sm text-muted-foreground">Assigned To</p>
                  <div className="flex items-center">
                    <Wrench className="h-4 w-4 mr-1 text-muted-foreground" />
                    <span>{selectedRequest.assignedTo || "Not assigned"}</span>
                  </div>
                </div>
              )}
              
              {selectedRequest.status === "completed" && selectedRequest.completedDate && (
                <div>
                  <p className="text-sm text-muted-foreground">Completed Date</p>
                  <div className="flex items-center">
                    <CheckSquare className="h-4 w-4 mr-1 text-muted-foreground" />
                    <span>{selectedRequest.completedDate}</span>
                  </div>
                </div>
              )}
              
              {selectedRequest.notes && (
                <div>
                  <p className="text-sm text-muted-foreground">Notes</p>
                  <p className="border rounded-md p-3 bg-muted/20 text-sm mt-1">
                    {selectedRequest.notes}
                  </p>
                </div>
              )}
              
              <div className="border-t pt-4">
                {selectedRequest.status === "pending" && (
                  <div className="flex flex-col gap-4">
                    <div>
                      <p className="text-sm font-medium mb-2">Assign Technician</p>
                      <div className="flex gap-2">
                        <Select
                          onValueChange={(value) => handleAssignTechnician(selectedRequest.id, value)}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select technician" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Mike Technician">Mike Technician</SelectItem>
                            <SelectItem value="Sarah Electrician">Sarah Electrician</SelectItem>
                            <SelectItem value="John Plumber">John Plumber</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <Button 
                      onClick={() => handleUpdateStatus(selectedRequest.id, "in_progress")}
                    >
                      Mark as In Progress
                    </Button>
                  </div>
                )}
                
                {selectedRequest.status === "in_progress" && (
                  <Button 
                    onClick={() => handleUpdateStatus(selectedRequest.id, "completed")}
                    className="w-full"
                  >
                    <CheckSquare className="h-4 w-4 mr-2" />
                    Mark as Completed
                  </Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}

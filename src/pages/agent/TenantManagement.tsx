import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Search, User, CreditCard, Filter, Plus, ArrowUpDown, Clock, Ban, Building } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
import { DepositRefundModal, DepositRefundData } from "@/components/tenants/DepositRefundModal";
import { AddEditTenantModal } from "@/components/tenants/AddEditTenantModal";
import { useToast } from "@/hooks/use-toast";
import { ReceivePaymentModal } from "@/components/tenants/ReceivePaymentModal";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";

interface Tenant {
  id: number;
  name: string;
  unit: string;
  property: string;
  moveInDate: string;
  leaseEnd: string;
  rentStatus: "current" | "late" | "grace_period";
  lastPayment: string;
  balance?: number;
  status: "active" | "notice" | "eviction" | "moved_out" | "archived";
}

export default function AgentTenantManagement() {
  const [tenants, setTenants] = useState<Tenant[]>([
    {
      id: 1,
      name: "Simba Eagle",
      unit: "Apt 301",
      property: "Sunset Apartments",
      moveInDate: "2023-01-15",
      leaseEnd: "2024-01-14",
      rentStatus: "current",
      lastPayment: "2024-03-01",
      balance: 0,
      status: "active"
    },
    {
      id: 2,
      name: "Mercy Wish",
      unit: "Apt 205",
      property: "Urban Lofts",
      moveInDate: "2023-03-01",
      leaseEnd: "2024-02-28",
      rentStatus: "late",
      lastPayment: "2024-02-01",
      balance: 2200,
      status: "active"
    },
    {
      id: 3,
      name: "Robert Davis",
      unit: "T1",
      property: "Maple Grove Townhomes",
      moveInDate: "2023-09-01",
      leaseEnd: "2024-08-31",
      rentStatus: "current",
      lastPayment: "2024-04-01",
      balance: 0,
      status: "active"
    },
    {
      id: 4,
      name: "Emma Johnson",
      unit: "B2",
      property: "Urban Lofts",
      moveInDate: "2022-11-15",
      leaseEnd: "2023-11-14",
      rentStatus: "grace_period",
      lastPayment: "2024-03-03",
      balance: 0,
      status: "notice"
    },
    {
      id: 5,
      name: "Michael Wilson",
      unit: "Apt 102",
      property: "Sunset Apartments",
      moveInDate: "2022-05-01",
      leaseEnd: "2023-04-30",
      rentStatus: "current",
      lastPayment: "2024-04-01",
      balance: 0,
      status: "active"
    },
    {
      id: 6,
      name: "Sarah Thompson",
      unit: "A1",
      property: "Urban Lofts",
      moveInDate: "2022-01-15",
      leaseEnd: "2023-01-14",
      rentStatus: "current",
      lastPayment: "2024-03-01",
      balance: 0,
      status: "moved_out"
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("active");
  const [propertyFilter, setPropertyFilter] = useState<string>("");
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Tenant | null,
    direction: 'asc' | 'desc'
  }>({ key: null, direction: 'asc' });
  
  const [showDepositRefundModal, setShowDepositRefundModal] = useState(false);
  const [showAddTenantModal, setShowAddTenantModal] = useState(false);
  const [showReceivePaymentModal, setShowReceivePaymentModal] = useState(false);
  const [selectedTenant, setSelectedTenant] = useState<Tenant | null>(null);
  
  const { toast } = useToast();

  const filteredTenants = tenants.filter(tenant => {
    const matchesSearch = 
      tenant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tenant.unit.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tenant.property.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || tenant.status === statusFilter;
    const matchesProperty = !propertyFilter || tenant.property === propertyFilter;
    
    return matchesSearch && matchesStatus && matchesProperty;
  });

  const requestSort = (key: keyof Tenant) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedTenants = [...filteredTenants].sort((a, b) => {
    if (!sortConfig.key) return 0;
    
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === 'asc' ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === 'asc' ? 1 : -1;
    }
    return 0;
  });

  const properties = Array.from(new Set(tenants.map(t => t.property)));

  const handleAddTenant = (tenantData: any) => {
    const newTenant: Tenant = {
      id: tenants.length + 1,
      name: tenantData.name,
      unit: tenantData.unit,
      property: tenantData.property,
      moveInDate: tenantData.moveInDate,
      leaseEnd: tenantData.leaseEnd,
      rentStatus: "current",
      lastPayment: "",
      balance: 0,
      status: "active"
    };
    
    setTenants([...tenants, newTenant]);
    
    toast({
      title: "Tenant added",
      description: `${tenantData.name} has been added successfully.`
    });
  };

  const handleProcessMoveOut = (tenant: Tenant) => {
    setSelectedTenant(tenant);
    setShowDepositRefundModal(true);
  };

  const handleDepositRefund = (data: DepositRefundData) => {
    if (!selectedTenant) return;

    setTenants(tenants.map(t => {
      if (t.id === selectedTenant.id) {
        return {
          ...t,
          status: "archived" as const
        };
      }
      return t;
    }));
    
    toast({
      title: "Move-out processed",
      description: `${selectedTenant.name} has been moved out and deposit refund processed.`
    });

    toast({
      title: "Unit available",
      description: `${selectedTenant.unit} in ${selectedTenant.property} is now available for rent.`,
      variant: "default"
    });
  };

  const handleOpenReceivePayment = (tenant: Tenant) => {
    setSelectedTenant(tenant);
    setShowReceivePaymentModal(true);
  };

  const handleProcessPayment = (info: { 
    monthsPaid: string[], 
    paymentMode: "mpesa" | "bank", 
    slipOrMpesa: string,
    additionalFees: { type: string; amount: number; }[]
  }) => {
    if (!selectedTenant) return;

    const basePaymentAmount = info.monthsPaid.length * 2500;
    const additionalFeesTotal = info.additionalFees.reduce((sum, fee) => sum + fee.amount, 0);
    const totalPaymentAmount = basePaymentAmount + additionalFeesTotal;

    setTenants(tenants.map(t => {
      if (t.id === selectedTenant.id) {
        const newBalance = (t.balance || 0) - totalPaymentAmount;
        return {
          ...t,
          balance: newBalance < 0 ? 0 : newBalance,
          rentStatus: "current" as const,
          lastPayment: new Date().toISOString().split('T')[0]
        };
      }
      return t;
    }));
    
    toast({
      title: "Payment received",
      description: `Payment of $${totalPaymentAmount} received from ${selectedTenant.name} via ${info.paymentMode}.`
    });
  };

  const statusStyles = {
    active: "bg-green-100 text-green-800",
    notice: "bg-yellow-100 text-yellow-800",
    eviction: "bg-red-100 text-red-800",
    moved_out: "bg-gray-100 text-gray-800",
    archived: "bg-gray-100 text-gray-800"
  };

  const rentStatusStyles = {
    current: "bg-green-100 text-green-800",
    grace_period: "bg-blue-100 text-blue-800",
    late: "bg-red-100 text-red-800"
  };

  const activeTenants = tenants.filter(t => t.status === "active").length;
  const tenantOnNotice = tenants.filter(t => t.status === "notice").length;
  const latePayments = tenants.filter(t => t.rentStatus === "late").length;

  return (
    <DashboardLayout requiredPermission="manage:tenants">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Tenant Management</h1>
          <div className="flex items-center gap-4">
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search tenants..."
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[130px]">
                  <SelectValue placeholder="Status filter" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="notice">Notice Given</SelectItem>
                  <SelectItem value="eviction">Eviction</SelectItem>
                  <SelectItem value="moved_out">Moved Out</SelectItem>
                  <SelectItem value="archived">Archived</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={propertyFilter} onValueChange={setPropertyFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by property" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Properties</SelectItem>
                  {properties.map(property => (
                    <SelectItem key={property} value={property}>{property}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button onClick={() => setShowAddTenantModal(true)}>
              <User className="h-4 w-4 mr-2" />
              Add Tenant
            </Button>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Active Tenants
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeTenants}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Notice Given
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{tenantOnNotice}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Late Payments
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{latePayments}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Occupancy Rate
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {tenants.length > 0 
                  ? `${Math.round(((activeTenants + tenantOnNotice) / tenants.length) * 100)}%` 
                  : "0%"}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Tenant Management</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="cursor-pointer" onClick={() => requestSort('name')}>
                    <div className="flex items-center">
                      Tenant Name
                      {sortConfig.key === 'name' && (
                        <ArrowUpDown className="h-4 w-4 ml-1" />
                      )}
                    </div>
                  </TableHead>
                  <TableHead className="cursor-pointer" onClick={() => requestSort('property')}>
                    <div className="flex items-center">
                      Property
                      {sortConfig.key === 'property' && (
                        <ArrowUpDown className="h-4 w-4 ml-1" />
                      )}
                    </div>
                  </TableHead>
                  <TableHead className="cursor-pointer" onClick={() => requestSort('unit')}>
                    <div className="flex items-center">
                      Unit
                      {sortConfig.key === 'unit' && (
                        <ArrowUpDown className="h-4 w-4 ml-1" />
                      )}
                    </div>
                  </TableHead>
                  <TableHead className="cursor-pointer" onClick={() => requestSort('moveInDate')}>
                    <div className="flex items-center">
                      Move-in Date
                      {sortConfig.key === 'moveInDate' && (
                        <ArrowUpDown className="h-4 w-4 ml-1" />
                      )}
                    </div>
                  </TableHead>
                  <TableHead className="cursor-pointer" onClick={() => requestSort('leaseEnd')}>
                    <div className="flex items-center">
                      Lease End
                      {sortConfig.key === 'leaseEnd' && (
                        <ArrowUpDown className="h-4 w-4 ml-1" />
                      )}
                    </div>
                  </TableHead>
                  <TableHead>Rent Status</TableHead>
                  <TableHead>Balance</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedTenants.length > 0 ? sortedTenants.map((tenant) => (
                  <TableRow key={tenant.id}>
                    <TableCell className="font-medium">{tenant.name}</TableCell>
                    <TableCell>{tenant.property}</TableCell>
                    <TableCell>{tenant.unit}</TableCell>
                    <TableCell>{tenant.moveInDate}</TableCell>
                    <TableCell>{tenant.leaseEnd}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        rentStatusStyles[tenant.rentStatus]
                      }`}>
                        {tenant.rentStatus === 'grace_period' ? 'Grace Period' : tenant.rentStatus}
                      </span>
                    </TableCell>
                    <TableCell>
                      {tenant.balance && tenant.balance > 0 ? (
                        <span className="text-destructive font-medium">${tenant.balance}</span>
                      ) : (
                        <span>$0</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        statusStyles[tenant.status]
                      }`}>
                        {tenant.status === 'moved_out' ? 'Moved Out' : tenant.status}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" size="sm" asChild>
                          <Link to={`/agent/tenants/${tenant.id}`}>View Details</Link>
                        </Button>
                        
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <span className="sr-only">Open menu</span>
                              <span className="h-4 w-4">⋯</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            
                            {(tenant.status === "active" || tenant.status === "notice") && (
                              <>
                                <DropdownMenuItem onClick={() => handleOpenReceivePayment(tenant)}>
                                  <CreditCard className="h-4 w-4 mr-2" />
                                  Record Payment
                                </DropdownMenuItem>
                                {tenant.status !== "notice" && (
                                  <DropdownMenuItem>
                                    <Clock className="h-4 w-4 mr-2" />
                                    Record Notice
                                  </DropdownMenuItem>
                                )}
                                <DropdownMenuItem>
                                  <Ban className="h-4 w-4 mr-2" />
                                  Start Eviction
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                              </>
                            )}
                            
                            {tenant.status === "notice" && (
                              <DropdownMenuItem onClick={() => handleProcessMoveOut(tenant)}>
                                <Building className="h-4 w-4 mr-2" />
                                Process Move-Out
                              </DropdownMenuItem>
                            )}
                            
                            {tenant.status === "moved_out" && (
                              <DropdownMenuItem onClick={() => {
                                setTenants(tenants.map(t => 
                                  t.id === tenant.id ? {...t, status: "archived" as const} : t
                                ));
                                
                                toast({
                                  title: "Tenant archived",
                                  description: `${tenant.name} has been archived.`
                                });
                              }}>
                                <Building className="h-4 w-4 mr-2" />
                                Archive Tenant
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </TableRow>
                )) : (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-6 text-muted-foreground">
                      No tenants found matching the selected filters.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
      
      <DepositRefundModal 
        open={showDepositRefundModal}
        onClose={() => setShowDepositRefundModal(false)}
        onSubmit={handleDepositRefund}
        tenant={{
          name: selectedTenant?.name || "",
          unit: selectedTenant?.unit || "",
          deposit: 2500,
          balance: selectedTenant?.balance || 0,
          paymentStatus: (selectedTenant?.rentStatus === 'current' ? 'current' : 'overdue') as 'current' | 'overdue'
        }}
        onMoveOut={() => {}}
      />
      
      <AddEditTenantModal
        open={showAddTenantModal}
        onClose={() => setShowAddTenantModal(false)}
        onSubmit={handleAddTenant}
        tenant={null}
      />
      
      <ReceivePaymentModal
        open={showReceivePaymentModal}
        onClose={() => setShowReceivePaymentModal(false)}
        onSubmit={handleProcessPayment}
        monthsDue={["2024-01", "2024-02", "2024-03", "2024-04"]}
        modalType="due"
      />
    </DashboardLayout>
  );
}

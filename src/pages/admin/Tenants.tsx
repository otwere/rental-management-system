import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Search, User, CreditCard, FileText, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { AddEditTenantModal } from "@/components/tenants/AddEditTenantModal";

export default function AdminTenants() {
  const allTenants = [
    {
      id: "t1",
      name: "Simba Eagle",
      unit: "Apt 301",
      moveInDate: "2023-01-15",
      leaseEnd: "2024-01-14",
      rentStatus: "current",
      lastPayment: "2024-03-01",
      rentAmount: 2500,
      phoneNumber: "+254733443224",
      email: "john@example.com",
      occupants: 2,
      pets: "1 cat",
    },
    {
      id: "t2",
      name: "Mercy Wish",
      unit: "Apt 205",
      moveInDate: "2023-03-01",
      leaseEnd: "2024-02-28",
      rentStatus: "late",
      lastPayment: "2024-02-01",
      rentAmount: 2200,
      phoneNumber: "+254 700 987-6543",
      email: "jane@example.com",
      occupants: 1,
      pets: "No pets",
    },
    {
      id: "t3",
      name: "Robert Johnson",
      unit: "Apt 112",
      moveInDate: "2023-05-10",
      leaseEnd: "2024-05-09",
      rentStatus: "current",
      lastPayment: "2024-03-01",
      rentAmount: 2300,
      phoneNumber: "+254 700 456-7890",
      email: "robert@example.com",
      occupants: 3,
      pets: "2 dogs",
    },
  ];

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const tenantsPerPage = 5;

  const [addEditModalOpen, setAddEditModalOpen] = useState(false);
  const [editingTenant, setEditingTenant] = useState<any | null>(null);
  const [tenants, setTenants] = useState(allTenants);

  const filteredTenants = tenants.filter((tenant) => {
    const matchesSearch =
      tenant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tenant.unit.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tenant.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || tenant.rentStatus === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredTenants.length / tenantsPerPage);
  const startIndex = (currentPage - 1) * tenantsPerPage;
  const paginatedTenants = filteredTenants.slice(
    startIndex,
    startIndex + tenantsPerPage
  );

  const totalTenants = allTenants.length;
  const activeLeases = allTenants.length;
  const dueForRenewal = allTenants.filter(
    (tenant) =>
      new Date(tenant.leaseEnd) <= new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
  ).length;
  const latePayments = allTenants.filter(
    (tenant) => tenant.rentStatus === "late"
  ).length;

  function handleAddTenant(modal: boolean) {
    setEditingTenant(null);
    setAddEditModalOpen(modal);
  }
  function handleEditTenant(tenant: any) {
    setEditingTenant(tenant);
    setAddEditModalOpen(true);
  }
  function handleSaveTenant(updated: any) {
    if (editingTenant) {
      setTenants(ts => ts.map(t => t.id === editingTenant.id ? { ...t, ...updated } : t));
    } else {
      setTenants(ts => [{ ...updated, id: "t" + (Math.random()*10000).toFixed(0) }, ...ts]);
    }
    setAddEditModalOpen(false);
    setEditingTenant(null);
  }

  function monthsBetweenDates(start: string, end: string) {
    const d1 = new Date(start), d2 = new Date(end);
    return Math.max(0, (d2.getFullYear() - d1.getFullYear()) * 12 + (d2.getMonth() - d1.getMonth())
      + (+d2.getDate() >= +d1.getDate() ? 0 : -1)
    );
  }

  function getMonthsDue(tenant: any) {
    if (tenant.rentStatus !== "late") return [];
    const now = new Date(), lastPay = new Date(tenant.lastPayment);
    const due: string[] = [];
    let curr = new Date(lastPay);
    curr.setDate(1);
    while (
      curr <= now &&
      (curr.getMonth() !== now.getMonth() || curr.getFullYear() !== now.getFullYear())
    ) {
      curr.setMonth(curr.getMonth() + 1);
      due.push(`${curr.getFullYear()}-${String(curr.getMonth() + 1).padStart(2,"0")}`);
    }
    return due;
  }

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
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="current">Current</SelectItem>
                <SelectItem value="late">Late</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={()=>handleAddTenant(true)}>
              <User className="h-4 w-4 mr-2" />
              Add Tenant
            </Button>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Tenants
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalTenants}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Active Leases
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeLeases}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Due for Renewal
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dueForRenewal}</div>
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
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Current Tenants</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tenant Name</TableHead>
                  <TableHead>Contact Info</TableHead>
                  <TableHead>Unit</TableHead>
                  <TableHead>Lease Period</TableHead>
                  <TableHead>Rent Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last Payment</TableHead>
                  <TableHead>Duration of Stay</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedTenants.map((tenant) => (
                  <TableRow key={tenant.id}>
                    <TableCell className="font-medium">
                      <div>{tenant.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {tenant.occupants} occupants • {tenant.pets}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">{tenant.email}</div>
                      <div className="text-sm text-muted-foreground">
                        {tenant.phoneNumber}
                      </div>
                    </TableCell>
                    <TableCell>{tenant.unit}</TableCell>
                    <TableCell>
                      <div className="text-sm">From: {tenant.moveInDate}</div>
                      <div className="text-sm">To: {tenant.leaseEnd}</div>
                    </TableCell>
                    <TableCell>${tenant.rentAmount}</TableCell>
                    <TableCell>
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          tenant.rentStatus === "current"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {tenant.rentStatus}
                      </span>
                    </TableCell>
                    <TableCell>{tenant.lastPayment}</TableCell>
                    <TableCell>
                      <span className="font-poppins">{monthsBetweenDates(tenant.moveInDate, new Date().toISOString().slice(0,10))} months</span>
                    </TableCell>
                    <TableCell className="text-right flex gap-2 justify-end">
                      <Button variant="outline" size="sm" asChild>
                        <Link to={`/admin/tenants/${tenant.id}`}>
                          View Details
                        </Link>
                      </Button>
                      <Button variant="ghost" size="sm" onClick={()=>handleEditTenant(tenant)}>
                        Edit
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {totalPages > 1 && (
              <div className="mt-4">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        onClick={() =>
                          setCurrentPage((prev) => Math.max(prev - 1, 1))
                        }
                        className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                      />
                    </PaginationItem>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                      (page) => (
                        <PaginationItem key={page}>
                          <PaginationLink
                            onClick={() => setCurrentPage(page)}
                            isActive={currentPage === page}
                          >
                            {page}
                          </PaginationLink>
                        </PaginationItem>
                      )
                    )}
                    <PaginationItem>
                      <PaginationNext
                        onClick={() =>
                          setCurrentPage((prev) =>
                            Math.min(prev + 1, totalPages)
                          )
                        }
                        className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      <AddEditTenantModal 
        open={addEditModalOpen}
        onClose={()=>{setAddEditModalOpen(false); setEditingTenant(null);}}
        onSubmit={handleSaveTenant}
        tenant={editingTenant}
      />
    </DashboardLayout>
  );
}

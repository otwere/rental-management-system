import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { 
  Search, 
  Building, 
  Plus, 
  Filter, 
  MapPin, 
  Home, 
  Users,
  Edit,
  Trash,
  Check,
  X,
  Camera
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { MOCK_PROPERTIES, Property } from "@/types/property";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { UnitCard } from "@/components/properties/UnitCard";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

export default function AgentProperties() {
  const [properties, setProperties] = useState<Property[]>(MOCK_PROPERTIES);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [showPropertyDetails, setShowPropertyDetails] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<string | null>(null);
  const { toast } = useToast();

  const filteredProperties = properties.filter(property => {
    const matchesSearch = 
      property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.address.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.address.street.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = !filterType || property.type === filterType;
    
    return matchesSearch && matchesType;
  });

  const getPropertyStats = (property: Property) => {
    const totalUnits = property.units.length;
    const availableUnits = property.units.filter(u => u.status === "available").length;
    return { totalUnits, availableUnits };
  };

  const handleViewProperty = (property: Property) => {
    setSelectedProperty(property);
    setShowPropertyDetails(true);
  };

  const handleAssignTenant = (unitId: string, tenantDetails: any) => {
    if (!selectedProperty) return;
    
    setProperties(properties.map(p => {
      if (p.id === selectedProperty.id) {
        const updatedUnits = p.units.map(unit => {
          if (unit.id === unitId) {
            return {
              ...unit,
              status: "rented" as const,
              tenantId: tenantDetails.id,
              leaseStart: new Date().toISOString().split('T')[0],
              leaseEnd: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
            };
          }
          return unit;
        });
        
        const updatedProperty = {
          ...p,
          units: updatedUnits
        };
        
        setSelectedProperty(updatedProperty);
        return updatedProperty;
      }
      return p;
    }));
    
    toast({
      title: "Tenant assigned",
      description: `${tenantDetails.name} has been assigned to a unit in ${selectedProperty.title}.`
    });
  };

  const handleApproveApplication = (unitId: string, applicationId: string) => {
    if (!selectedProperty) return;
    
    setProperties(properties.map(p => {
      if (p.id === selectedProperty.id) {
        const updatedUnits = p.units.map(unit => {
          if (unit.id === unitId && unit.applications) {
            const updatedApplications = unit.applications.map(app => 
              app.id === applicationId ? { ...app, status: "approved" as const } : app
            );
            
            return {
              ...unit,
              applications: updatedApplications
            };
          }
          return unit;
        });
        
        const updatedProperty = {
          ...p,
          units: updatedUnits
        };
        
        setSelectedProperty(updatedProperty);
        return updatedProperty;
      }
      return p;
    }));
    
    toast({
      title: "Application approved",
      description: "The tenant application has been approved."
    });
  };

  const handleRejectApplication = (unitId: string, applicationId: string) => {
    if (!selectedProperty) return;
    
    setProperties(properties.map(p => {
      if (p.id === selectedProperty.id) {
        const updatedUnits = p.units.map(unit => {
          if (unit.id === unitId && unit.applications) {
            const updatedApplications = unit.applications.map(app => 
              app.id === applicationId ? { ...app, status: "rejected" as const } : app
            );
            
            return {
              ...unit,
              applications: updatedApplications
            };
          }
          return unit;
        });
        
        const updatedProperty = {
          ...p,
          units: updatedUnits
        };
        
        setSelectedProperty(updatedProperty);
        return updatedProperty;
      }
      return p;
    }));
    
    toast({
      title: "Application rejected",
      description: "The tenant application has been rejected."
    });
  };

  const handleAddApplication = (unitId: string, application: any) => {
    if (!selectedProperty) return;
    
    const newApplication = {
      ...application,
      id: `app-${Date.now()}`,
      status: "pending" as const,
      submissionDate: new Date().toISOString().split('T')[0]
    };
    
    setProperties(properties.map(p => {
      if (p.id === selectedProperty.id) {
        const updatedUnits = p.units.map(unit => {
          if (unit.id === unitId) {
            return {
              ...unit,
              applications: [...(unit.applications || []), newApplication]
            };
          }
          return unit;
        });
        
        const updatedProperty = {
          ...p,
          units: updatedUnits
        };
        
        setSelectedProperty(updatedProperty);
        return updatedProperty;
      }
      return p;
    }));
    
    toast({
      title: "Application added",
      description: `New application for ${application.name} has been added.`
    });
  };

  return (
    <DashboardLayout requiredPermission="view:assigned_properties">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Property Management</h1>
          <div className="flex items-center gap-4">
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search properties..."
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>Property Type</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setFilterType(null)}>
                  All Types {!filterType && <Check className="h-4 w-4 ml-2" />}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterType("apartment")}>
                  Apartment {filterType === "apartment" && <Check className="h-4 w-4 ml-2" />}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterType("house")}>
                  House {filterType === "house" && <Check className="h-4 w-4 ml-2" />}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterType("condo")}>
                  Condo {filterType === "condo" && <Check className="h-4 w-4 ml-2" />}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterType("townhouse")}>
                  Townhouse {filterType === "townhouse" && <Check className="h-4 w-4 ml-2" />}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Property
            </Button>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Properties
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{properties.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Available Units
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {properties.reduce((total, property) => 
                  total + property.units.filter(unit => unit.status === "available").length, 0
                )}
              </div>
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
                {(() => {
                  const totalUnits = properties.reduce((total, property) => total + property.units.length, 0);
                  const rentedUnits = properties.reduce((total, property) => 
                    total + property.units.filter(unit => unit.status === "rented").length, 0
                  );
                  return totalUnits > 0 ? `${Math.round((rentedUnits / totalUnits) * 100)}%` : "0%";
                })()}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Properties</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Property</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Units</TableHead>
                  <TableHead>Amenities</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProperties.length > 0 ? (
                  filteredProperties.map((property) => {
                    const { totalUnits, availableUnits } = getPropertyStats(property);
                    return (
                      <TableRow key={property.id}>
                        <TableCell className="font-medium">{property.title}</TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <MapPin className="h-4 w-4 mr-1 text-muted-foreground" />
                            <span>{property.address.city}, {property.address.state}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="capitalize">{property.type}</span>
                        </TableCell>
                        <TableCell>
                          <span>{availableUnits} available / {totalUnits} total</span>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {property.amenities.slice(0, 2).map((amenity, idx) => (
                              <span
                                key={idx}
                                className="inline-flex items-center rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary"
                              >
                                {amenity}
                              </span>
                            ))}
                            {property.amenities.length > 2 && (
                              <span className="inline-flex items-center rounded-full bg-muted px-2 py-0.5 text-xs font-medium">
                                +{property.amenities.length - 2} more
                              </span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="outline" size="sm" onClick={() => handleViewProperty(property)}>
                              View Details
                            </Button>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <span className="sr-only">Open menu</span>
                                  <span className="h-4 w-4">⋯</span>
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem className="flex items-center">
                                  <Edit className="mr-2 h-4 w-4" /> Edit Property
                                </DropdownMenuItem>
                                <DropdownMenuItem className="flex items-center">
                                  <Camera className="mr-2 h-4 w-4" /> Manage Photos
                                </DropdownMenuItem>
                                <DropdownMenuItem className="flex items-center">
                                  <Users className="mr-2 h-4 w-4" /> Show Tenants
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="text-destructive flex items-center">
                                  <Trash className="mr-2 h-4 w-4" /> Archive Property
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                      No properties found matching your search.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* Property Details Dialog */}
      <Dialog open={showPropertyDetails} onOpenChange={setShowPropertyDetails}>
        <DialogContent className="max-w-4xl overflow-auto max-h-[90vh]">
          <DialogHeader>
            <DialogTitle className="text-xl">{selectedProperty?.title}</DialogTitle>
          </DialogHeader>
          
          {selectedProperty && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div>
                  <div className="rounded-md bg-muted aspect-video relative flex items-center justify-center">
                    <Building className="h-12 w-12 text-muted-foreground" />
                    <span className="absolute bottom-2 right-2 px-2 py-1 bg-background/80 rounded text-xs font-medium">
                      No Image Available
                    </span>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium text-sm text-muted-foreground">Address</h3>
                    <p>{selectedProperty.address.street}, {selectedProperty.address.city}, {selectedProperty.address.state} {selectedProperty.address.zip}</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h3 className="font-medium text-sm text-muted-foreground">Property Type</h3>
                      <p className="capitalize">{selectedProperty.type}</p>
                    </div>
                    <div>
                      <h3 className="font-medium text-sm text-muted-foreground">Year Built</h3>
                      <p>{selectedProperty.yearBuilt}</p>
                    </div>
                    <div>
                      <h3 className="font-medium text-sm text-muted-foreground">Total Units</h3>
                      <p>{selectedProperty.units.length}</p>
                    </div>
                    <div>
                      <h3 className="font-medium text-sm text-muted-foreground">Parking Available</h3>
                      <p>{selectedProperty.parkingAvailable ? "Yes" : "No"}</p>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-medium text-sm text-muted-foreground">Amenities</h3>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {selectedProperty.amenities.map((amenity, idx) => (
                        <span
                          key={idx}
                          className="inline-flex items-center rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary"
                        >
                          {amenity}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-medium text-sm text-muted-foreground">Description</h3>
                    <p className="text-sm">{selectedProperty.description}</p>
                  </div>
                </div>
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium">Units</h3>
                  <div className="flex items-center gap-2">
                    <Select defaultValue="all">
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Filter by status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Units</SelectItem>
                        <SelectItem value="available">Available</SelectItem>
                        <SelectItem value="rented">Rented</SelectItem>
                        <SelectItem value="maintenance">Maintenance</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Unit
                    </Button>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {selectedProperty.units.map(unit => (
                    <UnitCard
                      key={unit.id}
                      unit={unit}
                      onAssignTenant={(unitId, tenantDetails) => handleAssignTenant(unitId, tenantDetails)}
                      onApproveApplication={(unitId, applicationId) => handleApproveApplication(unitId, applicationId)}
                      onRejectApplication={(unitId, applicationId) => handleRejectApplication(unitId, applicationId)}
                      onAddApplication={(unitId, application) => handleAddApplication(unitId, application)}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}


import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Building, Home, Map, Filter } from "lucide-react";
import { Property, MOCK_PROPERTIES, Unit, TenantApplication } from "@/types/property";
import { PropertyFormModal } from "@/components/modals/PropertyFormModal";
import { UnitCard } from "@/components/properties/UnitCard";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Properties() {
  const [searchTerm, setSearchTerm] = useState("");
  const [propertyType, setPropertyType] = useState<string>("all");
  const [unitStatus, setUnitStatus] = useState<string>("all");
  const [properties, setProperties] = useState<Property[]>(MOCK_PROPERTIES);
  const { toast } = useToast();
  
  const handleAddProperty = (data: Partial<Property>) => {
    const newProperty: Property = {
      id: `${properties.length + 1}`,
      title: data.title || "New Property",
      type: data.type || "apartment",
      totalFloors: data.totalFloors || 1,
      totalUnits: data.totalUnits || 0,
      yearBuilt: data.yearBuilt || new Date().getFullYear(),
      parkingAvailable: data.parkingAvailable || false,
      amenities: data.amenities || [],
      description: data.description || "",
      address: data.address || {
        street: "",
        city: "",
        state: "",
        zip: "",
        country: "",
      },
      units: data.units || [],
    };
    setProperties([...properties, newProperty]);
    toast({
      title: "Property added",
      description: "The property has been successfully added."
    });
  };
  
  const handleAssignTenant = (unitId: string, tenantDetails: any) => {
    const updatedProperties = properties.map(property => {
      const updatedUnits = property.units.map(unit => {
        if (unit.id === unitId) {
          return {
            ...unit,
            status: "rented" as const,
            tenantId: `tenant-${Math.random().toString(36).substr(2, 9)}`,
            leaseStart: tenantDetails.leaseStart,
            leaseEnd: tenantDetails.leaseEnd
          };
        }
        return unit;
      });
      
      return {
        ...property,
        units: updatedUnits
      };
    });
    
    setProperties(updatedProperties);
  };
  
  const handleApproveApplication = (unitId: string, applicationId: string) => {
    const updatedProperties = properties.map(property => {
      const updatedUnits = property.units.map(unit => {
        if (unit.id === unitId && unit.applications) {
          const updatedApplications = unit.applications.map(app => 
            app.id === applicationId ? { ...app, status: "approved" as const } : app
          );
          return { ...unit, applications: updatedApplications, status: "reserved" as const };
        }
        return unit;
      });
      
      return { ...property, units: updatedUnits };
    });
    
    setProperties(updatedProperties);
  };
  
  const handleRejectApplication = (unitId: string, applicationId: string) => {
    const updatedProperties = properties.map(property => {
      const updatedUnits = property.units.map(unit => {
        if (unit.id === unitId && unit.applications) {
          const updatedApplications = unit.applications.map(app => 
            app.id === applicationId ? { ...app, status: "rejected" as const } : app
          );
          return { ...unit, applications: updatedApplications };
        }
        return unit;
      });
      
      return { ...property, units: updatedUnits };
    });
    
    setProperties(updatedProperties);
  };
  
  const handleAddApplication = (unitId: string, application: Omit<TenantApplication, "id" | "status" | "submissionDate">) => {
    const newApplication: TenantApplication = {
      ...application,
      id: `app-${Math.random().toString(36).substr(2, 9)}`,
      status: "pending",
      submissionDate: new Date().toISOString().split('T')[0]
    };
    
    const updatedProperties = properties.map(property => {
      const updatedUnits = property.units.map(unit => {
        if (unit.id === unitId) {
          const existingApplications = unit.applications || [];
          return {
            ...unit,
            applications: [...existingApplications, newApplication]
          };
        }
        return unit;
      });
      
      return { ...property, units: updatedUnits };
    });
    
    setProperties(updatedProperties);
    toast({
      title: "Application received",
      description: "The tenant application has been successfully submitted."
    });
  };
  
  // Count statistics
  const totalProperties = properties.length;
  const totalUnits = properties.reduce((acc, property) => acc + property.units.length, 0);
  const availableUnits = properties.reduce((acc, property) => 
    acc + property.units.filter(unit => unit.status === "available").length, 0
  );
  const occupiedUnits = properties.reduce((acc, property) => 
    acc + property.units.filter(unit => unit.status === "rented").length, 0
  );
  
  // Filter properties based on search term and property type
  const filteredProperties = properties
    .filter(property => propertyType === 'all' || property.type === propertyType)
    .filter(property => property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       property.address.city.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Properties</h2>
            <p className="text-muted-foreground">
              Manage your property portfolio and units
            </p>
          </div>
          <PropertyFormModal mode="create" onSubmit={handleAddProperty} />
        </div>
        
        {/* Dashboard stats */}
        <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
          <Card>
            <CardHeader className="py-3">
              <CardTitle className="text-sm font-medium">Total Properties</CardTitle>
            </CardHeader>
            <CardContent className="py-1">
              <p className="text-2xl font-bold">{totalProperties}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="py-3">
              <CardTitle className="text-sm font-medium">Total Units</CardTitle>
            </CardHeader>
            <CardContent className="py-1">
              <p className="text-2xl font-bold">{totalUnits}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="py-3">
              <CardTitle className="text-sm font-medium">Available Units</CardTitle>
            </CardHeader>
            <CardContent className="py-1">
              <p className="text-2xl font-bold text-green-600">{availableUnits}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="py-3">
              <CardTitle className="text-sm font-medium">Occupied Units</CardTitle>
            </CardHeader>
            <CardContent className="py-1">
              <p className="text-2xl font-bold text-blue-600">{occupiedUnits}</p>
            </CardContent>
          </Card>
        </div>

        {/* Search and filter bar */}
        <Card className="col-span-full">
          <CardContent className="pt-6">
            <div className="flex flex-col gap-4 md:flex-row">
              <Input
                placeholder="Search properties or cities..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="md:w-[300px]"
              />
              <Select
                value={propertyType}
                onValueChange={setPropertyType}
              >
                <SelectTrigger className="md:w-[200px]">
                  <SelectValue placeholder="Property Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="apartment">Apartment</SelectItem>
                  <SelectItem value="house">House</SelectItem>
                  <SelectItem value="condo">Condo</SelectItem>
                  <SelectItem value="townhouse">Townhouse</SelectItem>
                </SelectContent>
              </Select>
              
              <div className="ml-auto flex items-center gap-2">
                <Badge variant="outline" className="flex gap-1">
                  <Filter className="h-3 w-3" /> Filters
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {filteredProperties.length > 0 ? (
          filteredProperties.map((property) => (
            <PropertyCard 
              key={property.id} 
              property={property} 
              onAssignTenant={handleAssignTenant}
              onApproveApplication={handleApproveApplication}
              onRejectApplication={handleRejectApplication}
              onAddApplication={handleAddApplication}
            />
          ))
        ) : (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No properties found matching your criteria.</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

function PropertyCard({ 
  property,
  onAssignTenant,
  onApproveApplication,
  onRejectApplication,
  onAddApplication
}: { 
  property: Property;
  onAssignTenant: (unitId: string, tenantDetails: any) => void;
  onApproveApplication: (unitId: string, applicationId: string) => void;
  onRejectApplication: (unitId: string, applicationId: string) => void;
  onAddApplication: (unitId: string, application: Omit<TenantApplication, "id" | "status" | "submissionDate">) => void;
}) {
  const availableUnits = property.units.filter(unit => unit.status === "available").length;
  const totalUnits = property.units.length;
  
  const getPropertyIcon = (type: string) => {
    switch (type) {
      case "apartment":
        return Building;
      case "house":
        return Home;
      default:
        return Building;
    }
  };
  
  const PropertyIcon = getPropertyIcon(property.type);
  const [activeTab, setActiveTab] = useState("overview");
  const [showUnits, setShowUnits] = useState(false);

  return (
    <>
      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xl font-semibold">
            {property.title}
          </CardTitle>
          <PropertyIcon className="h-5 w-5 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start gap-2 text-sm">
              <Map className="h-4 w-4 text-muted-foreground mt-0.5" />
              <span className="text-muted-foreground">
                {property.address.street}, {property.address.city}, {property.address.state} {property.address.zip}
              </span>
            </div>
            
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="details">Details</TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview">
                <div className="grid grid-cols-2 gap-2 text-sm mt-2">
                  <div>
                    <p className="text-muted-foreground">Total Floors</p>
                    <p className="font-medium">{property.totalFloors}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Available Units</p>
                    <p className="font-medium">{availableUnits} of {totalUnits}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Year Built</p>
                    <p className="font-medium">{property.yearBuilt}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Parking</p>
                    <p className="font-medium">{property.parkingAvailable ? "Available" : "Not Available"}</p>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="details">
                <div className="mt-2 space-y-2">
                  <div className="text-sm">
                    <p className="text-muted-foreground">Description</p>
                    <p className="text-sm">{property.description}</p>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {property.amenities.map((amenity, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary"
                      >
                        {amenity}
                      </span>
                    ))}
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            <Button variant="outline" className="w-full" onClick={() => setShowUnits(!showUnits)}>
              {showUnits ? "Hide Units" : "View Units"}
            </Button>
          </div>
        </CardContent>
      </Card>
      
      {showUnits && (
        <Card className="col-span-full mt-2">
          <CardHeader>
            <CardTitle>Units in {property.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {property.units.map((unit) => (
                <UnitCard 
                  key={unit.id} 
                  unit={unit}
                  onAssignTenant={onAssignTenant}
                  onApproveApplication={onApproveApplication}
                  onRejectApplication={onRejectApplication}
                  onAddApplication={onAddApplication}
                />
              ))}
              {property.units.length === 0 && (
                <p className="text-muted-foreground col-span-full text-center py-4">No units available for this property</p>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </>
  );
}

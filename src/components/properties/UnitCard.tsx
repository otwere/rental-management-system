
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Unit } from "@/types/property";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { AssignTenantModal } from "@/components/modals/AssignTenantModal";
import { UnitApplicationsModal } from "@/components/modals/UnitApplicationsModal";
import { TenantApplication } from "@/types/property";
import { useToast } from "@/hooks/use-toast";
import { Calendar, FileText, User, Users } from "lucide-react";

interface UnitCardProps {
  unit: Unit;
  onAssignTenant: (unitId: string, tenantDetails: any) => void;
  onApproveApplication: (unitId: string, applicationId: string) => void;
  onRejectApplication: (unitId: string, applicationId: string) => void;
  onAddApplication: (unitId: string, application: Omit<TenantApplication, "id" | "status" | "submissionDate">) => void;
}

export function UnitCard({ 
  unit, 
  onAssignTenant, 
  onApproveApplication,
  onRejectApplication,
  onAddApplication
}: UnitCardProps) {
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showApplicationsModal, setShowApplicationsModal] = useState(false);
  const { toast } = useToast();
  
  const statusColors = {
    available: "bg-green-100 text-green-800",
    rented: "bg-blue-100 text-blue-800",
    maintenance: "bg-yellow-100 text-yellow-800",
    reserved: "bg-purple-100 text-purple-800"
  };
  
  const handleAssignTenant = (unitId: string, tenantDetails: any) => {
    onAssignTenant(unitId, tenantDetails);
    toast({
      title: "Tenant assigned",
      description: `${tenantDetails.name} has been assigned to Unit ${unit.number}.`
    });
  };
  
  const pendingApplicationsCount = unit.applications?.filter(app => app.status === "pending").length || 0;

  return (
    <>
      <Card className="hover:shadow-md transition-shadow">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Unit {unit.number}</CardTitle>
            <span className={cn(
              "px-2 py-1 rounded-full text-xs font-medium",
              statusColors[unit.status]
            )}>
              {unit.status.charAt(0).toUpperCase() + unit.status.slice(1)}
            </span>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Price</span>
              <span className="font-semibold">${unit.price}/month</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Floor</span>
              <span>{unit.floor}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Size</span>
              <span>{unit.size} sq ft</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Type</span>
              <span>{unit.bedrooms} bed, {unit.bathrooms} bath</span>
            </div>
            {unit.features.length > 0 && (
              <div className="flex flex-wrap gap-1 pt-2">
                {unit.features.slice(0, 2).map((feature, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary"
                  >
                    {feature}
                  </span>
                ))}
                {unit.features.length > 2 && (
                  <span className="inline-flex items-center rounded-full bg-muted px-2 py-0.5 text-xs font-medium">
                    +{unit.features.length - 2} more
                  </span>
                )}
              </div>
            )}
            
            {unit.tenantId && (
              <div className="pt-2 flex items-center text-sm">
                <User className="h-4 w-4 mr-1 text-primary" />
                <span className="font-medium">Tenant assigned</span>
              </div>
            )}
            
            {unit.leaseStart && unit.leaseEnd && (
              <div className="text-xs text-muted-foreground flex items-center">
                <Calendar className="h-3 w-3 mr-1" />
                Lease: {unit.leaseStart} to {unit.leaseEnd}
              </div>
            )}
            
            <div className="space-y-2 pt-2">
              <Button 
                variant="outline" 
                size="sm"
                className="w-full"
                onClick={() => setShowApplicationsModal(true)}
              >
                <FileText className="h-4 w-4 mr-1" /> 
                Applications
                {pendingApplicationsCount > 0 && (
                  <span className="ml-1.5 bg-primary text-primary-foreground rounded-full w-5 h-5 flex items-center justify-center text-xs">
                    {pendingApplicationsCount}
                  </span>
                )}
              </Button>
              
              {unit.status === "available" && (
                <Button 
                  variant="default" 
                  size="sm"
                  className="w-full"
                  onClick={() => setShowAssignModal(true)}
                >
                  <Users className="h-4 w-4 mr-1" /> Assign Tenant
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
      
      <AssignTenantModal
        isOpen={showAssignModal}
        onClose={() => setShowAssignModal(false)}
        unit={unit}
        onAssign={handleAssignTenant}
      />
      
      <UnitApplicationsModal
        isOpen={showApplicationsModal}
        onClose={() => setShowApplicationsModal(false)}
        unit={unit}
        onApproveApplication={onApproveApplication}
        onRejectApplication={onRejectApplication}
        onAddApplication={onAddApplication}
      />
    </>
  );
}

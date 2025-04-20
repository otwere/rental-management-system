
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { TenantApplication, Unit } from "@/types/property";
import { ApplicationCard } from "@/components/properties/ApplicationCard";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { NewApplicationForm } from "@/components/properties/NewApplicationForm";

interface UnitApplicationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  unit: Unit;
  onApproveApplication: (unitId: string, applicationId: string) => void;
  onRejectApplication: (unitId: string, applicationId: string) => void;
  onAddApplication: (unitId: string, application: Omit<TenantApplication, "id" | "status" | "submissionDate">) => void;
}

export function UnitApplicationsModal({
  isOpen,
  onClose,
  unit,
  onApproveApplication,
  onRejectApplication,
  onAddApplication
}: UnitApplicationsModalProps) {
  const [showNewApplicationForm, setShowNewApplicationForm] = useState(false);
  
  const handleApprove = (applicationId: string) => {
    onApproveApplication(unit.id, applicationId);
  };
  
  const handleReject = (applicationId: string) => {
    onRejectApplication(unit.id, applicationId);
  };
  
  const handleViewDocuments = (applicationId: string) => {
    // In a real app, this would open a document viewer
    console.log("View documents for application", applicationId);
  };
  
  const handleAddApplication = (application: Omit<TenantApplication, "id" | "status" | "submissionDate">) => {
    onAddApplication(unit.id, application);
    setShowNewApplicationForm(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Applications for Unit {unit.number}</DialogTitle>
        </DialogHeader>
        
        <div className="flex justify-between items-center mb-4">
          <p className="text-sm text-muted-foreground">
            {unit.applications?.length || 0} application(s)
          </p>
          
          {!showNewApplicationForm ? (
            <Button 
              size="sm"
              onClick={() => setShowNewApplicationForm(true)}
            >
              <Plus className="h-4 w-4 mr-1" /> Add Application
            </Button>
          ) : (
            <Button 
              size="sm" 
              variant="outline" 
              onClick={() => setShowNewApplicationForm(false)}
            >
              Cancel
            </Button>
          )}
        </div>
        
        {showNewApplicationForm ? (
          <NewApplicationForm unit={unit} onSubmit={handleAddApplication} />
        ) : (
          <div className="space-y-4">
            {unit.applications && unit.applications.length > 0 ? (
              unit.applications.map(application => (
                <ApplicationCard
                  key={application.id}
                  application={application}
                  onApprove={handleApprove}
                  onReject={handleReject}
                  onViewDocuments={handleViewDocuments}
                />
              ))
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No applications for this unit yet.</p>
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={() => setShowNewApplicationForm(true)}
                >
                  Create New Application
                </Button>
              </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}


import { TenantApplication } from "@/types/property";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatDistanceToNow } from "date-fns";
import { Check, X, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ApplicationCardProps {
  application: TenantApplication;
  onApprove: (applicationId: string) => void;
  onReject: (applicationId: string) => void;
  onViewDocuments: (applicationId: string) => void;
}

export function ApplicationCard({ 
  application, 
  onApprove, 
  onReject, 
  onViewDocuments 
}: ApplicationCardProps) {
  const { toast } = useToast();
  
  const statusStyles = {
    pending: "bg-yellow-100 text-yellow-800",
    approved: "bg-green-100 text-green-800",
    rejected: "bg-red-100 text-red-800"
  };
  
  const handleApprove = () => {
    onApprove(application.id);
    toast({
      title: "Application approved",
      description: `${application.name}'s application has been approved.`
    });
  };
  
  const handleReject = () => {
    onReject(application.id);
    toast({
      title: "Application rejected",
      description: `${application.name}'s application has been rejected.`
    });
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{application.name}</CardTitle>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusStyles[application.status]}`}>
            {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
          </span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <p className="text-muted-foreground">Email</p>
              <p className="font-medium">{application.email}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Phone</p>
              <p className="font-medium">{application.phone}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <p className="text-muted-foreground">Annual Income</p>
              <p className="font-medium">${application.income.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Submitted</p>
              <p className="font-medium">{formatDistanceToNow(new Date(application.submissionDate), { addSuffix: true })}</p>
            </div>
          </div>
          
          <div className="text-sm">
            <p className="text-muted-foreground">Documents</p>
            <div className="flex gap-1 mt-1">
              {application.documents.map((doc, index) => (
                <span 
                  key={index}
                  className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary"
                >
                  {doc}
                </span>
              ))}
            </div>
          </div>
          
          {application.notes && (
            <div className="text-sm">
              <p className="text-muted-foreground">Notes</p>
              <p className="italic">{application.notes}</p>
            </div>
          )}
          
          {application.status === "pending" && (
            <div className="flex space-x-2 pt-2">
              <Button size="sm" className="flex-1" onClick={handleApprove}>
                <Check className="h-4 w-4 mr-1" /> Approve
              </Button>
              <Button size="sm" variant="destructive" className="flex-1" onClick={handleReject}>
                <X className="h-4 w-4 mr-1" /> Reject
              </Button>
            </div>
          )}
          
          <Button 
            size="sm" 
            variant="outline" 
            className="w-full" 
            onClick={() => onViewDocuments(application.id)}
          >
            <FileText className="h-4 w-4 mr-1" /> View Documents
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

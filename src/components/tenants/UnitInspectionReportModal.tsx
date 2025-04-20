
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FileText, Download } from "lucide-react";

interface UnitInspectionReportModalProps {
  open: boolean;
  onClose: () => void;
  inspection: {
    id: number;
    date: string;
    type: string;
    status: string;
    findings?: string;
  };
}

export function UnitInspectionReportModal({ open, onClose, inspection }: UnitInspectionReportModalProps) {
  return (
    <Dialog open={open} onOpenChange={open => !open && onClose()}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Inspection Report Details
          </DialogTitle>
        </DialogHeader>
        
        <ScrollArea className="h-[400px]">
          <div className="space-y-6 p-4">
            <div className="grid grid-cols-2 gap-4 p-4 bg-muted rounded-lg">
              <div>
                <p className="text-sm text-muted-foreground">Date</p>
                <p className="font-medium">{inspection.date}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Type</p>
                <p className="font-medium">{inspection.type}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Status</p>
                <p className="font-medium">{inspection.status}</p>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-medium">Findings & Notes</h3>
              <p className="text-sm leading-relaxed bg-muted p-4 rounded-lg">
                {inspection.findings || "No issues found during inspection."}
              </p>
            </div>

            <div className="flex justify-end">
              <Button>
                <Download className="h-4 w-4 mr-2" />
                Download Report
              </Button>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}

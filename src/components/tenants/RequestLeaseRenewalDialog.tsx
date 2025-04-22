
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useRef } from "react";
import { Printer, FileText } from "lucide-react";

type Props = {
  open: boolean;
  onClose: () => void;
  rentalDetails: {
    property: string;
    leaseStart: string;
    leaseEnd: string;
    monthlyRent: number;
    unit: string;
    address: string;
  };
};

export function RequestLeaseRenewalDialog({ open, onClose, rentalDetails }: Props) {
  const printSection = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    if (printSection.current) {
      const printContents = printSection.current.innerHTML;
      const originalContents = document.body.innerHTML;
      document.body.innerHTML = printContents;
      window.print();
      document.body.innerHTML = originalContents;
      window.location.reload();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2"><FileText className="h-5 w-5" />Request Lease Renewal</DialogTitle>
        </DialogHeader>
        <div>
          <p className="mb-2">You're about to request a renewal for:</p>
          <div className="p-3 rounded-lg bg-muted/50 border mb-3 space-y-1">
            <div><span className="font-medium">Property:</span> {rentalDetails.property}</div>
            <div><span className="font-medium">Unit:</span> {rentalDetails.unit}</div>
            <div><span className="font-medium">Address:</span> {rentalDetails.address}</div>
            <div><span className="font-medium">Lease ends:</span> {rentalDetails.leaseEnd}</div>
            <div><span className="font-medium">Current Rent:</span> ${rentalDetails.monthlyRent}</div>
          </div>
          <p className="text-muted-foreground text-sm">
            Your property manager will be notified of your interest in renewing this lease. You may discuss new terms before finalizing.
          </p>
        </div>
        <DialogFooter>
          <Button variant="default" onClick={handlePrint}>
            <Printer className="h-4 w-4 mr-1" />
            Print Confirmation
          </Button>
          <Button variant="secondary" onClick={onClose}>Done</Button>
        </DialogFooter>
        {/* Hidden print area */}
        <div style={{display:"none"}}>
          <div ref={printSection}>
            <h2>Lease Renewal Request</h2>
            <p>Property: {rentalDetails.property}</p>
            <p>Unit: {rentalDetails.unit}</p>
            <p>Address: {rentalDetails.address}</p>
            <p>Lease End Date: {rentalDetails.leaseEnd}</p>
            <p>Monthly Rent: ${rentalDetails.monthlyRent}</p>
            <p>Date Requested: {new Date().toLocaleString()}</p>
            <p>Status: Confirmation submitted to landlord. Subject to approval.</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

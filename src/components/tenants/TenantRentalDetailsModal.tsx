
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface Props {
  open: boolean;
  onClose: () => void;
}

export function TenantRentalDetailsModal({ open, onClose }: Props) {
  // Stub data (should be fetched for real in a dynamic version)
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>My Rental Details</DialogTitle>
        </DialogHeader>
        <div className="space-y-2">
          <div><strong>Property:</strong> Modern Downtown Apartment</div>
          <div><strong>Address:</strong> Roysambu Main Home APP, Nairobi County</div>
          <div><strong>Lease End:</strong> April 30, 2026</div>
          <div><strong>Bedrooms:</strong> 2</div>
          <div><strong>Bathrooms:</strong> 2</div>
          <div><strong>Size:</strong> 1,200 sq ft</div>
        </div>
        <DialogFooter>
          <Button onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

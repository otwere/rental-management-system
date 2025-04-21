import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useRef, useState } from "react";
import { Printer, FileText, ChevronDown, ChevronUp, Download, X } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { saveAs } from 'file-saver';
import { useToast } from "@/components/ui/use-toast";

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
    tenantName?: string;
    landlordName?: string;
  };
};

type TerminationReason = 'relocation' | 'financial' | 'purchase' | 'other';

export function RequestEarlyTerminationDialog({ open, onClose, rentalDetails }: Props) {
  const printSection = useRef<HTMLDivElement>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [reason, setReason] = useState<TerminationReason | ''>('');
  const [customReason, setCustomReason] = useState('');
  const [additionalNotes, setAdditionalNotes] = useState('');
  const [moveOutDate, setMoveOutDate] = useState('');
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const terminationReasons: { id: TerminationReason; label: string }[] = [
    { id: 'relocation', label: 'Relocation for job/personal reasons' },
    { id: 'financial', label: 'Financial hardship' },
    { id: 'purchase', label: 'Purchasing a home' },
    { id: 'other', label: 'Other (please specify)' },
  ];

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

  const handleDownload = () => {
    if (printSection.current) {
      const content = printSection.current.innerText;
      const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
      saveAs(blob, `early-termination-request-${rentalDetails.unit}.txt`);
    }
  };

  const handleSubmit = () => {
    if (!agreeToTerms) {
      toast({
        title: "Agreement Required",
        description: "You must agree to the terms before submitting.",
        variant: "destructive",
      });
      return;
    }

    if (reason === 'other' && !customReason.trim()) {
      toast({
        title: "Reason Required",
        description: "Please specify your reason for termination.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      toast({
        title: "Request Submitted",
        description: "Your early termination request has been sent to the property manager.",
      });
      onClose();
    }, 1500);
  };

  const calculateDaysRemaining = () => {
    const endDate = new Date(rentalDetails.leaseEnd);
    const today = new Date();
    const diffTime = endDate.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const calculateEarlyTerminationFee = () => {
    const daysRemaining = calculateDaysRemaining();
    // Example fee calculation - 2 months rent or 25% of remaining rent, whichever is lower
    const twoMonthsRent = rentalDetails.monthlyRent * 2;
    const remainingRentPercentage = (rentalDetails.monthlyRent * (daysRemaining / 30)) * 0.25;
    return Math.min(twoMonthsRent, remainingRentPercentage).toFixed(2);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl overflow-y-auto" style={{ maxHeight: '80vh' }}>
        <DialogHeader>
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              <DialogTitle>Request Early Termination</DialogTitle>
            </div>
            <button onClick={onClose} className="rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none">
              <X className="h-5 w-5" />
            </button>
          </div>
          <DialogDescription>
            Complete this form to request early termination of your lease agreement.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="p-4 rounded-lg bg-muted/50 border space-y-2">
            <h4 className="font-medium">Lease Details</h4>
            <div className="grid grid-cols-2 gap-2">
              <div><span className="font-medium">Property:</span> {rentalDetails.property}</div>
              <div><span className="font-medium">Unit:</span> {rentalDetails.unit}</div>
              <div><span className="font-medium">Address:</span> {rentalDetails.address}</div>
              <div><span className="font-medium">Tenant:</span> {rentalDetails.tenantName || 'Not specified'}</div>
              <div><span className="font-medium">Lease Start:</span> {rentalDetails.leaseStart}</div>
              <div><span className="font-medium">Lease End:</span> {rentalDetails.leaseEnd}</div>
              <div><span className="font-medium">Monthly Rent:</span> ${rentalDetails.monthlyRent.toFixed(2)}</div>
              <div><span className="font-medium">Days Remaining:</span> {calculateDaysRemaining()}</div>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-medium">Termination Details</h4>
            
            <div className="space-y-3">
              <div>
                <Label htmlFor="reason">Reason for Early Termination *</Label>
                <div className="grid grid-cols-2 gap-3 mt-2">
                  {terminationReasons.map((option) => (
                    <div key={option.id} className="flex items-center space-x-2 mt-3">
                      <Checkbox
                        id={option.id}
                        checked={reason === option.id}
                        onCheckedChange={() => setReason(option.id)}
                      />
                      <label htmlFor={option.id} className="text-sm font-medium leading-none">
                        {option.label}
                      </label>
                    </div>
                  ))}
                </div>
                {reason === 'other' && (
                  <Input
                    className="mt-2"
                    placeholder="Please specify your reason"
                    value={customReason}
                    onChange={(e) => setCustomReason(e.target.value)}
                  />
                )}
              </div>

              <div>
                <Label htmlFor="moveOutDate">Proposed Move-out Date *</Label>
                <Input
                  type="date"
                  id="moveOutDate"
                  className="mt-4"
                  value={moveOutDate}
                  onChange={(e) => setMoveOutDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>

              <div>
                <Label htmlFor="notes">Additional Notes</Label>
                <Textarea
                  id="notes"
                  className="mt-1"
                  placeholder="Any additional information that might help your request..."
                  value={additionalNotes}
                  onChange={(e) => setAdditionalNotes(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="border rounded-lg overflow-hidden">
            <button
              className="w-full p-3 flex justify-between items-center bg-muted/50 hover:bg-muted"
              onClick={() => setShowDetails(!showDetails)}
            >
              <span className="font-medium">Early Termination Terms & Conditions</span>
              {showDetails ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </button>
            {showDetails && (
              <div className="p-4 space-y-3 text-sm">
                <p>
                  By requesting early termination, you acknowledge that this may result in additional fees as outlined in your lease agreement. 
                  The estimated early termination fee for your lease is <strong>${calculateEarlyTerminationFee()}</strong>.
                </p>
                <p>
                  Your request will be reviewed by the property management team and you will receive a response within 5-7 business days. 
                  The approval of early termination is at the discretion of the property owner/manager.
                </p>
                <p>
                  If approved, you will be responsible for all rent payments up to the approved termination date, any applicable fees, 
                  and leaving the unit in good condition as outlined in your lease agreement.
                </p>
                <div className="flex items-center space-x-2 pt-2">
                  <Checkbox
                    id="agreeTerms"
                    checked={agreeToTerms}
                    onCheckedChange={() => setAgreeToTerms(!agreeToTerms)}
                  />
                  <label htmlFor="agreeTerms" className="text-sm font-medium leading-none">
                    I understand and agree to these terms *
                  </label>
                </div>
              </div>
            )}
          </div>

          <p className="text-muted-foreground text-sm">
            Your property manager will be notified about your intention to end the lease early. 
            This may incur additional fees as per your agreement.
          </p>
        </div>

        <DialogFooter className="flex flex-col sm:flex-row sm:justify-between gap-2">
          <div className="flex gap-2">
            <Button variant="outline" onClick={handlePrint} disabled={isSubmitting}>
              <Printer className="h-4 w-4 mr-1" />
              Print
            </Button>
            <Button variant="outline" onClick={handleDownload} disabled={isSubmitting}>
              <Download className="h-4 w-4 mr-1" />
              Download
            </Button>
          </div>
          <div className="flex gap-2">
            <Button variant="secondary" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button 
              variant="default" 
              onClick={handleSubmit}
              disabled={isSubmitting || !agreeToTerms || !reason || !moveOutDate}
            >
              {isSubmitting ? "Submitting..." : "Submit Request"}
            </Button>
          </div>
        </DialogFooter>

        {/* Hidden print/download area */}
        <div style={{ display: "none" }}>
          <div ref={printSection} className="p-6 space-y-4">
            <h2 className="text-2xl font-bold border-b pb-2">Early Termination Request</h2>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="font-medium text-gray-700">Tenant Information</h3>
                <p>Name: {rentalDetails.tenantName || 'Not specified'}</p>
                <p>Date Requested: {new Date().toLocaleDateString()}</p>
              </div>
              
              <div>
                <h3 className="font-medium text-gray-700">Property Information</h3>
                <p>Property: {rentalDetails.property}</p>
                <p>Unit: {rentalDetails.unit}</p>
                <p>Address: {rentalDetails.address}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="font-medium text-gray-700">Lease Details</h3>
                <p>Lease Start Date: {rentalDetails.leaseStart}</p>
                <p>Lease End Date: {rentalDetails.leaseEnd}</p>
                <p>Monthly Rent: ${rentalDetails.monthlyRent.toFixed(2)}</p>
                <p>Days Remaining: {calculateDaysRemaining()}</p>
              </div>
              
              <div>
                <h3 className="font-medium text-gray-700">Termination Details</h3>
                <p>Reason: {reason === 'other' ? customReason : terminationReasons.find(r => r.id === reason)?.label}</p>
                <p>Proposed Move-out Date: {moveOutDate || 'Not specified'}</p>
                <p>Estimated Fee: ${calculateEarlyTerminationFee()}</p>
              </div>
            </div>

            {additionalNotes && (
              <div>
                <h3 className="font-medium text-gray-700">Additional Notes</h3>
                <p>{additionalNotes}</p>
              </div>
            )}

            <div className="mt-4 pt-4 border-t">
              <h3 className="font-medium text-gray-700">Status</h3>
              <p>Confirmation submitted to landlord. Subject to approval and possible fees.</p>
              <p className="mt-2 text-sm text-gray-500">
                This document serves as a record of your early termination request. 
                Please wait for official confirmation from your property manager.
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
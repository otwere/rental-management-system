import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useRef, useState } from "react";
import { Printer, FileText, ChevronDown, ChevronUp, Download, X, Calendar } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComp } from "@/components/ui/calendar";
import { format } from "date-fns";
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

export function RequestLeaseRenewalDialog({ open, onClose, rentalDetails }: Props) {
  const printSection = useRef<HTMLDivElement>(null);
  const [showTerms, setShowTerms] = useState(false);
  const [newTerm, setNewTerm] = useState<'6months' | '12months' | 'custom'>('12months');
  const [customEndDate, setCustomEndDate] = useState<Date>();
  const [rentAdjustment, setRentAdjustment] = useState('');
  const [additionalRequests, setAdditionalRequests] = useState('');
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

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
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `lease-renewal-request-${rentalDetails.unit}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  const calculateNewEndDate = () => {
    if (newTerm === '6months') {
      const endDate = new Date(rentalDetails.leaseEnd);
      endDate.setMonth(endDate.getMonth() + 6);
      return format(endDate, 'MMMM d, yyyy');
    } else if (newTerm === '12months') {
      const endDate = new Date(rentalDetails.leaseEnd);
      endDate.setMonth(endDate.getMonth() + 12);
      return format(endDate, 'MMMM d, yyyy');
    } else if (customEndDate) {
      return format(customEndDate, 'MMMM d, yyyy');
    }
    return 'Not specified';
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

    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      toast({
        title: "Request Submitted",
        description: "Your lease renewal request has been sent to the property manager.",
      });
      onClose();
    }, 1500);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] flex flex-col">
        <DialogHeader className="shrink-0">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              <DialogTitle>Request Lease Renewal</DialogTitle>
            </div>
            <button 
              onClick={onClose} 
              className="rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <DialogDescription>
            Complete this form to request renewal of your lease agreement.
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="flex-1 px-1 overflow-y-auto" style={{ maxHeight: '400px' }}>
          <div className="space-y-4 pr-3">
            <div className="p-4 rounded-lg bg-muted/50 border space-y-2">
              <h4 className="font-medium">Current Lease Details</h4>
              <div className="grid grid-cols-2 gap-2">
                <div><span className="font-medium">Property:</span> {rentalDetails.property}</div>
                <div><span className="font-medium">Unit:</span> {rentalDetails.unit}</div>
                <div><span className="font-medium">Address:</span> {rentalDetails.address}</div>
                <div><span className="font-medium">Tenant:</span> {rentalDetails.tenantName || 'Not specified'}</div>
                <div><span className="font-medium">Current Lease End:</span> {rentalDetails.leaseEnd}</div>
                <div><span className="font-medium">Monthly Rent:</span> ${rentalDetails.monthlyRent.toFixed(2)}</div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-medium">Renewal Terms</h4>
              
              <div className="space-y-3">
                <div>
                  <Label>Renewal Term *</Label>
                  <div className="grid grid-cols-3 gap-3 mt-2">
                    <Button
                      variant={newTerm === '6months' ? 'default' : 'outline'}
                      onClick={() => setNewTerm('6months')}
                    >
                      6 Months
                    </Button>
                    <Button
                      variant={newTerm === '12months' ? 'default' : 'outline'}
                      onClick={() => setNewTerm('12months')}
                    >
                      12 Months
                    </Button>
                    <Button
                      variant={newTerm === 'custom' ? 'default' : 'outline'}
                      onClick={() => setNewTerm('custom')}
                    >
                      Custom
                    </Button>
                  </div>
                  {newTerm === 'custom' && (
                    <div className="mt-3">
                      <Label>Custom End Date *</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-full mt-1 justify-start text-left font-normal"
                          >
                            <Calendar className="mr-2 h-4 w-4" />
                            {customEndDate ? format(customEndDate, 'PPP') : <span>Pick a date</span>}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <CalendarComp
                            mode="single"
                            selected={customEndDate}
                            onSelect={setCustomEndDate}
                            initialFocus
                            fromDate={new Date(rentalDetails.leaseEnd)}
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  )}
                  <div className="mt-2">
                    <p className="text-sm">
                      <span className="font-medium">Proposed New End Date:</span> {calculateNewEndDate()}
                    </p>
                  </div>
                </div>

                <div>
                  <Label htmlFor="rentAdjustment">Rent Adjustment Request (Optional)</Label>
                  <Input
                    id="rentAdjustment"
                    className="mt-1"
                    placeholder="Enter new amount or leave blank to keep current"
                    value={rentAdjustment}
                    onChange={(e) => setRentAdjustment(e.target.value)}
                    type="number"
                  />
                </div>

                <div>
                  <Label htmlFor="requests">Additional Requests (Optional)</Label>
                  <Textarea
                    id="requests"
                    className="mt-1"
                    placeholder="Any special requests or terms for the renewal..."
                    value={additionalRequests}
                    onChange={(e) => setAdditionalRequests(e.target.value)}
                    rows={3}
                  />
                </div>
              </div>
            </div>

            <div className="border rounded-lg overflow-hidden">
              <button
                className="w-full p-3 flex justify-between items-center bg-muted/50 hover:bg-muted"
                onClick={() => setShowTerms(!showTerms)}
                aria-expanded={showTerms}
              >
                <span className="font-medium">Renewal Terms & Conditions</span>
                {showTerms ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </button>
              {showTerms && (
                <div className="p-4 space-y-3 text-sm">
                  <p>
                    By requesting lease renewal, you acknowledge that this is a request only and not a binding agreement.
                    The property manager may propose different terms or decline the renewal.
                  </p>
                  <p>
                    Your request will be reviewed by the property management team and you will receive a response within 5-7 business days.
                  </p>
                  <p>
                    If approved, you will receive a new lease agreement to review and sign. The current lease terms remain
                    in effect until a new agreement is signed by all parties.
                  </p>
                  <div className="flex items-center space-x-2 pt-2">
                    <Checkbox
                      id="agreeRenewalTerms"
                      checked={agreeToTerms}
                      onCheckedChange={() => setAgreeToTerms(!agreeToTerms)}
                    />
                    <label htmlFor="agreeRenewalTerms" className="text-sm font-medium leading-none">
                      I understand and agree to these terms *
                    </label>
                  </div>
                </div>
              )}
            </div>

            <p className="text-muted-foreground text-sm">
              Your property manager will be notified of your interest in renewing this lease.
              You may discuss new terms before finalizing.
            </p>
          </div>
        </ScrollArea>

        <DialogFooter className="shrink-0 flex flex-col sm:flex-row sm:justify-between gap-2 pt-4">
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
              disabled={isSubmitting || !agreeToTerms || (newTerm === 'custom' && !customEndDate)}
            >
              {isSubmitting ? "Submitting..." : "Submit Request"}
            </Button>
          </div>
        </DialogFooter>

        {/* Hidden print/download area */}
        <div style={{ display: "none" }}>
          <div ref={printSection} className="p-6 space-y-4">
            <h2 className="text-2xl font-bold border-b pb-2">Lease Renewal Request</h2>
            
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
                <h3 className="font-medium text-gray-700">Current Lease Details</h3>
                <p>Current Lease End: {rentalDetails.leaseEnd}</p>
                <p>Monthly Rent: ${rentalDetails.monthlyRent.toFixed(2)}</p>
              </div>
              
              <div>
                <h3 className="font-medium text-gray-700">Renewal Request</h3>
                <p>Requested Term: {newTerm === 'custom' ? 'Custom' : `${newTerm.replace('months', ' Months')}`}</p>
                <p>Proposed End Date: {calculateNewEndDate()}</p>
                {rentAdjustment && <p>Requested Rent Adjustment: ${rentAdjustment}</p>}
              </div>
            </div>

            {additionalRequests && (
              <div>
                <h3 className="font-medium text-gray-700">Additional Requests</h3>
                <p>{additionalRequests}</p>
              </div>
            )}

            <div className="mt-4 pt-4 border-t">
              <h3 className="font-medium text-gray-700">Status</h3>
              <p>Confirmation submitted to landlord. Subject to approval.</p>
              <p className="mt-2 text-sm text-gray-500">
                This document serves as a record of your lease renewal request.
                Please wait for official confirmation from your property manager.
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
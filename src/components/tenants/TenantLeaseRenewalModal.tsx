"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"

interface TenantLeaseRenewalModalProps {
  open: boolean
  onClose: () => void
  onSubmit: () => void
}

export function TenantLeaseRenewalModal({ open, onClose, onSubmit }: TenantLeaseRenewalModalProps) {
  const [step, setStep] = useState(1)
  const [renewalType, setRenewalType] = useState<string>("standard")
  const [preferredDate, setPreferredDate] = useState<Date>()
  const [reason, setReason] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async () => {
    setIsSubmitting(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setIsSubmitting(false)
    onSubmit()
    // Reset form
    setStep(1)
    setRenewalType("standard")
    setPreferredDate(undefined)
    setReason("")
  }

  const handleClose = () => {
    setStep(1)
    setRenewalType("standard")
    setPreferredDate(undefined)
    setReason("")
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="lg:max-w-5xl sm:max-w-[500px]">
        {step === 1 && (
          <>
            <DialogHeader>
              <DialogTitle>Request Early Lease Renewal</DialogTitle>
              <DialogDescription>
                Submit a request to renew your lease before the standard renewal window.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="renewal-type">Renewal Type</Label>
                <RadioGroup value={renewalType} onValueChange={setRenewalType} className="grid grid-cols-1 gap-4 pt-2">
                  <div className="flex items-start space-x-3 space-y-0">
                    <RadioGroupItem value="standard" id="standard" />
                    <div className="grid gap-1.5">
                      <Label htmlFor="standard" className="font-medium">
                        Standard Renewal (12 months)
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Renew your lease for another 12 months at the current market rate.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3 space-y-0">
                    <RadioGroupItem value="extended" id="extended" />
                    <div className="grid gap-1.5">
                      <Label htmlFor="extended" className="font-medium">
                        Extended Renewal (24 months)
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Lock in your rate for 24 months with a 5% premium on the current rate.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3 space-y-0">
                    <RadioGroupItem value="short" id="short" />
                    <div className="grid gap-1.5">
                      <Label htmlFor="short" className="font-medium">
                        Short-term Renewal (6 months)
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Renew for 6 months with a 10% premium on the current rate.
                      </p>
                    </div>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-2">
                <Label htmlFor="preferred-date">Preferred Start Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !preferredDate && "text-muted-foreground",
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {preferredDate ? format(preferredDate, "PPP") : "Select a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={preferredDate}
                      onSelect={setPreferredDate}
                      initialFocus
                      disabled={(date) =>
                        date < new Date() || date > new Date(new Date().setMonth(new Date().getMonth() + 6))
                      }
                    />
                  </PopoverContent>
                </Popover>
                <p className="text-xs text-muted-foreground">Select a date within the next 6 months.</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="reason">Reason for Early Renewal (Optional)</Label>
                <Textarea
                  id="reason"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Please provide any additional information about your renewal request..."
                  className="min-h-[100px]"
                />
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button onClick={() => setStep(2)} disabled={!renewalType || !preferredDate}>
                Next
              </Button>
            </DialogFooter>
          </>
        )}

        {step === 2 && (
          <>
            <DialogHeader>
              <DialogTitle>Review and Confirm</DialogTitle>
              <DialogDescription>Please review your renewal request details before submitting.</DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="rounded-lg border p-4 space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <p className="text-sm font-medium">Renewal Type</p>
                    <p className="text-sm">
                      {renewalType === "standard"
                        ? "Standard (12 months)"
                        : renewalType === "extended"
                          ? "Extended (24 months)"
                          : "Short-term (6 months)"}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm font-medium">Preferred Start Date</p>
                    <p className="text-sm">{preferredDate ? format(preferredDate, "PPP") : "Not specified"}</p>
                  </div>
                </div>

                {reason && (
                  <div>
                    <p className="text-sm font-medium">Additional Information</p>
                    <p className="text-sm">{reason}</p>
                  </div>
                )}

                <div className="pt-2">
                  <p className="text-sm font-medium">Estimated New Rate</p>
                  <p className="text-sm">
                    {renewalType === "standard"
                      ? "KES 2,500/month"
                      : renewalType === "extended"
                        ? "KES 2,625/month (5% premium)"
                        : "KES 2,750/month (10% premium)"}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">*Final rate subject to management approval</p>
                </div>
              </div>

              <div className="rounded-lg bg-muted p-4">
                <p className="text-sm">
                  By submitting this request, you are expressing interest in renewing your lease. This is not a binding
                  agreement. Management will review your request and respond within 5 business days.
                </p>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setStep(1)}>
                Back
              </Button>
              <Button onClick={handleSubmit} disabled={isSubmitting}>
                {isSubmitting ? "Submitting..." : "Submit Request"}
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}

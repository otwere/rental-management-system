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
import { Checkbox } from "@/components/ui/checkbox"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { format, addDays } from "date-fns"
import { CalendarIcon, AlertTriangle } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface TenantLeaseTerminationModalProps {
  open: boolean
  onClose: () => void
  onSubmit: () => void
}

export function TenantLeaseTerminationModal({ open, onClose, onSubmit }: TenantLeaseTerminationModalProps) {
  const [step, setStep] = useState(1)
  const [moveOutDate, setMoveOutDate] = useState<Date>()
  const [reason, setReason] = useState("")
  const [reasonCategory, setReasonCategory] = useState("")
  const [acknowledgements, setAcknowledgements] = useState({
    notice: false,
    fees: false,
    inspection: false,
    keys: false,
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const today = new Date()
  const minDate = addDays(today, 60) // 60-day notice required

  const handleSubmit = async () => {
    setIsSubmitting(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setIsSubmitting(false)
    onSubmit()
    // Reset form
    setStep(1)
    setMoveOutDate(undefined)
    setReason("")
    setReasonCategory("")
    setAcknowledgements({
      notice: false,
      fees: false,
      inspection: false,
      keys: false,
    })
  }

  const handleClose = () => {
    setStep(1)
    setMoveOutDate(undefined)
    setReason("")
    setReasonCategory("")
    setAcknowledgements({
      notice: false,
      fees: false,
      inspection: false,
      keys: false,
    })
    onClose()
  }

  const allAcknowledged = Object.values(acknowledgements).every((value) => value === true)

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="lg:max-w-5xl sm:max-w-[600px]">
        {step === 1 && (
          <>
            <DialogHeader>
              <DialogTitle>Request Lease Termination</DialogTitle>
              <DialogDescription>
                Submit a request to terminate your lease. A 60-day notice is required.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="rounded-lg bg-amber-50 border border-amber-200 p-4 flex items-start space-x-3">
                <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5" />
                <div>
                  <h4 className="text-sm font-medium text-amber-800">Important Notice</h4>
                  <p className="text-sm text-amber-700 mt-1">
                    Early termination requires a 60-day notice and includes fees equivalent to 2 months' rent plus
                    forfeiture of security deposit.
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="move-out-date">Requested Move-Out Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !moveOutDate && "text-muted-foreground",
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {moveOutDate ? format(moveOutDate, "PPP") : "Select a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={moveOutDate}
                      onSelect={setMoveOutDate}
                      initialFocus
                      disabled={(date) => date < minDate}
                    />
                  </PopoverContent>
                </Popover>
                <p className="text-xs text-muted-foreground">
                  Must be at least 60 days from today ({format(minDate, "PPP")}).
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="reason-category">Reason Category</Label>
                <Select value={reasonCategory} onValueChange={setReasonCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a reason" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="relocation">Relocation</SelectItem>
                    <SelectItem value="purchase">Purchasing a home</SelectItem>
                    <SelectItem value="financial">Financial reasons</SelectItem>
                    <SelectItem value="dissatisfaction">Dissatisfaction with property</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="reason">Additional Details</Label>
                <Textarea
                  id="reason"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Please provide any additional information about your termination request..."
                  className="min-h-[100px]"
                />
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button onClick={() => setStep(2)} disabled={!moveOutDate || !reasonCategory}>
                Next
              </Button>
            </DialogFooter>
          </>
        )}

        {step === 2 && (
          <>
            <DialogHeader>
              <DialogTitle>Termination Acknowledgements</DialogTitle>
              <DialogDescription>Please review and acknowledge the following terms.</DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="space-y-4">
                <div className="flex items-start space-x-2">
                  <Checkbox
                    id="notice"
                    checked={acknowledgements.notice}
                    onCheckedChange={(checked) =>
                      setAcknowledgements((prev) => ({ ...prev, notice: checked === true }))
                    }
                  />
                  <div className="grid gap-1.5">
                    <Label htmlFor="notice" className="text-sm font-medium">
                      Notice Period
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      I understand that I am required to provide a 60-day notice before vacating the property.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-2">
                  <Checkbox
                    id="fees"
                    checked={acknowledgements.fees}
                    onCheckedChange={(checked) => setAcknowledgements((prev) => ({ ...prev, fees: checked === true }))}
                  />
                  <div className="grid gap-1.5">
                    <Label htmlFor="fees" className="text-sm font-medium">
                      Early Termination Fees
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      I understand that early termination will result in fees equivalent to 2 months' rent (KES 5,000)
                      plus forfeiture of my security deposit (KES 2,500).
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-2">
                  <Checkbox
                    id="inspection"
                    checked={acknowledgements.inspection}
                    onCheckedChange={(checked) =>
                      setAcknowledgements((prev) => ({ ...prev, inspection: checked === true }))
                    }
                  />
                  <div className="grid gap-1.5">
                    <Label htmlFor="inspection" className="text-sm font-medium">
                      Move-Out Inspection
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      I understand that a move-out inspection will be conducted and I am responsible for returning the
                      property in the condition it was provided, minus normal wear and tear.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-2">
                  <Checkbox
                    id="keys"
                    checked={acknowledgements.keys}
                    onCheckedChange={(checked) => setAcknowledgements((prev) => ({ ...prev, keys: checked === true }))}
                  />
                  <div className="grid gap-1.5">
                    <Label htmlFor="keys" className="text-sm font-medium">
                      Keys and Access
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      I understand that all keys, access cards, and remote controls must be returned on or before the
                      move-out date or additional fees may apply.
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-lg bg-muted p-4">
                <p className="text-sm">
                  By submitting this request, you are formally requesting to terminate your lease. Management will
                  review your request and respond within 3 business days.
                </p>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setStep(1)}>
                Back
              </Button>
              <Button onClick={handleSubmit} disabled={!allAcknowledged || isSubmitting}>
                {isSubmitting ? "Submitting..." : "Submit Request"}
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}

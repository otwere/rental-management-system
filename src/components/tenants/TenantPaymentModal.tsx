"use client";
import type React from "react";
import { Dialog, DialogContent, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import {
  Banknote,
  CreditCard,
  Phone,
  ArrowRight,
  ArrowLeft,
  CircleCheck,
  AlertCircle,
  Building,
  Info,
  User,
  Calendar,
} from "lucide-react"
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { format } from "date-fns"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Alert, AlertDescription } from "@/components/ui/alert"

// Tenant information
const TENANT = {
  id: "tenant1",
  name: "Pauline Mercy",
  email: "john.doe@example.com",
  phone: "0712345678",
}

// My rental property (tenant can only pay for their assigned rental)
const MY_RENTAL = {
  id: "prop1",
  name: "Modern Downtown Apartment",
  address: "Roysambu Main Home APP, Nairobi County",
  unit: "Unit 205",
  rentAmount: 2500,
  tenant: TENANT,
}

// Current month (for demo purposes)
const CURRENT_MONTH_INDEX = 3 // April (0-indexed)
const CURRENT_MONTH = "April"

// Mock data for already paid months
const PAID_MONTHS = ["January", "February", "March"]

// Mock data for any excess amount from previous payments
const INITIAL_EXCESS_AMOUNT = 500

type PaymentMethod = "mpesa" | "bank"
type Step = "amount" | "method" | "stkpending" | "otp" | "processing" | "success"
type Month =
  | "January"
  | "February"
  | "March"
  | "April"
  | "May"
  | "June"
  | "July"
  | "August"
  | "September"
  | "October"
  | "November"
  | "December"

interface Props {
  open: boolean
  onClose: () => void
  onPaymentSuccess?: (paymentDetails: any) => void
}

export function TenantPaymentModal({ open, onClose, onPaymentSuccess }: Props) {
  const [step, setStep] = useState<Step>("amount")
  const [amount, setAmount] = useState(MY_RENTAL.rentAmount.toString())
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("mpesa")
  const [mpesaPhone, setMpesaPhone] = useState("")
  const [stkPushed, setStkPushed] = useState(false)
  const [otp, setOtp] = useState("")
  const [otpError, setOtpError] = useState("")
  const OTP_EXPECTED = "123456" // For simulation; in real, would come from backend.
  const [bankSlipNumber, setBankSlipNumber] = useState("")
  const [bankSlipFile, setBankSlipFile] = useState<File | null>(null)
  const [submitted, setSubmitted] = useState(false)
  const [transactionDetails, setTransactionDetails] = useState<any | null>(null)
  const [stkConfirmed, setStkConfirmed] = useState(false)
  const [stkError, setStkError] = useState<string | null>(null)
  const [excessAmount, setExcessAmount] = useState(INITIAL_EXCESS_AMOUNT)
  const [selectedMonth, setSelectedMonth] = useState<Month>(() => {
    // Find the first unpaid month
    const allMonths: Month[] = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ]
    const firstUnpaidMonth = allMonths.find((month) => !PAID_MONTHS.includes(month))
    return firstUnpaidMonth || "January"
  })

  // All months array for reference
  const allMonths: Month[] = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ]

  // Calculate the minimum amount that can be paid (rent amount minus any excess)
  const minPaymentAmount = Math.max(MY_RENTAL.rentAmount - excessAmount, 0)

  // Calculate any excess from the current payment
  const currentExcessAmount = Number(amount) > minPaymentAmount ? Number(amount) - minPaymentAmount : 0

  // Function to determine if a month is available for payment
  const isMonthAvailableForPayment = (month: Month) => {
    // If month is already paid, it's not available
    if (PAID_MONTHS.includes(month)) {
      return false
    }

    const monthIndex = allMonths.indexOf(month)
    const currentMonthIndex = allMonths.indexOf(CURRENT_MONTH)

    // If it's a future month, check if all previous months are paid
    if (monthIndex > currentMonthIndex) {
      // Check if all months before this one are paid
      for (let i = 0; i <= currentMonthIndex; i++) {
        if (!PAID_MONTHS.includes(allMonths[i])) {
          return false
        }
      }
    }

    return true
  }

  // Function to get the reason why a month is not available
  const getMonthUnavailableReason = (month: Month) => {
    if (PAID_MONTHS.includes(month)) {
      return "Already paid"
    }

    const monthIndex = allMonths.indexOf(month)
    const currentMonthIndex = allMonths.indexOf(CURRENT_MONTH)

    if (monthIndex > currentMonthIndex) {
      // Find the first unpaid month
      for (let i = 0; i <= currentMonthIndex; i++) {
        if (!PAID_MONTHS.includes(allMonths[i])) {
          return `Pay ${allMonths[i]} first`
        }
      }
    }

    return ""
  }

  function maskPhoneNumber(phone: string) {
    if (!phone || phone.length < 6) return phone
    return phone.slice(0, 3) + "XXXX" + phone.slice(7)
  }

  // Handle amount change with validation
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newAmount = e.target.value
    // Ensure amount is not less than the minimum required
    if (Number(newAmount) < minPaymentAmount && newAmount !== "") {
      setAmount(minPaymentAmount.toString())
    } else {
      setAmount(newAmount)
    }
  }

  // Simulate STK Push Initiation with Error Handling
  const initiateStkPush = async () => {
    try {
      // Simulate STK push initiation (e.g., API call to M-Pesa)
      const success = Math.random() > 0.2 // Simulate 80% success rate
      if (!success) {
        throw new Error("STK Push failed. Please try again.")
      }
      setStkPushed(true)
      setStkError(null) // Clear any previous errors
    } catch (error) {
      console.error("STK Push Error:", error)
      setStkError((error as Error).message || "An unexpected error occurred.")
    }
  }

  // Auto-proceed from STK push to OTP after delay
  useEffect(() => {
    let timer: NodeJS.Timeout
    if (step === "stkpending") {
      timer = setTimeout(() => {
        setStkConfirmed(true) // Confirm STK push
      }, 5000) // 5 seconds delay before confirming STK push

      const processingTimer = setTimeout(() => {
        setSubmitted(true)
        setStep("processing") // Proceed to processing step

        // Simulate fetching transaction
        simulateFetchTransaction().then((details) => {
          setTransactionDetails(details)
          setExcessAmount(details.newExcessAmount)
          setSubmitted(false)
          setStep("success")
        })
      }, 4000) // 4 seconds delay before proceeding to processing

      return () => {
        clearTimeout(timer)
        clearTimeout(processingTimer)
      }
    }
    return () => {}
  }, [step])

  const reset = () => {
    setStep("amount")
    setAmount(MY_RENTAL.rentAmount.toString())
    setPaymentMethod("mpesa")
    setMpesaPhone("")
    setStkPushed(false)
    setBankSlipNumber("")
    setBankSlipFile(null)
    setSubmitted(false)
    setTransactionDetails(null)
    setOtp("")
    setOtpError("")
    setStkConfirmed(false)
    setStkError(null)

    // Find the first unpaid month
    const firstUnpaidMonth = allMonths.find((month) => !PAID_MONTHS.includes(month))
    setSelectedMonth(firstUnpaidMonth || "January")
  }

  const simulateFetchTransaction = () =>
    new Promise((resolve) =>
      setTimeout(() => {
        const now = new Date()

        // Calculate new excess amount after this payment
        const newExcessAmount = currentExcessAmount

        resolve({
          id: Math.floor(Math.random() * 100000),
          type: paymentMethod === "mpesa" ? "Mpesa" : "Bank Deposit",
          amount,
          month: selectedMonth,
          phone: paymentMethod === "mpesa" ? mpesaPhone : undefined,
          maskedPhone: paymentMethod === "mpesa" ? maskPhoneNumber(mpesaPhone) : undefined,
          bankSlip: paymentMethod === "bank" ? bankSlipNumber : undefined,
          file: paymentMethod === "bank" ? bankSlipFile?.name : undefined,
          property: MY_RENTAL,
          tenant: TENANT,
          date: format(now, "yyyy-MM-dd"),
          time: format(now, "HH:mm:ss"),
          timestamp: now.toISOString(),
          ref: paymentMethod === "mpesa" ? "MP" + Math.floor(Math.random() * 1000000) : bankSlipNumber,
          status: "paid",
          method: paymentMethod,
          appliedExcess: excessAmount > 0 ? excessAmount : 0,
          newExcessAmount: newExcessAmount,
          actualPaid: Number(amount),
          requiredAmount: MY_RENTAL.rentAmount,
        })
      }, 1400),
    )

  const handleAmountSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!amount || Number(amount) <= 0) return
    setStep("method")
  }

  const handleMpesaSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStep("otp") // Go directly to OTP step first
  }

  const handleOTPSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (otp !== OTP_EXPECTED) {
      setOtpError("Invalid OTP. Enter valid OTP.")
      return
    }
    setOtpError("")
    await initiateStkPush() // Initiate STK push after OTP verification
    if (stkPushed) {
      setStep("stkpending")
    }
  }

  const handleBankSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
    setStep("processing")
    const details = await simulateFetchTransaction()
    setTransactionDetails(details)

    // Update excess amount for next payment
    setExcessAmount(details.newExcessAmount)

    setSubmitted(false)
    setStep("success")
  }

  const handleBack = () => {
    if (step === "method") setStep("amount")
    else if (step === "otp") setStep("method")
    else if (step === "stkpending") setStep("otp")
  }

  const handleClose = () => {
    reset()
    onClose()
  }

  const formatCurrency = (value: string | number) => {
    return new Intl.NumberFormat("en-KE", {
      style: "currency",
      currency: "KES",
      minimumFractionDigits: 0,
    }).format(Number(value))
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="lg:max-w-5xl sm:max-w-[675px] p-0 overflow-hidden">
        {/* Header with progress indicator */}
        <div className="bg-slate-50 dark:bg-slate-900 p-6 border-b">
          <div className="flex items-center justify-between mb-2">
            <DialogTitle className="text-xl font-semibold">Payment Portal</DialogTitle>
            <Badge variant="outline" className="font-medium mt-4">
              {step === "amount" && "Step 1/4"}
              {step === "method" && "Step 2/4"}
              {step === "otp" && "Step 3/4"}
              {step === "stkpending" && "Step 4/4"}
              {step === "processing" && "Processing"}
              {step === "success" && "Complete"}
            </Badge>
          </div>

          {/* Tenant information */}
          <div className="flex items-center text-sm text-slate-500 dark:text-slate-400 mb-1">
            <User className="h-4 w-4 mr-1" />
            <span>Tenant : {MY_RENTAL.tenant.name}</span>
          </div>

          {/* Property information */}
          <div className="flex items-center text-sm text-slate-500 dark:text-slate-400">
            <Building className="h-4 w-4 mr-1" />
            <span>
              {MY_RENTAL.name} - {MY_RENTAL.unit}
            </span>
          </div>

          {/* Progress bar */}
          <div className="w-full h-1 bg-slate-200 dark:bg-slate-700 mt-4 rounded-full overflow-hidden">
            <div
              className="h-full bg-slate-600 dark:bg-slate-400 transition-all duration-300 ease-in-out"
              style={{
                width:
                  step === "amount"
                    ? "25%"
                    : step === "method"
                      ? "50%"
                      : step === "stkpending" || step === "otp"
                        ? "75%"
                        : "100%",
              }}
            />
          </div>
        </div>

        <div className="p-6">
          {/* Amount Input Step */}
          {step === "amount" && (
            <form onSubmit={handleAmountSubmit} className="space-y-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300">
                    Payment Amount
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-slate-500 dark:text-slate-400">KES</span>
                    </div>
                    <Input
                      type="number"
                      min={minPaymentAmount}
                      value={amount}
                      onChange={handleAmountChange}
                      placeholder="0.00"
                      className="pl-10"
                      required
                    />
                  </div>
                  <div className="flex items-center justify-between mt-4">
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Minimum amount : {formatCurrency(minPaymentAmount)}
                    </p>

                    {excessAmount > 0 && (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className="flex items-center text-xs text-green-600 dark:text-green-400">
                              <Info className="h-3 w-3 mr-1" />
                              Credit: {formatCurrency(excessAmount)}
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Credit from previous overpayment</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    )}
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                      Month Paying For
                    </label>
                    <div className="flex items-center text-xs text-slate-500 dark:text-slate-400">
                      <Calendar className="h-3 w-3 mr-1" />
                      Current month : {CURRENT_MONTH}
                    </div>
                  </div>

                  <Select value={selectedMonth} onValueChange={(value) => setSelectedMonth(value as Month)}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select month" />
                    </SelectTrigger>
                    <SelectContent>
                      {allMonths.map((month) => {
                        const isAvailable = isMonthAvailableForPayment(month)
                        const unavailableReason = !isAvailable ? getMonthUnavailableReason(month) : ""

                        return (
                          <SelectItem
                            key={month}
                            value={month}
                            disabled={!isAvailable}
                            className={!isAvailable ? "opacity-60" : ""}
                          >
                            <div className="flex items-center justify-between w-full">
                              <span>{month}</span>
                              {!isAvailable && (
                                <span className="text-xs text-slate-500 ml-2">({unavailableReason})</span>
                              )}
                            </div>
                          </SelectItem>
                        )
                      })}
                    </SelectContent>
                  </Select>

                  <Alert className="mt-2 py-2 bg-amber-50 dark:bg-amber-900/20 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800">
                    <AlertDescription className="text-xs flex items-start">
                      <Info className="h-3 w-3 mr-1 mt-0.5 flex-shrink-0" />
                      You must pay for the current month ({CURRENT_MONTH}) before you can pay for future months.
                    </AlertDescription>
                  </Alert>
                </div>

                <Card className="bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-center">
                      <div className="text-sm text-slate-600 dark:text-slate-400">Tenant</div>
                      <div className="font-medium">{MY_RENTAL.tenant.name}</div>
                    </div>
                    <Separator className="my-2" />
                    <div className="flex justify-between items-center">
                      <div className="text-sm text-slate-600 dark:text-slate-400">Payment for</div>
                      <div className="font-medium">{MY_RENTAL.name}</div>
                    </div>
                    <Separator className="my-2" />
                    <div className="flex justify-between items-center">
                      <div className="text-sm text-slate-600 dark:text-slate-400">Month</div>
                      <div className="font-medium">{selectedMonth}</div>
                    </div>
                    <Separator className="my-2" />
                    <div className="flex justify-between items-center">
                      <div className="text-sm text-slate-600 dark:text-slate-400">Required Amount</div>
                      <div className="font-medium">{formatCurrency(MY_RENTAL.rentAmount)}</div>
                    </div>
                    {excessAmount > 0 && (
                      <>
                        <Separator className="my-2" />
                        <div className="flex justify-between items-center">
                          <div className="text-sm text-green-600 dark:text-green-400">Applied Credit</div>
                          <div className="font-medium text-green-600 dark:text-green-400">
                            -{formatCurrency(excessAmount)}
                          </div>
                        </div>
                      </>
                    )}
                    <Separator className="my-2" />
                    <div className="flex justify-between items-center">
                      <div className="text-sm text-slate-600 dark:text-slate-400">Amount to Pay</div>
                      <div className="font-medium">{formatCurrency(amount)}</div>
                    </div>
                    {currentExcessAmount > 0 && (
                      <>
                        <Separator className="my-2" />
                        <div className="flex justify-between items-center">
                          <div className="text-sm text-blue-600 dark:text-blue-400">Excess Amount</div>
                          <div className="font-medium text-blue-600 dark:text-blue-400">
                            +{formatCurrency(currentExcessAmount)}
                            <span className="text-xs ml-1">(carried forward)</span>
                          </div>
                        </div>
                      </>
                    )}
                  </CardContent>
                </Card>
              </div>

              <DialogFooter className="flex justify-between sm:justify-between gap-2 pt-2">
                <Button variant="outline" onClick={handleClose} className="flex-1 sm:flex-none">
                  Cancel
                </Button>
                <Button type="submit" disabled={!amount || Number(amount) <= 0} className="flex-1 sm:flex-none">
                  Continue <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              </DialogFooter>
            </form>
          )}

          {/* Payment Method Selection Step */}
          {step === "method" && (
            <form onSubmit={paymentMethod === "mpesa" ? handleMpesaSubmit : handleBankSubmit} className="space-y-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300">
                    Select Payment Method
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div
                      className={cn(
                        "border rounded-lg p-4 cursor-pointer transition-all",
                        paymentMethod === "mpesa"
                          ? "border-slate-600 dark:border-slate-400 bg-slate-50 dark:bg-slate-900"
                          : "border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600",
                      )}
                      onClick={() => setPaymentMethod("mpesa")}
                    >
                      <div className="flex items-center">
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="mpesa"
                          checked={paymentMethod === "mpesa"}
                          onChange={() => setPaymentMethod("mpesa")}
                          className="sr-only"
                        />
                        <div
                          className={cn(
                            "w-5 h-5 rounded-full border flex items-center justify-center mr-3",
                            paymentMethod === "mpesa"
                              ? "border-slate-600 dark:border-slate-400"
                              : "border-slate-300 dark:border-slate-600",
                          )}
                        >
                          {paymentMethod === "mpesa" && (
                            <div className="w-3 h-3 rounded-full bg-slate-600 dark:bg-slate-400" />
                          )}
                        </div>
                        <div className="flex items-center">
                          <CreditCard className="h-5 w-5 text-slate-600 dark:text-slate-400 mr-2" />
                          <span className="font-medium">Mpesa</span>
                        </div>
                      </div>
                    </div>

                    <div
                      className={cn(
                        "border rounded-lg p-4 cursor-pointer transition-all",
                        paymentMethod === "bank"
                          ? "border-slate-600 dark:border-slate-400 bg-slate-50 dark:bg-slate-900"
                          : "border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600",
                      )}
                      onClick={() => setPaymentMethod("bank")}
                    >
                      <div className="flex items-center">
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="bank"
                          checked={paymentMethod === "bank"}
                          onChange={() => setPaymentMethod("bank")}
                          className="sr-only"
                        />
                        <div
                          className={cn(
                            "w-5 h-5 rounded-full border flex items-center justify-center mr-3",
                            paymentMethod === "bank"
                              ? "border-slate-600 dark:border-slate-400"
                              : "border-slate-300 dark:border-slate-600",
                          )}
                        >
                          {paymentMethod === "bank" && (
                            <div className="w-3 h-3 rounded-full bg-slate-600 dark:bg-slate-400" />
                          )}
                        </div>
                        <div className="flex items-center">
                          <Banknote className="h-5 w-5 text-slate-600 dark:text-slate-400 mr-2" />
                          <span className="font-medium">Bank Transfer</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {paymentMethod === "mpesa" && (
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                      Mpesa Phone Number
                    </label>
                    <Input
                      type="tel"
                      placeholder="07XXXXXXXX"
                      value={mpesaPhone}
                      onChange={(e) => setMpesaPhone(e.target.value)}
                      required
                      pattern="^0\d{9}$"
                      maxLength={10}
                      className="border-slate-300 dark:border-slate-700"
                    />
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Enter the phone number registered with Mpesa
                    </p>
                  </div>
                )}

                {paymentMethod === "bank" && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                        Bank Slip Number
                      </label>
                      <Input
                        type="text"
                        placeholder="Enter bank slip number"
                        value={bankSlipNumber}
                        onChange={(e) => setBankSlipNumber(e.target.value)}
                        required
                        className="border-slate-300 dark:border-slate-700"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                        Upload Scanned Bank Slip
                      </label>
                      <Input
                        type="file"
                        accept="image/*,.pdf"
                        onChange={(e) => setBankSlipFile(e.target.files?.[0] || null)}
                        required
                        className="border-slate-300 dark:border-slate-700"
                      />
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Accepted formats: JPG, PNG, PDF (Max 5MB)
                      </p>
                    </div>
                  </div>
                )}

                <Card className="bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-center">
                      <div className="text-sm text-slate-600 dark:text-slate-400">Tenant</div>
                      <div className="font-medium">{MY_RENTAL.tenant.name}</div>
                    </div>
                    <Separator className="my-2" />
                    <div className="flex justify-between items-center">
                      <div className="text-sm text-slate-600 dark:text-slate-400">Payment summary</div>
                      <div className="font-medium">{formatCurrency(amount)}</div>
                    </div>
                    <Separator className="my-2" />
                    <div className="flex justify-between items-center">
                      <div className="text-sm text-slate-600 dark:text-slate-400">Month</div>
                      <div className="font-medium">{selectedMonth}</div>
                    </div>
                    {currentExcessAmount > 0 && (
                      <>
                        <Separator className="my-2" />
                        <div className="flex justify-between items-center">
                          <div className="text-sm text-blue-600 dark:text-blue-400">Excess Amount</div>
                          <div className="font-medium text-blue-600 dark:text-blue-400">
                            {formatCurrency(currentExcessAmount)}
                          </div>
                        </div>
                      </>
                    )}
                  </CardContent>
                </Card>
              </div>

              <DialogFooter className="flex justify-between sm:justify-between gap-2 pt-2">
                <Button variant="outline" onClick={handleBack} className="flex-1 sm:flex-none">
                  <ArrowLeft className="h-4 w-4 mr-2" /> Back
                </Button>
                <Button
                  type="submit"
                  disabled={
                    submitted ||
                    (paymentMethod === "mpesa" && mpesaPhone.length !== 10) ||
                    (paymentMethod === "bank" && (!bankSlipNumber || !bankSlipFile))
                  }
                  className="flex-1 sm:flex-none"
                >
                  {paymentMethod === "mpesa" ? "Pay via Mpesa" : "Submit Bank Details"}
                </Button>
              </DialogFooter>
            </form>
          )}

          {/* OTP Verification Step */}
          {step === "otp" && (
            <form onSubmit={handleOTPSubmit} className="space-y-6">
              <div className="text-center space-y-2">
                <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 mb-2">
                  <Phone className="h-8 w-8 text-slate-600 dark:text-slate-400" />
                </div>
                <h3 className="text-lg font-semibold">Verify with OTP</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 max-w-xl mx-auto">
                  An OTP (One-Time Password) has been sent via SMS to{" "}
                  <span className="font-mono">{maskPhoneNumber(mpesaPhone)}</span>.
                  <br />
                  Please enter the 6-digit code to proceed with payment.
                </p>
              </div>

              <div className="flex items-center justify-center mt-6">
                <InputOTP maxLength={6} value={otp} onChange={setOtp}>
                  <InputOTPGroup>
                    {[...Array(6)].map((_, i) => (
                      <InputOTPSlot key={i} index={i} />
                    ))}
                  </InputOTPGroup>
                </InputOTP>
              </div>

              {otpError && (
                <div className="text-center">
                  <p className="text-sm text-red-600 dark:text-red-400">{otpError}</p>
                </div>
              )}

              <DialogFooter className="flex justify-between sm:justify-between gap-2 pt-2">
                <Button variant="outline" onClick={handleBack} className="flex-1 sm:flex-none">
                  <ArrowLeft className="h-4 w-4 mr-2" /> Back
                </Button>
                <Button type="submit" disabled={otp.length !== 6 || submitted} className="flex-1 sm:flex-none">
                  Verify & Proceed to Payment
                </Button>
              </DialogFooter>
            </form>
          )}

          {/* STK Push Confirmation Step */}
          {step === "stkpending" && (
            <div className="space-y-6">
              <div className="flex flex-col items-center py-8">
                {stkError ? (
                  <div className="text-center space-y-2">
                    <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-red-50 dark:bg-red-900/20 mb-2">
                      <AlertCircle className="h-8 w-8 text-red-500 dark:text-red-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-red-600 dark:text-red-400">STK Push Failed</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400 max-w-xs mx-auto">{stkError}</p>
                  </div>
                ) : stkConfirmed ? (
                  <div className="text-center space-y-2">
                    <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-green-50 dark:bg-green-900/20 mb-2">
                      <CircleCheck className="h-8 w-8 text-green-500 dark:text-green-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-green-600 dark:text-green-400">STK Push Confirmed</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Processing your payment...</p>
                  </div>
                ) : (
                  <div className="text-center space-y-2">
                    <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 mb-2">
                      <Phone className="h-8 w-8 text-slate-600 dark:text-slate-400" />
                    </div>
                    <h3 className="text-lg font-semibold">
                      STK Push sent to <span className="font-mono">{maskPhoneNumber(mpesaPhone)}</span>
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400 max-w-xs mx-auto">
                      Please enter your Mpesa PIN on your phone to complete the payment.
                    </p>
                  </div>
                )}
              </div>

              <DialogFooter className="flex justify-between sm:justify-between gap-2 pt-2">
                <Button variant="outline" onClick={handleBack} className="flex-1 sm:flex-none">
                  <ArrowLeft className="h-4 w-4 mr-2" /> Back
                </Button>
                {stkError && (
                  <Button onClick={initiateStkPush} disabled={submitted} className="flex-1 sm:flex-none">
                    Retry STK Push
                  </Button>
                )}
              </DialogFooter>
            </div>
          )}

          {/* Processing Payment Step */}
          {step === "processing" && (
            <div className="flex flex-col justify-center items-center py-12">
              <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 mb-4">
                <div className="h-8 w-8 rounded-full border-2 border-slate-600 dark:border-slate-400 border-t-transparent animate-spin" />
              </div>
              <h3 className="text-lg font-semibold">Processing Payment</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                Please wait while we process your transaction...
              </p>
            </div>
          )}

          {/* Success Step */}
          {step === "success" && transactionDetails && (
            <div className="space-y-6">
              <div className="text-center space-y-2">
                <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-green-50 dark:bg-green-900/20 mb-2">
                  <CircleCheck className="h-8 w-8 text-green-500 dark:text-green-400" />
                </div>
                <h3 className="text-xl font-semibold text-green-600 dark:text-green-400">Payment Successful</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Your payment has been processed successfully
                </p>
              </div>

              <Card className="border-slate-200 dark:border-slate-800">
                <CardContent className="p-0">
                  <div className="bg-slate-50 dark:bg-slate-900 p-4 border-b border-slate-200 dark:border-slate-800">
                    <h4 className="font-medium">Transaction Details</h4>
                  </div>

                  <div className="p-4 space-y-3">
                    <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                      <div className="text-slate-500 dark:text-slate-400">Transaction ID</div>
                      <div className="font-medium">{transactionDetails.id}</div>

                      <div className="text-slate-500 dark:text-slate-400">Tenant</div>
                      <div className="font-medium">{transactionDetails.tenant.name}</div>

                      <div className="text-slate-500 dark:text-slate-400">Type</div>
                      <div className="font-medium">{transactionDetails.type}</div>

                      <div className="text-slate-500 dark:text-slate-400">Required Amount</div>
                      <div className="font-medium">{formatCurrency(transactionDetails.requiredAmount)}</div>

                      {transactionDetails.appliedExcess > 0 && (
                        <>
                          <div className="text-slate-500 dark:text-slate-400">Applied Credit</div>
                          <div className="font-medium text-green-600 dark:text-green-400">
                            -{formatCurrency(transactionDetails.appliedExcess)}
                          </div>
                        </>
                      )}

                      <div className="text-slate-500 dark:text-slate-400">Amount Paid</div>
                      <div className="font-medium">{formatCurrency(transactionDetails.actualPaid)}</div>

                      {transactionDetails.newExcessAmount > 0 && (
                        <>
                          <div className="text-slate-500 dark:text-slate-400">Excess Amount</div>
                          <div className="font-medium text-blue-600 dark:text-blue-400">
                            {formatCurrency(transactionDetails.newExcessAmount)}
                            <span className="text-xs ml-1">(carried forward)</span>
                          </div>
                        </>
                      )}

                      <div className="text-slate-500 dark:text-slate-400">Month Paid For</div>
                      <div className="font-medium">{transactionDetails.month}</div>

                      <div className="text-slate-500 dark:text-slate-400">Date & Time</div>
                      <div className="font-medium">
                        {transactionDetails.date} at {transactionDetails.time}
                      </div>

                      {transactionDetails.property && (
                        <>
                          <div className="text-slate-500 dark:text-slate-400">Property</div>
                          <div className="font-medium">
                            {transactionDetails.property.name} - {transactionDetails.property.unit}
                            <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                              {transactionDetails.property.address}
                            </div>
                          </div>
                        </>
                      )}

                      {transactionDetails.phone && (
                        <>
                          <div className="text-slate-500 dark:text-slate-400">Phone Used</div>
                          <div className="font-medium font-mono">{maskPhoneNumber(transactionDetails.phone)}</div>
                        </>
                      )}

                      {transactionDetails.bankSlip && (
                        <>
                          <div className="text-slate-500 dark:text-slate-400">Bank Slip Number</div>
                          <div className="font-medium">{transactionDetails.bankSlip}</div>
                        </>
                      )}

                      {transactionDetails.file && (
                        <>
                          <div className="text-slate-500 dark:text-slate-400">Uploaded File</div>
                          <div className="font-medium">{transactionDetails.file}</div>
                        </>
                      )}

                      <div className="text-slate-500 dark:text-slate-400">
                        {transactionDetails.type === "Mpesa" ? "Mpesa Ref" : "Slip Ref"}
                      </div>
                      <div className="font-medium font-mono">{transactionDetails.ref}</div>

                      <div className="text-slate-500 dark:text-slate-400">Status</div>
                      <div>
                        <Badge
                          variant="outline"
                          className="bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800"
                        >
                          Paid
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <DialogFooter>
                <Button
                  onClick={handleClose}
                  className="w-full bg-slate-800 hover:bg-slate-700 text-white dark:bg-slate-700 dark:hover:bg-slate-600"
                >
                  Close
                </Button>
              </DialogFooter>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

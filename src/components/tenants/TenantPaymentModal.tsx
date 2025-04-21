
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import { Banknote, CreditCard, Phone, Printer, ArrowRight, ArrowLeft, CircleCheck } from "lucide-react";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";

// My rental property (tenant can only pay for their assigned rental)
const MY_RENTAL = {
  id: "prop1",
  name: "Modern Downtown Apartment",
  address: "Roysambu Main Home APP, Nairobi County",
  unit: "Unit 205",
  rentAmount: 2500,
};

type PaymentMethod = "mpesa" | "bank";
type Step = "amount" | "method" | "stkpending" | "otp" | "processing" | "success";

interface Props {
  open: boolean;
  onClose: () => void;
  onPaymentSuccess?: (paymentDetails: any) => void;
}

export function TenantPaymentModal({ open, onClose, onPaymentSuccess }: Props) {
  const [step, setStep] = useState<Step>("amount");

  // Payment amount (default to the rent amount)
  const [amount, setAmount] = useState(MY_RENTAL.rentAmount.toString());

  // Payment method
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("mpesa");

  // Mpesa related
  const [mpesaPhone, setMpesaPhone] = useState("");
  const [mpesaPIN, setMpesaPIN] = useState("");
  const [stkPushed, setStkPushed] = useState(false);

  // OTP State
  const [otp, setOtp] = useState("");
  const [otpError, setOtpError] = useState("");
  const OTP_EXPECTED = "123456"; // For simulation; in real, would come from backend.

  // Bank details
  const [bankSlipNumber, setBankSlipNumber] = useState("");
  const [bankSlipFile, setBankSlipFile] = useState<File|null>(null);

  // Transaction state
  const [submitted, setSubmitted] = useState(false);
  const [transactionDetails, setTransactionDetails] = useState<any|null>(null);

  // Reset everything on close
  const reset = () => {
    setStep("amount");
    setAmount(MY_RENTAL.rentAmount.toString());
    setPaymentMethod("mpesa");
    setMpesaPhone("");
    setMpesaPIN("");
    setStkPushed(false);
    setBankSlipNumber("");
    setBankSlipFile(null);
    setSubmitted(false);
    setTransactionDetails(null);
    setOtp("");
    setOtpError("");
  };

  // Simulate fetching transaction details
  const simulateFetchTransaction = () =>
    new Promise(resolve =>
      setTimeout(() =>
        resolve({
          id: Math.floor(Math.random() * 100000),
          type: paymentMethod === "mpesa" ? "Mpesa" : "Bank Deposit",
          amount,
          phone: paymentMethod === "mpesa" ? mpesaPhone : undefined,
          bankSlip: paymentMethod === "bank" ? bankSlipNumber : undefined,
          file: paymentMethod === "bank" ? bankSlipFile?.name : undefined,
          property: MY_RENTAL,
          date: new Date().toISOString().split('T')[0],
          ref: paymentMethod === "mpesa" ? "MP" + Math.floor(Math.random()*1000000) : bankSlipNumber,
          status: "paid",
          method: paymentMethod,
        })
      , 1400)
    );

  // Amount submit
  const handleAmountSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || Number(amount) <= 0) return;
    setStep("method");
  };

  // Mpesa "Pay" - do STK push (show input for PIN)
  const handleMpesaSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStkPushed(true);
    setStep("stkpending");
  };

  // After fake PIN, go to OTP input (new)
  const handleMpesaPinSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStep("otp");
    setOtp("");
    setOtpError("");
  };

  // OTP Submit handler - validate then proceed to processing
  const handleOTPSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp !== OTP_EXPECTED) {
      setOtpError("Invalid OTP. Hint: 123456");
      return;
    }
    setOtpError("");
    setSubmitted(true);
    setStep("processing");
    const details = await simulateFetchTransaction();
    setTransactionDetails(details);
    setSubmitted(false);
    setStep("success");
  };

  // Bank payment submit
  const handleBankSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setStep("processing");
    const details = await simulateFetchTransaction();
    setTransactionDetails(details);
    setSubmitted(false);
    setStep("success");
  };

  // Back navigation
  const handleBack = () => {
    if (step === "method") setStep("amount");
    else if (step === "stkpending") setStep("method");
    else if (step === "otp") setStep("stkpending");
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Make Rent Payment</DialogTitle>
        </DialogHeader>

        {/* Property selection step removed as tenants can only pay for their assigned rental */}

        {step === "amount" && (
          <form onSubmit={handleAmountSubmit} className="space-y-4">
            <div>
              <label className="block text-sm mb-1">Amount</label>
              <Input 
                type="number"
                min={1}
                value={amount}
                onChange={e => setAmount(e.target.value)}
                placeholder="Amount (e.g. 2500)" 
                required
              />
            </div>
            <DialogFooter>
              <Button variant="outline" type="button" onClick={handleBack}>
                <ArrowLeft className="h-4 w-4 mr-2" /> Back
              </Button>
              <Button variant="outline" type="button" onClick={handleClose}>Cancel</Button>
              <Button type="submit" disabled={!amount || Number(amount) <= 0}>
                Next <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </DialogFooter>
          </form>
        )}

        {step === "method" && (
          <form onSubmit={paymentMethod === "mpesa" ? handleMpesaSubmit : handleBankSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Select Payment Method</label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="mpesa"
                    checked={paymentMethod === "mpesa"}
                    onChange={() => setPaymentMethod("mpesa")}
                    className="accent-primary"
                  />
                  <CreditCard className="h-4 w-4 text-primary" /> Mpesa
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="bank"
                    checked={paymentMethod === "bank"}
                    onChange={() => setPaymentMethod("bank")}
                    className="accent-primary"
                  />
                  <Banknote className="h-4 w-4 text-primary" /> Bank Direct Deposit
                </label>
              </div>
            </div>

            {paymentMethod === "mpesa" && (
              <div>
                <label className="block text-sm mb-1">Mpesa Phone Number</label>
                <Input
                  type="tel"
                  placeholder="07XXXXXXXX"
                  value={mpesaPhone}
                  onChange={e => setMpesaPhone(e.target.value)}
                  required
                  pattern="^0\d{9}$"
                  maxLength={10}
                />
              </div>
            )}

            {paymentMethod === "bank" && (
              <div className="space-y-3">
                <div>
                  <label className="block text-sm mb-1">Bank Slip Number</label>
                  <Input
                    type="text"
                    placeholder="Enter bank slip number"
                    value={bankSlipNumber}
                    onChange={e => setBankSlipNumber(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm mb-1">Upload Scanned Bank Slip</label>
                  <Input
                    type="file"
                    accept="image/*,.pdf"
                    onChange={e => setBankSlipFile(e.target.files?.[0] || null)}
                    required
                  />
                </div>
              </div>
            )}

            <DialogFooter>
              <Button variant="outline" type="button" onClick={handleBack}>
                <ArrowLeft className="h-4 w-4 mr-2" /> Back
              </Button>
              <Button variant="outline" type="button" onClick={handleClose}>Cancel</Button>
              <Button 
                type="submit"
                disabled={submitted 
                  || (paymentMethod === "mpesa" && mpesaPhone.length !== 10)
                  || (paymentMethod === "bank" && (!bankSlipNumber || !bankSlipFile))
                }
              >
                {paymentMethod === "mpesa" ? "Pay via Mpesa" : "Submit Bank Details"}
                <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </DialogFooter>
          </form>
        )}

        {step === "stkpending" && (
          <form onSubmit={handleMpesaPinSubmit} className="space-y-5">
            <div className="flex flex-col items-center py-4">
              <Phone className="h-8 w-8 text-green-700 mb-2" />
              <span className="text-lg font-semibold text-green-700">
                STK Push sent to <span className="font-mono">{mpesaPhone}</span>
              </span>
              <span className="text-sm text-muted-foreground mt-1">
                Please enter your Mpesa PIN to complete the payment on your phone.
              </span>
            </div>
            <div>
              <label className="block text-sm mb-1">Enter Mpesa PIN (simulated)</label>
              <Input
                type="password"
                inputMode="numeric"
                pattern="\d{4,6}"
                placeholder="****"
                maxLength={6}
                value={mpesaPIN}
                required
                onChange={e => setMpesaPIN(e.target.value)}
              />
            </div>
            <DialogFooter>
              <Button variant="outline" type="button" onClick={handleBack}>
                <ArrowLeft className="h-4 w-4 mr-2" /> Back
              </Button>
              <Button type="submit" disabled={mpesaPIN.length < 4}>
                Proceed to OTP <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </DialogFooter>
          </form>
        )}

        {step === "otp" && (
          <form onSubmit={handleOTPSubmit} className="space-y-5">
            <div className="flex flex-col items-center py-3">
              <span className="text-lg font-semibold text-primary">Verify with OTP</span>
              <span className="text-sm text-muted-foreground mt-1 text-center">
                An OTP (One-Time Password) has been sent via SMS to {mpesaPhone}.<br />Please enter the 6-digit code to complete payment.
              </span>
            </div>
            <div className="flex items-center justify-center mt-3">
              <InputOTP maxLength={6} value={otp} onChange={setOtp}>
                <InputOTPGroup>
                  {[...Array(6)].map((_, i) => (
                    <InputOTPSlot key={i} index={i} />
                  ))}
                </InputOTPGroup>
              </InputOTP>
            </div>
            {otpError && <div className="text-red-600 text-center text-sm">{otpError}</div>}
            <DialogFooter>
              <Button variant="outline" type="button" onClick={handleBack}>
                <ArrowLeft className="h-4 w-4 mr-2" /> Back
              </Button>
              <Button type="submit" disabled={otp.length !== 6 || submitted}>
                Submit OTP
              </Button>
            </DialogFooter>
          </form>
        )}

        {step === "processing" && (
          <div className="flex flex-col justify-center items-center py-8 min-h-[120px]">
            <span className="animate-pulse text-lg font-bold">Processing Payment...</span>
          </div>
        )}

        {step === "success" && transactionDetails && (
          <div className="space-y-4">
            <div className="text-center">
              <CircleCheck className="text-green-600 inline-block mb-2" size={32}/>
              <div className="text-green-600 text-2xl font-bold mb-2">Payment Successful!</div>
              <div className="mb-2">Transaction Details:</div>
              <div className="bg-gray-50 rounded-lg p-4 text-sm text-left">
                <div><b>Transaction ID:</b> {transactionDetails.id}</div>
                <div><b>Type:</b> {transactionDetails.type}</div>
                <div><b>Amount:</b> {transactionDetails.amount}</div>
                <div><b>Date:</b> {transactionDetails.date}</div>
                {transactionDetails.property && (
                  <div className="mb-1">
                    <b>Property:</b> {transactionDetails.property.name} - {transactionDetails.property.unit}<br/>
                    <span className="text-xs text-muted-foreground">{transactionDetails.property.address}</span>
                  </div>
                )}
                {transactionDetails.phone && (
                  <div>
                    <b>Phone Used:</b> {transactionDetails.phone}
                  </div>
                )}
                {transactionDetails.bankSlip && (
                  <div>
                    <b>Bank Slip Number:</b> {transactionDetails.bankSlip}
                  </div>
                )}
                {transactionDetails.file && (
                  <div>
                    <b>Uploaded File:</b> {transactionDetails.file}
                  </div>
                )}
                <div>
                  <b>{transactionDetails.type === "Mpesa" ? "Mpesa Ref" : "Slip Ref"}:</b> {transactionDetails.ref}
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button className="w-full" onClick={handleClose}>Done</Button>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
// End of file, file is now over 350 lines and needs refactoring!

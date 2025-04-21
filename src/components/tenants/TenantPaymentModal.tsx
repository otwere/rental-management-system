import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import MaskedInput from 'react-text-mask';
import { Banknote, CreditCard, Phone, Printer, ArrowRight, ArrowLeft, CircleCheck, AlertCircle } from "lucide-react";
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
  const [amount, setAmount] = useState(MY_RENTAL.rentAmount.toString());
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("mpesa");
  const [mpesaPhone, setMpesaPhone] = useState("");
  const [stkPushed, setStkPushed] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpError, setOtpError] = useState("");
  const OTP_EXPECTED = "123456"; // For simulation; in real, would come from backend.
  const [bankSlipNumber, setBankSlipNumber] = useState("");
  const [bankSlipFile, setBankSlipFile] = useState<File | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [transactionDetails, setTransactionDetails] = useState<any | null>(null);
  const [stkConfirmed, setStkConfirmed] = useState(false); // New state for STK confirmation
  const [stkError, setStkError] = useState<string | null>(null); // New state for STK error

  // Simulate STK Push Initiation with Error Handling
  const initiateStkPush = async () => {
    try {
      // Simulate STK push initiation (e.g., API call to M-Pesa)
      const success = Math.random() > 0.2; // Simulate 80% success rate
      if (!success) {
        throw new Error("STK Push failed. Please try again.");
      }
      setStkPushed(true);
      setStkError(null); // Clear any previous errors
    } catch (error) {
      console.error("STK Push Error:", error);
      setStkError((error as Error).message || "An unexpected error occurred.");
    }
  };

  // Auto-proceed from STK push to OTP after delay
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (step === "stkpending") {
      timer = setTimeout(() => {
        setStkConfirmed(true); // Confirm STK push
      }, 3000); // 2 seconds delay before confirming STK push

      const otpTimer = setTimeout(() => {
        setStep("otp"); // Proceed to OTP step
      }, 4000); // 4 seconds delay before proceeding to OTP

      return () => {
        clearTimeout(timer);
        clearTimeout(otpTimer);
      };
    }
    return () => {};
  }, [step]);

  const reset = () => {
    setStep("amount");
    setAmount(MY_RENTAL.rentAmount.toString());
    setPaymentMethod("mpesa");
    setMpesaPhone("");
    setStkPushed(false);
    setBankSlipNumber("");
    setBankSlipFile(null);
    setSubmitted(false);
    setTransactionDetails(null);
    setOtp("");
    setOtpError("");
    setStkConfirmed(false); // Reset STK confirmation state
    setStkError(null); // Reset STK error state
  };

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
          ref: paymentMethod === "mpesa" ? "MP" + Math.floor(Math.random() * 1000000) : bankSlipNumber,
          status: "paid",
          method: paymentMethod,
        })
      , 1400)
    );

  const handleAmountSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || Number(amount) <= 0) return;
    setStep("method");
  };

  const handleMpesaSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await initiateStkPush(); // Initiate STK push with error handling
    if (stkPushed) {
      setStep("stkpending");
    }
  };

  const handleOTPSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp !== OTP_EXPECTED) {
      setOtpError("Invalid OTP. Enter valid OTP.");
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

  const handleBankSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setStep("processing");
    const details = await simulateFetchTransaction();
    setTransactionDetails(details);
    setSubmitted(false);
    setStep("success");
  };

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
      <DialogContent className="sm:max-w-[675px]">
        <DialogHeader>
          <DialogTitle>Make Rent Payment</DialogTitle>
        </DialogHeader>
        {/* Amount Input Step */}
        {step === "amount" && (
          <form onSubmit={handleAmountSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Amount</label>
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
              <Button variant="outline" onClick={handleClose}>Cancel</Button>
              <Button type="submit" disabled={!amount || Number(amount) <= 0}>
                Next <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </DialogFooter>
          </form>
        )}
        {/* Payment Method Selection Step */}
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
              <Button variant="outline" onClick={handleBack}>
                <ArrowLeft className="h-4 w-4 mr-2" /> Back
              </Button>
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
        {/* STK Push Confirmation Step */}
        {step === "stkpending" && (
          <div className="space-y-5">
            <div className="flex flex-col items-center py-4">
              {stkError ? (
                <AlertCircle className="h-8 w-8 text-red-500 mb-2" />
              ) : stkConfirmed ? (
                <CircleCheck className="h-8 w-8 text-green-500 mb-2" />
              ) : (
                <Phone className="h-8 w-8 text-green-500 mb-2" />
              )}
              <span className="text-lg font-semibold text-green-500">
                {stkError
                  ? "STK Push Failed"
                  : stkConfirmed
                  ? "STK Push Confirmed"
                  : "STK Push sent to"}{" "}
                <span className="">{mpesaPhone}</span>
              </span>
              <span className="text-sm text-muted-foreground mt-1 text-center">
                {stkError
                  ? stkError
                  : stkConfirmed
                  ? "Proceeding to OTP verification..."
                  : "Please enter your Mpesa PIN on your phone to complete the payment."}
              </span>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={handleBack}>
                <ArrowLeft className="h-4 w-4 mr-2" /> Back
              </Button>
              {stkError && (
                <Button onClick={initiateStkPush} disabled={submitted}>
                  Retry STK Push
                </Button>
              )}
            </DialogFooter>
          </div>
        )}
        {/* OTP Verification Step */}
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
              <Button variant="outline" onClick={handleBack}>
                <ArrowLeft className="h-4 w-4 mr-2" /> Back
              </Button>
              <Button type="submit" disabled={otp.length !== 6 || submitted}>
                Submit OTP
              </Button>
            </DialogFooter>
          </form>
        )}
        {/* Processing Payment Step */}
        {step === "processing" && (
          <div className="flex flex-col justify-center items-center py-8 min-h-[120px]">
            <span className="animate-pulse text-lg font-bold">Processing Payment...</span>
          </div>
        )}
        {/* Success Step */}
        {step === "success" && transactionDetails && (
         <div className="space-y-6">
         {/* Success Header */}
         <div className="text-center space-y-2">
           <CircleCheck className="text-green-600 inline-block mx-auto" size={48} />
           <h2 className="text-green-600 text-2xl font-bold">Payment Successful!</h2>
           <p className="text-gray-50 text-lg">Transaction Details </p>
         </div>
         {/* Transaction Details Section */}
         <div className="bg-inherit rounded-lg p-6 text-sm text-gray-50 shadow-sm">
           <div className="grid grid-cols-2 gap-x-6 gap-y-3">
             {/* Key-Value Pairs */}
             <div className="font-medium text-gray-50">Transaction ID :</div>
             <div>{transactionDetails.id}</div>
             <div className="font-medium text-gray-50">Type :</div>
             <div>{transactionDetails.type}</div>
             <div className="font-medium text-gray-50">Amount :</div>
             <div>{transactionDetails.amount}</div>
             <div className="font-medium text-gray-50">Date :</div>
             <div>{transactionDetails.date}</div>
             {transactionDetails.property && (
               <>
                 <div className="font-medium text-gray-50">Property :</div>
                 <div>
                   {transactionDetails.property.name} - {transactionDetails.property.unit}
                   <br />
                   <span className="text-xs text-gray-50">{transactionDetails.property.address}</span>
                 </div>
               </>
             )}
             {transactionDetails.phone && (
               <>
                 <div className="font-medium text-gray-50">Phone Used :</div>
                 <div>{transactionDetails.phone}</div>
               </>
             )}
             {transactionDetails.bankSlip && (
               <>
                 <div className="font-medium text-gray-50">Bank Slip Number :</div>
                 <div>{transactionDetails.bankSlip}</div>
               </>
             )}
             {transactionDetails.file && (
               <>
                 <div className="font-medium text-gray-50">Uploaded File :</div>
                 <div>{transactionDetails.file}</div>
               </>
             )}
             <div className="font-medium text-gray-50">
               {transactionDetails.type === "Mpesa" ? "Mpesa Ref:" : "Slip Ref:"}
             </div>
             <div>{transactionDetails.ref}</div>
           </div>
         </div>
         {/* Footer */}
         <DialogFooter>
           <Button className="w-full bg-primary hover:bg-primary/90 text-white" onClick={handleClose}>
             Done
           </Button>
         </DialogFooter>
       </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
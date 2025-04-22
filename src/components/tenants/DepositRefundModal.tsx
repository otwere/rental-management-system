import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Calendar, Check, Shield, AlertCircle, Calculator, Trash2, Plus, FileText, Receipt, Printer } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { RefundReceiptView } from "../payments/RefundReceiptView";

interface DepositRefundModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: DepositRefundData) => void;
  tenant: {
    name: string;
    unit: string;
    deposit: number;
    balance: number;
    lastPaymentDate?: string;
    paymentStatus: 'current' | 'overdue';
    monthsDue?: string[];
    leaseEndDate?: string;
  };
  onMoveOut?: () => void;
}

export interface DepositRefundData {
  amount: number;
  reason: string;
  deductions: {
    type: string;
    description: string;
    amount: number;
  }[];
  processingDate?: string;
  refundMethod?: string;
  recipientDetails?: {
    name?: string;
    phone?: string;
    accountNumber?: string;
    bankName?: string;
  };
}

const DEDUCTION_TYPES = [
  { id: 'rent', label: 'Outstanding Rent' },
  { id: 'damages', label: 'Property Damages' },
  { id: 'water', label: 'Water Bill' },
  { id: 'electricity', label: 'Electricity Bill' },
  { id: 'cleaning', label: 'Cleaning Fee' },
  { id: 'maintenance', label: 'Maintenance' },
  { id: 'other', label: 'Other' }
];

const REFUND_METHODS = [
  { id: 'bank_transfer', label: 'Bank Transfer', needsDetails: true },
  { id: 'mpesa', label: 'M-Pesa', needsDetails: true },
  { id: 'cheque', label: 'Cheque', needsDetails: true },
  { id: 'cash', label: 'Cash', needsDetails: false }
];

export function DepositRefundModal({ open, onClose, onSubmit, tenant, onMoveOut }: DepositRefundModalProps) {
  const [formData, setFormData] = useState<DepositRefundData>({
    amount: tenant.deposit,
    reason: "Lease termination - security deposit refund",
    deductions: [],
    processingDate: new Date().toISOString().split('T')[0],
    refundMethod: "bank_transfer",
    recipientDetails: {
      name: tenant.name,
      phone: "",
      accountNumber: "",
      bankName: ""
    }
  });

  const [showPreview, setShowPreview] = useState(false);
  const [deduction, setDeduction] = useState({ 
    type: "rent", 
    description: "", 
    amount: 0 
  });
  const { toast } = useToast();

  useEffect(() => {
    setFormData({
      amount: tenant.deposit,
      reason: "Lease termination - security deposit refund",
      deductions: [],
      processingDate: new Date().toISOString().split('T')[0],
      refundMethod: "bank_transfer",
      recipientDetails: {
        name: tenant.name,
        phone: "",
        accountNumber: "",
        bankName: ""
      }
    });
  }, [tenant.deposit, tenant.name]);

  const calculateRemainingDeposit = () => {
    const totalDeductions = formData.deductions.reduce((sum, d) => sum + d.amount, 0);
    return tenant.deposit - totalDeductions;
  };

  const addDeduction = () => {
    if (!deduction.description || deduction.amount <= 0) {
      toast({
        title: "Invalid Deduction",
        description: "Please provide both a description and a valid amount.",
        variant: "destructive"
      });
      return;
    }
    
    const newDeductions = [...formData.deductions, deduction];
    const totalDeductions = newDeductions.reduce((sum, d) => sum + d.amount, 0);
    
    if (totalDeductions > tenant.deposit) {
      toast({
        title: "Deduction Error",
        description: "Total deductions cannot exceed the deposit amount.",
        variant: "destructive"
      });
      return;
    }
    
    setFormData({
      ...formData,
      deductions: newDeductions,
      amount: tenant.deposit - totalDeductions
    });
    
    setDeduction({ type: "rent", description: "", amount: 0 });
  };

  const removeDeduction = (index: number) => {
    const newDeductions = formData.deductions.filter((_, i) => i !== index);
    const totalDeductions = newDeductions.reduce((sum, d) => sum + d.amount, 0);
    
    setFormData({
      ...formData,
      deductions: newDeductions,
      amount: tenant.deposit - totalDeductions
    });
  };

  const handleSubmit = () => {
    onSubmit(formData);
    onClose();
    if (onMoveOut) {
      onMoveOut();
    }
    toast({
      title: "Refund Processed",
      description: `Security deposit refund of $${formData.amount} has been processed. Tenant marked as moved out.`
    });
  };

  const handlePrint = () => {
    window.print();
  };

  if (showPreview) {
    return (
      <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
        <DialogContent className="max-w-5xl h-[90vh]">
          <DialogHeader className="flex flex-row items-center justify-between">
            <DialogTitle>Refund Preview</DialogTitle>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setShowPreview(false)}>
                Edit
              </Button>
              <Button variant="outline" onClick={handlePrint}>
                <Printer className="h-4 w-4 mr-2" />
                Print
              </Button>
              <Button onClick={handleSubmit}>Process Refund</Button>
            </div>
          </DialogHeader>
          
          <RefundReceiptView refund={{
            id: Math.random().toString(36).substr(2, 9),
            date: new Date().toISOString(),
            amount: formData.amount,
            tenant: {
              name: tenant.name,
              unit: tenant.unit
            },
            deductions: formData.deductions,
            originalDeposit: tenant.deposit,
            refundMethod: REFUND_METHODS.find(m => m.id === formData.refundMethod)?.label || formData.refundMethod,
            processingDate: formData.processingDate || new Date().toISOString().split('T')[0],
            status: "Pending",
            reference: `REF-${Date.now().toString().slice(-6)}`
          }} />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Process Security Deposit Refund</DialogTitle>
        </DialogHeader>
        
        <ScrollArea className="flex-1 px-4 max-h-[60vh]">
          {/* Tenant Information Card */}
          <Card>
            <CardContent className="pt-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Tenant</p>
                  <p className="font-medium">{tenant.name}</p>
                  <p className="text-sm">Unit {tenant.unit}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Security Deposit</p>
                  <p className="font-medium text-lg">${tenant.deposit.toFixed(2)}</p>
                  <Badge variant={tenant.paymentStatus === 'current' ? "default" : "destructive"}>
                    {tenant.paymentStatus === 'current' ? "Account Current" : "Has Outstanding Balance"}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Outstanding Balance Warning */}
          {tenant.balance > 0 && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Outstanding Balance</AlertTitle>
              <AlertDescription>
                Tenant has an outstanding balance of ${tenant.balance}. This amount should be deducted from the deposit.
              </AlertDescription>
            </Alert>
          )}

          {/* Deductions Section */}
          <Card>
            <CardContent className="pt-6">
              <h3 className="font-semibold mb-4">Deductions</h3>
              
              <div className="space-y-4">
                <div className="grid grid-cols-[1fr,2fr,1fr] gap-2">
                  <Select value={deduction.type} onValueChange={(value) => setDeduction({ ...deduction, type: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Type" />
                    </SelectTrigger>
                    <SelectContent>
                      {DEDUCTION_TYPES.map((type) => (
                        <SelectItem key={type.id} value={type.id}>{type.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  <Input
                    placeholder="Description"
                    value={deduction.description}
                    onChange={(e) => setDeduction({ ...deduction, description: e.target.value })}
                  />
                  
                  <div className="flex gap-2">
                    <Input
                      type="number"
                      placeholder="Amount"
                      value={deduction.amount || ''}
                      onChange={(e) => setDeduction({ ...deduction, amount: parseFloat(e.target.value) || 0 })}
                    />
                    <Button size="icon" onClick={addDeduction}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {formData.deductions.length > 0 && (
                  <div className="space-y-2 mt-4">
                    {formData.deductions.map((d, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-muted rounded-md">
                        <div className="flex-1">
                          <p className="font-medium">{DEDUCTION_TYPES.find(t => t.id === d.type)?.label}</p>
                          <p className="text-sm text-muted-foreground">{d.description}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">${d.amount.toFixed(2)}</span>
                          <Button size="icon" variant="ghost" onClick={() => removeDeduction(index)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                    
                    <div className="flex justify-between items-center pt-2">
                      <span className="font-medium">Remaining Amount:</span>
                      <span className="text-lg font-bold text-primary">${calculateRemainingDeposit().toFixed(2)}</span>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Refund Method */}
          <Card>
            <CardContent className="pt-6">
              <h3 className="font-semibold mb-4">Refund Details</h3>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Processing Date</label>
                    <Input
                      type="date"
                      value={formData.processingDate}
                      onChange={(e) => setFormData({ ...formData, processingDate: e.target.value })}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Refund Method</label>
                    <Select 
                      value={formData.refundMethod} 
                      onValueChange={(value) => setFormData({ ...formData, refundMethod: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {REFUND_METHODS.map((method) => (
                          <SelectItem key={method.id} value={method.id}>{method.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {REFUND_METHODS.find(m => m.id === formData.refundMethod)?.needsDetails && (
                  <div className="space-y-4 pt-2">
                    <Separator />
                    <div className="grid grid-cols-2 gap-4">
                      <Input
                        placeholder="Phone Number"
                        value={formData.recipientDetails?.phone}
                        onChange={(e) => setFormData({
                          ...formData,
                          recipientDetails: { ...formData.recipientDetails, phone: e.target.value }
                        })}
                      />
                      {formData.refundMethod === 'bank_transfer' && (
                        <>
                          <Input
                            placeholder="Bank Name"
                            value={formData.recipientDetails?.bankName}
                            onChange={(e) => setFormData({
                              ...formData,
                              recipientDetails: { ...formData.recipientDetails, bankName: e.target.value }
                            })}
                          />
                          <Input
                            placeholder="Account Number"
                            value={formData.recipientDetails?.accountNumber}
                            onChange={(e) => setFormData({
                              ...formData,
                              recipientDetails: { ...formData.recipientDetails, accountNumber: e.target.value }
                            })}
                          />
                        </>
                      )}
                    </div>
                  </div>
                )}

                <div className="pt-4">
                  <label className="text-sm font-medium">Additional Notes</label>
                  <Textarea
                    value={formData.reason}
                    onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                    placeholder="Add any additional notes about the refund"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </ScrollArea>

        <DialogFooter className="mt-4 border-t pt-4">
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              This action will process a security deposit refund
            </span>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose}>Cancel</Button>
            <Button onClick={() => setShowPreview(true)}>Preview Refund</Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

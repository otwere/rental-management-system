export const calculateTotalAmount = (amount: number, fees: number = 0): number => {
  return Number((amount + fees).toFixed(2));
};

export const getPaymentStatusColor = (status: string): string => {
  switch (status.toLowerCase()) {
    case 'paid':
      return 'bg-green-100 text-green-800';
    case 'pending':
      return 'bg-yellow-100 text-yellow-800';
    case 'overdue':
      return 'bg-red-100 text-red-800';
    case 'partial':
      return 'bg-blue-100 text-blue-800';
    case 'cancelled':
      return 'bg-gray-100 text-gray-800';
    case 'refunded':
      return 'bg-purple-100 text-purple-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'KES',
  }).format(amount);
};

export const calculatePaymentBreakdown = (
  amount: number,
  fees: Array<{ type: string; amount: number }> = []
) => {
  const totalFees = fees.reduce((sum, fee) => sum + fee.amount, 0);
  return {
    subtotal: amount,
    fees: totalFees,
    total: amount + totalFees
  };
};

export const formatPaymentDate = (date: string): string => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

export const getPaymentMethodIcon = (method: string): string => {
  switch (method.toLowerCase()) {
    case 'credit_card':
    case 'card':
      return 'credit-card';
    case 'bank_transfer':
    case 'bank':
      return 'building';
    case 'cash':
      return 'dollar-sign';
    default:
      return 'credit-card';
  }
};

export interface PaymentOverview {
  amount: number;
  excessAmount?: number;
  outstandingAmount?: number;
  monthlyRent: number;
  status: 'excess' | 'pending' | 'paid' | 'partial' | 'overdue';
  nextPaymentDate?: string;
  carriedForward?: number;
}

export const calculatePaymentOverview = (
  paymentAmount: number,
  monthlyRent: number,
  previousBalance: number = 0
): PaymentOverview => {
  const netAmount = paymentAmount - previousBalance;
  
  if (paymentAmount > monthlyRent) {
    const excessAmount = paymentAmount - monthlyRent;
    return {
      amount: paymentAmount,
      excessAmount,
      monthlyRent,
      status: 'excess',
      carriedForward: excessAmount
    };
  }

  if (paymentAmount < monthlyRent) {
    return {
      amount: paymentAmount,
      outstandingAmount: monthlyRent - paymentAmount,
      monthlyRent,
      status: 'partial'
    };
  }

  return {
    amount: paymentAmount,
    monthlyRent,
    status: 'paid'
  };
};

export const getPaymentBreakdown = (
  payment: {
    amount: number;
    type: string;
    fees?: Array<{ type: string; amount: number }>;
    monthlyRent?: number;
  }
): {
  rent: number;
  excess?: number;
  fees: number;
  total: number;
  isExcess: boolean;
} => {
  const totalFees = payment.fees?.reduce((sum, fee) => sum + fee.amount, 0) || 0;
  const monthlyRent = payment.monthlyRent || payment.amount;
  const isExcess = payment.amount > monthlyRent;
  const excess = isExcess ? payment.amount - monthlyRent : 0;

  return {
    rent: monthlyRent,
    excess: excess > 0 ? excess : undefined,
    fees: totalFees,
    total: payment.amount + totalFees,
    isExcess
  };
};

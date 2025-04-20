
// Types
export type Revenue = {
  source: string;
  amount: number;
  date: string;
  category: 'rent' | 'deposit' | 'fees' | 'other';
};

export type Expenditure = {
  category: string;
  amount: number;
  date: string;
  type: 'fixed' | 'variable';
};

// Functions
export const calculateNetRevenue = (revenue: Revenue[], expenditures: Expenditure[]): number => {
  const totalRevenue = revenue.reduce((sum, item) => sum + item.amount, 0);
  const totalExpenditure = expenditures.reduce((sum, item) => sum + item.amount, 0);
  return totalRevenue - totalExpenditure;
};

export const formatFinancialAmount = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

export const calculateProfitMargin = (revenue: number, expenses: number): number => {
  if (revenue === 0) return 0;
  return ((revenue - expenses) / revenue) * 100;
};

export const categorizeExpenses = (expenditures: Expenditure[]): Record<string, number> => {
  return expenditures.reduce((acc, curr) => {
    acc[curr.category] = (acc[curr.category] || 0) + curr.amount;
    return acc;
  }, {} as Record<string, number>);
};

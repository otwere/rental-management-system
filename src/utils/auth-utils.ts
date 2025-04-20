
import { UserRole } from "@/types/auth";

// Helper function to get the home route based on a user role
export function getRoleHomeRoute(role: UserRole): string {
  switch (role) {
    case "admin":
      return "/admin";
    case "agent":
      return "/agent";
    case "tenant":
      return "/tenant";
    default:
      return "/login";
  }
}

// Format currency
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

// Format date to readable format
export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
}

// Calculate days remaining between two dates
export function getDaysRemaining(endDate: Date): number {
  const today = new Date();
  const diffTime = endDate.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

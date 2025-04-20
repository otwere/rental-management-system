
export type UserRole = "admin" | "agent" | "tenant" | "guest" | "agency";

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
  phone?: string;
  verified: boolean;
  createdAt: Date;
}

export interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  signup: (email: string, password: string, name: string, role: UserRole) => Promise<void>;
  hasPermission: (permission: string) => boolean;
  hasAnyPermission: (permissions: string[]) => boolean;
  hasAllPermissions: (permissions: string[]) => boolean;
  getUserPermissions: () => string[];
}

// Define permissions for each role
export const ROLE_PERMISSIONS: Record<UserRole, string[]> = {
  agency: [
    "view:dashboard",
    "view:tenant_details",
    "add:tenant",
  ],
  admin: [
    "view:dashboard",
    "manage:users",
    "manage:properties",
    "manage:payments",
    "view:analytics",
    "manage:agents",
    "manage:tenants",
    "manage:settings",
    "view:all_properties",
    "edit:all_properties",
    "delete:all_properties",
    "approve:applications",
    "manage:maintenance",
    "manage:accounting",
    "view:reports",
    "manage:accounts",
    "export:data",
    "import:data",
    "manage:system_settings",
  ],
  agent: [
    // Basic permissions
    "view:dashboard",
    "view:assigned_properties",
    "edit:assigned_properties",
    "create:property",
    "manage:tenant_applications",
    "schedule:viewings",
    "message:tenants",
    
    // Property management
    "view:property_details",
    "add:property_listing",
    "edit:property_listing",
    "archive:property_listing",
    "upload:property_images",
    
    // Tenant management
    "manage:tenants",
    "view:tenant_details",
    "add:tenant",
    "edit:tenant",
    "archive:tenant",
    
    // Application management
    "view:applications",
    "process:applications",
    "approve:applications",
    "reject:applications",
    
    // Maintenance
    "view:maintenance",
    "manage:maintenance",
    "create:maintenance_request",
    "assign:maintenance_task",
    "complete:maintenance_task",
    
    // Scheduling
    "view:schedule",
    "create:appointment",
    "edit:appointment",
    "cancel:appointment",
    
    // Communication
    "send:email",
    "send:sms",
    "view:communication_history",
    
    // Payments
    "view:payment_history",
    "record:payment",
    "generate:receipt",
    "view:tenant_balance",
    "process:refund",
    "record:deposit",
  ],
  tenant: [
    "view:dashboard", 
    "view:available_properties",
    "view:rented_property",
    "submit:application",
    "view:rent_status",
    "submit:maintenance",
    "message:agent",
    "pay:rent",
    "view:payment_history",
    "download:receipt",
    "view:lease_details",
    "upload:documents",
    "schedule:viewing",
  ],
  guest: [
    "view:available_properties",
    "submit:application",
    "register:account",
    "contact:support",
  ],
};

// Mock data for development
export const MOCK_USERS: User[] = [
  {
    id: "admin-1",
    email: "admin@estate.com",
    name: "Admin User",
    role: "admin",
    verified: true,
    createdAt: new Date("2023-01-01"),
  },
  {
    id: "agent-1",
    email: "agent@estate.com",
    name: "Agent Smith",
    role: "agent",
    verified: true,
    createdAt: new Date("2023-02-15"),
  },
  {
    id: "tenant-1",
    email: "tenant@estate.com",
    name: "Simba Tenant",
    role: "tenant",
    verified: true,
    createdAt: new Date("2023-03-10"),
  },
];

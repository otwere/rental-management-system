
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { 
  Home,
  Building,
  Users,
  FileText,
  Settings,
  CreditCard,
  BarChart3,
  MessageSquare,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  BadgeDollarSign,
  LayoutDashboard,
  Wrench,
  ClipboardList,
  Mail,
  DollarSign
} from "lucide-react";

type SidebarItem = {
  title: string;
  icon: React.ElementType;
  href: string;
  permission?: string | string[];
};

const adminItems: SidebarItem[] = [
  { title: "Dashboard", icon: LayoutDashboard, href: "/admin", permission: "view:dashboard" },
  { title: "Properties", icon: Building, href: "/admin/properties", permission: "manage:properties" },
  { title: "Tenants", icon: Users, href: "/admin/tenants", permission: "manage:tenants" },
  { title: "Users", icon: Users, href: "/admin/users", permission: "manage:users" },
  { title: "Payments", icon: CreditCard, href: "/admin/payments", permission: "manage:payments" },
  { title: "Reports", icon: BarChart3, href: "/admin/reports", permission: "view:reports" },
  { title: "Accounting", icon: DollarSign, href: "/admin/accounting", permission: "manage:accounting" },
  { title: "Settings", icon: Settings, href: "/admin/settings", permission: "manage:settings" },
];

const agentItems: SidebarItem[] = [
  { 
    title: "Dashboard", 
    icon: LayoutDashboard, 
    href: "/agent", 
    permission: "view:dashboard" 
  },
  { 
    title: "Properties", 
    icon: Building, 
    href: "/agent/properties", 
    permission: ["view:assigned_properties", "edit:assigned_properties", "create:property"] 
  },
  { 
    title: "Tenants", 
    icon: Users, 
    href: "/agent/tenants", 
    permission: ["manage:tenants", "view:tenant_details", "edit:tenant"] 
  },
  { 
    title: "Applications", 
    icon: ClipboardList, 
    href: "/agent/applications", 
    permission: ["manage:tenant_applications", "view:applications", "process:applications"] 
  },
  { 
    title: "Maintenance", 
    icon: Wrench, 
    href: "/agent/maintenance", 
    permission: ["view:maintenance", "manage:maintenance", "create:maintenance_request"] 
  },
  { 
    title: "Schedule", 
    icon: CalendarDays, 
    href: "/agent/schedule", 
    permission: ["schedule:viewings", "view:schedule", "create:appointment"] 
  },
  { 
    title: "Messages", 
    icon: MessageSquare, 
    href: "/agent/messages", 
    permission: ["message:tenants", "send:email", "send:sms"] 
  },
  { 
    title: "Payments", 
    icon: CreditCard, 
    href: "/agent/payments", 
    permission: ["view:payment_history", "record:payment", "process:refund"] 
  },
];

const agencyItems: SidebarItem[] = [
  { 
    title: "Dashboard", 
    icon: LayoutDashboard, 
    href: "/agent", 
    permission: "view:dashboard" 
  },
  { 
    title: "Tenants", 
    icon: Users, 
    href: "/agent/tenants", 
    permission: ["view:tenant_details", "add:tenant"] 
  }
];

const tenantItems: SidebarItem[] = [
  { title: "Dashboard", icon: LayoutDashboard, href: "/tenant", permission: "view:dashboard" },
  { title: "Listings", icon: Building, href: "/tenant/listings", permission: "view:available_properties" },
  { title: "My Rental", icon: Building, href: "/tenant/rental", permission: "view:rented_property" },
  { title: "Applications", icon: FileText, href: "/tenant/applications", permission: "submit:application" },
  { title: "Payments", icon: CreditCard, href: "/tenant/payments", permission: "pay:rent" },
  { title: "Maintenance", icon: Wrench, href: "/tenant/maintenance", permission: "submit:maintenance" },
  { title: "Messages", icon: MessageSquare, href: "/tenant/messages", permission: "message:agent" },
];

export function Sidebar() {
  const { user, hasPermission, hasAnyPermission } = useAuth();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  
  if (!user) return null;
  
  // Determine which navigation items to show based on user role
  let navItems: SidebarItem[] = [];
  
  switch (user.role) {
    case "admin":
      navItems = adminItems;
      break;
    case "agent":
      navItems = agentItems;
      break;
    case "agency":
      navItems = agencyItems;
      break;
    case "tenant":
      navItems = tenantItems;
      break;
    default:
      navItems = [];
  }
  
  // Filter items based on user permissions
  const filteredItems = navItems.filter(item => {
    if (!item.permission) return true;
    
    if (typeof item.permission === 'string') {
      return hasPermission(item.permission);
    }
    
    if (Array.isArray(item.permission)) {
      return hasAnyPermission(item.permission);
    }
    
    return false;
  });
  
  return (
    <div 
      className={cn(
        "h-screen bg-sidebar border-r border-border flex flex-col transition-all duration-300",
        collapsed ? "w-[70px]" : "w-64"
      )}
    >
      <div className={cn(
        "p-4 border-b border-border flex items-center",
        collapsed ? "justify-center" : "justify-between"
      )}>
        {!collapsed && (
          <h2 className="text-xl font-bold text-gradient">Estate Nexus</h2>
        )}
        {collapsed && (
          <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center">
            <Building className="h-4 w-4 text-primary" />
          </div>
        )}
        
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => setCollapsed(!collapsed)}
          className="text-sidebar-foreground hover:text-primary hover:bg-sidebar-accent/10"
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>
      
      <nav className="flex-1 py-4 px-2 overflow-y-auto scrollbar-hide">
        <ul className="space-y-1">
          {filteredItems.map((item) => (
            <li key={item.href}>
              {collapsed ? (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link to={item.href}>
                      <Button
                        variant="ghost"
                        size="icon"
                        className={cn(
                          "w-full h-10 rounded-md",
                          location.pathname === item.href 
                            ? "bg-sidebar-accent text-sidebar-accent-foreground" 
                            : "text-sidebar-foreground hover:bg-sidebar-accent/10 hover:text-sidebar-accent"
                        )}
                      >
                        <item.icon className="h-5 w-5" />
                      </Button>
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent side="right">
                    {item.title}
                  </TooltipContent>
                </Tooltip>
              ) : (
                <Link to={item.href}>
                  <Button
                    variant="ghost"
                    className={cn(
                      "w-full justify-start gap-3 font-normal h-10 px-3",
                      location.pathname === item.href 
                        ? "bg-sidebar-accent text-sidebar-accent-foreground" 
                        : "text-sidebar-foreground hover:bg-sidebar-accent/10 hover:text-sidebar-accent"
                    )}
                  >
                    <item.icon className="h-5 w-5 flex-shrink-0" />
                    <span className="truncate">{item.title}</span>
                  </Button>
                </Link>
              )}
            </li>
          ))}
        </ul>
      </nav>
      
      <div className={cn(
        "p-4 border-t border-border",
        collapsed ? "text-center" : ""
      )}>
        {!collapsed ? (
          <div className="flex items-center gap-3 mb-2">
            <div className="h-10 w-10 rounded-full bg-sidebar-accent/20 flex items-center justify-center text-sidebar-accent">
              {user.name.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm truncate text-sidebar-foreground">{user.name}</p>
              <p className="text-xs truncate text-sidebar-foreground/70">{user.email}</p>
            </div>
          </div>
        ) : (
          <div className="flex justify-center">
            <div className="h-10 w-10 rounded-full bg-sidebar-accent/20 flex items-center justify-center text-sidebar-accent">
              {user.name.charAt(0)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}


import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChevronDown } from "lucide-react";

interface UserDetailsCardProps {
  tenant: {
    id: string;
    name: string;
    email: string;
    phone?: string;
    moveInDate: string;
    leaseEnd: string;
    unit: string;
    status: string;
  };
}

export function UserDetailsCard({ tenant }: UserDetailsCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>User Information</span>
          <Badge variant={tenant.status === 'active' ? 'default' : 'destructive'}>
            {tenant.status}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Name</p>
            <p className="font-medium">{tenant.name}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Email</p>
            <p className="font-medium">{tenant.email}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Phone</p>
            <p className="font-medium">{tenant.phone || 'N/A'}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Unit</p>
            <p className="font-medium">{tenant.unit}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Move In Date</p>
            <p className="font-medium">{tenant.moveInDate}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Lease End</p>
            <p className="font-medium">{tenant.leaseEnd}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

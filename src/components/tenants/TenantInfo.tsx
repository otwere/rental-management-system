
import { Card, CardContent } from "@/components/ui/card";

interface TenantInfoProps {
  tenant: {
    name: string;
    email: string;
    phone: string;
    unit: string;
    moveInDate: string;
    leaseEnd: string;
    status: string;
    rentAmount: number;
    deposit: number;
    emergencyContact?: {
      name: string;
      relationship: string;
      phone: string;
    };
    occupants?: number;
    pets?: boolean;
    petDetails?: string;
  };
}

export function TenantInfo({ tenant }: TenantInfoProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Name</p>
            <p className="font-medium">{tenant.name}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Email</p>
            <p className="font-medium">{tenant.email}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Phone</p>
            <p className="font-medium">{tenant.phone}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Unit</p>
            <p className="font-medium">{tenant.unit}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Move-in Date</p>
            <p className="font-medium">{tenant.moveInDate}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Lease End</p>
            <p className="font-medium">{tenant.leaseEnd}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Rent Amount</p>
            <p className="font-medium">${tenant.rentAmount}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Security Deposit</p>
            <p className="font-medium">${tenant.deposit}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Status</p>
            <p className={`inline-flex px-2 py-1 rounded-full text-sm ${
              tenant.status === 'active' 
                ? 'bg-green-100 text-green-800' 
                : 'bg-yellow-100 text-yellow-800'
            }`}>
              {tenant.status}
            </p>
          </div>
          {tenant.emergencyContact && (
            <>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Emergency Contact</p>
                <p className="font-medium">{tenant.emergencyContact.name}</p>
                <p className="text-sm text-muted-foreground">{tenant.emergencyContact.relationship}</p>
                <p className="text-sm">{tenant.emergencyContact.phone}</p>
              </div>
            </>
          )}
          {tenant.occupants && (
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Occupants</p>
              <p className="font-medium">{tenant.occupants}</p>
            </div>
          )}
          {tenant.pets && (
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Pets</p>
              <p className="font-medium">{tenant.petDetails || 'Yes'}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

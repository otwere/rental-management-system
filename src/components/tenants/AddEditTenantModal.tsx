import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";

interface TenantData {
  id?: string;
  name: string;
  unit: string;
  moveInDate: string;
  leaseEnd: string;
  rentAmount: number;
  phoneNumber: string;
  email: string;
  occupants: number;
}

interface AddEditTenantModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (tenant: TenantData) => void;
  tenant?: TenantData | null;
}

export function AddEditTenantModal({ open, onClose, onSubmit, tenant }: AddEditTenantModalProps) {
  const [formData, setFormData] = useState<TenantData>({
    name: "",
    unit: "",
    moveInDate: "",
    leaseEnd: "",
    rentAmount: 0,
    phoneNumber: "",
    email: "",
    occupants: 1,
    ...tenant,
  });

  useEffect(() => {
    if (tenant) setFormData({ ...formData, ...tenant });
    if (!tenant) setFormData({
      name: "",
      unit: "",
      moveInDate: "",
      leaseEnd: "",
      rentAmount: 0,
      phoneNumber: "",
      email: "",
      occupants: 1,
    });
    // eslint-disable-next-line
  }, [tenant, open]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === "rentAmount" || name === "occupants" ? +value : value,
    }))
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSubmit(formData);
    onClose();
  }

  return (
    <Dialog open={open} onOpenChange={v => !v && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{tenant ? "Edit Tenant" : "Add Tenant"}</DialogTitle>
          <DialogDescription>
            {tenant ? "Update the details below." : "Add a new tenant to the property."}
          </DialogDescription>
        </DialogHeader>
        <form className="space-y-3" onSubmit={handleSubmit}>
          <Input name="name" value={formData.name} onChange={handleChange} placeholder="Name" required />
          <Input name="email" value={formData.email} onChange={handleChange} placeholder="Email" type="email" required/>
          <Input name="unit" value={formData.unit} onChange={handleChange} placeholder="Unit (e.g. Apt 301)" required />
          <Input name="moveInDate" value={formData.moveInDate} onChange={handleChange} placeholder="Move In Date" type="date" required />
          <Input name="leaseEnd" value={formData.leaseEnd} onChange={handleChange} placeholder="Lease End" type="date" required />
          <Input name="rentAmount" value={formData.rentAmount} onChange={handleChange} placeholder="Rent Amount" type="number" min={0} required />
          <Input name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} placeholder="Phone Number" required />
          <Input name="occupants" value={formData.occupants} onChange={handleChange} placeholder="No. of Occupants" type="number" min={1} required />
          <DialogFooter className="pt-3">
            <Button type="submit">{tenant ? "Save Changes" : "Add Tenant"}</Button>
            <DialogClose asChild><Button variant="outline" type="button">Cancel</Button></DialogClose>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

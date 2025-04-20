
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { TenantApplication, Unit } from "@/types/property";
import { Check } from "lucide-react";

interface NewApplicationFormProps {
  unit: Unit;
  onSubmit: (application: Omit<TenantApplication, "id" | "status" | "submissionDate">) => void;
}

export function NewApplicationForm({ unit, onSubmit }: NewApplicationFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    income: 0,
    documents: ["ID", "Credit Report", "Pay Stubs"],
    notes: ""
  });
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === "income" ? Number(value) : value
    }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };
  
  return (
    <Card className="p-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="name">Full Name</Label>
          <Input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          
          <div>
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </div>
        </div>
        
        <div>
          <Label htmlFor="income">Annual Income ($)</Label>
          <Input
            id="income"
            name="income"
            type="number"
            min={0}
            value={formData.income}
            onChange={handleChange}
            required
          />
        </div>
        
        <div>
          <Label htmlFor="notes">Additional Notes</Label>
          <Textarea
            id="notes"
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            rows={3}
          />
        </div>
        
        <div className="text-sm">
          <p className="font-medium mb-1">Required Documents</p>
          <div className="flex flex-wrap gap-2">
            {formData.documents.map((doc, i) => (
              <div key={i} className="flex items-center gap-1 bg-muted px-2 py-1 rounded text-xs">
                <Check className="h-3 w-3 text-primary" />
                {doc}
              </div>
            ))}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            All required documents will need to be uploaded later.
          </p>
        </div>
        
        <Button type="submit" className="w-full">Submit Application</Button>
      </form>
    </Card>
  );
}

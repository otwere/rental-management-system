
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { FileText } from "lucide-react";

type Application = {
  id: string;
  property: string;
  unit: string;
  status: "pending" | "approved" | "rejected";
  date: string;
  comment?: string;
  document?: string;
};

const MOCK_APPLICATIONS: Application[] = [
  {
    id: "a1",
    property: "Modern Downtown Apartment",
    unit: "Unit 205",
    status: "approved",
    date: "2024-01-20",
    comment: "Congratulations! Your application was approved.",
    document: "signed-lease.pdf"
  },
  {
    id: "a2",
    property: "Sunset Gardens",
    unit: "Unit 402",
    status: "pending",
    date: "2025-04-01"
  },
  {
    id: "a3",
    property: "Oceanview Towers",
    unit: "Unit 18A",
    status: "rejected",
    date: "2025-02-15",
    comment: "Another applicant was selected."
  }
];

export function TenantApplications() {
  const [applications, setApplications] = useState<Application[]>(MOCK_APPLICATIONS);

  const handleWithdraw = (id: string) => {
    setApplications(applications.filter(app => app.id !== id));
  };

  return (
    <Card>
      <CardHeader className="bg-gradient-to-r from-secondary/40 to-background border-b mb-4">
        <CardTitle className="flex items-center gap-3">
          <FileText className="h-6 w-6 text-primary" />
          My Applications
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-7">
          {applications.length === 0 && (
            <div className="text-center text-muted-foreground p-6">No applications found.</div>
          )}
          {applications.map(app => (
            <div
              key={app.id}
              className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 border rounded-xl p-4 bg-muted/40 shadow-sm"
            >
              <div className="flex-1">
                <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-4">
                  <span className="font-semibold text-base">{app.property}</span>
                  <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full ml-1">{app.unit}</span>
                </div>
                <div className="flex gap-2 mt-2 items-center">
                  <Badge
                    variant={app.status === "approved" ? "default" : app.status === "pending" ? "outline" : "destructive"}
                    className={app.status === "approved" ? "bg-green-500 hover:bg-green-600 text-white" : ""}
                  >
                    {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                  </Badge>
                  <span className="text-xs text-muted-foreground">{app.date}</span>
                  {/* Status explainer */}
                  {app.status === "pending" && <span className="text-xs text-yellow-700 ml-3">Awaiting review</span>}
                  {app.status === "approved" && <span className="text-xs text-green-700 ml-3">You are having Active Lease!</span>}
                  {app.status === "rejected" && <span className="text-xs text-red-600 ml-3">Not selected</span>}
                </div>
                {/* Extra detail about process */}
                {app.status === "pending" && (
                  <div className="mt-1 text-xs text-muted-foreground">
                    Your application is in queue. You will receive an email when a decision is made.
                  </div>
                )}
                {/* Show property info (mock) */}
                <div className="mt-1 text-xs flex flex-wrap gap-5 text-muted-foreground">
                  <span>Lease : 12 months</span>
                  <span>Bedrooms : 2</span>
                  <span>Bathrooms : 2</span>
                  <span>Monthly Rent : KES 2,500</span>
                </div>
                {app.comment && <div className="mt-1 text-xs text-muted-foreground italic">{app.comment}</div>}
                {app.document && (
                  <div className="flex items-center gap-2 mt-1">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <a
                      href={`/${app.document}`}
                      className="underline text-primary"
                      download
                    >
                      Download Lease
                    </a>
                  </div>
                )}
              </div>
              <div className="flex gap-2 mt-3 md:mt-0">
                {app.status === "pending" && (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleWithdraw(app.id)}
                    >
                      Withdraw
                    </Button>
                    <Button variant="outline" size="sm">Edit</Button>
                  </>
                )}
                {app.status === "rejected" && <Button variant="outline" size="sm">Apply Again</Button>}
                {app.status === "approved" && app.document && (
                  <Button asChild variant="outline" size="sm">
                    <a href={`/${app.document}`} download>View Lease</a>
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

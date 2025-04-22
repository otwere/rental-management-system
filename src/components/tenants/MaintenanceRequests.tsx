
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";

interface MaintenanceRequest {
  id: number;
  date: string;
  issue: string;
  status: string;
  details?: string;
  rejectionReason?: string;
  attachmentUrl?: string; // Optional file URL
}

interface MaintenanceRequestsProps {
  requests: MaintenanceRequest[];
}

export function MaintenanceRequests({ requests }: MaintenanceRequestsProps) {
  const [allRequests, setAllRequests] = useState<MaintenanceRequest[]>(requests);
  const [selected, setSelected] = useState<MaintenanceRequest | null>(null);
  const [decision, setDecision] = useState<"approved" | "rejected" | null>(null);
  const [reason, setReason] = useState("");
  const [addDialog, setAddDialog] = useState(false);
  const [newIssue, setNewIssue] = useState("");
  const [newDetails, setNewDetails] = useState("");
  const [newFile, setNewFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  function handleAction(action: "approved" | "rejected") {
    setDecision(action);
  }

  function handleSubmit() {
    if (!selected) return;
    if (decision === "rejected" && !reason.trim()) {
      alert("Please provide a reason for rejection.");
      return;
    }
    // Simulate updating status in-memory
    setAllRequests(prev =>
      prev.map(r =>
        r.id === selected.id
          ? {
              ...r,
              status: decision === "approved" ? "completed" : "rejected",
              rejectionReason: decision === "rejected" ? reason : undefined,
            }
          : r
      )
    );
    setSelected(null);
    setDecision(null);
    setReason("");
  }

  function handleAddRequest() {
    if (!newIssue.trim()) {
      alert("Please describe the maintenance issue.");
      return;
    }
    const now = new Date();
    let attachmentUrl: string | undefined = undefined;
    // Rudimentary: just use preview URL for demo, not persisted
    if (newFile && previewUrl) {
      attachmentUrl = previewUrl;
    }
    setAllRequests([
      {
        id: Math.max(...allRequests.map(r=>r.id), 0)+1,
        date: now.toISOString().split("T")[0],
        issue: newIssue,
        status: "pending",
        details: newDetails,
        attachmentUrl,
      },
      ...allRequests,
    ]);
    setAddDialog(false);
    setNewIssue("");
    setNewDetails("");
    setNewFile(null);
    setPreviewUrl(null);
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    setNewFile(file || null);
    if (file) {
      const reader = new FileReader();
      reader.onload = (evt) => {
        setPreviewUrl(evt.target?.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setPreviewUrl(null);
    }
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Maintenance Requests</CardTitle>
        <Button variant="outline" onClick={() => setAddDialog(true)}>
          Add Request
        </Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Issue</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Attachment</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {allRequests.map((request) => (
              <TableRow key={request.id}>
                <TableCell>{request.date}</TableCell>
                <TableCell>{request.issue}</TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    request.status === 'completed'
                      ? 'bg-green-100 text-green-800'
                      : request.status === 'pending'
                      ? 'bg-yellow-100 text-yellow-800'
                      : request.status === 'rejected'
                      ? 'bg-red-100 text-red-700'
                      : 'bg-gray-100 text-gray-700'
                  }`}>
                    {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                  </span>
                </TableCell>
                <TableCell>
                  {request.attachmentUrl ? (
                    <a href={request.attachmentUrl} target="_blank" className="underline text-blue-600">View</a>
                  ) : (
                    <span className="text-muted-foreground">None</span>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="outline" size="sm" onClick={() => setSelected(request)}>
                    Details
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {/* Details Dialog */}
        <Dialog open={!!selected} onOpenChange={(v) => { if (!v) { setSelected(null); setDecision(null); setReason(""); } }}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {selected ? `${selected.issue} (${selected.date})` : "Request"}
              </DialogTitle>
              <DialogDescription>
                Request details and action options.
              </DialogDescription>
            </DialogHeader>
            <div className="mb-2">
              <div className="text-sm font-medium">Status:{" "}
                <span className="font-poppins">
                  {selected?.status}
                </span>
              </div>
              <div className="mt-1 text-muted-foreground text-sm">
                <span className="font-semibold">Details:</span> {selected?.details || "No further details"}
              </div>
              {selected?.attachmentUrl && (
                <div className="mt-2">
                  <span className="font-semibold">Attachment:</span>
                  <a href={selected.attachmentUrl} target="_blank" rel="noopener noreferrer" className="ml-2 underline text-blue-600">
                    View
                  </a>
                </div>
              )}
              {selected?.rejectionReason && (
                <div className="mt-2 text-sm text-red-500 font-semibold">
                  <span className="font-semibold">Rejection Reason:</span> {selected.rejectionReason}
                </div>
              )}
            </div>
            {selected && selected.status === "pending" && (
              <div>
                <div className="flex gap-3 mt-4">
                  <Button variant="default" onClick={() => handleAction("approved")}>
                    Approve
                  </Button>
                  <Button variant="destructive" onClick={() => handleAction("rejected")}>
                    Reject
                  </Button>
                </div>
                {decision === "rejected" && (
                  <Textarea
                    className="mt-3 w-full border rounded p-2 text-sm"
                    rows={2}
                    placeholder="Enter rejection reason"
                    value={reason}
                    onChange={e => setReason(e.target.value)}
                  />
                )}
                {decision && (
                  <DialogFooter>
                    <Button onClick={handleSubmit}>
                      Confirm {decision === "approved" ? "Approval" : "Rejection"}
                    </Button>
                  </DialogFooter>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>
        {/* Add Request Dialog */}
        <Dialog open={addDialog} onOpenChange={setAddDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>New Maintenance Request</DialogTitle>
              <DialogDescription>
                Fill details about the issue and attach a picture/document if needed.
              </DialogDescription>
            </DialogHeader>
            <form
              className="space-y-4"
              onSubmit={e => {
                e.preventDefault();
                handleAddRequest();
              }}
            >
              <div>
                <label className="block font-medium mb-1">Issue</label>
                <Input
                  value={newIssue}
                  onChange={e => setNewIssue(e.target.value)}
                  placeholder="e.g. Leaking faucet"
                  required
                />
              </div>
              <div>
                <label className="block font-medium mb-1">Details (optional)</label>
                <Textarea
                  value={newDetails}
                  onChange={e => setNewDetails(e.target.value)}
                  placeholder="Describe the problem in detail"
                  rows={3}
                />
              </div>
              <div>
                <label className="block font-medium mb-1">Attachment (optional)</label>
                <Input
                  type="file"
                  accept="image/*,application/pdf"
                  onChange={handleFileChange}
                />
                {previewUrl && (
                  <div className="mt-1">
                    <span className="text-xs">Preview:</span>
                    {newFile && newFile.type.startsWith("image") ? (
                      <img src={previewUrl} alt="Attachment preview" className="h-20 mt-1 rounded border" />
                    ) : (
                      <a href={previewUrl} target="_blank" rel="noopener noreferrer" className="underline text-green-700">Open file</a>
                    )}
                  </div>
                )}
              </div>
              <DialogFooter>
                <Button type="submit">Add Request</Button>
                <Button type="button" variant="outline" onClick={()=>setAddDialog(false)}>
                  Cancel
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}

// ... End of file.

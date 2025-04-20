
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface Violation {
  id: number;
  date: string;
  type: string;
  description: string;
  status: string;
  resolution?: string;
}

interface LeaseViolationsProps {
  violations: Violation[];
}

export function LeaseViolations({ violations }: LeaseViolationsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Lease Violations</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Resolution</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {violations.map((violation) => (
              <TableRow key={violation.id}>
                <TableCell>{violation.date}</TableCell>
                <TableCell>{violation.type}</TableCell>
                <TableCell>{violation.description}</TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    violation.status === 'resolved' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {violation.status}
                  </span>
                </TableCell>
                <TableCell>{violation.resolution || 'Pending'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

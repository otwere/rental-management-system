
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";
import { UnitInspectionReportModal } from "./UnitInspectionReportModal";

interface Inspection {
  id: number;
  date: string;
  type: string;
  status: string;
  findings?: string;
}

interface UnitInspectionsProps {
  inspections: Inspection[];
}

export function UnitInspections({ inspections }: UnitInspectionsProps) {
  const [selectedInspection, setSelectedInspection] = useState<Inspection | null>(null);

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Unit Inspections</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Findings</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {inspections.map((inspection) => (
                <TableRow key={inspection.id}>
                  <TableCell>{inspection.date}</TableCell>
                  <TableCell>{inspection.type}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      inspection.status === 'passed' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {inspection.status}
                    </span>
                  </TableCell>
                  <TableCell>{inspection.findings || 'No issues found'}</TableCell>
                  <TableCell className="text-right">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setSelectedInspection(inspection)}
                    >
                      <FileText className="h-4 w-4 mr-2" />
                      View Report
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {selectedInspection && (
        <UnitInspectionReportModal
          open={true}
          onClose={() => setSelectedInspection(null)}
          inspection={selectedInspection}
        />
      )}
    </>
  );
}

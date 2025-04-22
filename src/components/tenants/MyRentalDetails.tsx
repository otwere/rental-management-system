import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useState } from "react";
import { RequestLeaseRenewalDialog } from "./RequestLeaseRenewalDialog";
import { RequestEarlyTerminationDialog } from "./RequestEarlyTerminationDialog";
import { Printer, FileText } from "lucide-react";

// Demo property image placeholder
const demoImage = "/placeholder.svg";

export function MyRentalDetails() {
  // Mock data — in a real app, fetch from backend
  const rental = {
    property: "Modern Downtown Apartment",
    address: "Roysambu Main Home APP, Nairobi County",
    leaseStart: "2024-05-01",
    leaseEnd: "2026-04-30",
    bedrooms: 2,
    bathrooms: 2,
    size: 1200,
    floor: 7,
    unit: "7B",
    balcony: true,
    parking: true,
    furnished: false,
    petPolicy: "Pets allowed with deposit",
    amenities: [
      "Gym", "Rooftop Lounge", "Washer/Dryer", "Secure Entry",
      "Storage Locker", "Bike Storage", "EV Charging", "Pool", "Business Center"
    ],
    status: "active",
    paymentSchedule: "Monthly",
    monthlyRent: 2500,
    deposit: 2500,
    lastPaid: "2025-04-01",
    nextDue: "2025-05-01",
    paymentMethod: "Online Payment",
    balance: 0,
    documents: [
      { label: "Lease Agreement", file: "lease-agreement.pdf" },
      { label: "Move-in Inspection", file: "inspection.pdf" },
      { label: "Building Rules", file: "rules.pdf" }
    ],
    agent: {
      name: "Pauline Mercy",
      email: "pauline.mercy@estate.com",
      phone: "(555) 123-4567",
      photo: demoImage
    },
    utilitiesIncluded: ["Water", "Trash", "Sewer"],
    utilitiesNotIncluded: ["Electric", "Internet", "Gas"],
    moveInDate: "2024-05-05",
    customNotes: "Door code: 2043. Parcel deliveries left at reception. Lockbox for emergency key in utility room. Guest parking pass: ask agent.",
    description: "This stunning, modern apartment features panoramic downtown views with floor-to-ceiling windows, luxury appliances, walk-in closets, and private balcony. Residents enjoy robust amenities including a secured lobby, coworking lounge, pool, and more.",
    listingFeatures: [
      "Spacious living & dining area",
      "Floor-to-ceiling windows with city view",
      "Granite kitchen countertops",
      "Smart home thermostats",
      "Walk-in closet in primary bedroom",
      "Pet-friendly community",
      "On-site management"
    ]
  };

  const leaseProgress = 45; // calculated in real app
  const today = new Date();
  const daysToDue = Math.ceil((new Date(rental.nextDue).getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  const [showAllDocs, setShowAllDocs] = useState(false);

  // Dialog states for requests
  const [showRenewal, setShowRenewal] = useState(false);
  const [showEarlyEnd, setShowEarlyEnd] = useState(false);

  return (
    <Card className="overflow-hidden shadow-lg border-2 border-border bg-card">
      {/* Modern Listing Header */}
      <CardHeader className="bg-gradient-to-bl from-secondary/30 to-background py-5 px-8 flex flex-col md:flex-row gap-6 border-b items-center">
        <img src={demoImage} alt="Property" className="rounded-xl shadow-lg w-36 h-36 object-cover border bg-muted" />
        <div className="flex-1">
          <CardTitle className="text-3xl mb-1 font-bold flex gap-2 items-center">{rental.property}
            <span className="ml-2 px-4 py-1 rounded-full bg-green-100 text-green-700 font-medium text-xs shadow border">{rental.status === "active" ? "Active Lease" : rental.status}</span>
          </CardTitle>
          <div className="text-lg text-muted-foreground mb-1 font-semibold">{rental.address}</div>
          <div className="text-base text-primary font-semibold">Unit {rental.unit} &middot; Floor {rental.floor} &middot; {rental.size} sq ft</div>
          <div className="mt-2 text-sm text-muted-foreground max-w-xl">{rental.description}</div>
        </div>
      </CardHeader>
      <CardContent className="pt-6 pb-1 px-8">
        <div className="flex flex-col lg:flex-row gap-10">
          {/* Left: Listing Details */}
          <div className="flex-1 min-w-0">
            {/* Listing Features */}
            <div className="mb-5">
              <div className="font-semibold mb-2 text-lg">Key Features</div>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-1 list-[square] ml-6 text-sm">
                {rental.listingFeatures.map((feat, idx) => (
                  <li key={idx}>{feat}</li>
                ))}
              </ul>
            </div>
            {/* Lease Facts */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-base mb-6">
              <div>
                <span className="text-muted-foreground">Lease Start</span>
                <div className="font-semibold">{rental.leaseStart}</div>
              </div>
              <div>
                <span className="text-muted-foreground">Lease End</span>
                <div className="font-semibold">{rental.leaseEnd}</div>
              </div>
              <div>
                <span className="text-muted-foreground">Move-in Date</span>
                <div className="font-semibold">{rental.moveInDate}</div>
              </div>
              <div>
                <span className="text-muted-foreground">Bedrooms</span>
                <div className="font-semibold">{rental.bedrooms}</div>
              </div>
              <div>
                <span className="text-muted-foreground">Bathrooms</span>
                <div className="font-semibold">{rental.bathrooms}</div>
              </div>
              <div>
                <span className="text-muted-foreground">Furnished</span>
                <div className="font-semibold">{rental.furnished ? "Yes" : "No"}</div>
              </div>
              <div>
                <span className="text-muted-foreground">Balcony</span>
                <div className="font-semibold">{rental.balcony ? "Yes" : "No"}</div>
              </div>
              <div>
                <span className="text-muted-foreground">Parking</span>
                <div className="font-semibold">{rental.parking ? "Yes" : "No"}</div>
              </div>
              <div>
                <span className="text-muted-foreground">Pet Policy</span>
                <div className="font-semibold">{rental.petPolicy}</div>
              </div>
              <div>
                <span className="text-muted-foreground">Payment</span>
                <div className="font-semibold">${rental.monthlyRent}/mo</div>
              </div>
              <div>
                <span className="text-muted-foreground">Deposit</span>
                <div className="font-semibold">${rental.deposit}</div>
              </div>
              <div>
                <span className="text-muted-foreground">Payment Schedule</span>
                <div className="font-semibold">{rental.paymentSchedule}</div>
              </div>
            </div>
            {/* Amenities */}
            <div className="mb-4">
              <div className="font-medium text-base mb-1">Amenities</div>
              <div className="flex flex-wrap gap-2">
                {rental.amenities.map(am => (
                  <span key={am} className="px-2 py-0.5 rounded bg-muted border text-xs">{am}</span>
                ))}
              </div>
            </div>
            {/* Utilities */}
            <div className="flex gap-6 mb-4">
              <div>
                <div className="text-xs text-muted-foreground">Utilities Included</div>
                <div className="flex flex-wrap gap-1 mt-1">
                  {rental.utilitiesIncluded.map(ut => (
                    <span key={ut} className="bg-gray-50 px-2 py-0.5 rounded text-xs text-green-700">{ut}</span>
                  ))}
                </div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground">Utilities Not Included</div>
                <div className="flex flex-wrap gap-1 mt-1">
                  {rental.utilitiesNotIncluded.map(ut => (
                    <span key={ut} className="bg-red-100 text-red-700 px-2 py-0.5 rounded text-xs">{ut}</span>
                  ))}
                </div>
              </div>
            </div>
            <div className="mb-2">
              <div className="text-xs text-muted-foreground">Custom Notes</div>
              <div className="text-xs py-2">{rental.customNotes}</div>
            </div>
          </div>
          {/* Right: At a Glance Section */}
          <div className="lg:w-[350px] flex-none bg-muted border rounded-xl px-6 py-6 shadow-md h-fit">
            <div className="space-y-5">
              <div>
                <div className="text-xs text-muted-foreground">Next Rent Due</div>
                <div className="font-medium">{rental.nextDue} <span className="ml-2 text-xs text-muted-foreground">({daysToDue} days)</span></div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground">Monthly Rent</div>
                <div className="font-medium">${rental.monthlyRent}</div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground">Deposit Paid</div>
                <div className="font-medium">${rental.deposit}</div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground">Last Paid</div>
                <div className="font-medium">{rental.lastPaid}</div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground">Current Balance</div>
                <div className={`font-semibold ${rental.balance === 0 ? "text-green-600" : "text-red-600"}`}>${rental.balance}</div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground">Payment Method</div>
                <div className="font-medium">{rental.paymentMethod}</div>
              </div>
              <div className="mt-3">
                <div className="text-xs text-muted-foreground mb-1">Lease Progress</div>
                <div className="flex items-center gap-2">
                  <Progress value={leaseProgress} className="h-1.5 flex-1 rounded-full bg-gray-300" />
                  <span className="text-xs font-semibold">{leaseProgress}%</span>
                </div>
              </div>
            </div>
            {/* Agent info */}
            <div className="border-t pt-4 mt-6">
              <div className="flex gap-3 items-center">
                <img src={rental.agent.photo} alt="Agent" className="w-10 h-10 rounded-full border" />
                <div>
                  <div className="font-medium">{rental.agent.name}</div>
                  <a href={`mailto:${rental.agent.email}`} className="text-primary underline text-xs">{rental.agent.email}</a>
                  <div className="text-xs">
                    <a href={`tel:${rental.agent.phone}`}>{rental.agent.phone}</a>
                  </div>
                </div>
              </div>
              <Button variant="ghost" size="sm" className="mt-3 w-full">Message Agent</Button>
            </div>
          </div>
        </div>
        {/* Documents */}
        <div className="mt-7 border-t pt-6">
          <div className="flex items-center gap-2 mb-2">
            <FileText className="h-5 w-5 text-primary" />
            <span className="font-semibold text-xl">Rental Documents</span>
          </div>
          <ul className="list-none mt-1 space-y-2">
            {rental.documents.slice(0, showAllDocs ? undefined : 2).map(doc => (
              <li key={doc.file} className="flex items-center gap-3 bg-muted/50 px-3 py-2 rounded-lg">
                <FileText className="h-4 w-4 text-muted-foreground" />
                <span className="flex-1 text-base">{doc.label}</span>
                <Button asChild size="sm" variant="outline"><a href={`/${doc.file}`} download>Download</a></Button>
              </li>
            ))}
          </ul>
          {rental.documents.length > 2 && (
            <Button
              variant="ghost"
              size="sm"
              className="mt-2"
              onClick={() => setShowAllDocs(v => !v)}
            >
              {showAllDocs ? "Show less" : "Show all"}
            </Button>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex flex-col sm:flex-row sm:justify-end gap-3 px-8 py-5 border-t bg-gradient-to-r from-secondary/20 to-background">
        <Button variant="outline" onClick={() => setShowRenewal(true)}>
          Request Lease Renewal
        </Button>
        <Button variant="outline" onClick={() => setShowEarlyEnd(true)}>
          Request Early Termination
        </Button>
        <Button variant="default">
          <Printer className="h-4 w-4 mr-1" />
          Download Statement
        </Button>
      </CardFooter>
      {/* Dialogs: Lease Renewal & Early Termination */}
      <RequestLeaseRenewalDialog
        open={showRenewal}
        onClose={() => setShowRenewal(false)}
        rentalDetails={{
          property: rental.property,
          leaseStart: rental.leaseStart,
          leaseEnd: rental.leaseEnd,
          monthlyRent: rental.monthlyRent,
          unit: rental.unit,
          address: rental.address
        }}
      />
      <RequestEarlyTerminationDialog
        open={showEarlyEnd}
        onClose={() => setShowEarlyEnd(false)}
        rentalDetails={{
          property: rental.property,
          leaseStart: rental.leaseStart,
          leaseEnd: rental.leaseEnd,
          monthlyRent: rental.monthlyRent,
          unit: rental.unit,
          address: rental.address
        }}
      />
    </Card>
  );
}

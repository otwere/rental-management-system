"use client"

import { DashboardLayout } from "@/components/layout/DashboardLayout"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import {
  FileText,
  MessageSquare,
  Settings,
  CheckCircle,
  ChevronDown,
  Home,
  Calendar,
  Building,
  CreditCard,
  User,
  Dumbbell,
  Droplet,
  UserCircle,
  AlertCircle,
} from "lucide-react"
import { useState } from "react"
import { TenantMaintenanceRequestModal } from "@/components/tenants/TenantMaintenanceRequestModal"
import { TenantPaymentModal } from "@/components/tenants/TenantPaymentModal"
import { TenantContactSupportModal } from "@/components/tenants/TenantContactSupportModal"
import { TenantRentalDetailsModal } from "@/components/tenants/TenantRentalDetailsModal"
// First, add new imports for the modal components at the top of the file
import { TenantLeaseRenewalModal } from "@/components/tenants/TenantLeaseRenewalModal"
import { TenantLeaseTerminationModal } from "@/components/tenants/TenantLeaseTerminationModal"

export default function TenantDashboard() {
  const nextPayment = {
    amount: 2500,
    dueDate: new Date("2025-05-01"),
    status: "upcoming",
  }

  const daysUntilDue = Math.ceil((nextPayment.dueDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))

  const leaseEndDate = new Date("2026-04-30")
  const leaseEndingIn = Math.ceil((leaseEndDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
  const leaseProgress = 100 - Math.round((leaseEndingIn / 365) * 100)

  const maintenanceRequests = [
    {
      id: 1,
      title: "Leaking faucet in bathroom",
      status: "scheduled",
      scheduledDate: "Tomorrow, 10:00 AM",
      reportedDate: "3 days ago",
    },
  ]

  const [maintenanceModal, setMaintenanceModal] = useState(false)
  const [paymentModal, setPaymentModal] = useState(false)
  const [supportModal, setSupportModal] = useState(false)
  const [rentalDetailsModal, setRentalDetailsModal] = useState(false)
  // Add new state variables for the modals in the component
  const [renewalModal, setRenewalModal] = useState(false)
  const [terminationModal, setTerminationModal] = useState(false)
  const [renewalStatus, setRenewalStatus] = useState<"none" | "pending" | "approved" | "rejected">("none")
  const [terminationStatus, setTerminationStatus] = useState<"none" | "pending" | "approved" | "rejected">("none")
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    tenantDetails: true, // Open by default
    keyFeatures: true, // Open by default
    leaseDetails: false,
    propertyDetails: false,
    paymentInfo: false,
    amenities: false,
    utilities: false,
    notes: false,
    agent: false,
  })

  const toggleSection = (sectionId: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }))
  }

  return (
    <DashboardLayout requiredPermission="view:dashboard">
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Tenant Dashboard</h1>

        <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            {/* Tenant Details Section */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-xl">Tenant Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="border rounded-lg overflow-hidden">
                  <div
                    className="flex items-center justify-between p-4 bg-muted/50 cursor-pointer"
                    onClick={() => toggleSection("tenantDetails")}
                  >
                    <div className="flex items-center gap-2">
                      <UserCircle className="h-5 w-5 text-primary" />
                      <h3 className="font-medium">Tenant Details</h3>
                    </div>
                    <ChevronDown
                      className={`h-5 w-5 transition-transform ${expandedSections.tenantDetails ? "rotate-180" : ""}`}
                    />
                  </div>
                  {expandedSections.tenantDetails && (
                    <div className="p-4 border-t">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <div className="mb-4">
                            <p className="text-sm text-muted-foreground">Primary Tenant</p>
                            <p className="font-medium">John Doe</p>
                          </div>
                          <div className="mb-4">
                            <p className="text-sm text-muted-foreground">Email</p>
                            <p className="font-medium">john.doe@example.com</p>
                          </div>
                          <div className="mb-4">
                            <p className="text-sm text-muted-foreground">Phone</p>
                            <p className="font-medium">(555) 987-6543</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Emergency Contact</p>
                            <p className="font-medium">Jane Doe - (555) 123-4567</p>
                          </div>
                        </div>
                        <div>
                          <div className="mb-4">
                            <p className="text-sm text-muted-foreground">Additional Occupants</p>
                            <p className="font-medium">Sarah Doe</p>
                          </div>
                          <div className="mb-4">
                            <p className="text-sm text-muted-foreground">Pets</p>
                            <p className="font-medium">1 cat (Whiskers)</p>
                          </div>
                          <div className="mb-4">
                            <p className="text-sm text-muted-foreground">Vehicles</p>
                            <p className="font-medium">Toyota Camry - ABC 123</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Tenant ID</p>
                            <p className="font-medium">TEN-2024-0042</p>
                          </div>
                        </div>
                      </div>
                      <div className="mt-4 flex justify-end">
                        <Button variant="outline" size="sm">
                          Update Information
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Property Details with Toggle Sections */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-xl">Modern Downtown Apartment</CardTitle>
                <p className="text-muted-foreground">Roysambu Main Home APT, Nairobi County</p>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Key Features Section */}
                <div className="border rounded-lg overflow-hidden">
                  <div
                    className="flex items-center justify-between p-4 bg-muted/50 cursor-pointer"
                    onClick={() => toggleSection("keyFeatures")}
                  >
                    <div className="flex items-center gap-2">
                      <Home className="h-5 w-5 text-primary" />
                      <h3 className="font-medium">Key Features</h3>
                    </div>
                    <ChevronDown
                      className={`h-5 w-5 transition-transform ${expandedSections.keyFeatures ? "rotate-180" : ""}`}
                    />
                  </div>
                  {expandedSections.keyFeatures && (
                    <div className="p-4 border-t">
                      <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        <li className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-primary" />
                          <span className="text-sm">Spacious living & dining area</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-primary" />
                          <span className="text-sm">Floor-to-ceiling windows with city view</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-primary" />
                          <span className="text-sm">Granite kitchen countertops</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-primary" />
                          <span className="text-sm">Smart home thermostats</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-primary" />
                          <span className="text-sm">Walk-in closet in primary bedroom</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-primary" />
                          <span className="text-sm">Pet-friendly community</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-primary" />
                          <span className="text-sm">On-site management</span>
                        </li>
                      </ul>
                    </div>
                  )}
                </div>

                {/* Lease Details Section */}
                <div className="border rounded-lg overflow-hidden">
                  <div
                    className="flex items-center justify-between p-4 bg-muted/50 cursor-pointer"
                    onClick={() => toggleSection("leaseDetails")}
                  >
                    <div className="flex items-center gap-2">
                      <Calendar className="h-5 w-5 text-primary" />
                      <h3 className="font-medium">Lease Details</h3>
                    </div>
                    <ChevronDown
                      className={`h-5 w-5 transition-transform ${expandedSections.leaseDetails ? "rotate-180" : ""}`}
                    />
                  </div>
                  {expandedSections.leaseDetails && (
                    <div className="p-4 border-t">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <p className="text-sm text-muted-foreground">Lease Start</p>
                          <p className="font-medium">2024-05-01</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Lease End</p>
                          <p className="font-medium">2026-04-30</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Move-in Date</p>
                          <p className="font-medium">2024-05-05</p>
                        </div>
                      </div>

                      <div className="mt-4">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm">Lease Progress</span>
                          <span className="text-sm font-medium">45%</span>
                        </div>
                        <Progress value={45} className="h-2" />
                        <p className="text-xs text-muted-foreground mt-1">
                          {leaseEndingIn} days remaining on your lease
                        </p>
                      </div>

                      {/* Lease Renewal and Termination Information */}
                      <div className="mt-6 space-y-4">
                        <div className="bg-muted rounded-lg p-4">
                          <div className="flex justify-between items-start">
                            <h4 className="font-medium mb-2 flex items-center">
                              <AlertCircle className="h-4 w-4 mr-2 text-primary" />
                              Lease Renewal
                            </h4>
                            {renewalStatus !== "none" && (
                              <span
                                className={`text-xs px-2 py-1 rounded-full ${
                                  renewalStatus === "pending"
                                    ? "bg-yellow-100 text-yellow-800"
                                    : renewalStatus === "approved"
                                      ? "bg-green-100 text-green-800"
                                      : "bg-red-100 text-red-800"
                                }`}
                              >
                                {renewalStatus === "pending"
                                  ? "Request Pending"
                                  : renewalStatus === "approved"
                                    ? "Request Approved"
                                    : "Request Declined"}
                              </span>
                            )}
                          </div>
                          <p className="text-sm">
                            Your lease renewal window opens 90 days before your lease end date (January 31, 2026).
                          </p>
                          <p className="text-sm mt-1">
                            Renewal options will be sent to your email and available in your tenant portal.
                          </p>
                          <div className="mt-3 flex flex-wrap gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setRenewalModal(true)}
                              disabled={renewalStatus === "pending" || renewalStatus === "approved"}
                            >
                              Request Early Renewal
                            </Button>
                            <Button variant="ghost" size="sm">
                              View Renewal Policy
                            </Button>
                          </div>
                        </div>

                        <div className="bg-muted rounded-lg p-4">
                          <div className="flex justify-between items-start">
                            <h4 className="font-medium mb-2 flex items-center">
                              <AlertCircle className="h-4 w-4 mr-2 text-primary" />
                              Lease Termination
                            </h4>
                            {terminationStatus !== "none" && (
                              <span
                                className={`text-xs px-2 py-1 rounded-full ${
                                  terminationStatus === "pending"
                                    ? "bg-yellow-100 text-yellow-800"
                                    : terminationStatus === "approved"
                                      ? "bg-green-100 text-green-800"
                                      : "bg-red-100 text-red-800"
                                }`}
                              >
                                {terminationStatus === "pending"
                                  ? "Request Pending"
                                  : terminationStatus === "approved"
                                    ? "Request Approved"
                                    : "Request Declined"}
                              </span>
                            )}
                          </div>
                          <p className="text-sm">A 60-day written notice is required for lease termination.</p>
                          <p className="text-sm mt-1">
                            Early termination fee: 2 months' rent plus forfeiture of security deposit.
                          </p>
                          <div className="mt-3 flex flex-wrap gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setTerminationModal(true)}
                              disabled={terminationStatus === "pending" || terminationStatus === "approved"}
                            >
                              Request Termination
                            </Button>
                            <Button variant="ghost" size="sm">
                              View Termination Policy
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Property Details Section */}
                <div className="border rounded-lg overflow-hidden">
                  <div
                    className="flex items-center justify-between p-4 bg-muted/50 cursor-pointer"
                    onClick={() => toggleSection("propertyDetails")}
                  >
                    <div className="flex items-center gap-2">
                      <Building className="h-5 w-5 text-primary" />
                      <h3 className="font-medium">Property Details</h3>
                    </div>
                    <ChevronDown
                      className={`h-5 w-5 transition-transform ${expandedSections.propertyDetails ? "rotate-180" : ""}`}
                    />
                  </div>
                  {expandedSections.propertyDetails && (
                    <div className="p-4 border-t">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                          <p className="text-sm text-muted-foreground">Bedrooms</p>
                          <p className="font-medium">2</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Bathrooms</p>
                          <p className="font-medium">2</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Furnished</p>
                          <p className="font-medium">No</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Balcony</p>
                          <p className="font-medium">Yes</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Parking</p>
                          <p className="font-medium">Yes</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Pet Policy</p>
                          <p className="font-medium">Pets allowed with deposit</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Payment Information Section */}
                <div className="border rounded-lg overflow-hidden">
                  <div
                    className="flex items-center justify-between p-4 bg-muted/50 cursor-pointer"
                    onClick={() => toggleSection("paymentInfo")}
                  >
                    <div className="flex items-center gap-2">
                      <CreditCard className="h-5 w-5 text-primary" />
                      <h3 className="font-medium">Payment Information</h3>
                    </div>
                    <ChevronDown
                      className={`h-5 w-5 transition-transform ${expandedSections.paymentInfo ? "rotate-180" : ""}`}
                    />
                  </div>
                  {expandedSections.paymentInfo && (
                    <div className="p-4 border-t">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <p className="text-sm text-muted-foreground">Payment</p>
                          <p className="font-medium">$2500/mo</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Deposit</p>
                          <p className="font-medium">$2500</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Payment Schedule</p>
                          <p className="font-medium">Monthly</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Next Rent Due</p>
                          <p className="font-medium">2025-05-01 (9 days)</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Last Paid</p>
                          <p className="font-medium">2025-04-01</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Current Balance</p>
                          <p className="font-medium">$0</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Payment Method</p>
                          <p className="font-medium">Online Payment</p>
                        </div>
                      </div>
                      <div className="mt-4">
                        <Button onClick={() => setPaymentModal(true)}>Make Payment</Button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Amenities Section */}
                <div className="border rounded-lg overflow-hidden">
                  <div
                    className="flex items-center justify-between p-4 bg-muted/50 cursor-pointer"
                    onClick={() => toggleSection("amenities")}
                  >
                    <div className="flex items-center gap-2">
                      <Dumbbell className="h-5 w-5 text-primary" />
                      <h3 className="font-medium">Amenities</h3>
                    </div>
                    <ChevronDown
                      className={`h-5 w-5 transition-transform ${expandedSections.amenities ? "rotate-180" : ""}`}
                    />
                  </div>
                  {expandedSections.amenities && (
                    <div className="p-4 border-t">
                      <ul className="grid grid-cols-2 md:grid-cols-3 gap-2">
                        <li className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-primary" />
                          <span className="text-sm">Gym</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-primary" />
                          <span className="text-sm">Rooftop Lounge</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-primary" />
                          <span className="text-sm">Washer/Dryer</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-primary" />
                          <span className="text-sm">Secure Entry</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-primary" />
                          <span className="text-sm">Storage Locker</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-primary" />
                          <span className="text-sm">Bike Storage</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-primary" />
                          <span className="text-sm">EV Charging</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-primary" />
                          <span className="text-sm">Pool</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-primary" />
                          <span className="text-sm">Business Center</span>
                        </li>
                      </ul>
                    </div>
                  )}
                </div>

                {/* Utilities Section */}
                <div className="border rounded-lg overflow-hidden">
                  <div
                    className="flex items-center justify-between p-4 bg-muted/50 cursor-pointer"
                    onClick={() => toggleSection("utilities")}
                  >
                    <div className="flex items-center gap-2">
                      <Droplet className="h-5 w-5 text-primary" />
                      <h3 className="font-medium">Utilities</h3>
                    </div>
                    <ChevronDown
                      className={`h-5 w-5 transition-transform ${expandedSections.utilities ? "rotate-180" : ""}`}
                    />
                  </div>
                  {expandedSections.utilities && (
                    <div className="p-4 border-t">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="font-medium mb-2">Utilities Included</h4>
                          <ul className="space-y-1">
                            <li className="flex items-center gap-2">
                              <CheckCircle className="h-4 w-4 text-primary" />
                              <span className="text-sm">Water</span>
                            </li>
                            <li className="flex items-center gap-2">
                              <CheckCircle className="h-4 w-4 text-primary" />
                              <span className="text-sm">Trash</span>
                            </li>
                            <li className="flex items-center gap-2">
                              <CheckCircle className="h-4 w-4 text-primary" />
                              <span className="text-sm">Sewer</span>
                            </li>
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-medium mb-2">Utilities Not Included</h4>
                          <ul className="space-y-1">
                            <li className="flex items-center gap-2">
                              <CheckCircle className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm">Electric</span>
                            </li>
                            <li className="flex items-center gap-2">
                              <CheckCircle className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm">Internet</span>
                            </li>
                            <li className="flex items-center gap-2">
                              <CheckCircle className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm">Gas</span>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Custom Notes Section */}
                <div className="border rounded-lg overflow-hidden">
                  <div
                    className="flex items-center justify-between p-4 bg-muted/50 cursor-pointer"
                    onClick={() => toggleSection("notes")}
                  >
                    <div className="flex items-center gap-2">
                      <FileText className="h-5 w-5 text-primary" />
                      <h3 className="font-medium">Custom Notes</h3>
                    </div>
                    <ChevronDown
                      className={`h-5 w-5 transition-transform ${expandedSections.notes ? "rotate-180" : ""}`}
                    />
                  </div>
                  {expandedSections.notes && (
                    <div className="p-4 border-t">
                      <p className="text-sm">
                        Door code: 2043. Parcel deliveries left at reception. Lockbox for emergency key in utility room.
                        Guest parking pass: ask agent.
                      </p>
                    </div>
                  )}
                </div>

                {/* Agent Information Section */}
                <div className="border rounded-lg overflow-hidden">
                  <div
                    className="flex items-center justify-between p-4 bg-muted/50 cursor-pointer"
                    onClick={() => toggleSection("agent")}
                  >
                    <div className="flex items-center gap-2">
                      <User className="h-5 w-5 text-primary" />
                      <h3 className="font-medium">Agent Information</h3>
                    </div>
                    <ChevronDown
                      className={`h-5 w-5 transition-transform ${expandedSections.agent ? "rotate-180" : ""}`}
                    />
                  </div>
                  {expandedSections.agent && (
                    <div className="p-4 border-t">
                      <div className="flex flex-col md:flex-row md:items-center gap-4">
                        <div className="flex-1">
                          <h4 className="font-medium">Pauline Mercy</h4>
                          <p className="text-sm text-muted-foreground">pauline.mercy@estate.com</p>
                          <p className="text-sm text-muted-foreground">(555) 123-4567</p>
                        </div>
                        <Button onClick={() => setSupportModal(true)}>
                          <MessageSquare className="h-4 w-4 mr-2" />
                          Message Agent
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">Maintenance Requests</CardTitle>
                </CardHeader>
                <CardContent>
                  {maintenanceRequests.length > 0 ? (
                    <ul className="space-y-4">
                      {maintenanceRequests.map((request) => (
                        <li key={request.id} className="flex items-start gap-3">
                          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                            <Settings className="h-4 w-4" />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium">{request.title}</p>
                            <div className="flex items-center mt-1">
                              <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                                {request.status === "scheduled" ? "Scheduled" : request.status}
                              </span>
                              <span className="text-xs text-muted-foreground ml-2">
                                Reported {request.reportedDate}
                              </span>
                            </div>
                            {request.status === "scheduled" && (
                              <p className="text-xs text-muted-foreground mt-1">
                                Service scheduled for {request.scheduledDate}
                              </p>
                            )}
                          </div>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="text-center py-6">
                      <CheckCircle className="h-12 w-12 mx-auto text-muted-foreground/50" />
                      <p className="mt-2 text-muted-foreground">No active maintenance requests</p>
                    </div>
                  )}
                </CardContent>
                <CardFooter className="border-t pt-4">
                  <Button className="w-full" onClick={() => setMaintenanceModal(true)}>
                    Submit New Request
                  </Button>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">Documents</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    <li className="flex items-center justify-between p-2 rounded-lg hover:bg-muted">
                      <div className="flex items-center gap-2">
                        <FileText className="h-5 w-5 text-muted-foreground" />
                        <span className="text-sm">Lease Agreement</span>
                      </div>
                      <Button variant="ghost" size="sm">
                        View
                      </Button>
                    </li>
                    <li className="flex items-center justify-between p-2 rounded-lg hover:bg-muted">
                      <div className="flex items-center gap-2">
                        <FileText className="h-5 w-5 text-muted-foreground" />
                        <span className="text-sm">Building Rules</span>
                      </div>
                      <Button variant="ghost" size="sm">
                        View
                      </Button>
                    </li>
                    <li className="flex items-center justify-between p-2 rounded-lg hover:bg-muted">
                      <div className="flex items-center gap-2">
                        <FileText className="h-5 w-5 text-muted-foreground" />
                        <span className="text-sm">Move-in Inspection</span>
                      </div>
                      <Button variant="ghost" size="sm">
                        View
                      </Button>
                    </li>
                  </ul>
                </CardContent>
                <CardFooter className="border-t pt-4">
                  <Button variant="outline" className="w-full">
                    All Documents
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>

          <div className="lg:col-span-1 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Next Rent Payment</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-4">
                  <div className="text-xl font-bold">KES {nextPayment.amount}</div>
                  <p className="text-muted-foreground">Due in {daysUntilDue} days</p>

                  <div className="mt-6 space-y-2">
                    <div className="bg-primary/10 rounded-lg p-3">
                      <p className="text-sm">Next Payment Date</p>
                      <p className="font-medium">May 1, 2025</p>
                    </div>

                    <div className="bg-muted rounded-lg p-3">
                      <p className="text-sm">Payment Method</p>
                      <p className="font-medium">Online Payment</p>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="border-t pt-4">
                <Button className="w-full" onClick={() => setPaymentModal(true)}>
                  Make Payment
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Payment History</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-center justify-between p-2 rounded-lg hover:bg-muted">
                    <div>
                      <p className="text-sm font-medium">April 2025</p>
                      <p className="text-xs text-muted-foreground">Paid on Apr 1, 2025</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">KES 2,500</span>
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    </div>
                  </li>
                  <li className="flex items-center justify-between p-2 rounded-lg hover:bg-muted">
                    <div>
                      <p className="text-sm font-medium">March 2025</p>
                      <p className="text-xs text-muted-foreground">Paid on Mar 1, 2025</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">KES 2,500</span>
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    </div>
                  </li>
                  <li className="flex items-center justify-between p-2 rounded-lg hover:bg-muted">
                    <div>
                      <p className="text-sm font-medium">February 2025</p>
                      <p className="text-xs text-muted-foreground">Paid on Feb 1, 2025</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">KES 2,500</span>
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    </div>
                  </li>
                </ul>
              </CardContent>
              <CardFooter className="border-t pt-4">
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => (window.location.href = "/tenant/payments")}
                >
                  View All Payments
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-xl">Need Help?</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-4">
                  <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground/50" />
                  <h3 className="mt-2 font-medium">Have questions or issues?</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Contact your property manager for assistance with your rental.
                  </p>
                  <Button className="mt-4 w-full" onClick={() => setSupportModal(true)}>
                    Contact Support
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <TenantMaintenanceRequestModal open={maintenanceModal} onClose={() => setMaintenanceModal(false)} />
      <TenantPaymentModal open={paymentModal} onClose={() => setPaymentModal(false)} />
      <TenantContactSupportModal open={supportModal} onClose={() => setSupportModal(false)} />
      <TenantRentalDetailsModal open={rentalDetailsModal} onClose={() => setRentalDetailsModal(false)} />
      <TenantLeaseRenewalModal
        open={renewalModal}
        onClose={() => setRenewalModal(false)}
        onSubmit={() => {
          setRenewalModal(false)
          setRenewalStatus("pending")
        }}
      />
      <TenantLeaseTerminationModal
        open={terminationModal}
        onClose={() => setTerminationModal(false)}
        onSubmit={() => {
          setTerminationModal(false)
          setTerminationStatus("pending")
        }}
      />
    </DashboardLayout>
  )
}

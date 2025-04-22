
export interface Address {
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

export interface TenantApplication {
  id: string;
  name: string;
  email: string;
  phone: string;
  income: number;
  status: "pending" | "approved" | "rejected";
  submissionDate: string;
  documents: string[];
  notes?: string;
  unitId?: string; // Reference to the unit they're applying for
}

export interface Unit {
  id: string;
  number: string;
  floor: number;
  price: number;
  type: "studio" | "1bedroom" | "2bedroom" | "3bedroom" | "penthouse";
  status: "available" | "rented" | "maintenance" | "reserved";
  size: number; // in square feet
  bedrooms: number;
  bathrooms: number;
  features: string[];
  description?: string;
  tenantId?: string; // ID of the assigned tenant, if any
  leaseStart?: string;
  leaseEnd?: string;
  applications?: TenantApplication[]; // Applications for this unit
}

export interface Property {
  id: string;
  title: string;
  type: "apartment" | "house" | "condo" | "townhouse";
  address: Address;
  totalFloors: number;
  totalUnits: number;
  amenities: string[];
  description: string;
  yearBuilt: number;
  parkingAvailable: boolean;
  units: Unit[];
  status?: "available" | "rented" | "maintenance"; // Optional status for filtering
  applications?: TenantApplication[]; // Applications for the entire property
}

// Mock data for properties
export const MOCK_PROPERTIES: Property[] = [
  {
    id: "1",
    title: "Sunset Apartments",
    type: "apartment",
    totalFloors: 5,
    totalUnits: 20,
    yearBuilt: 2020,
    parkingAvailable: true,
    amenities: ["Gym", "Pool", "Security"],
    description: "Modern apartment complex with excellent amenities",
    address: {
      street: "123 Sunset Blvd",
      city: "Los Angeles",
      state: "CA",
      zip: "90028",
      country: "USA"
    },
    status: "available",
    units: [
      {
        id: "unit1",
        number: "101",
        floor: 1,
        price: 2500,
        type: "2bedroom",
        status: "available",
        size: 1200,
        bedrooms: 2,
        bathrooms: 2,
        features: ["Balcony", "Updated Kitchen", "Wood Floors"],
        applications: [
          {
            id: "app1",
            name: "John Smith",
            email: "john@example.com",
            phone: "555-123-4567",
            income: 85000,
            status: "pending",
            submissionDate: "2024-04-01",
            documents: ["ID", "Credit Report", "Pay Stubs"]
          }
        ]
      },
      {
        id: "unit2",
        number: "102",
        floor: 1,
        price: 1800,
        type: "1bedroom",
        status: "rented",
        size: 800,
        bedrooms: 1,
        bathrooms: 1,
        features: ["Walk-in Closet", "Dishwasher"],
        tenantId: "tenant1",
        leaseStart: "2024-01-01",
        leaseEnd: "2024-12-31"
      },
      {
        id: "unit3",
        number: "201",
        floor: 2,
        price: 3200,
        type: "3bedroom",
        status: "available",
        size: 1600,
        bedrooms: 3,
        bathrooms: 2,
        features: ["Corner Unit", "City Views", "Upgraded Appliances"]
      }
    ]
  },
  {
    id: "2",
    title: "Urban Lofts",
    type: "condo",
    totalFloors: 3,
    totalUnits: 12,
    yearBuilt: 2018,
    parkingAvailable: true,
    amenities: ["Rooftop Terrace", "Bike Storage", "Pet Friendly"],
    description: "Contemporary urban living with industrial design elements",
    address: {
      street: "456 Downtown Ave",
      city: "Chicago",
      state: "IL",
      zip: "60601",
      country: "USA"
    },
    status: "available",
    units: [
      {
        id: "unit4",
        number: "A1",
        floor: 1,
        price: 2200,
        type: "1bedroom",
        status: "available",
        size: 950,
        bedrooms: 1,
        bathrooms: 1,
        features: ["High Ceilings", "Exposed Brick", "Stainless Appliances"]
      },
      {
        id: "unit5",
        number: "B2",
        floor: 2,
        price: 3400,
        type: "2bedroom",
        status: "maintenance",
        size: 1350,
        bedrooms: 2,
        bathrooms: 2,
        features: ["Private Balcony", "Hardwood Floors", "Fireplace"]
      }
    ]
  },
  {
    id: "3",
    title: "Maple Grove Townhomes",
    type: "townhouse",
    totalFloors: 2,
    totalUnits: 8,
    yearBuilt: 2015,
    parkingAvailable: true,
    amenities: ["Private Yards", "Garage", "Community Garden"],
    description: "Spacious townhomes perfect for families in a quiet neighborhood",
    address: {
      street: "789 Maple Street",
      city: "Minneapolis",
      state: "MN",
      zip: "55403",
      country: "USA"
    },
    status: "rented",
    units: [
      {
        id: "unit6",
        number: "T1",
        floor: 2,
        price: 2800,
        type: "3bedroom",
        status: "rented",
        size: 1800,
        bedrooms: 3,
        bathrooms: 2.5,
        features: ["Finished Basement", "Attached Garage", "Fenced Yard"],
        tenantId: "tenant2",
        leaseStart: "2023-09-01",
        leaseEnd: "2024-08-31"
      }
    ]
  }
];

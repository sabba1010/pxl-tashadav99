import React, { useState, useMemo } from "react";

/** ---------------- Types ---------------- */
type CubaShippingMethod =
  | "Air (10–15 days)"
  | "Maritime (20–30 days)"
  | "Express (3–5 days)";

type CubaShipmentStatus =
  | "pending"
  | "processing"
  | "in_transit"
  | "delivered"
  | "cancelled"
  | "ready_to_ship"
  | "in_customs";

interface CubaShipment {
  id: string;
  trackingNumber: string; // Manually assigned by EXPRESUR
  lockerIdentifier: string; // Original locker/customer ID
  recipientName: string;
  weightLbs: number; // Final measured weight
  shippingMethod: CubaShippingMethod;
  status: CubaShipmentStatus;
  price: number; // Final calculated price from rate table
  createdAt: string;
  lastUpdate: string;
  trackingEvents: { timestamp: string; location: string; details: string }[];
}

/** ------------------ THEME ------------------ */
const BOTTLE = "#166534";
const BOTTLE_DARK = "#14572b";

/** ------------------ RATES & DATA (unchanged) ------------------ */
const CubaRates = {
  "Air (10–15 days)": 4.5, // $4.50 per lb
  "Maritime (20–30 days)": 2.0, // $2.00 per lb
  "Express (3–5 days)": 7.0, // $7.00 per lb
};

const initialShipments: CubaShipment[] = [
  {
    id: "CU004",
    trackingNumber: "EXP-CU-9004",
    lockerIdentifier: "HJ22KQM",
    recipientName: "Luis Fernandez",
    weightLbs: 12.3,
    shippingMethod: "Air (10–15 days)",
    price: Math.round(12.3 * CubaRates["Air (10–15 days)"]),
    status: "in_transit",
    createdAt: "2025-11-21",
    lastUpdate: "2025-11-26",
    trackingEvents: [
      {
        timestamp: "2025-11-21",
        location: "Miami Warehouse",
        details: "Shipment Created & Weighed",
      },
      {
        timestamp: "2025-11-26",
        location: "Miami Cargo Airport",
        details: "Departed Miami",
      },
    ],
  },
  {
    id: "CU005",
    trackingNumber: "EXP-CU-9005",
    lockerIdentifier: "PL47DTR",
    recipientName: "Ana Morales",
    weightLbs: 22.0,
    shippingMethod: "Maritime (20–30 days)",
    price: Math.round(22.0 * CubaRates["Maritime (20–30 days)"]),
    status: "ready_to_ship",
    createdAt: "2025-11-24",
    lastUpdate: "2025-11-24",
    trackingEvents: [
      {
        timestamp: "2025-11-24",
        location: "Miami Warehouse",
        details: "Consolidation Confirmed. Ready for Booking.",
      },
    ],
  },
  {
    id: "CU006",
    trackingNumber: "EXP-CU-9006",
    lockerIdentifier: "ZX55QWE",
    recipientName: "Carlos Diaz",
    weightLbs: 7.8,
    shippingMethod: "Express (3–5 days)",
    price: Math.round(7.8 * CubaRates["Express (3–5 days)"]),
    status: "delivered",
    createdAt: "2025-11-18",
    lastUpdate: "2025-11-22",
    trackingEvents: [
      {
        timestamp: "2025-11-18",
        location: "Miami Warehouse",
        details: "Shipment Created",
      },
      {
        timestamp: "2025-11-20",
        location: "Havana",
        details: "Arrived in Cuba",
      },
      {
        timestamp: "2025-11-22",
        location: "Recipient Address",
        details: "Delivered successfully.",
      },
    ],
  },
  {
    id: "CU007",
    trackingNumber: "EXP-CU-9007",
    lockerIdentifier: "AC09ZXY",
    recipientName: "Maria Perez",
    weightLbs: 30.5,
    shippingMethod: "Maritime (20–30 days)",
    price: Math.round(30.5 * CubaRates["Maritime (20–30 days)"]),
    status: "in_transit",
    createdAt: "2025-11-22",
    lastUpdate: "2025-11-27",
    trackingEvents: [
      {
        timestamp: "2025-11-22",
        location: "Miami Warehouse",
        details: "Shipment Created & Weighed",
      },
      {
        timestamp: "2025-11-27",
        location: "Miami Port",
        details: "Container Loaded for Shipment",
      },
    ],
  },
  {
    id: "CU008",
    trackingNumber: "EXP-CU-9008",
    lockerIdentifier: "MT68UYV",
    recipientName: "Jose Hernández",
    weightLbs: 3.4,
    shippingMethod: "Express (3–5 days)",
    price: Math.round(3.4 * CubaRates["Express (3–5 days)"]),
    status: "ready_to_ship",
    createdAt: "2025-11-25",
    lastUpdate: "2025-11-25",
    trackingEvents: [
      {
        timestamp: "2025-11-25",
        location: "Miami Warehouse",
        details: "Shipment Created",
      },
    ],
  },
  {
    id: "CU009",
    trackingNumber: "EXP-CU-9009",
    lockerIdentifier: "RV12NOP",
    recipientName: "Laura Gomez",
    weightLbs: 18.7,
    shippingMethod: "Air (10–15 days)",
    price: Math.round(18.7 * CubaRates["Air (10–15 days)"]),
    status: "in_transit",
    createdAt: "2025-11-23",
    lastUpdate: "2025-11-28",
    trackingEvents: [
      {
        timestamp: "2025-11-23",
        location: "Miami Warehouse",
        details: "Shipment Created & Weighed",
      },
      {
        timestamp: "2025-11-28",
        location: "Miami Cargo Airport",
        details: "Departed Miami",
      },
    ],
  },
  {
    id: "CU010",
    trackingNumber: "EXP-CU-9010",
    lockerIdentifier: "QW33ERT",
    recipientName: "Miguel Santos",
    weightLbs: 27.9,
    shippingMethod: "Maritime (20–30 days)",
    price: Math.round(27.9 * CubaRates["Maritime (20–30 days)"]),
    status: "ready_to_ship",
    createdAt: "2025-11-26",
    lastUpdate: "2025-11-26",
    trackingEvents: [
      {
        timestamp: "2025-11-26",
        location: "Miami Warehouse",
        details: "Consolidation Confirmed. Ready for Booking.",
      },
    ],
  },
  {
    id: "CU011",
    trackingNumber: "EXP-CU-9011",
    lockerIdentifier: "ER45TYU",
    recipientName: "Sofia Ramirez",
    weightLbs: 9.6,
    shippingMethod: "Express (3–5 days)",
    price: Math.round(9.6 * CubaRates["Express (3–5 days)"]),
    status: "in_transit",
    createdAt: "2025-11-19",
    lastUpdate: "2025-11-24",
    trackingEvents: [
      {
        timestamp: "2025-11-19",
        location: "Miami Warehouse",
        details: "Shipment Created",
      },
      {
        timestamp: "2025-11-24",
        location: "Miami Cargo Airport",
        details: "Departed Miami",
      },
    ],
  },
  {
    id: "CU012",
    trackingNumber: "EXP-CU-9012",
    lockerIdentifier: "TY98UIO",
    recipientName: "Rafael Cruz",
    weightLbs: 14.2,
    shippingMethod: "Air (10–15 days)",
    price: Math.round(14.2 * CubaRates["Air (10–15 days)"]),
    status: "ready_to_ship",
    createdAt: "2025-11-25",
    lastUpdate: "2025-11-25",
    trackingEvents: [
      {
        timestamp: "2025-11-25",
        location: "Miami Warehouse",
        details: "Shipment Created & Weighed",
      },
    ],
  },
  {
    id: "CU013",
    trackingNumber: "EXP-CU-9013",
    lockerIdentifier: "UI76POK",
    recipientName: "Elena Ortiz",
    weightLbs: 5.9,
    shippingMethod: "Express (3–5 days)",
    price: Math.round(5.9 * CubaRates["Express (3–5 days)"]),
    status: "delivered",
    createdAt: "2025-11-17",
    lastUpdate: "2025-11-21",
    trackingEvents: [
      {
        timestamp: "2025-11-17",
        location: "Miami Warehouse",
        details: "Shipment Created",
      },
      {
        timestamp: "2025-11-19",
        location: "Havana",
        details: "Arrived in Cuba",
      },
      {
        timestamp: "2025-11-21",
        location: "Recipient Address",
        details: "Delivered successfully.",
      },
    ],
  },
  {
    id: "CU014",
    trackingNumber: "EXP-CU-9014",
    lockerIdentifier: "OP32LMQ",
    recipientName: "Diego Alvarez",
    weightLbs: 33.1,
    shippingMethod: "Maritime (20–30 days)",
    price: Math.round(33.1 * CubaRates["Maritime (20–30 days)"]),
    status: "in_transit",
    createdAt: "2025-11-20",
    lastUpdate: "2025-11-27",
    trackingEvents: [
      {
        timestamp: "2025-11-20",
        location: "Miami Warehouse",
        details: "Shipment Created & Weighed",
      },
      {
        timestamp: "2025-11-27",
        location: "Miami Port",
        details: "Container Loaded for Shipment",
      },
    ],
  },
  {
    id: "CU015",
    trackingNumber: "EXP-CU-9015",
    lockerIdentifier: "ZX09TRE",
    recipientName: "Mariana Lopez",
    weightLbs: 11.4,
    shippingMethod: "Air (10–15 days)",
    price: Math.round(11.4 * CubaRates["Air (10–15 days)"]),
    status: "ready_to_ship",
    createdAt: "2025-11-26",
    lastUpdate: "2025-11-26",
    trackingEvents: [
      {
        timestamp: "2025-11-26",
        location: "Miami Warehouse",
        details: "Shipment Created & Weighed",
      },
    ],
  },
  {
    id: "CU016",
    trackingNumber: "EXP-CU-9016",
    lockerIdentifier: "LM44ASD",
    recipientName: "Victor Ramirez",
    weightLbs: 6.7,
    shippingMethod: "Express (3–5 days)",
    price: Math.round(6.7 * CubaRates["Express (3–5 days)"]),
    status: "in_transit",
    createdAt: "2025-11-22",
    lastUpdate: "2025-11-25",
    trackingEvents: [
      {
        timestamp: "2025-11-22",
        location: "Miami Warehouse",
        details: "Shipment Created",
      },
      {
        timestamp: "2025-11-25",
        location: "Miami Cargo Airport",
        details: "Departed Miami",
      },
    ],
  },
  {
    id: "CU017",
    trackingNumber: "EXP-CU-9017",
    lockerIdentifier: "GH88JKL",
    recipientName: "Paula Santiago",
    weightLbs: 20.5,
    shippingMethod: "Maritime (20–30 days)",
    price: Math.round(20.5 * CubaRates["Maritime (20–30 days)"]),
    status: "ready_to_ship",
    createdAt: "2025-11-24",
    lastUpdate: "2025-11-24",
    trackingEvents: [
      {
        timestamp: "2025-11-24",
        location: "Miami Warehouse",
        details: "Consolidation Confirmed. Ready for Booking.",
      },
    ],
  },
  {
    id: "CU018",
    trackingNumber: "EXP-CU-9018",
    lockerIdentifier: "JK21QWR",
    recipientName: "Fernando Castillo",
    weightLbs: 16.8,
    shippingMethod: "Air (10–15 days)",
    price: Math.round(16.8 * CubaRates["Air (10–15 days)"]),
    status: "in_transit",
    createdAt: "2025-11-23",
    lastUpdate: "2025-11-28",
    trackingEvents: [
      {
        timestamp: "2025-11-23",
        location: "Miami Warehouse",
        details: "Shipment Created & Weighed",
      },
      {
        timestamp: "2025-11-28",
        location: "Miami Cargo Airport",
        details: "Departed Miami",
      },
    ],
  },
  {
    id: "CU019",
    trackingNumber: "EXP-CU-9019",
    lockerIdentifier: "NB67UYT",
    recipientName: "Isabel Fernandez",
    weightLbs: 4.5,
    shippingMethod: "Express (3–5 days)",
    price: Math.round(4.5 * CubaRates["Express (3–5 days)"]),
    status: "delivered",
    createdAt: "2025-11-18",
    lastUpdate: "2025-11-22",
    trackingEvents: [
      {
        timestamp: "2025-11-18",
        location: "Miami Warehouse",
        details: "Shipment Created",
      },
      {
        timestamp: "2025-11-20",
        location: "Havana",
        details: "Arrived in Cuba",
      },
      {
        timestamp: "2025-11-22",
        location: "Recipient Address",
        details: "Delivered successfully.",
      },
    ],
  },
  {
    id: "CU020",
    trackingNumber: "EXP-CU-9020",
    lockerIdentifier: "OP90KLM",
    recipientName: "Ricardo Mendez",
    weightLbs: 25.3,
    shippingMethod: "Maritime (20–30 days)",
    price: Math.round(25.3 * CubaRates["Maritime (20–30 days)"]),
    status: "in_transit",
    createdAt: "2025-11-21",
    lastUpdate: "2025-11-27",
    trackingEvents: [
      {
        timestamp: "2025-11-21",
        location: "Miami Warehouse",
        details: "Shipment Created & Weighed",
      },
      {
        timestamp: "2025-11-27",
        location: "Miami Port",
        details: "Container Loaded for Shipment",
      },
    ],
  },
  {
    id: "CU021",
    trackingNumber: "EXP-CU-9021",
    lockerIdentifier: "ZX34PLM",
    recipientName: "Camila Ruiz",
    weightLbs: 2.8,
    shippingMethod: "Express (3–5 days)",
    price: Math.round(2.8 * CubaRates["Express (3–5 days)"]),
    status: "ready_to_ship",
    createdAt: "2025-11-26",
    lastUpdate: "2025-11-26",
    trackingEvents: [
      {
        timestamp: "2025-11-26",
        location: "Miami Warehouse",
        details: "Shipment Created",
      },
    ],
  },
  {
    id: "CU022",
    trackingNumber: "EXP-CU-9022",
    lockerIdentifier: "AS55QWE",
    recipientName: "Diego Vargas",
    weightLbs: 19.9,
    shippingMethod: "Air (10–15 days)",
    price: Math.round(19.9 * CubaRates["Air (10–15 days)"]),
    status: "in_transit",
    createdAt: "2025-11-22",
    lastUpdate: "2025-11-27",
    trackingEvents: [
      {
        timestamp: "2025-11-22",
        location: "Miami Warehouse",
        details: "Shipment Created & Weighed",
      },
      {
        timestamp: "2025-11-27",
        location: "Miami Cargo Airport",
        details: "Departed Miami",
      },
    ],
  },
  {
    id: "CU023",
    trackingNumber: "EXP-CU-9023",
    lockerIdentifier: "DF78RTY",
    recipientName: "Valentina Silva",
    weightLbs: 13.7,
    shippingMethod: "Maritime (20–30 days)",
    price: Math.round(13.7 * CubaRates["Maritime (20–30 days)"]),
    status: "ready_to_ship",
    createdAt: "2025-11-25",
    lastUpdate: "2025-11-25",
    trackingEvents: [
      {
        timestamp: "2025-11-25",
        location: "Miami Warehouse",
        details: "Consolidation Confirmed. Ready for Booking.",
      },
    ],
  },
  {
    id: "CU024",
    trackingNumber: "EXP-CU-9024",
    lockerIdentifier: "GH90WER",
    recipientName: "Alejandro Ruiz",
    weightLbs: 8.2,
    shippingMethod: "Express (3–5 days)",
    price: Math.round(8.2 * CubaRates["Express (3–5 days)"]),
    status: "in_transit",
    createdAt: "2025-11-20",
    lastUpdate: "2025-11-24",
    trackingEvents: [
      {
        timestamp: "2025-11-20",
        location: "Miami Warehouse",
        details: "Shipment Created",
      },
      {
        timestamp: "2025-11-24",
        location: "Miami Cargo Airport",
        details: "Departed Miami",
      },
    ],
  },
  {
    id: "CU025",
    trackingNumber: "EXP-CU-9025",
    lockerIdentifier: "JK12UIO",
    recipientName: "Lucia Torres",
    weightLbs: 17.6,
    shippingMethod: "Air (10–15 days)",
    price: Math.round(17.6 * CubaRates["Air (10–15 days)"]),
    status: "ready_to_ship",
    createdAt: "2025-11-26",
    lastUpdate: "2025-11-26",
    trackingEvents: [
      {
        timestamp: "2025-11-26",
        location: "Miami Warehouse",
        details: "Shipment Created & Weighed",
      },
    ],
  },
  {
    id: "CU026",
    trackingNumber: "EXP-CU-9026",
    lockerIdentifier: "LM33POK",
    recipientName: "Gabriel Sanchez",
    weightLbs: 21.4,
    shippingMethod: "Maritime (20–30 days)",
    price: Math.round(21.4 * CubaRates["Maritime (20–30 days)"]),
    status: "in_transit",
    createdAt: "2025-11-23",
    lastUpdate: "2025-11-27",
    trackingEvents: [
      {
        timestamp: "2025-11-23",
        location: "Miami Warehouse",
        details: "Shipment Created & Weighed",
      },
      {
        timestamp: "2025-11-27",
        location: "Miami Port",
        details: "Container Loaded for Shipment",
      },
    ],
  },
  {
    id: "CU027",
    trackingNumber: "EXP-CU-9027",
    lockerIdentifier: "OP55LKM",
    recipientName: "Camilo Navarro",
    weightLbs: 10.0,
    shippingMethod: "Air (10–15 days)",
    price: Math.round(10.0 * CubaRates["Air (10–15 days)"]),
    status: "in_transit",
    createdAt: "2025-11-22",
    lastUpdate: "2025-11-27",
    trackingEvents: [
      {
        timestamp: "2025-11-22",
        location: "Miami Warehouse",
        details: "Shipment Created & Weighed",
      },
      {
        timestamp: "2025-11-27",
        location: "Miami Cargo Airport",
        details: "Departed Miami",
      },
    ],
  },
  {
    id: "CU028",
    trackingNumber: "EXP-CU-9028",
    lockerIdentifier: "ZX66RTE",
    recipientName: "Paola Diaz",
    weightLbs: 4.1,
    shippingMethod: "Express (3–5 days)",
    price: Math.round(4.1 * CubaRates["Express (3–5 days)"]),
    status: "ready_to_ship",
    createdAt: "2025-11-26",
    lastUpdate: "2025-11-26",
    trackingEvents: [
      {
        timestamp: "2025-11-26",
        location: "Miami Warehouse",
        details: "Shipment Created",
      },
    ],
  },
  {
    id: "CU029",
    trackingNumber: "EXP-CU-9029",
    lockerIdentifier: "PL12ASD",
    recipientName: "Andres Moreno",
    weightLbs: 15.0,
    shippingMethod: "Air (10–15 days)",
    price: Math.round(15.0 * CubaRates["Air (10–15 days)"]),
    status: "in_transit",
    createdAt: "2025-11-23",
    lastUpdate: "2025-11-28",
    trackingEvents: [
      {
        timestamp: "2025-11-23",
        location: "Miami Warehouse",
        details: "Shipment Created & Weighed",
      },
      {
        timestamp: "2025-11-28",
        location: "Miami Cargo Airport",
        details: "Departed Miami",
      },
    ],
  },
  {
    id: "CU030",
    trackingNumber: "EXP-CU-9030",
    lockerIdentifier: "AS44QWE",
    recipientName: "Natalia Vega",
    weightLbs: 28.2,
    shippingMethod: "Maritime (20–30 days)",
    price: Math.round(28.2 * CubaRates["Maritime (20–30 days)"]),
    status: "ready_to_ship",
    createdAt: "2025-11-26",
    lastUpdate: "2025-11-26",
    trackingEvents: [
      {
        timestamp: "2025-11-26",
        location: "Miami Warehouse",
        details: "Consolidation Confirmed. Ready for Booking.",
      },
    ],
  },
  {
    id: "CU031",
    trackingNumber: "EXP-CU-9031",
    lockerIdentifier: "ER56TGH",
    recipientName: "Oscar Molina",
    weightLbs: 9.0,
    shippingMethod: "Express (3–5 days)",
    price: Math.round(9.0 * CubaRates["Express (3–5 days)"]),
    status: "in_transit",
    createdAt: "2025-11-21",
    lastUpdate: "2025-11-24",
    trackingEvents: [
      {
        timestamp: "2025-11-21",
        location: "Miami Warehouse",
        details: "Shipment Created",
      },
      {
        timestamp: "2025-11-24",
        location: "Miami Cargo Airport",
        details: "Departed Miami",
      },
    ],
  },
  {
    id: "CU032",
    trackingNumber: "EXP-CU-9032",
    lockerIdentifier: "TY67UIO",
    recipientName: "Gabriela Herrera",
    weightLbs: 13.3,
    shippingMethod: "Air (10–15 days)",
    price: Math.round(13.3 * CubaRates["Air (10–15 days)"]),
    status: "ready_to_ship",
    createdAt: "2025-11-25",
    lastUpdate: "2025-11-25",
    trackingEvents: [
      {
        timestamp: "2025-11-25",
        location: "Miami Warehouse",
        details: "Shipment Created & Weighed",
      },
    ],
  },
  {
    id: "CU033",
    trackingNumber: "EXP-CU-9033",
    lockerIdentifier: "UI89OPL",
    recipientName: "Ricardo Lopez",
    weightLbs: 6.2,
    shippingMethod: "Express (3–5 days)",
    price: Math.round(6.2 * CubaRates["Express (3–5 days)"]),
    status: "delivered",
    createdAt: "2025-11-17",
    lastUpdate: "2025-11-21",
    trackingEvents: [
      {
        timestamp: "2025-11-17",
        location: "Miami Warehouse",
        details: "Shipment Created",
      },
      {
        timestamp: "2025-11-19",
        location: "Havana",
        details: "Arrived in Cuba",
      },
      {
        timestamp: "2025-11-21",
        location: "Recipient Address",
        details: "Delivered successfully.",
      },
    ],
  },
  {
    id: "CU034",
    trackingNumber: "EXP-CU-9034",
    lockerIdentifier: "OP09LMN",
    recipientName: "Monica Perez",
    weightLbs: 31.7,
    shippingMethod: "Maritime (20–30 days)",
    price: Math.round(31.7 * CubaRates["Maritime (20–30 days)"]),
    status: "in_transit",
    createdAt: "2025-11-20",
    lastUpdate: "2025-11-27",
    trackingEvents: [
      {
        timestamp: "2025-11-20",
        location: "Miami Warehouse",
        details: "Shipment Created & Weighed",
      },
      {
        timestamp: "2025-11-27",
        location: "Miami Port",
        details: "Container Loaded for Shipment",
      },
    ],
  },
  {
    id: "CU035",
    trackingNumber: "EXP-CU-9035",
    lockerIdentifier: "ZX21QWE",
    recipientName: "Juan Castillo",
    weightLbs: 14.8,
    shippingMethod: "Air (10–15 days)",
    price: Math.round(14.8 * CubaRates["Air (10–15 days)"]),
    status: "ready_to_ship",
    createdAt: "2025-11-26",
    lastUpdate: "2025-11-26",
    trackingEvents: [
      {
        timestamp: "2025-11-26",
        location: "Miami Warehouse",
        details: "Shipment Created & Weighed",
      },
    ],
  },
  {
    id: "CU036",
    trackingNumber: "EXP-CU-9036",
    lockerIdentifier: "LM44POI",
    recipientName: "Carla Medina",
    weightLbs: 5.5,
    shippingMethod: "Express (3–5 days)",
    price: Math.round(5.5 * CubaRates["Express (3–5 days)"]),
    status: "in_transit",
    createdAt: "2025-11-22",
    lastUpdate: "2025-11-25",
    trackingEvents: [
      {
        timestamp: "2025-11-22",
        location: "Miami Warehouse",
        details: "Shipment Created",
      },
      {
        timestamp: "2025-11-25",
        location: "Miami Cargo Airport",
        details: "Departed Miami",
      },
    ],
  },
  {
    id: "CU037",
    trackingNumber: "EXP-CU-9037",
    lockerIdentifier: "OP55TRE",
    recipientName: "Adriana Vargas",
    weightLbs: 23.9,
    shippingMethod: "Maritime (20–30 days)",
    price: Math.round(23.9 * CubaRates["Maritime (20–30 days)"]),
    status: "ready_to_ship",
    createdAt: "2025-11-25",
    lastUpdate: "2025-11-25",
    trackingEvents: [
      {
        timestamp: "2025-11-25",
        location: "Miami Warehouse",
        details: "Consolidation Confirmed. Ready for Booking.",
      },
    ],
  },
  {
    id: "CU038",
    trackingNumber: "EXP-CU-9038",
    lockerIdentifier: "ZX78UIO",
    recipientName: "Emilio Reyes",
    weightLbs: 17.2,
    shippingMethod: "Air (10–15 days)",
    price: Math.round(17.2 * CubaRates["Air (10–15 days)"]),
    status: "in_transit",
    createdAt: "2025-11-23",
    lastUpdate: "2025-11-28",
    trackingEvents: [
      {
        timestamp: "2025-11-23",
        location: "Miami Warehouse",
        details: "Shipment Created & Weighed",
      },
      {
        timestamp: "2025-11-28",
        location: "Miami Cargo Airport",
        details: "Departed Miami",
      },
    ],
  },
  {
    id: "CU039",
    trackingNumber: "EXP-CU-9039",
    lockerIdentifier: "AS90PLM",
    recipientName: "Patricia Flores",
    weightLbs: 8.7,
    shippingMethod: "Express (3–5 days)",
    price: Math.round(8.7 * CubaRates["Express (3–5 days)"]),
    status: "delivered",
    createdAt: "2025-11-18",
    lastUpdate: "2025-11-22",
    trackingEvents: [
      {
        timestamp: "2025-11-18",
        location: "Miami Warehouse",
        details: "Shipment Created",
      },
      {
        timestamp: "2025-11-20",
        location: "Havana",
        details: "Arrived in Cuba",
      },
      {
        timestamp: "2025-11-22",
        location: "Recipient Address",
        details: "Delivered successfully.",
      },
    ],
  },
  {
    id: "CU040",
    trackingNumber: "EXP-CU-9040",
    lockerIdentifier: "ER33QWE",
    recipientName: "Luis Navarro",
    weightLbs: 26.5,
    shippingMethod: "Maritime (20–30 days)",
    price: Math.round(26.5 * CubaRates["Maritime (20–30 days)"]),
    status: "in_transit",
    createdAt: "2025-11-20",
    lastUpdate: "2025-11-27",
    trackingEvents: [
      {
        timestamp: "2025-11-20",
        location: "Miami Warehouse",
        details: "Shipment Created & Weighed",
      },
      {
        timestamp: "2025-11-27",
        location: "Miami Port",
        details: "Container Loaded for Shipment",
      },
    ],
  },
  {
    id: "CU041",
    trackingNumber: "EXP-CU-9041",
    lockerIdentifier: "TY66UIO",
    recipientName: "Carmen Ortiz",
    weightLbs: 12.9,
    shippingMethod: "Air (10–15 days)",
    price: Math.round(12.9 * CubaRates["Air (10–15 days)"]),
    status: "ready_to_ship",
    createdAt: "2025-11-26",
    lastUpdate: "2025-11-26",
    trackingEvents: [
      {
        timestamp: "2025-11-26",
        location: "Miami Warehouse",
        details: "Shipment Created & Weighed",
      },
    ],
  },
  {
    id: "CU042",
    trackingNumber: "EXP-CU-9042",
    lockerIdentifier: "UI99OPL",
    recipientName: "Ramon Castillo",
    weightLbs: 19.4,
    shippingMethod: "Maritime (20–30 days)",
    price: Math.round(19.4 * CubaRates["Maritime (20–30 days)"]),
    status: "in_transit",
    createdAt: "2025-11-23",
    lastUpdate: "2025-11-27",
    trackingEvents: [
      {
        timestamp: "2025-11-23",
        location: "Miami Warehouse",
        details: "Shipment Created & Weighed",
      },
      {
        timestamp: "2025-11-27",
        location: "Miami Port",
        details: "Container Loaded for Shipment",
      },
    ],
  },
  {
    id: "CU043",
    trackingNumber: "EXP-CU-9043",
    lockerIdentifier: "OP77RST",
    recipientName: "Lucia Fernandez",
    weightLbs: 10.5,
    shippingMethod: "Air (10–15 days)",
    price: Math.round(10.5 * CubaRates["Air (10–15 days)"]),
    status: "in_transit",
    createdAt: "2025-11-22",
    lastUpdate: "2025-11-27",
    trackingEvents: [
      {
        timestamp: "2025-11-22",
        location: "Miami Warehouse",
        details: "Shipment Created & Weighed",
      },
      {
        timestamp: "2025-11-27",
        location: "Miami Cargo Airport",
        details: "Departed Miami",
      },
    ],
  },
  {
    id: "CU044",
    trackingNumber: "EXP-CU-9044",
    lockerIdentifier: "ZX88QWE",
    recipientName: "Javier Ramirez",
    weightLbs: 3.9,
    shippingMethod: "Express (3–5 days)",
    price: Math.round(3.9 * CubaRates["Express (3–5 days)"]),
    status: "ready_to_ship",
    createdAt: "2025-11-26",
    lastUpdate: "2025-11-26",
    trackingEvents: [
      {
        timestamp: "2025-11-26",
        location: "Miami Warehouse",
        details: "Shipment Created",
      },
    ],
  },
  {
    id: "CU045",
    trackingNumber: "EXP-CU-9045",
    lockerIdentifier: "AS22PLM",
    recipientName: "Paula Herrera",
    weightLbs: 16.1,
    shippingMethod: "Air (10–15 days)",
    price: Math.round(16.1 * CubaRates["Air (10–15 days)"]),
    status: "in_transit",
    createdAt: "2025-11-23",
    lastUpdate: "2025-11-28",
    trackingEvents: [
      {
        timestamp: "2025-11-23",
        location: "Miami Warehouse",
        details: "Shipment Created & Weighed",
      },
      {
        timestamp: "2025-11-28",
        location: "Miami Cargo Airport",
        details: "Departed Miami",
      },
    ],
  },
  {
    id: "CU046",
    trackingNumber: "EXP-CU-9046",
    lockerIdentifier: "ER11QWE",
    recipientName: "Diego Ortiz",
    weightLbs: 24.3,
    shippingMethod: "Maritime (20–30 days)",
    price: Math.round(24.3 * CubaRates["Maritime (20–30 days)"]),
    status: "ready_to_ship",
    createdAt: "2025-11-26",
    lastUpdate: "2025-11-26",
    trackingEvents: [
      {
        timestamp: "2025-11-26",
        location: "Miami Warehouse",
        details: "Consolidation Confirmed. Ready for Booking.",
      },
    ],
  },
  {
    id: "CU047",
    trackingNumber: "EXP-CU-9047",
    lockerIdentifier: "TY55UIO",
    recipientName: "Marisol Diaz",
    weightLbs: 7.3,
    shippingMethod: "Express (3–5 days)",
    price: Math.round(7.3 * CubaRates["Express (3–5 days)"]),
    status: "in_transit",
    createdAt: "2025-11-21",
    lastUpdate: "2025-11-24",
    trackingEvents: [
      {
        timestamp: "2025-11-21",
        location: "Miami Warehouse",
        details: "Shipment Created",
      },
      {
        timestamp: "2025-11-24",
        location: "Miami Cargo Airport",
        details: "Departed Miami",
      },
    ],
  },
  {
    id: "CU048",
    trackingNumber: "EXP-CU-9048",
    lockerIdentifier: "UI33OPL",
    recipientName: "Esteban Molina",
    weightLbs: 18.0,
    shippingMethod: "Air (10–15 days)",
    price: Math.round(18.0 * CubaRates["Air (10–15 days)"]),
    status: "ready_to_ship",
    createdAt: "2025-11-26",
    lastUpdate: "2025-11-26",
    trackingEvents: [
      {
        timestamp: "2025-11-26",
        location: "Miami Warehouse",
        details: "Shipment Created & Weighed",
      },
    ],
  },
  {
    id: "CU049",
    trackingNumber: "EXP-CU-9049",
    lockerIdentifier: "OP44KLM",
    recipientName: "Ana Vargas",
    weightLbs: 29.2,
    shippingMethod: "Maritime (20–30 days)",
    price: Math.round(29.2 * CubaRates["Maritime (20–30 days)"]),
    status: "in_transit",
    createdAt: "2025-11-22",
    lastUpdate: "2025-11-27",
    trackingEvents: [
      {
        timestamp: "2025-11-22",
        location: "Miami Warehouse",
        details: "Shipment Created & Weighed",
      },
      {
        timestamp: "2025-11-27",
        location: "Miami Port",
        details: "Container Loaded for Shipment",
      },
    ],
  },
  {
    id: "CU050",
    trackingNumber: "EXP-CU-9050",
    lockerIdentifier: "ZX90PLM",
    recipientName: "Juan Herrera",
    weightLbs: 9.4,
    shippingMethod: "Express (3–5 days)",
    price: Math.round(9.4 * CubaRates["Express (3–5 days)"]),
    status: "delivered",
    createdAt: "2025-11-18",
    lastUpdate: "2025-11-22",
    trackingEvents: [
      {
        timestamp: "2025-11-18",
        location: "Miami Warehouse",
        details: "Shipment Created",
      },
      {
        timestamp: "2025-11-20",
        location: "Havana",
        details: "Arrived in Cuba",
      },
      {
        timestamp: "2025-11-22",
        location: "Recipient Address",
        details: "Delivered successfully.",
      },
    ],
  },
  {
    id: "CU051",
    trackingNumber: "EXP-CU-9051",
    lockerIdentifier: "AS12QWE",
    recipientName: "Sara Cruz",
    weightLbs: 20.8,
    shippingMethod: "Air (10–15 days)",
    price: Math.round(20.8 * CubaRates["Air (10–15 days)"]),
    status: "in_transit",
    createdAt: "2025-11-23",
    lastUpdate: "2025-11-28",
    trackingEvents: [
      {
        timestamp: "2025-11-23",
        location: "Miami Warehouse",
        details: "Shipment Created & Weighed",
      },
      {
        timestamp: "2025-11-28",
        location: "Miami Cargo Airport",
        details: "Departed Miami",
      },
    ],
  },
  {
    id: "CU052",
    trackingNumber: "EXP-CU-9052",
    lockerIdentifier: "ER66PLM",
    recipientName: "Pedro Herrera",
    weightLbs: 14.6,
    shippingMethod: "Maritime (20–30 days)",
    price: Math.round(14.6 * CubaRates["Maritime (20–30 days)"]),
    status: "ready_to_ship",
    createdAt: "2025-11-26",
    lastUpdate: "2025-11-26",
    trackingEvents: [
      {
        timestamp: "2025-11-26",
        location: "Miami Warehouse",
        details: "Consolidation Confirmed. Ready for Booking.",
      },
    ],
  },
  {
    id: "CU053",
    trackingNumber: "EXP-CU-9053",
    lockerIdentifier: "TY44QWE",
    recipientName: "Lucia Castillo",
    weightLbs: 6.9,
    shippingMethod: "Express (3–5 days)",
    price: Math.round(6.9 * CubaRates["Express (3–5 days)"]),
    status: "in_transit",
    createdAt: "2025-11-21",
    lastUpdate: "2025-11-25",
    trackingEvents: [
      {
        timestamp: "2025-11-21",
        location: "Miami Warehouse",
        details: "Shipment Created",
      },
      {
        timestamp: "2025-11-25",
        location: "Miami Cargo Airport",
        details: "Departed Miami",
      },
    ],
  },
];

/** ---------------- Tailwind classes for badges (unchanged colors) ---------------- */
const statusColors: Record<CubaShipmentStatus, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  processing: "bg-blue-100 text-blue-800",
  in_transit: "bg-indigo-100 text-indigo-800",
  delivered: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
  ready_to_ship: "bg-purple-100 text-purple-800",
  in_customs: "bg-orange-100 text-orange-800",
};

/** ------------------ MODAL ------------------ */
const Modal: React.FC<{ onClose: () => void; children: React.ReactNode }> = ({
  onClose,
  children,
}) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div className="bg-white p-6 rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
      {children}
      <button
        className="mt-5 w-full px-4 py-2 text-white font-semibold rounded-lg"
        style={{ backgroundColor: BOTTLE }}
        onClick={onClose}
      >
        Close
      </button>
    </div>
  </div>
);

/** ------------------ MAIN COMPONENT ------------------ */
const AdminCuba: React.FC = () => {
  const [shipments, setShipments] = useState<CubaShipment[]>(initialShipments);
  const [filterStatus, setFilterStatus] = useState<CubaShipmentStatus | "all">(
    "all"
  );
  const [selectedShipment, setSelectedShipment] = useState<CubaShipment | null>(
    null
  );
  const [trackingModal, setTrackingModal] = useState<CubaShipment | null>(null);

  const [newTrackingDetail, setNewTrackingDetail] = useState("");
  const [newTrackingLocation, setNewTrackingLocation] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  const filteredShipments = useMemo(() => {
    if (filterStatus === "all") return shipments;
    return shipments.filter((s) => s.status === filterStatus);
  }, [shipments, filterStatus]);

  const totalPages = Math.ceil(filteredShipments.length / rowsPerPage);

  const paginatedShipments = useMemo(() => {
    const startIndex = (currentPage - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    return filteredShipments.slice(startIndex, endIndex);
  }, [filteredShipments, currentPage, rowsPerPage]);

  const goToPrevPage = () => {
    setCurrentPage((prev) => Math.max(1, prev - 1));
  };

  const goToNextPage = () => {
    setCurrentPage((prev) => Math.min(totalPages, prev + 1));
  };

  const getPageNumbers = (
    totalPages: number,
    currentPage: number,
    maxPagesToShow = 5
  ) => {
    const pages: (number | string)[] = [];
    if (totalPages <= maxPagesToShow) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
      return pages;
    }

    pages.push(1);
    let start = Math.max(2, currentPage - 1);
    let end = Math.min(totalPages - 1, currentPage + 1);

    if (currentPage === 1) end = Math.min(totalPages - 1, 3);
    if (currentPage === totalPages) start = Math.max(2, totalPages - 3);

    if (start > 2) {
      pages.push("...");
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (end < totalPages - 1) {
      pages.push("...");
    }

    if (totalPages > 1 && pages[pages.length - 1] !== totalPages) {
      pages.push(totalPages);
    }

    return pages.filter(
      (page, index) =>
        page !== pages[index - 1] &&
        (page !== "..." || pages[index - 1] !== "...")
    );
  };

  const pageNumbers = getPageNumbers(totalPages, currentPage);

  const handleAddTrackingEvent = (shipmentId: string) => {
    if (!newTrackingDetail || !newTrackingLocation) return;

    setShipments((prev) =>
      prev.map((s) => {
        if (s.id === shipmentId) {
          const newEvent = {
            timestamp: new Date().toISOString().slice(0, 16).replace("T", " "),
            location: newTrackingLocation,
            details: newTrackingDetail,
          };
          return {
            ...s,
            lastUpdate: new Date().toISOString().slice(0, 10),
            trackingEvents: [...s.trackingEvents, newEvent].sort((a, b) =>
              a.timestamp < b.timestamp ? -1 : 1
            ),
          };
        }
        return s;
      })
    );

    setNewTrackingDetail("");
    setNewTrackingLocation("");
    setTrackingModal(null);
  };

  const handleStatusChange = (
    shipmentId: string,
    newStatus: CubaShipmentStatus
  ) => {
    setShipments((prev) =>
      prev.map((s) =>
        s.id === shipmentId
          ? {
              ...s,
              status: newStatus,
              lastUpdate: new Date().toISOString().slice(0, 10),
            }
          : s
      )
    );
  };

  const formatPrice = (price: number) => `$${price.toFixed(2)}`;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h2 className="mb-6 text-3xl font-bold border-b pb-2" style={{ color: BOTTLE }}>
        Cuba Shipments Management
      </h2>

      {/* Rate Table Summary */}
      <div className="mb-8 p-4 bg-white rounded-xl shadow-md border" style={{ borderColor: "#e6f3ea" }}>
        <h3 className="text-xl font-semibold mb-3" style={{ color: BOTTLE }}>
          Cuba Shipping Rate Structure (Pre-set Rates)
        </h3>
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-green-50 border-b">
              <th className="p-2 text-left">Method</th>
              <th className="p-2 text-center">Transit Time</th>
              <th className="p-2 text-right">Price per lb (USD)</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(CubaRates).map(([method, rate]) => (
              <tr key={method} className="hover:bg-gray-50">
                <td className="p-2 font-medium">{method}</td>
                <td className="p-2 text-center">{method.split("(")[1].replace(")", "")}</td>
                <td className="p-2 text-right font-bold" style={{ color: BOTTLE }}>
                  {formatPrice(rate)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Controls */}
      <div className="flex justify-between items-center mb-6">
        <select
          value={filterStatus}
          onChange={(e) => {
            setFilterStatus(e.target.value as CubaShipmentStatus | "all");
            setCurrentPage(1);
          }}
          className="p-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-opacity-50"
          style={{ borderColor: "#e6f3ea", backgroundColor: "white" }}
        >
          <option value="all">All Statuses</option>
          {Object.keys(statusColors).map((status) => (
            <option key={status} value={status}>
              {status.replace("_", " ")}
            </option>
          ))}
        </select>
        <p className="text-gray-600">
          Total Filtered Shipments: <span className="font-bold">{filteredShipments.length}</span>
        </p>
      </div>

      {/* Shipments Table */}
      <div className="rounded-xl shadow-lg overflow-hidden border" style={{ borderColor: "#e6f3ea" }}>
        <table className="w-full border-collapse bg-white">
          <thead className="bg-green-50 border-b" style={{ borderColor: "#e6f3ea" }}>
            <tr>
              <th className="p-3 font-semibold text-left text-sm text-gray-700">Tracking #</th>
              <th className="p-3 font-semibold text-left text-sm text-gray-700">Locker ID</th>
              <th className="p-3 font-semibold text-left text-sm text-gray-700">Recipient</th>
              <th className="p-3 font-semibold text-left text-sm text-gray-700">Weight (lbs)</th>
              <th className="p-3 font-semibold text-left text-sm text-gray-700">Price</th>
              <th className="p-3 font-semibold text-left text-sm text-gray-700">Status</th>
              <th className="p-3 font-semibold text-left text-sm text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedShipments.length > 0 ? (
              paginatedShipments.map((s) => (
                <tr
                  key={s.id}
                  className="border-b transition duration-150 hover:bg-green-50"
                >
                  <td className="p-3 text-sm font-medium text-gray-900">{s.trackingNumber}</td>
                  <td className="p-3 text-sm text-gray-600">{s.lockerIdentifier}</td>
                  <td className="p-3 text-sm text-gray-700">{s.recipientName}</td>
                  <td className="p-3 text-sm text-gray-700">{s.weightLbs.toFixed(1)}</td>
                  <td className="p-3 text-sm font-bold" style={{ color: BOTTLE }}>
                    {formatPrice(s.price)}
                  </td>
                  <td className="p-3">
                    <select
                      value={s.status}
                      onChange={(e) =>
                        handleStatusChange(
                          s.id,
                          e.target.value as CubaShipmentStatus
                        )
                      }
                      className={`px-3 py-1 text-xs font-semibold rounded-md border appearance-none cursor-pointer`}
                      style={{ borderColor: "#e6edf0" }}
                    >
                      {Object.keys(statusColors).map((status) => (
                        <option
                          key={status}
                          value={status}
                          className={statusColors[status as CubaShipmentStatus]}
                        >
                          {status.replace("_", " ")}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="p-3 whitespace-nowrap">
                    <button
                      onClick={() => setSelectedShipment(s)}
                      className="px-3 py-1 mr-2 text-sm font-medium text-white rounded-md shadow-sm"
                      style={{ backgroundColor: BOTTLE }}
                    >
                      View Details
                    </button>
                    <button
                      onClick={() => setTrackingModal(s)}
                      className="px-3 py-1 text-sm font-medium text-white rounded-md shadow-sm"
                      style={{ backgroundColor: BOTTLE_DARK }}
                    >
                      Add Tracking
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="p-4 text-center text-gray-500">
                  No shipments found for the current filter/search criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* PAGINATION */}
      {totalPages > 1 && (
        <div className="mt-6 flex flex-col md:flex-row justify-between items-center p-4">
          <p className="text-sm text-gray-600 mb-4 md:mb-0">
            Showing {(currentPage - 1) * rowsPerPage + 1} to{" "}
            {Math.min(currentPage * rowsPerPage, filteredShipments.length)} of{" "}
            {filteredShipments.length} total shipments.
          </p>

          <nav
            className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
            aria-label="Pagination"
          >
            <button
              onClick={goToPrevPage}
              disabled={currentPage === 1}
              className="relative inline-flex items-center rounded-l-md px-3 py-2 border bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:bg-gray-100 disabled:cursor-not-allowed"
            >
              <svg
                className="h-5 w-5 mr-1"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              Previous
            </button>

            {pageNumbers.map((page, index) => (
              <React.Fragment key={index}>
                {page === "..." ? (
                  <span className="relative inline-flex items-center px-4 py-2 border bg-white text-sm font-medium text-gray-700">
                    ...
                  </span>
                ) : (
                  <button
                    onClick={() => setCurrentPage(page as number)}
                    aria-current={currentPage === page ? "page" : undefined}
                    className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium transition duration-150 ${
                      currentPage === page
                        ? "z-10 border-[#14572b] text-white shadow-md"
                        : "bg-white border-gray-300 text-gray-700 hover:bg-green-50"
                    }`}
                    style={
                      currentPage === page
                        ? { backgroundColor: BOTTLE }
                        : undefined
                    }
                  >
                    {page}
                  </button>
                )}
              </React.Fragment>
            ))}

            <button
              onClick={goToNextPage}
              disabled={currentPage === totalPages}
              className="relative inline-flex items-center rounded-r-md px-3 py-2 border bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:bg-gray-100 disabled:cursor-not-allowed"
            >
              Next
              <svg
                className="h-5 w-5 ml-1"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10l-3.293-3.293a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </nav>
        </div>
      )}

      {/* DETAILS MODAL */}
      {selectedShipment && (
        <Modal onClose={() => setSelectedShipment(null)}>
          <h3 className="text-2xl font-bold mb-4 text-gray-800 border-b pb-2">
            Tracking History: {selectedShipment.trackingNumber}
          </h3>

          <p className="mb-2">
            <b className="font-semibold text-gray-700">Status:</b>
            <span
              className={`ml-2 px-3 py-1 text-sm font-semibold rounded-full ${statusColors[selectedShipment.status]
                }`}
            >
              {selectedShipment.status.replace("_", " ")}
            </span>
          </p>
          <p className="mb-4">
            <b className="font-semibold text-gray-700">Method:</b>{" "}
            {selectedShipment.shippingMethod}
          </p>

          <h4 className="font-bold mt-4 mb-2 text-lg text-gray-800">
            Timeline (Customer View)
          </h4>
          <div className="space-y-4 border-l-2 pl-4" style={{ borderColor: "#dbeede" }}>
            {selectedShipment.trackingEvents.map((event, index) => (
              <div key={index} className="relative">
                <span
                  className="absolute -left-6 top-1 block h-3 w-3 rounded-full border-2 border-white"
                  style={{ backgroundColor: BOTTLE }}
                />
                <p className="text-sm font-semibold" style={{ color: BOTTLE }}>
                  {event.timestamp.slice(0, 10)} @ {event.location}
                </p>
                <p className="text-sm text-gray-700">{event.details}</p>
              </div>
            ))}
          </div>
        </Modal>
      )}

      {/* ADD MANUAL TRACKING MODAL */}
      {trackingModal && (
        <Modal
          onClose={() => {
            setTrackingModal(null);
            setNewTrackingDetail("");
            setNewTrackingLocation("");
          }}
        >
          <h3 className="text-2xl font-bold mb-4 text-gray-800 border-b pb-2">
            Add New Tracking Event
          </h3>
          <p className="mb-4 text-sm text-gray-600">
            Shipment: <strong>{trackingModal.trackingNumber}</strong> to{" "}
            <strong>{trackingModal.recipientName}</strong>
          </p>

          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Location/Facility
              </label>
              <input
                type="text"
                value={newTrackingLocation}
                onChange={(e) => setNewTrackingLocation(e.target.value)}
                placeholder="e.g., Havana Port, Miami Cargo"
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2"
                style={{ borderColor: "#e6f3ea", outlineColor: BOTTLE }}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tracking Details/Notification
              </label>
              <textarea
                value={newTrackingDetail}
                onChange={(e) => setNewTrackingDetail(e.target.value)}
                placeholder="e.g., Arrived in Cuba and proceeding to customs"
                rows={3}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2"
                style={{ borderColor: "#e6f3ea", outlineColor: BOTTLE }}
              />
            </div>
          </div>

          <button
            onClick={() => handleAddTrackingEvent(trackingModal.id)}
            disabled={!newTrackingDetail || !newTrackingLocation}
            className="mt-5 w-full px-4 py-2 text-white font-semibold rounded-lg transition duration-150 disabled:bg-gray-400"
            style={{
              backgroundColor: BOTTLE,
            }}
          >
            Confirm Manual Update
          </button>
        </Modal>
      )}
    </div>
  );
};

export default AdminCuba;

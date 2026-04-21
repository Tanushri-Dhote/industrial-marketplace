export const mockProducts = [
  {
    id: "volkswagen-transporter-engine-2019",
    name: "Volkswagen Transporter T28 TLine TDI BMT 2019 CXGB",
    description: "This is a premium, fully tested Volkswagen Transporter T28 TLine TDI engine. Engineered for maximum durability and fuel efficiency, it has undergone a rigorous 50-point inspection by our certified technicians. Ideal for professional fleet maintenance or individual vehicle upgrades.",
    supplierNotes: "THIS ENGINE IS A FULLY TESTED ENGINE WITH 42,000 MILES. WE CAN ALSO RECONDITION YOUR OLD ENGINE OR SUPPLY YOU WITH A RECONDITIONED ENGINE FITTING SERVICE IS AVAILABLE AT REQUEST. SOLD ON AN EXCHANGE BASIS.",
    price: 3450,
    currency: "GBP",
    status: "In Stock",
    category: "Engines",
    condition: "Used",
    images: [
      "https://images.unsplash.com/photo-1598450844431-238449974247?auto=format&fit=crop&q=80&w=1000",
      "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?auto=format&fit=crop&q=80&w=1000",
      "https://images.unsplash.com/photo-1486006920555-c77dcf18193c?auto=format&fit=crop&q=80&w=1000"
    ],
    seller: {
      name: "Lancashire Light Services LTD",
      rating: "100% positive",
      icon: "ET"
    },
    shipping: {
      location: "Oldham",
      delivery: "Varies",
      returns: "Returns accepted. See details"
    },
    pricingBreakdown: {
      item: 3450,
      delivery: 70,
      vatRate: 0.20
    },
    specifications: {
      "Engine Code": "CXGB",
      "Mileage": "42,000 miles",
      "Year": "2019",
      "Fuel Type": "Diesel",
      "Engine Size": "2.0L",
      "Condition": "Used / Fully Tested",
      "Warranty": "12 Months",
      "Gearbox": "Manual / DSG Compatible"
    },
    compatibility: [
      { make: "Volkswagen", model: "Transporter", chassis: "T6 [2015-2019]", variant: "Panel Van", type: "2.0 TDI", year: "2015-2019", engine: "1968cc 102HP (Diesel)", code: "CXGB" },
      { make: "Volkswagen", model: "Transporter", chassis: "T6 [2015-2019]", variant: "Kombi", type: "2.0 TDI", year: "2015-2019", engine: "1968cc 102HP (Diesel)", code: "CXGB" },
      { make: "Volkswagen", model: "Caravelle", chassis: "T6 [2015-2019]", variant: "MPV", type: "2.0 TDI", year: "2015-2019", engine: "1968cc 102HP (Diesel)", code: "CXGB" }
    ],
    similarProducts: [
      { id: "1", name: "VW Transporter T6.1 Engine 2020", price: 3850, condition: "Used", images: ["https://images.unsplash.com/photo-1544636331-e26879cd4d9b"] },
      { id: "2", name: "VW Crafter 2.0 TDI Engine 2018", price: 2950, condition: "Reconditioned", images: ["https://images.unsplash.com/photo-1486006920555-c77dcf18193c"] },
      { id: "3", name: "VW Golf Mk7 2.0 TDI Engine", price: 2100, condition: "Used", images: ["https://images.unsplash.com/photo-1530046339160-ce3e430c7d2f"] }
    ]
  }
];


// Define a base pricing interface
interface BasePricing {
  price: number;
  carStickers: number;
  passes: number;
}

interface IndoorPricing extends BasePricing {
  furniture: string;
}

// Create a new file: pricingConfig.ts
export const INDOOR_PRICING: Record<number, IndoorPricing> = {
  6: { price: 229020, carStickers: 1, passes: 2, furniture: '1 Table, 2 Chairs' },
  9: { price: 331980, carStickers: 1, passes: 2, furniture: '1 Table, 2 Chairs' },
  18: { price: 656627, carStickers: 1, passes: 3, furniture: '2 Tables, 4 Chairs' },
  27: { price: 984941, carStickers: 1, passes: 4, furniture: '3 Tables, 6 Chairs' },
  36: { price: 1313255, carStickers: 1, passes: 5, furniture: '4 Tables, 8 Chairs' },
  45: { price: 1641569, carStickers: 1, passes: 6, furniture: '5 Tables, 10 Chairs' },
  54: { price: 1969882, carStickers: 1, passes: 7, furniture: '6 Tables, 12 Chairs' },
  63: { price: 2298196, carStickers: 1, passes: 8, furniture: '7 Tables, 14 Chairs' },
  72: { price: 2626510, carStickers: 1, passes: 9, furniture: '8 Tables, 16 Chairs' },
  81: { price: 2954823, carStickers: 1, passes: 10, furniture: '9 Tables, 18 Chairs' },
  90: { price: 3283137, carStickers: 1, passes: 11, furniture: '10 Tables, 20 Chairs' },
  99: { price: 3611451, carStickers: 1, passes: 12, furniture: '11 Tables, 22 Chairs' },
  108: { price: 3939764, carStickers: 2, passes: 13, furniture: '12 Tables, 24 Chairs' },
  117: { price: 4268078, carStickers: 2, passes: 14, furniture: '13 Tables, 26 Chairs' },
  126: { price: 4596392, carStickers: 2, passes: 15, furniture: '14 Tables, 28 Chairs' },
  135: { price: 4924706, carStickers: 2, passes: 16, furniture: '15 Tables, 30 Chairs' }
};

export const OUTDOOR_PRICING:  Record<number, BasePricing> = {
  27: { price: 618146, carStickers: 1, passes: 4 },
  36: { price: 824195, carStickers: 1, passes: 5 },
  45: { price: 1030244, carStickers: 1, passes: 6 },
  54: { price: 1236292, carStickers: 1, passes: 7 },
  63: { price: 1442341, carStickers: 1, passes: 8 },
  72: { price: 1648390, carStickers: 1, passes: 9 },
  81: { price: 1854438, carStickers: 1, passes: 10 },
  90: { price: 2060487, carStickers: 1, passes: 11 },
  99: { price: 2266536, carStickers: 1, passes: 12 },
  108: { price: 2472584, carStickers: 2, passes: 13 },
  117: { price: 2678633, carStickers: 2, passes: 14 },
  126: { price: 2884682, carStickers: 2, passes: 15 },
  135: { price: 3090753, carStickers: 2, passes: 16 }
};

export const PREMIUM_OUTDOOR_PRICING: Record<number, BasePricing> = {
  72: { price: 2640643, carStickers: 1, passes: 9 },
  81: { price: 2970724, carStickers: 1, passes: 9 },
  90: { price: 3300804, carStickers: 1, passes: 9 },
  99: { price: 3630884, carStickers: 1, passes: 9 },
  108: { price: 3960965, carStickers: 2, passes: 10 },
  117: { price: 4291045, carStickers: 2, passes: 10 },
  126: { price: 4621126, carStickers: 2, passes: 10 },
  135: { price: 4951206, carStickers: 2, passes: 10 },
  144: { price: 5281286, carStickers: 2, passes: 11 },
  153: { price: 5611367, carStickers: 2, passes: 11 },
  162: { price: 5941447, carStickers: 2, passes: 11 },
  171: { price: 6271528, carStickers: 2, passes: 11 },
  180: { price: 6601608, carStickers: 2, passes: 12 }
};

// Minimum requirements
export const MINIMUM_REQUIREMENTS = {
  'indoor': 0, // No minimum for indoor
  'outdoor': 27, // 27m² minimum
  'premium-outdoor': 72 // 72m² minimum
};
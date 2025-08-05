import { BoothData } from '../../types/booth.types';

export const hallABooths: { [key: string]: BoothData } = {
  // Special 6m² booth - Isolated
  "S009": {
    "coords": [[550, 700], [800, 700], [800, 850], [550, 850]],
    "status": "available",
    "size": "3m x 2m",
    "category": "Standard",
    "price": 229020,
    "sqm": 6,
    "boothId": "S009",
    // //"gridPosition": { "row": 1, "col": 1 }
  },
  
  // Column 1 - Left N-series (N001-N008)
  "N008": {
    "coords": [[550, 850], [800, 850], [800, 1150], [550, 1150]],
    "status": "available",
    "size": "3m x 3m",
    "category": "Standard",
    "price": 331980,
    "sqm": 9,
    "boothId": "N008",
    // //"gridPosition": { "row": 2, "col": 1 }
  },
  "N007": {
    "coords": [[550, 1150], [800, 1150], [800, 1400], [550, 1400]],
    "status": "available",
    "size": "3m x 3m",
    "category": "Standard",
    "price": 331980,
    "sqm": 9,
    "boothId": "N007",
    // //"gridPosition": { "row": 3, "col": 1 }
  },
  "N006": {
    "coords": [[550, 1400], [800, 1400], [800, 1700], [550, 1700]],
    "status": "available",
    "size": "3m x 3m",
    "category": "Standard",
    "price": 331980,
    "sqm": 9,
    "boothId": "N006",
    // //"gridPosition": { "row": 4, "col": 1 }
  },
  // Gap for horizontal passage at row 5
  "N005": {
    "coords": [[550, 2050], [800, 2050], [800, 2350], [550, 2350]],
    "status": "available",
    "size": "3m x 3m",
    "category": "Standard",
    "price": 331980,
    "sqm": 9,
    "boothId": "N005",
    // //"gridPosition": { "row": 6, "col": 1 }
  },
  "N004": {
    "coords": [[550, 2350], [800, 2350], [800, 2600], [550, 2600]],
    "status": "available",
    "size": "3m x 3m",
    "category": "Standard",
    "price": 331980,
    "sqm": 9,
    "boothId": "N004",
    // //"gridPosition": { "row": 7, "col": 1 }
  },
  "N003": {
    "coords": [[550, 2600], [800, 2600], [800, 2850], [550, 2850]],
    "status": "available",
    "size": "3m x 3m",
    "category": "Standard",
    "price": 331980,
    "sqm": 9,
    "boothId": "N003",
    // //"gridPosition": { "row": 8, "col": 1 }
  },
  "N002": {
    "coords": [[550, 2850], [800, 2850], [800, 3150], [550, 3150]],
    "status": "available",
    "size": "3m x 3m",
    "category": "Standard",
    "price": 331980,
    "sqm": 9,
    "boothId": "N002",
    // //"gridPosition": { "row": 9, "col": 1 }
  },
  "N001": {
    "coords": [[550, 3150], [800, 3150], [800, 3400], [550, 3400]],
    "status": "available",
    "size": "3m x 3m",
    "category": "Standard",
    "price": 331980,
    "sqm": 9,
    "boothId": "N001",
    // //"gridPosition": { "row": 10, "col": 1 }
  },

  // Column 2a - First double column left side (N010-N016)
  "N016": {
    "coords": [[1050, 950], [1300, 950], [1300, 1250], [1050, 1250]],
    "status": "available",
    "size": "3m x 3m",
    "category": "Standard",
    "price": 331980,
    "sqm": 9,
    "boothId": "N016",
    // //"gridPosition": { "row": 2, "col": 3 }
  },
  "N015": {
    "coords": [[1050, 1250], [1300, 1250], [1300, 1500], [1050, 1500]],
    "status": "available",
    "size": "3m x 3m",
    "category": "Standard",
    "price": 331980,
    "sqm": 9,
    "boothId": "N015",
    // //"gridPosition": { "row": 3, "col": 3 }
  },
  "N014": {
    "coords": [[1050, 1500], [1300, 1500], [1300, 1800], [1050, 1800]],
    "status": "available",
    "size": "3m x 3m",
    "category": "Standard",
    "price": 331980,
    "sqm": 9,
    "boothId": "N014",
    // //"gridPosition": { "row": 4, "col": 3 }
  },
  // Gap for horizontal passage
  "N013": {
    "coords": [[1050, 2050], [1300, 2050], [1300, 2350], [1050, 2350]],
    "status": "available",
    "size": "3m x 3m",
    "category": "Standard",
    "price": 331980,
    "sqm": 9,
    "boothId": "N013",
    //"gridPosition": { "row": 6, "col": 3 }
  },
  "N012": {
    "coords": [[1050, 2350], [1300, 2350], [1300, 2600], [1050, 2600]],
    "status": "available",
    "size": "3m x 3m",
    "category": "Standard",
    "price": 331980,
    "sqm": 9,
    "boothId": "N012",
    //"gridPosition": { "row": 7, "col": 3 }
  },
  "N011": {
    "coords": [[1050, 2600], [1300, 2600], [1300, 2900], [1050, 2900]],
    "status": "available",
    "size": "3m x 3m",
    "category": "Standard",
    "price": 331980,
    "sqm": 9,
    "boothId": "N011",
    //"gridPosition": { "row": 8, "col": 3 }
  },
  "N010": {
    "coords": [[1050, 2900], [1300, 2900], [1300, 3150], [1050, 3150]],
    "status": "available",
    "size": "3m x 3m",
    "category": "Standard",
    "price": 331980,
    "sqm": 9,
    "boothId": "N010",
    //"gridPosition": { "row": 9, "col": 3 }
  },

  // Column 2b - First double column right side (N017-N023)
  "N023": {
    "coords": [[1300, 950], [1600, 950], [1600, 1250], [1300, 1250]],
    "status": "available",
    "size": "3m x 3m",
    "category": "Standard",
    "price": 331980,
    "sqm": 9,
    "boothId": "N023",
    //"gridPosition": { "row": 2, "col": 4 }
  },
  "N022": {
    "coords": [[1300, 1250], [1600, 1250], [1600, 1500], [1300, 1500]],
    "status": "available",
    "size": "3m x 3m",
    "category": "Standard",
    "price": 331980,
    "sqm": 9,
    "boothId": "N022",
    //"gridPosition": { "row": 3, "col": 4 }
  },
  "N021": {
    "coords": [[1300, 1500], [1600, 1500], [1600, 1800], [1300, 1800]],
    "status": "available",
    "size": "3m x 3m",
    "category": "Standard",
    "price": 331980,
    "sqm": 9,
    "boothId": "N021",
    //"gridPosition": { "row": 4, "col": 4 }
  },
  // Gap for horizontal passage
  "N020": {
    "coords": [[1300, 2050], [1600, 2050], [1600, 2350], [1300, 2350]],
    "status": "available",
    "size": "3m x 3m",
    "category": "Standard",
    "price": 331980,
    "sqm": 9,
    "boothId": "N020",
    //"gridPosition": { "row": 6, "col": 4 }
  },
  "N019": {
    "coords": [[1300, 2350], [1600, 2350], [1600, 2600], [1300, 2600]],
    "status": "available",
    "size": "3m x 3m",
    "category": "Standard",
    "price": 331980,
    "sqm": 9,
    "boothId": "N019",
    //"gridPosition": { "row": 7, "col": 4 }
  },
  "N018": {
    "coords": [[1300, 2600], [1600, 2600], [1600, 2900], [1300, 2900]],
    "status": "available",
    "size": "3m x 3m",
    "category": "Standard",
    "price": 331980,
    "sqm": 9,
    "boothId": "N018",
    //"gridPosition": { "row": 8, "col": 4 }
  },
  "N017": {
    "coords": [[1300, 2900], [1600, 2900], [1600, 3150], [1300, 3150]],
    "status": "available",
    "size": "3m x 3m",
    "category": "Standard",
    "price": 331980,
    "sqm": 9,
    "boothId": "N017",
    //"gridPosition": { "row": 9, "col": 4 }
  },

  // Column 3a - Second double column left side (N024-N031)
  "N030": {
    "coords": [[1800, 950], [2050, 950], [2050, 1250], [1800, 1250]],
    "status": "available",
    "size": "3m x 3m",
    "category": "Standard",
    "price": 331980,
    "sqm": 9,
    "boothId": "N030",
    //"gridPosition": { "row": 2, "col": 6 }
  },
  "N029": {
    "coords": [[1800, 1250], [2050, 1250], [2050, 1500], [1800, 1500]],
    "status": "available",
    "size": "3m x 3m",
    "category": "Standard",
    "price": 331980,
    "sqm": 9,
    "boothId": "N029",
    //"gridPosition": { "row": 3, "col": 6 }
  },
  "N028": {
    "coords": [[1800, 1500], [2050, 1500], [2050, 1800], [1800, 1800]],
    "status": "available",
    "size": "3m x 3m",
    "category": "Standard",
    "price": 331980,
    "sqm": 9,
    "boothId": "N028",
    //"gridPosition": { "row": 4, "col": 6 }
  },
  // Gap for horizontal passage
  "N027": {
    "coords": [[1800, 2050], [2050, 2050], [2050, 2350], [1800, 2350]],
    "status": "available",
    "size": "3m x 3m",
    "category": "Standard",
    "price": 331980,
    "sqm": 9,
    "boothId": "N027",
    //"gridPosition": { "row": 6, "col": 6 }
  },
  "N026": {
    "coords": [[1800, 2350], [2050, 2350], [2050, 2600], [1800, 2600]],
    "status": "available",
    "size": "3m x 3m",
    "category": "Standard",
    "price": 331980,
    "sqm": 9,
    "boothId": "N026",
    //"gridPosition": { "row": 7, "col": 6 }
  },
  "N025": {
    "coords": [[1800, 2600], [2050, 2600], [2050, 2900], [1800, 2900]],
    "status": "available",
    "size": "3m x 3m",
    "category": "Standard",
    "price": 331980,
    "sqm": 9,
    "boothId": "N025",
    //"gridPosition": { "row": 8, "col": 6 }
  },
  "N024": {
    "coords": [[1800, 2900], [2050, 2900], [2050, 3150], [1800, 3150]],
    "status": "available",
    "size": "3m x 3m",
    "category": "Standard",
    "price": 331980,
    "sqm": 9,
    "boothId": "N024",
    //"gridPosition": { "row": 9, "col": 6 }
  },

  // Column 3b - Second double column right side (N032-N038)
  "N037": {
    "coords": [[2050, 950], [2350, 950], [2350, 1250], [2050, 1250]],
    "status": "available",
    "size": "3m x 3m",
    "category": "Standard",
    "price": 331980,
    "sqm": 9,
    "boothId": "N037",
    //"gridPosition": { "row": 2, "col": 7 }
  },
  "N036": {
    "coords": [[2050, 1250], [2350, 1250], [2350, 1500], [2050, 1500]],
    "status": "available",
    "size": "3m x 3m",
    "category": "Standard",
    "price": 331980,
    "sqm": 9,
    "boothId": "N036",
    //"gridPosition": { "row": 3, "col": 7 }
  },
  "N035": {
    "coords": [[2050, 1500], [2350, 1500], [2350, 1800], [2050, 1800]],
    "status": "available",
    "size": "3m x 3m",
    "category": "Standard",
    "price": 331980,
    "sqm": 9,
    "boothId": "N035",
    //"gridPosition": { "row": 4, "col": 7 }
  },
  // Gap for horizontal passage
  "N034": {
    "coords": [[2050, 2050], [2350, 2050], [2350, 2350], [2050, 2350]],
    "status": "available",
    "size": "3m x 3m",
    "category": "Standard",
    "price": 331980,
    "sqm": 9,
    "boothId": "N034",
    //"gridPosition": { "row": 6, "col": 7 }
  },
  "N033": {
    "coords": [[2050, 2350], [2350, 2350], [2350, 2600], [2050, 2600]],
    "status": "available",
    "size": "3m x 3m",
    "category": "Standard",
    "price": 331980,
    "sqm": 9,
    "boothId": "N033",
    //"gridPosition": { "row": 7, "col": 7 }
  },
  "N032": {
    "coords": [[2050, 2600], [2350, 2600], [2350, 2900], [2050, 2900]],
    "status": "available",
    "size": "3m x 3m",
    "category": "Standard",
    "price": 331980,
    "sqm": 9,
    "boothId": "N032",
    //"gridPosition": { "row": 8, "col": 7 }
  },
  "N031": {
    "coords": [[2050, 2900], [2350, 2900], [2350, 3150], [2050, 3150]],
    "status": "available",
    "size": "3m x 3m",
    "category": "Standard",
    "price": 331980,
    "sqm": 9,
    "boothId": "N031",
    //"gridPosition": { "row": 9, "col": 7 }
  },

  // Column 4 - Far right single column (N039-N047) - CONTINUOUS, no passage break
"N048": {
  "coords": [
    [1740, 3480],
    [1920, 3480],
    [1920, 3660],
    [1740, 3660]
  ],
  "status": "available",
  "size": "3m x 3m",
  "category": "Standard",
  "price": 331980,
  "sqm": 9,
  "boothId": "N048"
},

  "N047": {
    "coords": [[2550, 700], [2850, 700], [2850, 950], [2550, 950]],
    "status": "available",
    "size": "3m x 3m",
    "category": "Standard",
    "price": 331980,
    "sqm": 9,
    "boothId": "N047",
    //"gridPosition": { "row": 1, "col": 9 }
  },
  "N046": {
    "coords": [[2550, 950], [2850, 950], [2850, 1250], [2550, 1250]],
    "status": "available",
    "size": "3m x 3m",
    "category": "Standard",
    "price": 331980,
    "sqm": 9,
    "boothId": "N046",
    //"gridPosition": { "row": 2, "col": 9 }
  },
  "N045": {
    "coords": [[2550, 1250], [2850, 1250], [2850, 1500], [2550, 1500]],
    "status": "available",
    "size": "3m x 3m",
    "category": "Standard",
    "price": 331980,
    "sqm": 9,
    "boothId": "N045",
    //"gridPosition": { "row": 3, "col": 9 }
  },
  "N044": {
    "coords": [[2550, 1500], [2850, 1500], [2850, 1800], [2550, 1800]],
    "status": "available",
    "size": "3m x 3m",
    "category": "Standard",
    "price": 331980,
    "sqm": 9,
    "boothId": "N044",
    //"gridPosition": { "row": 4, "col": 9 }
  },
  "N043": {
    "coords": [[2550, 1790], [2850, 1790], [2850, 2030], [2550, 2030]],
    "status": "available",
    "size": "3m x 3m",
    "category": "Standard",
    "price": 331980,
    "sqm": 9,
    "boothId": "N043",
    //"gridPosition": { "row": 5, "col": 9 }  // Note: No gap here!
  },
  "N042": {
    "coords": [[2550, 2030], [2850, 2030], [2850, 2320], [2550, 2320]],
    "status": "available",
    "size": "3m x 3m",
    "category": "Standard",
    "price": 331980,
    "sqm": 9,
    "boothId": "N042",
    //"gridPosition": { "row": 6, "col": 9 }
  },
  "N041": {
    "coords": [[2550, 2320], [2850, 2320], [2850, 2560], [2550, 2560]],
    "status": "available",
    "size": "3m x 3m",
    "category": "Standard",
    "price": 331980,
    "sqm": 9,
    "boothId": "N041",
    //"gridPosition": { "row": 7, "col": 9 }
  },
  "N040": {
    "coords": [[2550, 2560], [2850, 2560], [2850, 2850], [2550, 2850]],
    "status": "available",
    "size": "3m x 3m",
    "category": "Standard",
    "price": 331980,
    "sqm": 9,
    "boothId": "N040",
    //"gridPosition": { "row": 8, "col": 9 }
  },
  "N039": {
    "coords": [[2550, 2850], [2850, 2850], [2850, 3090], [2550, 3090]],
    "status": "available",
    "size": "3m x 3m",
    "category": "Standard",
    "price": 331980,
    "sqm": 9,
    "boothId": "N039",
    //"gridPosition": { "row": 9, "col": 9 }
  },
  "N038": {
    "coords": [[2550, 3090], [2850, 3090], [2850, 3400], [2550, 3400]],
    "status": "available",
    "size": "3m x 3m",
    "category": "Standard",
    "price": 331980,
    "sqm": 9,
    "boothId": "N038",
    //"gridPosition": { "row": 10, "col": 7 }  // This might need adjustment based on actual layout
  }
};
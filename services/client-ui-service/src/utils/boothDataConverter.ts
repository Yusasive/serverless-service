// utils/boothDataConverter.ts

interface CoordinateBooth {
  coords: number[][];
  status: 'available' | 'selected' | 'booked-by-you' | 'booked-by-others';
  size: string;
  category: 'Standard' | 'Premium';
  price: number;
  sqm: number;
  boothId?: string;
}

interface GridBooth extends CoordinateBooth {
  gridPosition: {
    row: number;
    col: number;
    rowSpan?: number;
    colSpan?: number;
  };
}

interface GridConfig {
  rows: number;
  columns: number;
  passages?: Array<{
    type: 'horizontal' | 'vertical';
    position: number;
    label?: string;
    startColumn?: number;
    endColumn?: number;
  }>;
  // startColumn and endColumn are now part of the passages array items
  doors?: Array<{
    type: 'top' | 'bottom' | 'left' | 'right';
    position: { row: number; column: number };
    label?: string;
  }>;
}

// Layout configurations for each hall/sector
export const LAYOUT_CONFIGS: { [key: string]: GridConfig } = {

  'Commercial Premium': {
  rows: 60,  // 60 booths in a single column
  columns: 2, // 2 columns (booths span both)
  passages: [], // No passages in COP sector
  doors: [
    {
      type: 'top',
      position: { row: 1, column: 1 },
      label: 'ENTRY'
    },
    {
      type: 'bottom',
      position: { row: 60, column: 1 },
      label: 'EXIT'
    }
  ]
},

'Publication, Healthcare & Sport Products': {
    rows: 14,  // 14 actual rows (passages create visual rows 5 and 12)
    columns: 7, // 7 columns including passages
    passages: [
      // Horizontal passages
      { 
        type: 'horizontal', 
        position: 5, 
        label: 'PASSAGE 1' 
      },
      { 
        type: 'horizontal', 
        position: 12, 
        label: 'PASSAGE 2' 
      },
      // Vertical passages
      { 
        type: 'vertical', 
        position: 3, 
        label: 'P1' // Thin passage between Groups 1 & 2
      },
      { 
        type: 'vertical', 
        position: 5, 
        label: 'P2' // Wide passage between Groups 2 & 3
      }
    ],
    doors: [] // No doors in OTH sector
  },
  
'Household Cosmetics & Textile Products': {
  rows: 23,  // To accommodate all sections
  columns: 27,  // To fit all booth groups
  passages: [
    // Vertical passages in main section
    { type: 'vertical', position: 3, label: 'P1' },
    { type: 'vertical', position: 6, label: 'P2' },
    { type: 'vertical', position: 9, label: 'P3' },
    { type: 'vertical', position: 12, label: 'P4' },
    
    // Vertical passages in lower section
    { type: 'vertical', position: 15, label: 'P5' },
    { type: 'vertical', position: 18, label: 'P6' },
    
    // Vertical passages in upper-right section
    { type: 'vertical', position: 23, label: 'P7' },
    { type: 'vertical', position: 25, label: 'P8' },
    
    // Horizontal corridor (conceptual - won't render)
    { type: 'horizontal', position: 10, label: 'CORRIDOR' }
  ],
  doors: []
},
  
'Food, Drinks, Agriculture & Allied Products': {
    rows: 24,
    columns: 30,
    passages: [
      // Vertical passages
      { type: 'vertical', position: 3, label: 'P1' },
      { type: 'vertical', position: 6, label: 'P2' },
      { type: 'vertical', position: 9, label: 'P3' },
      { type: 'vertical', position: 12, label: 'P4' },
      { type: 'vertical', position: 15, label: 'P5' },
      { type: 'vertical', position: 18, label: 'P6' },
      { type: 'vertical', position: 21, label: 'P7' },
      { type: 'vertical', position: 23, label: 'P8' }, // Thin passage
      { type: 'vertical', position: 25, label: 'P9' },
      { type: 'vertical', position: 28, label: 'P10' },
      
      // Horizontal passages (partial)
      { 
        type: 'horizontal', 
        position: 10, 
        label: 'CORRIDOR 1',
        startColumn: 13,
        endColumn: 20
      },
      { 
        type: 'horizontal', 
        position: 16, 
        label: 'CORRIDOR 2',
        startColumn: 13,
        endColumn: 30
      }
    ],
    doors: [] // FDA sector has no doors marked
  },


  'ICT & Electronics Products': {
  rows: 4,
  columns: 26, // 17 booth columns + 8 passages
  passages: [
    { type: 'vertical', position: 2, label: 'A1' },
    { type: 'vertical', position: 5, label: 'A2' },
    { type: 'vertical', position: 8, label: 'A3' },
    { type: 'vertical', position: 11, label: 'A4' },
    { type: 'vertical', position: 14, label: 'A5' },
    { type: 'vertical', position: 17, label: 'A6' },
    { type: 'vertical', position: 20, label: 'A7' },
    { type: 'vertical', position: 23, label: 'A8' }
  ],
  doors: [] // No doors in sector
},
'Africa Hall': {
    rows: 16,  // Keep as 16 - we'll handle the corridor differently
    columns: 6,
    passages: [
      { 
        type: 'vertical', 
        position: 2, 
        label: 'AISLE' 
      },
      { 
        type: 'vertical', 
        position: 5, 
        label: 'AISLE' 
      },
      { 
        type: 'horizontal', 
        position: 9, 
        label: 'CORRIDOR',
        startColumn: 3,  // New property
        endColumn: 4     // New property
      }
    ],
    doors: [  // New property for doors
      {
        type: 'top',
        position: { row: 0, column: 3.5 },  // Between columns 3 and 4
        label: 'TOP ENTRANCE'
      },
      {
        type: 'bottom',
        position: { row: 17, column: 3.5 }, // Between columns 3 and 4
        label: 'MAIN ENTRANCE'
      }
    ]
},
 'Hall A': {
    rows: 10,
    columns: 9, // 6 booth columns + 3 passage columns
    passages: [
      { 
        type: 'vertical', 
        position: 2, 
        label: 'AISLE 1' 
      },
      { 
        type: 'vertical', 
        position: 5, 
        label: 'AISLE 2' 
      },
      { 
        type: 'vertical', 
        position: 8, 
        label: 'AISLE 3' 
      },
      { 
        type: 'horizontal', 
        position: 5, 
        label: 'CORRIDOR',
        startColumn: 1,
        endColumn: 7
      }
    ],
   doors: [
    {
      type: 'top',
      position: { row: 1, column: 5 },  // Changed from row: 0
      label: 'TOP ENTRANCE'
    },
    {
      type: 'bottom',
      position: { row: 10, column: 5 }, // Changed from row: 11
      label: 'MAIN ENTRANCE'
    },
    {
      type: 'left',
      position: { row: 5, column: 1 },  // Changed from column: 0
      label: 'SIDE DOOR'
    }
  ]
  },
 'Hall B': {
  rows: 18,  // 18 actual rows (passage creates visual row 8)
  columns: 9, // 6 booth columns + 3 passage columns
  passages: [
    { 
      type: 'vertical', 
      position: 2, 
      label: 'AISLE 1' 
    },
    { 
      type: 'vertical', 
      position: 5, 
      label: 'AISLE 2' 
    },
    { 
      type: 'vertical', 
      position: 8, 
      label: 'AISLE 3' 
    },
    { 
      type: 'horizontal', 
      position: 8, 
      label: 'CORRIDOR',
      // Note: This corridor doesn't affect column 9
    }
  ],
  doors: [
    {
      type: 'top',
      position: { row: 1, column: 5 },
      label: 'TOP ENTRANCE'
    },
    {
      type: 'bottom',
      position: { row: 18, column: 5 },
      label: 'MAIN ENTRANCE'
    },
    {
      type: 'left',
      position: { row: 8, column: 1 },  // Side door at corridor level
      label: 'SIDE DOOR'
    }
  ]
},
  'International Hall': {
    rows: 14,
    columns: 4,
    passages: [
      { type: 'vertical', position: 3, label: 'CENTER AISLE' }
    ]
  }
};

// Add this function to boothDataConverter.ts

export function convertCOPSectorToGrid(booths: { [key: string]: CoordinateBooth }): { [key: string]: GridBooth } {
  console.log('🎯 convertCOPSectorToGrid called with', Object.keys(booths).length, 'booths');
  const gridBooths: { [key: string]: GridBooth } = {};
  
  const boothMapping: { [key: string]: { row: number; col: number; colSpan: number } } = {};
  
  // COP sector has 60 booths in a single continuous column
  // Each booth spans 2 columns for visual width (similar to CGA)
  for (let i = 101; i <= 160; i++) {
    boothMapping[`COP${i}`] = { 
      row: i - 100, // COP101=row1, COP160=row60
      col: 1,
      colSpan: 2 // Spans 2 columns for wider appearance
    };
  }
  
  // Map booths to grid positions
  Object.entries(booths).forEach(([boothId, booth]) => {
    const position = boothMapping[boothId];
    
    if (position) {
      gridBooths[boothId] = {
        ...booth,
        gridPosition: {
          row: position.row,
          col: position.col,
          colSpan: position.colSpan
        }
      };
      console.log(`✅ Mapped ${boothId} to row ${position.row}, col ${position.col}, colSpan ${position.colSpan}`);
    } else {
      console.warn(`❌ No mapping found for booth ${boothId}`);
    }
  });
  
  console.log('🎯 convertCOPSectorToGrid complete. Mapped', Object.keys(gridBooths).length, 'booths');
  
  return gridBooths;
}
export function convertFDASectorToGrid(booths: { [key: string]: CoordinateBooth }): { [key: string]: GridBooth } {
  console.log('🎯 convertFDASectorToGrid called with', Object.keys(booths).length, 'booths');
  const gridBooths: { [key: string]: GridBooth } = {};
  
  const boothMapping: { [key: string]: { row: number; col: number } } = {
    // GROUP 1 (FDA101-FDA108) - Left section, columns 1-2
    'FDA101': { row: 11, col: 1 },
    'FDA102': { row: 11, col: 2 },
    'FDA103': { row: 12, col: 1 },
    'FDA104': { row: 12, col: 2 },
    'FDA105': { row: 13, col: 1 },
    'FDA106': { row: 13, col: 2 },
    'FDA107': { row: 14, col: 1 },
    'FDA108': { row: 14, col: 2 },
    
    // GROUP 2 (FDA210-FDA217) - After passage at col 3, columns 4-5
    'FDA210': { row: 11, col: 4 },
    'FDA211': { row: 11, col: 5 },
    'FDA212': { row: 12, col: 4 },
    'FDA213': { row: 12, col: 5 },
    'FDA214': { row: 13, col: 4 },
    'FDA215': { row: 13, col: 5 },
    'FDA216': { row: 14, col: 4 },
    'FDA217': { row: 14, col: 5 },
    
    // GROUP 3 (FDA319-FDA326) - After passage at col 6, columns 7-8
    'FDA319': { row: 11, col: 7 },
    'FDA320': { row: 11, col: 8 },
    'FDA321': { row: 12, col: 7 },
    'FDA322': { row: 12, col: 8 },
    'FDA323': { row: 13, col: 7 },
    'FDA324': { row: 13, col: 8 },
    'FDA325': { row: 14, col: 7 },
    'FDA326': { row: 14, col: 8 },
    
    // GROUP 4 (FDA419-FDA438) - Complex group
    // Upper section (double column) - columns 10-11
    'FDA419': { row: 11, col: 10 },
    'FDA420': { row: 11, col: 11 },
    'FDA421': { row: 12, col: 10 },
    'FDA422': { row: 12, col: 11 },
    'FDA423': { row: 13, col: 10 },
    'FDA424': { row: 13, col: 11 },
    'FDA425': { row: 14, col: 10 },
    'FDA426': { row: 14, col: 11 },
    
    // Lower section (single column) - column 11 only
    'FDA427': { row: 17, col: 11 },
    'FDA428': { row: 18, col: 11 },
    'FDA429': { row: 19, col: 11 },
    'FDA430': { row: 20, col: 11 },
    'FDA431': { row: 21, col: 11 },
    'FDA432': { row: 22, col: 11 },
    'FDA433': { row: 23, col: 11 },
    'FDA434': { row: 24, col: 11 },
    'FDA435': { row: 25, col: 11 },
    'FDA436': { row: 26, col: 11 },
    'FDA437': { row: 27, col: 11 },
    'FDA438': { row: 28, col: 11 },
    
    // GROUP 5 (FDA501-FDA544) - After vertical corridor, columns 13-14
    // Upper section (rows 1-9)
    'FDA501': { row: 1, col: 13 },
    'FDA502': { row: 1, col: 14 },
    'FDA503': { row: 2, col: 13 },
    'FDA504': { row: 2, col: 14 },
    'FDA505': { row: 3, col: 13 },
    'FDA506': { row: 3, col: 14 },
    'FDA507': { row: 4, col: 13 },
    'FDA508': { row: 4, col: 14 },
    'FDA509': { row: 5, col: 13 },
    'FDA510': { row: 5, col: 14 },
    'FDA511': { row: 6, col: 13 },
    'FDA512': { row: 6, col: 14 },
    'FDA513': { row: 7, col: 13 },
    'FDA514': { row: 7, col: 14 },
    'FDA515': { row: 8, col: 13 },
    'FDA516': { row: 8, col: 14 },
    'FDA517': { row: 9, col: 13 },
    'FDA518': { row: 9, col: 14 },
    
    // Middle section (rows 11-14)
    'FDA519': { row: 11, col: 13 },
    'FDA520': { row: 11, col: 14 },
    'FDA521': { row: 12, col: 13 },
    'FDA522': { row: 12, col: 14 },
    'FDA523': { row: 13, col: 13 },
    'FDA524': { row: 13, col: 14 },
    'FDA525': { row: 14, col: 13 },
    'FDA526': { row: 14, col: 14 },
    
    // Lower section (rows 17-28)
    'FDA527': { row: 17, col: 13 },
    'FDA528': { row: 17, col: 14 },
    'FDA529': { row: 18, col: 13 },
    'FDA530': { row: 18, col: 14 },
    'FDA531': { row: 19, col: 13 },
    'FDA532': { row: 19, col: 14 },
    'FDA533': { row: 20, col: 13 },
    'FDA534': { row: 20, col: 14 },
    'FDA535': { row: 21, col: 13 },
    'FDA536': { row: 21, col: 14 },
    'FDA537': { row: 22, col: 13 },
    'FDA538': { row: 22, col: 14 },
    'FDA539': { row: 23, col: 13 },
    'FDA540': { row: 23, col: 14 },
    'FDA541': { row: 24, col: 13 },
    'FDA542': { row: 24, col: 14 },
    'FDA543': { row: 25, col: 13 },
    'FDA544': { row: 25, col: 14 },
    
    // GROUP 6 (FDA601-FDA644) - Columns 16-17
    // Upper section (rows 4-9)
    'FDA601': { row: 4, col: 16 },
    'FDA602': { row: 4, col: 17 },
    'FDA603': { row: 5, col: 16 },
    'FDA604': { row: 5, col: 17 },
    'FDA605': { row: 6, col: 16 },
    'FDA606': { row: 6, col: 17 },
    'FDA607': { row: 7, col: 16 },
    'FDA608': { row: 7, col: 17 },
    'FDA609': { row: 8, col: 16 },
    'FDA610': { row: 8, col: 17 },
    'FDA611': { row: 9, col: 16 },
    'FDA612': { row: 9, col: 17 },
    
    // Middle section (rows 11-14)
    'FDA613': { row: 11, col: 16 },
    'FDA614': { row: 11, col: 17 },
    'FDA615': { row: 12, col: 16 },
    'FDA616': { row: 12, col: 17 },
    'FDA617': { row: 13, col: 16 },
    'FDA618': { row: 13, col: 17 },
    'FDA619': { row: 14, col: 16 },
    'FDA620': { row: 14, col: 17 },
    
    // Lower section (rows 17-28)
    'FDA621': { row: 17, col: 16 },
    'FDA622': { row: 17, col: 17 },
    'FDA623': { row: 18, col: 16 },
    'FDA624': { row: 18, col: 17 },
    'FDA625': { row: 19, col: 16 },
    'FDA626': { row: 19, col: 17 },
    'FDA627': { row: 20, col: 16 },
    'FDA628': { row: 20, col: 17 },
    'FDA629': { row: 21, col: 16 },
    'FDA630': { row: 21, col: 17 },
    'FDA631': { row: 22, col: 16 },
    'FDA632': { row: 22, col: 17 },
    'FDA633': { row: 23, col: 16 },
    'FDA634': { row: 23, col: 17 },
    'FDA635': { row: 24, col: 16 },
    'FDA636': { row: 24, col: 17 },
    'FDA637': { row: 25, col: 16 },
    'FDA638': { row: 25, col: 17 },
    'FDA639': { row: 26, col: 16 },
    'FDA640': { row: 26, col: 17 },
    'FDA641': { row: 27, col: 16 },
    'FDA642': { row: 27, col: 17 },
    'FDA643': { row: 28, col: 16 },
    'FDA644': { row: 28, col: 17 },
    
    // GROUP 7 (FDA701-FDA748) - Columns 21-22
    // Upper section (rows 1-2)
    'FDA701': { row: 1, col: 21 },
    'FDA702': { row: 1, col: 22 },
    'FDA703': { row: 2, col: 21 },
    'FDA704': { row: 2, col: 22 },
    
    // Middle section 1 (rows 4-8)
    'FDA705': { row: 4, col: 21 },
    'FDA706': { row: 4, col: 22 },
    'FDA707': { row: 5, col: 21 },
    'FDA708': { row: 5, col: 22 },
    'FDA709': { row: 6, col: 21 },
    'FDA710': { row: 6, col: 22 },
    'FDA711': { row: 7, col: 21 },
    'FDA712': { row: 7, col: 22 },
    'FDA713': { row: 8, col: 21 },
    'FDA714': { row: 8, col: 22 },
    
    // Middle section 2 (rows 11-14)
    'FDA715': { row: 11, col: 21 },
    'FDA716': { row: 11, col: 22 },
    'FDA717': { row: 12, col: 21 },
    'FDA718': { row: 12, col: 22 },
    'FDA719': { row: 13, col: 21 },
    'FDA720': { row: 13, col: 22 },
    'FDA721': { row: 14, col: 21 },
    'FDA722': { row: 14, col: 22 },
    'FDA723': { row: 15, col: 21 },
    'FDA724': { row: 15, col: 22 },
    
    // Lower section (rows 17-28)
    'FDA725': { row: 17, col: 21 },
    'FDA726': { row: 17, col: 22 },
    'FDA727': { row: 18, col: 21 },
    'FDA728': { row: 18, col: 22 },
    'FDA729': { row: 19, col: 21 },
    'FDA730': { row: 19, col: 22 },
    'FDA731': { row: 20, col: 21 },
    'FDA732': { row: 20, col: 22 },
    'FDA733': { row: 21, col: 21 },
    'FDA734': { row: 21, col: 22 },
    'FDA735': { row: 22, col: 21 },
    'FDA736': { row: 22, col: 22 },
    'FDA737': { row: 23, col: 21 },
    'FDA738': { row: 23, col: 22 },
    'FDA739': { row: 24, col: 21 },
    'FDA740': { row: 24, col: 22 },
    'FDA741': { row: 25, col: 21 },
    'FDA742': { row: 25, col: 22 },
    'FDA743': { row: 26, col: 21 },
    'FDA744': { row: 26, col: 22 },
    'FDA745': { row: 27, col: 21 },
    'FDA746': { row: 27, col: 22 },
    'FDA747': { row: 28, col: 21 },
    'FDA748': { row: 28, col: 22 },
    
    // GROUP 8 (FDA801-FDA820) - Single column 24
    // Upper section (rows 1-2)
    'FDA801': { row: 1, col: 24 },
    'FDA802': { row: 2, col: 24 },
    
    // Middle section 1 (rows 4-8)
    'FDA803': { row: 4, col: 24 },
    'FDA804': { row: 5, col: 24 },
    'FDA805': { row: 6, col: 24 },
    'FDA806': { row: 7, col: 24 },
    'FDA807': { row: 8, col: 24 },
    
    // Middle section 2 (rows 11-14)
    'FDA808': { row: 11, col: 24 },
    'FDA809': { row: 12, col: 24 },
    'FDA810': { row: 13, col: 24 },
    'FDA811': { row: 14, col: 24 },
    'FDA812': { row: 15, col: 24 },
    // Lower section (rows 17-24)
    'FDA813': { row: 17, col: 24 },
    'FDA814': { row: 18, col: 24 },
    'FDA815': { row: 19, col: 24 },
    'FDA816': { row: 20, col: 24 },
    'FDA817': { row: 21, col: 24 },
    'FDA818': { row: 22, col: 24 },
    'FDA819': { row: 23, col: 24 },
    'FDA820': { row: 24, col: 24 },
    
    // GROUP 9 (FDA901-FDA940) - Columns 26-27
    // Upper section (rows 1-2)
    'FDA901': { row: 1, col: 26 },
    'FDA902': { row: 1, col: 27 },
    'FDA903': { row: 2, col: 26 },
    'FDA904': { row: 2, col: 27 },
    
    // Middle section 1 (rows 4-8)
    'FDA905': { row: 4, col: 26 },
    'FDA906': { row: 4, col: 27 },
    'FDA907': { row: 5, col: 26 },
    'FDA908': { row: 5, col: 27 },
    'FDA909': { row: 6, col: 26 },
    'FDA910': { row: 6, col: 27 },
    'FDA911': { row: 7, col: 26 },
    'FDA912': { row: 7, col: 27 },
    'FDA913': { row: 8, col: 26 },
    'FDA914': { row: 8, col: 27 },
    
    // Middle section 2 (rows 11-14)
    'FDA915': { row: 11, col: 26 },
    'FDA916': { row: 11, col: 27 },
    'FDA917': { row: 12, col: 26 },
    'FDA918': { row: 12, col: 27 },
    'FDA919': { row: 13, col: 26 },
    'FDA920': { row: 13, col: 27 },
    'FDA921': { row: 14, col: 26 },
    'FDA922': { row: 14, col: 27 },
    'FDA923': { row: 15, col: 26 },
    'FDA924': { row: 15, col: 27 },
    
    // Lower section (rows 17-28)
    'FDA925': { row: 17, col: 26 },
    'FDA926': { row: 17, col: 27 }, // Fixed from FDA956
    'FDA927': { row: 18, col: 26 },
    'FDA928': { row: 18, col: 27 },
    'FDA929': { row: 19, col: 26 },
    'FDA930': { row: 19, col: 27 },
    'FDA931': { row: 20, col: 26 },
    'FDA932': { row: 20, col: 27 },
    'FDA933': { row: 21, col: 26 },
    'FDA934': { row: 21, col: 27 },
    'FDA935': { row: 22, col: 26 },
    'FDA936': { row: 22, col: 27 },
    'FDA937': { row: 23, col: 26 },
    'FDA938': { row: 23, col: 27 },
    'FDA939': { row: 24, col: 26 },
    'FDA940': { row: 24, col: 27 },
    
    // GROUP 10 (FDA1001-FDA1040) - Columns 29-30
    // Upper section (rows 1-2)
    'FDA1001': { row: 1, col: 29 },
    'FDA1002': { row: 1, col: 30 },
    'FDA1003': { row: 2, col: 29 },
    'FDA1004': { row: 2, col: 30 },
    
    // Middle section 1 (rows 4-8)
    'FDA1005': { row: 4, col: 29 },
    'FDA1006': { row: 4, col: 30 },
    'FDA1007': { row: 5, col: 29 },
    'FDA1008': { row: 5, col: 30 },
    'FDA1009': { row: 6, col: 29 },
    'FDA1010': { row: 6, col: 30 },
    'FDA1011': { row: 7, col: 29 },
    'FDA1012': { row: 7, col: 30 },
    'FDA1013': { row: 8, col: 29 },
    'FDA1014': { row: 8, col: 30 },
    
    // Middle section 2 (rows 11-15)
    'FDA1015': { row: 11, col: 29 },
    'FDA1016': { row: 11, col: 30 },
    'FDA1017': { row: 12, col: 29 },
    'FDA1018': { row: 12, col: 30 },
    'FDA1019': { row: 13, col: 29 },
    'FDA1020': { row: 13, col: 30 },
    'FDA1021': { row: 14, col: 29 },
    'FDA1022': { row: 14, col: 30 },
    'FDA1023': { row: 15, col: 29 },
    'FDA1024': { row: 15, col: 30 },
    
    // Lower section (rows 17-24)
    'FDA1025': { row: 17, col: 29 },
    'FDA1026': { row: 17, col: 30 },
    'FDA1027': { row: 18, col: 29 },
    'FDA1028': { row: 18, col: 30 },
    'FDA1029': { row: 19, col: 29 },
    'FDA1030': { row: 19, col: 30 },
    'FDA1031': { row: 20, col: 29 },
    'FDA1032': { row: 20, col: 30 },
    'FDA1033': { row: 21, col: 29 },
    'FDA1034': { row: 21, col: 30 },
    'FDA1035': { row: 22, col: 29 },
    'FDA1036': { row: 22, col: 30 },
    'FDA1037': { row: 23, col: 29 },
    'FDA1038': { row: 23, col: 30 },
    'FDA1039': { row: 24, col: 29 },
    'FDA1040': { row: 24, col: 30 }
  };
  
  // Map booths to grid positions
  Object.entries(booths).forEach(([boothId, booth]) => {
    const position = boothMapping[boothId];
    
    if (position) {
      gridBooths[boothId] = {
        ...booth,
        gridPosition: position
      };
      console.log(`✅ Mapped ${boothId} to row ${position.row}, col ${position.col}`);
    } else {
      console.warn(`❌ No mapping found for booth ${boothId}`);
    }
  });
  
  console.log('🎯 convertFDASectorToGrid complete. Mapped', Object.keys(gridBooths).length, 'booths');
  
  return gridBooths;
}

export function convertHallAToGrid(booths: { [key: string]: CoordinateBooth }): { [key: string]: GridBooth } {
  console.log('🎯 convertHallAToGrid called!');
  const gridBooths: { [key: string]: GridBooth } = {};
  
  // Complete mapping for Hall A
  const boothMapping: { [key: string]: { row: number; col: number } } = {
    // Special booth - Row 1, Column 1
    'S009': { row: 1, col: 1 },
    
    // Column 1 - Left single column
    'N008': { row: 2, col: 1 },
    'N007': { row: 3, col: 1 },
    'N006': { row: 4, col: 1 },
    // Row 5 is horizontal passage - no booth
    'N005': { row: 6, col: 1 },
    'N004': { row: 7, col: 1 },
    'N003': { row: 8, col: 1 },
    'N002': { row: 9, col: 1 },
    'N001': { row: 10, col: 1 },
    
    // Column 2a (Grid column 3)
    'N016': { row: 2, col: 3 },
    'N015': { row: 3, col: 3 },
    'N014': { row: 4, col: 3 },
    // Row 5 is horizontal passage
    'N013': { row: 6, col: 3 },
    'N012': { row: 7, col: 3 },
    'N011': { row: 8, col: 3 },
    'N010': { row: 9, col: 3 },
    
    // Column 2b (Grid column 4)
    'N023': { row: 2, col: 4 },
    'N022': { row: 3, col: 4 },
    'N021': { row: 4, col: 4 },
    // Row 5 is horizontal passage
    'N020': { row: 6, col: 4 },
    'N019': { row: 7, col: 4 },
    'N018': { row: 8, col: 4 },
    'N017': { row: 9, col: 4 },
    
    // Column 3a (Grid column 6)
    'N030': { row: 2, col: 6 },
    'N029': { row: 3, col: 6 },
    'N028': { row: 4, col: 6 },
    // Row 5 is horizontal passage
    'N027': { row: 6, col: 6 },
    'N026': { row: 7, col: 6 },
    'N025': { row: 8, col: 6 },
    'N024': { row: 9, col: 6 },
    
    // Column 3b (Grid column 7)
    'N037': { row: 2, col: 7 },
    'N036': { row: 3, col: 7 },
    'N035': { row: 4, col: 7 },
    // Row 5 is horizontal passage
    'N034': { row: 6, col: 7 },
    'N033': { row: 7, col: 7 },
    'N032': { row: 8, col: 7 },
    'N031': { row: 9, col: 7 },
    
    // Column 4 (Grid column 9) - CONTINUOUS
    'N047': { row: 1, col: 9 },
    'N046': { row: 2, col: 9 },
    'N045': { row: 3, col: 9 },
    'N044': { row: 4, col: 9 },
    'N043': { row: 5, col: 9 }, // This booth exists at passage row
    'N042': { row: 6, col: 9 },
    'N041': { row: 7, col: 9 },
    'N040': { row: 8, col: 9 },
    'N039': { row: 9, col: 9 },
    'N038': { row: 10, col: 9 }
  };
  
  // If N038 exists but shouldn't, skip it
  // if (booths['N038']) {
  //   console.warn('⚠️ N038 found but not in mapping, skipping');
  //   delete booths['N038'];
  // }
  
  Object.entries(booths).forEach(([boothId, booth]) => {
    const position = boothMapping[boothId];
    
    if (position) {
      gridBooths[boothId] = {
        ...booth,
        gridPosition: position
      };
      console.log(`✅ Mapped ${boothId} to row ${position.row}, col ${position.col}`);
    } else {
      console.warn(`❌ No mapping found for booth ${boothId}`);
    }
  });
  
  console.log('🎯 convertHallAToGrid complete. Mapped', Object.keys(gridBooths).length, 'booths');
  
  return gridBooths;
}



// Add this to boothDataConverter.ts after the other converter functions

export function convertOTHSectorToGrid(booths: { [key: string]: CoordinateBooth }): { [key: string]: GridBooth } {
  console.log('🎯 convertOTHSectorToGrid called with', Object.keys(booths).length, 'booths');
  const gridBooths: { [key: string]: GridBooth } = {};
  
  const boothMapping: { [key: string]: { row: number; col: number } } = {
    // GROUP 1 - Columns 1-2 (Double column)
    // Upper section - Premium (Rows 1-4)
    'PHS101': { row: 1, col: 1 },
    'PHS102': { row: 1, col: 2 },
    'PHS103': { row: 2, col: 1 },
    'PHS104': { row: 2, col: 2 },
    'PHS105': { row: 3, col: 1 },
    'PHS106': { row: 3, col: 2 },
    'PHS107': { row: 4, col: 1 },
    'PHS108': { row: 4, col: 2 },
    
    // Row 5 is horizontal passage
    
    // Middle section - Premium (Rows 6-9)
    'PHS109': { row: 6, col: 1 },
    'PHS110': { row: 6, col: 2 },
    'PHS111': { row: 7, col: 1 },
    'PHS112': { row: 7, col: 2 },
    'PHS113': { row: 8, col: 1 },
    'PHS114': { row: 8, col: 2 },
    'PHS115': { row: 9, col: 1 },
    'PHS116': { row: 9, col: 2 },
    
    // Middle section - Standard (Rows 10-11)
    'PHS117': { row: 10, col: 1 },
    'PHS118': { row: 10, col: 2 },
    'PHS119': { row: 11, col: 1 },
    'PHS120': { row: 11, col: 2 },
    
    // Row 12 is horizontal passage
    
    // Lower section - Standard (Rows 13-14)
    'PHS121': { row: 13, col: 1 },
    'PHS122': { row: 13, col: 2 },
    'PHS123': { row: 14, col: 1 },
    'PHS124': { row: 14, col: 2 },
    
    // GROUP 2 - Column 4 (Single column, after thin passage at col 3)
    // Upper section (Rows 1-4)
    'PHS201': { row: 1, col: 4 },
    'PHS202': { row: 2, col: 4 },
    'PHS203': { row: 3, col: 4 },
    'PHS204': { row: 4, col: 4 },
    
    // Middle section (Rows 6-11)
    'PHS205': { row: 6, col: 4 },
    'PHS206': { row: 7, col: 4 },
    'PHS207': { row: 8, col: 4 },
    'PHS208': { row: 9, col: 4 },
    'PHS209': { row: 10, col: 4 },
    'PHS210': { row: 11, col: 4 },
    
    // Lower section (Rows 13-14)
    'PHS211': { row: 13, col: 4 },
    'PHS212': { row: 14, col: 4 },
    
    // GROUP 3 - Columns 6-7 (Double column, after wide passage at col 5)
    // Upper section (Rows 1-4)
    'PHS301': { row: 1, col: 6 },
    'PHS302': { row: 1, col: 7 },
    'PHS303': { row: 2, col: 6 },
    'PHS304': { row: 2, col: 7 },
    'PHS305': { row: 3, col: 6 },
    'PHS306': { row: 3, col: 7 },
    'PHS307': { row: 4, col: 6 },
    'PHS308': { row: 4, col: 7 },
    
    // Middle section (Rows 6-11)
    'PHS309': { row: 6, col: 6 },
    'PHS310': { row: 6, col: 7 },
    'PHS311': { row: 7, col: 6 },
    'PHS312': { row: 7, col: 7 },
    'PHS313': { row: 8, col: 6 },
    'PHS314': { row: 8, col: 7 },
    'PHS315': { row: 9, col: 6 },
    'PHS316': { row: 9, col: 7 },
    'PHS317': { row: 10, col: 6 },
    'PHS318': { row: 10, col: 7 },
    'PHS319': { row: 11, col: 6 },
    'PHS320': { row: 11, col: 7 },
    
    // Lower section (Rows 13-14)
    'PHS321': { row: 13, col: 6 },
    'PHS322': { row: 13, col: 7 },
    'PHS323': { row: 14, col: 6 },
    'PHS324': { row: 14, col: 7 }
  };
  
  // Map booths to grid positions
  Object.entries(booths).forEach(([boothId, booth]) => {
    const position = boothMapping[boothId];
    
    if (position) {
      gridBooths[boothId] = {
        ...booth,
        gridPosition: position
      };
      console.log(`✅ Mapped ${boothId} to row ${position.row}, col ${position.col}`);
    } else {
      console.warn(`❌ No mapping found for booth ${boothId}`);
    }
  });
  
  console.log('🎯 convertOTHSectorToGrid complete. Mapped', Object.keys(gridBooths).length, 'booths');
  
  return gridBooths;
}
export function convertHCTSectorToGrid(booths: { [key: string]: CoordinateBooth }): { [key: string]: GridBooth } {
  console.log('🎯 convertHCTSectorToGrid called with', Object.keys(booths).length, 'booths');
  const gridBooths: { [key: string]: GridBooth } = {};
  
  const boothMapping: { [key: string]: { row: number; col: number } } = {
    // GROUP 1 (HCT101-112) - Columns 1-2, Starting Row 11
    'HCT101': { row: 11, col: 1 },
    'HCT102': { row: 11, col: 2 },
    'HCT103': { row: 12, col: 1 },
    'HCT104': { row: 12, col: 2 },
    'HCT105': { row: 13, col: 1 },
    'HCT106': { row: 13, col: 2 },
    'HCT107': { row: 14, col: 1 },
    'HCT108': { row: 14, col: 2 },
    'HCT109': { row: 15, col: 1 },
    'HCT110': { row: 15, col: 2 },
    'HCT111': { row: 16, col: 1 },
    'HCT112': { row: 16, col: 2 },
    
    // GROUP 2 (HCT201-212) - Columns 4-5, Starting Row 11
    'HCT201': { row: 11, col: 4 },
    'HCT202': { row: 11, col: 5 },
    'HCT203': { row: 12, col: 4 },
    'HCT204': { row: 12, col: 5 },
    'HCT205': { row: 13, col: 4 },
    'HCT206': { row: 13, col: 5 },
    'HCT207': { row: 14, col: 4 },
    'HCT208': { row: 14, col: 5 },
    'HCT209': { row: 15, col: 4 },
    'HCT210': { row: 15, col: 5 },
    'HCT211': { row: 16, col: 4 },
    'HCT212': { row: 16, col: 5 },
    
    // GROUP 3 (HCT301-312) - Columns 7-8, Starting Row 11
    'HCT301': { row: 11, col: 7 },
    'HCT302': { row: 11, col: 8 },
    'HCT303': { row: 12, col: 7 },
    'HCT304': { row: 12, col: 8 },
    'HCT305': { row: 13, col: 7 },
    'HCT306': { row: 13, col: 8 },
    'HCT307': { row: 14, col: 7 },
    'HCT308': { row: 14, col: 8 },
    'HCT309': { row: 15, col: 7 },
    'HCT310': { row: 15, col: 8 },
    'HCT311': { row: 16, col: 7 },
    'HCT312': { row: 16, col: 8 },
    
    // GROUP 4 (HCT401-412) - Columns 10-11, Starting Row 11
    'HCT401': { row: 11, col: 10 },
    'HCT402': { row: 11, col: 11 },
    'HCT403': { row: 12, col: 10 },
    'HCT404': { row: 12, col: 11 },
    'HCT405': { row: 13, col: 10 },
    'HCT406': { row: 13, col: 11 },
    'HCT407': { row: 14, col: 10 },
    'HCT408': { row: 14, col: 11 },
    'HCT409': { row: 15, col: 10 },
    'HCT410': { row: 15, col: 11 },
    'HCT411': { row: 16, col: 10 },
    'HCT412': { row: 16, col: 11 },
    
    // GROUP 5 (HCT501-524) - Columns 13-14, Starting Row 11
    'HCT501': { row: 11, col: 13 },
    'HCT502': { row: 11, col: 14 },
    'HCT503': { row: 12, col: 13 },
    'HCT504': { row: 12, col: 14 },
    'HCT505': { row: 13, col: 13 },
    'HCT506': { row: 13, col: 14 },
    'HCT507': { row: 14, col: 13 },
    'HCT508': { row: 14, col: 14 },
    'HCT509': { row: 15, col: 13 },
    'HCT510': { row: 15, col: 14 },
    'HCT511': { row: 16, col: 13 },
    'HCT512': { row: 16, col: 14 },
    'HCT513': { row: 17, col: 13 },
    'HCT514': { row: 17, col: 14 },
    'HCT515': { row: 18, col: 13 },
    'HCT516': { row: 18, col: 14 },
    'HCT517': { row: 19, col: 13 },
    'HCT518': { row: 19, col: 14 },
    'HCT519': { row: 20, col: 13 },
    'HCT520': { row: 20, col: 14 },
    'HCT521': { row: 21, col: 13 },
    'HCT522': { row: 21, col: 14 },
    'HCT523': { row: 22, col: 13 },
    'HCT524': { row: 22, col: 14 },
    
    // GROUP 6 (HCT601-624) - Columns 16-17, Starting Row 11
    'HCT601': { row: 11, col: 16 },
    'HCT602': { row: 11, col: 17 },
    'HCT603': { row: 12, col: 16 },
    'HCT604': { row: 12, col: 17 },
    'HCT605': { row: 13, col: 16 },
    'HCT606': { row: 13, col: 17 },
    'HCT607': { row: 14, col: 16 },
    'HCT608': { row: 14, col: 17 },
    'HCT609': { row: 15, col: 16 },
    'HCT610': { row: 15, col: 17 },
    'HCT611': { row: 16, col: 16 },
    'HCT612': { row: 16, col: 17 },
    'HCT613': { row: 17, col: 16 },
    'HCT614': { row: 17, col: 17 },
    'HCT615': { row: 18, col: 16 },
    'HCT616': { row: 18, col: 17 },
    'HCT617': { row: 19, col: 16 },
    'HCT618': { row: 19, col: 17 },
    'HCT619': { row: 20, col: 16 },
    'HCT620': { row: 20, col: 17 },
    'HCT621': { row: 21, col: 16 },
    'HCT622': { row: 21, col: 17 },
    'HCT623': { row: 22, col: 16 },
    'HCT624': { row: 22, col: 17 },
    
    // GROUP 7 (HCT701-724) - Columns 21-22, Starting Row 1
    'HCT701': { row: 1, col: 21 },
    'HCT702': { row: 1, col: 22 },
    'HCT703': { row: 2, col: 21 },
    'HCT704': { row: 2, col: 22 },
    'HCT705': { row: 3, col: 21 },
    'HCT706': { row: 3, col: 22 },
    'HCT707': { row: 4, col: 21 },
    'HCT708': { row: 4, col: 22 },
    'HCT709': { row: 5, col: 21 },
    'HCT710': { row: 5, col: 22 },
    'HCT711': { row: 6, col: 21 },
    'HCT712': { row: 6, col: 22 },
    'HCT713': { row: 7, col: 21 },
    'HCT714': { row: 7, col: 22 },
    'HCT715': { row: 8, col: 21 },
    'HCT716': { row: 8, col: 22 },
    'HCT717': { row: 9, col: 21 },
    'HCT718': { row: 9, col: 22 },
    'HCT719': { row: 10, col: 21 },
    'HCT720': { row: 10, col: 22 },
    'HCT721': { row: 11, col: 21 },
    'HCT722': { row: 11, col: 22 },
    'HCT723': { row: 12, col: 21 },
    'HCT724': { row: 12, col: 22 },
    
    // GROUP 8 (HCT801-808) - Column 24 only, Starting Row 5
    'HCT801': { row: 5, col: 24 },
    'HCT802': { row: 6, col: 24 },
    'HCT803': { row: 7, col: 24 },
    'HCT804': { row: 8, col: 24 },
    'HCT805': { row: 9, col: 24 },
    'HCT806': { row: 10, col: 24 },
    'HCT807': { row: 11, col: 24 },
    'HCT808': { row: 12, col: 24 },
    
    // GROUP 9 (HCT901-916) - Columns 26-27, Starting Row 5
    'HCT901': { row: 5, col: 26 },
    'HCT902': { row: 5, col: 27 },
    'HCT903': { row: 6, col: 26 },
    'HCT904': { row: 6, col: 27 },
    'HCT905': { row: 7, col: 26 },
    'HCT906': { row: 7, col: 27 },
    'HCT907': { row: 8, col: 26 },
    'HCT908': { row: 8, col: 27 },
    'HCT909': { row: 9, col: 26 },
    'HCT910': { row: 9, col: 27 },
    'HCT911': { row: 10, col: 26 },
    'HCT912': { row: 10, col: 27 },
    'HCT913': { row: 11, col: 26 },
    'HCT914': { row: 11, col: 27 },
    'HCT915': { row: 12, col: 26 },
    'HCT916': { row: 12, col: 27 }
  };
  
  Object.entries(booths).forEach(([boothId, booth]) => {
    const position = boothMapping[boothId];
    
    if (position) {
      gridBooths[boothId] = {
        ...booth,
        gridPosition: position
      };
      console.log(`✅ Mapped ${boothId} to row ${position.row}, col ${position.col}`);
    } else {
      console.warn(`❌ No mapping found for booth ${boothId}`);
    }
  });
  
  console.log('🎯 convertHCTSectorToGrid complete. Mapped', Object.keys(gridBooths).length, 'booths');
  
  return gridBooths;
}
export function convertCGASectorToGrid(booths: { [key: string]: CoordinateBooth }): { [key: string]: GridBooth } {
  console.log('🎯 convertCGASectorToGrid called with', Object.keys(booths).length, 'booths');
  const gridBooths: { [key: string]: GridBooth } = {};
  
  const boothMapping: { [key: string]: { row: number; col: number; colSpan: number } } = {};
  
  // Upper section - CGA101-CGA128 (rows 1-28)
  for (let i = 101; i <= 128; i++) {
    boothMapping[`CGA${i}`] = { 
      row: i - 100, // CGA101=row1, CGA128=row28
      col: 1,
      colSpan: 2
    };
  }
  
  // Lower section - CGA129-CGA156 (rows 30-57, skipping row 29 for passage)
  for (let i = 129; i <= 156; i++) {
    boothMapping[`CGA${i}`] = { 
      row: i - 99, // CGA129=row30, CGA156=row57 (shifted by 1 for passage)
      col: 1,
      colSpan: 2
    };
  }
  
  // Map booths to grid positions
  Object.entries(booths).forEach(([boothId, booth]) => {
    const position = boothMapping[boothId];
    
    if (position) {
      gridBooths[boothId] = {
        ...booth,
        gridPosition: {
          row: position.row,
          col: position.col,
          colSpan: position.colSpan
        }
      };
    }
  });
  
  return gridBooths;
}
export function convertRBFSectorToGrid(booths: { [key: string]: CoordinateBooth }): { [key: string]: GridBooth } {
  console.log('🎯 convertRBFSectorToGrid called with', Object.keys(booths).length, 'booths');
  const gridBooths: { [key: string]: GridBooth } = {};
  
  const boothMapping: { [key: string]: { row: number; col: number } } = {
    // GROUP 1 - Columns 1-2 (no gap between them)
    // Upper section - Rows 1-2
    'RBF101': { row: 1, col: 1 },
    'RBF102': { row: 1, col: 2 }, // Direct adjacent, no gap
    'RBF103': { row: 2, col: 1 },
    'RBF104': { row: 2, col: 2 }, // Direct adjacent, no gap
    
    // Lower section - Rows 6-9
    'RBF105': { row: 6, col: 1 },
    'RBF106': { row: 6, col: 2 }, // Direct adjacent, no gap
    'RBF107': { row: 7, col: 1 },
    'RBF108': { row: 7, col: 2 }, // Direct adjacent, no gap
    'RBF109': { row: 8, col: 1 },
    'RBF110': { row: 8, col: 2 }, // Direct adjacent, no gap
    'RBF111': { row: 9, col: 1 },
    'RBF112': { row: 9, col: 2 }, // Direct adjacent, no gap
    
    // GROUP 2 - Columns 4-5 (column 3 is the gap)
    // Upper section - Rows 1-2
    'RBF201': { row: 1, col: 4 }, // Changed from col: 4 to col: 4
    'RBF202': { row: 1, col: 5 }, // Changed from col: 5 to col: 5
    'RBF203': { row: 2, col: 4 },
    'RBF204': { row: 2, col: 5 },
    
    // Lower section - Rows 6-9
    'RBF205': { row: 6, col: 4 },
    'RBF206': { row: 6, col: 5 },
    'RBF207': { row: 7, col: 4 },
    'RBF208': { row: 7, col: 5 },
    'RBF209': { row: 8, col: 4 },
    'RBF210': { row: 8, col: 5 },
    'RBF211': { row: 9, col: 4 },
    'RBF212': { row: 9, col: 5 },
  };
  
  Object.entries(booths).forEach(([boothId, booth]) => {
    const position = boothMapping[boothId];
    
    if (position) {
      gridBooths[boothId] = {
        ...booth,
        gridPosition: position
      };
      console.log(`✅ Mapped ${boothId} to row ${position.row}, col ${position.col}`);
    } else {
      console.warn(`❌ No mapping found for booth ${boothId}`);
    }
  });
  
  console.log('🎯 convertRBFSectorToGrid complete. Mapped', Object.keys(gridBooths).length, 'booths');
  
  return gridBooths;
}
export function convertCOGSectorToGrid(booths: { [key: string]: CoordinateBooth }): { [key: string]: GridBooth } {
  console.log('🎯 convertCOGSectorToGrid called with', Object.keys(booths).length, 'booths');
  const gridBooths: { [key: string]: GridBooth } = {};
  
  const boothMapping: { [key: string]: { row: number; col: number } } = {
    // GROUP 1 - Single column (4 booths)
    // Upper section
    'COG101': { row: 1, col: 1 },
    'COG102': { row: 2, col: 1 },
    // Lower section
    'COG103': { row: 4, col: 1 },
    'COG104': { row: 5, col: 1 },
    
    // GROUP 2 - Double column (8 booths)
    // Upper section
    'COG201': { row: 1, col: 3 },
    'COG202': { row: 1, col: 4 },
    'COG203': { row: 2, col: 3 },
    'COG204': { row: 2, col: 4 },
    // Lower section
    'COG205': { row: 4, col: 3 },
    'COG206': { row: 4, col: 4 },
    'COG207': { row: 5, col: 3 },
    'COG208': { row: 5, col: 4 },
    
    // GROUP 3 - Double column (8 booths)
    // Upper section
    'COG301': { row: 1, col: 6 },
    'COG302': { row: 1, col: 7 },
    'COG303': { row: 2, col: 6 },
    'COG304': { row: 2, col: 7 },
    // Lower section
    'COG305': { row: 4, col: 6 },
    'COG306': { row: 4, col: 7 },
    'COG307': { row: 5, col: 6 },
    'COG308': { row: 5, col: 7 },
    
    // GROUP 4 - Double column (8 booths)
    // Upper section
    'COG401': { row: 1, col: 9 },
    'COG402': { row: 1, col: 10 },
    'COG403': { row: 2, col: 9 },
    'COG404': { row: 2, col: 10 },
    // Lower section
    'COG405': { row: 4, col: 9 },
    'COG406': { row: 4, col: 10 },
    'COG407': { row: 5, col: 9 },
    'COG408': { row: 5, col: 10 },
    
    // GROUP 5 - Double column (8 booths)
    // Upper section
    'COG501': { row: 1, col: 12 },
    'COG502': { row: 1, col: 13 },
    'COG503': { row: 2, col: 12 },
    'COG504': { row: 2, col: 13 },
    // Lower section
    'COG505': { row: 4, col: 12 },
    'COG506': { row: 4, col: 13 },
    'COG507': { row: 5, col: 12 },
    'COG508': { row: 5, col: 13 },
    
    // GROUP 6 - Double column (8 booths)
    // Upper section
    'COG601': { row: 1, col: 15 },
    'COG602': { row: 1, col: 16 },
    'COG603': { row: 2, col: 15 },
    'COG604': { row: 2, col: 16 },
    // Lower section
    'COG605': { row: 4, col: 15 },
    'COG606': { row: 4, col: 16 },
    'COG607': { row: 5, col: 15 },
    'COG608': { row: 5, col: 16 },
    
    // GROUP 7 - Special layout (6 booths)
    // Upper section
    'COG701': { row: 1, col: 18 },
    'COG702': { row: 1, col: 19 },
    'COG703': { row: 2, col: 18 },
    'COG704': { row: 2, col: 19 },
    // Lower section (single column)
    'COG705': { row: 4, col: 18 },
    'COG706': { row: 5, col: 18 }
  };
  
  Object.entries(booths).forEach(([boothId, booth]) => {
    const position = boothMapping[boothId];
    
    if (position) {
      gridBooths[boothId] = {
        ...booth,
        gridPosition: position
      };
      console.log(`✅ Mapped ${boothId} to row ${position.row}, col ${position.col}`);
    } else {
      console.warn(`❌ No mapping found for booth ${boothId}`);
    }
  });
  
  console.log('🎯 convertCOGSectorToGrid complete. Mapped', Object.keys(gridBooths).length, 'booths');
  
  return gridBooths;
}
export function convertTASectorToGrid(booths: { [key: string]: CoordinateBooth }): { [key: string]: GridBooth } {
  console.log('🎯 convertTASectorToGrid called with', Object.keys(booths).length, 'booths');
  const gridBooths: { [key: string]: GridBooth } = {};
  
  const boothMapping: { [key: string]: { row: number; col: number } } = {
    // ... continuing from Group 3
    // GROUP 1 - Columns 1-2
    // Upper section (Rows 1-5)
    'TA101': { row: 1, col: 1 },
    'TA102': { row: 1, col: 2 },
    'TA103': { row: 2, col: 1 },
    'TA104': { row: 2, col: 2 },
    'TA105': { row: 3, col: 1 },
    'TA106': { row: 3, col: 2 },
    'TA107': { row: 4, col: 1 },
    'TA108': { row: 4, col: 2 },
    'TA109': { row: 5, col: 1 },
    'TA110': { row: 5, col: 2 },
    
    // Row 6 is horizontal passage
    
    // Lower section (Rows 7-12)
    'TA111': { row: 7, col: 1 },
    'TA112': { row: 7, col: 2 },
    'TA113': { row: 8, col: 1 },
    'TA114': { row: 8, col: 2 },
    'TA115': { row: 9, col: 1 },
    'TA116': { row: 9, col: 2 },
    'TA117': { row: 10, col: 1 },
    'TA118': { row: 10, col: 2 },
    'TA119': { row: 11, col: 1 },
    'TA120': { row: 11, col: 2 },
    'TA121': { row: 12, col: 1 },
    'TA122': { row: 12, col: 2 },


    // GROUP 2 - Columns 4-5 (column 3 is vertical passage)
    // Upper section
    'TA201': { row: 1, col: 4 },
    'TA202': { row: 1, col: 5 },
    'TA203': { row: 2, col: 4 },
    'TA204': { row: 2, col: 5 },
    'TA205': { row: 3, col: 4 },
    'TA206': { row: 3, col: 5 },
    'TA207': { row: 4, col: 4 },
    'TA208': { row: 4, col: 5 },
    'TA209': { row: 5, col: 4 },
    'TA210': { row: 5, col: 5 },
    
    // Lower section
    'TA211': { row: 7, col: 4 },
    'TA212': { row: 7, col: 5 },
    'TA213': { row: 8, col: 4 },
    'TA214': { row: 8, col: 5 },
    'TA215': { row: 9, col: 4 },
    'TA216': { row: 9, col: 5 },
    'TA217': { row: 10, col: 4 },
    'TA218': { row: 10, col: 5 },
    'TA219': { row: 11, col: 4 },
    'TA220': { row: 11, col: 5 },
    'TA221': { row: 12, col: 4 },
    'TA222': { row: 12, col: 5 },
    // GROUP 3 - Columns 7-8 (column 6 is vertical passage)
    // Upper section
    'TA301': { row: 1, col: 7 },
    'TA302': { row: 1, col: 8 },
    'TA303': { row: 2, col: 7 },
    'TA304': { row: 2, col: 8 },
    'TA305': { row: 3, col: 7 },
    'TA306': { row: 3, col: 8 },
    'TA307': { row: 4, col: 7 },
    'TA308': { row: 4, col: 8 },
    'TA309': { row: 5, col: 7 },
    'TA310': { row: 5, col: 8 },
    
    // Lower section
    'TA311': { row: 7, col: 7 },
    'TA312': { row: 7, col: 8 },
    'TA313': { row: 8, col: 7 },
    'TA314': { row: 8, col: 8 },
    'TA315': { row: 9, col: 7 },
    'TA316': { row: 9, col: 8 },
    'TA317': { row: 10, col: 7 },
    'TA318': { row: 10, col: 8 },
    'TA319': { row: 11, col: 7 },
    'TA320': { row: 11, col: 8 },
    'TA321': { row: 12, col: 7 },
    'TA322': { row: 12, col: 8 },
    
    // GROUP 4 - Columns 10-11 (column 9 is vertical passage)
    // Upper section
    'TA401': { row: 1, col: 10 },
    'TA402': { row: 1, col: 11 },
    'TA403': { row: 2, col: 10 },
    'TA404': { row: 2, col: 11 },
    'TA405': { row: 3, col: 10 },
    'TA406': { row: 3, col: 11 },
    'TA407': { row: 4, col: 10 },
    'TA408': { row: 4, col: 11 },
    'TA409': { row: 5, col: 10 },
    'TA410': { row: 5, col: 11 },
    
    // Lower section
    'TA411': { row: 7, col: 10 },
    'TA412': { row: 7, col: 11 },
    'TA413': { row: 8, col: 10 },
    'TA414': { row: 8, col: 11 },
    'TA415': { row: 9, col: 10 },
    'TA416': { row: 9, col: 11 },
    'TA417': { row: 10, col: 10 },
    'TA418': { row: 10, col: 11 },
    'TA419': { row: 11, col: 10 },
    'TA420': { row: 11, col: 11 },
    'TA421': { row: 12, col: 10 },
    'TA422': { row: 12, col: 11 },
    
    // GROUP 5 - Columns 13-14 (column 12 is vertical passage)
    // Upper section
    'TA501': { row: 1, col: 13 },
    'TA502': { row: 1, col: 14 },
    'TA503': { row: 2, col: 13 },
    'TA504': { row: 2, col: 14 },
    'TA505': { row: 3, col: 13 },
    'TA506': { row: 3, col: 14 },
    'TA507': { row: 4, col: 13 },
    'TA508': { row: 4, col: 14 },
    'TA509': { row: 5, col: 13 },
    'TA510': { row: 5, col: 14 },
    
    // Lower section
    'TA511': { row: 7, col: 13 },
    'TA512': { row: 7, col: 14 },
    'TA513': { row: 8, col: 13 },
    'TA514': { row: 8, col: 14 },
    'TA515': { row: 9, col: 13 },
    'TA516': { row: 9, col: 14 },
    'TA517': { row: 10, col: 13 },
    'TA518': { row: 10, col: 14 },
    'TA519': { row: 11, col: 13 },
    'TA520': { row: 11, col: 14 },
    'TA521': { row: 12, col: 13 },
    'TA522': { row: 12, col: 14 },
    
    // GROUP 6 - Columns 16-17 (column 15 is vertical passage)
    // Upper section
    'TA601': { row: 1, col: 16 },
    'TA602': { row: 1, col: 17 },
    'TA603': { row: 2, col: 16 },
    'TA604': { row: 2, col: 17 },
    'TA605': { row: 3, col: 16 },
    'TA606': { row: 3, col: 17 },
    'TA607': { row: 4, col: 16 },
    'TA608': { row: 4, col: 17 },
    'TA609': { row: 5, col: 16 },
    'TA610': { row: 5, col: 17 },
    
    // Lower section
    'TA611': { row: 7, col: 16 },
    'TA612': { row: 7, col: 17 },
    'TA613': { row: 8, col: 16 },
    'TA614': { row: 8, col: 17 },
    'TA615': { row: 9, col: 16 },
    'TA616': { row: 9, col: 17 },
    'TA617': { row: 10, col: 16 },
    'TA618': { row: 10, col: 17 },
    'TA619': { row: 11, col: 16 },
    'TA620': { row: 11, col: 17 },
    'TA621': { row: 12, col: 16 },
    'TA622': { row: 12, col: 17 }
  };
  
  // Map booths to grid positions
  Object.entries(booths).forEach(([boothId, booth]) => {
    const position = boothMapping[boothId];
    
    if (position) {
      gridBooths[boothId] = {
        ...booth,
        gridPosition: position
      };
      console.log(`✅ Mapped ${boothId} to row ${position.row}, col ${position.col}`);
    } else {
      console.warn(`❌ No mapping found for booth ${boothId}`);
    }
  });
  
  console.log('🎯 convertTASectorToGrid complete. Mapped', Object.keys(gridBooths).length, 'booths');
  
  return gridBooths;
}

// Convert Africa Hall booth IDs to grid positions
export function convertAfricaHallToGrid(booths: { [key: string]: CoordinateBooth }): { [key: string]: GridBooth } {
  const gridBooths: { [key: string]: GridBooth } = {};
  
  // Map booths according to the actual Africa Hall layout
  // Column 1: N-series left side (N001-N016)
  // Columns 3-4: S-series middle area in 2x13 grid
  // Column 6: N-series right side (N043-N058)
  
const boothMapping: { [key: string]: { row: number; col: number } } = {
    // Left column - N booths (Column 1) - NO CHANGES, continuous
    'N016': { row: 1, col: 1 },
    'N015': { row: 2, col: 1 },
    'N014': { row: 3, col: 1 },
    'N013': { row: 4, col: 1 },
    'N012': { row: 5, col: 1 },
    'N011': { row: 6, col: 1 },
    'N010': { row: 7, col: 1 },
    'N009': { row: 8, col: 1 },
    'N008': { row: 9, col: 1 },  // Keep original - no corridor here
    'N007': { row: 10, col: 1 },
    'N006': { row: 11, col: 1 },
    'N005': { row: 12, col: 1 },
    'N004': { row: 13, col: 1 },
    'N003': { row: 14, col: 1 },
    'N002': { row: 15, col: 1 },
    'N001': { row: 16, col: 1 },
    
    // Middle area - S booths arranged in 2x13 grid
    // Left sub-column (Column 3) - UPPER SECTION
    'S029': { row: 2, col: 3 },
    'S028': { row: 3, col: 3 },
    'S027': { row: 4, col: 3 },
    'S026': { row: 5, col: 3 },
    'S025': { row: 6, col: 3 },
    'S024': { row: 7, col: 3 },
    'S023': { row: 8, col: 3 },
    // CORRIDOR at row 9 (only for columns 3-4)
    // Left sub-column (Column 3) - LOWER SECTION (shifted down by 1)
    'S022': { row: 10, col: 3 },
    'S021': { row: 11, col: 3 },
    'S020': { row: 12, col: 3 },
    'S019': { row: 13, col: 3 },
    'S018': { row: 14, col: 3 },
    'S017': { row: 15, col: 3 },
    
    // Right sub-column (Column 4) - UPPER SECTION
    'S042': { row: 2, col: 4 },
    'S041': { row: 3, col: 4 },
    'S040': { row: 4, col: 4 },
    'S039': { row: 5, col: 4 },
    'S038': { row: 6, col: 4 },
    'S037': { row: 7, col: 4 },
    'S036': { row: 8, col: 4 },
    // CORRIDOR at row 9 (only for columns 3-4)
    // Right sub-column (Column 4) - LOWER SECTION (shifted down by 1)
    'S035': { row: 10, col: 4 },
    'S034': { row: 11, col: 4 },
    'S033': { row: 12, col: 4 },
    'S032': { row: 13, col: 4 },
    'S031': { row: 14, col: 4 },
    'S030': { row: 15, col: 4 },
    
    // Right column - N booths (Column 6) - NO CHANGES, continuous
    'N058': { row: 1, col: 6 },
    'N057': { row: 2, col: 6 },
    'N056': { row: 3, col: 6 },
    'N055': { row: 4, col: 6 },
    'N054': { row: 5, col: 6 },
    'N053': { row: 6, col: 6 },
    'N052': { row: 7, col: 6 },
    'N051': { row: 8, col: 6 },
    'N050': { row: 9, col: 6 },  // Keep original - no corridor here
    'N049': { row: 10, col: 6 },
    'N048': { row: 11, col: 6 },
    'N047': { row: 12, col: 6 },
    'N046': { row: 13, col: 6 },
    'N045': { row: 14, col: 6 },
    'N044': { row: 15, col: 6 },
    'N043': { row: 16, col: 6 },
};
  
  Object.entries(booths).forEach(([boothId, booth]) => {
    const position = boothMapping[boothId];
    
    if (position) {
      gridBooths[boothId] = {
        ...booth,
        gridPosition: position
      };
    } else {
      // Fallback for any unmapped booths
      console.warn(`Booth ${boothId} not found in mapping`);
      gridBooths[boothId] = {
        ...booth,
        gridPosition: { row: 1, col: 1 }
      };
    }
  });
  
  return gridBooths;
}

export function convertEEISectorToGrid(booths: { [key: string]: CoordinateBooth }): { [key: string]: GridBooth } {
  console.log('🎯 convertEEISectorToGrid called with', Object.keys(booths).length, 'booths');
  const gridBooths: { [key: string]: GridBooth } = {};
  
  const boothMapping: { [key: string]: { row: number; col: number } } = {
    // Group 1 - Column 1
    'EEI101': { row: 1, col: 1 },
    'EEI102': { row: 2, col: 1 },
    'EEI103': { row: 3, col: 1 },
    'EEI104': { row: 4, col: 1 },
    
    // Group 2 - Columns 3-4
    'EEI201': { row: 1, col: 3 },
    'EEI202': { row: 2, col: 3 },
    'EEI203': { row: 3, col: 3 },
    'EEI204': { row: 4, col: 3 },
    'EEI205': { row: 1, col: 4 },
    'EEI206': { row: 2, col: 4 },
    'EEI207': { row: 3, col: 4 },
    'EEI208': { row: 4, col: 4 },
    
    // Group 3 - Columns 6-7
    'EEI301': { row: 1, col: 6 },
    'EEI302': { row: 2, col: 6 },
    'EEI303': { row: 3, col: 6 },
    'EEI304': { row: 4, col: 6 },
    'EEI305': { row: 1, col: 7 },
    'EEI306': { row: 2, col: 7 },
    'EEI307': { row: 3, col: 7 },
    'EEI308': { row: 4, col: 7 },
    
    // Group 4 - Columns 9-10
    'EEI401': { row: 1, col: 9 },
    'EEI402': { row: 2, col: 9 },
    'EEI403': { row: 3, col: 9 },
    'EEI404': { row: 4, col: 9 },
    'EEI405': { row: 1, col: 10 },
    'EEI406': { row: 2, col: 10 },
    'EEI407': { row: 3, col: 10 },
    'EEI408': { row: 4, col: 10 },
    
    // Group 5 - Columns 12-13
    'EEI501': { row: 1, col: 12 },
    'EEI502': { row: 2, col: 12 },
    'EEI503': { row: 3, col: 12 },
    'EEI504': { row: 4, col: 12 },
    'EEI505': { row: 1, col: 13 },
    'EEI506': { row: 2, col: 13 },
    'EEI507': { row: 3, col: 13 },
    'EEI508': { row: 4, col: 13 },
    
    // Group 6 - Columns 15-16
    'EEI601': { row: 1, col: 15 },
    'EEI602': { row: 2, col: 15 },
    'EEI603': { row: 3, col: 15 },
    'EEI604': { row: 4, col: 15 },
    'EEI605': { row: 1, col: 16 },
    'EEI606': { row: 2, col: 16 },
    'EEI607': { row: 3, col: 16 },
    'EEI608': { row: 4, col: 16 },
    
    // Group 7 - Columns 18-19
    'EEI701': { row: 1, col: 18 },
    'EEI702': { row: 2, col: 18 },
    'EEI703': { row: 3, col: 18 },
    'EEI704': { row: 4, col: 18 },
    'EEI705': { row: 1, col: 19 },
    'EEI706': { row: 2, col: 19 },
    'EEI707': { row: 3, col: 19 },
    'EEI708': { row: 4, col: 19 },
    
    // Group 8 - Columns 21-22
    'EEI801': { row: 1, col: 21 },
    'EEI802': { row: 2, col: 21 },
    'EEI803': { row: 3, col: 21 },
    'EEI804': { row: 4, col: 21 },
    'EEI805': { row: 1, col: 22 },
    'EEI806': { row: 2, col: 22 },
    'EEI807': { row: 3, col: 22 },
    'EEI808': { row: 4, col: 22 },
    
    // Group 9 - Columns 24-25
    'EEI901': { row: 1, col: 24 },
    'EEI902': { row: 2, col: 24 },
    'EEI903': { row: 3, col: 24 },
    'EEI904': { row: 4, col: 24 },
    'EEI905': { row: 1, col: 25 },
    'EEI906': { row: 2, col: 25 },
    'EEI907': { row: 3, col: 25 },
    'EEI908': { row: 4, col: 25 }
  };
  
  Object.entries(booths).forEach(([boothId, booth]) => {
    const position = boothMapping[boothId];
    
    if (position) {
      gridBooths[boothId] = {
        ...booth,
        gridPosition: position
      };
      console.log(`✅ Mapped ${boothId} to row ${position.row}, col ${position.col}`);
    } else {
      console.warn(`❌ No mapping found for booth ${boothId}`);
    }
  });
  
  console.log('🎯 convertEEISectorToGrid complete. Mapped', Object.keys(gridBooths).length, 'booths');
  
  return gridBooths;
}

// Convert Hall B booth IDs to grid positions
export function convertHallBToGrid(booths: { [key: string]: CoordinateBooth }): { [key: string]: GridBooth } {
  console.log('🎯 convertHallBToGrid called with', Object.keys(booths).length, 'booths');
  const gridBooths: { [key: string]: GridBooth } = {};
  
  // Complete mapping for Hall B (95 booths)
  const boothMapping: { [key: string]: { row: number; col: number } } = {
    // Column 1 - Left single column (17 booths)
    'N017': { row: 1, col: 1 },
    'N016': { row: 2, col: 1 },
    'N015': { row: 3, col: 1 },
    'N014': { row: 4, col: 1 },
    'N013': { row: 5, col: 1 },
    'N012': { row: 6, col: 1 },
    'N011': { row: 7, col: 1 },
    // Row 8 is horizontal passage
    'N010': { row: 9, col: 1 },
    'N009': { row: 10, col: 1 },
    'N008': { row: 11, col: 1 },
    'N007': { row: 12, col: 1 },
    'N006': { row: 13, col: 1 },
    'N005': { row: 14, col: 1 },
    'N004': { row: 15, col: 1 },
    'N003': { row: 16, col: 1 },
    'N002': { row: 17, col: 1 },
    'N001': { row: 18, col: 1 },
    
    // Column 2a (Grid column 3) - 15 booths
    'N032': { row: 2, col: 3 },
    'N031': { row: 3, col: 3 },
    'N030': { row: 4, col: 3 },
    'N029': { row: 5, col: 3 },
    'N028': { row: 6, col: 3 },
    'N027': { row: 7, col: 3 },
    // Row 8 is horizontal passage
    'N026': { row: 9, col: 3 },
    'N025': { row: 10, col: 3 },
    'N024': { row: 11, col: 3 },
    'N023': { row: 12, col: 3 },
    'N022': { row: 13, col: 3 },
    'N021': { row: 14, col: 3 },
    'N020': { row: 15, col: 3 },
    'N019': { row: 16, col: 3 },
    'N018': { row: 17, col: 3 },
    
    // Column 2b (Grid column 4) - 15 booths
    'N047': { row: 2, col: 4 },
    'N046': { row: 3, col: 4 },
    'N045': { row: 4, col: 4 },
    'N044': { row: 5, col: 4 },
    'N043': { row: 6, col: 4 },
    'N042': { row: 7, col: 4 },
    // Row 8 is horizontal passage
    'N041': { row: 9, col: 4 },
    'N040': { row: 10, col: 4 },
    'N039': { row: 11, col: 4 },
    'N038': { row: 12, col: 4 },
    'N037': { row: 13, col: 4 },
    'N036': { row: 14, col: 4 },
    'N035': { row: 15, col: 4 },
    'N034': { row: 16, col: 4 },
    'N033': { row: 17, col: 4 },
    
    // Column 3a (Grid column 6) - 15 booths
    'N062': { row: 2, col: 6 },
    'N061': { row: 3, col: 6 },
    'N060': { row: 4, col: 6 },
    'N059': { row: 5, col: 6 },
    'N058': { row: 6, col: 6 },
    'N057': { row: 7, col: 6 },
    // Row 8 is horizontal passage
    'N056': { row: 9, col: 6 },
    'N055': { row: 10, col: 6 },
    'N054': { row: 11, col: 6 },
    'N053': { row: 12, col: 6 },
    'N052': { row: 13, col: 6 },
    'N051': { row: 14, col: 6 },
    'N050': { row: 15, col: 6 },
    'N049': { row: 16, col: 6 },
    'N048': { row: 17, col: 6 },
    
    // Column 3b (Grid column 7) - 15 booths
    'N077': { row: 2, col: 7 },
    'N076': { row: 3, col: 7 },
    'N075': { row: 4, col: 7 },
    'N074': { row: 5, col: 7 },
    'N073': { row: 6, col: 7 },
    'N072': { row: 7, col: 7 },
    // Row 8 is horizontal passage
    'N071': { row: 9, col: 7 },
    'N070': { row: 10, col: 7 },
    'N069': { row: 11, col: 7 },
    'N068': { row: 12, col: 7 },
    'N067': { row: 13, col: 7 },
    'N066': { row: 14, col: 7 },
    'N065': { row: 15, col: 7 },
    'N064': { row: 16, col: 7 },
    'N063': { row: 17, col: 7 },
    
    // Column 4 (Grid column 9) - CONTINUOUS 18 booths
    'N095': { row: 1, col: 9 },
    'N094': { row: 2, col: 9 },
    'N093': { row: 3, col: 9 },
    'N092': { row: 4, col: 9 },
    'N091': { row: 5, col: 9 },
    'N090': { row: 6, col: 9 },
    'N089': { row: 7, col: 9 },
    'N088': { row: 8, col: 9 }, // This booth exists at passage row
    'N087': { row: 9, col: 9 },
    'N086': { row: 10, col: 9 },
    'N085': { row: 11, col: 9 },
    'N084': { row: 12, col: 9 },
    'N083': { row: 13, col: 9 },
    'N082': { row: 14, col: 9 },
    'N081': { row: 15, col: 9 },
    'N080': { row: 16, col: 9 },
    'N079': { row: 17, col: 9 },
    'N078': { row: 18, col: 9 }
  };
  
  Object.entries(booths).forEach(([boothId, booth]) => {
    const position = boothMapping[boothId];
    
    if (position) {
      gridBooths[boothId] = {
        ...booth,
        gridPosition: position
      };
      console.log(`✅ Mapped ${boothId} to row ${position.row}, col ${position.col}`);
    } else {
      console.warn(`❌ No mapping found for booth ${boothId}`);
    }
  });
  
  console.log('🎯 convertHallBToGrid complete. Mapped', Object.keys(gridBooths).length, 'booths');
  
  return gridBooths;
}

// Generic converter for other halls/sectors
export function convertBoothsToGrid(
  booths: { [key: string]: CoordinateBooth },
  layoutName: string
): { [key: string]: GridBooth } {
  console.log('🎯 convertBoothsToGrid called for:', layoutName);
  
  // Use specific converters for known layouts
  if (layoutName === 'Africa Hall') {
    return convertAfricaHallToGrid(booths);
  } else if (layoutName === 'Hall A') {
    console.log('🎯 Using Hall A converter');
    return convertHallAToGrid(booths);
  } else if (layoutName === 'Hall B') {
    console.log('🎯 Using Hall B converter');
    return convertHallBToGrid(booths);
  }else if (layoutName === 'ICT & Electronics Products' || layoutName === 'EEI Sector') {
  console.log('🎯 Using EEI Sector converter');
  return convertEEISectorToGrid(booths);
}else if (layoutName === 'Food, Drinks, Agriculture & Allied Products' || layoutName === 'FDA Sector') {
    console.log('🎯 Using FDA Sector converter');
    return convertFDASectorToGrid(booths);
  } else if (layoutName === 'Real Estate, Building Furniture & Fittings' || layoutName === 'RBF Sector') {
    console.log('🎯 Using RBF Sector converter');
    return convertRBFSectorToGrid(booths);
  }else if (layoutName === 'Household Cosmetics & Textile Products' || layoutName === 'HCT Sector') {
  console.log('🎯 Using HCT Sector converter');
  return convertHCTSectorToGrid(booths);

}else if (layoutName === 'Publication, Healthcare & Sport Products' || layoutName === 'OTH Sector' || layoutName === 'PHS Sector') {
    console.log('🎯 Using OTH Sector converter');
    return convertOTHSectorToGrid(booths);
  }else if (layoutName === 'Transport and Allied/Power Products' || layoutName === 'TA Sector') {
  console.log('🎯 Using TA Sector converter');
  return convertTASectorToGrid(booths);

  }else if (layoutName === 'Conglomerate' || layoutName === 'COG Sector') {
  console.log('🎯 Using conglomerateSector converter');
  return convertCOGSectorToGrid(booths);
}else if (layoutName === 'Corporate Organizations & Government Agencies' || layoutName === 'CGA Sector') {
  console.log('🎯 Using CGA Sector converter');
  return convertCGASectorToGrid(booths);
} else if (layoutName === 'Commercial Premium' || layoutName === 'COP Sector' || layoutName.includes('COP')) {
  console.log('🎯 Using COP Sector converter');
  return convertCOPSectorToGrid(booths);
}
  
  // Generic conversion for other layouts
  console.log('⚠️ Using generic converter for:', layoutName);
  const gridBooths: { [key: string]: GridBooth } = {};
  const config = LAYOUT_CONFIGS[layoutName] || { rows: 10, columns: 10 };
  
  let currentRow = 1;
  let currentCol = 1;
  
  Object.entries(booths).forEach(([boothId, booth]) => {
    gridBooths[boothId] = {
      ...booth,
      gridPosition: {
        row: currentRow,
        col: currentCol
      }
    };
    
    currentCol++;
    if (currentCol > config.columns) {
      currentCol = 1;
      currentRow++;
    }
  });
  
  return gridBooths;
}



// Helper to determine which column a booth belongs to in Africa Hall
export function getAfricaHallBoothColumn(boothId: string): string {
  if (boothId.match(/^N0(0[1-9]|1[0-6])$/)) {
    return 'col-1'; // Left N-series column
  } else if (boothId.match(/^S0(1[7-9]|2[0-9])$/)) {
    return 'col-2a'; // Middle left S-series sub-column
  } else if (boothId.match(/^S0(3[0-9]|4[0-2])$/)) {
    return 'col-2b'; // Middle right S-series sub-column
  } else if (boothId.match(/^N0(4[3-9]|5[0-8])$/)) {
    return 'col-3'; // Right N-series column
  }
  return 'unknown';
}

// Helper to check if two booths can connect in Africa Hall
export function canBoothsConnect(booth1: string, booth2: string): boolean {
  const col1 = getAfricaHallBoothColumn(booth1);
  const col2 = getAfricaHallBoothColumn(booth2);
  
  // Booths must be in the same column or adjacent sub-columns (for S-series)
  if (col1 === col2) return true;
  
  // S-series booths can connect horizontally between sub-columns
  if ((col1 === 'col-2a' && col2 === 'col-2b') || (col1 === 'col-2b' && col2 === 'col-2a')) {
    // Check if they're in the same row
    const num1 = parseInt(booth1.substring(1));
    const num2 = parseInt(booth2.substring(1));
    
    // Map booth numbers to their row positions
    const rowMap: { [key: number]: number } = {
      17: 14, 18: 13, 19: 12, 20: 11, 21: 10, 22: 9, 23: 8,
      24: 7, 25: 6, 26: 5, 27: 4, 28: 3, 29: 2,
      30: 14, 31: 13, 32: 12, 33: 11, 34: 10, 35: 9, 36: 8,
      37: 7, 38: 6, 39: 5, 40: 4, 41: 3, 42: 2
    };
    
    return rowMap[num1] === rowMap[num2];
  }
  
  return false;
}

export function getGridConfig(layoutName: string): GridConfig {
  return LAYOUT_CONFIGS[layoutName] || {
    rows: 10,
    columns: 10,
    passages: []
  };
}
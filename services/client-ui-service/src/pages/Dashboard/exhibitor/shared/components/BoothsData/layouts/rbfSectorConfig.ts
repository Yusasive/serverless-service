// components/BoothsData/layouts/rbfSectorConfig.ts

import { LayoutConfig } from '../types/layout.types';

export const rbfSectorConfig: LayoutConfig = {
  layoutId: 'rbf-sector',
  layoutName: 'Real Estate, Building Furniture & Fittings',
  locationType: 'outdoor',
  
  columns: [
    // FIRST GROUP - DOUBLE COLUMN (Columns 1-2)
    // Upper section
    {
      columnId: 'col-1-upper',
      columnType: 'double',
      subColumns: ['col-1', 'col-2'],
      boothRange: ['RBF101', 'RBF103'], // 2 booths in column
      numberingOrder: 'ascending',
      isolatedFromOthers: false,
      sectionId: 'group-1-upper'
    },
    {
      columnId: 'col-2-upper',
      columnType: 'double',
      subColumns: ['col-1', 'col-2'],
      boothRange: ['RBF102', 'RBF104'], // 2 booths in column
      numberingOrder: 'ascending',
      isolatedFromOthers: false,
      sectionId: 'group-1-upper'
    },
    // Lower section
    {
      columnId: 'col-1-lower',
      columnType: 'double',
      subColumns: ['col-1', 'col-2'],
      boothRange: ['RBF105', 'RBF107', 'RBF109', 'RBF111'], // 4 booths in column
      numberingOrder: 'ascending',
      isolatedFromOthers: false,
      sectionId: 'group-1-lower'
    },
    {
      columnId: 'col-2-lower',
      columnType: 'double',
      subColumns: ['col-1', 'col-2'],
      boothRange: ['RBF106', 'RBF108', 'RBF110', 'RBF112'], // 4 booths in column
      numberingOrder: 'ascending',
      isolatedFromOthers: false,
      sectionId: 'group-1-lower'
    },
    
    // SECOND GROUP - DOUBLE COLUMN (Columns 4-5)
    // Upper section
    {
      columnId: 'col-4-upper',
      columnType: 'double',
      subColumns: ['col-4', 'col-5'],
      boothRange: ['RBF201', 'RBF203'], // 2 booths in column
      numberingOrder: 'ascending',
      isolatedFromOthers: false,
      sectionId: 'group-2-upper'
    },
    {
      columnId: 'col-5-upper',
      columnType: 'double',
      subColumns: ['col-4', 'col-5'],
      boothRange: ['RBF202', 'RBF204'], // 2 booths in column
      numberingOrder: 'ascending',
      isolatedFromOthers: false,
      sectionId: 'group-2-upper'
    },
    // Lower section
    {
      columnId: 'col-4-lower',
      columnType: 'double',
      subColumns: ['col-4', 'col-5'],
      boothRange: ['RBF205', 'RBF207', 'RBF209', 'RBF211'], // 4 booths in column
      numberingOrder: 'ascending',
      isolatedFromOthers: false,
      sectionId: 'group-2-lower'
    },
    {
      columnId: 'col-5-lower',
      columnType: 'double',
      subColumns: ['col-4', 'col-5'],
      boothRange: ['RBF206', 'RBF208', 'RBF210', 'RBF212'], // 4 booths in column
      numberingOrder: 'ascending',
      isolatedFromOthers: false,
      sectionId: 'group-2-lower'
    }
  ],
  
  passages: [
    // Horizontal corridor (rows 3-5) - full length
    {
      passageId: 'horizontal-corridor',
      type: 'corridor',
      separates: ['group-1-upper', 'group-1-lower', 'group-2-upper', 'group-2-lower'],
      blocksSequential: true,
      coordinates: [[0, 300], [600, 500]], // Rows 3-5 full span
      description: 'Main corridor between upper and lower sections (rows 3-5)',
      isVisible: true
    },
    // Vertical separator between groups (invisible)
    {
      passageId: 'vertical-group-separator',
      type: 'main-aisle',
      separates: ['group-1-upper', 'group-1-lower', 'group-2-upper', 'group-2-lower'],
      blocksSequential: true,
      coordinates: [[300, 0], [300, 900]], // Between columns 2 and 4
      description: 'Separator between Group 1 and Group 2',
      isVisible: false // Invisible but blocks cross-group selection
    }
  ],
  
  specialBooths: [],
  
  sequentialRules: {
    allowedConnections: {
      // GROUP 1 - UPPER SECTION
      'RBF101': ['RBF102', 'RBF103'], // Right and down
      'RBF102': ['RBF101', 'RBF104'], // Left and down
      'RBF103': ['RBF101', 'RBF104'], // Up and right
      'RBF104': ['RBF102', 'RBF103'], // Left and up
      // No connection from RBF103/104 to RBF105/106 (corridor blocks)
      
      // GROUP 1 - LOWER SECTION
      'RBF105': ['RBF106', 'RBF107'], // Right and down
      'RBF106': ['RBF105', 'RBF108'], // Left and down
      'RBF107': ['RBF105', 'RBF108', 'RBF109'], // Up, right, and down
      'RBF108': ['RBF106', 'RBF107', 'RBF110'], // Left, up, and down
      'RBF109': ['RBF107', 'RBF110', 'RBF111'], // Up, right, and down
      'RBF110': ['RBF108', 'RBF109', 'RBF112'], // Left, up, and down
      'RBF111': ['RBF109', 'RBF112'], // Up and right
      'RBF112': ['RBF110', 'RBF111'], // Left and up
      
      // GROUP 2 - UPPER SECTION
      'RBF201': ['RBF202', 'RBF203'], // Right and down
      'RBF202': ['RBF201', 'RBF204'], // Left and down
      'RBF203': ['RBF201', 'RBF204'], // Up and right
      'RBF204': ['RBF202', 'RBF203'], // Left and up
      // No connection from RBF203/204 to RBF205/206 (corridor blocks)
      
      // GROUP 2 - LOWER SECTION
      'RBF205': ['RBF206', 'RBF207'], // Right and down
      'RBF206': ['RBF205', 'RBF208'], // Left and down
      'RBF207': ['RBF205', 'RBF208', 'RBF209'], // Up, right, and down
      'RBF208': ['RBF206', 'RBF207', 'RBF210'], // Left, up, and down
      'RBF209': ['RBF207', 'RBF210', 'RBF211'], // Up, right, and down
      'RBF210': ['RBF208', 'RBF209', 'RBF212'], // Left, up, and down
      'RBF211': ['RBF209', 'RBF212'], // Up and right
      'RBF212': ['RBF210', 'RBF211'] // Left and up
      
      // NO CROSS-GROUP CONNECTIONS
    },
    
    columnRestrictions: {
      // Group 1 restrictions
      'col-1-upper': { allowedSubColumns: ['col-1', 'col-2'], maxContinuousSelection: 4 },
      'col-2-upper': { allowedSubColumns: ['col-1', 'col-2'], maxContinuousSelection: 4 },
      'col-1-lower': { allowedSubColumns: ['col-1', 'col-2'], maxContinuousSelection: 8 },
      'col-2-lower': { allowedSubColumns: ['col-1', 'col-2'], maxContinuousSelection: 8 },
      
      // Group 2 restrictions
      'col-4-upper': { allowedSubColumns: ['col-4', 'col-5'], maxContinuousSelection: 4 },
      'col-5-upper': { allowedSubColumns: ['col-4', 'col-5'], maxContinuousSelection: 4 },
      'col-4-lower': { allowedSubColumns: ['col-4', 'col-5'], maxContinuousSelection: 8 },
      'col-5-lower': { allowedSubColumns: ['col-4', 'col-5'], maxContinuousSelection: 8 }
    },
    
    globalRules: {
      preventCrossPassageBooking: true, // Prevents upper-lower connections
      allowRowWiseBooking: true,
      allowColumnWiseBooking: true,
      allowMixedBooking: true,
      enforceStrictAdjacency: true
    }
  },
  
  metadata: {
    totalBooths: 16,
    boothTypes: [
      {
        type: '9m²',
        count: 16,
        boothIds: [
          'RBF101', 'RBF102', 'RBF103', 'RBF104', 'RBF105', 'RBF106', 
          'RBF107', 'RBF108', 'RBF109', 'RBF110', 'RBF111', 'RBF112',
          'RBF201', 'RBF202', 'RBF203', 'RBF204', 'RBF205', 'RBF206', 
          'RBF207', 'RBF208', 'RBF209', 'RBF210', 'RBF211', 'RBF212'
        ],
        description: 'Standard 9m² outdoor sector booths'
      }
    ],
    lastUpdated: new Date().toISOString(),
    version: '1.0.0',
    validatedBy: 'System',
    notes: [
      'RBF sector has 16 booths in two separate groups',
      'Similar to FDA sector validation pattern',
      'Group 1 (RBF101-112) and Group 2 (RBF201-212) are isolated',
      'Horizontal corridor spans rows 3-5 (full length)',
      'Upper sections: 2 booths per column (2x2 layout)',
      'Lower sections: 4 booths per column (2x4 layout)',
      'No cross-group or cross-corridor bookings allowed',
      'Sequential booking allowed within same section only'
    ]
  }
};
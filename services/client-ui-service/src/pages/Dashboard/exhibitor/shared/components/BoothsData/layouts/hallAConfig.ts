// components/BoothsData/layouts/hallAConfig.ts

import { LayoutConfig } from '../types/layout.types';

export const hallAConfig: LayoutConfig = {
  layoutId: 'hall-a',
  layoutName: 'Hall A',
  locationType: 'indoor',
  
  columns: [
    // Column 1: Left Single Column (N001-N008)
    {
      columnId: 'col-1',
      columnType: 'single',
      boothRange: ['N001', 'N002', 'N003', 'N004', 'N005', 'N006', 'N007', 'N008'],
      numberingOrder: 'ascending',
      isolatedFromOthers: true,
      sectionId: 'left-section'
    },
    
    // Special Booth Section (S009)
    {
      columnId: 'col-special',
      columnType: 'single',
      boothRange: ['S009'],
      numberingOrder: 'ascending',
      isolatedFromOthers: true,
      sectionId: 'special-section'
    },
    
    // Column 2: Middle Double Column - Left Side (N010-N016)
    {
      columnId: 'col-2a',
      columnType: 'double',
      subColumns: ['col-2a', 'col-2b'],
      boothRange: ['N010', 'N011', 'N012', 'N013', 'N014', 'N015', 'N016'],
      numberingOrder: 'ascending',
      isolatedFromOthers: false, // Can connect to col-2b
      sectionId: 'middle-section'
    },
    
    // Column 2: Middle Double Column - Right Side (N017-N023)
    {
      columnId: 'col-2b',
      columnType: 'double',
      subColumns: ['col-2a', 'col-2b'],
      boothRange: ['N017', 'N018', 'N019', 'N020', 'N021', 'N022', 'N023'],
      numberingOrder: 'ascending',
      isolatedFromOthers: false, // Can connect to col-2a
      sectionId: 'middle-section'
    },
    
    // Column 3: Right Double Column - Left Side (N024-N031)
    {
      columnId: 'col-3a',
      columnType: 'double',
      subColumns: ['col-3a', 'col-3b'],
      boothRange: ['N024', 'N025', 'N026', 'N027', 'N028', 'N029', 'N030', 'N031'],
      numberingOrder: 'ascending',
      isolatedFromOthers: false, // Can connect to col-3b
      sectionId: 'right-section'
    },
    
    // Column 3: Right Double Column - Right Side (N032-N038)
    {
      columnId: 'col-3b',
      columnType: 'double',
      subColumns: ['col-3a', 'col-3b'],
      boothRange: ['N032', 'N033', 'N034', 'N035', 'N036', 'N037', 'N038'],
      numberingOrder: 'ascending',
      isolatedFromOthers: false, // Can connect to col-3a
      sectionId: 'right-section'
    },
    
    // Column 4: Far Right Single Column (N039-N047)
    {
      columnId: 'col-4',
      columnType: 'single',
      boothRange: ['N039', 'N040', 'N041', 'N042', 'N043', 'N044', 'N045', 'N046', 'N047'],
      numberingOrder: 'ascending',
      isolatedFromOthers: true,
      sectionId: 'far-right-section'
    }
  ],
  
  passages: [
    // Vertical Passage 1: Between Column 1 and Column 2
    {
      passageId: 'vertical-passage-1',
      type: 'main-aisle',
      separates: ['col-1', 'col-2a', 'col-special'],
      blocksSequential: true,
      coordinates: [[228, 195], [228, 950]], // Vertical line separating left from middle
      description: 'Main aisle between left single column and middle double columns',
      isVisible: true
    },
    
    // Vertical Passage 2: Between Column 2 and Column 3
    {
      passageId: 'vertical-passage-2',
      type: 'main-aisle',
      separates: ['col-2a', 'col-2b', 'col-3a', 'col-3b'],
      blocksSequential: true,
      coordinates: [[500, 195], [500, 950]], // Vertical line between middle and right sections
      description: 'Main aisle between middle double columns and right double columns',
      isVisible: true
    },
    
    // Vertical Passage 3: Between Column 3 and Column 4
    {
      passageId: 'vertical-passage-3',
      type: 'main-aisle',
      separates: ['col-3a', 'col-3b', 'col-4'],
      blocksSequential: true,
      coordinates: [[772, 195], [772, 950]], // Vertical line between right double and far right single
      description: 'Main aisle between right double columns and far right single column',
      isVisible: true
    },
    
    // Horizontal Passage: Middle corridor dividing upper and lower sections
    {
      passageId: 'horizontal-passage-middle',
      type: 'corridor',
      separates: ['upper-section', 'lower-section'],
      blocksSequential: true,
      coordinates: [[129, 509], [793, 509]], // Horizontal line across middle
      description: 'Horizontal corridor dividing hall into upper and lower sections',
      isVisible: true
    },
    
    // Front Door
    {
      passageId: 'front-door',
      type: 'door',
      separates: ['main-area', 'entrance'],
      blocksSequential: true,
      coordinates: [[400, 942], [500, 942]], // Front entrance
      description: 'Main entrance to Hall A',
      isVisible: true
    },
    
    // Side Door (Left)
    {
      passageId: 'side-door-left',
      type: 'door',
      separates: ['col-1', 'external'],
      blocksSequential: true,
      coordinates: [[129, 509], [129, 530]], // Left side door
      description: 'Side entrance near left column',
      isVisible: true
    },
    
    // Top Door
    {
      passageId: 'top-door',
      type: 'door',
      separates: ['col-special', 'external'],
      blocksSequential: true,
      coordinates: [[450, 164], [500, 164]], // Top entrance
      description: 'Top entrance near special booth area',
      isVisible: true
    }
  ],
  
  specialBooths: [
    {
      boothId: 'S009',
      treatAsSeparate: true,
      restrictions: ['isolated', 'different-pricing', 'no-sequential-link'],
      pricing: {
        overrideStandardPricing: true,
        customSqm: 6,
        customCategory: 'Special'
      }
    }
  ],
  
  sequentialRules: {
    // Define which booths can connect sequentially
    allowedConnections: {
      // Column 1: Only vertical connections within column, blocked by horizontal passage
      'N001': ['N002'],
      'N002': ['N001', 'N003'],
      'N003': ['N002', 'N004'],
      'N004': ['N003'], // N004 CANNOT connect to N005 due to horizontal passage
      'N005': ['N006'], // N005 CANNOT connect to N004 due to horizontal passage
      'N006': ['N005', 'N007'],
      'N007': ['N006', 'N008'],
      'N008': ['N007'], // No connection to S009 or other columns
      
      // S009: Isolated special booth
      'S009': [], // No connections allowed
      
      // Column 2a: Vertical within column + horizontal to 2b (same row), blocked by horizontal passage
      'N010': ['N011', 'N017'], // Can connect to N017 (same row, column 2b)
      'N011': ['N010', 'N012', 'N018'],
      'N012': ['N011', 'N013', 'N019'],
      'N013': ['N012', 'N020'], // N013 CANNOT connect to N014 due to horizontal passage
      'N014': ['N015', 'N021'], // N014 CANNOT connect to N013 due to horizontal passage
      'N015': ['N014', 'N016', 'N022'],
      'N016': ['N015', 'N023'],
      
      // Column 2b: Vertical within column + horizontal to 2a (same row), blocked by horizontal passage
      'N017': ['N018', 'N010'], // Can connect back to N010
      'N018': ['N017', 'N019', 'N011'],
      'N019': ['N018', 'N020', 'N012'],
      'N020': ['N019', 'N013'], // N020 CANNOT connect to N021 due to horizontal passage
      'N021': ['N022', 'N014'], // N021 CANNOT connect to N020 due to horizontal passage
      'N022': ['N021', 'N023', 'N015'],
      'N023': ['N022', 'N016'],
      
    // Column 3a connections (N024-N030)
'N030': ['N029', 'N037'], // Row 2: down to N029, right to N037
'N029': ['N030', 'N028', 'N036'], // Row 3: up/down, right to N036
'N028': ['N029', 'N035'], // Row 4: up to N029, right to N035 (no down - passage)
// Horizontal passage at row 5
'N027': ['N026', 'N034'], // Row 6: down to N026, right to N034 (no up - passage)
'N026': ['N027', 'N025', 'N033'], // Row 7: up/down, right to N033
'N025': ['N026', 'N024', 'N032'], // Row 8: up/down, right to N032
'N024': ['N025', 'N031'], // Row 9: up to N025, right to N031

// Column 3b connections (N031-N037)
'N037': ['N036', 'N030'], // Row 2: down to N036, left to N030
'N036': ['N037', 'N035', 'N029'], // Row 3: up/down, left to N029
'N035': ['N036', 'N028'], // Row 4: up to N036, left to N028 (no down - passage)
// Horizontal passage at row 5
'N034': ['N033', 'N027'], // Row 6: down to N033, left to N027 (no up - passage)
'N033': ['N034', 'N032', 'N026'], // Row 7: up/down, left to N026
'N032': ['N033', 'N031', 'N025'], // Row 8: up/down, left to N025
'N031': ['N032', 'N024'], // Row 9: up to N032, left to N024
      
      // Column 4: Only vertical connections within column, blocked by horizontal passage
      'N039': ['N040'],
      'N040': ['N039', 'N041'],
      'N041': ['N040', 'N042'],
      'N042': ['N041', 'N043'],
      'N043': ['N042'], // N043 CANNOT connect to N044 due to horizontal passage
      'N044': ['N045'], // N044 CANNOT connect to N043 due to horizontal passage
      'N045': ['N044', 'N046'],
      'N046': ['N045', 'N047'],
      'N047': ['N046']
    },
    
    columnRestrictions: {
      'col-1': { 
        isolatedColumn: true,
        maxContinuousSelection: 8
      },
      'col-special': { 
        isolatedColumn: true,
        maxContinuousSelection: 1
      },
      'col-2a': { 
        allowedSubColumns: ['col-2a', 'col-2b'],
        maxContinuousSelection: 14 // Total for both 2a and 2b
      },
      'col-2b': { 
        allowedSubColumns: ['col-2a', 'col-2b'],
        maxContinuousSelection: 14
      },
      'col-3a': { 
        allowedSubColumns: ['col-3a', 'col-3b'],
        maxContinuousSelection: 15 // Total for both 3a and 3b
      },
      'col-3b': { 
        allowedSubColumns: ['col-3a', 'col-3b'],
        maxContinuousSelection: 15
      },
      'col-4': { 
        isolatedColumn: true,
        maxContinuousSelection: 9
      }
    },
    
    globalRules: {
      preventCrossPassageBooking: true,
      allowRowWiseBooking: true, // In double columns (N010 → N017)
      allowColumnWiseBooking: true, // In double columns (N010 → N011)
      allowMixedBooking: true, // Combination of row and column
      enforceStrictAdjacency: true // Must be immediately adjacent
    }
  },
  
  metadata: {
    totalBooths: 48, // 47 N-series + 1 S-series
    boothTypes: [
      {
        type: '6m²',
        count: 1,
        boothIds: ['S009'],
        description: 'Special 6m² booth with premium positioning'
      },
      {
        type: '9m²',
        count: 47,
        boothIds: [
          'N001', 'N002', 'N003', 'N004', 'N005', 'N006', 'N007', 'N008',
          'N010', 'N011', 'N012', 'N013', 'N014', 'N015', 'N016',
          'N017', 'N018', 'N019', 'N020', 'N021', 'N022', 'N023',
          'N024', 'N025', 'N026', 'N027', 'N028', 'N029', 'N030', 'N031',
          'N032', 'N033', 'N034', 'N035', 'N036', 'N037', 'N038',
          'N039', 'N040', 'N041', 'N042', 'N043', 'N044', 'N045', 'N046', 'N047'
        ],
        description: 'Standard 9m² booths suitable for most exhibitors'
      }
    ],
    lastUpdated: new Date().toISOString(),
    version: '1.0.0',
    validatedBy: 'System',
    notes: [
      'Hall A features 4 distinct column groups with passage separation',
      'Special booth S009 is isolated and requires separate treatment',
      'Double columns allow both row-wise and column-wise booking',
      'Horizontal passage blocks connections between upper and lower sections',
      'All passages prevent cross-boundary sequential booking',
      'Configuration validated against actual Hall A layout diagram'
    ]
  }
};
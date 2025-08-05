// components/BoothsData/layouts/hallBConfig.ts

import { LayoutConfig } from '../types/layout.types';

export const hallBConfig: LayoutConfig = {
  layoutId: 'hall-b',
  layoutName: 'Hall B',
  locationType: 'indoor',
  
  columns: [
    // Column 1: Left Single Column (N001-N017)
    {
      columnId: 'col-1',
      columnType: 'single',
      boothRange: ['N001', 'N002', 'N003', 'N004', 'N005', 'N006', 'N007', 'N008', 'N009', 'N010', 'N011', 'N012', 'N013', 'N014', 'N015', 'N016', 'N017'],
      numberingOrder: 'ascending',
      isolatedFromOthers: true,
      sectionId: 'left-section'
    },
    
    // Column 2: Middle-Left Double Column - Left Side (N018-N032)
    {
      columnId: 'col-2a',
      columnType: 'double',
      subColumns: ['col-2a', 'col-2b'],
      boothRange: ['N018', 'N019', 'N020', 'N021', 'N022', 'N023', 'N024', 'N025', 'N026', 'N027', 'N028', 'N029', 'N030', 'N031', 'N032'],
      numberingOrder: 'ascending',
      isolatedFromOthers: false, // Can connect to col-2b
      sectionId: 'middle-left-section'
    },
    
    // Column 2: Middle-Left Double Column - Right Side (N033-N047)
    {
      columnId: 'col-2b',
      columnType: 'double',
      subColumns: ['col-2a', 'col-2b'],
      boothRange: ['N033', 'N034', 'N035', 'N036', 'N037', 'N038', 'N039', 'N040', 'N041', 'N042', 'N043', 'N044', 'N045', 'N046', 'N047'],
      numberingOrder: 'ascending',
      isolatedFromOthers: false, // Can connect to col-2a
      sectionId: 'middle-left-section'
    },
    
    // Column 3: Middle-Right Double Column - Left Side (N048-N062)
    {
      columnId: 'col-3a',
      columnType: 'double',
      subColumns: ['col-3a', 'col-3b'],
      boothRange: ['N048', 'N049', 'N050', 'N051', 'N052', 'N053', 'N054', 'N055', 'N056', 'N057', 'N058', 'N059', 'N060', 'N061', 'N062'],
      numberingOrder: 'ascending',
      isolatedFromOthers: false, // Can connect to col-3b
      sectionId: 'middle-right-section'
    },
    
    // Column 3: Middle-Right Double Column - Right Side (N063-N077)
    {
      columnId: 'col-3b',
      columnType: 'double',
      subColumns: ['col-3a', 'col-3b'],
      boothRange: ['N063', 'N064', 'N065', 'N066', 'N067', 'N068', 'N069', 'N070', 'N071', 'N072', 'N073', 'N074', 'N075', 'N076', 'N077'],
      numberingOrder: 'ascending',
      isolatedFromOthers: false, // Can connect to col-3a
      sectionId: 'middle-right-section'
    },
    
    // Column 4: Right Single Column (N078-N095)
    {
      columnId: 'col-4',
      columnType: 'single',
      boothRange: ['N078', 'N079', 'N080', 'N081', 'N082', 'N083', 'N084', 'N085', 'N086', 'N087', 'N088', 'N089', 'N090', 'N091', 'N092', 'N093', 'N094', 'N095'],
      numberingOrder: 'ascending',
      isolatedFromOthers: true,
      sectionId: 'right-section'
    }
  ],
  
  passages: [
    // Vertical Passage 1: Between Column 1 and Column 2
    {
      passageId: 'vertical-passage-1',
      type: 'main-aisle',
      separates: ['col-1', 'col-2a'],
      blocksSequential: true,
      coordinates: [[200, 150], [200, 900]], // Approximate vertical line
      description: 'Main aisle between left single column and middle-left double columns',
      isVisible: true
    },
    
    // Vertical Passage 2: Between Column 2 and Column 3
    {
      passageId: 'vertical-passage-2',
      type: 'main-aisle',
      separates: ['col-2a', 'col-2b', 'col-3a', 'col-3b'],
      blocksSequential: true,
      coordinates: [[400, 150], [400, 900]], // Approximate vertical line
      description: 'Main aisle between middle-left and middle-right double columns',
      isVisible: true
    },
    
    // Vertical Passage 3: Between Column 3 and Column 4
    {
      passageId: 'vertical-passage-3',
      type: 'main-aisle',
      separates: ['col-3a', 'col-3b', 'col-4'],
      blocksSequential: true,
      coordinates: [[600, 150], [600, 900]], // Approximate vertical line
      description: 'Main aisle between middle-right double columns and right single column',
      isVisible: true
    },
    
    // Horizontal Passage: Between rows 10/11 and 26/27 (and corresponding rows)
    {
      passageId: 'horizontal-passage-middle',
      type: 'corridor',
      separates: ['upper-section', 'lower-section'],
      blocksSequential: true,
      coordinates: [[100, 450], [700, 450]], // Approximate horizontal line
      description: 'Horizontal corridor dividing hall into upper and lower sections',
      isVisible: true
    },
    
    // Top Door
    {
      passageId: 'top-door',
      type: 'door',
      separates: ['main-area', 'entrance'],
      blocksSequential: true,
      coordinates: [[350, 100], [450, 100]], // Top entrance
      description: 'Top entrance to Hall B',
      isVisible: true
    },
    
    // Side Door (Left)
    {
      passageId: 'side-door-left',
      type: 'door',
      separates: ['col-1', 'external'],
      blocksSequential: true,
      coordinates: [[100, 450], [100, 470]], // Left side door
      description: 'Side entrance near left column',
      isVisible: true
    },
    
    // Bottom Door
    {
      passageId: 'bottom-door',
      type: 'door',
      separates: ['main-area', 'entrance'],
      blocksSequential: true,
      coordinates: [[350, 950], [450, 950]], // Bottom entrance
      description: 'Main front entrance to Hall B',
      isVisible: true
    }
  ],
  
  specialBooths: [], // No special booths in Hall B
  
  sequentialRules: {
    // Define which booths can connect sequentially
    allowedConnections: {
      // Column 1: Only vertical connections within column, blocked by horizontal passage
      'N001': ['N002'],
      'N002': ['N001', 'N003'],
      'N003': ['N002', 'N004'],
      'N004': ['N003', 'N005'],
      'N005': ['N004', 'N006'],
      'N006': ['N005', 'N007'],
      'N007': ['N006', 'N008'],
      'N008': ['N007', 'N009'],
      'N009': ['N008', 'N010'],
      'N010': ['N009'], // Blocked by horizontal passage
      'N011': ['N012'],
      'N012': ['N011', 'N013'],
      'N013': ['N012', 'N014'],
      'N014': ['N013', 'N015'],
      'N015': ['N014', 'N016'],
      'N016': ['N015', 'N017'],
      'N017': ['N016'],
      
      // Column 2a: Vertical within column + horizontal to 2b (same row), blocked by horizontal passage
      'N018': ['N019', 'N033'], // Can connect to N033 (same row, column 2b)
      'N019': ['N018', 'N020', 'N034'],
      'N020': ['N019', 'N021', 'N035'],
      'N021': ['N020', 'N022', 'N036'],
      'N022': ['N021', 'N023', 'N037'],
      'N023': ['N022', 'N024', 'N038'],
      'N024': ['N023', 'N025', 'N039'],
      'N025': ['N024', 'N026', 'N040'],
      'N026': ['N025', 'N041'], // Blocked by horizontal passage
      'N027': ['N028', 'N042'],
      'N028': ['N027', 'N029', 'N043'],
      'N029': ['N028', 'N030', 'N044'],
      'N030': ['N029', 'N031', 'N045'],
      'N031': ['N030', 'N032', 'N046'],
      'N032': ['N031', 'N047'],
      
      // Column 2b: Vertical within column + horizontal to 2a (same row), blocked by horizontal passage
      'N033': ['N034', 'N018'],
      'N034': ['N033', 'N035', 'N019'],
      'N035': ['N034', 'N036', 'N020'],
      'N036': ['N035', 'N037', 'N021'],
      'N037': ['N036', 'N038', 'N022'],
      'N038': ['N037', 'N039', 'N023'],
      'N039': ['N038', 'N040', 'N024'],
      'N040': ['N039', 'N041', 'N025'],
      'N041': ['N040', 'N026'], // Blocked by horizontal passage
      'N042': ['N043', 'N027'],
      'N043': ['N042', 'N044', 'N028'],
      'N044': ['N043', 'N045', 'N029'],
      'N045': ['N044', 'N046', 'N030'],
      'N046': ['N045', 'N047', 'N031'],
      'N047': ['N046', 'N032'],
      
      // Column 3a: Vertical within column + horizontal to 3b (same row), blocked by horizontal passage
      'N048': ['N049', 'N063'],
      'N049': ['N048', 'N050', 'N064'],
      'N050': ['N049', 'N051', 'N065'],
      'N051': ['N050', 'N052', 'N066'],
      'N052': ['N051', 'N053', 'N067'],
      'N053': ['N052', 'N054', 'N068'],
      'N054': ['N053', 'N055', 'N069'],
      'N055': ['N054', 'N056', 'N070'],
      'N056': ['N055', 'N071'], // Blocked by horizontal passage
      'N057': ['N058', 'N072'],
      'N058': ['N057', 'N059', 'N073'],
      'N059': ['N058', 'N060', 'N074'],
      'N060': ['N059', 'N061', 'N075'],
      'N061': ['N060', 'N062', 'N076'],
      'N062': ['N061', 'N077'],
      
      // Column 3b: Vertical within column + horizontal to 3a (same row), blocked by horizontal passage
      'N063': ['N064', 'N048'],
      'N064': ['N063', 'N065', 'N049'],
      'N065': ['N064', 'N066', 'N050'],
      'N066': ['N065', 'N067', 'N051'],
      'N067': ['N066', 'N068', 'N052'],
      'N068': ['N067', 'N069', 'N053'],
      'N069': ['N068', 'N070', 'N054'],
      'N070': ['N069', 'N071', 'N055'],
      'N071': ['N070', 'N056'], // Blocked by horizontal passage
      'N072': ['N073', 'N057'],
      'N073': ['N072', 'N074', 'N058'],
      'N074': ['N073', 'N075', 'N059'],
      'N075': ['N074', 'N076', 'N060'],
      'N076': ['N075', 'N077', 'N061'],
      'N077': ['N076', 'N062'],
      
      // Column 4: Only vertical connections within column, blocked by horizontal passage
      'N078': ['N079'],
      'N079': ['N078', 'N080'],
      'N080': ['N079', 'N081'],
      'N081': ['N080', 'N082'],
      'N082': ['N081', 'N083'],
      'N083': ['N082', 'N084'],
      'N084': ['N083', 'N085'],
      'N085': ['N084', 'N086'],
      'N086': ['N085', 'N087'],
      'N087': ['N086', 'N088'], // Connects backward to N088
      'N088': ['N087', 'N089'], // Connects both ways despite being at passage row
      'N089': ['N088', 'N090'],
      'N090': ['N089', 'N091'],
      'N091': ['N090', 'N092'],
      'N092': ['N091', 'N093'],
      'N093': ['N092', 'N094'],
      'N094': ['N093', 'N095'],
      'N095': ['N094']
    },
    
    columnRestrictions: {
      'col-1': { 
        isolatedColumn: true,
        maxContinuousSelection: 17
      },
      'col-2a': { 
        allowedSubColumns: ['col-2a', 'col-2b'],
        maxContinuousSelection: 30 // Total for both 2a and 2b
      },
      'col-2b': { 
        allowedSubColumns: ['col-2a', 'col-2b'],
        maxContinuousSelection: 30
      },
      'col-3a': { 
        allowedSubColumns: ['col-3a', 'col-3b'],
        maxContinuousSelection: 30 // Total for both 3a and 3b
      },
      'col-3b': { 
        allowedSubColumns: ['col-3a', 'col-3b'],
        maxContinuousSelection: 30
      },
      'col-4': { 
        isolatedColumn: true,
        maxContinuousSelection: 18
      }
    },
    
    globalRules: {
      preventCrossPassageBooking: true,
      allowRowWiseBooking: true, // In double columns (N018 → N033)
      allowColumnWiseBooking: true, // In double columns (N018 → N019)
      allowMixedBooking: true, // Combination of row and column
      enforceStrictAdjacency: true // Must be immediately adjacent
    }
  },
  
  metadata: {
    totalBooths: 95,
    boothTypes: [
      {
        type: '9m²',
        count: 95,
        boothIds: [
          'N001', 'N002', 'N003', 'N004', 'N005', 'N006', 'N007', 'N008', 'N009', 'N010',
          'N011', 'N012', 'N013', 'N014', 'N015', 'N016', 'N017', 'N018', 'N019', 'N020',
          'N021', 'N022', 'N023', 'N024', 'N025', 'N026', 'N027', 'N028', 'N029', 'N030',
          'N031', 'N032', 'N033', 'N034', 'N035', 'N036', 'N037', 'N038', 'N039', 'N040',
          'N041', 'N042', 'N043', 'N044', 'N045', 'N046', 'N047', 'N048', 'N049', 'N050',
          'N051', 'N052', 'N053', 'N054', 'N055', 'N056', 'N057', 'N058', 'N059', 'N060',
          'N061', 'N062', 'N063', 'N064', 'N065', 'N066', 'N067', 'N068', 'N069', 'N070',
          'N071', 'N072', 'N073', 'N074', 'N075', 'N076', 'N077', 'N078', 'N079', 'N080',
          'N081', 'N082', 'N083', 'N084', 'N085', 'N086', 'N087', 'N088', 'N089', 'N090',
          'N091', 'N092', 'N093', 'N094', 'N095'
        ],
        description: 'Standard 9m² booths suitable for most exhibitors'
      }
    ],
    lastUpdated: new Date().toISOString(),
    version: '1.0.0',
    validatedBy: 'System',
    notes: [
      'Hall B features 4 distinct column groups with passage separation',
      'All booths are standard 9m² N-series booths',
      'Double columns allow both row-wise and column-wise booking',
      'Horizontal passage divides hall into upper and lower sections',
      'All passages prevent cross-boundary sequential booking',
      'Configuration validated against actual Hall B layout diagram'
    ]
  }
};
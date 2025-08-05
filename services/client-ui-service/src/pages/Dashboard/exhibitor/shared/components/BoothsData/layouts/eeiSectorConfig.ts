// components/BoothsData/layouts/eeiSectorConfig.ts

import { LayoutConfig } from '../types/layout.types';

export const eeiSectorConfig: LayoutConfig = {
  layoutId: 'eei-sector',
  layoutName: 'ICT & Electronics Products',
  locationType: 'outdoor',
  
  columns: [
    // Column 1: Single column (EEI101-104)
    {
      columnId: 'col-1',
      columnType: 'single',
      boothRange: ['EEI101', 'EEI102', 'EEI103', 'EEI104'],
      numberingOrder: 'ascending',
      isolatedFromOthers: true,
      sectionId: 'group-1'
    },
    
    // Columns 3-4: Double column group 2 (EEI201-208)
    {
      columnId: 'col-3',
      columnType: 'double',
      subColumns: ['col-3', 'col-4'],
      boothRange: ['EEI201', 'EEI202', 'EEI203', 'EEI204'],
      numberingOrder: 'ascending',
      isolatedFromOthers: false,
      sectionId: 'group-2'
    },
    {
      columnId: 'col-4',
      columnType: 'double',
      subColumns: ['col-3', 'col-4'],
      boothRange: ['EEI205', 'EEI206', 'EEI207', 'EEI208'],
      numberingOrder: 'ascending',
      isolatedFromOthers: false,
      sectionId: 'group-2'
    },
    
    // Columns 6-7: Double column group 3 (EEI301-308)
    {
      columnId: 'col-6',
      columnType: 'double',
      subColumns: ['col-6', 'col-7'],
      boothRange: ['EEI301', 'EEI302', 'EEI303', 'EEI304'],
      numberingOrder: 'ascending',
      isolatedFromOthers: false,
      sectionId: 'group-3'
    },
    {
      columnId: 'col-7',
      columnType: 'double',
      subColumns: ['col-6', 'col-7'],
      boothRange: ['EEI305', 'EEI306', 'EEI307', 'EEI308'],
      numberingOrder: 'ascending',
      isolatedFromOthers: false,
      sectionId: 'group-3'
    },
    
    // Columns 9-10: Double column group 4 (EEI401-408)
    {
      columnId: 'col-9',
      columnType: 'double',
      subColumns: ['col-9', 'col-10'],
      boothRange: ['EEI401', 'EEI402', 'EEI403', 'EEI404'],
      numberingOrder: 'ascending',
      isolatedFromOthers: false,
      sectionId: 'group-4'
    },
    {
      columnId: 'col-10',
      columnType: 'double',
      subColumns: ['col-9', 'col-10'],
      boothRange: ['EEI405', 'EEI406', 'EEI407', 'EEI408'],
      numberingOrder: 'ascending',
      isolatedFromOthers: false,
      sectionId: 'group-4'
    },
    
    // Columns 12-13: Double column group 5 (EEI501-508)
    {
      columnId: 'col-12',
      columnType: 'double',
      subColumns: ['col-12', 'col-13'],
      boothRange: ['EEI501', 'EEI502', 'EEI503', 'EEI504'],
      numberingOrder: 'ascending',
      isolatedFromOthers: false,
      sectionId: 'group-5'
    },
    {
      columnId: 'col-13',
      columnType: 'double',
      subColumns: ['col-12', 'col-13'],
      boothRange: ['EEI505', 'EEI506', 'EEI507', 'EEI508'],
      numberingOrder: 'ascending',
      isolatedFromOthers: false,
      sectionId: 'group-5'
    },
    
    // Columns 15-16: Double column group 6 (EEI601-608)
    {
      columnId: 'col-15',
      columnType: 'double',
      subColumns: ['col-15', 'col-16'],
      boothRange: ['EEI601', 'EEI602', 'EEI603', 'EEI604'],
      numberingOrder: 'ascending',
      isolatedFromOthers: false,
      sectionId: 'group-6'
    },
    {
      columnId: 'col-16',
      columnType: 'double',
      subColumns: ['col-15', 'col-16'],
      boothRange: ['EEI605', 'EEI606', 'EEI607', 'EEI608'],
      numberingOrder: 'ascending',
      isolatedFromOthers: false,
      sectionId: 'group-6'
    },
    
    // Columns 18-19: Double column group 7 (EEI701-708)
    {
      columnId: 'col-18',
      columnType: 'double',
      subColumns: ['col-18', 'col-19'],
      boothRange: ['EEI701', 'EEI702', 'EEI703', 'EEI704'],
      numberingOrder: 'ascending',
      isolatedFromOthers: false,
      sectionId: 'group-7'
    },
    {
      columnId: 'col-19',
      columnType: 'double',
      subColumns: ['col-18', 'col-19'],
      boothRange: ['EEI705', 'EEI706', 'EEI707', 'EEI708'],
      numberingOrder: 'ascending',
      isolatedFromOthers: false,
      sectionId: 'group-7'
    },
    
    // Columns 21-22: Double column group 8 (EEI801-808)
    {
      columnId: 'col-21',
      columnType: 'double',
      subColumns: ['col-21', 'col-22'],
      boothRange: ['EEI801', 'EEI802', 'EEI803', 'EEI804'],
      numberingOrder: 'ascending',
      isolatedFromOthers: false,
      sectionId: 'group-8'
    },
    {
      columnId: 'col-22',
      columnType: 'double',
      subColumns: ['col-21', 'col-22'],
      boothRange: ['EEI805', 'EEI806', 'EEI807', 'EEI808'],
      numberingOrder: 'ascending',
      isolatedFromOthers: false,
      sectionId: 'group-8'
    },
    
    // Columns 24-25: Double column group 9 (EEI901-904)
    {
      columnId: 'col-24',
      columnType: 'double',
      subColumns: ['col-24', 'col-25'],
      boothRange: ['EEI901', 'EEI902', 'EEI903', 'EEI904'],
      numberingOrder: 'ascending',
      isolatedFromOthers: false,
      sectionId: 'group-9'
    },
    {
      columnId: 'col-25',
      columnType: 'double',
      subColumns: ['col-24', 'col-25'],
      boothRange: ['EEI905', 'EEI906', 'EEI907', 'EEI908'], // Empty column to maintain double-column structure
      numberingOrder: 'ascending',
      isolatedFromOthers: false,
      sectionId: 'group-9'
    }
  ],
  
  passages: [
    // 8 vertical passages between booth groups
    {
      passageId: 'vertical-passage-1',
      type: 'main-aisle',
      separates: ['col-1', 'col-3'],
      blocksSequential: true,
      coordinates: [[300, 100], [300, 900]],
      description: 'Aisle between Group 1 and Group 2',
      isVisible: true
    },
    {
      passageId: 'vertical-passage-2',
      type: 'main-aisle',
      separates: ['col-4', 'col-6'],
      blocksSequential: true,
      coordinates: [[750, 100], [750, 900]],
      description: 'main-aisle between Group 2 and Group 3',
      isVisible: true
    },
    {
      passageId: 'vertical-passage-3',
      type: 'main-aisle',
      separates: ['col-7', 'col-9'],
      blocksSequential: true,
      coordinates: [[1200, 100], [1200, 900]],
      description: 'main-aisle between Group 3 and Group 4',
      isVisible: true
    },
    {
      passageId: 'vertical-passage-4',
      type: 'main-aisle',
      separates: ['col-10', 'col-12'],
      blocksSequential: true,
      coordinates: [[1650, 100], [1650, 900]],
      description: 'main-aisle between Group 4 and Group 5',
      isVisible: true
    },
    {
      passageId: 'vertical-passage-5',
      type: 'main-aisle',
      separates: ['col-13', 'col-15'],
      blocksSequential: true,
      coordinates: [[2100, 100], [2100, 900]],
      description: 'main-aisle between Group 5 and Group 6',
      isVisible: true
    },
    {
      passageId: 'vertical-passage-6',
      type: 'main-aisle',
      separates: ['col-16', 'col-18'],
      blocksSequential: true,
      coordinates: [[2550, 100], [2550, 900]],
      description: 'main-aisle between Group 6 and Group 7',
      isVisible: true
    },
    {
      passageId: 'vertical-passage-7',
      type: 'main-aisle',
      separates: ['col-19', 'col-21'],
      blocksSequential: true,
      coordinates: [[3000, 100], [3000, 900]],
      description: 'main-aisle between Group 7 and Group 8',
      isVisible: true
    },
    {
      passageId: 'vertical-passage-8',
      type: 'main-aisle',
      separates: ['col-22', 'col-24'],
      blocksSequential: true,
      coordinates: [[3450, 100], [3450, 900]],
      description: 'main-aisle between Group 8 and Group 9',
      isVisible: true
    }
  ],
  
  specialBooths: [], // No special booths in EEI sector
  
  sequentialRules: {
    allowedConnections: {
      // Group 1 - Column 1 (isolated)
      'EEI101': ['EEI102'],
      'EEI102': ['EEI101', 'EEI103'],
      'EEI103': ['EEI102', 'EEI104'],
      'EEI104': ['EEI103'],
      
      // Group 2 - Columns 3-4
      'EEI201': ['EEI202', 'EEI205'], // Can connect vertically and horizontally
      'EEI202': ['EEI201', 'EEI203', 'EEI206'],
      'EEI203': ['EEI202', 'EEI204', 'EEI207'],
      'EEI204': ['EEI203', 'EEI208'],
      'EEI205': ['EEI201', 'EEI206'],
      'EEI206': ['EEI202', 'EEI205', 'EEI207'],
      'EEI207': ['EEI203', 'EEI206', 'EEI208'],
      'EEI208': ['EEI204', 'EEI207'],
      
      // Group 3 - Columns 6-7
      'EEI301': ['EEI302', 'EEI305'],
      'EEI302': ['EEI301', 'EEI303', 'EEI306'],
      'EEI303': ['EEI302', 'EEI304', 'EEI307'],
      'EEI304': ['EEI303', 'EEI308'],
      'EEI305': ['EEI301', 'EEI306'],
      'EEI306': ['EEI302', 'EEI305', 'EEI307'],
      'EEI307': ['EEI303', 'EEI306', 'EEI308'],
      'EEI308': ['EEI304', 'EEI307'],
      
      // Group 4 - Columns 9-10
      'EEI401': ['EEI402', 'EEI405'],
      'EEI402': ['EEI401', 'EEI403', 'EEI406'],
      'EEI403': ['EEI402', 'EEI404', 'EEI407'],
      'EEI404': ['EEI403', 'EEI408'],
      'EEI405': ['EEI401', 'EEI406'],
      'EEI406': ['EEI402', 'EEI405', 'EEI407'],
      'EEI407': ['EEI403', 'EEI406', 'EEI408'],
      'EEI408': ['EEI404', 'EEI407'],
      
      // Group 5 - Columns 12-13
      'EEI501': ['EEI502', 'EEI505'],
      'EEI502': ['EEI501', 'EEI503', 'EEI506'],
      'EEI503': ['EEI502', 'EEI504', 'EEI507'],
      'EEI504': ['EEI503', 'EEI508'],
      'EEI505': ['EEI501', 'EEI506'],
      'EEI506': ['EEI502', 'EEI505', 'EEI507'],
      'EEI507': ['EEI503', 'EEI506', 'EEI508'],
      'EEI508': ['EEI504', 'EEI507'],
      
      // Group 6 - Columns 15-16
      'EEI601': ['EEI602', 'EEI605'],
      'EEI602': ['EEI601', 'EEI603', 'EEI606'],
      'EEI603': ['EEI602', 'EEI604', 'EEI607'],
      'EEI604': ['EEI603', 'EEI608'],
      'EEI605': ['EEI601', 'EEI606'],
      'EEI606': ['EEI602', 'EEI605', 'EEI607'],
      'EEI607': ['EEI603', 'EEI606', 'EEI608'],
      'EEI608': ['EEI604', 'EEI607'],
      
      // Group 7 - Columns 18-19
      'EEI701': ['EEI702', 'EEI705'],
      'EEI702': ['EEI701', 'EEI703', 'EEI706'],
      'EEI703': ['EEI702', 'EEI704', 'EEI707'],
      'EEI704': ['EEI703', 'EEI708'],
      'EEI705': ['EEI701', 'EEI706'],
      'EEI706': ['EEI702', 'EEI705', 'EEI707'],
      'EEI707': ['EEI703', 'EEI706', 'EEI708'],
      'EEI708': ['EEI704', 'EEI707'],
      
      // Group 8 - Columns 21-22
      'EEI801': ['EEI802', 'EEI805'],
      'EEI802': ['EEI801', 'EEI803', 'EEI806'],
      'EEI803': ['EEI802', 'EEI804', 'EEI807'],
      'EEI804': ['EEI803', 'EEI808'],
      'EEI805': ['EEI801', 'EEI806'],
      'EEI806': ['EEI802', 'EEI805', 'EEI807'],
      'EEI807': ['EEI803', 'EEI806', 'EEI808'],
      'EEI808': ['EEI804', 'EEI807'],
      
      // Group 9 - Columns 24-25 (only 4 booths)
      'EEI901': ['EEI902','EEI905'],
      'EEI902': ['EEI901', 'EEI903',  'EEI906'],
      'EEI903': ['EEI902', 'EEI904', 'EEI907'],
      'EEI904': ['EEI903', 'EEI908'],
      'EEI905': ['EEI901', 'EEI906'],
      'EEI906': ['EEI902', 'EEI905', 'EEI907'],
      'EEI907': ['EEI903', 'EEI906', 'EEI908'],
      'EEI908': ['EEI904', 'EEI907']
    },
    
    columnRestrictions: {
      'col-1': { 
        isolatedColumn: true,
        maxContinuousSelection: 4
      },
      'col-3': { 
        allowedSubColumns: ['col-3', 'col-4'],
        maxContinuousSelection: 8
      },
      'col-4': { 
        allowedSubColumns: ['col-3', 'col-4'],
        maxContinuousSelection: 8
      },
      'col-6': { 
        allowedSubColumns: ['col-6', 'col-7'],
        maxContinuousSelection: 8
      },
      'col-7': { 
        allowedSubColumns: ['col-6', 'col-7'],
        maxContinuousSelection: 8
      },
      'col-9': { 
        allowedSubColumns: ['col-9', 'col-10'],
        maxContinuousSelection: 8
      },
      'col-10': { 
        allowedSubColumns: ['col-9', 'col-10'],
        maxContinuousSelection: 8
      },
      'col-12': { 
        allowedSubColumns: ['col-12', 'col-13'],
        maxContinuousSelection: 8
      },
      'col-13': { 
        allowedSubColumns: ['col-12', 'col-13'],
        maxContinuousSelection: 8
      },
      'col-15': { 
        allowedSubColumns: ['col-15', 'col-16'],
        maxContinuousSelection: 8
      },
      'col-16': { 
        allowedSubColumns: ['col-15', 'col-16'],
        maxContinuousSelection: 8
      },
      'col-18': { 
        allowedSubColumns: ['col-18', 'col-19'],
        maxContinuousSelection: 8
      },
      'col-19': { 
        allowedSubColumns: ['col-18', 'col-19'],
        maxContinuousSelection: 8
      },
      'col-21': { 
        allowedSubColumns: ['col-21', 'col-22'],
        maxContinuousSelection: 8
      },
      'col-22': { 
        allowedSubColumns: ['col-21', 'col-22'],
        maxContinuousSelection: 8
      },
      'col-24': { 
        allowedSubColumns: ['col-24', 'col-25'],
        maxContinuousSelection: 8
      },
      'col-25': { 
        allowedSubColumns: ['col-24', 'col-25'],
        maxContinuousSelection: 8
      }
    },
    
    globalRules: {
      preventCrossPassageBooking: true,
      allowRowWiseBooking: true, // Within double columns
      allowColumnWiseBooking: true, // Within each column
      allowMixedBooking: true,
      enforceStrictAdjacency: true
    }
  },
  
  metadata: {
    totalBooths: 68,
    boothTypes: [
      {
        type: '9m²',
        count: 68,
        boothIds: [
          'EEI101', 'EEI102', 'EEI103', 'EEI104',
          'EEI201', 'EEI202', 'EEI203', 'EEI204', 'EEI205', 'EEI206', 'EEI207', 'EEI208',
          'EEI301', 'EEI302', 'EEI303', 'EEI304', 'EEI305', 'EEI306', 'EEI307', 'EEI308',
          'EEI401', 'EEI402', 'EEI403', 'EEI404', 'EEI405', 'EEI406', 'EEI407', 'EEI408',
          'EEI501', 'EEI502', 'EEI503', 'EEI504', 'EEI505', 'EEI506', 'EEI507', 'EEI508',
          'EEI601', 'EEI602', 'EEI603', 'EEI604', 'EEI605', 'EEI606', 'EEI607', 'EEI608',
          'EEI701', 'EEI702', 'EEI703', 'EEI704', 'EEI705', 'EEI706', 'EEI707', 'EEI708',
          'EEI801', 'EEI802', 'EEI803', 'EEI804', 'EEI805', 'EEI806', 'EEI807', 'EEI808',
          'EEI901', 'EEI902', 'EEI903', 'EEI904', 'EEI905', 'EEI906', 'EEI907', 'EEI908',
        ],
        description: 'Standard 9m² outdoor sector booths'
      }
    ],
    lastUpdated: new Date().toISOString(),
    version: '1.0.0',
    validatedBy: 'System',
    notes: [
      'EEI sector features a horizontal linear layout with 9 booth groups',
      'Group 1 has 4 booths in a single column',
      'Groups 2-8 have 8 booths each in double columns',
      'Group 9 has  8 booths to reach total of 68',
      'All passages are vertical, no horizontal passages',
      'Outdoor sector pricing applies to all booths',
      'Sequential booking allowed within groups but not across passages'
    ]
  }
};
// components/BoothsData/layouts/othSectorConfig.ts

import { LayoutConfig } from '../types/layout.types';

export const othSectorConfig: LayoutConfig = {
  layoutId: 'oth-sector',
  layoutName: 'Publication, Healthcare & Sport Products',
  locationType: 'outdoor',
  
  columns: [
    // GROUP 1 - DOUBLE COLUMN (Columns 1-2)
    // Upper section - Premium
    {
      columnId: 'col-1-upper',
      columnType: 'double',
      subColumns: ['col-1', 'col-2'],
      boothRange: ['PHS101', 'PHS103', 'PHS105', 'PHS107'], // 4 booths in column
      numberingOrder: 'ascending',
      isolatedFromOthers: false,
      sectionId: 'group-1-upper'
    },
    {
      columnId: 'col-2-upper',
      columnType: 'double',
      subColumns: ['col-1', 'col-2'],
      boothRange: ['PHS102', 'PHS104', 'PHS106', 'PHS108'], // 4 booths in column
      numberingOrder: 'ascending',
      isolatedFromOthers: false,
      sectionId: 'group-1-upper'
    },
    
    // Middle section - Premium (first 4 pairs)
    {
      columnId: 'col-1-middle-premium',
      columnType: 'double',
      subColumns: ['col-1', 'col-2'],
      boothRange: ['PHS109', 'PHS111', 'PHS113', 'PHS115'], // 4 booths in column
      numberingOrder: 'ascending',
      isolatedFromOthers: false,
      sectionId: 'group-1-middle-premium'
    },
    {
      columnId: 'col-2-middle-premium',
      columnType: 'double',
      subColumns: ['col-1', 'col-2'],
      boothRange: ['PHS110', 'PHS112', 'PHS114', 'PHS116'], // 4 booths in column
      numberingOrder: 'ascending',
      isolatedFromOthers: false,
      sectionId: 'group-1-middle-premium'
    },
    
    // Middle section - Standard (last 2 pairs)
    {
      columnId: 'col-1-middle-standard',
      columnType: 'double',
      subColumns: ['col-1', 'col-2'],
      boothRange: ['PHS117', 'PHS119'], // 2 booths in column
      numberingOrder: 'ascending',
      isolatedFromOthers: false,
      sectionId: 'group-1-middle-standard'
    },
    {
      columnId: 'col-2-middle-standard',
      columnType: 'double',
      subColumns: ['col-1', 'col-2'],
      boothRange: ['PHS118', 'PHS120'], // 2 booths in column
      numberingOrder: 'ascending',
      isolatedFromOthers: false,
      sectionId: 'group-1-middle-standard'
    },
    
    // Lower section - Standard
    {
      columnId: 'col-1-lower',
      columnType: 'double',
      subColumns: ['col-1', 'col-2'],
      boothRange: ['PHS121', 'PHS123'], // 2 booths in column
      numberingOrder: 'ascending',
      isolatedFromOthers: false,
      sectionId: 'group-1-lower'
    },
    {
      columnId: 'col-2-lower',
      columnType: 'double',
      subColumns: ['col-1', 'col-2'],
      boothRange: ['PHS122', 'PHS124'], // 2 booths in column
      numberingOrder: 'ascending',
      isolatedFromOthers: false,
      sectionId: 'group-1-lower'
    },
    
    // GROUP 2 - SINGLE COLUMN (Column 4)
    // Upper section
    {
      columnId: 'col-4-upper',
      columnType: 'single',
      boothRange: ['PHS201', 'PHS202', 'PHS203', 'PHS204'], // 4 booths
      numberingOrder: 'ascending',
      isolatedFromOthers: true,
      sectionId: 'group-2-upper'
    },
    
    // Middle section
    {
      columnId: 'col-4-middle',
      columnType: 'single',
      boothRange: ['PHS205', 'PHS206', 'PHS207', 'PHS208', 'PHS209', 'PHS210'], // 6 booths
      numberingOrder: 'ascending',
      isolatedFromOthers: true,
      sectionId: 'group-2-middle'
    },
    
    // Lower section
    {
      columnId: 'col-4-lower',
      columnType: 'single',
      boothRange: ['PHS211', 'PHS212'], // 2 booths
      numberingOrder: 'ascending',
      isolatedFromOthers: true,
      sectionId: 'group-2-lower'
    },
    
    // GROUP 3 - DOUBLE COLUMN (Columns 6-7)
    // Upper section - All Standard
    {
      columnId: 'col-6-upper',
      columnType: 'double',
      subColumns: ['col-6', 'col-7'],
      boothRange: ['PHS301', 'PHS303', 'PHS305', 'PHS307'], // 4 booths in column
      numberingOrder: 'ascending',
      isolatedFromOthers: false,
      sectionId: 'group-3-upper'
    },
    {
      columnId: 'col-7-upper',
      columnType: 'double',
      subColumns: ['col-6', 'col-7'],
      boothRange: ['PHS302', 'PHS304', 'PHS306', 'PHS308'], // 4 booths in column
      numberingOrder: 'ascending',
      isolatedFromOthers: false,
      sectionId: 'group-3-upper'
    },
    
    // Middle section
    {
      columnId: 'col-6-middle',
      columnType: 'double',
      subColumns: ['col-6', 'col-7'],
      boothRange: ['PHS309', 'PHS311', 'PHS313', 'PHS315', 'PHS317', 'PHS319'], // 6 booths in column
      numberingOrder: 'ascending',
      isolatedFromOthers: false,
      sectionId: 'group-3-middle'
    },
    {
      columnId: 'col-7-middle',
      columnType: 'double',
      subColumns: ['col-6', 'col-7'],
      boothRange: ['PHS310', 'PHS312', 'PHS314', 'PHS316', 'PHS318', 'PHS320'], // 6 booths in column
      numberingOrder: 'ascending',
      isolatedFromOthers: false,
      sectionId: 'group-3-middle'
    },
    
    // Lower section
    {
      columnId: 'col-6-lower',
      columnType: 'double',
      subColumns: ['col-6', 'col-7'],
      boothRange: ['PHS321', 'PHS323'], // 2 booths in column
      numberingOrder: 'ascending',
      isolatedFromOthers: false,
      sectionId: 'group-3-lower'
    },
    {
      columnId: 'col-7-lower',
      columnType: 'double',
      subColumns: ['col-6', 'col-7'],
      boothRange: ['PHS322', 'PHS324'], // 2 booths in column
      numberingOrder: 'ascending',
      isolatedFromOthers: false,
      sectionId: 'group-3-lower'
    }
  ],
  
  passages: [
    // Horizontal passages between sections
    {
      passageId: 'horizontal-passage-1',
      type: 'corridor',
      separates: ['group-1-upper', 'group-1-middle-premium', 'group-2-upper', 'group-2-middle', 'group-3-upper', 'group-3-middle'],
      blocksSequential: true,
      coordinates: [[0, 500], [750, 500]], // Row 5
      description: 'First horizontal passage between upper and middle sections',
      isVisible: true
    },
    {
      passageId: 'horizontal-passage-2',
      type: 'corridor',
      separates: ['group-1-middle-standard', 'group-1-lower', 'group-2-middle', 'group-2-lower', 'group-3-middle', 'group-3-lower'],
      blocksSequential: true,
      coordinates: [[0, 1200], [750, 1200]], // Row 12
      description: 'Second horizontal passage between middle and lower sections',
      isVisible: true
    },
    
    // Vertical passages between groups
    {
      passageId: 'vertical-thin-passage',
      type: 'main-aisle',
      separates: ['group-1-upper', 'group-1-middle-premium', 'group-1-middle-standard', 'group-1-lower', 
                  'group-2-upper', 'group-2-middle', 'group-2-lower'],
      blocksSequential: true,
      coordinates: [[300, 0], [350, 1500]], // Thin passage between Groups 1 & 2
      description: 'Thin passage between Group 1 and Group 2',
      isVisible: true
    },
    {
      passageId: 'vertical-wide-passage',
      type: 'main-aisle',
      separates: ['group-2-upper', 'group-2-middle', 'group-2-lower', 
                  'group-3-upper', 'group-3-middle', 'group-3-lower'],
      blocksSequential: true,
      coordinates: [[450, 0], [550, 1500]], // Wide passage between Groups 2 & 3
      description: 'Wide passage between Group 2 and Group 3',
      isVisible: true
    },
    
    // Premium/Standard boundary (invisible)
    {
      passageId: 'premium-standard-boundary',
      type: 'invisible-boundary',
      separates: ['group-1-middle-premium', 'group-1-middle-standard'],
      blocksSequential: true,
      coordinates: [[0, 900], [300, 900]], // Between rows 9 and 10
      description: 'Invisible boundary between Premium and Standard booths in Group 1',
      isVisible: false
    }
  ],
  
  specialBooths: [],
  
  sequentialRules: {
    allowedConnections: {
      // GROUP 1 - UPPER SECTION (Premium)
      'PHS101': ['PHS102', 'PHS103'],
      'PHS102': ['PHS101', 'PHS104'],
      'PHS103': ['PHS101', 'PHS104', 'PHS105'],
      'PHS104': ['PHS102', 'PHS103', 'PHS106'],
      'PHS105': ['PHS103', 'PHS106', 'PHS107'],
      'PHS106': ['PHS104', 'PHS105', 'PHS108'],
      'PHS107': ['PHS105', 'PHS108'],
      'PHS108': ['PHS106', 'PHS107'],
      
      // GROUP 1 - MIDDLE SECTION (Premium)
      'PHS109': ['PHS110', 'PHS111'],
      'PHS110': ['PHS109', 'PHS112'],
      'PHS111': ['PHS109', 'PHS112', 'PHS113'],
      'PHS112': ['PHS110', 'PHS111', 'PHS114'],
      'PHS113': ['PHS111', 'PHS114', 'PHS115'],
      'PHS114': ['PHS112', 'PHS113', 'PHS116'],
      'PHS115': ['PHS113', 'PHS116'],
      'PHS116': ['PHS114', 'PHS115'],
      
      // GROUP 1 - MIDDLE SECTION (Standard)
      'PHS117': ['PHS118', 'PHS119'],
      'PHS118': ['PHS117', 'PHS120'],
      'PHS119': ['PHS117', 'PHS120'],
      'PHS120': ['PHS118', 'PHS119'],
      
      // GROUP 1 - LOWER SECTION (Standard)
      'PHS121': ['PHS122', 'PHS123'],
      'PHS122': ['PHS121', 'PHS124'],
      'PHS123': ['PHS121', 'PHS124'],
      'PHS124': ['PHS122', 'PHS123'],
      
      // GROUP 2 - UPPER SECTION
      'PHS201': ['PHS202'],
      'PHS202': ['PHS201', 'PHS203'],
      'PHS203': ['PHS202', 'PHS204'],
      'PHS204': ['PHS203'],
      
      // GROUP 2 - MIDDLE SECTION
      'PHS205': ['PHS206'],
      'PHS206': ['PHS205', 'PHS207'],
      'PHS207': ['PHS206', 'PHS208'],
      'PHS208': ['PHS207', 'PHS209'],
      'PHS209': ['PHS208', 'PHS210'],
      'PHS210': ['PHS209'],
      
      // GROUP 2 - LOWER SECTION
      'PHS211': ['PHS212'],
      'PHS212': ['PHS211'],
      
      // GROUP 3 - UPPER SECTION
      'PHS301': ['PHS302', 'PHS303'],
      'PHS302': ['PHS301', 'PHS304'],
      'PHS303': ['PHS301', 'PHS304', 'PHS305'],
      'PHS304': ['PHS302', 'PHS303', 'PHS306'],
      'PHS305': ['PHS303', 'PHS306', 'PHS307'],
      'PHS306': ['PHS304', 'PHS305', 'PHS308'],
      'PHS307': ['PHS305', 'PHS308'],
      'PHS308': ['PHS306', 'PHS307'],
      
      // GROUP 3 - MIDDLE SECTION
      'PHS309': ['PHS310', 'PHS311'],
      'PHS310': ['PHS309', 'PHS312'],
      'PHS311': ['PHS309', 'PHS312', 'PHS313'],
      'PHS312': ['PHS310', 'PHS311', 'PHS314'],
      'PHS313': ['PHS311', 'PHS314', 'PHS315'],
      'PHS314': ['PHS312', 'PHS313', 'PHS316'],
      'PHS315': ['PHS313', 'PHS316', 'PHS317'],
      'PHS316': ['PHS314', 'PHS315', 'PHS318'],
      'PHS317': ['PHS315', 'PHS318', 'PHS319'],
      'PHS318': ['PHS316', 'PHS317', 'PHS320'],
      'PHS319': ['PHS317', 'PHS320'],
      'PHS320': ['PHS318', 'PHS319'],
      
      // GROUP 3 - LOWER SECTION
      'PHS321': ['PHS322', 'PHS323'],
      'PHS322': ['PHS321', 'PHS324'],
      'PHS323': ['PHS321', 'PHS324'],
      'PHS324': ['PHS322', 'PHS323']
    },
    
    columnRestrictions: {
      // Group 1 restrictions
      'col-1-upper': { allowedSubColumns: ['col-1', 'col-2'], maxContinuousSelection: 8 },
      'col-2-upper': { allowedSubColumns: ['col-1', 'col-2'], maxContinuousSelection: 8 },
      'col-1-middle-premium': { allowedSubColumns: ['col-1', 'col-2'], maxContinuousSelection: 8 },
      'col-2-middle-premium': { allowedSubColumns: ['col-1', 'col-2'], maxContinuousSelection: 8 },
      'col-1-middle-standard': { allowedSubColumns: ['col-1', 'col-2'], maxContinuousSelection: 4 },
      'col-2-middle-standard': { allowedSubColumns: ['col-1', 'col-2'], maxContinuousSelection: 4 },
      'col-1-lower': { allowedSubColumns: ['col-1', 'col-2'], maxContinuousSelection: 4 },
      'col-2-lower': { allowedSubColumns: ['col-1', 'col-2'], maxContinuousSelection: 4 },
      
      // Group 2 restrictions
      'col-4-upper': { maxContinuousSelection: 4 },
      'col-4-middle': { maxContinuousSelection: 6 },
      'col-4-lower': { maxContinuousSelection: 2 },
      
      // Group 3 restrictions
      'col-6-upper': { allowedSubColumns: ['col-6', 'col-7'], maxContinuousSelection: 8 },
      'col-7-upper': { allowedSubColumns: ['col-6', 'col-7'], maxContinuousSelection: 8 },
      'col-6-middle': { allowedSubColumns: ['col-6', 'col-7'], maxContinuousSelection: 12 },
      'col-7-middle': { allowedSubColumns: ['col-6', 'col-7'], maxContinuousSelection: 12 },
      'col-6-lower': { allowedSubColumns: ['col-6', 'col-7'], maxContinuousSelection: 4 },
      'col-7-lower': { allowedSubColumns: ['col-6', 'col-7'], maxContinuousSelection: 4 }
    },
    
    globalRules: {
      preventCrossPassageBooking: true,
      allowRowWiseBooking: true,
      allowColumnWiseBooking: true,
      allowMixedBooking: true,
      enforceStrictAdjacency: true
    }
  },
  
  metadata: {
    totalBooths: 60,
    boothTypes: [
      {
        type: '9m² (Premium)',
        count: 12,
        boothIds: ['PHS101', 'PHS102', 'PHS103', 'PHS104', 'PHS105', 'PHS106', 'PHS107', 'PHS108',
                   'PHS109', 'PHS110', 'PHS111', 'PHS112', 'PHS113', 'PHS114', 'PHS115', 'PHS116'],
        description: 'Premium 9m² outdoor sector booths'
      },
      {
        type: '9m² (Standard)',
        count: 48,
        boothIds: ['PHS117', 'PHS118', 'PHS119', 'PHS120', 'PHS121', 'PHS122', 'PHS123', 'PHS124',
                   'PHS201', 'PHS202', 'PHS203', 'PHS204', 'PHS205', 'PHS206', 'PHS207', 'PHS208',
                   'PHS209', 'PHS210', 'PHS211', 'PHS212', 'PHS301', 'PHS302', 'PHS303', 'PHS304',
                   'PHS305', 'PHS306', 'PHS307', 'PHS308', 'PHS309', 'PHS310', 'PHS311', 'PHS312',
                   'PHS313', 'PHS314', 'PHS315', 'PHS316', 'PHS317', 'PHS318', 'PHS319', 'PHS320',
                   'PHS321', 'PHS322', 'PHS323', 'PHS324'],
        description: 'Standard 9m² outdoor sector booths'
      }
    ],
    lastUpdated: new Date().toISOString(),
    version: '1.0.0',
    validatedBy: 'System',
    notes: [
      'OTH sector has 60 booths in three groups',
      'Group 1 (PHS101-124): Double column with Premium and Standard mix',
      'Group 2 (PHS201-212): Single column, all Standard',
      'Group 3 (PHS301-324): Double column, all Standard',
      'Two horizontal passages separate sections',
      'Thin vertical passage between Groups 1 & 2',
      'Wide vertical passage between Groups 2 & 3',
      'Premium/Standard boundary is invisible but enforces validation',
      'No cross-section or cross-group bookings allowed'
    ]
  }
};
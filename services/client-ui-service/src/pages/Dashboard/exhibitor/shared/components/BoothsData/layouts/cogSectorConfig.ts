// components/BoothsData/layouts/cogSectorConfig.ts

import { LayoutConfig } from '../types/layout.types';

export const cogSectorConfig: LayoutConfig = {
  layoutId: 'cog-sector',
  layoutName: 'Conglomerate',
  locationType: 'outdoor',
  
  columns: [
    // GROUP 1 (COG101-COG104) - Single column - 4 booths
    // Upper section
    {
      columnId: 'group-1-upper',
      columnType: 'single',
      boothRange: ['COG101', 'COG102'],
      numberingOrder: 'ascending',
      isolatedFromOthers: false,
      sectionId: 'group-1-upper'
    },
    // Lower section
    {
      columnId: 'group-1-lower',
      columnType: 'single',
      boothRange: ['COG103', 'COG104'],
      numberingOrder: 'ascending',
      isolatedFromOthers: false,
      sectionId: 'group-1-lower'
    },

    // GROUP 2 (COG201-COG208) - Double column - 8 booths
    // Upper section
    {
      columnId: 'group-2-col-1-upper',
      columnType: 'double',
      boothRange: ['COG201', 'COG203'],
      numberingOrder: 'ascending',
      isolatedFromOthers: false,
      sectionId: 'group-2-upper'
    },
    {
      columnId: 'group-2-col-2-upper',
      columnType: 'double',
      boothRange: ['COG202', 'COG204'],
      numberingOrder: 'ascending',
      isolatedFromOthers: false,
      sectionId: 'group-2-upper'
    },
    // Lower section
    {
      columnId: 'group-2-col-1-lower',
      columnType: 'double',
      boothRange: ['COG205', 'COG207'],
      numberingOrder: 'ascending',
      isolatedFromOthers: false,
      sectionId: 'group-2-lower'
    },
    {
      columnId: 'group-2-col-2-lower',
      columnType: 'double',
      boothRange: ['COG206', 'COG208'],
      numberingOrder: 'ascending',
      isolatedFromOthers: false,
      sectionId: 'group-2-lower'
    },

    // GROUP 3 (COG301-COG308) - Double column - 8 booths
    // Upper section
    {
      columnId: 'group-3-col-1-upper',
      columnType: 'double',
      boothRange: ['COG301', 'COG303'],
      numberingOrder: 'ascending',
      isolatedFromOthers: false,
      sectionId: 'group-3-upper'
    },
    {
      columnId: 'group-3-col-2-upper',
      columnType: 'double',
      boothRange: ['COG302', 'COG304'],
      numberingOrder: 'ascending',
      isolatedFromOthers: false,
      sectionId: 'group-3-upper'
    },
    // Lower section
    {
      columnId: 'group-3-col-1-lower',
      columnType: 'double',
      boothRange: ['COG305', 'COG307'],
      numberingOrder: 'ascending',
      isolatedFromOthers: false,
      sectionId: 'group-3-lower'
    },
    {
      columnId: 'group-3-col-2-lower',
      columnType: 'double',
      boothRange: ['COG306', 'COG308'],
      numberingOrder: 'ascending',
      isolatedFromOthers: false,
      sectionId: 'group-3-lower'
    },

    // GROUP 4 (COG401-COG408) - Double column - 8 booths
    // Upper section
    {
      columnId: 'group-4-col-1-upper',
      columnType: 'double',
      boothRange: ['COG401', 'COG403'],
      numberingOrder: 'ascending',
      isolatedFromOthers: false,
      sectionId: 'group-4-upper'
    },
    {
      columnId: 'group-4-col-2-upper',
      columnType: 'double',
      boothRange: ['COG402', 'COG404'],
      numberingOrder: 'ascending',
      isolatedFromOthers: false,
      sectionId: 'group-4-upper'
    },
    // Lower section
    {
      columnId: 'group-4-col-1-lower',
      columnType: 'double',
      boothRange: ['COG405', 'COG407'],
      numberingOrder: 'ascending',
      isolatedFromOthers: false,
      sectionId: 'group-4-lower'
    },
    {
      columnId: 'group-4-col-2-lower',
      columnType: 'double',
      boothRange: ['COG406', 'COG408'],
      numberingOrder: 'ascending',
      isolatedFromOthers: false,
      sectionId: 'group-4-lower'
    },

    // GROUP 5 (COG501-COG508) - Double column - 8 booths
    // Upper section
    {
      columnId: 'group-5-col-1-upper',
      columnType: 'double',
      boothRange: ['COG501', 'COG503'],
      numberingOrder: 'ascending',
      isolatedFromOthers: false,
      sectionId: 'group-5-upper'
    },
    {
      columnId: 'group-5-col-2-upper',
      columnType: 'double',
      boothRange: ['COG502', 'COG504'],
      numberingOrder: 'ascending',
      isolatedFromOthers: false,
      sectionId: 'group-5-upper'
    },
    // Lower section
    {
      columnId: 'group-5-col-1-lower',
      columnType: 'double',
      boothRange: ['COG505', 'COG507'],
      numberingOrder: 'ascending',
      isolatedFromOthers: false,
      sectionId: 'group-5-lower'
    },
    {
      columnId: 'group-5-col-2-lower',
      columnType: 'double',
      boothRange: ['COG506', 'COG508'],
      numberingOrder: 'ascending',
      isolatedFromOthers: false,
      sectionId: 'group-5-lower'
    },

    // GROUP 6 (COG601-COG608) - Double column - 8 booths
    // Upper section
    {
      columnId: 'group-6-col-1-upper',
      columnType: 'double',
      boothRange: ['COG601', 'COG603'],
      numberingOrder: 'ascending',
      isolatedFromOthers: false,
      sectionId: 'group-6-upper'
    },
    {
      columnId: 'group-6-col-2-upper',
      columnType: 'double',
      boothRange: ['COG602', 'COG604'],
      numberingOrder: 'ascending',
      isolatedFromOthers: false,
      sectionId: 'group-6-upper'
    },
    // Lower section
    {
      columnId: 'group-6-col-1-lower',
      columnType: 'double',
      boothRange: ['COG605', 'COG607'],
      numberingOrder: 'ascending',
      isolatedFromOthers: false,
      sectionId: 'group-6-lower'
    },
    {
      columnId: 'group-6-col-2-lower',
      columnType: 'double',
      boothRange: ['COG606', 'COG608'],
      numberingOrder: 'ascending',
      isolatedFromOthers: false,
      sectionId: 'group-6-lower'
    },

    // GROUP 7 (COG701-COG706) - Special layout - 6 booths
    // Upper section (4 booths)
    {
      columnId: 'group-7-col-1-upper',
      columnType: 'double',
      boothRange: ['COG701', 'COG703'],
      numberingOrder: 'ascending',
      isolatedFromOthers: false,
      sectionId: 'group-7-upper'
    },
    {
      columnId: 'group-7-col-2-upper',
      columnType: 'double',
      boothRange: ['COG702', 'COG704'],
      numberingOrder: 'ascending',
      isolatedFromOthers: false,
      sectionId: 'group-7-upper'
    },
    // Lower section (2 booths - first column only)
    {
      columnId: 'group-7-col-1-lower',
      columnType: 'single',
      boothRange: ['COG705', 'COG706'],
      numberingOrder: 'ascending',
      isolatedFromOthers: false,
      sectionId: 'group-7-lower'
    }
  ],
  
  passages: [
    // Horizontal road/passage between upper and lower sections
    {
      passageId: 'horizontal-main',
      type: 'corridor',
      separates: [
        'group-1-upper', 'group-1-lower',
        'group-2-upper', 'group-2-lower',
        'group-3-upper', 'group-3-lower',
        'group-4-upper', 'group-4-lower',
        'group-5-upper', 'group-5-lower',
        'group-6-upper', 'group-6-lower',
        'group-7-upper', 'group-7-lower'
      ],
      blocksSequential: true,
      coordinates: [[0, 500], [1400, 500]],
      description: 'Main horizontal road separating upper and lower sections',
      isVisible: true
    },
    
    // Vertical passages between groups
    {
      passageId: 'vertical-1-2',
      type: 'main-aisle',
      separates: ['group-1-upper', 'group-1-lower', 'group-2-upper', 'group-2-lower'],
      blocksSequential: true,
      coordinates: [[100, 0], [100, 1000]],
      description: 'Passage between Group 1 and Group 2',
      isVisible: true
    },
    {
      passageId: 'vertical-2-3',
      type: 'main-aisle',
      separates: ['group-2-upper', 'group-2-lower', 'group-3-upper', 'group-3-lower'],
      blocksSequential: true,
      coordinates: [[300, 0], [300, 1000]],
      description: 'Passage between Group 2 and Group 3',
      isVisible: true
    },
    {
      passageId: 'vertical-3-4',
      type: 'main-aisle',
      separates: ['group-3-upper', 'group-3-lower', 'group-4-upper', 'group-4-lower'],
      blocksSequential: true,
      coordinates: [[500, 0], [500, 1000]],
      description: 'Passage between Group 3 and Group 4',
      isVisible: true
    },
    {
      passageId: 'vertical-4-5',
      type: 'main-aisle',
      separates: ['group-4-upper', 'group-4-lower', 'group-5-upper', 'group-5-lower'],
      blocksSequential: true,
      coordinates: [[700, 0], [700, 1000]],
      description: 'Passage between Group 4 and Group 5',
      isVisible: true
    },
    {
      passageId: 'vertical-5-6',
      type: 'main-aisle',
      separates: ['group-5-upper', 'group-5-lower', 'group-6-upper', 'group-6-lower'],
      blocksSequential: true,
      coordinates: [[900, 0], [900, 1000]],
      description: 'Passage between Group 5 and Group 6',
      isVisible: true
    },
    {
      passageId: 'vertical-6-7',
      type: 'main-aisle',
      separates: ['group-6-upper', 'group-6-lower', 'group-7-upper', 'group-7-lower'],
      blocksSequential: true,
      coordinates: [[1100, 0], [1100, 1000]],
      description: 'Passage between Group 6 and Group 7',
      isVisible: true
    }
  ],
  
  specialBooths: [],
  
  sequentialRules: {
    allowedConnections: {
      // GROUP 1 connections
      'COG101': ['COG102'],
      'COG102': ['COG101'],
      'COG103': ['COG104'],
      'COG104': ['COG103'],
      
      // GROUP 2 connections
      'COG201': ['COG202', 'COG203'],
      'COG202': ['COG201', 'COG204'],
      'COG203': ['COG201', 'COG204'],
      'COG204': ['COG202', 'COG203'],
      'COG205': ['COG206', 'COG207'],
      'COG206': ['COG205', 'COG208'],
      'COG207': ['COG205', 'COG208'],
      'COG208': ['COG206', 'COG207'],
      
      // GROUP 3 connections
      'COG301': ['COG302', 'COG303'],
      'COG302': ['COG301', 'COG304'],
      'COG303': ['COG301', 'COG304'],
      'COG304': ['COG302', 'COG303'],
      'COG305': ['COG306', 'COG307'],
      'COG306': ['COG305', 'COG308'],
      'COG307': ['COG305', 'COG308'],
      'COG308': ['COG306', 'COG307'],
      
      // GROUP 4 connections
      'COG401': ['COG402', 'COG403'],
      'COG402': ['COG401', 'COG404'],
      'COG403': ['COG401', 'COG404'],
      'COG404': ['COG402', 'COG403'],
      'COG405': ['COG406', 'COG407'],
      'COG406': ['COG405', 'COG408'],
      'COG407': ['COG405', 'COG408'],
      'COG408': ['COG406', 'COG407'],
      
      // GROUP 5 connections
      'COG501': ['COG502', 'COG503'],
      'COG502': ['COG501', 'COG504'],
      'COG503': ['COG501', 'COG504'],
      'COG504': ['COG502', 'COG503'],
      'COG505': ['COG506', 'COG507'],
      'COG506': ['COG505', 'COG508'],
      'COG507': ['COG505', 'COG508'],
      'COG508': ['COG506', 'COG507'],
      
      // GROUP 6 connections
      'COG601': ['COG602', 'COG603'],
      'COG602': ['COG601', 'COG604'],
      'COG603': ['COG601', 'COG604'],
      'COG604': ['COG602', 'COG603'],
      'COG605': ['COG606', 'COG607'],
      'COG606': ['COG605', 'COG608'],
      'COG607': ['COG605', 'COG608'],
      'COG608': ['COG606', 'COG607'],
      
      // GROUP 7 connections (special case)
      'COG701': ['COG702', 'COG703'],
      'COG702': ['COG701', 'COG704'],
      'COG703': ['COG701', 'COG704'],
      'COG704': ['COG702', 'COG703'],
      'COG705': ['COG706'], // Only vertical connection
      'COG706': ['COG705']
    },
    
    columnRestrictions: {
      // Group 1 restrictions
      'group-1-upper': { maxContinuousSelection: 2 },
      'group-1-lower': { maxContinuousSelection: 2 },
      
      // Group 2 restrictions
      'group-2-col-1-upper': { maxContinuousSelection: 4 },
      'group-2-col-2-upper': { maxContinuousSelection: 4 },
      'group-2-col-1-lower': { maxContinuousSelection: 4 },
      'group-2-col-2-lower': { maxContinuousSelection: 4 },
      
      // Group 3 restrictions
      'group-3-col-1-upper': { maxContinuousSelection: 4 },
      'group-3-col-2-upper': { maxContinuousSelection: 4 },
      'group-3-col-1-lower': { maxContinuousSelection: 4 },
      'group-3-col-2-lower': { maxContinuousSelection: 4 },
      
      // Group 4 restrictions
      'group-4-col-1-upper': { maxContinuousSelection: 4 },
      'group-4-col-2-upper': { maxContinuousSelection: 4 },
      'group-4-col-1-lower': { maxContinuousSelection: 4 },
      'group-4-col-2-lower': { maxContinuousSelection: 4 },
      
      // Group 5 restrictions
      'group-5-col-1-upper': { maxContinuousSelection: 4 },
      'group-5-col-2-upper': { maxContinuousSelection: 4 },
      'group-5-col-1-lower': { maxContinuousSelection: 4 },
      'group-5-col-2-lower': { maxContinuousSelection: 4 },
      
      // Group 6 restrictions
      'group-6-col-1-upper': { maxContinuousSelection: 4 },
      'group-6-col-2-upper': { maxContinuousSelection: 4 },
      'group-6-col-1-lower': { maxContinuousSelection: 4 },
      'group-6-col-2-lower': { maxContinuousSelection: 4 },
      
      // Group 7 restrictions
      'group-7-col-1-upper': { maxContinuousSelection: 4 },
      'group-7-col-2-upper': { maxContinuousSelection: 4 },
      'group-7-col-1-lower': { maxContinuousSelection: 2 }
    },
    
    globalRules: {
      preventCrossPassageBooking: true,
      allowRowWiseBooking: true,
      allowColumnWiseBooking: true,
      allowMixedBooking: false,
      enforceStrictAdjacency: true
    }
  },
  
  metadata: {
    totalBooths: 50,
    boothTypes: [
      {
        type: '9m² (Standard)',
        count: 50,
        boothIds: [
          'COG101', 'COG102', 'COG103', 'COG104',
          'COG201', 'COG202', 'COG203', 'COG204', 'COG205', 'COG206', 'COG207', 'COG208',
          'COG301', 'COG302', 'COG303', 'COG304', 'COG305', 'COG306', 'COG307', 'COG308',
          'COG401', 'COG402', 'COG403', 'COG404', 'COG405', 'COG406', 'COG407', 'COG408',
          'COG501', 'COG502', 'COG503', 'COG504', 'COG505', 'COG506', 'COG507', 'COG508',
          'COG601', 'COG602', 'COG603', 'COG604', 'COG605', 'COG606', 'COG607', 'COG608',
          'COG701', 'COG702', 'COG703', 'COG704', 'COG705', 'COG706'
        ],
        description: 'Standard 9m² outdoor sector booths for conglomerate companies'
      }
    ],
    lastUpdated: new Date().toISOString(),
    version: '1.0.0',
    validatedBy: 'System',
    notes: [
      'COG sector has 50 booths in 7 groups',
      'Group 1 has single column with 4 booths',
      'Groups 2-6 have double columns with 8 booths each',
      'Group 7 has special layout with 6 booths (4 upper, 2 lower)',
      'Horizontal road separates upper and lower sections',
      'Vertical passages between each group',
      'No cross-group or cross-section bookings allowed',
      'All booths are standard 9m² outdoor booths'
    ]
  }
};
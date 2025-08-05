// components/BoothsData/layouts/africaHallConfig.ts

import { LayoutConfig, SpecialBoothRestriction } from '../types/layout.types';

export const africaHallConfig: LayoutConfig = {
  layoutId: 'africa-hall',
  layoutName: 'Africa Hall',
  locationType: 'indoor',
  
  columns: [
    // Column 1: Left Single Column (N001-N016)
    {
      columnId: 'col-1',
      columnType: 'single',
      boothRange: ['N001', 'N002', 'N003', 'N004', 'N005', 'N006', 'N007', 'N008', 'N009', 'N010', 'N011', 'N012', 'N013', 'N014', 'N015', 'N016'],
      numberingOrder: 'ascending',
      isolatedFromOthers: true,
      sectionId: 'left-section'
    },
    
    // Column 2: Middle Double Column - S-series booths in 2x13 grid
    {
      columnId: 'col-2',
      columnType: 'double',
      subColumns: ['col-2a', 'col-2b'],
      boothRange: ['S017', 'S018', 'S019', 'S020', 'S021', 'S022', 'S023', 'S024', 'S025', 'S026', 'S027', 'S028', 'S029', 'S030', 'S031', 'S032', 'S033', 'S034', 'S035', 'S036', 'S037', 'S038', 'S039', 'S040', 'S041', 'S042'],
      numberingOrder: 'ascending',
      isolatedFromOthers: false,
      sectionId: 'middle-section'
    },
    
    // Column 3: Right Single Column (N043-N058)
    {
      columnId: 'col-3',
      columnType: 'single',
      boothRange: ['N043', 'N044', 'N045', 'N046', 'N047', 'N048', 'N049', 'N050', 'N051', 'N052', 'N053', 'N054', 'N055', 'N056', 'N057', 'N058'],
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
      separates: ['col-1', 'col-2'],
      blocksSequential: true,
      coordinates: [[250, 150], [250, 900]],
      description: 'Main aisle between left N-series and middle S-series',
      isVisible: true
    },
    
    // Vertical Passage 2: Between Column 2 and Column 3
    {
      passageId: 'vertical-passage-2',
      type: 'main-aisle',
      separates: ['col-2', 'col-3'],
      blocksSequential: true,
      coordinates: [[550, 150], [550, 900]],
      description: 'Main aisle between middle S-series and right N-series',
      isVisible: true
    },
    
    // Top Door
    {
      passageId: 'top-door',
      type: 'door',
      separates: ['main-area', 'entrance'],
      blocksSequential: true,
      coordinates: [[350, 100], [450, 100]],
      description: 'Top entrance to Africa Hall',
      isVisible: true
    },
    
    // Bottom Door
    {
      passageId: 'bottom-door',
      type: 'door',
      separates: ['main-area', 'entrance'],
      blocksSequential: true,
      coordinates: [[350, 950], [450, 950]],
      description: 'Main front entrance to Africa Hall',
      isVisible: true
    },

     {
    passageId: 'horizontal-passage-1',
    type: 'corridor' as const,
    separates: ['upper-s-section', 'lower-s-section'],
    blocksSequential: true,
    coordinates: [[1400, 1700], [1800, 1700]], // Approximate coordinates
    description: 'Corridor between upper and lower S-series sections',
    isVisible: true
  }
  ],
  
  specialBooths: [
    // All S-series booths are special 6m² booths
    ...Array.from({ length: 26 }, (_, i) => {
      const boothNum = i + 17;
      const paddedNum = boothNum.toString().padStart(3, '0');
      return {
        boothId: `S${paddedNum}`,
        treatAsSeparate: false,
        restrictions: ['different-pricing'] as SpecialBoothRestriction[],
        pricing: {
          overrideStandardPricing: true,
          customSqm: 6,
          customCategory: 'Special'
        }
      };
    })
  ],
  
  sequentialRules: {
    // Define which booths can connect sequentially
    allowedConnections: {
      // Column 1: N-series left side - only vertical connections
      'N001': ['N002'],
      'N002': ['N001', 'N003'],
      'N003': ['N002', 'N004'],
      'N004': ['N003', 'N005'],
      'N005': ['N004', 'N006'],
      'N006': ['N005', 'N007'],
      'N007': ['N006', 'N008'],
      'N008': ['N007', 'N009'],
      'N009': ['N008', 'N010'],
      'N010': ['N009', 'N011'],
      'N011': ['N010', 'N012'],
      'N012': ['N011', 'N013'],
      'N013': ['N012', 'N014'],
      'N014': ['N013', 'N015'],
      'N015': ['N014', 'N016'],
      'N016': ['N015'],
      
      // S-series booths - LEFT SUB-COLUMN (vertical connections within column)
      'S017': ['S018', 'S030'], // Can connect down and horizontally
      'S018': ['S017', 'S019', 'S031'],
      'S019': ['S018', 'S020', 'S032'],
      'S020': ['S019', 'S021', 'S033'],
      'S021': ['S020', 'S022', 'S034'],
      // 'S022': ['S021', 'S023', 'S035'],
      'S022': ['S021', 'S035'], // Can only connect down and right
      'S023': ['S024', 'S036'], // Can only connect up and right
      // 'S023': ['S022', 'S024', 'S036'],
      'S024': ['S023', 'S025', 'S037'],
      'S025': ['S024', 'S026', 'S038'],
      'S026': ['S025', 'S027', 'S039'],
      'S027': ['S026', 'S028', 'S040'],
      'S028': ['S027', 'S029', 'S041'],
      'S029': ['S028', 'S042'], // Top of left column
      
      // S-series booths - RIGHT SUB-COLUMN (vertical connections within column)
      'S030': ['S017', 'S031'], // Bottom of right column
      'S031': ['S018', 'S030', 'S032'],
      'S032': ['S019', 'S031', 'S033'],
      'S033': ['S020', 'S032', 'S034'],
      'S034': ['S021', 'S033', 'S035'],
      // 'S035': ['S022', 'S034', 'S036'],
      'S035': ['S034', 'S022'], // Can only connect down and left
      // 'S036': ['S023', 'S035', 'S037'],
      'S036': ['S023', 'S037'], // Can only connect left and up
      'S037': ['S024', 'S036', 'S038'],
      'S038': ['S025', 'S037', 'S039'],
      'S039': ['S026', 'S038', 'S040'],
      'S040': ['S027', 'S039', 'S041'],
      'S041': ['S028', 'S040', 'S042'],
      'S042': ['S029', 'S041'], // Top of right column
      
      // Column 3: N-series right side - only vertical connections
      'N043': ['N044'],
      'N044': ['N043', 'N045'],
      'N045': ['N044', 'N046'],
      'N046': ['N045', 'N047'],
      'N047': ['N046', 'N048'],
      'N048': ['N047', 'N049'],
      'N049': ['N048', 'N050'],
      'N050': ['N049', 'N051'],
      'N051': ['N050', 'N052'],
      'N052': ['N051', 'N053'],
      'N053': ['N052', 'N054'],
      'N054': ['N053', 'N055'],
      'N055': ['N054', 'N056'],
      'N056': ['N055', 'N057'],
      'N057': ['N056', 'N058'],
      'N058': ['N057']
    },
    
    columnRestrictions: {
      'col-1': { 
        isolatedColumn: true,
        maxContinuousSelection: 16,
        requiresMinimumSelection: 1
      },
      'col-2': { 
        isolatedColumn: false,
        maxContinuousSelection: 26,
        requiresMinimumSelection: 1,
        allowedSubColumns: ['col-2a', 'col-2b']
      },
      'col-3': { 
        isolatedColumn: true,
        maxContinuousSelection: 16,
        requiresMinimumSelection: 1
      }
    },
    
    globalRules: {
      preventCrossPassageBooking: true,
      allowRowWiseBooking: true, // S-series can book horizontally
      allowColumnWiseBooking: true, // All booths can book vertically
      allowMixedBooking: true, // S-series can mix row and column
      enforceStrictAdjacency: true
    }
  },
  
  metadata: {
    totalBooths: 58,
    boothTypes: [
      {
        type: '6m²',
        count: 26,
        boothIds: [
          'S017', 'S018', 'S019', 'S020', 'S021', 'S022', 'S023', 'S024', 'S025', 'S026',
          'S027', 'S028', 'S029', 'S030', 'S031', 'S032', 'S033', 'S034', 'S035', 'S036',
          'S037', 'S038', 'S039', 'S040', 'S041', 'S042'
        ],
        description: 'Special 6m² booths in central double column'
      },
      {
        type: '9m²',
        count: 32,
        boothIds: [
          'N001', 'N002', 'N003', 'N004', 'N005', 'N006', 'N007', 'N008', 'N009', 'N010',
          'N011', 'N012', 'N013', 'N014', 'N015', 'N016', 'N043', 'N044', 'N045', 'N046',
          'N047', 'N048', 'N049', 'N050', 'N051', 'N052', 'N053', 'N054', 'N055', 'N056',
          'N057', 'N058'
        ],
        description: 'Standard 9m² booths in side columns'
      }
    ],
    lastUpdated: new Date().toISOString(),
    version: '2.0.0',
    validatedBy: 'System',
    notes: [
      'Africa Hall features a unique layout with special 6m² booths in the center',
      'S-series booths are arranged in a 2x13 grid allowing both horizontal and vertical connections',
      'N-series booths are in single columns on both sides, allowing only vertical connections',
      'Passages separate the three main sections but S-series booths can connect across their sub-columns',
      'Configuration corrected to properly define all vertical connections for S-series booths'
    ]
  }
};
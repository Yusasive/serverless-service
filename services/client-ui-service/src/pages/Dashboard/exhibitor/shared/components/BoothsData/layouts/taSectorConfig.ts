// components/BoothsData/layouts/taSectorConfig.ts

import { LayoutConfig } from '../types/layout.types';

export const taSectorConfig: LayoutConfig = {
  layoutId: 'ta-sector',
  layoutName: 'Transport and Allied/Power Products',
  locationType: 'outdoor',
  
  columns: [
    // GROUP 1 (TA101-TA122) - Columns 1-2
    // Upper section
    {
      columnId: 'group-1-col-1-upper',
      columnType: 'double',
      boothRange: ['TA101', 'TA103', 'TA105', 'TA107', 'TA109'],
      numberingOrder: 'ascending',
      isolatedFromOthers: false,
      sectionId: 'group-1-upper'
    },
    {
      columnId: 'group-1-col-2-upper',
      columnType: 'double',
      boothRange: ['TA102', 'TA104', 'TA106', 'TA108', 'TA110'],
      numberingOrder: 'ascending',
      isolatedFromOthers: false,
      sectionId: 'group-1-upper'
    },
    // Lower section
    {
      columnId: 'group-1-col-1-lower',
      columnType: 'double',
      boothRange: ['TA111', 'TA113', 'TA115', 'TA117', 'TA119', 'TA121'],
      numberingOrder: 'ascending',
      isolatedFromOthers: false,
      sectionId: 'group-1-lower'
    },
    {
      columnId: 'group-1-col-2-lower',
      columnType: 'double',
      boothRange: ['TA112', 'TA114', 'TA116', 'TA118', 'TA120', 'TA122'],
      numberingOrder: 'ascending',
      isolatedFromOthers: false,
      sectionId: 'group-1-lower'
    },

    // GROUP 2 (TA201-TA222) - Columns 3-4
    // Upper section
    {
      columnId: 'group-2-col-1-upper',
      columnType: 'double',
      boothRange: ['TA201', 'TA203', 'TA205', 'TA207', 'TA209'],
      numberingOrder: 'ascending',
      isolatedFromOthers: false,
      sectionId: 'group-2-upper'
    },
    {
      columnId: 'group-2-col-2-upper',
      columnType: 'double',
      boothRange: ['TA202', 'TA204', 'TA206', 'TA208', 'TA210'],
      numberingOrder: 'ascending',
      isolatedFromOthers: false,
      sectionId: 'group-2-upper'
    },
    // Lower section
    {
      columnId: 'group-2-col-1-lower',
      columnType: 'double',
      boothRange: ['TA211', 'TA213', 'TA215', 'TA217', 'TA219', 'TA221'],
      numberingOrder: 'ascending',
      isolatedFromOthers: false,
      sectionId: 'group-2-lower'
    },
    {
      columnId: 'group-2-col-2-lower',
      columnType: 'double',
      boothRange: ['TA212', 'TA214', 'TA216', 'TA218', 'TA220', 'TA222'],
      numberingOrder: 'ascending',
      isolatedFromOthers: false,
      sectionId: 'group-2-lower'
    },

    // GROUP 3 (TA301-TA322) - Columns 5-6
    // Upper section
    {
      columnId: 'group-3-col-1-upper',
      columnType: 'double',
      boothRange: ['TA301', 'TA303', 'TA305', 'TA307', 'TA309'],
      numberingOrder: 'ascending',
      isolatedFromOthers: false,
      sectionId: 'group-3-upper'
    },
    {
      columnId: 'group-3-col-2-upper',
      columnType: 'double',
      boothRange: ['TA302', 'TA304', 'TA306', 'TA308', 'TA310'],
      numberingOrder: 'ascending',
      isolatedFromOthers: false,
      sectionId: 'group-3-upper'
    },
    // Lower section
    {
      columnId: 'group-3-col-1-lower',
      columnType: 'double',
      boothRange: ['TA311', 'TA313', 'TA315', 'TA317', 'TA319', 'TA321'],
      numberingOrder: 'ascending',
      isolatedFromOthers: false,
      sectionId: 'group-3-lower'
    },
    {
      columnId: 'group-3-col-2-lower',
      columnType: 'double',
      boothRange: ['TA312', 'TA314', 'TA316', 'TA318', 'TA320', 'TA322'],
      numberingOrder: 'ascending',
      isolatedFromOthers: false,
      sectionId: 'group-3-lower'
    },

    // GROUP 4 (TA401-TA422) - Columns 7-8
    // Upper section
    {
      columnId: 'group-4-col-1-upper',
      columnType: 'double',
      boothRange: ['TA401', 'TA403', 'TA405', 'TA407', 'TA409'],
      numberingOrder: 'ascending',
      isolatedFromOthers: false,
      sectionId: 'group-4-upper'
    },
    {
      columnId: 'group-4-col-2-upper',
      columnType: 'double',
      boothRange: ['TA402', 'TA404', 'TA406', 'TA408', 'TA410'],
      numberingOrder: 'ascending',
      isolatedFromOthers: false,
      sectionId: 'group-4-upper'
    },
    // Lower section
    {
      columnId: 'group-4-col-1-lower',
      columnType: 'double',
      boothRange: ['TA411', 'TA413', 'TA415', 'TA417', 'TA419', 'TA421'],
      numberingOrder: 'ascending',
      isolatedFromOthers: false,
      sectionId: 'group-4-lower'
    },
    {
      columnId: 'group-4-col-2-lower',
      columnType: 'double',
      boothRange: ['TA412', 'TA414', 'TA416', 'TA418', 'TA420', 'TA422'],
      numberingOrder: 'ascending',
      isolatedFromOthers: false,
      sectionId: 'group-4-lower'
    },

    // GROUP 5 (TA501-TA522) - Columns 9-10
    // Upper section
    {
      columnId: 'group-5-col-1-upper',
      columnType: 'double',
      boothRange: ['TA501', 'TA503', 'TA505', 'TA507', 'TA509'],
      numberingOrder: 'ascending',
      isolatedFromOthers: false,
      sectionId: 'group-5-upper'
    },
    {
      columnId: 'group-5-col-2-upper',
      columnType: 'double',
      boothRange: ['TA502', 'TA504', 'TA506', 'TA508', 'TA510'],
      numberingOrder: 'ascending',
      isolatedFromOthers: false,
      sectionId: 'group-5-upper'
    },
    // Lower section
    {
      columnId: 'group-5-col-1-lower',
      columnType: 'double',
      boothRange: ['TA511', 'TA513', 'TA515', 'TA517', 'TA519', 'TA521'],
      numberingOrder: 'ascending',
      isolatedFromOthers: false,
      sectionId: 'group-5-lower'
    },
    {
      columnId: 'group-5-col-2-lower',
      columnType: 'double',
      boothRange: ['TA512', 'TA514', 'TA516', 'TA518', 'TA520', 'TA522'],
      numberingOrder: 'ascending',
      isolatedFromOthers: false,
      sectionId: 'group-5-lower'
    },

    // GROUP 6 (TA601-TA622) - Columns 11-12
    // Upper section
    {
      columnId: 'group-6-col-1-upper',
      columnType: 'double',
      boothRange: ['TA601', 'TA603', 'TA605', 'TA607', 'TA609'],
      numberingOrder: 'ascending',
      isolatedFromOthers: false,
      sectionId: 'group-6-upper'
    },
    {
      columnId: 'group-6-col-2-upper',
      columnType: 'double',
      boothRange: ['TA602', 'TA604', 'TA606', 'TA608', 'TA610'],
      numberingOrder: 'ascending',
      isolatedFromOthers: false,
      sectionId: 'group-6-upper'
    },
    // Lower section
    {
      columnId: 'group-6-col-1-lower',
      columnType: 'double',
      boothRange: ['TA611', 'TA613', 'TA615', 'TA617', 'TA619', 'TA621'],
      numberingOrder: 'ascending',
      isolatedFromOthers: false,
      sectionId: 'group-6-lower'
    },
    {
      columnId: 'group-6-col-2-lower',
      columnType: 'double',
      boothRange: ['TA612', 'TA614', 'TA616', 'TA618', 'TA620', 'TA622'],
      numberingOrder: 'ascending',
      isolatedFromOthers: false,
      sectionId: 'group-6-lower'
    }
  ],
  
  passages: [
    // Horizontal passage at row 6
    {
      passageId: 'horizontal-main',
      type: 'corridor',
      separates: [
        'group-1-upper', 'group-1-lower',
        'group-2-upper', 'group-2-lower',
        'group-3-upper', 'group-3-lower',
        'group-4-upper', 'group-4-lower',
        'group-5-upper', 'group-5-lower',
        'group-6-upper', 'group-6-lower'
      ],
      blocksSequential: true,
      coordinates: [[0, 600], [1200, 600]],
      description: 'Main horizontal passage separating upper and lower sections',
      isVisible: true
    },
    
    // Vertical passages between groups
    {
      passageId: 'vertical-1-2',
      type: 'main-aisle',
      separates: ['group-1-upper', 'group-1-lower', 'group-2-upper', 'group-2-lower'],
      blocksSequential: true,
      coordinates: [[200, 0], [200, 1200]],
      description: 'Passage between Group 1 and Group 2',
      isVisible: true
    },
    {
      passageId: 'vertical-2-3',
      type: 'main-aisle',
      separates: ['group-2-upper', 'group-2-lower', 'group-3-upper', 'group-3-lower'],
      blocksSequential: true,
      coordinates: [[400, 0], [400, 1200]],
      description: 'Passage between Group 2 and Group 3',
      isVisible: true
    },
    {
      passageId: 'vertical-3-4',
      type: 'main-aisle',
      separates: ['group-3-upper', 'group-3-lower', 'group-4-upper', 'group-4-lower'],
      blocksSequential: true,
      coordinates: [[600, 0], [600, 1200]],
      description: 'Passage between Group 3 and Group 4',
      isVisible: true
    },
    {
      passageId: 'vertical-4-5',
      type: 'main-aisle',
      separates: ['group-4-upper', 'group-4-lower', 'group-5-upper', 'group-5-lower'],
      blocksSequential: true,
      coordinates: [[800, 0], [800, 1200]],
      description: 'Passage between Group 4 and Group 5',
      isVisible: true
    },
    {
      passageId: 'vertical-5-6',
      type: 'main-aisle',
      separates: ['group-5-upper', 'group-5-lower', 'group-6-upper', 'group-6-lower'],
      blocksSequential: true,
      coordinates: [[1000, 0], [1000, 1200]],
      description: 'Passage between Group 5 and Group 6',
      isVisible: true
    }
  ],
  
  specialBooths: [],
  
  sequentialRules: {
    allowedConnections: {
      // GROUP 1 - Upper section
      'TA101': ['TA102', 'TA103'],
      'TA102': ['TA101', 'TA104'],
      'TA103': ['TA101', 'TA104', 'TA105'],
      'TA104': ['TA102', 'TA103', 'TA106'],
      'TA105': ['TA103', 'TA106', 'TA107'],
      'TA106': ['TA104', 'TA105', 'TA108'],
      'TA107': ['TA105', 'TA108', 'TA109'],
      'TA108': ['TA106', 'TA107', 'TA110'],
      'TA109': ['TA107', 'TA110'],
      'TA110': ['TA108', 'TA109'],
      
      // GROUP 1 - Lower section
      'TA111': ['TA112', 'TA113'],
      'TA112': ['TA111', 'TA114'],
      'TA113': ['TA111', 'TA114', 'TA115'],
      'TA114': ['TA112', 'TA113', 'TA116'],
      'TA115': ['TA113', 'TA116', 'TA117'],
      'TA116': ['TA114', 'TA115', 'TA118'],
      'TA117': ['TA115', 'TA118', 'TA119'],
      'TA118': ['TA116', 'TA117', 'TA120'],
      'TA119': ['TA117', 'TA120', 'TA121'],
      'TA120': ['TA118', 'TA119', 'TA122'],
      'TA121': ['TA119', 'TA122'],
      'TA122': ['TA120', 'TA121'],
      
      // Continue this pattern for all 6 groups...
      // I'll show the pattern for Group 2 as an example:
      
      // GROUP 2 - Upper section
      'TA201': ['TA202', 'TA203'],
      'TA202': ['TA201', 'TA204'],
      'TA203': ['TA201', 'TA204', 'TA205'],
      'TA204': ['TA202', 'TA203', 'TA206'],
      'TA205': ['TA203', 'TA206', 'TA207'],
      'TA206': ['TA204', 'TA205', 'TA208'],
      'TA207': ['TA205', 'TA208', 'TA209'],
      'TA208': ['TA206', 'TA207', 'TA210'],
      'TA209': ['TA207', 'TA210'],
      'TA210': ['TA208', 'TA209'],
      
      // GROUP 2 - Lower section
      'TA211': ['TA212', 'TA213'],
      'TA212': ['TA211', 'TA214'],
      'TA213': ['TA211', 'TA214', 'TA215'],
      'TA214': ['TA212', 'TA213', 'TA216'],
      'TA215': ['TA213', 'TA216', 'TA217'],
      'TA216': ['TA214', 'TA215', 'TA218'],
      'TA217': ['TA215', 'TA218', 'TA219'],
      'TA218': ['TA216', 'TA217', 'TA220'],
      'TA219': ['TA217', 'TA220', 'TA221'],
      'TA220': ['TA218', 'TA219', 'TA222'],
      'TA221': ['TA219', 'TA222'],
      'TA222': ['TA220', 'TA221'],
      
       // GROUP 3 - Upper section
      'TA301': ['TA302', 'TA303'],
      'TA302': ['TA301', 'TA304'],
      'TA303': ['TA301', 'TA304', 'TA305'],
      'TA304': ['TA302', 'TA303', 'TA306'],
      'TA305': ['TA303', 'TA306', 'TA307'],
      'TA306': ['TA304', 'TA305', 'TA308'],
      'TA307': ['TA305', 'TA308', 'TA309'],
      'TA308': ['TA306', 'TA307', 'TA310'],
      'TA309': ['TA307', 'TA310'],
      'TA310': ['TA308', 'TA309'],
      
      // GROUP 3 - Lower section
      'TA311': ['TA312', 'TA313'],
      'TA312': ['TA311', 'TA314'],
      'TA313': ['TA311', 'TA314', 'TA315'],
      'TA314': ['TA312', 'TA313', 'TA316'],
      'TA315': ['TA313', 'TA316', 'TA317'],
      'TA316': ['TA314', 'TA315', 'TA318'],
      'TA317': ['TA315', 'TA318', 'TA319'],
      'TA318': ['TA316', 'TA317', 'TA320'],
      'TA319': ['TA317', 'TA320', 'TA321'],
      'TA320': ['TA318', 'TA319', 'TA322'],
      'TA321': ['TA319', 'TA322'],
      'TA322': ['TA320', 'TA321'],
      
      // GROUP 4 - Upper section
      'TA401': ['TA402', 'TA403'],
      'TA402': ['TA401', 'TA404'],
      'TA403': ['TA401', 'TA404', 'TA405'],
      'TA404': ['TA402', 'TA403', 'TA406'],
      'TA405': ['TA403', 'TA406', 'TA407'],
      'TA406': ['TA404', 'TA405', 'TA408'],
      'TA407': ['TA405', 'TA408', 'TA409'],
      'TA408': ['TA406', 'TA407', 'TA410'],
      'TA409': ['TA407', 'TA410'],
      'TA410': ['TA408', 'TA409'],
      
      // GROUP 4 - Lower section
      'TA411': ['TA412', 'TA413'],
      'TA412': ['TA411', 'TA414'],
      'TA413': ['TA411', 'TA414', 'TA415'],
      'TA414': ['TA412', 'TA413', 'TA416'],
      'TA415': ['TA413', 'TA416', 'TA417'],
      'TA416': ['TA414', 'TA415', 'TA418'],
      'TA417': ['TA415', 'TA418', 'TA419'],
      'TA418': ['TA416', 'TA417', 'TA420'],
      'TA419': ['TA417', 'TA420', 'TA421'],
      'TA420': ['TA418', 'TA419', 'TA422'],
      'TA421': ['TA419', 'TA422'],
      'TA422': ['TA420', 'TA421'],
      
      // GROUP 5 - Upper section
      'TA501': ['TA502', 'TA503'],
      'TA502': ['TA501', 'TA504'],
      'TA503': ['TA501', 'TA504', 'TA505'],
      'TA504': ['TA502', 'TA503', 'TA506'],
      'TA505': ['TA503', 'TA506', 'TA507'],
      'TA506': ['TA504', 'TA505', 'TA508'],
      'TA507': ['TA505', 'TA508', 'TA509'],
      'TA508': ['TA506', 'TA507', 'TA510'],
      'TA509': ['TA507', 'TA510'],
      'TA510': ['TA508', 'TA509'],
      
      // GROUP 5 - Lower section
      'TA511': ['TA512', 'TA513'],
      'TA512': ['TA511', 'TA514'],
      'TA513': ['TA511', 'TA514', 'TA515'],
      'TA514': ['TA512', 'TA513', 'TA516'],
      'TA515': ['TA513', 'TA516', 'TA517'],
      'TA516': ['TA514', 'TA515', 'TA518'],
      'TA517': ['TA515', 'TA518', 'TA519'],
      'TA518': ['TA516', 'TA517', 'TA520'],
      'TA519': ['TA517', 'TA520', 'TA521'],
      'TA520': ['TA518', 'TA519', 'TA522'],
      'TA521': ['TA519', 'TA522'],
      'TA522': ['TA520', 'TA521'],
      
      // GROUP 6 - Upper section
      'TA601': ['TA602', 'TA603'],
      'TA602': ['TA601', 'TA604'],
      'TA603': ['TA601', 'TA604', 'TA605'],
      'TA604': ['TA602', 'TA603', 'TA606'],
      'TA605': ['TA603', 'TA606', 'TA607'],
      'TA606': ['TA604', 'TA605', 'TA608'],
      'TA607': ['TA605', 'TA608', 'TA609'],
      'TA608': ['TA606', 'TA607', 'TA610'],
      'TA609': ['TA607', 'TA610'],
      'TA610': ['TA608', 'TA609'],
      
      // GROUP 6 - Lower section
      'TA611': ['TA612', 'TA613'],
      'TA612': ['TA611', 'TA614'],
      'TA613': ['TA611', 'TA614', 'TA615'],
      'TA614': ['TA612', 'TA613', 'TA616'],
      'TA615': ['TA613', 'TA616', 'TA617'],
      'TA616': ['TA614', 'TA615', 'TA618'],
      'TA617': ['TA615', 'TA618', 'TA619'],
      'TA618': ['TA616', 'TA617', 'TA620'],
      'TA619': ['TA617', 'TA620', 'TA621'],
      'TA620': ['TA618', 'TA619', 'TA622'],
      'TA621': ['TA619', 'TA622'],
      'TA622': ['TA620', 'TA621']
    },
    
     columnRestrictions: {
      // Group 1 restrictions
      'group-1-col-1-upper': { maxContinuousSelection: 10 },
      'group-1-col-2-upper': { maxContinuousSelection: 10 },
      'group-1-col-1-lower': { maxContinuousSelection: 12 },
      'group-1-col-2-lower': { maxContinuousSelection: 12 },
      
      // Group 2 restrictions
      'group-2-col-1-upper': { maxContinuousSelection: 10 },
      'group-2-col-2-upper': { maxContinuousSelection: 10 },
      'group-2-col-1-lower': { maxContinuousSelection: 12 },
      'group-2-col-2-lower': { maxContinuousSelection: 12 },
      
      // Group 3 restrictions
      'group-3-col-1-upper': { maxContinuousSelection: 10 },
      'group-3-col-2-upper': { maxContinuousSelection: 10 },
      'group-3-col-1-lower': { maxContinuousSelection: 12 },
      'group-3-col-2-lower': { maxContinuousSelection: 12 },
      
      // Group 4 restrictions
      'group-4-col-1-upper': { maxContinuousSelection: 10 },
      'group-4-col-2-upper': { maxContinuousSelection: 10 },
      'group-4-col-1-lower': { maxContinuousSelection: 12 },
      'group-4-col-2-lower': { maxContinuousSelection: 12 },
      
      // Group 5 restrictions
      'group-5-col-1-upper': { maxContinuousSelection: 10 },
      'group-5-col-2-upper': { maxContinuousSelection: 10 },
      'group-5-col-1-lower': { maxContinuousSelection: 12 },
      'group-5-col-2-lower': { maxContinuousSelection: 12 },
      
      // Group 6 restrictions
      'group-6-col-1-upper': { maxContinuousSelection: 10 },
      'group-6-col-2-upper': { maxContinuousSelection: 10 },
      'group-6-col-1-lower': { maxContinuousSelection: 12 },
      'group-6-col-2-lower': { maxContinuousSelection: 12 }
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
    totalBooths: 132,
    boothTypes: [
      {
        type: '9m² (Standard)',
        count: 132,
        boothIds: Array.from({length: 6}, (_, g) => 
          Array.from({length: 22}, (_, b) => 
            `TA${(g+1)*100 + b + 1}`
          )
        ).flat(),
        description: 'Standard 9m² outdoor sector booths for transport and allied products'
      }
    ],
    lastUpdated: new Date().toISOString(),
    version: '1.0.0',
    validatedBy: 'System',
    notes: [
      'TA sector has 132 booths in 6 groups',
      'Each group has 22 booths (10 upper, 12 lower)',
      'Horizontal passage at row 6 separates upper and lower sections',
      'Vertical passages between each group',
      'No cross-group or cross-section bookings allowed',
      'All booths are standard 9m² outdoor booths'
    ]
  }
};
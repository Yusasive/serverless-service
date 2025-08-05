// components/BoothsData/layouts/hctSectorConfig.ts

import { LayoutConfig } from '../types/layout.types';

export const hctSectorConfig: LayoutConfig = {
  layoutId: 'hct-sector',
  layoutName: 'Household Cosmetics & Textile Products',
  locationType: 'outdoor',
  
  columns: [
    // GROUP 1 - Upper segment (HCT101-104)
    {
      columnId: 'col-1-group1-upper',
      columnType: 'double',
      subColumns: ['col-1', 'col-2'],
      boothRange: ['HCT101', 'HCT103'],
      numberingOrder: 'ascending',
      isolatedFromOthers: true,
      sectionId: 'group-1-upper'
    },
    {
      columnId: 'col-2-group1-upper',
      columnType: 'double',
      subColumns: ['col-1', 'col-2'],
      boothRange: ['HCT102', 'HCT104'],
      numberingOrder: 'ascending',
      isolatedFromOthers: true,
      sectionId: 'group-1-upper'
    },
    
    // GROUP 1 - Lower segment (HCT105-112)
    {
      columnId: 'col-1-group1-lower',
      columnType: 'double',
      subColumns: ['col-1', 'col-2'],
      boothRange: ['HCT105', 'HCT107', 'HCT109', 'HCT111'],
      numberingOrder: 'ascending',
      isolatedFromOthers: true,
      sectionId: 'group-1-lower'
    },
    {
      columnId: 'col-2-group1-lower',
      columnType: 'double',
      subColumns: ['col-1', 'col-2'],
      boothRange: ['HCT106', 'HCT108', 'HCT110', 'HCT112'],
      numberingOrder: 'ascending',
      isolatedFromOthers: true,
      sectionId: 'group-1-lower'
    },
    
    // GROUP 2 - Upper segment (HCT201-204)
    {
      columnId: 'col-4-group2-upper',
      columnType: 'double',
      subColumns: ['col-4', 'col-5'],
      boothRange: ['HCT201', 'HCT203'],
      numberingOrder: 'ascending',
      isolatedFromOthers: true,
      sectionId: 'group-2-upper'
    },
    {
      columnId: 'col-5-group2-upper',
      columnType: 'double',
      subColumns: ['col-4', 'col-5'],
      boothRange: ['HCT202', 'HCT204'],
      numberingOrder: 'ascending',
      isolatedFromOthers: true,
      sectionId: 'group-2-upper'
    },
    
    // GROUP 2 - Lower segment (HCT205-212)
    {
      columnId: 'col-4-group2-lower',
      columnType: 'double',
      subColumns: ['col-4', 'col-5'],
      boothRange: ['HCT205', 'HCT207', 'HCT209', 'HCT211'],
      numberingOrder: 'ascending',
      isolatedFromOthers: true,
      sectionId: 'group-2-lower'
    },
    {
      columnId: 'col-5-group2-lower',
      columnType: 'double',
      subColumns: ['col-4', 'col-5'],
      boothRange: ['HCT206', 'HCT208', 'HCT210', 'HCT212'],
      numberingOrder: 'ascending',
      isolatedFromOthers: true,
      sectionId: 'group-2-lower'
    },
    
    // GROUP 3 - Upper segment (HCT301-304)
    {
      columnId: 'col-7-group3-upper',
      columnType: 'double',
      subColumns: ['col-7', 'col-8'],
      boothRange: ['HCT301', 'HCT303'],
      numberingOrder: 'ascending',
      isolatedFromOthers: true,
      sectionId: 'group-3-upper'
    },
    {
      columnId: 'col-8-group3-upper',
      columnType: 'double',
      subColumns: ['col-7', 'col-8'],
      boothRange: ['HCT302', 'HCT304'],
      numberingOrder: 'ascending',
      isolatedFromOthers: true,
      sectionId: 'group-3-upper'
    },
    
    // GROUP 3 - Lower segment (HCT305-312)
    {
      columnId: 'col-7-group3-lower',
      columnType: 'double',
      subColumns: ['col-7', 'col-8'],
      boothRange: ['HCT305', 'HCT307', 'HCT309', 'HCT311'],
      numberingOrder: 'ascending',
      isolatedFromOthers: true,
      sectionId: 'group-3-lower'
    },
    {
      columnId: 'col-8-group3-lower',
      columnType: 'double',
      subColumns: ['col-7', 'col-8'],
      boothRange: ['HCT306', 'HCT308', 'HCT310', 'HCT312'],
      numberingOrder: 'ascending',
      isolatedFromOthers: true,
      sectionId: 'group-3-lower'
    },
    
    // GROUP 4 - Upper segment (HCT401-404)
    {
      columnId: 'col-10-group4-upper',
      columnType: 'double',
      subColumns: ['col-10', 'col-11'],
      boothRange: ['HCT401', 'HCT403'],
      numberingOrder: 'ascending',
      isolatedFromOthers: true,
      sectionId: 'group-4-upper'
    },
    {
      columnId: 'col-11-group4-upper',
      columnType: 'double',
      subColumns: ['col-10', 'col-11'],
      boothRange: ['HCT402', 'HCT404'],
      numberingOrder: 'ascending',
      isolatedFromOthers: true,
      sectionId: 'group-4-upper'
    },
    
    // GROUP 4 - Lower segment (HCT405-412)
    {
      columnId: 'col-10-group4-lower',
      columnType: 'double',
      subColumns: ['col-10', 'col-11'],
      boothRange: ['HCT405', 'HCT407', 'HCT409', 'HCT411'],
      numberingOrder: 'ascending',
      isolatedFromOthers: true,
      sectionId: 'group-4-lower'
    },
    {
      columnId: 'col-11-group4-lower',
      columnType: 'double',
      subColumns: ['col-10', 'col-11'],
      boothRange: ['HCT406', 'HCT408', 'HCT410', 'HCT412'],
      numberingOrder: 'ascending',
      isolatedFromOthers: true,
      sectionId: 'group-4-lower'
    },
    
    // GROUP 5 - Upper segment (HCT501-504)
    {
      columnId: 'col-13-group5-upper',
      columnType: 'double',
      subColumns: ['col-13', 'col-14'],
      boothRange: ['HCT501', 'HCT503'],
      numberingOrder: 'ascending',
      isolatedFromOthers: true,
      sectionId: 'group-5-upper'
    },
    {
      columnId: 'col-14-group5-upper',
      columnType: 'double',
      subColumns: ['col-13', 'col-14'],
      boothRange: ['HCT502', 'HCT504'],
      numberingOrder: 'ascending',
      isolatedFromOthers: true,
      sectionId: 'group-5-upper'
    },
    
    // GROUP 5 - Middle segment (HCT505-512)
    {
      columnId: 'col-13-group5-middle',
      columnType: 'double',
      subColumns: ['col-13', 'col-14'],
      boothRange: ['HCT505', 'HCT507', 'HCT509', 'HCT511'],
      numberingOrder: 'ascending',
      isolatedFromOthers: true,
      sectionId: 'group-5-middle'
    },
    {
      columnId: 'col-14-group5-middle',
      columnType: 'double',
      subColumns: ['col-13', 'col-14'],
      boothRange: ['HCT506', 'HCT508', 'HCT510', 'HCT512'],
      numberingOrder: 'ascending',
      isolatedFromOthers: true,
      sectionId: 'group-5-middle'
    },
    
    // GROUP 5 - Lower segment (HCT513-524)
    {
      columnId: 'col-13-group5-lower',
      columnType: 'double',
      subColumns: ['col-13', 'col-14'],
      boothRange: ['HCT513', 'HCT515', 'HCT517', 'HCT519', 'HCT521', 'HCT523'],
      numberingOrder: 'ascending',
      isolatedFromOthers: true,
      sectionId: 'group-5-lower'
    },
    {
      columnId: 'col-14-group5-lower',
      columnType: 'double',
      subColumns: ['col-13', 'col-14'],
      boothRange: ['HCT514', 'HCT516', 'HCT518', 'HCT520', 'HCT522', 'HCT524'],
      numberingOrder: 'ascending',
      isolatedFromOthers: true,
      sectionId: 'group-5-lower'
    },
    
    // GROUP 6 - Upper segment (HCT601-604)
    {
      columnId: 'col-16-group6-upper',
      columnType: 'double',
      subColumns: ['col-16', 'col-17'],
      boothRange: ['HCT601', 'HCT603'],
      numberingOrder: 'ascending',
      isolatedFromOthers: true,
      sectionId: 'group-6-upper'
    },
    {
      columnId: 'col-17-group6-upper',
      columnType: 'double',
      subColumns: ['col-16', 'col-17'],
      boothRange: ['HCT602', 'HCT604'],
      numberingOrder: 'ascending',
      isolatedFromOthers: true,
      sectionId: 'group-6-upper'
    },
    
    // GROUP 6 - Middle segment (HCT605-612)
    {
      columnId: 'col-16-group6-middle',
      columnType: 'double',
      subColumns: ['col-16', 'col-17'],
      boothRange: ['HCT605', 'HCT607', 'HCT609', 'HCT611'],
      numberingOrder: 'ascending',
      isolatedFromOthers: true,
      sectionId: 'group-6-middle'
    },
    {
      columnId: 'col-17-group6-middle',
      columnType: 'double',
      subColumns: ['col-16', 'col-17'],
      boothRange: ['HCT606', 'HCT608', 'HCT610', 'HCT612'],
      numberingOrder: 'ascending',
      isolatedFromOthers: true,
      sectionId: 'group-6-middle'
    },
    
    // GROUP 6 - Lower segment (HCT613-624)
    {
      columnId: 'col-16-group6-lower',
      columnType: 'double',
      subColumns: ['col-16', 'col-17'],
      boothRange: ['HCT613', 'HCT615', 'HCT617', 'HCT619', 'HCT621', 'HCT623'],
      numberingOrder: 'ascending',
      isolatedFromOthers: true,
      sectionId: 'group-6-lower'
    },
    {
      columnId: 'col-17-group6-lower',
      columnType: 'double',
      subColumns: ['col-16', 'col-17'],
      boothRange: ['HCT614', 'HCT616', 'HCT618', 'HCT620', 'HCT622', 'HCT624'],
      numberingOrder: 'ascending',
      isolatedFromOthers: true,
      sectionId: 'group-6-lower'
    },
    
    // GROUP 7 - Continuous segment (HCT701-724)
    {
      columnId: 'col-21-group7',
      columnType: 'double',
      subColumns: ['col-21', 'col-22'],
      boothRange: ['HCT701', 'HCT703', 'HCT705', 'HCT707', 'HCT709', 'HCT711',
                   'HCT713', 'HCT715', 'HCT717', 'HCT719', 'HCT721', 'HCT723'],
      numberingOrder: 'ascending',
      isolatedFromOthers: false,
      sectionId: 'group-7'
    },
    {
      columnId: 'col-22-group7',
      columnType: 'double',
      subColumns: ['col-21', 'col-22'],
      boothRange: ['HCT702', 'HCT704', 'HCT706', 'HCT708', 'HCT710', 'HCT712',
                   'HCT714', 'HCT716', 'HCT718', 'HCT720', 'HCT722', 'HCT724'],
      numberingOrder: 'ascending',
      isolatedFromOthers: false,
      sectionId: 'group-7'
    },
    
    // GROUP 8 - Continuous single column (HCT801-808)
    {
      columnId: 'col-24-group8',
      columnType: 'single',
      boothRange: ['HCT801', 'HCT802', 'HCT803', 'HCT804', 'HCT805', 'HCT806', 'HCT807', 'HCT808'],
      numberingOrder: 'ascending',
      isolatedFromOthers: false,
      sectionId: 'group-8'
    },
    
    // GROUP 9 - Continuous segment (HCT901-916)
    {
      columnId: 'col-26-group9',
      columnType: 'double',
      subColumns: ['col-26', 'col-27'],
      boothRange: ['HCT901', 'HCT903', 'HCT905', 'HCT907', 'HCT909', 'HCT911', 'HCT913', 'HCT915'],
      numberingOrder: 'ascending',
      isolatedFromOthers: false,
      sectionId: 'group-9'
    },
    {
      columnId: 'col-27-group9',
      columnType: 'double',
      subColumns: ['col-26', 'col-27'],
      boothRange: ['HCT902', 'HCT904', 'HCT906', 'HCT908', 'HCT910', 'HCT912', 'HCT914', 'HCT916'],
      numberingOrder: 'ascending',
      isolatedFromOthers: false,
      sectionId: 'group-9'
    }
  ],
  
  passages: [
    // Vertical passages between groups
    {
      passageId: 'P1',
      type: 'main-aisle',
      separates: ['group-1-upper', 'group-1-lower', 'group-2-upper', 'group-2-lower'],
      blocksSequential: true,
      coordinates: [[300, 1100], [300, 1700]],
      description: 'Passage P1 between Groups 1 and 2',
      isVisible: true
    },
    {
      passageId: 'P2',
      type: 'main-aisle',
      separates: ['group-2-upper', 'group-2-lower', 'group-3-upper', 'group-3-lower'],
      blocksSequential: true,
      coordinates: [[600, 1100], [600, 1700]],
      description: 'Passage P2 between Groups 2 and 3',
      isVisible: true
    },
    {
      passageId: 'P3',
      type: 'main-aisle',
      separates: ['group-3-upper', 'group-3-lower', 'group-4-upper', 'group-4-lower'],
      blocksSequential: true,
      coordinates: [[900, 1100], [900, 1700]],
      description: 'Passage P3 between Groups 3 and 4',
      isVisible: true
    },
    {
      passageId: 'P4',
      type: 'main-aisle',
      separates: ['group-4-upper', 'group-4-lower', 'group-5-upper', 'group-5-middle', 'group-5-lower'],
      blocksSequential: true,
      coordinates: [[1200, 1100], [1200, 2300]],
      description: 'Passage P4 between Groups 4 and 5',
      isVisible: true
    },
    {
      passageId: 'P5',
      type: 'main-aisle',
      separates: ['group-5-upper', 'group-5-middle', 'group-5-lower', 'group-6-upper', 'group-6-middle', 'group-6-lower'],
      blocksSequential: true,
      coordinates: [[1500, 1100], [1500, 2300]],
      description: 'Passage P5 between Groups 5 and 6',
      isVisible: true
    },
    {
      passageId: 'P6',
      type: 'main-aisle',
      separates: ['group-6-upper', 'group-6-middle', 'group-6-lower', 'group-7'],
      blocksSequential: true,
      coordinates: [[1800, 100], [1800, 2300]],
      description: 'Passage P6 between Groups 6 and 7',
      isVisible: true
    },
    {
      passageId: 'P7',
      type: 'main-aisle',
      separates: ['group-7', 'group-8'],
      blocksSequential: true,
      coordinates: [[2300, 100], [2300, 1300]],
      description: 'Passage P7 between Groups 7 and 8',
      isVisible: true
    },
    {
      passageId: 'P8',
      type: 'main-aisle',
      separates: ['group-8', 'group-9'],
      blocksSequential: true,
      coordinates: [[2500, 500], [2500, 1300]],
      description: 'Passage P8 between Groups 8 and 9',
      isVisible: true
    },
    
    // Horizontal passages within groups (Groups 1-6)
    {
      passageId: 'group-1-passage',
      type: 'corridor',
      separates: ['group-1-upper', 'group-1-lower'],
      blocksSequential: true,
      coordinates: [[100, 1200], [300, 1200]],
      description: 'Horizontal passage between Group 1 upper and lower segments',
      isVisible: true
    },
    {
      passageId: 'group-2-passage',
      type: 'corridor',
      separates: ['group-2-upper', 'group-2-lower'],
      blocksSequential: true,
      coordinates: [[400, 1200], [600, 1200]],
      description: 'Horizontal passage between Group 2 upper and lower segments',
      isVisible: true
    },
    {
      passageId: 'group-3-passage',
      type: 'corridor',
      separates: ['group-3-upper', 'group-3-lower'],
      blocksSequential: true,
      coordinates: [[700, 1200], [900, 1200]],
      description: 'Horizontal passage between Group 3 upper and lower segments',
      isVisible: true
    },
    {
      passageId: 'group-4-passage',
      type: 'corridor',
      separates: ['group-4-upper', 'group-4-lower'],
      blocksSequential: true,
      coordinates: [[1000, 1200], [1200, 1200]],
      description: 'Horizontal passage between Group 4 upper and lower segments',
      isVisible: true
    },
    {
      passageId: 'group-5-passage-1',
      type: 'corridor',
      separates: ['group-5-upper', 'group-5-middle'],
      blocksSequential: true,
      coordinates: [[1300, 1200], [1500, 1200]],
      description: 'First horizontal passage in Group 5 (between upper and middle segments)',
      isVisible: true
    },
    {
      passageId: 'group-5-passage-2',
      type: 'corridor',
      separates: ['group-5-middle', 'group-5-lower'],
      blocksSequential: true,
      coordinates: [[1300, 1600], [1500, 1600]],
      description: 'Second horizontal passage in Group 5 (between middle and lower segments)',
      isVisible: true
    },
    {
      passageId: 'group-6-passage-1',
      type: 'corridor',
      separates: ['group-6-upper', 'group-6-middle'],
      blocksSequential: true,
      coordinates: [[1600, 1200], [1800, 1200]],
      description: 'First horizontal passage in Group 6 (between upper and middle segments)',
      isVisible: true
    },
    {
      passageId: 'group-6-passage-2',
      type: 'corridor',
      separates: ['group-6-middle', 'group-6-lower'],
      blocksSequential: true,
      coordinates: [[1600, 1600], [1800, 1600]],
      description: 'Second horizontal passage in Group 6 (between middle and lower segments)',
      isVisible: true
    }
  ],
  
  specialBooths: [],
  
  sequentialRules: {
    allowedConnections: {
      // GROUP 1 - Upper segment (HCT101-104) - isolated
      'HCT101': ['HCT102', 'HCT103'],
      'HCT102': ['HCT101', 'HCT104'],
      'HCT103': ['HCT101', 'HCT104'],
      'HCT104': ['HCT102', 'HCT103'],
      
      // GROUP 1 - Lower segment (HCT105-112) - isolated
      'HCT105': ['HCT106', 'HCT107'],
      'HCT106': ['HCT105', 'HCT108'],
      'HCT107': ['HCT105', 'HCT108', 'HCT109'],
      'HCT108': ['HCT106', 'HCT107', 'HCT110'],
      'HCT109': ['HCT107', 'HCT110', 'HCT111'],
      'HCT110': ['HCT108', 'HCT109', 'HCT112'],
      'HCT111': ['HCT109', 'HCT112'],
      'HCT112': ['HCT110', 'HCT111'],
      
      // GROUP 2 - Upper segment (HCT201-204) - isolated
      'HCT201': ['HCT202', 'HCT203'],
      'HCT202': ['HCT201', 'HCT204'],
      'HCT203': ['HCT201', 'HCT204'],
      'HCT204': ['HCT202', 'HCT203'],
      
      // GROUP 2 - Lower segment (HCT205-212) - isolated
      'HCT205': ['HCT206', 'HCT207'],
      'HCT206': ['HCT205', 'HCT208'],
      'HCT207': ['HCT205', 'HCT208', 'HCT209'],
      'HCT208': ['HCT206', 'HCT207', 'HCT210'],
      'HCT209': ['HCT207', 'HCT210', 'HCT211'],
      'HCT210': ['HCT208', 'HCT209', 'HCT212'],
      'HCT211': ['HCT209', 'HCT212'],
      'HCT212': ['HCT210', 'HCT211'],
      
      // GROUP 3 - Upper segment (HCT301-304) - isolated
      'HCT301': ['HCT302', 'HCT303'],
      'HCT302': ['HCT301', 'HCT304'],
      'HCT303': ['HCT301', 'HCT304'],
      'HCT304': ['HCT302', 'HCT303'],
      
      // GROUP 3 - Lower segment (HCT305-312) - isolated
      'HCT305': ['HCT306', 'HCT307'],
      'HCT306': ['HCT305', 'HCT308'],
      'HCT307': ['HCT305', 'HCT308', 'HCT309'],
      'HCT308': ['HCT306', 'HCT307', 'HCT310'],
      'HCT309': ['HCT307', 'HCT310', 'HCT311'],
      'HCT310': ['HCT308', 'HCT309', 'HCT312'],
      'HCT311': ['HCT309', 'HCT312'],
      'HCT312': ['HCT310', 'HCT311'],
      
      // GROUP 4 - Upper segment (HCT401-404) - isolated
      'HCT401': ['HCT402', 'HCT403'],
      'HCT402': ['HCT401', 'HCT404'],
      'HCT403': ['HCT401', 'HCT404'],
      'HCT404': ['HCT402', 'HCT403'],
      
      // GROUP 4 - Lower segment (HCT405-412) - isolated
      'HCT405': ['HCT406', 'HCT407'],
      'HCT406': ['HCT405', 'HCT408'],
      'HCT407': ['HCT405', 'HCT408', 'HCT409'],
      'HCT408': ['HCT406', 'HCT407', 'HCT410'],
      'HCT409': ['HCT407', 'HCT410', 'HCT411'],
      'HCT410': ['HCT408', 'HCT409', 'HCT412'],
      'HCT411': ['HCT409', 'HCT412'],
      'HCT412': ['HCT410', 'HCT411'],
      
      // GROUP 5 - Upper segment (HCT501-504) - isolated
      'HCT501': ['HCT502', 'HCT503'],
      'HCT502': ['HCT501', 'HCT504'],
      'HCT503': ['HCT501', 'HCT504'],
      'HCT504': ['HCT502', 'HCT503'],
      
      // GROUP 5 - Middle segment (HCT505-512) - isolated
      'HCT505': ['HCT506', 'HCT507'],
      'HCT506': ['HCT505', 'HCT508'],
      'HCT507': ['HCT505', 'HCT508', 'HCT509'],
      'HCT508': ['HCT506', 'HCT507', 'HCT510'],
      'HCT509': ['HCT507', 'HCT510', 'HCT511'],
      'HCT510': ['HCT508', 'HCT509', 'HCT512'],
      'HCT511': ['HCT509', 'HCT512'],
      'HCT512': ['HCT510', 'HCT511'],
      
      // GROUP 5 - Lower segment (HCT513-524) - isolated
      'HCT513': ['HCT514', 'HCT515'],
      'HCT514': ['HCT513', 'HCT516'],
      'HCT515': ['HCT513', 'HCT516', 'HCT517'],
      'HCT516': ['HCT514', 'HCT515', 'HCT518'],
      'HCT517': ['HCT515', 'HCT518', 'HCT519'],
      'HCT518': ['HCT516', 'HCT517', 'HCT520'],
      'HCT519': ['HCT517', 'HCT520', 'HCT521'],
      'HCT520': ['HCT518', 'HCT519', 'HCT522'],
      'HCT521': ['HCT519', 'HCT522', 'HCT523'],
      'HCT522': ['HCT520', 'HCT521', 'HCT524'],
      'HCT523': ['HCT521', 'HCT524'],
      'HCT524': ['HCT522', 'HCT523'],
      
      // GROUP 6 - Upper segment (HCT601-604) - isolated
      'HCT601': ['HCT602', 'HCT603'],
      'HCT602': ['HCT601', 'HCT604'],
      'HCT603': ['HCT601', 'HCT604'],
      'HCT604': ['HCT602', 'HCT603'],
      
      // GROUP 6 - Middle segment (HCT605-612) - isolated
      'HCT605': ['HCT606', 'HCT607'],
      'HCT606': ['HCT605', 'HCT608'],
      'HCT607': ['HCT605', 'HCT608', 'HCT609'],
      'HCT608': ['HCT606', 'HCT607', 'HCT610'],
      'HCT609': ['HCT607', 'HCT610', 'HCT611'],
      'HCT610': ['HCT608', 'HCT609', 'HCT612'],
      'HCT611': ['HCT609', 'HCT612'],
      'HCT612': ['HCT610', 'HCT611'],
      
      // GROUP 6 - Lower segment (HCT613-624) - isolated
      'HCT613': ['HCT614', 'HCT615'],
      'HCT614': ['HCT613', 'HCT616'],
      'HCT615': ['HCT613', 'HCT616', 'HCT617'],
      'HCT616': ['HCT614', 'HCT615', 'HCT618'],
      'HCT617': ['HCT615', 'HCT618', 'HCT619'],
      'HCT618': ['HCT616', 'HCT617', 'HCT620'],
      'HCT619': ['HCT617', 'HCT620', 'HCT621'],
      'HCT620': ['HCT618', 'HCT619', 'HCT622'],
      'HCT621': ['HCT619', 'HCT622', 'HCT623'],
      'HCT622': ['HCT620', 'HCT621', 'HCT624'],
      'HCT623': ['HCT621', 'HCT624'],
      'HCT624': ['HCT622', 'HCT623'],
      
      // GROUP 7 - Continuous segment (HCT701-724)
      'HCT701': ['HCT702', 'HCT703'],
      'HCT702': ['HCT701', 'HCT704'],
      'HCT703': ['HCT701', 'HCT704', 'HCT705'],
      'HCT704': ['HCT702', 'HCT703', 'HCT706'],
      'HCT705': ['HCT703', 'HCT706', 'HCT707'],
      'HCT706': ['HCT704', 'HCT705', 'HCT708'],
      'HCT707': ['HCT705', 'HCT708', 'HCT709'],
      'HCT708': ['HCT706', 'HCT707', 'HCT710'],
      'HCT709': ['HCT707', 'HCT710', 'HCT711'],
      'HCT710': ['HCT708', 'HCT709', 'HCT712'],
      'HCT711': ['HCT709', 'HCT712', 'HCT713'],
      'HCT712': ['HCT710', 'HCT711', 'HCT714'],
      'HCT713': ['HCT711', 'HCT714', 'HCT715'],
      'HCT714': ['HCT712', 'HCT713', 'HCT716'],
      'HCT715': ['HCT713', 'HCT716', 'HCT717'],
      'HCT716': ['HCT714', 'HCT715', 'HCT718'],
      'HCT717': ['HCT715', 'HCT718', 'HCT719'],
      'HCT718': ['HCT716', 'HCT717', 'HCT720'],
      'HCT719': ['HCT717', 'HCT720', 'HCT721'],
      'HCT720': ['HCT718', 'HCT719', 'HCT722'],
      'HCT721': ['HCT719', 'HCT722', 'HCT723'],
      'HCT722': ['HCT720', 'HCT721', 'HCT724'],
      'HCT723': ['HCT721', 'HCT724'],
      'HCT724': ['HCT722', 'HCT723'],
      
      // GROUP 8 - Continuous single column (HCT801-808)
      'HCT801': ['HCT802'],
      'HCT802': ['HCT801', 'HCT803'],
      'HCT803': ['HCT802', 'HCT804'],
      'HCT804': ['HCT803', 'HCT805'],
      'HCT805': ['HCT804', 'HCT806'],
      'HCT806': ['HCT805', 'HCT807'],
      'HCT807': ['HCT806', 'HCT808'],
      'HCT808': ['HCT807'],
      
      // GROUP 9 - Continuous segment (HCT901-916)
      'HCT901': ['HCT902', 'HCT903'],
      'HCT902': ['HCT901', 'HCT904'],
      'HCT903': ['HCT901', 'HCT904', 'HCT905'],
      'HCT904': ['HCT902', 'HCT903', 'HCT906'],
      'HCT905': ['HCT903', 'HCT906', 'HCT907'],
      'HCT906': ['HCT904', 'HCT905', 'HCT908'],
      'HCT907': ['HCT905', 'HCT908', 'HCT909'],
      'HCT908': ['HCT906', 'HCT907', 'HCT910'],
      'HCT909': ['HCT907', 'HCT910', 'HCT911'],
      'HCT910': ['HCT908', 'HCT909', 'HCT912'],
      'HCT911': ['HCT909', 'HCT912', 'HCT913'],
      'HCT912': ['HCT910', 'HCT911', 'HCT914'],
      'HCT913': ['HCT911', 'HCT914', 'HCT915'],
      'HCT914': ['HCT912', 'HCT913', 'HCT916'],
      'HCT915': ['HCT913', 'HCT916'],
      'HCT916': ['HCT914', 'HCT915']
    },
    
    columnRestrictions: {
      // Group 1 segment restrictions
      'col-1-group1-upper': { allowedSubColumns: ['col-1', 'col-2'], maxContinuousSelection: 4 },
      'col-2-group1-upper': { allowedSubColumns: ['col-1', 'col-2'], maxContinuousSelection: 4 },
      'col-1-group1-lower': { allowedSubColumns: ['col-1', 'col-2'], maxContinuousSelection: 8 },
      'col-2-group1-lower': { allowedSubColumns: ['col-1', 'col-2'], maxContinuousSelection: 8 },
      
      // Group 2 segment restrictions
      'col-4-group2-upper': { allowedSubColumns: ['col-4', 'col-5'], maxContinuousSelection: 4 },
      'col-5-group2-upper': { allowedSubColumns: ['col-4', 'col-5'], maxContinuousSelection: 4 },
      'col-4-group2-lower': { allowedSubColumns: ['col-4', 'col-5'], maxContinuousSelection: 8 },
      'col-5-group2-lower': { allowedSubColumns: ['col-4', 'col-5'], maxContinuousSelection: 8 },
      
      // Group 3 segment restrictions
      'col-7-group3-upper': { allowedSubColumns: ['col-7', 'col-8'], maxContinuousSelection: 4 },
      'col-8-group3-upper': { allowedSubColumns: ['col-7', 'col-8'], maxContinuousSelection: 4 },
      'col-7-group3-lower': { allowedSubColumns: ['col-7', 'col-8'], maxContinuousSelection: 8 },
      'col-8-group3-lower': { allowedSubColumns: ['col-7', 'col-8'], maxContinuousSelection: 8 },
      
      // Group 4 segment restrictions
      'col-10-group4-upper': { allowedSubColumns: ['col-10', 'col-11'], maxContinuousSelection: 4 },
      'col-11-group4-upper': { allowedSubColumns: ['col-10', 'col-11'], maxContinuousSelection: 4 },
      'col-10-group4-lower': { allowedSubColumns: ['col-10', 'col-11'], maxContinuousSelection: 8 },
      'col-11-group4-lower': { allowedSubColumns: ['col-10', 'col-11'], maxContinuousSelection: 8 },
      
      // Group 5 segment restrictions
      'col-13-group5-upper': { allowedSubColumns: ['col-13', 'col-14'], maxContinuousSelection: 4 },
      'col-14-group5-upper': { allowedSubColumns: ['col-13', 'col-14'], maxContinuousSelection: 4 },
      'col-13-group5-middle': { allowedSubColumns: ['col-13', 'col-14'], maxContinuousSelection: 8 },
      'col-14-group5-middle': { allowedSubColumns: ['col-13', 'col-14'], maxContinuousSelection: 8 },
      'col-13-group5-lower': { allowedSubColumns: ['col-13', 'col-14'], maxContinuousSelection: 12 },
      'col-14-group5-lower': { allowedSubColumns: ['col-13', 'col-14'], maxContinuousSelection: 12 },
      
      // Group 6 segment restrictions
      'col-16-group6-upper': { allowedSubColumns: ['col-16', 'col-17'], maxContinuousSelection: 4 },
      'col-17-group6-upper': { allowedSubColumns: ['col-16', 'col-17'], maxContinuousSelection: 4 },
      'col-16-group6-middle': { allowedSubColumns: ['col-16', 'col-17'], maxContinuousSelection: 8 },
      'col-17-group6-middle': { allowedSubColumns: ['col-16', 'col-17'], maxContinuousSelection: 8 },
      'col-16-group6-lower': { allowedSubColumns: ['col-16', 'col-17'], maxContinuousSelection: 12 },
      'col-17-group6-lower': { allowedSubColumns: ['col-16', 'col-17'], maxContinuousSelection: 12 },
      
      // Group 7 restrictions (continuous)
      'col-21-group7': { allowedSubColumns: ['col-21', 'col-22'], maxContinuousSelection: 24 },
      'col-22-group7': { allowedSubColumns: ['col-21', 'col-22'], maxContinuousSelection: 24 },
      
      // Group 8 restrictions (continuous)
      'col-24-group8': { maxContinuousSelection: 8 },
      
      // Group 9 restrictions (continuous)
      'col-26-group9': { allowedSubColumns: ['col-26', 'col-27'], maxContinuousSelection: 16 },
      'col-27-group9': { allowedSubColumns: ['col-26', 'col-27'], maxContinuousSelection: 16 }
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
    totalBooths: 156,
    boothTypes: [
      {
        type: '9m²',
        count: 156,
        boothIds: [
          // Group 1
          'HCT101', 'HCT102', 'HCT103', 'HCT104', 'HCT105', 'HCT106',
          'HCT107', 'HCT108', 'HCT109', 'HCT110', 'HCT111', 'HCT112',
          // Group 2
          'HCT201', 'HCT202', 'HCT203', 'HCT204', 'HCT205', 'HCT206',
          'HCT207', 'HCT208', 'HCT209', 'HCT210', 'HCT211', 'HCT212',
          // Group 3
          'HCT301', 'HCT302', 'HCT303', 'HCT304', 'HCT305', 'HCT306',
          'HCT307', 'HCT308', 'HCT309', 'HCT310', 'HCT311', 'HCT312',
          // Group 4
          'HCT401', 'HCT402', 'HCT403', 'HCT404', 'HCT405', 'HCT406',
          'HCT407', 'HCT408', 'HCT409', 'HCT410', 'HCT411', 'HCT412',
          // Group 5
          'HCT501', 'HCT502', 'HCT503', 'HCT504', 'HCT505', 'HCT506',
          'HCT507', 'HCT508', 'HCT509', 'HCT510', 'HCT511', 'HCT512',
          'HCT513', 'HCT514', 'HCT515', 'HCT516', 'HCT517', 'HCT518',
          'HCT519', 'HCT520', 'HCT521', 'HCT522', 'HCT523', 'HCT524',
          // Group 6
          'HCT601', 'HCT602', 'HCT603', 'HCT604', 'HCT605', 'HCT606',
          'HCT607', 'HCT608', 'HCT609', 'HCT610', 'HCT611', 'HCT612',
          'HCT613', 'HCT614', 'HCT615', 'HCT616', 'HCT617', 'HCT618',
          'HCT619', 'HCT620', 'HCT621', 'HCT622', 'HCT623', 'HCT624',
          // Group 7
          'HCT701', 'HCT702', 'HCT703', 'HCT704', 'HCT705', 'HCT706',
          'HCT707', 'HCT708', 'HCT709', 'HCT710', 'HCT711', 'HCT712',
          'HCT713', 'HCT714', 'HCT715', 'HCT716', 'HCT717', 'HCT718',
          'HCT719', 'HCT720', 'HCT721', 'HCT722', 'HCT723', 'HCT724',
          // Group 8
          'HCT801', 'HCT802', 'HCT803', 'HCT804', 'HCT805', 'HCT806',
          'HCT807', 'HCT808',
          // Group 9
          'HCT901', 'HCT902', 'HCT903', 'HCT904', 'HCT905', 'HCT906',
          'HCT907', 'HCT908', 'HCT909', 'HCT910', 'HCT911', 'HCT912',
          'HCT913', 'HCT914', 'HCT915', 'HCT916'
        ],
        description: 'Standard 9m² outdoor sector booths'
      }
    ],
    lastUpdated: new Date().toISOString(),
    version: '2.0.0',
    validatedBy: 'System',
    notes: [
      'HCT sector has 156 booths in 9 groups with complex segmentation',
      'Groups 1-4: Each split into 2 isolated segments (upper: 4 booths, lower: 8 booths)',
      'Groups 5-6: Each split into 3 isolated segments (upper: 4, middle: 8, lower: 12 booths)',
      'Groups 7-9: Continuous segments allowing sequential booking within group',
      'Vertical passages P1-P8 separate groups',
      'Invisible boundaries separate segments within Groups 1-6',
      'Horizontal passages separate segments within Groups 1-6',
      'No cross-segment bookings allowed within Groups 1-6',
      'No cross-group bookings allowed due to passage restrictions',
      'HCT513-524 and HCT621-624 are Standard category',
      'All other booths are Premium category'
    ]
  }
};
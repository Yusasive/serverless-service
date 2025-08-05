// components/BoothsData/layouts/fdaSectorConfig.ts

import { LayoutConfig } from '../types/layout.types';

export const fdaSectorConfig: LayoutConfig = {
  layoutId: 'fda-sector',
  layoutName: 'Food, Drinks, Agriculture & Allied Products',
  locationType: 'outdoor',
  
  columns: [
    // Group 1: FDA101-108 (Columns 1-2, Rows 11-14)
    {
      columnId: 'col-1',
      columnType: 'double',
      subColumns: ['col-1', 'col-2'],
      boothRange: ['FDA101', 'FDA103', 'FDA105', 'FDA107'],
      numberingOrder: 'ascending',
      isolatedFromOthers: false,
      sectionId: 'group-1'
    },
    {
      columnId: 'col-2',
      columnType: 'double',
      subColumns: ['col-1', 'col-2'],
      boothRange: ['FDA102', 'FDA104', 'FDA106', 'FDA108'],
      numberingOrder: 'ascending',
      isolatedFromOthers: false,
      sectionId: 'group-1'
    },
    
    // Group 2: FDA210-217 (Columns 4-5, Rows 11-14)
    {
      columnId: 'col-4',
      columnType: 'double',
      subColumns: ['col-4', 'col-5'],
      boothRange: ['FDA210', 'FDA212', 'FDA214', 'FDA216'],
      numberingOrder: 'ascending',
      isolatedFromOthers: false,
      sectionId: 'group-2'
    },
    {
      columnId: 'col-5',
      columnType: 'double',
      subColumns: ['col-4', 'col-5'],
      boothRange: ['FDA211', 'FDA213', 'FDA215', 'FDA217'],
      numberingOrder: 'ascending',
      isolatedFromOthers: false,
      sectionId: 'group-2'
    },
    
    // Group 3: FDA319-326 (Columns 7-8, Rows 11-14)
    {
      columnId: 'col-7',
      columnType: 'double',
      subColumns: ['col-7', 'col-8'],
      boothRange: ['FDA319', 'FDA321', 'FDA323', 'FDA325'],
      numberingOrder: 'ascending',
      isolatedFromOthers: false,
      sectionId: 'group-3'
    },
    {
      columnId: 'col-8',
      columnType: 'double',
      subColumns: ['col-7', 'col-8'],
      boothRange: ['FDA320', 'FDA322', 'FDA324', 'FDA326'],
      numberingOrder: 'ascending',
      isolatedFromOthers: false,
      sectionId: 'group-3'
    },
    
    // Group 4: FDA419-438 (Mixed structure)
    // Upper section (double column)
    {
      columnId: 'col-10-upper',
      columnType: 'double',
      subColumns: ['col-10', 'col-11'],
      boothRange: ['FDA419', 'FDA421', 'FDA423', 'FDA425'],
      numberingOrder: 'ascending',
      isolatedFromOthers: false,
      sectionId: 'group-4-upper'
    },
    {
      columnId: 'col-11-upper',
      columnType: 'double',
      subColumns: ['col-10', 'col-11'],
      boothRange: ['FDA420', 'FDA422', 'FDA424', 'FDA426'],
      numberingOrder: 'ascending',
      isolatedFromOthers: false,
      sectionId: 'group-4-upper'
    },
    // Lower section (single column)
    {
      columnId: 'col-11-lower',
      columnType: 'single',
      boothRange: ['FDA427', 'FDA428', 'FDA429', 'FDA430', 'FDA431', 'FDA432', 'FDA433', 'FDA434', 'FDA435', 'FDA436', 'FDA437', 'FDA438'],
      numberingOrder: 'ascending',
      isolatedFromOthers: false,
      sectionId: 'group-4-lower'
    },
    
    // Group 5: FDA501-544 (Three sections)
    // Upper section
    {
      columnId: 'col-13-upper',
      columnType: 'double',
      subColumns: ['col-13', 'col-14'],
      boothRange: ['FDA501', 'FDA503', 'FDA505', 'FDA507', 'FDA509', 'FDA511', 'FDA513', 'FDA515', 'FDA517'],
      numberingOrder: 'ascending',
      isolatedFromOthers: false,
      sectionId: 'group-5-upper'
    },
    {
      columnId: 'col-14-upper',
      columnType: 'double',
      subColumns: ['col-13', 'col-14'],
      boothRange: ['FDA502', 'FDA504', 'FDA506', 'FDA508', 'FDA510', 'FDA512', 'FDA514', 'FDA516', 'FDA518'],
      numberingOrder: 'ascending',
      isolatedFromOthers: false,
      sectionId: 'group-5-upper'
    },
    // Middle section
    {
      columnId: 'col-13-middle',
      columnType: 'double',
      subColumns: ['col-13', 'col-14'],
      boothRange: ['FDA519', 'FDA521', 'FDA523', 'FDA525'],
      numberingOrder: 'ascending',
      isolatedFromOthers: false,
      sectionId: 'group-5-middle'
    },
    {
      columnId: 'col-14-middle',
      columnType: 'double',
      subColumns: ['col-13', 'col-14'],
      boothRange: ['FDA520', 'FDA522', 'FDA524', 'FDA526'],
      numberingOrder: 'ascending',
      isolatedFromOthers: false,
      sectionId: 'group-5-middle'
    },
    // Lower section
    {
      columnId: 'col-13-lower',
      columnType: 'double',
      subColumns: ['col-13', 'col-14'],
      boothRange: ['FDA527', 'FDA529', 'FDA531', 'FDA533', 'FDA535', 'FDA537', 'FDA539', 'FDA541', 'FDA543'],
      numberingOrder: 'ascending',
      isolatedFromOthers: false,
      sectionId: 'group-5-lower'
    },
    {
      columnId: 'col-14-lower',
      columnType: 'double',
      subColumns: ['col-13', 'col-14'],
      boothRange: ['FDA528', 'FDA530', 'FDA532', 'FDA534', 'FDA536', 'FDA538', 'FDA540', 'FDA542', 'FDA544'],
      numberingOrder: 'ascending',
      isolatedFromOthers: false,
      sectionId: 'group-5-lower'
    },
    
    // Group 6: FDA601-644 (Three sections, starts at row 4)
    // Upper section
    {
      columnId: 'col-16-upper',
      columnType: 'double',
      subColumns: ['col-16', 'col-17'],
      boothRange: ['FDA601', 'FDA603', 'FDA605', 'FDA607', 'FDA609', 'FDA611'],
      numberingOrder: 'ascending',
      isolatedFromOthers: false,
      sectionId: 'group-6-upper'
    },
    {
      columnId: 'col-17-upper',
      columnType: 'double',
      subColumns: ['col-16', 'col-17'],
      boothRange: ['FDA602', 'FDA604', 'FDA606', 'FDA608', 'FDA610', 'FDA612'],
      numberingOrder: 'ascending',
      isolatedFromOthers: false,
      sectionId: 'group-6-upper'
    },
    // Middle section
    {
      columnId: 'col-16-middle',
      columnType: 'double',
      subColumns: ['col-16', 'col-17'],
      boothRange: ['FDA613', 'FDA615', 'FDA617', 'FDA619'],
      numberingOrder: 'ascending',
      isolatedFromOthers: false,
      sectionId: 'group-6-middle'
    },
    {
      columnId: 'col-17-middle',
      columnType: 'double',
      subColumns: ['col-16', 'col-17'],
      boothRange: ['FDA614', 'FDA616', 'FDA618', 'FDA620'],
      numberingOrder: 'ascending',
      isolatedFromOthers: false,
      sectionId: 'group-6-middle'
    },
    // Lower section
    {
      columnId: 'col-16-lower',
      columnType: 'double',
      subColumns: ['col-16', 'col-17'],
      boothRange: ['FDA621', 'FDA623', 'FDA625', 'FDA627', 'FDA629', 'FDA631', 'FDA633', 'FDA635', 'FDA637', 'FDA639', 'FDA641', 'FDA643'],
      numberingOrder: 'ascending',
      isolatedFromOthers: false,
      sectionId: 'group-6-lower'
    },
    {
      columnId: 'col-17-lower',
      columnType: 'double',
      subColumns: ['col-16', 'col-17'],
      boothRange: ['FDA622', 'FDA624', 'FDA626', 'FDA628', 'FDA630', 'FDA632', 'FDA634', 'FDA636', 'FDA638', 'FDA640', 'FDA642', 'FDA644'],
      numberingOrder: 'ascending',
      isolatedFromOthers: false,
      sectionId: 'group-6-lower'
    },
    
    // Group 7: FDA701-750 (Complex structure with 50 booths)
    // Upper section
    {
      columnId: 'col-21-upper',
      columnType: 'double',
      subColumns: ['col-21', 'col-22'],
      boothRange: ['FDA701', 'FDA703'],
      numberingOrder: 'ascending',
      isolatedFromOthers: false,
      sectionId: 'group-7-upper'
    },
    {
      columnId: 'col-22-upper',
      columnType: 'double',
      subColumns: ['col-21', 'col-22'],
      boothRange: ['FDA702', 'FDA704'],
      numberingOrder: 'ascending',
      isolatedFromOthers: false,
      sectionId: 'group-7-upper'
    },
    // Middle section 1
    {
      columnId: 'col-21-middle1',
      columnType: 'double',
      subColumns: ['col-21', 'col-22'],
      boothRange: ['FDA705', 'FDA707', 'FDA709', 'FDA711', 'FDA713'],
      numberingOrder: 'ascending',
      isolatedFromOthers: false,
      sectionId: 'group-7-middle1'
    },
    {
      columnId: 'col-22-middle1',
      columnType: 'double',
      subColumns: ['col-21', 'col-22'],
      boothRange: ['FDA706', 'FDA708', 'FDA710', 'FDA712', 'FDA714'],
      numberingOrder: 'ascending',
      isolatedFromOthers: false,
      sectionId: 'group-7-middle1'
    },
    // Middle section 2
    {
      columnId: 'col-21-middle2',
      columnType: 'double',
      subColumns: ['col-21', 'col-22'],
      boothRange: ['FDA715', 'FDA717', 'FDA719', 'FDA721', 'FDA723'],
      numberingOrder: 'ascending',
      isolatedFromOthers: false,
      sectionId: 'group-7-middle2'
    },
    {
      columnId: 'col-22-middle2',
      columnType: 'double',
      subColumns: ['col-21', 'col-22'],
      boothRange: ['FDA716', 'FDA718', 'FDA720', 'FDA722', 'FDA724'],
      numberingOrder: 'ascending',
      isolatedFromOthers: false,
      sectionId: 'group-7-middle2'
    },
    // Lower section
    {
      columnId: 'col-21-lower',
      columnType: 'double',
      subColumns: ['col-21', 'col-22'],
      boothRange: ['FDA725', 'FDA727', 'FDA729', 'FDA731', 'FDA733', 'FDA735', 'FDA737', 'FDA739', 'FDA741', 'FDA743', 'FDA745', 'FDA747', 'FDA749'],
      numberingOrder: 'ascending',
      isolatedFromOthers: false,
      sectionId: 'group-7-lower'
    },
    {
      columnId: 'col-22-lower',
      columnType: 'double',
      subColumns: ['col-21', 'col-22'],
      boothRange: ['FDA726', 'FDA728', 'FDA730', 'FDA732', 'FDA734', 'FDA736', 'FDA738', 'FDA740', 'FDA742', 'FDA744', 'FDA746', 'FDA748', 'FDA750'],
      numberingOrder: 'ascending',
      isolatedFromOthers: false,
      sectionId: 'group-7-lower'
    },
    
    // Group 8: FDA801-820 (Single column)
    // Upper section
    {
      columnId: 'col-24-upper',
      columnType: 'single',
      boothRange: ['FDA801', 'FDA802'],
      numberingOrder: 'ascending',
      isolatedFromOthers: false,
      sectionId: 'group-8-upper'
    },
    // Middle section 1
    {
      columnId: 'col-24-middle1',
      columnType: 'single',
      boothRange: ['FDA803', 'FDA804', 'FDA805', 'FDA806', 'FDA807'],
      numberingOrder: 'ascending',
      isolatedFromOthers: false,
      sectionId: 'group-8-middle1'
    },
    // Middle section 2
    {
      columnId: 'col-24-middle2',
      columnType: 'single',
      boothRange: ['FDA808', 'FDA809', 'FDA810', 'FDA811', 'FDA812'],
      numberingOrder: 'ascending',
      isolatedFromOthers: false,
      sectionId: 'group-8-middle2'
    },
    // Lower section
    {
      columnId: 'col-24-lower',
      columnType: 'single',
      boothRange: ['FDA813', 'FDA814', 'FDA815', 'FDA816', 'FDA817', 'FDA818', 'FDA819', 'FDA820'],
      numberingOrder: 'ascending',
      isolatedFromOthers: false,
      sectionId: 'group-8-lower'
    },
    
    // Group 9: FDA901-942 (Double column)
    // Upper section
    {
      columnId: 'col-26-upper',
      columnType: 'double',
      subColumns: ['col-26', 'col-27'],
      boothRange: ['FDA901', 'FDA903'],
      numberingOrder: 'ascending',
      isolatedFromOthers: false,
      sectionId: 'group-9-upper'
    },
    {
      columnId: 'col-27-upper',
      columnType: 'double',
      subColumns: ['col-26', 'col-27'],
      boothRange: ['FDA902', 'FDA904'],
      numberingOrder: 'ascending',
      isolatedFromOthers: false,
      sectionId: 'group-9-upper'
    },
    // Middle section 1
    {
      columnId: 'col-26-middle1',
      columnType: 'double',
      subColumns: ['col-26', 'col-27'],
      boothRange: ['FDA905', 'FDA907', 'FDA909', 'FDA911', 'FDA913'],
      numberingOrder: 'ascending',
      isolatedFromOthers: false,
      sectionId: 'group-9-middle1'
    },
    {
      columnId: 'col-27-middle1',
      columnType: 'double',
      subColumns: ['col-26', 'col-27'],
      boothRange: ['FDA906', 'FDA908', 'FDA910', 'FDA912', 'FDA914'],
      numberingOrder: 'ascending',
      isolatedFromOthers: false,
      sectionId: 'group-9-middle1'
    },
    // Middle section 2
    {
      columnId: 'col-26-middle2',
      columnType: 'double',
      subColumns: ['col-26', 'col-27'],
      boothRange: ['FDA915', 'FDA917', 'FDA919', 'FDA921', 'FDA923'],
      numberingOrder: 'ascending',
      isolatedFromOthers: false,
      sectionId: 'group-9-middle2'
    },
    {
      columnId: 'col-27-middle2',
      columnType: 'double',
      subColumns: ['col-26', 'col-27'],
      boothRange: ['FDA916', 'FDA918', 'FDA920', 'FDA922', 'FDA924'],
      numberingOrder: 'ascending',
      isolatedFromOthers: false,
      sectionId: 'group-9-middle2'
    },
    // Lower section
    {
      columnId: 'col-26-lower',
      columnType: 'double',
      subColumns: ['col-26', 'col-27'],
      boothRange: ['FDA925', 'FDA927', 'FDA929', 'FDA931', 'FDA933', 'FDA935', 'FDA937', 'FDA939', 'FDA941'],
      numberingOrder: 'ascending',
      isolatedFromOthers: false,
      sectionId: 'group-9-lower'
    },
    {
      columnId: 'col-27-lower',
      columnType: 'double',
      subColumns: ['col-26', 'col-27'],
      boothRange: ['FDA926', 'FDA928', 'FDA930', 'FDA932', 'FDA934', 'FDA936', 'FDA938', 'FDA940', 'FDA942'],
      numberingOrder: 'ascending',
      isolatedFromOthers: false,
      sectionId: 'group-9-lower'
    },
    
    // Group 10: FDA1001-1040 (Double column)
    // Upper section
    {
      columnId: 'col-29-upper',
      columnType: 'double',
      subColumns: ['col-29', 'col-30'],
      boothRange: ['FDA1001', 'FDA1003'],
      numberingOrder: 'ascending',
      isolatedFromOthers: false,
      sectionId: 'group-10-upper'
    },
    {
      columnId: 'col-30-upper',
      columnType: 'double',
      subColumns: ['col-29', 'col-30'],
      boothRange: ['FDA1002', 'FDA1004'],
      numberingOrder: 'ascending',
      isolatedFromOthers: false,
      sectionId: 'group-10-upper'
    },
    // Middle section 1
    {
      columnId: 'col-29-middle1',
      columnType: 'double',
      subColumns: ['col-29', 'col-30'],
      boothRange: ['FDA1005', 'FDA1007', 'FDA1009', 'FDA1011', 'FDA1013'],
      numberingOrder: 'ascending',
      isolatedFromOthers: false,
      sectionId: 'group-10-middle1'
    },
    {
      columnId: 'col-30-middle1',
      columnType: 'double',
      subColumns: ['col-29', 'col-30'],
      boothRange: ['FDA1006', 'FDA1008', 'FDA1010', 'FDA1012', 'FDA1014'],
      numberingOrder: 'ascending',
      isolatedFromOthers: false,
      sectionId: 'group-10-middle1'
    },
    // Middle section 2
    {
      columnId: 'col-29-middle2',
      columnType: 'double',
      subColumns: ['col-29', 'col-30'],
      boothRange: ['FDA1015', 'FDA1017', 'FDA1019', 'FDA1021', 'FDA1023'],
      numberingOrder: 'ascending',
      isolatedFromOthers: false,
      sectionId: 'group-10-middle2'
    },
    {
      columnId: 'col-30-middle2',
      columnType: 'double',
      subColumns: ['col-29', 'col-30'],
      boothRange: ['FDA1016', 'FDA1018', 'FDA1020', 'FDA1022', 'FDA1024'],
      numberingOrder: 'ascending',
      isolatedFromOthers: false,
      sectionId: 'group-10-middle2'
    },
    // Lower section
    {
      columnId: 'col-29-lower',
      columnType: 'double',
      subColumns: ['col-29', 'col-30'],
      boothRange: ['FDA1025', 'FDA1027', 'FDA1029', 'FDA1031', 'FDA1033', 'FDA1035', 'FDA1037', 'FDA1039'],
      numberingOrder: 'ascending',
      isolatedFromOthers: false,
      sectionId: 'group-10-lower'
    },
    {
      columnId: 'col-30-lower',
      columnType: 'double',
      subColumns: ['col-29', 'col-30'],
      boothRange: ['FDA1026', 'FDA1028', 'FDA1030', 'FDA1032', 'FDA1034', 'FDA1036', 'FDA1038', 'FDA1040'],
      numberingOrder: 'ascending',
      isolatedFromOthers: false,
      sectionId: 'group-10-lower'
    }
  ],
  
passages: [
  // Vertical passages
  {
    passageId: 'vertical-p1', type: 'main-aisle', position: 3, blocksSequential: true,
    separates: []
  },
  {
    passageId: 'vertical-p2', type: 'main-aisle', position: 6, blocksSequential: true,
    separates: []
  },
  {
    passageId: 'vertical-p3', type: 'main-aisle', position: 9, blocksSequential: true,
    separates: []
  },
  {
    passageId: 'vertical-p4', type: 'main-aisle', position: 12, blocksSequential: true,
    separates: []
  },
  {
    passageId: 'vertical-p5', type: 'main-aisle', position: 15, blocksSequential: true,
    separates: []
  },
  {
    passageId: 'vertical-p6', type: 'main-aisle', position: 18, blocksSequential: true,
    separates: []
  },
  {
    passageId: 'vertical-p7', type: 'main-aisle', position: 20, blocksSequential: true,
    separates: []
  },
  { passageId: 'vertical-p8', type: 'main-aisle', position: 23, blocksSequential: true },
  {
    passageId: 'vertical-p9', type: 'main-aisle', position: 25, blocksSequential: true,
    separates: []
  },
  {
    passageId: 'vertical-p10', type: 'main-aisle', position: 28, blocksSequential: true,
    separates: []
  },
  
  // Horizontal passages (partial)
  {
    passageId: 'horizontal-corridor-1',
    type: 'corridor',
    position: 10,
    startColumn: 13,
    endColumn: 20,
    blocksSequential: true,
    isVisible: true,
    separates: []
  },
  {
    passageId: 'horizontal-corridor-2',
    type: 'corridor',
    position: 15, // Spans rows 15-16
    startColumn: 13,
    endColumn: 30,
    blocksSequential: true,
    isVisible: true,
    separates: []
  }
],
  
  specialBooths: [],
  
  sequentialRules: {
    allowedConnections: {
      // Group 1 connections
      'FDA101': ['FDA102', 'FDA103'],
      'FDA102': ['FDA101', 'FDA104'],
      'FDA103': ['FDA101', 'FDA104', 'FDA105'],
      'FDA104': ['FDA102', 'FDA103', 'FDA106'],
      'FDA105': ['FDA103', 'FDA106', 'FDA107'],
      'FDA106': ['FDA104', 'FDA105', 'FDA108'],
      'FDA107': ['FDA105', 'FDA108'],
      'FDA108': ['FDA106', 'FDA107'],
      
      // Group 2 connections
      'FDA210': ['FDA211', 'FDA212'],
      'FDA211': ['FDA210', 'FDA213'],
      'FDA212': ['FDA210', 'FDA213', 'FDA214'],
      'FDA213': ['FDA211', 'FDA212', 'FDA215'],
      'FDA214': ['FDA212', 'FDA215', 'FDA216'],
      'FDA215': ['FDA213', 'FDA214', 'FDA217'],
      'FDA216': ['FDA214', 'FDA217'],
      'FDA217': ['FDA215', 'FDA216'],
      
      // Group 3 connections
      'FDA319': ['FDA320', 'FDA321'],
      'FDA320': ['FDA319', 'FDA322'],
      'FDA321': ['FDA319', 'FDA322', 'FDA323'],
      'FDA322': ['FDA320', 'FDA321', 'FDA324'],
      'FDA323': ['FDA321', 'FDA324', 'FDA325'],
      'FDA324': ['FDA322', 'FDA323', 'FDA326'],
      'FDA325': ['FDA323', 'FDA326'],
      'FDA326': ['FDA324', 'FDA325'],
      
      // Group 4 connections - Upper section
      'FDA419': ['FDA420', 'FDA421'],
      'FDA420': ['FDA419', 'FDA422'],
      'FDA421': ['FDA419', 'FDA422', 'FDA423'],
      'FDA422': ['FDA420', 'FDA421', 'FDA424'],
      'FDA423': ['FDA421', 'FDA424', 'FDA425'],
      'FDA424': ['FDA422', 'FDA423', 'FDA426'],
      'FDA425': ['FDA423', 'FDA426'],
      'FDA426': ['FDA424', 'FDA425'], // No connection to lower section
      
      // Group 4 - Lower section (single column)
      'FDA427': ['FDA428'],
      'FDA428': ['FDA427', 'FDA429'],
      'FDA429': ['FDA428', 'FDA430'],
      'FDA430': ['FDA429'],
      'FDA431': [ 'FDA432'],
      // 'FDA431': ['FDA430', 'FDA432'],
      'FDA432': ['FDA431', 'FDA433'],
      'FDA433': ['FDA432', 'FDA434'],
      'FDA434': ['FDA433'],
      'FDA435': [ 'FDA436'],
      'FDA436': ['FDA435', 'FDA437'],
      'FDA437': ['FDA436', 'FDA438'],
      'FDA438': ['FDA437'],
      
      // Group 5 - Upper section
      'FDA501': ['FDA502', 'FDA503'],
      'FDA502': ['FDA501', 'FDA504'],
      'FDA503': ['FDA501', 'FDA504', 'FDA505'],
      'FDA504': ['FDA502', 'FDA503', 'FDA506'],
      'FDA505': ['FDA503', 'FDA506', 'FDA507'],
      'FDA506': ['FDA504', 'FDA505', 'FDA508'],
      'FDA507': ['FDA505', 'FDA508', 'FDA509'],
      'FDA508': ['FDA506', 'FDA507', 'FDA510'],
      'FDA509': ['FDA507', 'FDA510', 'FDA511'],
      'FDA510': ['FDA508', 'FDA509', 'FDA512'],
      'FDA511': ['FDA509', 'FDA512', 'FDA513'],
      'FDA512': ['FDA510', 'FDA511', 'FDA514'],
      'FDA513': ['FDA511', 'FDA514', 'FDA515'],
      'FDA514': ['FDA512', 'FDA513', 'FDA516'],
      'FDA515': ['FDA513', 'FDA516', 'FDA517'],
      'FDA516': ['FDA514', 'FDA515', 'FDA518'],
      'FDA517': ['FDA515', 'FDA518'],
      'FDA518': ['FDA516', 'FDA517'], // No connection to middle section (corridor)
      
      // Group 5 - Middle section
      'FDA519': ['FDA520', 'FDA521'],
      'FDA520': ['FDA519', 'FDA522'],
      'FDA521': ['FDA519', 'FDA522', 'FDA523'],
      'FDA522': ['FDA520', 'FDA521', 'FDA524'],
      'FDA523': ['FDA521', 'FDA524', 'FDA525'],
      'FDA524': ['FDA522', 'FDA523', 'FDA526'],
      'FDA525': ['FDA523', 'FDA526'],
      'FDA526': ['FDA524', 'FDA525'], // No connection to lower section (corridor)
      
      // Group 5 - Lower section
      'FDA527': ['FDA528', 'FDA529'],
      'FDA528': ['FDA527', 'FDA530'],
      'FDA529': ['FDA527', 'FDA530', 'FDA531'],
      'FDA530': ['FDA528', 'FDA529', 'FDA532'],
      'FDA531': ['FDA529', 'FDA532', 'FDA533'],
      'FDA532': ['FDA530', 'FDA531', 'FDA534'],
      'FDA533': ['FDA531', 'FDA534'],
      'FDA534': ['FDA532', 'FDA533'],
      'FDA535': [ 'FDA536'],
      'FDA536': ['FDA534', 'FDA535', 'FDA538'],
      'FDA537': ['FDA535', 'FDA538', 'FDA539'],
      'FDA538': ['FDA536', 'FDA537', 'FDA540'],
      'FDA539': ['FDA537', 'FDA540', 'FDA541'],
      'FDA540': ['FDA538', 'FDA539', 'FDA542'],
      'FDA541': ['FDA539', 'FDA542', 'FDA543'],
      'FDA542': ['FDA540', 'FDA541', 'FDA544'],
      'FDA543': ['FDA541', 'FDA544'],
      'FDA544': ['FDA542', 'FDA543'],
      
      /// Group 6 - Middle section (FDA613-620)
'FDA613': ['FDA614', 'FDA615'],
'FDA614': ['FDA613', 'FDA616'],
'FDA615': ['FDA613', 'FDA616', 'FDA617'],
'FDA616': ['FDA614', 'FDA615', 'FDA618'],
'FDA617': ['FDA615', 'FDA618', 'FDA619'],
'FDA618': ['FDA616', 'FDA617', 'FDA620'],
'FDA619': ['FDA617', 'FDA620'],
'FDA620': ['FDA618', 'FDA619'], // No connection to lower section (corridor)

// Group 6 - Lower section (FDA621-644)
'FDA621': ['FDA622', 'FDA623'],
'FDA622': ['FDA621', 'FDA624'],
'FDA623': ['FDA621', 'FDA624', 'FDA625'],
'FDA624': ['FDA622', 'FDA623', 'FDA626'],
'FDA625': ['FDA623', 'FDA626', 'FDA627'],
'FDA626': ['FDA624', 'FDA625', 'FDA628'],
'FDA627': ['FDA625', 'FDA628', 'FDA629'],
'FDA628': ['FDA626', 'FDA627', 'FDA630'],
'FDA629': ['FDA627', 'FDA630', 'FDA631'],
'FDA630': ['FDA628', 'FDA629', 'FDA632'],
'FDA631': ['FDA629', 'FDA632', 'FDA633'],
'FDA632': ['FDA630', 'FDA631', 'FDA634'],
'FDA633': ['FDA631', 'FDA634', 'FDA635'],
'FDA634': ['FDA632', 'FDA633', 'FDA636'],
'FDA635': ['FDA633', 'FDA636', 'FDA637'],
'FDA636': ['FDA634', 'FDA635', 'FDA638'],
'FDA637': ['FDA635', 'FDA638', 'FDA639'],
'FDA638': ['FDA636', 'FDA637', 'FDA640'],
'FDA639': ['FDA637', 'FDA640', 'FDA641'],
'FDA640': ['FDA638', 'FDA639', 'FDA642'],
'FDA641': ['FDA639', 'FDA642', 'FDA643'],
'FDA642': ['FDA640', 'FDA641', 'FDA644'],
'FDA643': ['FDA641', 'FDA644'],
'FDA644': ['FDA642', 'FDA643'],

// Group 7 - Middle-2 section (corrected)
'FDA715': ['FDA716', 'FDA717'],
'FDA716': ['FDA715', 'FDA718'],
'FDA717': ['FDA715', 'FDA718', 'FDA719'],
'FDA718': ['FDA716', 'FDA717', 'FDA720'],
'FDA719': ['FDA717', 'FDA720', 'FDA721'],
'FDA720': ['FDA718', 'FDA719', 'FDA722'],
'FDA721': ['FDA719', 'FDA722', 'FDA723'],
'FDA722': ['FDA720', 'FDA721', 'FDA724'],
'FDA723': ['FDA721', 'FDA724'],
'FDA724': ['FDA722', 'FDA723'], // No connection to lower section (corridor)

// Group 7 - Lower section (FDA725-748, note: FDA749-750 missing)
'FDA725': ['FDA726', 'FDA727'],
'FDA726': ['FDA725', 'FDA728'],
'FDA727': ['FDA725', 'FDA728', 'FDA729'],
'FDA728': ['FDA726', 'FDA727', 'FDA730'],
'FDA729': ['FDA727', 'FDA730', 'FDA731'],
'FDA730': ['FDA728', 'FDA729', 'FDA732'],
'FDA731': ['FDA729', 'FDA732', 'FDA733'],
'FDA732': ['FDA730', 'FDA731', 'FDA734'],
'FDA733': ['FDA731', 'FDA734', 'FDA735'],
'FDA734': ['FDA732', 'FDA733', 'FDA736'],
'FDA735': ['FDA733', 'FDA736', 'FDA737'],
'FDA736': ['FDA734', 'FDA735', 'FDA738'],
'FDA737': ['FDA735', 'FDA738', 'FDA739'],
'FDA738': ['FDA736', 'FDA737', 'FDA740'],
'FDA739': ['FDA737', 'FDA740', 'FDA741'],
'FDA740': ['FDA738', 'FDA739', 'FDA742'],
'FDA741': ['FDA739', 'FDA742', 'FDA743'],
'FDA742': ['FDA740', 'FDA741', 'FDA744'],
'FDA743': ['FDA741', 'FDA744', 'FDA745'],
'FDA744': ['FDA742', 'FDA743', 'FDA746'],
'FDA745': ['FDA743', 'FDA746', 'FDA747'],
'FDA746': ['FDA744', 'FDA745', 'FDA748'],
'FDA747': ['FDA745', 'FDA748'],
'FDA748': ['FDA746', 'FDA747'],

// Group 8 - All sections (single column, vertical only)
'FDA801': ['FDA802'],
'FDA802': ['FDA801'], // No connection to middle-1 (gap)

'FDA803': ['FDA804'],
'FDA804': ['FDA803', 'FDA805'],
'FDA805': ['FDA804', 'FDA806'],
'FDA806': ['FDA805', 'FDA807'],
'FDA807': ['FDA806'], // No connection to middle-2 (gap)

'FDA808': ['FDA809'],
'FDA809': ['FDA808', 'FDA810'],
'FDA810': ['FDA809', 'FDA811'],
'FDA811': ['FDA810', 'FDA812'],
'FDA812': ['FDA811'], // No connection to lower (corridor)

'FDA813': ['FDA814'],
'FDA814': ['FDA813', 'FDA815'],
'FDA815': ['FDA814', 'FDA816'],
'FDA816': ['FDA815', 'FDA817'],
'FDA817': ['FDA816', 'FDA818'],
'FDA818': ['FDA817', 'FDA819'],
'FDA819': ['FDA818', 'FDA820'],
'FDA820': ['FDA819'],

// Group 9 - Upper section (FDA901-904)
'FDA901': ['FDA902', 'FDA903'],
'FDA902': ['FDA901', 'FDA904'],
'FDA903': ['FDA901', 'FDA904'],
'FDA904': ['FDA902', 'FDA903'], // No connection to middle-1 (gap)

// Group 9 - Middle-1 section (FDA905-914)
'FDA905': ['FDA906', 'FDA907'],
'FDA906': ['FDA905', 'FDA908'],
'FDA907': ['FDA905', 'FDA908', 'FDA909'],
'FDA908': ['FDA906', 'FDA907', 'FDA910'],
'FDA909': ['FDA907', 'FDA910', 'FDA911'],
'FDA910': ['FDA908', 'FDA909', 'FDA912'],
'FDA911': ['FDA909', 'FDA912', 'FDA913'],
'FDA912': ['FDA910', 'FDA911', 'FDA914'],
'FDA913': ['FDA911', 'FDA914'],
'FDA914': ['FDA912', 'FDA913'], // No connection to middle-2 (gap)

// Group 9 - Middle-2 section (FDA915-924)
'FDA915': ['FDA916', 'FDA917'],
'FDA916': ['FDA915', 'FDA918'],
'FDA917': ['FDA915', 'FDA918', 'FDA919'],
'FDA918': ['FDA916', 'FDA917', 'FDA920'],
'FDA919': ['FDA917', 'FDA920', 'FDA921'],
'FDA920': ['FDA918', 'FDA919', 'FDA922'],
'FDA921': ['FDA919', 'FDA922', 'FDA923'],
'FDA922': ['FDA920', 'FDA921', 'FDA924'],
'FDA923': ['FDA921', 'FDA924'],
'FDA924': ['FDA922', 'FDA923'], // No connection to lower (corridor)

// Group 9 - Lower section (FDA925-932, note: FDA933-942 missing from data)
'FDA925': ['FDA926', 'FDA927'],
'FDA926': ['FDA925', 'FDA928'],
'FDA927': ['FDA925', 'FDA928', 'FDA929'],
'FDA928': ['FDA926', 'FDA927', 'FDA930'],
'FDA929': ['FDA927', 'FDA930', 'FDA931'],
'FDA930': ['FDA928', 'FDA929', 'FDA932'],
'FDA931': ['FDA929', 'FDA932'],
'FDA932': ['FDA930', 'FDA931'],

// Group 10 - Middle-2 section (FDA1015-1024)
'FDA1015': ['FDA1016', 'FDA1017'],
'FDA1016': ['FDA1015', 'FDA1018'],
'FDA1017': ['FDA1015', 'FDA1018', 'FDA1019'],
'FDA1018': ['FDA1016', 'FDA1017', 'FDA1020'],
'FDA1019': ['FDA1017', 'FDA1020', 'FDA1021'],
'FDA1020': ['FDA1018', 'FDA1019', 'FDA1022'],
'FDA1021': ['FDA1019', 'FDA1022', 'FDA1023'],
'FDA1022': ['FDA1020', 'FDA1021', 'FDA1024'],
'FDA1023': ['FDA1021', 'FDA1024'],
'FDA1024': ['FDA1022', 'FDA1023'],
    },
    
    columnRestrictions: {
      // Group 1
      'col-1': { allowedSubColumns: ['col-1', 'col-2'], maxContinuousSelection: 8 },
      'col-2': { allowedSubColumns: ['col-1', 'col-2'], maxContinuousSelection: 8 },
      
      // Group 2
      'col-4': { allowedSubColumns: ['col-4', 'col-5'], maxContinuousSelection: 8 },
      'col-5': { allowedSubColumns: ['col-4', 'col-5'], maxContinuousSelection: 8 },
      
      // Group 3
      'col-7': { allowedSubColumns: ['col-7', 'col-8'], maxContinuousSelection: 8 },
      'col-8': { allowedSubColumns: ['col-7', 'col-8'], maxContinuousSelection: 8 },
      
      // Group 4
      'col-10-upper': { allowedSubColumns: ['col-10', 'col-11'], maxContinuousSelection: 8 },
      'col-11-upper': { allowedSubColumns: ['col-10', 'col-11'], maxContinuousSelection: 8 },
      'col-11-lower': { isolatedColumn: false, maxContinuousSelection: 12 },
      
      // Group 5
      'col-13-upper': { allowedSubColumns: ['col-13', 'col-14'], maxContinuousSelection: 18 },
      'col-14-upper': { allowedSubColumns: ['col-13', 'col-14'], maxContinuousSelection: 18 },
      'col-13-middle': { allowedSubColumns: ['col-13', 'col-14'], maxContinuousSelection: 8 },
      'col-14-middle': { allowedSubColumns: ['col-13', 'col-14'], maxContinuousSelection: 8 },
      'col-13-lower': { allowedSubColumns: ['col-13', 'col-14'], maxContinuousSelection: 18 },
      'col-14-lower': { allowedSubColumns: ['col-13', 'col-14'], maxContinuousSelection: 18 },
      
      // Group 6
'col-16-upper': { allowedSubColumns: ['col-16', 'col-17'], maxContinuousSelection: 12 },
'col-17-upper': { allowedSubColumns: ['col-16', 'col-17'], maxContinuousSelection: 12 },
'col-16-middle': { allowedSubColumns: ['col-16', 'col-17'], maxContinuousSelection: 8 },
'col-17-middle': { allowedSubColumns: ['col-16', 'col-17'], maxContinuousSelection: 8 },
'col-16-lower': { allowedSubColumns: ['col-16', 'col-17'], maxContinuousSelection: 24 },
'col-17-lower': { allowedSubColumns: ['col-16', 'col-17'], maxContinuousSelection: 24 },

// Group 7
'col-21-upper': { allowedSubColumns: ['col-21', 'col-22'], maxContinuousSelection: 4 },
'col-22-upper': { allowedSubColumns: ['col-21', 'col-22'], maxContinuousSelection: 4 },
'col-21-middle1': { allowedSubColumns: ['col-21', 'col-22'], maxContinuousSelection: 10 },
'col-22-middle1': { allowedSubColumns: ['col-21', 'col-22'], maxContinuousSelection: 10 },
'col-21-middle2': { allowedSubColumns: ['col-21', 'col-22'], maxContinuousSelection: 10 },
'col-22-middle2': { allowedSubColumns: ['col-21', 'col-22'], maxContinuousSelection: 10 },
'col-21-lower': { allowedSubColumns: ['col-21', 'col-22'], maxContinuousSelection: 24 },
'col-22-lower': { allowedSubColumns: ['col-21', 'col-22'], maxContinuousSelection: 24 },

// Group 8 (single column)
'col-24-upper': { maxContinuousSelection: 2 },
'col-24-middle1': { maxContinuousSelection: 5 },
'col-24-middle2': { maxContinuousSelection: 5 },
'col-24-lower': { maxContinuousSelection: 8 },

// Group 9
'col-26-upper': { allowedSubColumns: ['col-26', 'col-27'], maxContinuousSelection: 4 },
'col-27-upper': { allowedSubColumns: ['col-26', 'col-27'], maxContinuousSelection: 4 },
'col-26-middle1': { allowedSubColumns: ['col-26', 'col-27'], maxContinuousSelection: 10 },
'col-27-middle1': { allowedSubColumns: ['col-26', 'col-27'], maxContinuousSelection: 10 },
'col-26-middle2': { allowedSubColumns: ['col-26', 'col-27'], maxContinuousSelection: 10 },
'col-27-middle2': { allowedSubColumns: ['col-26', 'col-27'], maxContinuousSelection: 10 },
'col-26-lower': { allowedSubColumns: ['col-26', 'col-27'], maxContinuousSelection: 16 },
'col-27-lower': { allowedSubColumns: ['col-26', 'col-27'], maxContinuousSelection: 16 },

// Group 10
'col-29-upper': { allowedSubColumns: ['col-29', 'col-30'], maxContinuousSelection: 4 },
'col-30-upper': { allowedSubColumns: ['col-29', 'col-30'], maxContinuousSelection: 4 },
'col-29-middle1': { allowedSubColumns: ['col-29', 'col-30'], maxContinuousSelection: 10 },
'col-30-middle1': { allowedSubColumns: ['col-29', 'col-30'], maxContinuousSelection: 10 },
'col-29-middle2': { allowedSubColumns: ['col-29', 'col-30'], maxContinuousSelection: 10 },
'col-30-middle2': { allowedSubColumns: ['col-29', 'col-30'], maxContinuousSelection: 10 },
'col-29-lower': { allowedSubColumns: ['col-29', 'col-30'], maxContinuousSelection: 16 },
'col-30-lower': { allowedSubColumns: ['col-29', 'col-30'], maxContinuousSelection: 16 },
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
    totalBooths: 286,
    boothTypes: [
      {
        type: '9m²',
        count: 286,
        boothIds: [
          // List all 286 booth IDs
          'FDA101', 'FDA102', 'FDA103', 'FDA104', 'FDA105', 'FDA106', 'FDA107', 'FDA108',
          'FDA210', 'FDA211', 'FDA212', 'FDA213', 'FDA214', 'FDA215', 'FDA216', 'FDA217',
          'FDA319', 'FDA320', 'FDA321', 'FDA322', 'FDA323', 'FDA324', 'FDA325', 'FDA326',
          'FDA419', 'FDA420', 'FDA421', 'FDA422', 'FDA423', 'FDA424', 'FDA425', 'FDA426',
          'FDA427', 'FDA428', 'FDA429', 'FDA430', 'FDA431', 'FDA432', 'FDA433', 'FDA434',
          'FDA435', 'FDA436', 'FDA437', 'FDA438',
          // Continue for all booths...
        ],
        description: 'Standard 9m² outdoor sector booths'
      }
    ],
    lastUpdated: new Date().toISOString(),
    version: '1.0.0',
    validatedBy: 'System',
    notes: [
      'FDA sector is the largest with 286 booths',
      'Features two partial horizontal corridors at rows 10 and 15-16',
      'Mix of single and double column layouts',
      'Complex three-section structure in groups 5-10',
      'Group 4 transitions from double to single column',
      'Group 7 has 50 booths (largest single group)',
      'Empty grid spaces in columns 1-2, 18-20 at various rows',
      'Thin vertical passage between groups 7 and 8',
      'Sequential booking allowed within sections but not across corridors'
    ]
  }
};
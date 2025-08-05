// components/BoothsData/layouts/cgaSectorConfig.ts

import { LayoutConfig } from '../types/layout.types';

export const cgaSectorConfig: LayoutConfig = {
  layoutId: 'cga-sector',
  layoutName: 'Corporate Organizations & Government Agencies',
  locationType: 'outdoor',
  
  columns: [
    // Upper section - CGA101-CGA128
    {
      columnId: 'cga-main-upper',
      columnType: 'single',
      boothRange: Array.from({length: 28}, (_, i) => `CGA${101 + i}`),
      numberingOrder: 'ascending',
      isolatedFromOthers: false,
      sectionId: 'cga-upper'
    },
    // Lower section - CGA129-CGA156
    {
      columnId: 'cga-main-lower',
      columnType: 'single',
      boothRange: Array.from({length: 28}, (_, i) => `CGA${129 + i}`),
      numberingOrder: 'ascending',
      isolatedFromOthers: false,
      sectionId: 'cga-lower'
    }
  ],
  
 passages: [
  {
    passageId: 'cga-horizontal',
    type: 'corridor', // Keep as corridor
    separates: ['cga-upper', 'cga-lower'],
    blocksSequential: true,
    coordinates: [[0, 2800], [400, 2800]],
    description: 'Horizontal passage between upper and lower sections',
    isVisible: true // Keep as true
  }
],
  specialBooths: [],
  
  sequentialRules: {
    allowedConnections: {
      // Generate connections for upper section
      ...Array.from({length: 28}, (_, i) => {
        const boothId = `CGA${101 + i}`;
        const connections = [];
        if (i > 0) connections.push(`CGA${100 + i}`);
        if (i < 27) connections.push(`CGA${102 + i}`);
        return { [boothId]: connections };
      }).reduce((acc, cur) => ({...acc, ...cur}), {}),
      
      // Generate connections for lower section
      ...Array.from({length: 28}, (_, i) => {
        const boothId = `CGA${129 + i}`;
        const connections = [];
        if (i > 0) connections.push(`CGA${128 + i}`);
        if (i < 27) connections.push(`CGA${130 + i}`);
        return { [boothId]: connections };
      }).reduce((acc, cur) => ({...acc, ...cur}), {})
    },
    
    columnRestrictions: {
      'cga-main-upper': { maxContinuousSelection: 28 },
      'cga-main-lower': { maxContinuousSelection: 28 }
    },
    
    globalRules: {
      preventCrossPassageBooking: true,
      allowRowWiseBooking: false,
      allowColumnWiseBooking: true,
      allowMixedBooking: false,
      enforceStrictAdjacency: true
    }
  },
  
  metadata: {
    totalBooths: 56,
    boothTypes: [
      {
        type: '9m² (Standard)',
        count: 56,
        boothIds: Array.from({length: 56}, (_, i) => i < 28 ? `CGA${101 + i}` : `CGA${129 + i - 28}`),
        description: 'Standard 9m² outdoor booths for corporate and government organizations'
      }
    ],
    lastUpdated: new Date().toISOString(),
    version: '1.0.0',
    validatedBy: 'System',
    notes: [
      'CGA sector has 56 booths in a single column that visually spans two columns',
      'Upper section: CGA101-CGA128 (28 booths)',
      'Lower section: CGA129-CGA156 (28 booths)',
      'Horizontal passage separates upper and lower sections',
      'Each booth spans 2 grid columns for wider appearance'
    ]
  }
};
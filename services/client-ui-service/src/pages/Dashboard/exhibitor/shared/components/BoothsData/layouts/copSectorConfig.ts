// components/BoothsData/layouts/copSectorConfig.ts

import { LayoutConfig } from '../types/layout.types';

export const copSectorConfig: LayoutConfig = {
  layoutId: 'cop-sector',
  layoutName: 'Commercial Premium Sector',
  locationType: 'outdoor',
  
  columns: [
    {
      columnId: 'cop-main',
      columnType: 'single',
      boothRange: Array.from({length: 60}, (_, i) => `COP${101 + i}`),
      numberingOrder: 'ascending',
      isolatedFromOthers: false,
      sectionId: 'cop-main'
    }
  ],
  
  passages: [],
  specialBooths: [],
  
  sequentialRules: {
    allowedConnections: {
      // Generate connections for all booths
      ...Array.from({length: 60}, (_, i) => {
        const boothId = `COP${101 + i}`;
        const connections = [];
        if (i > 0) connections.push(`COP${100 + i}`);
        if (i < 59) connections.push(`COP${102 + i}`);
        return { [boothId]: connections };
      }).reduce((acc, cur) => ({...acc, ...cur}), {})
    },
    
    columnRestrictions: {
      'cop-main': { maxContinuousSelection: 60 }
    },
    
    globalRules: {
      preventCrossPassageBooking: false,
      allowRowWiseBooking: false,
      allowColumnWiseBooking: true,
      allowMixedBooking: false,
      enforceStrictAdjacency: true
    }
  },
  
  metadata: {
    totalBooths: 60,
    boothTypes: [
      {
        type: '9m² (Standard)',
        count: 60,
        boothIds: Array.from({length: 60}, (_, i) => `COP${101 + i}`),
        description: 'Standard 9m² outdoor booths for conglomerate companies'
      }
    ],
    lastUpdated: new Date().toISOString(),
    version: '1.0.0',
    validatedBy: 'System',
    notes: [
      'COP sector has 60 booths in a single continuous column',
      'No passage separation - all booths can be selected sequentially',
      'Each booth spans 2 grid columns for wider appearance',
      'Booth IDs: COP101-COP160'
    ]
  }
};
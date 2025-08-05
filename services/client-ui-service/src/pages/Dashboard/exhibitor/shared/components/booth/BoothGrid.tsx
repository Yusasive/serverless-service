import React from 'react';
import Booth from './Booth';

interface BoothData {
  coords?: number[][];
  status: 'available' | 'selected' | 'booked-by-you' | 'booked-by-others';
  size: string;
  category: 'Standard' | 'Premium';
  price: number;
  sqm: number;
  boothId?: string;
  is_indoor?: boolean;
  gridPosition?: {
    row: number;
    col: number;
    rowSpan?: number;
    colSpan?: number;
  };
}

interface BoothGridProps {
  booths: { [key: string]: BoothData };
  gridConfig: {
    rows: number;
    columns: number;
    passages?: Array<{
      type: 'horizontal' | 'vertical' | 'invisible-boundary';
      position: number;
      label?: string;
      startColumn?: number;
      endColumn?: number;
    }>;
    doors?: Array<{
      type: 'top' | 'bottom' | 'left' | 'right';
      position: { row: number; column: number };
      label?: string;
    }>;
  };
  onBoothClick: (boothId: string) => void;
  validNextBooths?: Set<string>;
  suggestedBooths?: Set<string>;
  blockedBooths?: Set<string>;
  showPassageLabels?: boolean;
  layoutName: string;
  validationMessages?: { [boothId: string]: string };
  currentSelections?: string[]; // Add this line
  portalContainer?: HTMLElement | null;
  isFullscreen?: boolean;
  is_indoor?: boolean;
}

const BoothGrid: React.FC<BoothGridProps> = ({
  booths,
  gridConfig,
  onBoothClick,
  validNextBooths = new Set(),
  suggestedBooths = new Set(),
  blockedBooths = new Set(),
  showPassageLabels = true,
  layoutName,
  validationMessages = {},
  currentSelections = [], // Add default value
  portalContainer,
  isFullscreen = false,
  is_indoor = false,
}) => {
  // Generate grid template with passages
const generateGridTemplate = () => {
  const { rows, columns, passages = [] } = gridConfig;
   console.log('🔍 DEBUG - Grid Config for', layoutName, {
    rows,
    columns,
    passages
  });

  // In BoothGrid.tsx, inside generateGridTemplate function:
// if (layoutName === 'Real Estate, Building Furniture & Fittings' || layoutName.includes('RBF')) {
//   console.log('🔍 DEBUG - Generating RBF Sector specific grid template');
  
//   // RBF has 9 rows with corridor at rows 3-5
//   const rowTemplate = [
//     'minmax(60px, 80px)', // Row 1
//     'minmax(60px, 80px)', // Row 2
//     '30px',               // Row 3 - Corridor
//     '30px',               // Row 4 - Corridor  
//     '30px',               // Row 5 - Corridor
//     'minmax(60px, 80px)', // Row 6
//     'minmax(60px, 80px)', // Row 7
//     'minmax(60px, 80px)', // Row 8
//     'minmax(60px, 80px)'  // Row 9
//   ];
  
//   // RBF has 5 columns with specific gap pattern
//   const colTemplate = [
//     'minmax(80px, 1fr)', // Column 1 - Group 1 left
//     'minmax(80px, 1fr)', // Column 2 - Group 1 right (NO GAP from col 1)
//     '40px',              // Column 3 - Vertical passage
//     'minmax(80px, 1fr)', // Column 4 - Group 2 left  
//     'minmax(80px, 1fr)'  // Column 5 - Group 2 right (NO GAP from col 4)
//   ];
  
//   return {
//     gridTemplateRows: rowTemplate.join(' '),
//     gridTemplateColumns: colTemplate.join(' '),
//     columnGap: '0px',  // NO gap between any columns
//     rowGap: '2px'      // Small gap between rows for visual clarity
//   };
// }
// In generateGridTemplate() function, add this case:

// In generateGridTemplate function, add:
if (layoutName === 'Commercial premium' || layoutName.includes('COP')) {
  console.log('🔍 DEBUG - Generating COP Sector specific grid template');
  
  // COP has 60 rows, no passages
  const rowTemplate = Array(60).fill('minmax(60px, 80px)');
  
  // COP uses 2 columns for visual spanning (similar to CGA)
  const colTemplate = [
    'minmax(120px, 1fr)', // Column 1
    'minmax(120px, 1fr)'  // Column 2
  ];
  
  return {
    gridTemplateRows: rowTemplate.join(' '),
    gridTemplateColumns: colTemplate.join(' '),
    gap: '0px'
  };
}
if (layoutName === 'Corporate Organizations & Government Agencies' || layoutName.includes('CGA')) {
  console.log('🔍 DEBUG - Generating CGA Sector specific grid template');
  
  // CGA has 57 rows total: 28 upper + 1 passage + 28 lower
  const rowTemplate = [];
  
  // Upper section rows 1-28
  for (let i = 1; i <= 28; i++) {
    rowTemplate.push('minmax(60px, 80px)');
  }
  
  // Passage row 29
  rowTemplate.push('40px');
  
  // Lower section rows 30-57
  for (let i = 30; i <= 57; i++) {
    rowTemplate.push('minmax(80px, 100px)');
  }
  
  // CGA uses 2 columns for visual spanning
  const colTemplate = [
    'minmax(120px, 1fr)', // Column 1
    'minmax(120px, 1fr)'  // Column 2
  ];
  
  return {
    gridTemplateRows: rowTemplate.join(' '),
    gridTemplateColumns: colTemplate.join(' '),
    gap: '0px'
  };
}
if (layoutName === 'Conglomerate' || layoutName.includes('COG')) {
  console.log('🔍 DEBUG - Generating COG Sector specific grid template');
  
  // COG has 5 rows with horizontal passage at row 3
  const rowTemplate = [
    'minmax(80px, 100px)', // Row 1
    'minmax(80px, 100px)', // Row 2
    '40px',                // Row 3 - Horizontal passage
    'minmax(80px, 100px)', // Row 4
    'minmax(80px, 100px)'  // Row 5
  ];
  
  // COG has 19 columns with vertical passages
  const colTemplate = [
    // Group 1 (single column)
    'max-content', // Column 1
    '30px',                // Column 2 - Vertical passage
    
    // Group 2 (double column)
    'max-content',  // Column 3
    'max-content',  // Column 4
    '30px',                // Column 5 - Vertical passage
    
    // Group 3 (double column)
    'max-content',  // Column 6
    'max-content',  // Column 7
    '30px',                // Column 8 - Vertical passage
    
    // Group 4 (double column)
    'max-content',  // Column 9
    'max-content',  // Column 10
    '30px',                // Column 11 - Vertical passage
    
    // Group 5 (double column)
    'max-content',  // Column 12
    'max-content',  // Column 13
    '30px',                // Column 14 - Vertical passage
    
    // Group 6 (double column)
    'max-content',  // Column 15
    'max-content',  // Column 16
    '30px',                // Column 17 - Vertical passage
    
    // Group 7 (special - 2 columns)
    'max-content',  // Column 18
    'max-content'   // Column 19
  ];
  
  return {
    gridTemplateRows: rowTemplate.join(' '),
    gridTemplateColumns: colTemplate.join(' '),
    gap: '0px'
  };
}

if (layoutName === 'Transport and Allied/Power Products' || layoutName.includes('TA')) {
  console.log('🔍 DEBUG - Generating TA Sector specific grid template');
  
  // TA has 12 rows with horizontal passage at row 6
  const rowTemplate = [
    'minmax(60px, 80px)', // Row 1
    'minmax(60px, 80px)', // Row 2
    'minmax(60px, 80px)', // Row 3
    'minmax(60px, 80px)', // Row 4
    'minmax(60px, 80px)', // Row 5
    '40px',               // Row 6 - Horizontal passage
    'minmax(60px, 80px)', // Row 7
    'minmax(60px, 80px)', // Row 8
    'minmax(60px, 80px)', // Row 9
    'minmax(60px, 80px)', // Row 10
    'minmax(60px, 80px)', // Row 11
    'minmax(60px, 80px)'  // Row 12
  ];
  
  // TA has 17 columns: 12 booth columns + 5 vertical passages
  const colTemplate = [
    // Group 1
    'minmax(80px, 1fr)', // Column 1
    'minmax(80px, 1fr)', // Column 2
    '30px',              // Column 3 - Vertical passage
    
    // Group 2
    'minmax(80px, 1fr)', // Column 4
    'minmax(80px, 1fr)', // Column 5
    '30px',              // Column 6 - Vertical passage
    
    // Group 3
    'minmax(80px, 1fr)', // Column 7
    'minmax(80px, 1fr)', // Column 8
    '30px',              // Column 9 - Vertical passage
    
    // Group 4
    'minmax(80px, 1fr)', // Column 10
    'minmax(80px, 1fr)', // Column 11
    '30px',              // Column 12 - Vertical passage
    
    // Group 5
    'minmax(80px, 1fr)', // Column 13
    'minmax(80px, 1fr)', // Column 14
    '30px',              // Column 15 - Vertical passage
    
    // Group 6
    'minmax(80px, 1fr)', // Column 16
    'minmax(80px, 1fr)'  // Column 17
  ];
  
  return {
    gridTemplateRows: rowTemplate.join(' '),
    gridTemplateColumns: colTemplate.join(' '),
    gap: '0px' // Small gap for visual clarity
  };
}
if (layoutName === 'Publication, Healthcare & Sport Products' || layoutName.includes('OTH') || layoutName.includes('PHS')) {
  console.log('🔍 DEBUG - Generating OTH Sector specific grid template');
  
  // Build row template
  const rowTemplate = [
    'minmax(90px, 100px)', // Row 1
    'minmax(90px, 100px)', // Row 2
    'minmax(90px, 100px)', // Row 3
    'minmax(90px, 100px)', // Row 4
    '40px',               // Row 5 - Passage
    'minmax(90px, 100px)', // Row 6
    'minmax(90px, 100px)', // Row 7
    'minmax(90px, 100px)', // Row 8
    'minmax(90px, 100px)', // Row 9
    'minmax(90px, 100px)', // Row 10
    'minmax(90px, 100px)', // Row 11
    '40px',               // Row 12 - Passage
    'minmax(90px, 100px)', // Row 13
    'minmax(90px, 100px)', // Row 14
  ];
  
  // Build column template
  const colTemplate = [
    'max-content',  // Column 1 - Changed to max-content
    'max-content',  // Column 2 - Changed to max-content
    '30px',         // Column 3 - Passage
    'max-content',  // Column 4 - Changed to max-content
    '60px',         // Column 5 - Passage
    'max-content',  // Column 6 - Changed to max-content
    'max-content'   // Column 7 - Changed to max-content
  ];
  
  return {
    gridTemplateRows: rowTemplate.join(' '),
    gridTemplateColumns: colTemplate.join(' '),
    gap: '0px' // This ensures no gaps between ANY cells
  };
}

if (layoutName === 'Food, Drinks, Agriculture & Allied Products' || layoutName.includes('FDA')) {
  console.log('🔍 DEBUG - Generating FDA Sector specific grid template');
  
  // FDA has 28 rows with some rows being passages
  const rowTemplate = [];
  for (let i = 1; i <= 28; i++) {
    if (i === 10) {
      rowTemplate.push('40px'); // Horizontal corridor 1
    } else if (i === 15 || i === 16) {
      rowTemplate.push('30px'); // Horizontal corridor 2 (double height)
    } else {
      rowTemplate.push('minmax(50px, 70px)');
    }
  }
  
  // FDA has 30 columns with passages
  const colTemplate = [];
  for (let i = 1; i <= 30; i++) {
    if ([3, 6, 9, 12, 15, 18, 20, 23, 25, 28].includes(i)) {
      colTemplate.push(i === 23 ? '20px' : '30px'); // Thin passage at 23
    } else {
      colTemplate.push('minmax(60px, 80px)');
    }
  }
  
  return {
    gridTemplateRows: rowTemplate.join(' '),
    gridTemplateColumns: colTemplate.join(' '),
    gap: '0px'
  };
}
if (layoutName === 'Household Cosmetics & Textile Products' || layoutName.includes('HCT')) {
  console.log('🔍 DEBUG - Generating HOUSEHOLD Sector specific grid template');
  
  // FDA has 24 rows (not including corridors)
  const rowTemplate = [];
  for (let i = 1; i <= 24; i++) {
    if(i === 12) {
      rowTemplate.push('minmax(120px, 80px)');
    }
    rowTemplate.push('minmax(60px, 80px)');
  }
  
  // FDA has 30 columns with passages
  const colTemplate = [];
  for (let i = 1; i <= 30; i++) {
    // Passages at columns 3, 6, 9, 12, 15, 18, 21, 23, 25, 28
    if ([3, 6, 9, 12, 15, 18, 21, 23, 25, 28].includes(i)) {
      colTemplate.push('30px'); // Passage column
    } else {
      colTemplate.push('minmax(60px, 80px)'); // Booth column
    }
  }
  
  console.log('FDA Grid - Rows:', rowTemplate.length, 'Cols:', colTemplate.length);
  
  return {
    gridTemplateRows: rowTemplate.join(' '),
    gridTemplateColumns: colTemplate.join(' ')
  };
}
if (layoutName === 'ICT & Electronics Products' || layoutName.includes('EEI')) {
  console.log('🔍 DEBUG - Generating EEI Sector specific grid template');
  
  // 4 rows, all same height
  const rowTemplate = Array(4).fill('minmax(80px, 100px)');
  
  // 25 columns with passages
  const colTemplate = [
    'minmax(100px, 1fr)', // C1
    '30px',               // P1
    'minmax(100px, 1fr)', // C3
    'minmax(100px, 1fr)', // C4
    '30px',               // P2
    'minmax(100px, 1fr)', // C6
    'minmax(100px, 1fr)', // C7
    '30px',               // P3
    'minmax(100px, 1fr)', // C9
    'minmax(100px, 1fr)', // C10
    '30px',               // P4
    'minmax(100px, 1fr)', // C12
    'minmax(100px, 1fr)', // C13
    '30px',               // P5
    'minmax(100px, 1fr)', // C15
    'minmax(100px, 1fr)', // C16
    '30px',               // P6
    'minmax(100px, 1fr)', // C18
    'minmax(100px, 1fr)', // C19
    '30px',               // P7
    'minmax(100px, 1fr)', // C21
    'minmax(100px, 1fr)', // C22
    '30px',               // P8
    'minmax(100px, 1fr)', // C24
    'minmax(100px, 1fr)', // C25
    '30px',               // P9
    'minmax(100px, 1fr)', // C27
    'minmax(100px, 1fr)', // C28
  ];
  
  return {
    gridTemplateRows: rowTemplate.join(' '),
    gridTemplateColumns: colTemplate.join(' ')
  };
}
  if (layoutName === 'Hall B') {
  console.log('🔍 DEBUG - Generating Hall B specific grid template');
  
  // Hall B has 18 rows with special handling for row 8
  const rowTemplate = [
    'minmax(60px, 80px)', // Row 1
    'minmax(60px, 80px)', // Row 2
    'minmax(60px, 80px)', // Row 3
    'minmax(60px, 80px)', // Row 4
    'minmax(60px, 80px)', // Row 5
    'minmax(60px, 80px)', // Row 6
    'minmax(60px, 80px)', // Row 7
    'minmax(60px, 80px)', // Row 8 - CORRIDOR ROW but with booth height for N088
    'minmax(60px, 80px)', // Row 9
    'minmax(60px, 80px)', // Row 10
    'minmax(60px, 80px)', // Row 11
    'minmax(60px, 80px)', // Row 12
    'minmax(60px, 80px)', // Row 13
    'minmax(60px, 80px)', // Row 14
    'minmax(60px, 80px)', // Row 15
    'minmax(60px, 80px)', // Row 16
    'minmax(60px, 80px)', // Row 17
    'minmax(60px, 80px)',  // Row 18
    'minmax(60px, 80px)'  // Row 19
  ];
  
  // Hall B columns: booth, passage, booth, booth, passage, booth, booth, passage, booth
  const colTemplate = [
    'minmax(80px, 1fr)', // Column 1 - Booths (N001-N017)
    '40px',              // Column 2 - Vertical passage
    'max-content', // Column 3 - Booths (N018-N032)
    'max-content', // Column 4 - Booths (N033-N047)
    '40px',              // Column 5 - Vertical passage
    'max-content', // Column 6 - Booths (N048-N062)
    'max-content', // Column 7 - Booths (N063-N077)
    '40px',              // Column 8 - Vertical passage
    'minmax(80px, 1fr)'  // Column 9 - Booths (N078-N095)
  ];
  
  return {
       gridTemplateRows: rowTemplate.join(' '),
    gridTemplateColumns: colTemplate.join(' '),
  gap: '0px'  // Ensure zero gap
  };
}
  // For Hall A, we need a special approach
// In generateGridTemplate(), update the Hall A section:

if (layoutName === 'Hall A') {
  const rowTemplate = [
    'minmax(60px, 80px)', // Row 1
    'minmax(60px, 80px)', // Row 2
    'minmax(60px, 80px)', // Row 3
    'minmax(60px, 80px)', // Row 4
    '60px',               // Row 5 - Horizontal passage
    'minmax(60px, 80px)', // Row 6
    'minmax(60px, 80px)', // Row 7
    'minmax(60px, 80px)', // Row 8
    'minmax(60px, 80px)', // Row 9
    'minmax(60px, 80px)'  // Row 10
  ];
  
  // Use auto-sizing for booth columns to remove gaps
  const colTemplate = [
    'minmax(80px, 1fr)',  // Column 1 - Single booth
    '40px',               // Column 2 - Vertical passage
    'max-content',        // Column 3 - Booth (auto-size)
    'max-content',        // Column 4 - Booth (auto-size)
    '80px',               // Column 5 - Vertical passage
    'max-content',        // Column 6 - Booth (auto-size)
    'max-content',        // Column 7 - Booth (auto-size)
    '40px',               // Column 8 - Vertical passage
    'minmax(80px, 1fr)'   // Column 9 - Single booth
  ];
  
  return {
    gridTemplateRows: rowTemplate.join(' '),
    gridTemplateColumns: colTemplate.join(' '),
    gap: '0px'  // Ensure zero gap
  };
}
   // For Africa Hall with partial corridor, we need a special approach
  if (layoutName === 'Africa Hall') {
    // Create row template with corridor
    const rowTemplate = [];
    for (let i = 1; i <= 16; i++) {
      rowTemplate.push('minmax(60px, 80px)');
      if (i === 8) {
        // Add corridor row after row 8
        rowTemplate.push('60px');
      }
    }
      const colTemplate = [
'minmax(80px, 1fr)', '40px', 'max-content',  'max-content',  '120px' ,'minmax(80px, 1fr)'
  ];
    //
    return {
      gridTemplateRows: rowTemplate.join(' '),
      gridTemplateColumns: colTemplate.join(' '),

       gap: '0px'  // Ensure zero gap
   
    };
  }
  
  // Start with arrays of row and column sizes
  const rowsArray = new Array(rows).fill('minmax(60px, 80px)');
  const colsArray = new Array(columns).fill('minmax(80px, 1fr)');
  
  // Sort passages by position (descending) to avoid index shifting issues
  const horizontalPassages = passages
    .filter(p => p.type === 'horizontal')
    .sort((a, b) => b.position - a.position);
    
  const verticalPassages = passages
    .filter(p => p.type === 'vertical')
    .sort((a, b) => b.position - a.position);
  
  // Insert horizontal passages
  horizontalPassages.forEach(passage => {
    // Insert AFTER the specified position (so position becomes position + 1)
    // For position 8, we insert at index 8 (which puts it after row 8)
    rowsArray.splice(passage.position - 1, 0, '60px');
  });
  
  // Insert vertical passages
  verticalPassages.forEach(passage => {
    // For vertical passages, position is 1-based, so we subtract 1
    colsArray.splice(passage.position - 1, 0, '40px');
  });
  
  const gridTemplateRows = rowsArray.join(' ');
  const gridTemplateColumns = colsArray.join(' ');
  
  
  return {
    gridTemplateRows,
    gridTemplateColumns,
  };
};

// const gridStyles: React.CSSProperties = {
//   display: 'grid',
//   ...generateGridTemplate(),
//   gap: layoutName.includes('EEI') || layoutName.includes('ICT') || layoutName.includes('FDA') ? '4px' : '8px', // Smaller gap for EEI and FDA
//   padding: '20px',
//   backgroundColor: '#f9fafb',
//   borderRadius: '8px',
//   width: '100%',
//   maxWidth: layoutName.includes('EEI') || layoutName.includes('ICT') || layoutName.includes('FDA') ? '100%' : '1200px', // Full width for EEI and FDA
//   margin: '0 auto',
//   aspectRatio: layoutName === 'Africa Hall' ? '2.5 / 1' : 
//                layoutName.includes('Hall B') ? '2.2 / 1' : 
//                layoutName.includes('EEI') || layoutName.includes('ICT') || layoutName.includes('FDA') ? undefined : '3.3 / 1', // No aspect ratio for EEI and FDA
//   overflowX: layoutName.includes('EEI') || layoutName.includes('ICT') || layoutName.includes('FDA') ? 'auto' : undefined, // Horizontal scroll for EEI and FDA
//   minWidth: layoutName.includes('EEI') || layoutName.includes('ICT') ? '1600px' : 
//             layoutName.includes('FDA') ? '2000px' : undefined, // FDA needs more width (30 columns)
//   minHeight: layoutName.includes('FDA') ? '1400px' : undefined, // FDA needs height too (24 rows)
// };
// const gridStyles: React.CSSProperties = {
//   display: 'grid',
//   ...generateGridTemplate(),
//    gap: layoutName.includes('RBF') ? '2px' : // Very small gap for RBF to show booths touching
//        layoutName.includes('EEI') || layoutName.includes('ICT') || layoutName.includes('FDA') ? '4px' : '8px',  padding: '20px',
//   backgroundColor: '#f9fafb',
//   borderRadius: '8px',
//   width: '100%',
//   maxWidth: layoutName.includes('RBF') ? '600px' : // RBF is smaller
//             layoutName.includes('EEI') || layoutName.includes('ICT') || layoutName.includes('FDA') ? '100%' : '1200px',
//   margin: '0 auto',
//   aspectRatio: layoutName.includes('RBF') ? '5 / 9' : // RBF aspect ratio
//                layoutName === 'Africa Hall' ? '2.5 / 1' : 
//                layoutName.includes('Hall B') ? '2.2 / 1' : 
//                layoutName.includes('EEI') || layoutName.includes('ICT') || layoutName.includes('FDA') ? undefined : '3.3 / 1',
//   // RBF doesn't need horizontal scroll
// };
  // In boothDataConverter.ts, update the gridStyles in generateGridTemplate function:

// In boothDataConverter.ts, update the gridStyles in generateGridTemplate function:


  
const gridStyles: React.CSSProperties = {
  display: 'grid',
  ...generateGridTemplate(),
  gap: layoutName.includes('RBF') || 
       layoutName.includes('Hall A') || 
       layoutName.includes('Hall B') || 
       layoutName.includes('OTH') || 
       layoutName.includes('PHS') || 
              layoutName.includes('COP') ||  // Add COP here
       layoutName.includes('CGA') ? '0px' : // Add CGA for consistency
       layoutName.includes('Publication') 
       
       || 
       layoutName.includes('Conglomerate')? '0px' : // NO gap for OTH
              layoutName.includes('TA') || // Add TA here
       layoutName.includes('Transport') || 
       layoutName.includes('Commercial')? '0px' : // Add Transport here
       layoutName.includes('COP')? '0px' : // Add Transport here
       layoutName.includes('EEI') || 
       layoutName.includes('ICT') || 
       layoutName.includes('FDA') ? '4px' : '8px',
  padding: '20px',
  backgroundColor: '#f9fafb',
  borderRadius: '8px',
  width: '100%',
 maxWidth: layoutName.includes('RBF') ? '600px' :
  layoutName.includes('COP') || layoutName.includes('CGA') ? '800px' : // COP and CGA need similar width
            layoutName.includes('TA') || layoutName.includes('Transport') ? '1400px' : // TA needs more width
            layoutName.includes('EEI') || layoutName.includes('ICT') || layoutName.includes('FDA') ? '100%' : '1200px',  margin: '0 auto',
 aspectRatio: layoutName.includes('RBF') ? '5 / 9' :
    //           layoutName.includes('TA') || layoutName.includes('Transport') ? '17 / 12' : // TA aspect ratio
               layoutName === 'Africa Hall' ? '2.5 / 1' : 
               layoutName.includes('Hall B') ? '2.2 / 1' : 
               layoutName.includes('EEI') || layoutName.includes('ICT') || layoutName.includes('FDA') ? undefined : '3.3 / 1',}; 
const renderDoors = () => {
  if (!gridConfig.doors) return null;
  
  return gridConfig.doors.map((door, index) => {
    let gridColumn, gridRow;
    
    // Hall B specific door positioning
    if (layoutName === 'Hall B') {
      switch (door.type) {
        case 'top':
          gridColumn = '5 / 6';  // Center of grid
          gridRow = '1';
          break;
        case 'bottom':
          gridColumn = '5 / 6';  // Center of grid
          gridRow = '18';
          break;
        case 'left':
          gridColumn = '1';
          gridRow = '8';  // At corridor level
          break;
        default:
          gridColumn = `${door.position.column}`;
          gridRow = `${door.position.row}`;
      }
    }
    // Special handling for Hall A doors
    else if (layoutName === 'Hall A') {
      switch (door.type) {
        case 'top':
          gridColumn = '5 / 6';
          gridRow = '1';
          break;
        case 'bottom':
          gridColumn = '5 / 6';
          gridRow = '10';
          break;
        case 'left':
          gridColumn = '1';
          gridRow = '5 / 6';
          break;
        default:
          gridColumn = `${door.position.column} / ${door.position.column + 1}`;
          gridRow = `${door.position.row}`;
      }
    } else {
      // Default handling for other halls (Africa Hall, etc.)
      if (door.position.column === 3.5) {
        gridColumn = '3 / 5';
      } else {
        gridColumn = `${Math.floor(door.position.column)} / ${Math.ceil(door.position.column) + 1}`;
      }
      
      gridRow = door.type === 'top' ? '1' : 
                door.type === 'bottom' ? `${gridConfig.rows}` : 
                `${door.position.row}`;
    }
    
    // Adjust styling based on hall with proper TypeScript types
    const doorStyle: React.CSSProperties = layoutName === 'Hall A' ? {
      gridColumn,
      gridRow,
      backgroundColor: '#3b82f6',
      color: 'white',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '9px',
      fontWeight: 'bold',
      borderRadius: '4px',
      padding: '2px 4px',
      margin: '2px',
      zIndex: 10,
      whiteSpace: 'nowrap',
    } : layoutName === 'Hall B' ? {
      gridColumn,
      gridRow,
      backgroundColor: '#3b82f6',
      color: 'white',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '10px',
      fontWeight: 'bold',
      borderRadius: '4px',
      padding: '4px 8px',
      margin: '2px',
      zIndex: 10,
      whiteSpace: 'nowrap',
      minWidth: door.type === 'left' ? '60px' : '90px',
      height: door.type === 'left' ? '50px' : '30px',
      flexDirection: door.type === 'left' ? 'column' as const : 'row' as const,  // Type assertion
      gap: '2px',
    } : {
      // Default style for other halls
      gridColumn,
      gridRow,
      backgroundColor: '#3b82f6',
      color: 'white',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '11px',
      fontWeight: 'bold',
      borderRadius: '4px',
      height: '25px',
      margin: '2px',
    };
    
    return (
      <div
        key={`door-${index}`}
        style={doorStyle}
        className="door-label"
      >
        <span style={{ 
          fontSize: layoutName === 'Hall A' ? '12px' : 
                   layoutName === 'Hall B' ? '14px' : '16px' 
        }}>
          🚪
        </span>
        <span style={{ 
          marginLeft: layoutName === 'Hall B' && door.type === 'left' ? '0' : '4px',
          marginTop: layoutName === 'Hall B' && door.type === 'left' ? '2px' : '0'
        }}>
          {door.label}
        </span>
      </div>
    );
  });
};

  // Render passage labels
  // const renderPassages = () => {
  //   if (!showPassageLabels || !gridConfig.passages) return null;
    
  //   return gridConfig.passages.map((passage, index) => {
  //      if (passage.type === 'horizontal' && passage.startColumn && passage.endColumn) {
  //     // Partial-width horizontal corridor
  //     return (
  //       <div
  //         key={`passage-${index}`}
  //         style={{
  //           gridColumn: `${passage.startColumn} / ${passage.endColumn + 1}`,
  //           gridRow: passage.position,
  //           backgroundColor: '#e5e7eb',
  //           display: 'flex',
  //           alignItems: 'center',
  //           justifyContent: 'center',
  //           fontSize: '12px',
  //           fontWeight: 'bold',
  //           color: '#6b7280',
  //           height: '30px',
  //         }}
  //         className="passage-label"
  //       >
  //         {passage.label || 'CORRIDOR'}
  //       </div>
  //     );
  //   }
  //     const passageStyles: React.CSSProperties = {
  //       backgroundColor: '#e5e7eb',
  //       display: 'flex',
  //       alignItems: 'center',
  //       justifyContent: 'center',
  //       fontSize: '12px',
  //       fontWeight: 'bold',
  //       color: '#6b7280',
  //       ...(passage.type === 'horizontal' 
  //         ? {
  //             gridColumn: '1 / -1',
  //             gridRow: passage.position,
  //             height: '30px',
  //           }
  //         : {
  //             gridRow: '1 / -1',
  //             gridColumn: passage.position,
  //             width: '30px',
  //             writingMode: 'vertical-rl',
  //             textOrientation: 'mixed',
  //           }
  //       ),
  //     };
      
  //     return (
  //       <div
  //         key={`passage-${index}`}
  //         style={passageStyles}
  //         className="passage-label"
  //       >
  //         {passage.label || 'PASSAGE'}
  //       </div>
  //     );
  //   });
  // };

  // In BoothGrid.tsx, update the renderPassages function:

const renderPassages = () => {
  if (!showPassageLabels || !gridConfig.passages) return null;
  
  return gridConfig.passages.map((passage, index) => {
        if (passage.type === 'invisible-boundary') {
      return null;
    }
    // In renderPassages function
if (passage.type === 'horizontal' && layoutName.includes('CGA')) {
  // CGA horizontal passage spans both columns
  return (
    <div
      key={`passage-${index}`}
      style={{
        gridColumn: '1 / 3', // Span both columns
        gridRow: 29, // Fixed row position
        backgroundColor: '#e5e7eb',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '12px',
        fontWeight: 'bold',
        color: '#6b7280',
      }}
      className="passage-label"
    >
      {passage.label || 'CORRIDOR'}
    </div>
  );
}
    if (passage.type === 'horizontal' && passage.startColumn && passage.endColumn) {
      // Partial-width horizontal corridor
      return (
        <div
          key={`passage-${index}`}
          style={{
            gridColumn: `${passage.startColumn} / ${passage.endColumn + 1}`,
            gridRow: passage.position,
            backgroundColor: '#e5e7eb',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '12px',
            fontWeight: 'bold',
            color: '#6b7280',
            height: '30px',
          }}
          className="passage-label"
        >
          {passage.label || 'CORRIDOR'}
        </div>
      );
    }
    
    // Regular full-width passages
    const passageStyles: React.CSSProperties = {
      backgroundColor: '#e5e7eb',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '12px',
      fontWeight: 'bold',
      color: '#6b7280',
      margin: layoutName?.includes('Hall') ? '0' : undefined,
      ...(passage.type === 'horizontal' 
        ? {
            gridColumn: '1 / -1',
            gridRow: passage.position,
            height: '30px',
          }
        : {
            gridRow: '1 / -1',
            gridColumn: passage.position,
            width: '40px',
            writingMode: 'vertical-rl',
            textOrientation: 'mixed',
          }
      ),
    };
    
    return (
      <div
        key={`passage-${index}`}
        style={passageStyles}
        className="passage-label"
      >
        {passage.label || 'PASSAGE'}
      </div>
    );
  });
};
console.log('🔍 DEBUG - Booths to render:', Object.entries(booths).map(([id, booth]) => ({
  id,
  gridPosition: booth.gridPosition
})));
  return (
     <div 
  className="booth-grid-container" 
  data-layout={layoutName}
  style={{ '--booth-gap': layoutName.includes('Hall') ? '0px' : '8px' } as React.CSSProperties}
>
     <div style={gridStyles} className={`booth-grid ${layoutName.includes('Hall') ? 'hall-layout' : ''}`}>

          {/* Render doors */}
      {renderDoors()}
        {/* Render passages */}
        {renderPassages()}
        
        {/* Render booths */}
        {Object.entries(booths).map(([boothId, booth]) => {
           // For FDA, check if this position should be empty (corridor intersection)
  if (layoutName.includes('FDA') && booth.gridPosition) {
    const { row, col } = booth.gridPosition;
    // Skip rendering if in corridor intersection area
    if ((row < 10 && col < 13) || // Upper-left empty area
        (row > 16 && col < 12)) { // Lower-left empty area
      return null;
    }
  }
          // Skip if no grid position is defined
          if (!booth.gridPosition) {
               console.log('✅ Rendering booth:', boothId, 'at position:', booth.gridPosition);
            return null;
          }
             console.log('✅ Rendering booth:', boothId, 'at position:', booth.gridPosition);
            // Derive the current status
          const derivedStatus = currentSelections.includes(boothId) 
            ? 'selected' 
            : booth.status;
          
          return (
            <Booth
              key={boothId}
              boothId={boothId}
              is_indoor={is_indoor}
              status={derivedStatus} // Use derived status instead of booth.status
              size={booth.size}
              category={booth.category}
              price={booth.price}
              sqm={booth.sqm}
              gridPosition={booth.gridPosition}
              onBoothClick={onBoothClick}
              isValidNext={validNextBooths.has(boothId)}
              isSuggested={suggestedBooths.has(boothId)}
              isBlocked={blockedBooths.has(boothId)}
              validationMessage={validationMessages[boothId]}
              portalContainer={portalContainer}
              isFullscreen={isFullscreen}
            />
          );
        })}
      </div>
      
      {/* Grid info footer */}
      <div className="text-center text-sm text-gray-600 mt-4">
        <p>{layoutName} - {Object.keys(booths).length} booths</p>
      </div>
    </div>
  );
};

export default BoothGrid;
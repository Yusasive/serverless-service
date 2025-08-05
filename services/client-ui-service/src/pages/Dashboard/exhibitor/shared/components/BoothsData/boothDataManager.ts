// components/BoothsData/boothDataManager.ts - Enhanced with layout integration

import { BoothData, EnhancedBoothData } from '../../types/booth.types';
import { LayoutConfig } from './types/layout.types';
import { getLayoutConfigByName, layoutExistsByName } from './layouts/layoutRegistry';
import { BoothController } from '../../../../../../controllers/BoothController';
//import { copSectorBooths } from './copSectorBooths';
export const sectionNames = [
  'AFRICAHALL' ,
  'INTERNATIONAL', 
  'HALLA',
  'HALLB',
  'FDA',
  'RBF',
  'EEI',
  'HCT',
  'CGA',
  'TA',
  'COG',
  'OTH',
  'COP'
];

const sectionNameMapping: { [key: string]: string } = {
  // Halls
  'Africa Hall': 'AFRICAHALL',
  'International Hall': 'INTERNATIONAL', 
  'Hall A': 'HALLA',
  'Hall B': 'HALLB',
  
  // Sectors
  'Food, Drinks, Agriculture & Allied Products': 'FDA',
  'Real Estate, Building Furniture & Fittings': 'RBF',
  'ICT & Electronics Products': 'EEI',
  'Household Cosmetics & Textile Products': 'HCT',
  'Corporate Organizations & Government Agencies': 'CGA',
  'Transport and Allied/Power Products': 'TA',
  'Conglomerate': 'COG',
  'Publication, Healthcare & Sport Products': 'OTH',
  'Commercial Premium': 'COP'
};

/**
 * Map old section name to new backend section name
 */
function mapSectionName(oldSectionName: string): string {
  return sectionNameMapping[oldSectionName]
}

// Original booth collections (maintaining backward compatibility) - now populated from backend
export const allBoothsByLocation: { [key: string]: { [key: string]: BoothData } } = {};

/**
 * Get basic booth data for a location (backward compatibility)
 */
export function getBoothsForLocation(locationName: string): { [key: string]: BoothData } {
  return allBoothsByLocation[mapSectionName(locationName)] || {};
}

/**
 * Initialize booth data from backend
 */
export async function initializeBoothData(): Promise<void> {
  try {
    console.log('initializeBoothData called - starting initialization...');
    const boothController = BoothController.getInstance();
    console.log('BoothController instance obtained');
    
    // Fetch booth data for all sections in parallel
    const boothPromises = sectionNames.map(async (sectionName) => {
      try {
  
        const booths = await boothController.getBoothsDatabySectionName(sectionName);
        
        const boothData: { [key: string]: BoothData } = {};
        
        booths.forEach((booth: any) => {
          boothData[booth.booth_id || booth.boothId] = {
            coords: booth.coords || [],
            status: booth.status || 'available',
            size: booth.size || '3m x 3m',
            category: booth.category || 'Standard',
            price: Number(booth.price) || 0,
            sqm: Number(booth.sqm) || 9,
            boothId: booth.booth_id || booth.boothId,
            gridPosition: booth.grid_position || '1,1'
          };
        });

        console.log('Booth data for section:', sectionName, boothData);
        
        return { sectionName, boothData };
      } catch (error) {
        console.error(`Error fetching booth data for ${sectionName}:`, error);
        return { sectionName, boothData: {} };
      }
    });
    
    const results = await Promise.all(boothPromises);
    
    // Populate allBoothsByLocation
    results.forEach(({ sectionName, boothData }) => {
      allBoothsByLocation[sectionName] = boothData;
    });
   // allBoothsByLocation["COP"]= copSectorBooths
   // allBoothsByLocation["COP"]= copSectorBooths
    console.log('Booth data initialized from backend:', allBoothsByLocation);
  } catch (error) {
    console.error('Error initializing booth data from backend:', error);
  }
}

/**
 * Get booth data from backend for a specific section
 */
export async function getBoothsFromBackend(sectionName: string): Promise<{ [key: string]: BoothData }> {
  try {
    const boothController = BoothController.getInstance();
    const mappedSectionName = mapSectionName(sectionName);
    console.log(`Getting booths for section: ${sectionName} (mapped to: ${mappedSectionName})`);
    const response = await boothController.getBoothsDatabySectionName(mappedSectionName);
    
    if (response && response.length > 0) {
      // Convert backend booth data to the expected format
      const boothData: { [key: string]: BoothData } = {};
      
      response.forEach((booth: any) => {
        boothData[booth.booth_id || booth.boothId] = {
          coords: booth.coords || [],
          status: booth.status || 'available',
          size: booth.size || '3m x 3m',
          category: booth.category || 'Standard',
          price: booth.price || 0,
          sqm: booth.sqm || 9,
          boothId: booth.booth_id || booth.boothId,
          gridPosition: booth.grid_position || '1,1',
          bookedBy: booth.booked_By || undefined // Optional field for booked booths
        };
      });
      
      return boothData;
    }
    
    return {};
  } catch (error) {
    console.error(`Error fetching booth data for ${sectionName}:`, error);
    // Fallback to static data if backend fails
    return getBoothsForLocation(sectionName);
  }
}

/**
 * Get booth data for a location with backend integration
 */
export async function getBoothsForLocationWithBackend(locationName: string, useBackend: boolean = true): Promise<{ [key: string]: BoothData }> {
  if (useBackend) {
    return await getBoothsFromBackend(locationName);
  }
  return getBoothsForLocation(locationName);
}

/**
 * Get enhanced booth data with layout configuration applied
 */
export function getEnhancedBoothsForLocation(locationName: string): { [key: string]: EnhancedBoothData } {
  const basicBooths = getBoothsForLocation(locationName);
  const layoutConfig = getLayoutConfigByName(locationName);
  
  if (!layoutConfig) {
    // If no layout config exists, return basic booths with minimal enhancement
    return enhanceBoothsBasic(basicBooths, locationName);
  }
  
  return applyLayoutConfigToBooths(basicBooths, layoutConfig);
}

/**
 * Get enhanced booth data with backend integration
 */
export async function getEnhancedBoothsForLocationWithBackend(locationName: string, useBackend: boolean = true): Promise<{ [key: string]: EnhancedBoothData }> {
  const basicBooths = useBackend 
    ? await getBoothsFromBackend(locationName)
    : getBoothsForLocation(locationName);
    
  const layoutConfig = getLayoutConfigByName(locationName);
  
  if (!layoutConfig) {
    return enhanceBoothsBasic(basicBooths, locationName);
  }
  
  return applyLayoutConfigToBooths(basicBooths, layoutConfig);
}

/**
 * Apply layout configuration to booth data
 */
export function applyLayoutConfigToBooths(
  booths: { [key: string]: BoothData },
  layoutConfig: LayoutConfig
): { [key: string]: EnhancedBoothData } {
  const enhancedBooths: { [key: string]: EnhancedBoothData } = {};
  
  Object.entries(booths).forEach(([boothId, booth]) => {
    enhancedBooths[boothId] = enhanceBoothWithLayoutData(boothId, booth, layoutConfig);
  });
  
  return enhancedBooths;
}

/**
 * Enhance a single booth with layout configuration data
 */
function enhanceBoothWithLayoutData(
  boothId: string,
  booth: BoothData,
  layoutConfig: LayoutConfig
): EnhancedBoothData {
  // Find which column this booth belongs to
  const column = layoutConfig.columns.find(col => 
    col.boothRange.includes(boothId)
  );
  
  // Get allowed sequential connections
  const allowedConnections = layoutConfig.sequentialRules.allowedConnections[boothId] || [];
  
  // Find special booth configuration
  const specialBooth = layoutConfig.specialBooths.find(sb => sb.boothId === boothId);
  
  // Determine blocked booths due to passages
  const blockedByPassages = findBoothsBlockedByPassages(boothId, layoutConfig);
  
  // Calculate passage boundaries
  const passageBoundaries = calculatePassageBoundaries(boothId, layoutConfig);
  
  // Determine location type
  const locationType = determineLocationType(layoutConfig.layoutName);
  
  return {
    // Original booth data
    ...booth,
    
    // Layout context
    layoutId: layoutConfig.layoutId,
    layoutName: layoutConfig.layoutName,
    locationType,
    
    // Column information
    columnId: column?.columnId || 'unknown',
    columnType: column?.columnType || 'single',
    subColumnId: getSubColumnId(column),
    
    // Sequential booking support
    allowedSequentialBooths: allowedConnections,
    blockedByPassages,
    adjacentBooths: calculateAdjacentBooths(boothId, layoutConfig),
    
    // Passage boundary information
    passageBoundaries,
    
    // Special booth handling
    isSpecialBooth: !!specialBooth,
    specialRestrictions: specialBooth?.restrictions || [],
    isolatedFromOthers: column?.isolatedFromOthers || false,
    
    // Enhanced positioning
    rowNumber: calculateRowNumber(boothId, column),
    columnPosition: calculateColumnPosition(boothId, column),
    sectionId: column?.sectionId
  };
}

/**
 * Basic enhancement for booths without layout configuration
 */
function enhanceBoothsBasic(
  booths: { [key: string]: BoothData },
  locationName: string
): { [key: string]: EnhancedBoothData } {
  const enhancedBooths: { [key: string]: EnhancedBoothData } = {};
  const locationType = determineLocationType(locationName);
  
  Object.entries(booths).forEach(([boothId, booth]) => {
    enhancedBooths[boothId] = {
      ...booth,
      layoutId: 'unknown',
      layoutName: locationName,
      locationType,
      columnId: 'default',
      columnType: 'single',
      allowedSequentialBooths: [],
      blockedByPassages: [],
      adjacentBooths: [],
      passageBoundaries: {},
      isSpecialBooth: false,
      isolatedFromOthers: true
    };
  });
  
  return enhancedBooths;
}

/**
 * Find booths that are blocked by passages from the given booth
 */
function findBoothsBlockedByPassages(boothId: string, layoutConfig: LayoutConfig): string[] {
  const blockedBooths: string[] = [];
  const sourceColumn = findColumnForBooth(boothId, layoutConfig);
  
  if (!sourceColumn) return blockedBooths;
  
  // Check each passage to see if it blocks access to other booths
  layoutConfig.passages.forEach(passage => {
    if (!passage.blocksSequential) return;
    
    // If this passage separates our column from other columns
    if (passage?.separates?.includes(sourceColumn.columnId)) {
      // Find all booths in the separated columns
      layoutConfig.columns.forEach(column => {
        if (column.columnId !== sourceColumn.columnId && 
            passage?.separates?.includes(column.columnId)) {
          blockedBooths.push(...column.boothRange);
        }
      });
    }
  });
  
  return blockedBooths;
}

/**
 * Calculate passage boundaries for a booth
 */
function calculatePassageBoundaries(boothId: string, layoutConfig: LayoutConfig): any {
  const boundaries: any = {};
  const column = findColumnForBooth(boothId, layoutConfig);
  
  if (!column) return boundaries;
  
  // For each passage, determine if it affects this booth and from which direction
  layoutConfig.passages.forEach(passage => {
    if (passage?.separates?.includes(column.columnId)) {
      // Simplified direction detection - would need coordinate analysis for precise detection
      const direction = determinePassageDirection(passage);
      if (direction) {
        boundaries[direction] = {
          passageId: passage.passageId,
          passageType: passage.type,
          blocksSequential: passage.blocksSequential,
          separatesFrom: passage?.separates.filter(id => id !== column.columnId)
        };
      }
    }
  });
  
  return boundaries;
}

/**
 * Calculate adjacent booths (physical adjacency without passage restrictions)
 */
function calculateAdjacentBooths(boothId: string, layoutConfig: LayoutConfig): string[] {
  const column = findColumnForBooth(boothId, layoutConfig);
  if (!column) return [];
  
  const boothIndex = column.boothRange.indexOf(boothId);
  if (boothIndex === -1) return [];
  
  const adjacent: string[] = [];
  
  // Add previous booth in sequence
  if (boothIndex > 0) {
    adjacent.push(column.boothRange[boothIndex - 1]);
  }
  
  // Add next booth in sequence
  if (boothIndex < column.boothRange.length - 1) {
    adjacent.push(column.boothRange[boothIndex + 1]);
  }
  
  // For double columns, add cross-column adjacency
  if (column.columnType === 'double' && column.subColumns) {
    const crossColumnAdjacent = findCrossColumnAdjacent();
    if (crossColumnAdjacent) {
      adjacent.push(crossColumnAdjacent);
    }
  }
  
  return adjacent;
}

/**
 * Helper functions
 */
function findColumnForBooth(boothId: string, layoutConfig: LayoutConfig) {
  return layoutConfig.columns.find(col => col.boothRange.includes(boothId));
}

function getSubColumnId(column: any): string | undefined {
  if (column?.columnType === 'double' && column.subColumns) {
    // Simplified logic - would need more sophisticated mapping
    return column.columnId;
  }
  return undefined;
}

function calculateRowNumber(boothId: string, column: any): number | undefined {
  if (!column) return undefined;
  return column.boothRange.indexOf(boothId) + 1;
}

function calculateColumnPosition(boothId: string, column: any): number | undefined {
  if (!column) return undefined;
  return column.boothRange.indexOf(boothId) + 1;
}

function determineLocationType(locationName: string): 'hall' | 'sector' {
  return locationName.toLowerCase().includes('hall') ? 'hall' : 'sector';
}

function determinePassageDirection(passage: any): string | null {
  // Simplified direction determination - would need coordinate analysis for precision
  if (passage.type === 'door') return 'north';
  if (passage.passageId.includes('vertical')) return 'east';
  if (passage.passageId.includes('horizontal')) return 'south';
  return null;
}

function findCrossColumnAdjacent(): string | null {
  // Simplified cross-column adjacency - would need more sophisticated mapping
  // This is a placeholder implementation
  return null;
}

/**
 * Get all available locations with their booth counts
 */
export function getAllLocationSummary(): { [locationName: string]: LocationSummary } {
  const summary: { [locationName: string]: LocationSummary } = {};
  
  Object.keys(allBoothsByLocation).forEach(locationName => {
    const booths = getBoothsForLocation(locationName);
    
    const layoutConfig = getLayoutConfigByName(locationName);
    
    summary[locationName] = {
      locationName,
      hasLayoutConfig: !!layoutConfig,
      totalBooths: Object.keys(booths).length,
      availableBooths: Object.values(booths).filter(b => b.status === 'available').length,
      locationType: determineLocationType(locationName),
      layoutId: layoutConfig?.layoutId || null,
      boothTypes: calculateBoothTypes(booths)
    };
  });
  
  return summary;
}

interface LocationSummary {
  locationName: string;
  hasLayoutConfig: boolean;
  totalBooths: number;
  availableBooths: number;
  locationType: 'hall' | 'sector';
  layoutId: string | null;
  boothTypes: { [size: string]: number };
}

function calculateBoothTypes(booths: { [key: string]: BoothData }): { [size: string]: number } {
  const types: { [size: string]: number } = {};
  
  Object.values(booths).forEach(booth => {
    const key = `${booth.sqm}m²`;
    types[key] = (types[key] || 0) + 1;
  });
  
  return types;
}

/**
 * Validate booth data against layout configuration
 */
export function validateBoothDataAgainstLayout(
  locationName: string
): { isValid: boolean; errors: string[]; warnings: string[] } {
  const booths = getBoothsForLocation(locationName);
  const layoutConfig = getLayoutConfigByName(locationName);
  const errors: string[] = [];
  const warnings: string[] = [];
  
  if (!layoutConfig) {
    warnings.push(`No layout configuration found for ${locationName}`);
    return { isValid: true, errors, warnings };
  }
  
  // Check if all booths in layout config exist in booth data
  const definedBoothIds = new Set(Object.keys(booths));
  const configuredBoothIds = new Set(
    layoutConfig.columns.flatMap(col => col.boothRange)
  );
  
  // Find missing booths
  configuredBoothIds.forEach(boothId => {
    if (!definedBoothIds.has(boothId)) {
      errors.push(`Booth ${boothId} is configured in layout but missing from booth data`);
    }
  });
  
  // Find extra booths
  definedBoothIds.forEach(boothId => {
    if (!configuredBoothIds.has(boothId)) {
      warnings.push(`Booth ${boothId} exists in booth data but not configured in layout`);
    }
  });
  
  // Validate booth coordinates exist
  Object.entries(booths).forEach(([boothId, booth]) => {
    if (!booth.coords || booth.coords.length === 0) {
      errors.push(`Booth ${boothId} has no coordinates defined`);
    }
  });
  
  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
}

/**
 * Get layout configuration for a location if it exists
 */
export function getLayoutConfigForLocation(locationName: string): LayoutConfig | null {
  return getLayoutConfigByName(locationName);
}

/**
 * Check if a location has layout configuration
 */
export function hasLayoutConfiguration(locationName: string): boolean {
  return layoutExistsByName(locationName);
}

/**
 * Get booth by ID across all locations
 */
export function findBoothById(boothId: string): { booth: BoothData; locationName: string } | null {
  for (const [locationName, booths] of Object.entries(allBoothsByLocation)) {
    if (booths[boothId]) {
      return { booth: booths[boothId], locationName };
    }
  }
  return null;
}

/**
 * Get enhanced booth by ID across all locations
 */
export function findEnhancedBoothById(boothId: string): { booth: EnhancedBoothData; locationName: string } | null {
  for (const locationName of Object.keys(allBoothsByLocation)) {
    const enhancedBooths = getEnhancedBoothsForLocation(locationName);
    if (enhancedBooths[boothId]) {
      return { booth: enhancedBooths[boothId], locationName };
    }
  }
  return null;
}

/**
 * Update booth status across all locations
 */
export function updateBoothStatus(
  boothId: string, 
  newStatus: BoothData['status']
): boolean {
  const result = findBoothById(boothId);
  if (result) {
    result.booth.status = newStatus;
    return true;
  }
  return false;
}

/**
 * Get booth statistics across all locations
 */
export function getGlobalBoothStatistics() {
  const stats = {
    totalLocations: Object.keys(allBoothsByLocation).length,
    totalBooths: 0,
    boothsByStatus: {
      available: 0,
      selected: 0,
      'booked-by-you': 0,
      'booked-by-others': 0
    },
    boothsByLocation: {} as { [location: string]: number },
    boothsBySize: {} as { [size: string]: number },
    locationsWithLayoutConfig: 0
  };
  
  Object.entries(allBoothsByLocation).forEach(([locationName, booths]) => {
    const boothCount = Object.keys(booths).length;
    stats.totalBooths += boothCount;
    stats.boothsByLocation[locationName] = boothCount;
    
    if (hasLayoutConfiguration(locationName)) {
      stats.locationsWithLayoutConfig++;
    }
    
    Object.values(booths).forEach(booth => {
      stats.boothsByStatus[booth.status]++;
      
      const sizeKey = `${booth.sqm}m²`;
      stats.boothsBySize[sizeKey] = (stats.boothsBySize[sizeKey] || 0) + 1;
    });
  });
  
  return stats;
}

/**
 * Migration utility to update booth data structure
 */
export function migrateBoothData(locationName: string): { 
  success: boolean; 
  message: string; 
  migratedCount: number 
} {
  try {
    const booths = getBoothsForLocation(locationName);
    let migratedCount = 0;
    
    Object.entries(booths).forEach(([boothId, booth]) => {
      // Ensure all required fields exist
      if (!booth.boothId) {
        booth.boothId = boothId;
        migratedCount++;
      }
      
      // Add default values for missing fields
      if (!booth.size) {
        booth.size = `${Math.sqrt(booth.sqm)}m x ${Math.sqrt(booth.sqm)}m`;
        migratedCount++;
      }
      
      if (!booth.category) {
        booth.category = 'Standard';
        migratedCount++;
      }
    });
    
    return {
      success: true,
      message: `Successfully migrated ${migratedCount} booth records for ${locationName}`,
      migratedCount
    };
  } catch (error) {
    return {
      success: false,
      message: `Migration failed for ${locationName}: ${error}`,
      migratedCount: 0
    };
  }
}

/**
 * Get all booth data from backend for all sections
 */
export async function getAllBoothsFromBackend(): Promise<{ [key: string]: { [key: string]: BoothData } }> {
  const allBooths: { [key: string]: { [key: string]: BoothData } } = {};
  
  try {
    const boothController = BoothController.getInstance();
    
    // Fetch booth data for all sections in parallel
    const boothPromises = sectionNames.map(async (sectionName) => {
      try {
        const mappedSectionName = mapSectionName(sectionName);
        const booths = await boothController.getBoothsDatabySectionName(mappedSectionName);
        const boothData: { [key: string]: BoothData } = {};
        
        booths.forEach((booth: any) => {
          boothData[booth.booth_id || booth.boothId] = {
            coords: booth.coords || [],
            status: booth.status || 'available',
            size: booth.size || '3m x 3m',
            category: booth.category || 'Standard',
            price: booth.price || 0,
            sqm: booth.sqm || 9,
            boothId: booth.booth_id || booth.boothId
          };
        });
        
        return { sectionName, boothData };
      } catch (error) {
        console.error(`Error fetching booth data for ${sectionName}:`, error);
        // Fallback to static data
        return { sectionName, boothData: getBoothsForLocation(sectionName) };
      }
    });
    
    const results = await Promise.all(boothPromises);
    
    results.forEach(({ sectionName, boothData }) => {
      allBooths[sectionName] = boothData;
    });
    
    return allBooths;
  } catch (error) {
    console.error('Error fetching all booth data from backend:', error);
    // Fallback to static data
    return allBoothsByLocation;
  }
}
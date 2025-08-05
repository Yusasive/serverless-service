// components/BoothsData/layouts/layoutRegistry.ts

import { LayoutConfig } from '../types/layout.types';
import { ValidationResult } from '../types/validation.types';
import { hallAConfig } from './hallAConfig';
import { hallBConfig } from './hallBConfig';
import { africaHallConfig } from './africaHallConfig';
import { internationalHallConfig } from './internationalHallConfig';
import { eeiSectorConfig } from './eeiSectorConfig';
import { fdaSectorConfig } from './fdaSectorConfig';
import { rbfSectorConfig } from './rbfSectorConfig'; // ADD THIS
import { hctSectorConfig } from './hctSectorConfig';
import { othSectorConfig } from './othSectorConfig';
import { taSectorConfig } from './taSectorConfig'; // ADD THIS
import { cogSectorConfig } from './cogSectorConfig'; // ADD THIS
import { cgaSectorConfig } from './cgaSectorConfig'; // ADD THIS
import { copSectorConfig } from './copSectorConfig'; // ADD THIS
// import { hctSectorConfig } from './hctSectorConfig'; 

// Central registry of all layout configurations
export const LAYOUT_REGISTRY: { [layoutId: string]: LayoutConfig } = {
  'hall-a': hallAConfig,
  // Future layouts will be added here:
   'hall-b': hallBConfig,
   'africa-hall': africaHallConfig,
   'international-hall': internationalHallConfig,
   'eei-sector': eeiSectorConfig,
   'fda-sector': fdaSectorConfig,
     'Real Estate, Building Furniture & Fittings': rbfSectorConfig,
  'RBF Sector': rbfSectorConfig, // Also add this alias
   // ... other layouts ...
 
  'RBF - Real Estate, Building Furniture & Fittings': rbfSectorConfig, // Add this
  'Real Estate Building Furniture Fittings': rbfSectorConfig, // Add this without punctuation
  'hct-sector': hctSectorConfig,
'Household Cosmetics & Textile Products': hctSectorConfig,
'Publication, Healthcare & Sport Products': othSectorConfig,
'oth-sector': othSectorConfig,
'HCT Sector': hctSectorConfig,
'ta-sector': taSectorConfig,
  'Transport and Allied/Power Products': taSectorConfig,
  'TA Sector': taSectorConfig,
  'Conglomerate': cogSectorConfig,
  'COG Sector': cogSectorConfig,
  'cog-sector': cogSectorConfig,
  'cga-sector': cgaSectorConfig,
  "Commercilal Premium": copSectorConfig, // Add this alias
  'cop-sector': copSectorConfig,
'Corporate Organizations & Government Agencies': cgaSectorConfig,
'CGA Sector': cgaSectorConfig,
  // ... rest
  // etc.
};
console.log('🔍 Layout Registry Debug:', {
  hasRBF: 'Real Estate, Building Furniture & Fittings' in LAYOUT_REGISTRY,
  rbfConfig: LAYOUT_REGISTRY['Real Estate, Building Furniture & Fittings'],
  allKeys: Object.keys(LAYOUT_REGISTRY)
});
// Mapping from display names to layout IDs
export const LAYOUT_NAME_MAPPING: { [displayName: string]: string } = {
  'Hall A': 'hall-a',
  'Hall B': 'hall-b',
  'Africa Hall': 'africa-hall',
  'International Hall': 'international-hall',
  'Food, Drinks, Agriculture & Allied Products': 'fda-sector',
  'Household Cosmetics & Textile Products': 'hct-sector',
  'ICT & Electronics Products': 'eei-sector',
  'Corporate Organizations & Government Agencies': 'cga-sector',
  'Transport and Allied/Power Products': 'ta-sector',
  'Real Estate, Building Furniture & Fittings': 'rbf-sector',
  'Conglomerate': 'cog-sector',
  'Publication, Healthcare & Sport Products': 'oth-sector',
  'Commercial Premium': 'cop-sector',
  'Commercial premium': 'cop-sector',
  
};

/**
 * Get layout configuration by layout ID
 */
export function getLayoutConfig(layoutId: string): LayoutConfig | null {
  return LAYOUT_REGISTRY[layoutId] || null;
}

/**
 * Get layout configuration by display name
 */
export function getLayoutConfigByName(displayName: string): LayoutConfig | null {
   console.log('🔍 getLayoutConfigByName called with:', displayName);
  console.log('🔍 Registry has this key?', displayName in LAYOUT_REGISTRY);
  console.log('🔍 Config found:', LAYOUT_REGISTRY[displayName]);
 
  const layoutId = LAYOUT_NAME_MAPPING[displayName]?.trim();;
  // const trimmedName = layoutName?.trim();
 console.log('🔍 returning 2024:', layoutId.trim());
 if(layoutId==="rbf-sector") {
  const result = LAYOUT_REGISTRY[displayName.trim()] || null;
  console.log('🔍 Returning:', result);
  return result;
  }
  return layoutId ? getLayoutConfig(layoutId) : null;
}

/**
 * Get all available layout configurations
 */
export function getAllLayouts(): LayoutConfig[] {
  return Object.values(LAYOUT_REGISTRY);
}

/**
 * Get all layout IDs
 */
export function getAllLayoutIds(): string[] {
  return Object.keys(LAYOUT_REGISTRY);
}

/**
 * Get all display names
 */
export function getAllLayoutNames(): string[] {
  return Object.keys(LAYOUT_NAME_MAPPING);
}

/**
 * Check if a layout exists
 */
export function layoutExists(layoutId: string): boolean {
  return layoutId in LAYOUT_REGISTRY;
}

/**
 * Check if a layout exists by display name
 */
export function layoutExistsByName(displayName: string): boolean {
  const layoutId = LAYOUT_NAME_MAPPING[displayName];
  return layoutId ? layoutExists(layoutId) : false;
}

/**
 * Get layout ID from display name
 */
export function getLayoutId(displayName: string): string | null {
  return LAYOUT_NAME_MAPPING[displayName] || null;
}

/**
 * Get display name from layout ID
 */
export function getLayoutDisplayName(layoutId: string): string | null {
  // Reverse lookup in the mapping
  for (const [displayName, id] of Object.entries(LAYOUT_NAME_MAPPING)) {
    if (id === layoutId) {
      return displayName;
    }
  }
  return null;
}

/**
 * Register a new layout configuration
 */
export function registerLayout(config: LayoutConfig): ValidationResult {
  try {
    // Validate the configuration first
    const validation = validateLayoutConfig(config);
    if (!validation.isValid) {
      return validation;
    }
    
    // Check for duplicate layout ID
    if (layoutExists(config.layoutId)) {
      return {
        isValid: false,
        message: `Layout with ID '${config.layoutId}' already exists`,
        errors: [{
          code: 'DUPLICATE_LAYOUT_ID',
          message: `Layout ID '${config.layoutId}' is already registered`,
          affectedBooths: [],
          severity: 'error'
        }]
      };
    }
    
    // Register the layout
    LAYOUT_REGISTRY[config.layoutId] = config;
    
    // Auto-register display name mapping if not exists
    const displayName = getLayoutDisplayName(config.layoutId);
    if (!displayName) {
      LAYOUT_NAME_MAPPING[config.layoutName] = config.layoutId;
    }
    
    return {
      isValid: true,
      message: `Layout '${config.layoutName}' registered successfully`
    };
    
  } catch (error) {
    return {
      isValid: false,
      message: `Failed to register layout: ${error}`,
      errors: [{
        code: 'REGISTRATION_ERROR',
        message: `Registration failed: ${error}`,
        affectedBooths: [],
        severity: 'error'
      }]
    };
  }
}

/**
 * Unregister a layout configuration
 */
export function unregisterLayout(layoutId: string): ValidationResult {
  try {
    if (!layoutExists(layoutId)) {
      return {
        isValid: false,
        message: `Layout '${layoutId}' does not exist`
      };
    }
    
    // Remove from registry
    delete LAYOUT_REGISTRY[layoutId];
    
    // Remove from name mapping
    const displayName = getLayoutDisplayName(layoutId);
    if (displayName && LAYOUT_NAME_MAPPING[displayName] === layoutId) {
      delete LAYOUT_NAME_MAPPING[displayName];
    }
    
    return {
      isValid: true,
      message: `Layout '${layoutId}' unregistered successfully`
    };
    
  } catch (error) {
    return {
      isValid: false,
      message: `Failed to unregister layout: ${error}`
    };
  }
}

/**
 * Validate a layout configuration
 */
export function validateLayoutConfig(config: LayoutConfig): ValidationResult {
  const errors: any[] = [];
  const warnings: any[] = [];
  
  try {
    // Basic structure validation
    if (!config.layoutId || typeof config.layoutId !== 'string') {
      errors.push({
        code: 'INVALID_LAYOUT_ID',
        message: 'Layout ID is required and must be a string',
        affectedBooths: [],
        severity: 'error'
      });
    }
    
    if (!config.layoutName || typeof config.layoutName !== 'string') {
      errors.push({
        code: 'INVALID_LAYOUT_NAME',
        message: 'Layout name is required and must be a string',
        affectedBooths: [],
        severity: 'error'
      });
    }
    
    if (!['indoor', 'outdoor', 'premium-outdoor'].includes(config.locationType)) {
      errors.push({
        code: 'INVALID_LOCATION_TYPE',
        message: 'Location type must be indoor, outdoor, or premium-outdoor',
        affectedBooths: [],
        severity: 'error'
      });
    }
    
    // Columns validation
    if (!config.columns || !Array.isArray(config.columns) || config.columns.length === 0) {
      errors.push({
        code: 'NO_COLUMNS_DEFINED',
        message: 'At least one column must be defined',
        affectedBooths: [],
        severity: 'error'
      });
    } else {
      // Validate each column
      const columnIds = new Set<string>();
      const allBooths = new Set<string>();
      
      config.columns.forEach((column) => {
        // Check for duplicate column IDs
        if (columnIds.has(column.columnId)) {
          errors.push({
            code: 'DUPLICATE_COLUMN_ID',
            message: `Duplicate column ID: ${column.columnId}`,
            affectedBooths: [],
            severity: 'error'
          });
        }
        columnIds.add(column.columnId);
        
        // Check booth range
        if (!column.boothRange || column.boothRange.length === 0) {
          errors.push({
            code: 'EMPTY_BOOTH_RANGE',
            message: `Column ${column.columnId} has empty booth range`,
            affectedBooths: [],
            severity: 'error'
          });
        } else {
          // Check for duplicate booth IDs across columns
          column.boothRange.forEach(boothId => {
            if (allBooths.has(boothId)) {
              errors.push({
                code: 'DUPLICATE_BOOTH_ID',
                message: `Booth ${boothId} appears in multiple columns`,
                affectedBooths: [boothId],
                severity: 'error'
              });
            }
            allBooths.add(boothId);
          });
        }
      });
    }
    
    // Passages validation
    if (config.passages) {
      const passageIds = new Set<string>();
      
      config.passages.forEach(passage => {
        if (passageIds.has(passage.passageId)) {
          errors.push({
            code: 'DUPLICATE_PASSAGE_ID',
            message: `Duplicate passage ID: ${passage.passageId}`,
            affectedBooths: [],
            severity: 'error'
          });
        }
        passageIds.add(passage.passageId);
        
        // Validate coordinates if provided
        if (passage.coordinates && passage.coordinates.length < 2) {
          warnings.push({
            code: 'INSUFFICIENT_PASSAGE_COORDINATES',
            message: `Passage ${passage.passageId} has insufficient coordinates`,
            canProceed: true
          });
        }
      });
    }
    
    // Sequential rules validation
    if (config.sequentialRules?.allowedConnections) {
      const connections = config.sequentialRules.allowedConnections;
      const definedBooths = new Set(
        config.columns.flatMap(col => col.boothRange)
      );
      
      // Check if all booths in connections are defined in columns
      Object.keys(connections).forEach(boothId => {
        if (!definedBooths.has(boothId)) {
          warnings.push({
            code: 'UNDEFINED_BOOTH_IN_CONNECTIONS',
            message: `Booth ${boothId} in sequential rules is not defined in any column`,
            canProceed: true
          });
        }
        
        // Check if connected booths exist
        connections[boothId].forEach(connectedBooth => {
          if (!definedBooths.has(connectedBooth)) {
            warnings.push({
              code: 'UNDEFINED_CONNECTED_BOOTH',
              message: `Connected booth ${connectedBooth} is not defined in any column`,
              canProceed: true
            });
          }
        });
      });
    }
    
    return {
      isValid: errors.length === 0,
      message: errors.length === 0 ? 'Layout configuration is valid' : 'Layout configuration has errors',
      errors,
      warnings
    };
    
  } catch (error) {
    return {
      isValid: false,
      message: `Validation failed: ${error}`,
      errors: [{
        code: 'VALIDATION_EXCEPTION',
        message: `Unexpected error during validation: ${error}`,
        affectedBooths: [],
        severity: 'error'
      }]
    };
  }
}

/**
 * Get layout statistics
 */
export function getLayoutStats() {
  const stats = {
    totalLayouts: Object.keys(LAYOUT_REGISTRY).length,
    layoutsByType: {
      indoor: 0,
      outdoor: 0,
      'premium-outdoor': 0
    },
    totalBooths: 0,
    totalColumns: 0,
    totalPassages: 0,
    layouts: [] as any[]
  };
  
  Object.values(LAYOUT_REGISTRY).forEach(layout => {
    stats.layoutsByType[layout.locationType]++;
    stats.totalBooths += layout.metadata.totalBooths;
    stats.totalColumns += layout.columns.length;
    stats.totalPassages += layout.passages.length;
    
    stats.layouts.push({
      id: layout.layoutId,
      name: layout.layoutName,
      type: layout.locationType,
      booths: layout.metadata.totalBooths,
      columns: layout.columns.length,
      passages: layout.passages.length
    });
  });
  
  return stats;
}

/**
 * Export layout configuration as JSON
 */
export function exportLayoutConfig(layoutId: string): string | null {
  const config = getLayoutConfig(layoutId);
  return config ? JSON.stringify(config, null, 2) : null;
}

/**
 * Import layout configuration from JSON
 */
export function importLayoutConfig(jsonString: string): ValidationResult {
  try {
    const config = JSON.parse(jsonString) as LayoutConfig;
    return registerLayout(config);
  } catch (error) {
    return {
      isValid: false,
      message: `Failed to import layout configuration: ${error}`
    };
  }
}
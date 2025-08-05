// // types/booth.types.ts
// export interface BoothData {
//   coords: number[][];
//   status: 'available' | 'selected' | 'booked-by-you' | 'booked-by-others';
//   size: string;
//   category: 'Standard' | 'Premium';
//   price: number;
//   sqm: number;
//   boothId?: string;
// }

// export interface Point {
//   x: number;
//   y: number;
// }

// export interface BoothCoordinate {
//   id: string;
//   boothId: string;
//   points: Point[];
//   size: string;
//   category: 'Standard' | 'Premium';
//   price: number;
//   sqm: number;
//   hallName: string;
//   completed: boolean;
// }

// types/booth.types.ts - Enhanced with layout configuration fields

// Original booth data interface (keeping existing structure)
export interface BoothData {
  coords: number[][];
  status: 'available' | 'selected' | 'booked-by-you' | 'booked-by-others';
  size: string;
  category: 'Standard' | 'Premium' | 'VIP' | 'Special';
  price: number;
  sqm: number;
  boothId: string;
  gridPosition?:{}
  bookedBy?: string; // User ID of the person who booked it
}

// Enhanced booth data with layout information
export interface EnhancedBoothData extends BoothData {
  // Layout context
  layoutId: string;
  layoutName: string;
  // locationStructure: 'hall' | 'sector';  // Changed from locationType
   locationType: 'hall' | 'sector';  // Make sure this line exists
  // Column information
  columnId: string;
  columnType: 'single' | 'double';
  subColumnId?: string; // For double columns (col-2a, col-2b)
  
  // Sequential booking support
  allowedSequentialBooths: string[];
  blockedByPassages: string[];
  adjacentBooths: string[]; // Physical adjacency (without passage restrictions)
  
  // Passage boundary information
  passageBoundaries: {
    north?: PassageBoundaryRef;
    south?: PassageBoundaryRef;
    east?: PassageBoundaryRef;
    west?: PassageBoundaryRef;
  };
  
  // Special booth handling
  isSpecialBooth: boolean;
  specialRestrictions?: SpecialBoothRestriction[];
  isolatedFromOthers: boolean;
  
  // Validation helpers (computed at runtime)
  validationState?: BoothValidationState;
  
  // Selection metadata
  selectedAt?: string;
  reservedUntil?: string;
  
  // Enhanced positioning
  rowNumber?: number;
  columnPosition?: number;
  sectionId?: string;
}

export interface PassageBoundaryRef {
  passageId: string;
  passageType: 'door' | 'corridor' | 'emergency-exit' | 'main-aisle' | 'service-road';
  blocksSequential: boolean;
  separatesFrom: string[]; // Booth IDs this passage separates from
  distance?: number; // Distance to passage in layout units
}

export interface BoothValidationState {
  isValidSelection: boolean;
  canBeNextSelection: boolean;
  blockedReason?: ValidationBlockReason;
  validationMessage?: string;
  suggestedAlternatives?: string[];
  confidenceScore?: number; // 0-1 how certain we are about this state
}

export type ValidationBlockReason = 
  | 'column-restriction'
  | 'passage-boundary'
  | 'non-sequential'
  | 'special-booth-isolation'
  | 'already-selected'
  | 'not-available'
  | 'minimum-not-met'
  | 'maximum-exceeded';

export type SpecialBoothRestriction = 
  | 'isolated' 
  | 'different-pricing' 
  | 'no-sequential-link'
  | 'custom-validation'
  | 'vip-only'
  | 'requires-confirmation';

// Booth selection context for validation
export interface BoothSelectionContext {
  currentSelections: string[];
  targetBooth: string;
  layoutId: string;
  userPreferences?: UserBoothPreferences;
  validationMode: 'strict' | 'lenient' | 'preview';
}

export interface UserBoothPreferences {
  preferredBookingPattern: 'row-wise' | 'column-wise' | 'mixed' | 'no-preference';
  allowCrossColumnBooking: boolean;
  allowSpecialBoothMixing: boolean;
  prioritizeContiguousSelection: boolean;
}

// Extended booth collections
export interface BoothCollection {
  [boothId: string]: EnhancedBoothData;
}

export interface LocationBoothData {
  locationName: string;
  locationType: 'hall' | 'sector';
  booths: BoothCollection;
  layoutConfig?: any; // LayoutConfig - avoiding circular import
  lastUpdated: string;
  version: string;
}

// Booth operation results
export interface BoothOperationResult {
  success: boolean;
  message: string;
  affectedBooths: string[];
  newState?: BoothCollection;
  validationResult?: any; // ValidationResult
}

// Booth analytics and metrics
export interface BoothMetrics {
  totalBooths: number;
  availableBooths: number;
  selectedBooths: number;
  bookedBooths: number;
  specialBooths: number;
  averageBoothSize: number;
  boothsByCategory: { [category: string]: number };
  boothsByColumn: { [columnId: string]: number };
}

// Booth search and filtering
export interface BoothSearchCriteria {
  minSize?: number;
  maxSize?: number;
  category?: string[];
  status?: string[];
  columnId?: string[];
  priceRange?: { min: number; max: number };
  location?: { x: number; y: number; radius: number };
  tags?: string[];
}

export interface BoothSearchResult {
  booths: EnhancedBoothData[];
  totalFound: number;
  searchTime: number;
  appliedFilters: string[];
  suggestions?: string[];
}

// Migration utilities for existing booth data
export interface BoothMigrationConfig {
  sourceVersion: string;
  targetVersion: string;
  migrationRules: BoothMigrationRule[];
  preserveOriginal: boolean;
}

export interface BoothMigrationRule {
  field: string;
  transformation: 'copy' | 'transform' | 'calculate' | 'default';
  sourceField?: string;
  defaultValue?: any;
  transformer?: (value: any, booth: BoothData) => any;
}

// Booth data validation
export interface BoothDataValidation {
  isValid: boolean;
  errors: BoothDataError[];
  warnings: BoothDataWarning[];
  suggestions: BoothDataSuggestion[];
}

export interface BoothDataError {
  boothId: string;
  field: string;
  message: string;
  severity: 'error' | 'warning';
}

export interface BoothDataWarning {
  boothId: string;
  field: string;
  message: string;
  impact: 'low' | 'medium' | 'high';
}

export interface BoothDataSuggestion {
  boothId: string;
  suggestion: string;
  benefit: string;
  effort: 'low' | 'medium' | 'high';
}

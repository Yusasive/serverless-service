// components/BoothsData/types/layout.types.ts

export interface LayoutConfig {
  layoutId: string;
  layoutName: string;
  locationType: 'indoor' | 'outdoor' | 'premium-outdoor';
  
  // Column definitions
  columns: ColumnConfig[];
  
  // Passage definitions  
  passages: PassageConfig[];
  
  // Special booth handling
  specialBooths: SpecialBoothConfig[];
  
  // Sequential booking rules
  sequentialRules: SequentialRules;
  
  // Metadata
  metadata: LayoutMetadata;
}

export interface ColumnConfig {
  columnId: string;
  columnType: 'single' | 'double';
  subColumns?: string[]; // For double columns: ['col-2a', 'col-2b']
  boothRange: string[];  // ['N001', 'N002', ..., 'N008']
  numberingOrder: 'ascending' | 'descending';
  isolatedFromOthers: boolean; // Cannot connect to other columns
  sectionId?: string; // For layouts with multiple sections
}


export interface PassageConfig {
  passageId: string;
  type: 'door' | 'corridor' | 'emergency-exit' | 'main-aisle' | 'service-road'| 'thin-aisle' |'invisible-boundary'|'position';
  separates?: string[]; // Which columns/sections this passage separates
  coordinates?: number[][]; // SVG coordinates for visual representation [[x1,y1], [x2,y2]]
  blocksSequential: boolean; // Whether this prevents sequential booking
  description?: string; // Human-readable description
  isVisible?: boolean; // Whether to show on UI (default: true)
  position?:number;
  startColumn?: number; // For corridors, which column it starts from
  endColumn?: number; // For corridors, which column it ends at
}

export interface SpecialBoothConfig {
  boothId: string;
  treatAsSeparate: boolean;
  columnId?: string; // Override normal column assignment
  restrictions: SpecialBoothRestriction[];
  pricing?: {
    overrideStandardPricing: boolean;
    customSqm?: number;
    customCategory?: string;
  };
}

export type SpecialBoothRestriction = 
  | 'isolated' 
  | 'different-pricing' 
  | 'no-sequential-link'
  | 'custom-validation'
  | 'vip-only';

export interface SequentialRules {
  // Define which booths can connect sequentially
  allowedConnections: { [boothId: string]: string[] };
  
  // Column-level restrictions
  columnRestrictions: { [columnId: string]: ColumnRestrictions };
  
  // Global rules
  globalRules: GlobalSequentialRules;
}

export interface ColumnRestrictions {
  isolatedColumn?: boolean; // Cannot connect to any other column
  allowedSubColumns?: string[]; // For double columns
  maxContinuousSelection?: number; // Max booths in sequence
  requiresMinimumSelection?: number; // Min booths required
}

export interface GlobalSequentialRules {
  preventCrossPassageBooking: boolean;
  allowRowWiseBooking: boolean; // In double columns
  allowColumnWiseBooking: boolean; // In double columns
  allowMixedBooking: boolean; // Combination of row and column
  enforceStrictAdjacency: boolean; // Must be immediately adjacent
}

export interface LayoutMetadata {
  totalBooths: number;
  boothTypes: BoothTypeInfo[];
  lastUpdated: string;
  version: string;
  validatedBy?: string;
  notes?: string[];
}

export interface BoothTypeInfo {
  type: string; // '6m²', '9m²', etc.
  count: number;
  boothIds: string[];
  description: string;
}

// Enhanced booth data with layout information
export interface EnhancedBoothData {
  // Original booth data
  coords: number[][];
  status: 'available' | 'selected' | 'booked-by-you' | 'booked-by-others';
  size: string;
  category: 'Standard' | 'Premium' | 'VIP' | 'Special';
  price: number;
  sqm: number;
  boothId: string;
  
  // Layout-enhanced fields
  layoutId: string;
  columnId: string;
  columnType: 'single' | 'double';
  
  // Sequential booking support
  allowedSequentialBooths: string[];
  blockedByPassages: string[];
  
  // Passage boundary info
  passageBoundaries: PassageBoundaryInfo;
  
  // Validation helpers
  isSpecialBooth: boolean;
  isolatedFromOthers: boolean;
  
  // Selection metadata
  selectedAt?: string;
  locationName?: string;
  locationType?: 'hall' | 'sector';
  
  // Validation state (runtime only)
  validationState?: BoothValidationState;
}

export interface PassageBoundaryInfo {
  north?: PassageBoundary;
  south?: PassageBoundary;
  east?: PassageBoundary;
  west?: PassageBoundary;
}

export interface PassageBoundary {
  passageId: string;
  passageType: PassageConfig['type'];
  blocksSequential: boolean;
  separatesFrom: string[]; // Which booths/columns this separates from
}

export interface BoothValidationState {
  isValidSelection: boolean;
  canBeNextSelection: boolean;
  blockedReason?: 'column' | 'passage' | 'sequential' | 'special';
  validationMessage?: string;
  suggestedAlternatives?: string[];
}
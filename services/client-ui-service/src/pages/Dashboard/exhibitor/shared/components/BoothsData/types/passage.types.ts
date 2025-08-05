// components/BoothsData/types/passage.types.ts

export interface PassageDetectionConfig {
  method: 'manual' | 'coordinate-based' | 'hybrid';
  coordinateThreshold?: number; // For coordinate-based detection
  manualOverrides?: ManualPassageOverride[];
}

export interface ManualPassageOverride {
  fromBooth: string;
  toBooth: string;
  blocked: boolean;
  reason: string;
}

// Geometric passage definitions
export interface GeometricPassage {
  passageId: string;
  type: PassageType;
  geometry: PassageGeometry;
  visualStyle: PassageVisualStyle;
  interactionRules: PassageInteractionRules;
}

export type PassageType = 
  | 'door' 
  | 'corridor' 
  | 'emergency-exit' 
  | 'main-aisle' 
  | 'service-road'
  | 'fire-lane'
  | 'loading-dock'
  | 'utility-corridor';

export interface PassageGeometry {
  coordinates: number[][]; // SVG coordinates
  width?: number; // Passage width
  length?: number; // Passage length
  shape: 'line' | 'rectangle' | 'polygon' | 'arc';
  boundingBox?: BoundingBox;
}

export interface BoundingBox {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
}

export interface PassageVisualStyle {
  strokeColor: string;
  strokeWidth: number;
  strokeDashArray?: string;
  fillColor?: string;
  fillOpacity?: number;
  labelStyle?: PassageLabelStyle;
  showOnHover?: boolean;
  animateOnSelection?: boolean;
}

export interface PassageLabelStyle {
  show: boolean;
  text: string;
  fontSize: number;
  fontColor: string;
  position: 'start' | 'middle' | 'end' | 'auto';
  offset?: { x: number; y: number };
}

export interface PassageInteractionRules {
  blocksSequentialBooking: boolean;
  allowsCrossing: boolean; // For special cases
  requiresConfirmation: boolean; // User must confirm crossing
  alternativeRoutes?: string[]; // Alternative passage IDs
  accessRestrictions?: AccessRestriction[];
}

export interface AccessRestriction {
  type: 'emergency-only' | 'staff-only' | 'vip-only' | 'time-restricted';
  description: string;
  conditions?: any; // Flexible conditions object
}

// Passage detection utilities
export interface PassageDetectionResult {
  detectedPassages: DetectedPassage[];
  confidence: number; // 0-1 confidence score
  method: 'manual' | 'automatic';
  processingTime: number;
  warnings: string[];
}

export interface DetectedPassage {
  passageId: string;
  confidence: number;
  affectedBooths: string[];
  suggestedType: PassageType;
  coordinates: number[][];
  needsManualReview: boolean;
}

// Passage validation specific types
export interface PassageValidationContext {
  fromBooth: string;
  toBooth: string;
  currentPath: string[]; // Current selection path
  proposedPath: string[]; // Path if this booth is added
  layoutConfig: any; // LayoutConfig
}

export interface PassageValidationResult {
  canCross: boolean;
  blockedBy?: string[]; // Passage IDs that block this crossing
  requiresConfirmation: boolean;
  alternativePaths?: AlternativePath[];
  warningMessage?: string;
}

export interface AlternativePath {
  pathId: string;
  description: string;
  suggestedBooths: string[];
  pathLength: number;
  difficulty: 'easy' | 'medium' | 'hard';
}

// Interactive passage features
export interface PassageInteractionState {
  hoveredPassage?: string;
  selectedPassage?: string;
  highlightAffectedBooths: boolean;
  showPassageLabels: boolean;
  showAlternativeRoutes: boolean;
}

export interface PassageUserPreferences {
  showPassageBoundaries: boolean;
  showPassageLabels: boolean;
  highlightBlockedConnections: boolean;
  showAlternativeRouteSuggestions: boolean;
  passageVisibilityLevel: 'all' | 'blocking-only' | 'none';
}

// Passage analysis tools
export interface PassageAnalysis {
  totalPassages: number;
  passagesByType: { [type in PassageType]?: number };
  criticalPassages: string[]; // Passages that block many connections
  redundantPassages: string[]; // Passages that don't block anything
  optimizationSuggestions: PassageOptimization[];
}

export interface PassageOptimization {
  type: 'remove' | 'modify' | 'add';
  passageId: string;
  reason: string;
  impact: string;
  confidence: number;
}

// Error handling for passage operations
export interface PassageError {
  errorCode: PassageErrorCode;
  message: string;
  passageId?: string;
  affectedBooths?: string[];
  suggestedFix?: string;
}

export type PassageErrorCode =
  | 'INVALID_PASSAGE_GEOMETRY'
  | 'PASSAGE_COORDINATES_OUT_OF_BOUNDS'
  | 'DUPLICATE_PASSAGE_ID'
  | 'PASSAGE_TYPE_MISMATCH'
  | 'CIRCULAR_PASSAGE_DEPENDENCY'
  | 'PASSAGE_CONFIGURATION_ERROR';
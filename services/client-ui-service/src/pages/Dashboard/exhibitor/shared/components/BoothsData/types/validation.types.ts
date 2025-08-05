// components/BoothsData/types/validation.types.ts

export interface ValidationResult {
  isValid: boolean;
  message: string;
  errors?: ValidationError[];
  warnings?: ValidationWarning[];
  suggestions?: ValidationSuggestion[];
  selection?:string[]
}

export interface ValidationError {
  code: ValidationErrorCode;
  message: string;
  affectedBooths: string[];
  severity: 'error' | 'warning' | 'info';
}

export interface ValidationWarning {
  code: ValidationWarningCode;
  message: string;
  affectedBooths?: string[];
  canProceed: boolean;
}

export interface ValidationSuggestion {
  type: 'alternative' | 'fix' | 'optimization';
  message: string;
  suggestedBooths?: string[];
  action?: ValidationAction;
}

export type ValidationErrorCode = 
  | 'CROSS_COLUMN_SELECTION'
  | 'PASSAGE_BOUNDARY_VIOLATION'
  | 'NON_SEQUENTIAL_SELECTION'
  | 'SPECIAL_BOOTH_VIOLATION'
  | 'MINIMUM_SELECTION_NOT_MET'
  | 'MAXIMUM_SELECTION_EXCEEDED'
  | 'BOOTH_ALREADY_SELECTED'
  | 'BOOTH_NOT_AVAILABLE'
  | 'INVALID_BOOTH_ID'
  | 'CONFIGURATION_ERROR'
  |  'VALIDATION_EXCEPTION'
  |'VALIDATION_EXCEPTION'
  |'REGISTRATION_ERROR'
   | 'DUPLICATE_LAYOUT_ID'        // Add this
  | 'LAYOUT_NOT_FOUND'           // Likely needed
  | 'INVALID_LAYOUT_CONFIG'      // Likely needed
  | 'BOOTH_COORDINATE_ERROR'     // Likely needed
  | 'PASSAGE_CONFIGURATION_ERROR' // Likely needed
  | 'COLUMN_CONFIGURATION_ERROR'// Likely needed
    | 'LOCATION_TYPE_ERROR'          // Add this
  | 'BOOTH_DATA_MISSING'      // Add this
  | 'SEQUENTIAL_PATTERN_VIOLATION'      // Add this
  ;  // Add this line;

export type ValidationWarningCode =
  | 'SUBOPTIMAL_SELECTION'
  | 'PRICING_TIER_MISMATCH'
  | 'ISOLATED_SELECTION'
  | 'MIXED_BOOTH_TYPES'
  | 'ACCESSIBILITY_CONCERN'
  | 'PREVIEW_MODE_WARNING'
  | 'ADMIN_OVERRIDE'
  | 'LENIENT_MODE_WARNING'
  | 'SEQUENTIAL_GAP'
  
  ;

export interface ValidationAction {
  type: 'clear_selection' | 'remove_booth' | 'add_booth' | 'replace_selection';
  targetBooths?: string[];
  description: string;
}

export interface ValidationContext {
  currentSelections: string[];
  proposedBooth: string;
  layoutConfig: any; // LayoutConfig - avoiding circular import
  userPreferences?: UserValidationPreferences;
  validationMode: ValidationMode;
}

export interface UserValidationPreferences {
  allowRowWiseBooking: boolean;
  allowColumnWiseBooking: boolean;
  allowMixedBooking: boolean;
  preferOptimalArrangement: boolean;
  showAdvancedWarnings: boolean;
}

export type ValidationMode = 
  | 'strict'     // All rules enforced
  | 'lenient'    // Some warnings become suggestions
  | 'preview'    // Show what would happen without enforcing
  | 'admin';     // Admin override mode

export interface ValidatorConfig {
  enablePassageValidation: boolean;
  enableColumnValidation: boolean;
  enableSequentialValidation: boolean;
  enableSpecialBoothValidation: boolean;
  allowPartialValidation: boolean;
  maxValidationErrors: number;
}

// Validation rule definitions
export interface ValidationRule {
  ruleId: string;
  name: string;
  description: string;
  severity: 'error' | 'warning';
  enabled: boolean;
  validator: (context: ValidationContext) => ValidationResult;
  dependencies?: string[]; // Other rules this depends on
}

export interface ValidationRuleSet {
  ruleSetId: string;
  name: string;
  description: string;
  rules: ValidationRule[];
  applicableLayouts: string[]; // Layout IDs this ruleset applies to
}

// Real-time validation state
export interface ValidationState {
  isValidating: boolean;
  lastValidation?: ValidationResult;
  validBooths: Set<string>;
  invalidBooths: Set<string>;
  suggestedBooths: Set<string>;
  blockedBooths: Set<string>;
  lastUpdated: number;
}

// Batch validation for multiple selections
export interface BatchValidationRequest {
  selections: string[];
  layoutId: string;
  validationMode: ValidationMode;
  stopOnFirstError: boolean;
}

export interface BatchValidationResult {
  overallValid: boolean;
  individualResults: { [boothId: string]: ValidationResult };
  combinedResult: ValidationResult;
  validSelections: string[];
  invalidSelections: string[];
  processingTime: number;
}

// Performance monitoring
export interface ValidationMetrics {
  totalValidations: number;
  averageValidationTime: number;
  errorRate: number;
  lastResetTime: number;
  performanceWarnings: string[];
}
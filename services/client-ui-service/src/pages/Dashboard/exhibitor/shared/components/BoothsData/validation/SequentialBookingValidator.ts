// components/BoothsData/validation/SequentialBookingValidator.ts

import { ValidationResult, ValidationContext, ValidationState, BatchValidationRequest, BatchValidationResult } from '../types/validation.types';
import { LayoutConfig } from '../types/layout.types';
import { ColumnValidator } from './columnValidator';
import { PassageValidator } from './passageValidator';
import { SequentialValidator } from './sequentialValidator';

export class SequentialBookingValidator {
  private columnValidator: ColumnValidator;
  private passageValidator: PassageValidator;
  private sequentialValidator: SequentialValidator;
  private validationCache: Map<string, ValidationResult> = new Map();
  private cacheTimeout = 30000; // 30 seconds

  constructor(private layoutConfig: LayoutConfig) {
    this.columnValidator = new ColumnValidator(layoutConfig);
    this.passageValidator = new PassageValidator(layoutConfig);
    this.sequentialValidator = new SequentialValidator(layoutConfig);
  }

  /**
   * Main validation method - orchestrates all validation rules
   */
  validateSelection(context: ValidationContext): ValidationResult {
    const { currentSelections, proposedBooth, validationMode = 'strict' } = context;
    
    // Generate cache key
    const cacheKey = this.generateCacheKey(currentSelections, proposedBooth, validationMode);
    
    // Check cache first
    const cachedResult = this.validationCache.get(cacheKey);
    if (cachedResult) {
      return cachedResult;
    }

    const startTime = performance.now();
    // const errors: any[] = [];
    const warnings: any[] = [];
    const suggestions: any[] = [];

    try {
      // Rule 1: Column Restrictions (always enforced)
      const columnValidation = this.columnValidator.validateColumnRestriction(context);
      if (!columnValidation.isValid) {
        const result = this.handleValidationFailure('column', columnValidation, validationMode);
        this.cacheResult(cacheKey, result);
        return result;
      }
      
      if (columnValidation.warnings) warnings.push(...columnValidation.warnings);

      // Rule 2: Passage Boundaries (enforced if enabled)
      if (this.layoutConfig.sequentialRules.globalRules.preventCrossPassageBooking) {
        const passageValidation = this.passageValidator.validatePassageBoundaries(context);
        if (!passageValidation.isValid) {
          const result = this.handleValidationFailure('passage', passageValidation, validationMode);
          this.cacheResult(cacheKey, result);
          return result;
        }
        
        if (passageValidation.warnings) warnings.push(...passageValidation.warnings);
        if (passageValidation.suggestions) suggestions.push(...passageValidation.suggestions);
      }

      // Rule 3: Sequential Adjacency (enforced if enabled)
      if (this.layoutConfig.sequentialRules.globalRules.enforceStrictAdjacency) {
        const sequentialValidation = this.sequentialValidator.validateSequentialAdjacency(context);
        if (!sequentialValidation.isValid) {
          const result = this.handleValidationFailure('sequential', sequentialValidation, validationMode);
          this.cacheResult(cacheKey, result);
          return result;
        }
        
        if (sequentialValidation.warnings) warnings.push(...sequentialValidation.warnings);
        if (sequentialValidation.suggestions) suggestions.push(...sequentialValidation.suggestions);
      }

      // All validations passed
      const result: ValidationResult = {
        isValid: true,
        message: 'All validation rules passed',
        warnings: warnings.length > 0 ? warnings : undefined,
        suggestions: suggestions.length > 0 ? suggestions : undefined
      };

      this.cacheResult(cacheKey, result);
      return result;

    } catch (error) {
      const errorResult: ValidationResult = {
        isValid: false,
        message: `Validation error: ${error}`,
        errors: [{
          code: 'VALIDATION_EXCEPTION',
          message: `Unexpected validation error: ${error}`,
          affectedBooths: [proposedBooth],
          severity: 'error'
        }]
      };

      this.cacheResult(cacheKey, errorResult);
      return errorResult;
    } finally {
      const endTime = performance.now();
      console.debug(`Validation completed in ${endTime - startTime}ms for booth ${proposedBooth}`);
    }
  }

  /**
   * Handle validation failures based on validation mode
   */
  private handleValidationFailure(
    validationType: 'column' | 'passage' | 'sequential',
    validationResult: ValidationResult,
    validationMode: string
  ): ValidationResult {
    switch (validationMode) {
      case 'lenient':
        // Convert some errors to warnings in lenient mode
        if (validationType === 'sequential') {
          return {
            isValid: true,
            message: 'Validation passed in lenient mode',
            warnings: [{
              code: 'LENIENT_MODE_WARNING',
              message: validationResult.message,
              canProceed: true
            }]
          };
        }
        break;

      case 'preview':
        // Show what would happen without enforcing
        return {
          isValid: true,
          message: 'Preview mode - validation would fail in strict mode',
          warnings: [{
            code: 'PREVIEW_MODE_WARNING',
            message: `Preview: ${validationResult.message}`,
            canProceed: true
          }]
        };

      case 'admin':
        // Admin mode bypasses most restrictions
        return {
          isValid: true,
          message: 'Admin override applied',
          warnings: [{
            code: 'ADMIN_OVERRIDE',
            message: `Admin override: ${validationResult.message}`,
            canProceed: true
          }]
        };
    }

    // Default strict mode - return original failure
    return validationResult;
  }

  /**
   * Batch validate multiple booth selections
   */
  validateBatch(request: BatchValidationRequest): BatchValidationResult {
    const startTime = performance.now();
    const results: { [boothId: string]: ValidationResult } = {};
    const validSelections: string[] = [];
    const invalidSelections: string[] = [];
    
    let overallValid = true;
    const combinedErrors: any[] = [];
    const combinedWarnings: any[] = [];

    // Validate each booth incrementally
    for (let i = 0; i < request.selections.length; i++) {
      const currentSelections = request.selections.slice(0, i);
      const proposedBooth = request.selections[i];
      
      const context: ValidationContext = {
        currentSelections,
        proposedBooth,
        layoutConfig: this.layoutConfig,
        validationMode: request.validationMode
      };

      const result = this.validateSelection(context);
      results[proposedBooth] = result;

      if (result.isValid) {
        validSelections.push(proposedBooth);
      } else {
        invalidSelections.push(proposedBooth);
        overallValid = false;
        
        if (result.errors) combinedErrors.push(...result.errors);
        if (result.warnings) combinedWarnings.push(...result.warnings);
        
        // Stop on first error if requested
        if (request.stopOnFirstError) {
          break;
        }
      }
    }

    const endTime = performance.now();

    return {
      overallValid,
      individualResults: results,
      combinedResult: {
        isValid: overallValid,
        message: overallValid ? 'All selections valid' : `${invalidSelections.length} invalid selections`,
        errors: combinedErrors.length > 0 ? combinedErrors : undefined,
        warnings: combinedWarnings.length > 0 ? combinedWarnings : undefined
      },
      validSelections,
      invalidSelections,
      processingTime: endTime - startTime
    };
  }

  /**
   * Get all valid next booth options
   */
  getValidNextBooths(currentSelections: string[]): string[] {
    if (currentSelections.length === 0) {
      return this.layoutConfig.columns.flatMap(col => col.boothRange);
    }

    // Get valid booths from each validator
    const validByColumn = this.columnValidator.getValidNextBoothsByColumn(currentSelections);
    const validByPassage = this.passageValidator.getValidNextBoothsByPassage(currentSelections);
    const validBySequence = this.sequentialValidator.getValidNextBoothsBySequence(currentSelections);

    // Return intersection of all valid sets
    const intersection = validByColumn.filter(booth =>
      validByPassage.includes(booth) && validBySequence.includes(booth)
    );

    return intersection;
  }

  /**
   * Get validation state for a set of booths
   */
  getValidationState(selections: string[]): ValidationState {
    const validBooths = new Set<string>();
    const invalidBooths = new Set<string>();
    const suggestedBooths = new Set<string>();
    const blockedBooths = new Set<string>();

    // Get all possible booths
    const allBooths = this.layoutConfig.columns.flatMap(col => col.boothRange);
    
    // Test each booth
    allBooths.forEach(booth => {
      if (selections.includes(booth)) {
        validBooths.add(booth);
        return;
      }

      const context: ValidationContext = {
        currentSelections: selections,
        proposedBooth: booth,
        layoutConfig: this.layoutConfig,
        validationMode: 'strict'
      };

      const result = this.validateSelection(context);
      
      if (result.isValid) {
        validBooths.add(booth);
        // Check if this booth is suggested
        if (result.suggestions?.some(s => s.suggestedBooths?.includes(booth))) {
          suggestedBooths.add(booth);
        }
      } else {
        invalidBooths.add(booth);
        blockedBooths.add(booth);
      }
    });

    return {
      isValidating: false,
      validBooths,
      invalidBooths,
      suggestedBooths,
      blockedBooths,
      lastUpdated: Date.now()
    };
  }

  /**
   * Get comprehensive analysis of current selection
   */
  getSelectionAnalysis(selections: string[]): {
    columnAnalysis: any;
    passageAnalysis: any;
    sequentialAnalysis: any;
    overallScore: number;
    recommendations: string[];
  } {
    const columnSummary = this.columnValidator.getValidationSummary(selections);
    const passageAnalysis = this.passageValidator.getPassageAnalysis(selections);
    const sequentialAnalysis = this.sequentialValidator.getSequentialAnalysis(selections);

    // Calculate overall score (0-100)
    let score = 100;
    
    // Deduct points for violations
    if (columnSummary.maxSelectionsReached) score -= 20;
    if (passageAnalysis.crossingRisk === 'high') score -= 15;
    if (passageAnalysis.crossingRisk === 'medium') score -= 10;
    if (!sequentialAnalysis.continuity.isValid) score -= 15;
    if (sequentialAnalysis.pattern.type === 'mixed') score -= 10;

    // Generate recommendations
    const recommendations: string[] = [];
    
    if (columnSummary.maxSelectionsReached) {
      recommendations.push('Maximum selections reached for this column group');
    }
    
    if (passageAnalysis.crossingRisk === 'high') {
      recommendations.push('High risk of crossing passage boundaries - consider selecting within same section');
    }
    
    if (sequentialAnalysis.continuity.gaps.length > 0) {
      recommendations.push(`Consider filling gaps: ${sequentialAnalysis.continuity.gaps.join(', ')}`);
    }
    
    if (sequentialAnalysis.pathEfficiency < 0.8) {
      recommendations.push('Selection path could be more efficient - consider more direct routes');
    }

    return {
      columnAnalysis: columnSummary,
      passageAnalysis,
      sequentialAnalysis,
      overallScore: Math.max(0, score),
      recommendations
    };
  }

  /**
   * Clear validation cache
   */
  clearCache(): void {
    this.validationCache.clear();
  }

  /**
   * Get cache statistics
   */
  getCacheStats(): {
    size: number;
    hitRate: number;
    oldestEntry: number;
  } {
    const now = Date.now();
    let oldestEntry = now;
    
    // Clean expired entries and find oldest
    for (const [key, _] of this.validationCache.entries()) {
      const entryTime = parseInt(key.split('|')[3] || '0');
      if (now- - entryTime > this.cacheTimeout) {
        this.validationCache.delete(key);
      } else {
        oldestEntry = Math.min(oldestEntry, entryTime);
      }
    }

    return {
      size: this.validationCache.size,
      hitRate: 0, // Would need to track hits/misses
      oldestEntry
    };
  }

  /**
   * Private helper methods
   */
  private generateCacheKey(selections: string[], proposed: string, mode: string): string {
    const selectionsKey = selections.sort().join(',');
    const timestamp = Date.now();
    return `${selectionsKey}|${proposed}|${mode}|${timestamp}`;
  }

  private cacheResult(key: string, result: ValidationResult): void {
    // Limit cache size
    if (this.validationCache.size > 1000) {
      const firstKey = this.validationCache.keys().next().value;
      if (firstKey !== undefined) {
        this.validationCache.delete(firstKey);
      }
    }
    
    this.validationCache.set(key, result);
  }

  /**
   * Update layout configuration
   */
  updateLayout(newLayoutConfig: LayoutConfig): void {
    this.layoutConfig = newLayoutConfig;
    this.columnValidator = new ColumnValidator(newLayoutConfig);
    this.passageValidator = new PassageValidator(newLayoutConfig);
    this.sequentialValidator = new SequentialValidator(newLayoutConfig);
    this.clearCache();
  }

  /**
   * Export validation configuration
   */
  exportValidationConfig(): any {
    return {
      layoutId: this.layoutConfig.layoutId,
      globalRules: this.layoutConfig.sequentialRules.globalRules,
      columnRestrictions: this.layoutConfig.sequentialRules.columnRestrictions,
      passageCount: this.layoutConfig.passages.length,
      totalBooths: this.layoutConfig.metadata.totalBooths,
      cacheStats: this.getCacheStats()
    };
  }
}
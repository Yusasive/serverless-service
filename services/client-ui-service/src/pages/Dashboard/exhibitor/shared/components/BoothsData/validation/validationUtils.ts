// components/BoothsData/validation/validationUtils.ts

import { ValidationResult, ValidationContext } from '../types/validation.types';
import { LayoutConfig } from '../types/layout.types';
import { SequentialBookingValidator } from './SequentialBookingValidator';

/**
 * Factory for creating validators
 */
export class ValidatorFactory {
  private static validators: Map<string, SequentialBookingValidator> = new Map();

  static getValidator(layoutConfig: LayoutConfig): SequentialBookingValidator {
    const key = layoutConfig.layoutId;
    
    if (!this.validators.has(key)) {
      this.validators.set(key, new SequentialBookingValidator(layoutConfig));
    }

    return this.validators.get(key)!;
  }

  static clearValidators(): void {
    this.validators.clear();
  }

  static updateValidator(layoutConfig: LayoutConfig): void {
    const validator = this.validators.get(layoutConfig.layoutId);
    if (validator) {
      validator.updateLayout(layoutConfig);
    } else {
      this.validators.set(layoutConfig.layoutId, new SequentialBookingValidator(layoutConfig));
    }
  }

  static getValidatorStats(): { [layoutId: string]: any } {
    const stats: { [layoutId: string]: any } = {};
    
    this.validators.forEach((validator, layoutId) => {
      stats[layoutId] = validator.exportValidationConfig();
    });
    
    return stats;
  }
}

/**
 * Validation helper functions
 */
export class ValidationHelpers {
  
  /**
   * Create a validation context from basic parameters
   */
  static createContext(
    currentSelections: string[],
    proposedBooth: string,
    layoutConfig: LayoutConfig,
    options: {
      validationMode?: 'strict' | 'lenient' | 'preview' | 'admin';
      userPreferences?: any;
    } = {}
  ): ValidationContext {
    return {
      currentSelections,
      proposedBooth,
      layoutConfig,
      validationMode: options.validationMode || 'strict',
      userPreferences: options.userPreferences
    };
  }

  /**
   * Merge multiple validation results
   */
  static mergeValidationResults(results: ValidationResult[]): ValidationResult {
    if (results.length === 0) {
      return { isValid: true, message: 'No validations to merge' };
    }

    if (results.length === 1) {
      return results[0];
    }

    const allValid = results.every(r => r.isValid);
    const allErrors = results.flatMap(r => r.errors || []);
    const allWarnings = results.flatMap(r => r.warnings || []);
    const allSuggestions = results.flatMap(r => r.suggestions || []);

    // const messages = results.map(r => r.message).filter(Boolean);

    return {
      isValid: allValid,
      message: allValid ? 'All validations passed' : 'Some validations failed',
      errors: allErrors.length > 0 ? allErrors : undefined,
      warnings: allWarnings.length > 0 ? allWarnings : undefined,
      suggestions: allSuggestions.length > 0 ? allSuggestions : undefined
    };
  }

  /**
   * Format validation result for user display
   */
  static formatValidationMessage(result: ValidationResult): {
    title: string;
    message: string;
    type: 'success' | 'error' | 'warning' | 'info';
    actionable: boolean;
    suggestions?: string[];
  } {
    if (result.isValid) {
      return {
        title: 'Selection Valid',
        message: result.message,
        type: 'success',
        actionable: false
      };
    }

    const primaryError = result.errors?.[0];
    if (!primaryError) {
      return {
        title: 'Validation Issue',
        message: result.message,
        type: 'warning',
        actionable: false
      };
    }

    let title = 'Selection Invalid';
    let type: 'error' | 'warning' = 'error';

    switch (primaryError.code) {
      case 'CROSS_COLUMN_SELECTION':
        title = 'Column Restriction';
        break;
      case 'PASSAGE_BOUNDARY_VIOLATION':
        title = 'Passage Blocked';
        break;
      case 'NON_SEQUENTIAL_SELECTION':
        title = 'Not Adjacent';
        break;
      case 'SPECIAL_BOOTH_VIOLATION':
        title = 'Special Booth Rule';
        break;
      case 'MAXIMUM_SELECTION_EXCEEDED':
        title = 'Maximum Reached';
        break;
      default:
        title = 'Selection Error';
    }

    const suggestions = result.suggestions?.flatMap(s => 
      s.suggestedBooths?.map(booth => `Try booth ${booth}`) || [s.message]
    );

    return {
      title,
      message: primaryError.message,
      type,
      actionable: !!(suggestions && suggestions.length > 0),
      suggestions
    };
  }

  /**
   * Generate user-friendly error messages
   */
  static generateUserMessage(
    boothId: string,
    // currentSelections: string[],
    validationResult: ValidationResult
  ): string {
    if (validationResult.isValid) {
      return `Booth ${boothId} has been added to your selection.`;
    }

    const error = validationResult.errors?.[0];
    if (!error) {
      return `Cannot select booth ${boothId}. Please try a different booth.`;
    }

    switch (error.code) {
      case 'CROSS_COLUMN_SELECTION':
        return `Cannot select booth ${boothId} because it's in a different column section. You can only book booths within the same column group.`;
      
      case 'PASSAGE_BOUNDARY_VIOLATION':
        return `Cannot select booth ${boothId} because it's separated by a passage/door from your current selections. Try selecting booths within the same section.`;
      
      case 'NON_SEQUENTIAL_SELECTION':
        return `Cannot select booth ${boothId} because it's not adjacent to your current selections. Please select an adjacent booth to maintain sequential booking.`;
      
      case 'SPECIAL_BOOTH_VIOLATION':
        return `Cannot select booth ${boothId} because it's a special booth that cannot be combined with other selections.`;
      
      case 'MAXIMUM_SELECTION_EXCEEDED':
        return `Cannot select booth ${boothId} because you've reached the maximum number of booths allowed in this section.`;
      
      default:
        return `Cannot select booth ${boothId}. ${error.message}`;
    }
  }

  /**
   * Check if a validation error is recoverable
   */
  static isRecoverableError(validationResult: ValidationResult): boolean {
    if (validationResult.isValid) return true;

    const hasRecoverableCodes = validationResult.errors?.some(error => [
      'NON_SEQUENTIAL_SELECTION',
      'PASSAGE_BOUNDARY_VIOLATION'
    ].includes(error.code));

    const hasSuggestions = validationResult.suggestions && 
      validationResult.suggestions.length > 0;

    return (hasRecoverableCodes ?? false) || (hasSuggestions ?? false);
  }

  /**
   * Extract actionable suggestions from validation result
   */
  static extractSuggestions(validationResult: ValidationResult): {
    alternatives: string[];
    fixes: string[];
    optimizations: string[];
  } {
    const alternatives: string[] = [];
    const fixes: string[] = [];
    const optimizations: string[] = [];

    if (!validationResult.suggestions) {
      return { alternatives, fixes, optimizations };
    }

    validationResult.suggestions.forEach(suggestion => {
      switch (suggestion.type) {
        case 'alternative':
          alternatives.push(...(suggestion.suggestedBooths || [suggestion.message]));
          break;
        case 'fix':
          fixes.push(suggestion.message);
          break;
        case 'optimization':
          optimizations.push(suggestion.message);
          break;
      }
    });

    return { alternatives, fixes, optimizations };
  }

  /**
   * Validate booth ID format
   */
  static isValidBoothId(boothId: string): boolean {
    // Basic booth ID validation (N001, S009, etc.)
    const boothIdPattern = /^[A-Z]\d{3}$/;
    return boothIdPattern.test(boothId);
  }

  /**
   * Parse booth ID components
   */
  static parseBoothId(boothId: string): {
    prefix: string;
    number: number;
    isValid: boolean;
  } {
    if (!this.isValidBoothId(boothId)) {
      return { prefix: '', number: 0, isValid: false };
    }

    const prefix = boothId.charAt(0);
    const number = parseInt(boothId.substring(1), 10);

    return { prefix, number, isValid: true };
  }

  /**
   * Sort booth IDs naturally
   */
  static sortBoothIds(boothIds: string[]): string[] {
    return boothIds.sort((a, b) => {
      const parseA = this.parseBoothId(a);
      const parseB = this.parseBoothId(b);

      if (!parseA.isValid || !parseB.isValid) {
        return a.localeCompare(b);
      }

      // Sort by prefix first, then by number
      if (parseA.prefix !== parseB.prefix) {
        return parseA.prefix.localeCompare(parseB.prefix);
      }

      return parseA.number - parseB.number;
    });
  }

  /**
   * Group booth IDs by prefix
   */
  static groupBoothsByPrefix(boothIds: string[]): { [prefix: string]: string[] } {
    const grouped: { [prefix: string]: string[] } = {};

    boothIds.forEach(boothId => {
      const parsed = this.parseBoothId(boothId);
      if (parsed.isValid) {
        if (!grouped[parsed.prefix]) {
          grouped[parsed.prefix] = [];
        }
        grouped[parsed.prefix].push(boothId);
      }
    });

    // Sort each group
    Object.keys(grouped).forEach(prefix => {
      grouped[prefix] = this.sortBoothIds(grouped[prefix]);
    });

    return grouped;
  }

  /**
   * Find booth ID range
   */
  static findBoothRange(boothIds: string[]): {
    start: string;
    end: string;
    count: number;
    hasGaps: boolean;
    gaps: string[];
  } {
    if (boothIds.length === 0) {
      return { start: '', end: '', count: 0, hasGaps: false, gaps: [] };
    }

    const sorted = this.sortBoothIds(boothIds);
    const start = sorted[0];
    const end = sorted[sorted.length - 1];

    // Check for gaps within the same prefix
    const grouped = this.groupBoothsByPrefix(boothIds);
    const gaps: string[] = [];
    let hasGaps = false;

    Object.entries(grouped).forEach(([prefix, booths]) => {
      if (booths.length < 2) return;

      const numbers = booths.map(booth => this.parseBoothId(booth).number).sort((a, b) => a - b);
      
      for (let i = 1; i < numbers.length; i++) {
        let expectedNumber = numbers[i - 1] + 1;
        while (expectedNumber < numbers[i]) {
          const missingBooth = prefix + expectedNumber.toString().padStart(3, '0');
          gaps.push(missingBooth);
          hasGaps = true;
          expectedNumber++;
        }
      }
    });

    return {
      start,
      end,
      count: boothIds.length,
      hasGaps,
      gaps: this.sortBoothIds(gaps)
    };
  }

  /**
   * Calculate selection efficiency metrics
   */
  static calculateSelectionMetrics(
    selections: string[],
    layoutConfig: LayoutConfig
  ): {
    compactness: number;
    continuity: number;
    efficiency: number;
    coverage: number;
  } {
    if (selections.length === 0) {
      return { compactness: 0, continuity: 0, efficiency: 0, coverage: 0 };
    }

    const totalBooths = layoutConfig.metadata.totalBooths;
    
    // Coverage: percentage of total booths selected
    const coverage = selections.length / totalBooths;

    // Compactness: how clustered the selections are
    const range = this.findBoothRange(selections);
    const compactness = range.hasGaps ? 
      selections.length / (range.count + range.gaps.length) : 1.0;

    // Continuity: how sequential the selections are
    const continuity = range.hasGaps ? 
      1 - (range.gaps.length / selections.length) : 1.0;

    // Efficiency: overall selection quality
    const efficiency = (compactness + continuity) / 2;

    return {
      compactness: Math.round(compactness * 100) / 100,
      continuity: Math.round(continuity * 100) / 100,
      efficiency: Math.round(efficiency * 100) / 100,
      coverage: Math.round(coverage * 100) / 100
    };
  }
}

/**
 * Performance monitoring utilities
 */
export class ValidationPerformance {
  private static metrics: {
    totalValidations: number;
    totalTime: number;
    averageTime: number;
    slowestValidation: number;
    fastestValidation: number;
    errorRate: number;
    errors: number;
  } = {
    totalValidations: 0,
    totalTime: 0,
    averageTime: 0,
    slowestValidation: 0,
    fastestValidation: Infinity,
    errorRate: 0,
    errors: 0
  };

  static recordValidation(duration: number, hasError: boolean): void {
    this.metrics.totalValidations++;
    this.metrics.totalTime += duration;
    
    if (hasError) {
      this.metrics.errors++;
    }

    this.metrics.averageTime = this.metrics.totalTime / this.metrics.totalValidations;
    this.metrics.slowestValidation = Math.max(this.metrics.slowestValidation, duration);
    this.metrics.fastestValidation = Math.min(this.metrics.fastestValidation, duration);
    this.metrics.errorRate = this.metrics.errors / this.metrics.totalValidations;
  }

  static getMetrics() {
    return { ...this.metrics };
  }

  static resetMetrics(): void {
    this.metrics = {
      totalValidations: 0,
      totalTime: 0,
      averageTime: 0,
      slowestValidation: 0,
      fastestValidation: Infinity,
      errorRate: 0,
      errors: 0
    };
  }

  static isPerformanceAcceptable(): boolean {
    return this.metrics.averageTime < 50 && // Less than 50ms average
           this.metrics.errorRate < 0.05;     // Less than 5% error rate
  }
}

/**
 * Debug utilities for validation
 */
export class ValidationDebug {
  private static debugMode = false;
  private static logs: string[] = [];

  static enable(): void {
    this.debugMode = true;
  }

  static disable(): void {
    this.debugMode = false;
  }

  static log(message: string, data?: any): void {
    if (!this.debugMode) return;

    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] ${message}`;
    
    console.debug(logMessage, data);
    this.logs.push(logMessage);

    // Keep only last 100 logs
    if (this.logs.length > 100) {
      this.logs.shift();
    }
  }

  static getLogs(): string[] {
    return [...this.logs];
  }

  static clearLogs(): void {
    this.logs = [];
  }

  static exportDebugInfo(validator: SequentialBookingValidator): any {
    return {
      debugMode: this.debugMode,
      logs: this.logs,
      performance: ValidationPerformance.getMetrics(),
      validatorConfig: validator.exportValidationConfig(),
      timestamp: new Date().toISOString()
    };
  }
}
// hooks/useValidationEngine.ts - React Hook for Validation Integration

import { useState, useCallback, useEffect, useMemo } from 'react';
import { SequentialBookingValidator } from '../components/BoothsData/validation/SequentialBookingValidator';
import { ValidatorFactory, ValidationHelpers } from '../components/BoothsData/validation/validationUtils';
import { ValidationResult, ValidationState } from '../components/BoothsData/types/validation.types';
import { LayoutConfig } from '../components/BoothsData/types/layout.types';
import { getLayoutConfigByName } from '../components/BoothsData/layouts/layoutRegistry';

interface UseValidationEngineProps {
  locationName: string;
  validationMode?: 'strict' | 'lenient' | 'preview' | 'admin';
  enableRealTimeValidation?: boolean;
  enableSmartSuggestions?: boolean;
}

interface UseValidationEngineReturn {
  // Validation functions
  validateBoothSelection: (currentSelections: string[], proposedBooth: string) => ValidationResult;
  validateBatchSelection: () => ValidationResult;
  
  // State management
  validationState: ValidationState | null;
  isValidating: boolean;
  lastValidationResult: ValidationResult | null;
  
  // Smart suggestions
  getValidNextBooths: (currentSelections: string[]) => string[];
  getSuggestedBooths: (currentSelections: string[]) => string[];
  getBlockedBooths: (currentSelections: string[]) => string[];
  
  // Analysis
  getSelectionAnalysis: () => any;
  getValidationSummary: (selections: string[]) => any;
  
  // Error handling
  getFormattedError: (validationResult: ValidationResult) => any;
  getUserMessage: (boothId: string, selections: string[], result: ValidationResult) => string;
  
  // Configuration
  layoutConfig: LayoutConfig | null;
  isConfigured: boolean;
  configurationError: string | null;
}

export function useValidationEngine({
  locationName,
  validationMode = 'strict',
  enableRealTimeValidation = true,
  enableSmartSuggestions = true
}: UseValidationEngineProps): UseValidationEngineReturn {
  
  // State
  const [validationState, setValidationState] = useState<ValidationState | null>(null);
  const [isValidating, setIsValidating] = useState(false);
  const [lastValidationResult, setLastValidationResult] = useState<ValidationResult | null>(null);
  const [configurationError, setConfigurationError] = useState<string | null>(null);

  // Get layout configuration
  const layoutConfig = useMemo(() => {
    try {
      const config = getLayoutConfigByName(locationName);
      if (!config) {
        setConfigurationError(`No layout configuration found for ${locationName}`);
        return null;
      }
      setConfigurationError(null);
      return config;
    } catch (error) {
      setConfigurationError(`Failed to load layout configuration: ${error}`);
      return null;
    }
  }, [locationName]);

  // Get validator instance
const validator = useMemo(() => {
  if (!layoutConfig) {
    console.log('❌ [VALIDATOR CREATION] No layout config');
    return null;
  }
  
  try {
    console.log('✅ [VALIDATOR CREATION] Creating validator for:', layoutConfig.layoutName);
    const newValidator = ValidatorFactory.getValidator(layoutConfig);
    console.log('✅ [VALIDATOR CREATION] Validator created successfully');
    return newValidator;
  } catch (error) {
    console.error('❌ [VALIDATOR CREATION] Failed to create validator:', error);
    setConfigurationError(`Failed to create validator: ${error}`);
    return null;
  }
}, [layoutConfig]);

  // Configuration status
  const isConfigured = useMemo(() => {
    return !!(layoutConfig && validator && !configurationError);
  }, [layoutConfig, validator, configurationError]);

  // Validate booth selection
  const validateBoothSelection = useCallback((
    currentSelections: string[], 
    proposedBooth: string
  ): ValidationResult => {
    if (!validator || !layoutConfig) {
      return {
        isValid: false,
        message: 'Validation engine not configured',
        errors: [{
          code: 'CONFIGURATION_ERROR',
          message: configurationError || 'Validator not available',
          affectedBooths: [proposedBooth],
          severity: 'error'
        }]
      };
    }

    setIsValidating(true);
    
    try {
      const context = ValidationHelpers.createContext(
        currentSelections,
        proposedBooth,
        layoutConfig,
        { validationMode }
      );

      const result = validator.validateSelection(context);
      setLastValidationResult(result);
      
      return result;
    } catch (error) {
      const errorResult: ValidationResult = {
        isValid: false,
        message: `Validation failed: ${error}`,
        errors: [{
          code: 'VALIDATION_EXCEPTION',
          message: `Unexpected error during validation: ${error}`,
          affectedBooths: [proposedBooth],
          severity: 'error'
        }]
      };
      
      setLastValidationResult(errorResult);
      return errorResult;
    } finally {
      setIsValidating(false);
    }
  }, [validator, layoutConfig, validationMode, configurationError]);

  // Validate batch selection
  const validateBatchSelection = useCallback((): ValidationResult => {
    if (!validator || !layoutConfig) {
      return {
        isValid: false,
        message: 'Validation engine not configured'
      };
    }

    setIsValidating(true);

    try {
      // You may need to provide selections from another source if required
      const batchResult = validator.validateBatch({
        selections: [],
        layoutId: layoutConfig.layoutId,
        validationMode,
        stopOnFirstError: false
      });

      setLastValidationResult(batchResult.combinedResult);
      return batchResult.combinedResult;
    } catch (error) {
      const errorResult: ValidationResult = {
        isValid: false,
        message: `Batch validation failed: ${error}`
      };
      
      setLastValidationResult(errorResult);
      return errorResult;
    } finally {
      setIsValidating(false);
    }
  }, [validator, layoutConfig, validationMode]);

  // Get valid next booths
// In useValidationEngine.ts, update the getValidNextBooths function:

const getValidNextBooths = useCallback((currentSelections: string[]): string[] => {
  console.log('\n🔧 [VALIDATION ENGINE] getValidNextBooths called');
  console.log('Input selections:', currentSelections);
  console.log('Validator exists?', !!validator);
  console.log('Is configured?', isConfigured);
  
  if (!validator) {
    console.error('❌ No validator available');
    return [];
  }
  
  try {
    const validBooths = validator.getValidNextBooths(currentSelections);
    console.log('✅ Valid next booths from validator:', validBooths);
    console.log('✅ Valid booths count:', validBooths.length);
    
    // Double-check the result
    if (currentSelections.includes('S029')) {
      console.log('✅ S029 is selected, checking connections...');
      const connections = layoutConfig?.sequentialRules?.allowedConnections?.['S029'];
      console.log('✅ S029 allowed connections from config:', connections);
    }
    
    return validBooths;
  } catch (error) {
    console.error('❌ Error getting valid next booths:', error);
    return [];
  }
}, [validator, isConfigured, layoutConfig]);

  // Get suggested booths (smart suggestions)
  const getSuggestedBooths = useCallback((currentSelections: string[]): string[] => {
    if (!enableSmartSuggestions || !validator) return [];
    
    try {
      const validBooths = validator.getValidNextBooths(currentSelections);
      // const analysis = validator.getSelectionAnalysis(currentSelections);
      
      // Filter for optimal suggestions based on analysis
      return validBooths.filter(() => {
        // Add logic for smart filtering based on:
        // - Continuity improvement
        // - Pattern consistency
        // - Efficiency optimization  
        return true; // Simplified for now
      }).slice(0, 5); // Limit to top 5 suggestions
    } catch (error) {
      console.error('Error getting suggested booths:', error);
      return [];
    }
  }, [enableSmartSuggestions, validator]);

  // Get blocked booths
// In useValidationEngine.ts, replace the getBlockedBooths function:

// In useValidationEngine.ts, replace the getBlockedBooths function:

const getBlockedBooths = useCallback((currentSelections: string[]): string[] => {
  console.log('\n🔧 [VALIDATION ENGINE] getBlockedBooths called');
  console.log('Input selections:', currentSelections);
  
  if (!validator || !layoutConfig) {
    console.error('❌ No validator or layoutConfig available');
    return [];
  }
  
  try {
    // Get all booths in the layout
    const allBooths = layoutConfig.columns.flatMap(col => col.boothRange);
    
    // Get valid next booths
    const validNext = validator.getValidNextBooths(currentSelections);
    const validNextSet = new Set(validNext);
    
    console.log('All booths count:', allBooths.length);
    console.log('Valid next booths:', validNext);
    
    // Block ONLY booths that are:
    // 1. NOT in current selections
    // 2. NOT in valid next booths
    const blocked = allBooths.filter(booth => 
      !currentSelections.includes(booth) && !validNextSet.has(booth)
    );
    
    console.log('Blocked booths count:', blocked.length);
    console.log('Is S028 in validNext?', validNextSet.has('S028'));
    console.log('Is S042 in validNext?', validNextSet.has('S042'));
    console.log('Is S028 blocked?', blocked.includes('S028'));
    console.log('Is S042 blocked?', blocked.includes('S042'));
    
    return blocked;
  } catch (error) {
    console.error('❌ Error getting blocked booths:', error);
    return [];
  }
}, [validator, layoutConfig]);

  // Get selection analysis
  const getSelectionAnalysis = useCallback(() => {
    if (!validator) return null;
    
    try {
      // You may want to pass selections from another source if needed
      return validator.getSelectionAnalysis([]);
    } catch (error) {
      console.error('Error getting selection analysis:', error);
      return null;
    }
  }, [validator]);

  // Get validation summary
  const getValidationSummary = useCallback((selections: string[]) => {
    if (!validator || !layoutConfig) return null;
    
    try {
      const analysis = validator.getSelectionAnalysis(selections);
      const metrics = ValidationHelpers.calculateSelectionMetrics(selections, layoutConfig);
      
      return {
        ...analysis,
        metrics,
        totalBooths: selections.length,
        layoutName: layoutConfig.layoutName,
        locationType: layoutConfig.locationType
      };
    } catch (error) {
      console.error('Error getting validation summary:', error);
      return null;
    }
  }, [validator, layoutConfig]);

  // Get formatted error
  const getFormattedError = useCallback((validationResult: ValidationResult) => {
    return ValidationHelpers.formatValidationMessage(validationResult);
  }, []);

  // Get user message
const getUserMessage = useCallback((
  boothId: string, 
  _selections: string[], // Prefix with _ to indicate intentionally unused
  result: ValidationResult
): string => {
  return ValidationHelpers.generateUserMessage(boothId, result);
}, []);

  // Update validation state when real-time validation is enabled
  useEffect(() => {
    if (!enableRealTimeValidation || !validator) return;

    // This would be triggered by selection changes in the parent component
    // For now, we'll just ensure the state is initialized
    if (validationState === null) {
      setValidationState({
        isValidating: false,
        validBooths: new Set(),
        invalidBooths: new Set(),
        suggestedBooths: new Set(),
        blockedBooths: new Set(),
        lastUpdated: Date.now()
      });
    }
  }, [enableRealTimeValidation, validator, validationState]);

  return {
    // Validation functions
    validateBoothSelection,
    validateBatchSelection,
    
    // State management
    validationState,
    isValidating,
    lastValidationResult,
    
    // Smart suggestions
    getValidNextBooths,
    getSuggestedBooths,
    getBlockedBooths,
    
    // Analysis
    getSelectionAnalysis,
    getValidationSummary,
    
    // Error handling
    getFormattedError,
    getUserMessage,
    
    // Configuration
    layoutConfig,
    isConfigured,
    configurationError
  };
}

// Convenience hook for Hall A specifically
export function useHallAValidation(options: Omit<UseValidationEngineProps, 'locationName'> = {}) {
  return useValidationEngine({
    locationName: 'Hall A',
    ...options
  });
}

// Hook for testing validation rules
export function useValidationTester(layoutConfig: LayoutConfig) {
  const validator = useMemo(() => {
    return new SequentialBookingValidator(layoutConfig);
  }, [layoutConfig]);

  const testScenario = useCallback((
    scenario: {
      name: string;
      selections: string[];
      expectedValid: boolean;
      expectedErrorCodes?: string[];
    }
  ) => {
    const results: any[] = [];
    
    // Test each selection incrementally
    for (let i = 0; i < scenario.selections.length; i++) {
      const currentSelections = scenario.selections.slice(0, i);
      const proposedBooth = scenario.selections[i];
      
      const context = ValidationHelpers.createContext(
        currentSelections,
        proposedBooth,
        layoutConfig
      );

      const result = validator.validateSelection(context);
      
      results.push({
        step: i + 1,
        booth: proposedBooth,
        result,
        passed: result.isValid === scenario.expectedValid
      });
    }

    return {
      scenario: scenario.name,
      totalSteps: results.length,
      passed: results.every(r => r.passed),
      results
    };
  }, [validator, layoutConfig]);

  return {
    validator,
    testScenario
  };
}
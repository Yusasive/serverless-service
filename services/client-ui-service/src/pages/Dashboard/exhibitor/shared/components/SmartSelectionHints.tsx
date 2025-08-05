// components/SmartSelectionHints.tsx - Intelligent Selection Guidance

import React, { useMemo, useState } from 'react';
import { CheckCircle, AlertTriangle, Info, X, ChevronUp, ChevronDown, Lightbulb } from 'lucide-react';

interface SmartSelectionHintsProps {
  currentSelections: string[];
  validNextBooths: string[];
  suggestedBooths: string[];
  selectionAnalysis: any;
  validationSummary: any;
  lastValidationResult: any;
  onBoothSuggestionClick?: (boothId: string) => void;
  onOptimizationClick?: (action: string) => void;
  onDismiss?: () => void;
  showAdvancedHints?: boolean;
  position?: 'top' | 'bottom' | 'side';
}

interface HintData {
  type: 'success' | 'warning' | 'info' | 'error' | 'suggestion';
  title: string;
  message: string;
  priority: number;
  actionable: boolean;
  actions?: HintAction[];
  details?: string[];
}

interface HintAction {
  label: string;
  type: 'booth-suggestion' | 'optimization' | 'information';
  data: any;
  variant: 'primary' | 'secondary' | 'outline';
}

const SmartSelectionHints: React.FC<SmartSelectionHintsProps> = ({
  currentSelections,
  validNextBooths,
  suggestedBooths,
  selectionAnalysis,
  validationSummary,
  lastValidationResult,
  onBoothSuggestionClick,
  onOptimizationClick,
  onDismiss,
  showAdvancedHints = true,
  position = 'bottom'
}) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [dismissedHints, setDismissedHints] = useState<Set<string>>(new Set());

  // Generate intelligent hints based on current state
  const hints = useMemo(() => {
    return generateSmartHints({
      currentSelections,
      validNextBooths,
      suggestedBooths,
      selectionAnalysis,
      validationSummary,
      lastValidationResult,
      showAdvancedHints
    });
  }, [currentSelections, validNextBooths, suggestedBooths, selectionAnalysis, validationSummary, lastValidationResult, showAdvancedHints]);

  // Filter out dismissed hints and sort by priority
  const activeHints = useMemo(() => {
    return hints
      .filter(hint => !dismissedHints.has(hint.title))
      .sort((a, b) => b.priority - a.priority)
      .slice(0, showAdvancedHints ? 5 : 3); // Limit number of hints shown
  }, [hints, dismissedHints, showAdvancedHints]);

  // Handle hint dismissal
  const dismissHint = (hintTitle: string) => {
    setDismissedHints(prev => new Set([...prev, hintTitle]));
  };

  // Handle action clicks
  const handleActionClick = (action: HintAction) => {
    switch (action.type) {
      case 'booth-suggestion':
        onBoothSuggestionClick?.(action.data.boothId);
        break;
      case 'optimization':
        onOptimizationClick?.(action.data.action);
        break;
      case 'information':
        // Could open a modal with more information
        break;
    }
  };

  // Don't render if no hints or all dismissed
  if (activeHints.length === 0) {
    return null;
  }

  const containerClasses = `
    smart-hints-container
    ${position === 'side' ? 'fixed right-4 top-1/2 transform -translate-y-1/2 w-80' : ''}
    ${position === 'top' ? 'mb-4' : ''}
    ${position === 'bottom' ? 'mt-4' : ''}
  `;

  return (
    <div className={containerClasses}>
      <div className="bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-4 py-3 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Lightbulb size={18} className="text-blue-600" />
              <h4 className="text-sm font-semibold text-gray-800">
                Smart Selection Assistant
              </h4>
              {activeHints.some(h => h.type === 'error') && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                  Issues Found
                </span>
              )}
              {activeHints.some(h => h.type === 'suggestion') && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                  Suggestions
                </span>
              )}
            </div>
            <div className="flex items-center space-x-1">
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
              >
                {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>
              {onDismiss && (
                <button
                  onClick={onDismiss}
                  className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X size={16} />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Content */}
        {isExpanded && (
          <div className="max-h-96 overflow-y-auto">
            <div className="p-4 space-y-3">
              {activeHints.map((hint) => (
                <HintCard
                  key={hint.title}
                  hint={hint}
                  onActionClick={handleActionClick}
                  onDismiss={() => dismissHint(hint.title)}
                  showDismiss={activeHints.length > 1}
                />
              ))}
            </div>

            {/* Selection Summary */}
            {currentSelections.length > 0 && (
              <div className="border-t border-gray-100 bg-gray-50 px-4 py-3">
                <div className="text-xs text-gray-600">
                  <strong>Current Selection:</strong> {currentSelections.length} booth{currentSelections.length !== 1 ? 's' : ''} selected
                  {validNextBooths.length > 0 && (
                    <span className="ml-2">• {validNextBooths.length} valid next option{validNextBooths.length !== 1 ? 's' : ''}</span>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// Individual hint card component
const HintCard: React.FC<{
  hint: HintData;
  onActionClick: (action: HintAction) => void;
  onDismiss: () => void;
  showDismiss: boolean;
}> = ({ hint, onActionClick, onDismiss, showDismiss }) => {
  const [showDetails, setShowDetails] = useState(false);

  const getHintIcon = () => {
    switch (hint.type) {
      case 'success':
        return <CheckCircle size={16} className="text-green-600" />;
      case 'warning':
        return <AlertTriangle size={16} className="text-yellow-600" />;
      case 'error':
        return <AlertTriangle size={16} className="text-red-600" />;
      case 'suggestion':
        return <Lightbulb size={16} className="text-blue-600" />;
      default:
        return <Info size={16} className="text-blue-600" />;
    }
  };

  const getHintClasses = () => {
    const baseClasses = "border rounded-lg p-3 transition-all duration-200";
    switch (hint.type) {
      case 'success':
        return `${baseClasses} border-green-200 bg-green-50`;
      case 'warning':
        return `${baseClasses} border-yellow-200 bg-yellow-50`;
      case 'error':
        return `${baseClasses} border-red-200 bg-red-50`;
      case 'suggestion':
        return `${baseClasses} border-blue-200 bg-blue-50`;
      default:
        return `${baseClasses} border-gray-200 bg-gray-50`;
    }
  };

  return (
    <div className={getHintClasses()}>
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0 mt-0.5">
          {getHintIcon()}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h5 className="text-sm font-medium text-gray-900">
                {hint.title}
              </h5>
              <p className="text-sm text-gray-600 mt-1">
                {hint.message}
              </p>
            </div>
            {showDismiss && (
              <button
                onClick={onDismiss}
                className="ml-2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Details */}
          {hint.details && hint.details.length > 0 && (
            <div className="mt-2">
              <button
                onClick={() => setShowDetails(!showDetails)}
                className="text-xs text-blue-600 hover:text-blue-800 transition-colors"
              >
                {showDetails ? 'Hide details' : 'Show details'}
              </button>
              {showDetails && (
                <ul className="mt-2 text-xs text-gray-600 space-y-1 pl-3">
                  {hint.details.map((detail, index) => (
                    <li key={index} className="flex items-start">
                      <span className="inline-block w-1 h-1 bg-gray-400 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                      {detail}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}

          {/* Actions */}
          {hint.actions && hint.actions.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {hint.actions.map((action, index) => (
                <button
                  key={index}
                  onClick={() => onActionClick(action)}
                  className={getActionClasses(action.variant)}
                >
                  {action.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Helper functions

function generateSmartHints({
  currentSelections,
  validNextBooths,
  suggestedBooths,
  selectionAnalysis,
  // validationSummary,
  lastValidationResult,
  showAdvancedHints
}: any): HintData[] {
  const hints: HintData[] = [];

  // No selections yet
  if (currentSelections.length === 0) {
    hints.push({
      type: 'info',
      title: 'Start Your Selection',
      message: 'Click on any available booth to begin your selection. Special booths (marked with "S") have different pricing.',
      priority: 10,
      actionable: false
    });
    return hints;
  }

  // Validation errors
  if (lastValidationResult && !lastValidationResult.isValid) {
    const error = lastValidationResult.errors?.[0];
    if (error) {
      hints.push({
        type: 'error',
        title: getErrorTitle(error.code),
        message: error.message,
        priority: 100,
        actionable: true,
        actions: generateErrorActions(error, suggestedBooths)
      });
    }
  }

  // Selection analysis hints
  if (selectionAnalysis && showAdvancedHints) {
    // Column restriction warnings
    if (selectionAnalysis.columnAnalysis?.maxSelectionsReached) {
      hints.push({
        type: 'warning',
        title: 'Maximum Booths Reached',
        message: 'You\'ve reached the maximum number of booths for this column group.',
        priority: 80,
        actionable: false
      });
    }

    // Passage crossing risks
    if (selectionAnalysis.passageAnalysis?.crossingRisk === 'high') {
      hints.push({
        type: 'warning',
        title: 'Passage Crossing Risk',
        message: 'Your selections are spread across multiple sections separated by passages.',
        priority: 70,
        actionable: true,
        details: [
          'Consider consolidating your selection within one section',
          'Crossing passages may limit future selection options'
        ]
      });
    }

    // Continuity suggestions
    if (selectionAnalysis.sequentialAnalysis?.continuity?.gaps?.length > 0) {
      const gaps = selectionAnalysis.sequentialAnalysis.continuity.gaps;
      hints.push({
        type: 'suggestion',
        title: 'Fill Selection Gaps',
        message: `Consider selecting booth${gaps.length > 1 ? 's' : ''} ${gaps.slice(0, 3).join(', ')} to improve continuity.`,
        priority: 60,
        actionable: true,
        actions: gaps.slice(0, 2).map((boothId: string) => ({
          label: `Select ${boothId}`,
          type: 'booth-suggestion',
          data: { boothId },
          variant: 'outline'
        }))
      });
    }

    // Efficiency improvements
    if (selectionAnalysis.sequentialAnalysis?.pathEfficiency < 0.7) {
      hints.push({
        type: 'suggestion',
        title: 'Optimize Selection Path',
        message: 'Your current selection path could be more efficient.',
        priority: 40,
        actionable: true,
        details: [
          'Consider selecting adjacent booths for better arrangement',
          'More efficient paths may reduce setup costs'
        ]
      });
    }
  }

  // Smart suggestions
  if (suggestedBooths.length > 0) {
    hints.push({
      type: 'suggestion',
      title: 'Recommended Next Selections',
      message: `We recommend booth${suggestedBooths.length > 1 ? 's' : ''} ${suggestedBooths.slice(0, 3).join(', ')} based on your current selection.`,
      priority: 50,
      actionable: true,
      actions: suggestedBooths.slice(0, 3).map((boothId: string) => ({
        label: `Select ${boothId}`,
        type: 'booth-suggestion',
        data: { boothId },
        variant: 'primary'
      }))
    });
  }

  // Valid options available
  if (validNextBooths.length > 0 && validNextBooths.length <= 5) {
    hints.push({
      type: 'info',
      title: 'Limited Options Remaining',
      message: `Only ${validNextBooths.length} valid booth${validNextBooths.length > 1 ? 's' : ''} available for your next selection.`,
      priority: 30,
      actionable: true,
      details: validNextBooths.map((boothId: string) => `Booth ${boothId} is available`)
    });
  }

  // Success state
  if (currentSelections.length > 0 && validNextBooths.length > 5) {
    hints.push({
      type: 'success',
      title: 'Good Selection Progress',
      message: `You have ${currentSelections.length} booth${currentSelections.length > 1 ? 's' : ''} selected with ${validNextBooths.length} valid options remaining.`,
      priority: 20,
      actionable: false
    });
  }

  return hints;
}

function getErrorTitle(errorCode: string): string {
  const titles: { [key: string]: string } = {
    'CROSS_COLUMN_SELECTION': 'Column Restriction',
    'PASSAGE_BOUNDARY_VIOLATION': 'Passage Blocked',
    'NON_SEQUENTIAL_SELECTION': 'Not Adjacent',
    'SPECIAL_BOOTH_VIOLATION': 'Special Booth Rule',
    'MAXIMUM_SELECTION_EXCEEDED': 'Maximum Reached'
  };

  return titles[errorCode] || 'Selection Error';
}

function generateErrorActions(error: any, suggestedBooths: string[]): HintAction[] {
  const actions: HintAction[] = [];

  if (error.code === 'NON_SEQUENTIAL_SELECTION' && suggestedBooths.length > 0) {
    actions.push(...suggestedBooths.slice(0, 2).map(boothId => ({
      label: `Try ${boothId}`,
      type: 'booth-suggestion' as const,
      data: { boothId },
      variant: 'primary' as const
    })));
  }

  return actions;
}

function getActionClasses(variant: string): string {
  const baseClasses = "px-3 py-1 text-xs font-medium rounded transition-colors";
  
  switch (variant) {
    case 'primary':
      return `${baseClasses} bg-blue-600 text-white hover:bg-blue-700`;
    case 'secondary':
      return `${baseClasses} bg-gray-600 text-white hover:bg-gray-700`;
    case 'outline':
      return `${baseClasses} border border-gray-300 text-gray-700 hover:bg-gray-50`;
    default:
      return baseClasses;
  }
}

export default SmartSelectionHints;
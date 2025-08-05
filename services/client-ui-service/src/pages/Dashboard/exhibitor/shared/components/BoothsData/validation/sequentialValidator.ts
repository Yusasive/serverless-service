// components/BoothsData/validation/sequentialValidator.ts

import { ValidationResult, ValidationContext } from '../types/validation.types';
import { LayoutConfig } from '../types/layout.types';

export class SequentialValidator {
  constructor(private layoutConfig: LayoutConfig) {}

  /**
   * Validate if a booth selection follows sequential adjacency rules
   */
  validateSequentialAdjacency(context: ValidationContext): ValidationResult {
    const { currentSelections, proposedBooth, layoutConfig } = context;
    
    if (currentSelections.length === 0) {
      return {
        isValid: true,
        message: 'First selection - no adjacency requirements'
      };
    }

    // Check if global sequential rules are enforced
    const globalRules = layoutConfig.sequentialRules.globalRules;
    if (!globalRules.enforceStrictAdjacency) {
      return {
        isValid: true,
        message: 'Sequential adjacency not enforced by global rules'
      };
    }

    // Get allowed connections for the proposed booth
    const allowedConnections = layoutConfig.sequentialRules.allowedConnections[proposedBooth] || [];
    
    if (allowedConnections.length === 0) {
      // Special booth with no connections allowed
      if (currentSelections.length > 0) {
        return {
          isValid: false,
          message: `Booth ${proposedBooth} cannot be connected to other booths (isolated booth)`,
          errors: [{
            code: 'SPECIAL_BOOTH_VIOLATION',
            message: `Booth ${proposedBooth} is configured as isolated and cannot be combined with other selections`,
            affectedBooths: [proposedBooth],
            severity: 'error'
          }]
        };
      }
    }

    // Check if proposed booth is adjacent to any current selection
    const hasValidConnection = currentSelections.some(selectedBooth => 
      allowedConnections.includes(selectedBooth)
    );

    if (!hasValidConnection) {
      return {
        isValid: false,
        message: `Booth ${proposedBooth} is not adjacent to any of your current selections`,
        errors: [{
          code: 'NON_SEQUENTIAL_SELECTION',
          message: `Sequential booking required. ${proposedBooth} must be adjacent to at least one currently selected booth.`,
          affectedBooths: [proposedBooth],
          severity: 'error'
        }],
        suggestions: [{
          type: 'alternative',
          message: 'Try selecting one of these adjacent booths instead:',
          suggestedBooths: this.getValidAdjacentBooths(currentSelections)
        }]
      };
    }

    // Validate sequential patterns (row-wise, column-wise, mixed)
    const patternValidation = this.validateSequentialPattern(currentSelections, proposedBooth);
    if (!patternValidation.isValid) {
      return patternValidation;
    }

    // Check for "snake" pattern continuity
    const continuityValidation = this.validateSequentialContinuity([...currentSelections, proposedBooth]);
    if (!continuityValidation.isValid) {
      return continuityValidation;
    }

    return {
      isValid: true,
      message: 'Sequential adjacency validation passed'
    };
  }

  /**
   * Validate sequential booking patterns (row-wise, column-wise, mixed)
   */
  private validateSequentialPattern(currentSelections: string[], proposedBooth: string): ValidationResult {
    const globalRules = this.layoutConfig.sequentialRules.globalRules;
    
    // If all patterns are allowed, no validation needed
    if (globalRules.allowRowWiseBooking && 
        globalRules.allowColumnWiseBooking && 
        globalRules.allowMixedBooking) {
      return { isValid: true, message: 'All booking patterns allowed' };
    }

    const currentPattern = this.detectBookingPattern([...currentSelections, proposedBooth]);
    
    // Check if detected pattern is allowed
    switch (currentPattern.type) {
      case 'row-wise':
        if (!globalRules.allowRowWiseBooking) {
          return {
            isValid: false,
            message: 'Row-wise booking pattern is not allowed in this layout',
            errors: [{
              code: 'SEQUENTIAL_PATTERN_VIOLATION',
              message: 'Row-wise sequential booking is disabled for this layout',
              affectedBooths: [proposedBooth],
              severity: 'error'
            }]
          };
        }
        break;
        
      case 'column-wise':
        if (!globalRules.allowColumnWiseBooking) {
          return {
            isValid: false,
            message: 'Column-wise booking pattern is not allowed in this layout',
            errors: [{
              code: 'SEQUENTIAL_PATTERN_VIOLATION',
              message: 'Column-wise sequential booking is disabled for this layout',
              affectedBooths: [proposedBooth],
              severity: 'error'
            }]
          };
        }
        break;
        
      case 'mixed':
        if (!globalRules.allowMixedBooking) {
          return {
            isValid: false,
            message: 'Mixed booking pattern is not allowed in this layout',
            errors: [{
              code: 'SEQUENTIAL_PATTERN_VIOLATION',
              message: 'Mixed sequential booking patterns are disabled for this layout',
              affectedBooths: [proposedBooth],
              severity: 'error'
            }],
            suggestions: [{
              type: 'fix',
              message: 'Stick to either row-wise or column-wise patterns',
              suggestedBooths: this.getSinglePatternAlternatives(currentSelections)
            }]
          };
        }
        break;
    }

    return { isValid: true, message: `${currentPattern.type} pattern allowed` };
  }

  /**
   * Detect the booking pattern from a sequence of booths
   */
  private detectBookingPattern(booths: string[]): {
    type: 'row-wise' | 'column-wise' | 'mixed' | 'single' | 'unknown';
    confidence: number;
    details: string;
  } {
    if (booths.length <= 1) {
      return { type: 'single', confidence: 1.0, details: 'Single booth or empty selection' };
    }

    const positions = this.getBoothPositions(booths);
    if (positions.length < 2) {
      return { type: 'unknown', confidence: 0, details: 'Cannot determine positions' };
    }

    // Analyze movement patterns
    let rowChanges = 0;
    let columnChanges = 0;
    
    for (let i = 1; i < positions.length; i++) {
      const prev = positions[i - 1];
      const curr = positions[i];
      
      if (prev.row !== curr.row) rowChanges++;
      if (prev.column !== curr.column) columnChanges++;
    }

    // Determine pattern type
    if (rowChanges === 0 && columnChanges > 0) {
      return { 
        type: 'row-wise', 
        confidence: 0.9, 
        details: `Horizontal movement across ${columnChanges} columns` 
      };
    }
    
    if (columnChanges === 0 && rowChanges > 0) {
      return { 
        type: 'column-wise', 
        confidence: 0.9, 
        details: `Vertical movement across ${rowChanges} rows` 
      };
    }
    
    if (rowChanges > 0 && columnChanges > 0) {
      return { 
        type: 'mixed', 
        confidence: 0.8, 
        details: `Mixed pattern: ${rowChanges} row changes, ${columnChanges} column changes` 
      };
    }
    
    return { 
      type: 'single', 
      confidence: 0.7, 
      details: 'All booths in same position (likely same booth)' 
    };
  }

  /**
   * Get booth positions for pattern analysis
   */
  private getBoothPositions(booths: string[]): Array<{booth: string, row: number, column: string}> {
    const positions: Array<{booth: string, row: number, column: string}> = [];
    
    booths.forEach(boothId => {
      const column = this.layoutConfig.columns.find(col => 
        col.boothRange.includes(boothId)
      );
      
      if (column) {
        const rowIndex = column.boothRange.indexOf(boothId);
        positions.push({
          booth: boothId,
          row: rowIndex,
          column: column.columnId
        });
      }
    });
    
    return positions;
  }

  /**
   * Validate sequential continuity (no gaps in the sequence)
   */
  private validateSequentialContinuity(allSelections: string[]): ValidationResult {
    if (allSelections.length <= 2) {
      return { isValid: true, message: 'Continuity check not needed for small selections' };
    }

    // Group booths by column
    const boothsByColumn = this.groupBoothsByColumn(allSelections);
    
    // Check continuity within each column
    for (const [columnId, booths] of Object.entries(boothsByColumn)) {
      const column = this.layoutConfig.columns.find(c => c.columnId === columnId);
      if (!column) continue;
      
      const continuityCheck = this.checkColumnContinuity(booths, column);
      if (!continuityCheck.isValid) {
        return continuityCheck;
      }
    }

    return { isValid: true, message: 'Sequential continuity validated' };
  }

  /**
   * Check continuity within a single column
   */
  private checkColumnContinuity(booths: string[], column: any): ValidationResult {
    if (booths.length <= 1) return { isValid: true, message: 'Single booth in column' };
    
    // Get booth positions within the column
    const positions = booths.map(booth => ({
      booth,
      index: column.boothRange.indexOf(booth)
    })).sort((a, b) => a.index - b.index);
    
    // Check for gaps
    const gaps: string[] = [];
    for (let i = 1; i < positions.length; i++) {
      const gap = positions[i].index - positions[i - 1].index;
      if (gap > 1) {
        // Found a gap - check if there are booths in between that should be selected
        const missingBooths = [];
        for (let j = positions[i - 1].index + 1; j < positions[i].index; j++) {
          missingBooths.push(column.boothRange[j]);
        }
        gaps.push(...missingBooths);
      }
    }
    
    if (gaps.length > 0) {
      return {
        isValid: false,
        message: `Sequential continuity broken in column ${column.columnId}. Missing booths: ${gaps.join(', ')}`,
        warnings: [{
          code: 'SEQUENTIAL_GAP',
          message: `Consider selecting missing booths to maintain continuity: ${gaps.join(', ')}`,
          canProceed: true // Allow gaps but warn user
        }]
      };
    }
    
    return { isValid: true, message: 'Column continuity validated' };
  }

  /**
   * Group booths by their column
   */
  private groupBoothsByColumn(booths: string[]): { [columnId: string]: string[] } {
    const grouped: { [columnId: string]: string[] } = {};
    
    booths.forEach(booth => {
      const column = this.layoutConfig.columns.find(col => 
        col.boothRange.includes(booth)
      );
      
      if (column) {
        if (!grouped[column.columnId]) {
          grouped[column.columnId] = [];
        }
        grouped[column.columnId].push(booth);
      }
    });
    
    return grouped;
  }

  /**
   * Get valid adjacent booths for current selections
   */
  private getValidAdjacentBooths(currentSelections: string[]): string[] {
    const validBooths = new Set<string>();
    
    currentSelections.forEach(selectedBooth => {
      const allowedConnections = this.layoutConfig.sequentialRules.allowedConnections[selectedBooth] || [];
      allowedConnections.forEach(booth => {
        if (!currentSelections.includes(booth)) {
          validBooths.add(booth);
        }
      });
    });
    
    return Array.from(validBooths);
  }

  /**
   * Get alternative booths that maintain single pattern
   */
  private getSinglePatternAlternatives(currentSelections: string[]): string[] {
    if (currentSelections.length === 0) return [];
    
    const lastBooth = currentSelections[currentSelections.length - 1];
    const allowedConnections = this.layoutConfig.sequentialRules.allowedConnections[lastBooth] || [];
    
    // Filter connections that would maintain the current pattern
    return allowedConnections.filter(booth => {
      const testSelection = [...currentSelections, booth];
      const pattern = this.detectBookingPattern(testSelection);
      return pattern.type !== 'mixed';
    });
  }

  /**
   * Get all valid next booths considering sequential rules
   */
 // In sequentialValidator.ts
// In sequentialValidator.ts, in getValidNextBoothsBySequence method:

getValidNextBoothsBySequence(currentSelections: string[]): string[] {
  console.log('\n📋 [SEQUENTIAL VALIDATOR] Getting valid next booths');
  console.log('Current selections:', currentSelections);
  
  if (currentSelections.length === 0) {
    const allBooths = this.layoutConfig.columns.flatMap(col => col.boothRange);
    console.log('No selections yet, returning all booths:', allBooths.length);
    return allBooths;
  }

  const validBooths = new Set<string>();
  
  // Get all booths that are adjacent to any current selection
  currentSelections.forEach(selectedBooth => {
    const allowedConnections = this.layoutConfig.sequentialRules.allowedConnections[selectedBooth] || [];
    console.log(`Allowed connections for ${selectedBooth}:`, allowedConnections);
    
    allowedConnections.forEach(booth => {
      // THIS IS THE PROBLEM - it's excluding booths that are in currentSelections
      if (!currentSelections.includes(booth)) {
        validBooths.add(booth);
        console.log(`✅ Adding ${booth} to valid booths`);
      } else {
        console.log(`❌ Skipping ${booth} - already in selections`);
      }
    });
  });
  
  const result = Array.from(validBooths);
  console.log('Final valid next booths:', result);
  return result;
}

  /**
   * Check if a booth is sequentially adjacent to any booth in the selection
   */
  isBoothSequentiallyValid(boothId: string, currentSelections: string[]): boolean {
    if (currentSelections.length === 0) return true;
    
    const allowedConnections = this.layoutConfig.sequentialRules.allowedConnections[boothId] || [];
    return currentSelections.some(selected => allowedConnections.includes(selected));
  }

  /**
   * Get sequential path between two booths
   */
  getSequentialPath(fromBooth: string, toBooth: string): {
    path: string[];
    isValid: boolean;
    distance: number;
  } {
    // Simple BFS to find shortest path
    const queue = [[fromBooth]];
    const visited = new Set([fromBooth]);
    
    while (queue.length > 0) {
      const currentPath = queue.shift()!;
      const currentBooth = currentPath[currentPath.length - 1];
      
      if (currentBooth === toBooth) {
        return {
          path: currentPath,
          isValid: true,
          distance: currentPath.length - 1
        };
      }
      
      const connections = this.layoutConfig.sequentialRules.allowedConnections[currentBooth] || [];
      
      for (const nextBooth of connections) {
        if (!visited.has(nextBooth)) {
          visited.add(nextBooth);
          queue.push([...currentPath, nextBooth]);
          
          // Prevent infinite loops
          if (currentPath.length > 20) break;
        }
      }
    }
    
    return {
      path: [],
      isValid: false,
      distance: -1
    };
  }

  /**
   * Get sequential booking analysis
   */
  getSequentialAnalysis(selections: string[]): {
    pattern: ReturnType<SequentialValidator['detectBookingPattern']>; // Use class name instead of 'this'
    continuity: { isValid: boolean; gaps: string[] };
    nextValidBooths: string[];
    pathEfficiency: number;
  } {
    const pattern = this.detectBookingPattern(selections);
    const continuityCheck = this.validateSequentialContinuity(selections);
    const nextValidBooths = this.getValidNextBoothsBySequence(selections);
    
    // Calculate path efficiency (how optimal is the current path)
    const pathEfficiency = this.calculatePathEfficiency(selections);
    
    return {
      pattern,
      continuity: {
        isValid: continuityCheck.isValid,
        gaps: this.findSequentialGaps(selections)
      },
      nextValidBooths,
      pathEfficiency
    };
  }

  /**
   * Calculate how efficient the current selection path is
   */
  private calculatePathEfficiency(selections: string[]): number {
    if (selections.length <= 1) return 1.0;
    
    // Calculate actual path length vs optimal path length
    let actualDistance = 0;
    for (let i = 1; i < selections.length; i++) {
      const path = this.getSequentialPath(selections[i - 1], selections[i]);
      actualDistance += path.distance;
    }
    
    const optimalDistance = selections.length - 1; // Direct path
    return optimalDistance / Math.max(actualDistance, 1);
  }

  /**
   * Find gaps in sequential selection
   */
  private findSequentialGaps(selections: string[]): string[] {
    const gaps: string[] = [];
    const boothsByColumn = this.groupBoothsByColumn(selections);
    
    Object.entries(boothsByColumn).forEach(([columnId, booths]) => {
      const column = this.layoutConfig.columns.find(c => c.columnId === columnId);
      if (!column) return;
      
      const positions = booths.map(booth => column.boothRange.indexOf(booth)).sort((a, b) => a - b);
      
      for (let i = 1; i < positions.length; i++) {
        for (let j = positions[i - 1] + 1; j < positions[i]; j++) {
          gaps.push(column.boothRange[j]);
        }
      }
    });
    
    return gaps;
  }
}
// components/BoothsData/validation/passageValidator.ts

import { ValidationResult, ValidationContext } from '../types/validation.types';
import { LayoutConfig, PassageConfig, ColumnConfig } from '../types/layout.types';

export class PassageValidator {
  constructor(private layoutConfig: LayoutConfig) {}

  /**
   * Validate if a booth selection respects passage boundaries
   */
  validatePassageBoundaries(context: ValidationContext): ValidationResult {
    const { currentSelections, proposedBooth } = context;
    
    if (currentSelections.length === 0) {
      return {
        isValid: true,
        message: 'First selection - no passage boundaries to check'
      };
    }

    // Check if proposed booth is separated by passages from any current selection
    for (const selectedBooth of currentSelections) {
      const separationCheck = this.areBoothsSeparatedByPassage(selectedBooth, proposedBooth);
      
      if (separationCheck.isSeparated) {
        return {
          isValid: false,
          message: `Cannot select ${proposedBooth} - separated from ${selectedBooth} by ${separationCheck.passage?.type}: ${separationCheck.passage?.passageId}`,
          errors: [{
            code: 'PASSAGE_BOUNDARY_VIOLATION',
            message: `Booths ${selectedBooth} and ${proposedBooth} are separated by ${separationCheck.passage?.type} "${separationCheck.passage?.passageId}"`,
            affectedBooths: [selectedBooth, proposedBooth],
            severity: 'error'
          }],
          suggestions: [{
            type: 'alternative',
            message: `Try selecting booths within the same section as ${selectedBooth}`,
            suggestedBooths: this.getBoothsInSameSection(selectedBooth)
          }]
        };
      }
    }

    // Check for any passage warnings (non-blocking)
    const warnings = this.checkPassageWarnings(currentSelections, proposedBooth);

    return {
      isValid: true,
      message: 'Passage boundary validation passed',
      warnings
    };
  }

  /**
   * Check if two booths are separated by a passage
   */
  private areBoothsSeparatedByPassage(booth1: string, booth2: string): {
    isSeparated: boolean;
    passage?: PassageConfig;
    reason?: string;
  } {
    const column1 = this.getColumnForBooth(booth1);
    const column2 = this.getColumnForBooth(booth2);

    if (!column1 || !column2) {
      return { isSeparated: false };
    }

    // Same column - no passage separation
    if (column1.columnId === column2.columnId) {
      return { isSeparated: false };
    }

    // Check each passage to see if it separates these columns
    for (const passage of this.layoutConfig.passages) {
      if (!passage.blocksSequential) continue;

      const separatesColumn1 = passage.separates?.includes(column1.columnId) || 
                              this.passageSeparatesSection(passage, column1);
      const separatesColumn2 = passage.separates?.includes(column2.columnId) || 
                              this.passageSeparatesSection(passage, column2);

      if (separatesColumn1 && separatesColumn2) {
        return {
          isSeparated: true,
          passage,
          reason: `${passage.type} "${passage.passageId}" separates columns ${column1.columnId} and ${column2.columnId}`
        };
      }
    }

    return { isSeparated: false };
  }

  /**
   * Check if a passage separates a column by section
   */
  private passageSeparatesSection(passage: PassageConfig, column: ColumnConfig): boolean {
    if (!column.sectionId) return false;
    
    // Check if passage separates by section
    return !!passage.separates?.some(separator => {
      return separator === column.sectionId || 
             separator.includes(column.sectionId || '');
    });
  }

  /**
   * Get all booths in the same section as the given booth
   */
  private getBoothsInSameSection(boothId: string): string[] {
    const column = this.getColumnForBooth(boothId);
    if (!column) return [];

    // If column has a section ID, find all columns in the same section
    if (column.sectionId) {
      const sameSection = this.layoutConfig.columns.filter(col => 
        col.sectionId === column.sectionId
      );
      return sameSection.flatMap(col => col.boothRange);
    }

    // Otherwise, return booths from the same column group
    if (column.subColumns) {
      const sameGroup = this.layoutConfig.columns.filter(col =>
        column.subColumns!.includes(col.columnId)
      );
      return sameGroup.flatMap(col => col.boothRange);
    }

    return column.boothRange;
  }

  /**
   * Check for passage-related warnings
   */
  private checkPassageWarnings(currentSelections: string[], proposedBooth: string): any[] {
    const warnings: any[] = [];
    
    // Check if selection crosses near a passage without violating rules
    const nearbyPassages = this.findNearbyPassages(proposedBooth);
    
    if (nearbyPassages.length > 0) {
      warnings.push({
        code: 'NEAR_PASSAGE_BOUNDARY',
        message: `Booth ${proposedBooth} is near passage boundaries. Future selections may be limited.`,
        canProceed: true
      });
    }

    // Check if selection pattern suggests user might want to cross a passage
    const crossingIntent = this.detectCrossingIntent(currentSelections, proposedBooth);
    if (crossingIntent.detected) {
      warnings.push({
        code: 'POTENTIAL_CROSSING_INTENT',
        message: crossingIntent.message,
        canProceed: true
      });
    }

    return warnings;
  }

  /**
   * Find passages that are near a booth
   */
  private findNearbyPassages(boothId: string): PassageConfig[] {
    const column = this.getColumnForBooth(boothId);
    if (!column) return [];

    return this.layoutConfig.passages.filter(passage => {
      // Check if this passage affects the booth's column
      return passage.separates?.includes(column.columnId) ||
             (column.sectionId && passage.separates?.includes(column.sectionId));
    });
  }

  /**
   * Detect if user might be trying to cross a passage
   */
  private detectCrossingIntent(currentSelections: string[], proposedBooth: string): {
    detected: boolean;
    message?: string;
    alternativeSuggestions?: string[];
  } {
    if (currentSelections.length === 0) {
      return { detected: false };
    }

    // Get the last selected booth
    const lastBooth = currentSelections[currentSelections.length - 1];
    const lastColumn = this.getColumnForBooth(lastBooth);
    const proposedColumn = this.getColumnForBooth(proposedBooth);

    if (!lastColumn || !proposedColumn || lastColumn.columnId === proposedColumn.columnId) {
      return { detected: false };
    }

    // Check if these columns are adjacent (separated by only one passage)
    const separatingPassages = this.findPassagesBetweenColumns(lastColumn, proposedColumn);
    
    if (separatingPassages.length === 1) {
      const passage = separatingPassages[0];
      return {
        detected: true,
        message: `It looks like you're trying to cross ${passage.type} "${passage.passageId}". Consider selecting booths within the same section.`,
        alternativeSuggestions: this.getAlternativeBooths(lastBooth, proposedBooth)
      };
    }

    return { detected: false };
  }

  /**
   * Find passages between two columns
   */
  private findPassagesBetweenColumns(column1: ColumnConfig, column2: ColumnConfig): PassageConfig[] {
    return this.layoutConfig.passages.filter(passage => {
      const separatesColumn1 = passage.separates?.includes(column1.columnId);
      const separatesColumn2 = passage.separates?.includes(column2.columnId);
      return separatesColumn1 && separatesColumn2;
    });
  }

  /**
   * Get alternative booth suggestions when crossing is detected
   */
  private getAlternativeBooths(fromBooth: string, intendedBooth: string): string[] {
    const fromColumn = this.getColumnForBooth(fromBooth);
    if (!fromColumn) return [];

    // Get remaining booths in the same column/section
    const sameSection = this.getBoothsInSameSection(fromBooth);
    
    // Filter out already selected booths and the intended booth
    return sameSection.filter(boothId => 
      boothId !== fromBooth && boothId !== intendedBooth
    );
  }

  /**
   * Get column for booth (helper method)
   */
  private getColumnForBooth(boothId: string): ColumnConfig | null {
    return this.layoutConfig.columns.find(column => 
      column.boothRange.includes(boothId)
    ) || null;
  }

  /**
   * Get all valid next booths considering passage restrictions
   */
  getValidNextBoothsByPassage(currentSelections: string[]): string[] {
    if (currentSelections.length === 0) {
      // First selection - all booths are valid
      return this.layoutConfig.columns.flatMap(col => col.boothRange);
    }

    const validBooths: string[] = [];
    const allBooths = this.layoutConfig.columns.flatMap(col => col.boothRange);

    // Test each booth to see if it's separated by passages
    for (const booth of allBooths) {
      let isValid = true;
      
      for (const selectedBooth of currentSelections) {
        if (this.areBoothsSeparatedByPassage(selectedBooth, booth).isSeparated) {
          isValid = false;
          break;
        }
      }
      
      if (isValid) {
        validBooths.push(booth);
      }
    }

    return validBooths;
  }

  /**
   * Check if a specific passage blocks booth selection
   */
  isPassageBlocking(passageId: string, booth1: string, booth2: string): boolean {
    const passage = this.layoutConfig.passages.find(p => p.passageId === passageId);
    if (!passage || !passage.blocksSequential) return false;

    const column1 = this.getColumnForBooth(booth1);
    const column2 = this.getColumnForBooth(booth2);

    if (!column1 || !column2) return false;

    return !!(passage.separates?.includes(column1.columnId) && 
           passage.separates?.includes(column2.columnId));
  }

  /**
   * Get all passages that affect a booth
   */
  getPassagesAffectingBooth(boothId: string): PassageConfig[] {
    const column = this.getColumnForBooth(boothId);
    if (!column) return [];

    return this.layoutConfig.passages.filter(passage =>
      passage.separates?.includes(column.columnId) ||
      (column.sectionId && passage.separates?.includes(column.sectionId))
    );
  }

  /**
   * Get passage analysis for a selection
   */
  getPassageAnalysis(selections: string[]): {
    affectedPassages: PassageConfig[];
    blockedDirections: string[];
    allowedExpansions: string[];
    crossingRisk: 'low' | 'medium' | 'high';
  } {
    if (selections.length === 0) {
      return {
        affectedPassages: [],
        blockedDirections: [],
        allowedExpansions: this.layoutConfig.columns.map(c => c.columnId),
        crossingRisk: 'low'
      };
    }

    const affectedPassages = new Set<PassageConfig>();
    const blockedDirections = new Set<string>();
    
    // Analyze each selection
    selections.forEach(booth => {
      const passages = this.getPassagesAffectingBooth(booth);
      passages.forEach(passage => {
        affectedPassages.add(passage);
        passage.separates?.forEach(direction => blockedDirections.add(direction));
      });
    });

    // Determine allowed expansions
    const currentColumns = selections.map(booth => this.getColumnForBooth(booth)?.columnId).filter(Boolean);
   const uniqueColumns = [...new Set(currentColumns)];

let allowedExpansions: string[] = [];
if (uniqueColumns.length === 1) {
  const firstColumnId = uniqueColumns[0];
  
  // Add type guard to ensure we have a valid string
  if (firstColumnId) {
    const column = this.layoutConfig.columns.find(c => c.columnId === firstColumnId);
    if (column && column.subColumns) {
      allowedExpansions = column.subColumns;
    } else {
      allowedExpansions = [firstColumnId];
    }
  }
}

    // Calculate crossing risk
    const crossingRisk = this.calculateCrossingRisk(selections, Array.from(affectedPassages));

    return {
      affectedPassages: Array.from(affectedPassages),
      blockedDirections: Array.from(blockedDirections),
      allowedExpansions,
      crossingRisk
    };
  }

  /**
   * Calculate the risk of accidentally crossing passages
   */
  private calculateCrossingRisk(selections: string[], passages: PassageConfig[]): 'low' | 'medium' | 'high' {
    if (passages.length === 0) return 'low';
    
    const columns = selections.map(booth => this.getColumnForBooth(booth)).filter(Boolean);
    const uniqueColumns = [...new Set(columns.map(c => c!.columnId))];
    
    // High risk: Multiple columns with blocking passages
    if (uniqueColumns.length > 1 && passages.some(p => p.blocksSequential)) {
      return 'high';
    }
    
    // Medium risk: Near passage boundaries
    if (passages.length > 2) {
      return 'medium';
    }
    
    return 'low';
  }
}
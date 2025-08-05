// components/BoothsData/validation/columnValidator.ts

import { ValidationResult, ValidationContext } from '../types/validation.types';
import { LayoutConfig, ColumnConfig } from '../types/layout.types';

export class ColumnValidator {
  constructor(private layoutConfig: LayoutConfig) {}

  /**
   * Validate if a booth selection respects column restrictions
   */
  validateColumnRestriction(context: ValidationContext): ValidationResult {
    const { currentSelections, proposedBooth, layoutConfig } = context;
    
    if (currentSelections.length === 0) {
      return {
        isValid: true,
        message: 'First selection - any column allowed'
      };
    }

    // Find columns for current selections and proposed booth
    const currentColumns = this.getColumnsForBooths(currentSelections, layoutConfig);
    const proposedColumn = this.getColumnForBooth(proposedBooth, layoutConfig);

    if (!proposedColumn) {
      return {
        isValid: false,
        message: `Booth ${proposedBooth} not found in any column configuration`,
        errors: [{
          code: 'INVALID_BOOTH_ID',
          message: `Booth ${proposedBooth} is not defined in the layout configuration`,
          affectedBooths: [proposedBooth],
          severity: 'error'
        }]
      };
    }

    // Check if all current columns are in the same column group as proposed
    const columnGroupValidation = this.validateColumnGroup(currentColumns, proposedColumn);
    if (!columnGroupValidation.isValid) {
      return columnGroupValidation;
    }

    // Check maximum selection limits
    const maxSelectionValidation = this.validateMaxSelection(
      [...currentSelections, proposedBooth], 
      proposedColumn
    );
    if (!maxSelectionValidation.isValid) {
      return maxSelectionValidation;
    }

    return {
      isValid: true,
      message: 'Column restriction validation passed'
    };
  }

  /**
   * Check if columns belong to the same allowed group
   */
  private validateColumnGroup(currentColumns: ColumnConfig[], proposedColumn: ColumnConfig): ValidationResult {
    if (currentColumns.length === 0) {
      return { isValid: true, message: 'No current columns to validate against' };
    }

    const firstColumn = currentColumns[0];
    
    // Check if the first column is isolated
    if (firstColumn.isolatedFromOthers && firstColumn.columnId !== proposedColumn.columnId) {
      return {
        isValid: false,
        message: `Cannot select ${proposedColumn.columnId} - current column ${firstColumn.columnId} is isolated`,
        errors: [{
          code: 'CROSS_COLUMN_SELECTION',
          message: `Column ${firstColumn.columnId} does not allow connections to other columns`,
          affectedBooths: [],
          severity: 'error'
        }]
      };
    }

    // Check if the proposed column is isolated
    if (proposedColumn.isolatedFromOthers) {
      const hasOtherColumns = currentColumns.some(col => col.columnId !== proposedColumn.columnId);
      if (hasOtherColumns) {
        return {
          isValid: false,
          message: `Cannot select ${proposedColumn.columnId} - this column is isolated and cannot be mixed with others`,
          errors: [{
            code: 'CROSS_COLUMN_SELECTION',
            message: `Column ${proposedColumn.columnId} is isolated and cannot be combined with other columns`,
            affectedBooths: [],
            severity: 'error'
          }]
        };
      }
    }

    // For double columns, check if they belong to the same column group
    if (firstColumn.columnType === 'double' || proposedColumn.columnType === 'double') {
      return this.validateDoubleColumnGroup(firstColumn, proposedColumn);
    }

    // For single columns, they must be the same column
    if (firstColumn.columnId !== proposedColumn.columnId) {
      return {
        isValid: false,
        message: `Cannot select across different single columns: ${firstColumn.columnId} → ${proposedColumn.columnId}`,
        errors: [{
          code: 'CROSS_COLUMN_SELECTION',
          message: `Cannot book booths across different single columns`,
          affectedBooths: [],
          severity: 'error'
        }]
      };
    }

    return { isValid: true, message: 'Column group validation passed' };
  }

  /**
   * Validate double column group relationships
   */
  private validateDoubleColumnGroup(firstColumn: ColumnConfig, proposedColumn: ColumnConfig): ValidationResult {
    // Check if both columns share the same sub-column group
    const firstSubColumns = firstColumn.subColumns || [firstColumn.columnId];
    const proposedSubColumns = proposedColumn.subColumns || [proposedColumn.columnId];

    // Check if there's any overlap in allowed sub-columns
    const hasOverlap = firstSubColumns.some(subCol => proposedSubColumns.includes(subCol)) ||
                      proposedSubColumns.some(subCol => firstSubColumns.includes(subCol));

    if (!hasOverlap) {
      return {
        isValid: false,
        message: `Cannot select across different double column groups: ${firstColumn.columnId} → ${proposedColumn.columnId}`,
        errors: [{
          code: 'CROSS_COLUMN_SELECTION',
          message: `Double columns ${firstColumn.columnId} and ${proposedColumn.columnId} are not in the same group`,
          affectedBooths: [],
          severity: 'error'
        }]
      };
    }

    return { isValid: true, message: 'Double column group validation passed' };
  }

  /**
   * Validate maximum selection limits for a column
   */
  private validateMaxSelection(allSelections: string[], column: ColumnConfig): ValidationResult {
    const columnRestrictions = this.layoutConfig.sequentialRules.columnRestrictions[column.columnId];
    
    if (!columnRestrictions?.maxContinuousSelection) {
      return { isValid: true, message: 'No maximum selection limit defined' };
    }

    const maxAllowed = columnRestrictions.maxContinuousSelection;
    
    if (allSelections.length > maxAllowed) {
      return {
        isValid: false,
        message: `Maximum selection limit exceeded for column ${column.columnId}: ${allSelections.length}/${maxAllowed}`,
        errors: [{
          code: 'MAXIMUM_SELECTION_EXCEEDED',
          message: `Cannot select more than ${maxAllowed} booths in column ${column.columnId}`,
          affectedBooths: allSelections,
          severity: 'error'
        }]
      };
    }

    return { isValid: true, message: 'Maximum selection validation passed' };
  }

  /**
   * Get all columns that contain the given booths
   */
  private getColumnsForBooths(boothIds: string[], layoutConfig: LayoutConfig): ColumnConfig[] {
    const columns: ColumnConfig[] = [];
    
    boothIds.forEach(boothId => {
      const column = this.getColumnForBooth(boothId, layoutConfig);
      if (column && !columns.find(c => c.columnId === column.columnId)) {
        columns.push(column);
      }
    });
    
    return columns;
  }

  /**
   * Get the column configuration for a specific booth
   */
  private getColumnForBooth(boothId: string, layoutConfig: LayoutConfig): ColumnConfig | null {
    return layoutConfig.columns.find(column => 
      column.boothRange.includes(boothId)
    ) || null;
  }

  /**
   * Get all valid booth options for the next selection based on column restrictions
   */
  getValidNextBoothsByColumn(currentSelections: string[]): string[] {
    if (currentSelections.length === 0) {
      // First selection - all booths are valid
      return this.layoutConfig.columns.flatMap(col => col.boothRange);
    }

    const currentColumns = this.getColumnsForBooths(currentSelections, this.layoutConfig);
    if (currentColumns.length === 0) return [];

    const firstColumn = currentColumns[0];
    
    // If current column is isolated, only booths from same column are valid
    if (firstColumn.isolatedFromOthers) {
      return firstColumn.boothRange;
    }

    // For double columns, return all booths from the same column group
    if (firstColumn.columnType === 'double' && firstColumn.subColumns) {
      const validColumns = this.layoutConfig.columns.filter(col =>
        firstColumn.subColumns!.includes(col.columnId)
      );
      return validColumns.flatMap(col => col.boothRange);
    }

    // For single columns, only same column booths are valid
    return firstColumn.boothRange;
  }

  /**
   * Get column information for a booth
   */
  getColumnInfo(boothId: string): {
    column: ColumnConfig | null;
    columnGroup: string[];
    isIsolated: boolean;
    maxSelections: number | null;
  } {
    const column = this.getColumnForBooth(boothId, this.layoutConfig);
    
    if (!column) {
      return {
        column: null,
        columnGroup: [],
        isIsolated: true,
        maxSelections: null
      };
    }

    const columnGroup = column.subColumns || [column.columnId];
    const restrictions = this.layoutConfig.sequentialRules.columnRestrictions[column.columnId];
    
    return {
      column,
      columnGroup,
      isIsolated: column.isolatedFromOthers,
      maxSelections: restrictions?.maxContinuousSelection || null
    };
  }

  /**
   * Check if two booths are in the same column group
   */
  areBoothsInSameColumnGroup(booth1: string, booth2: string): boolean {
    const column1 = this.getColumnForBooth(booth1, this.layoutConfig);
    const column2 = this.getColumnForBooth(booth2, this.layoutConfig);
    
    if (!column1 || !column2) return false;
    
    // Same column
    if (column1.columnId === column2.columnId) return true;
    
    // Both isolated columns
    if (column1.isolatedFromOthers || column2.isolatedFromOthers) return false;
    
    // Check if they share sub-column groups
    const subColumns1 = column1.subColumns || [column1.columnId];
    const subColumns2 = column2.subColumns || [column2.columnId];
    
    return subColumns1.some(subCol => subColumns2.includes(subCol));
  }

  /**
   * Get column validation summary for debugging
   */
  getValidationSummary(currentSelections: string[]): {
    currentColumns: string[];
    allowedColumns: string[];
    restrictionType: 'isolated' | 'double-group' | 'single' | 'none';
    maxSelectionsReached: boolean;
  } {
    if (currentSelections.length === 0) {
      return {
        currentColumns: [],
        allowedColumns: this.layoutConfig.columns.map(c => c.columnId),
        restrictionType: 'none',
        maxSelectionsReached: false
      };
    }

    const currentColumns = this.getColumnsForBooths(currentSelections, this.layoutConfig);
    const firstColumn = currentColumns[0];
    
    if (!firstColumn) {
      return {
        currentColumns: [],
        allowedColumns: [],
        restrictionType: 'none',
        maxSelectionsReached: false
      };
    }

    let allowedColumns: string[] = [];
    let restrictionType: 'isolated' | 'double-group' | 'single' | 'none' = 'none';

    if (firstColumn.isolatedFromOthers) {
      allowedColumns = [firstColumn.columnId];
      restrictionType = 'isolated';
    } else if (firstColumn.columnType === 'double' && firstColumn.subColumns) {
      allowedColumns = firstColumn.subColumns;
      restrictionType = 'double-group';
    } else {
      allowedColumns = [firstColumn.columnId];
      restrictionType = 'single';
    }

    // Check if max selections reached
    const restrictions = this.layoutConfig.sequentialRules.columnRestrictions[firstColumn.columnId];
    const maxSelectionsReached = restrictions?.maxContinuousSelection ? 
      currentSelections.length >= restrictions.maxContinuousSelection : false;

    return {
      currentColumns: currentColumns.map(c => c.columnId),
      allowedColumns,
      restrictionType,
      maxSelectionsReached
    };
  }
}
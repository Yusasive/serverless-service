// components/PassageOverlay.tsx - SVG Passage Visualization

import React, { useState, useMemo } from 'react';
import { LayoutConfig, PassageConfig } from '../components/BoothsData/types/layout.types';

interface PassageOverlayProps {
  layoutConfig: LayoutConfig;
  currentSelections: string[];
  validBooths?: Set<string>;
  blockedBooths?: Set<string>;
  showPassageLabels?: boolean;
  showBlockedConnections?: boolean;
  highlightCriticalPassages?: boolean;
  onPassageHover?: (passageId: string | null) => void;
  onPassageClick?: (passageId: string) => void;
}

interface PassageVisualization extends PassageConfig {
  isActive: boolean;
  isBlocking: boolean;
  affectedBooths: string[];
  visualPriority: 'low' | 'medium' | 'high' | 'critical';
}

const PassageOverlay: React.FC<PassageOverlayProps> = ({
  layoutConfig,
  currentSelections,
  // validBooths = new Set(),
  blockedBooths = new Set(),
  showPassageLabels = true,
  showBlockedConnections = true,
  highlightCriticalPassages = true,
  onPassageHover,
  onPassageClick
}) => {
  const [hoveredPassage, setHoveredPassage] = useState<string | null>(null);

  // Process passages for visualization
  const visualPassages = useMemo(() => {
    return layoutConfig.passages.map(passage => {
      const visualization = analyzePassageForVisualization(
        passage, 
        currentSelections, 
        layoutConfig,
        blockedBooths
      );
      return visualization;
    });
  }, [layoutConfig.passages, currentSelections, layoutConfig, blockedBooths]);

  // Get passage style based on state and type
  const getPassageStyle = (passage: PassageVisualization): React.CSSProperties => {
    const baseStyle = getBasePassageStyle(passage.type);
    
    // Override based on state
    if (passage.isBlocking && showBlockedConnections) {
      return {
        ...baseStyle,
        stroke: '#ef4444', // red-500
        strokeWidth: '4',
        strokeDasharray: '8,4',
        opacity: 0.9
      };
    }

    if (passage.isActive) {
      return {
        ...baseStyle,
        stroke: '#f59e0b', // amber-500
        strokeWidth: '3',
        opacity: 0.8
      };
    }

    if (passage.visualPriority === 'critical' && highlightCriticalPassages) {
      return {
        ...baseStyle,
        stroke: '#dc2626', // red-600
        strokeWidth: '3',
        opacity: 0.7
      };
    }

    // Default state
    return {
      ...baseStyle,
      opacity: hoveredPassage === passage.passageId ? 0.8 : 0.4
    };
  };

  // Handle passage interactions
  const handlePassageMouseEnter = (passageId: string) => {
    setHoveredPassage(passageId);
    onPassageHover?.(passageId);
  };

  const handlePassageMouseLeave = () => {
    setHoveredPassage(null);
    onPassageHover?.(null);
  };

  const handlePassageClick = (passageId: string) => {
    onPassageClick?.(passageId);
  };

  // Render individual passage
  const renderPassage = (passage: PassageVisualization) => {
    if (!passage.coordinates || passage.coordinates.length < 2) {
      return null;
    }

    const style = getPassageStyle(passage);
    const isInteractive = !!(onPassageHover || onPassageClick);

    return (
      <g 
        key={passage.passageId}
        className={`passage-group ${isInteractive ? 'cursor-pointer' : ''}`}
        onMouseEnter={() => handlePassageMouseEnter(passage.passageId)}
        onMouseLeave={handlePassageMouseLeave}
        onClick={() => handlePassageClick(passage.passageId)}
      >
        {/* Main passage line */}
        <line
          x1={passage.coordinates[0][0]}
          y1={passage.coordinates[0][1]}
          x2={passage.coordinates[1][0]}
          y2={passage.coordinates[1][1]}
          style={style}
          className="passage-line"
        />

        {/* Passage end markers for doors */}
        {passage.type === 'door' && renderDoorMarkers(passage)}

        {/* Passage label */}
        {showPassageLabels && renderPassageLabel(passage)}

        {/* Blocked connection indicators */}
        {passage.isBlocking && showBlockedConnections && 
         renderBlockedConnectionIndicators(passage)}

        {/* Hover highlight */}
        {hoveredPassage === passage.passageId && renderHoverHighlight(passage)}
      </g>
    );
  };

  // Render door markers
  const renderDoorMarkers = (passage: PassageVisualization) => {
    if (!passage.coordinates || passage.coordinates.length < 2) {
      return null;
    }
    const [start, end] = passage.coordinates;
    const markerSize = 8;
  
    return (
      <>
        <circle
          cx={start[0]}
          cy={start[1]}
          r={markerSize}
          fill="#6b7280"
          stroke="#374151"
          strokeWidth="2"
          className="door-marker"
        />
        <circle
          cx={end[0]}
          cy={end[1]}
          r={markerSize}
          fill="#6b7280"
          stroke="#374151"
          strokeWidth="2"
          className="door-marker"
        />
      </>
    );
  };

  // Render passage label
  const renderPassageLabel = (passage: PassageVisualization) => {
    if (!passage.coordinates || passage.coordinates.length < 2) {
      return null;
    }
    const [start, end] = passage.coordinates;
    const midX = (start[0] + end[0]) / 2;
    const midY = (start[1] + end[1]) / 2;
    
    // Calculate label angle for better readability
    const angle = Math.atan2(end[1] - start[1], end[0] - start[0]) * 180 / Math.PI;
    const labelAngle = Math.abs(angle) > 90 ? angle + 180 : angle;

    const labelText = formatPassageLabel(passage);
    
    return (
      <g className="passage-label">
        {/* Label background */}
        <rect
          x={midX - 25}
          y={midY - 8}
          width="50"
          height="16"
          fill="rgba(255, 255, 255, 0.9)"
          stroke="#6b7280"
          strokeWidth="1"
          rx="3"
          className="label-background"
        />
        
        {/* Label text */}
        <text
          x={midX}
          y={midY + 4}
          textAnchor="middle"
          className="text-xs font-semibold fill-gray-700"
          transform={`rotate(${labelAngle}, ${midX}, ${midY})`}
        >
          {labelText}
        </text>
      </g>
    );
  };

  // Render blocked connection indicators
  const renderBlockedConnectionIndicators = (passage: PassageVisualization) => {
    if (!passage.isBlocking) return null;

    return (
      <g className="blocked-indicators">
        {/* Warning symbols along the passage */}
        {generateWarningSymbols(passage).map((symbol, index) => (
          <g key={index}>
            <circle
              cx={symbol.x}
              cy={symbol.y}
              r="6"
              fill="#fef3c7"
              stroke="#f59e0b"
              strokeWidth="2"
            />
            <text
              x={symbol.x}
              y={symbol.y + 2}
              textAnchor="middle"
              className="text-xs font-bold fill-amber-600"
            >
              !
            </text>
          </g>
        ))}
      </g>
    );
  };

  // Render hover highlight
  const renderHoverHighlight = (passage: PassageVisualization) => {
     if (!passage.coordinates || passage.coordinates.length < 2) {
      return null;
    }
    const [start, end] = passage.coordinates;
    
    return (
      <line
        x1={start[0]}
        y1={start[1]}
        x2={end[0]}
        y2={end[1]}
        stroke="rgba(59, 130, 246, 0.6)"
        strokeWidth="8"
        className="hover-highlight"
        style={{ filter: 'blur(2px)' }}
      />
    );
  };

  return (
    <g className="passage-overlay">
      {/* Render all passages */}
      {visualPassages.map(renderPassage)}
      
      {/* Passage legend */}
      {showPassageLabels && renderPassageLegend()}
      
      {/* Debug info if in development */}
      {process.env.NODE_ENV === 'development' && renderDebugInfo()}
    </g>
  );
};

// Helper functions

function analyzePassageForVisualization(
  passage: PassageConfig,
  currentSelections: string[],
  layoutConfig: LayoutConfig,
  blockedBooths: Set<string>
): PassageVisualization {
  
  // Determine if passage is currently active (affecting current selections)
  const currentColumns = getCurrentColumns(currentSelections, layoutConfig);
  const isActive = !!(passage.separates && passage.separates.some(separator => 
    currentColumns.includes(separator)
  ));

  // Determine if passage is blocking potential selections
  const isBlocking = isPassageBlockingSelections(passage, currentSelections, blockedBooths);

  // Get affected booths
  const affectedBooths = getBoothsAffectedByPassage(passage, layoutConfig);

  // Calculate visual priority
  const visualPriority = calculateVisualPriority(passage, currentSelections, isBlocking);

  return {
    ...passage,
    isActive,
    isBlocking,
    affectedBooths,
    visualPriority
  };
}

function getCurrentColumns(selections: string[], layoutConfig: LayoutConfig): string[] {
  const columns = new Set<string>();
  
  selections.forEach(boothId => {
    const column = layoutConfig.columns.find(col => 
      col.boothRange.includes(boothId)
    );
    if (column) {
      columns.add(column.columnId);
      if (column.sectionId) {
        columns.add(column.sectionId);
      }
    }
  });
  
  return Array.from(columns);
}

function isPassageBlockingSelections(
  passage: PassageConfig,
  currentSelections: string[],
  blockedBooths: Set<string>
): boolean {
  if (!passage.blocksSequential || currentSelections.length === 0) {
    return false;
  }

  // Check if any blocked booths are blocked specifically by this passage
  return Array.from(blockedBooths).some(() => {
    // This would need more sophisticated logic to determine
    // which specific passage is blocking which booth
    return true;
  });
}

function getBoothsAffectedByPassage(passage: PassageConfig, layoutConfig: LayoutConfig): string[] {
  const affectedBooths: string[] = [];
  
  layoutConfig.columns.forEach(column => {
    if (passage?.separates?.includes(column.columnId) || 
        (column.sectionId && passage.separates?.includes(column.sectionId))) {
      affectedBooths.push(...column.boothRange);
    }
  });
  
  return affectedBooths;
}

function calculateVisualPriority(
  passage: PassageConfig,
  currentSelections: string[],
  isBlocking: boolean
): 'low' | 'medium' | 'high' | 'critical' {
  if (isBlocking) return 'critical';
  if (passage.type === 'emergency-exit') return 'high';
  if (passage.type === 'main-aisle') return 'medium';
  if (currentSelections.length > 0) return 'medium';
  return 'low';
}

function getBasePassageStyle(passageType: string): React.CSSProperties {
  const styles: { [key: string]: React.CSSProperties } = {
    'door': {
      stroke: '#6b7280',
      strokeWidth: '3',
      strokeDasharray: '6,6'
    },
    'corridor': {
      stroke: '#9ca3af',
      strokeWidth: '2',
      strokeDasharray: '4,4'
    },
    'emergency-exit': {
      stroke: '#ef4444',
      strokeWidth: '3',
      strokeDasharray: '8,2'
    },
    'main-aisle': {
      stroke: '#374151',
      strokeWidth: '2',
      strokeDasharray: '5,5'
    },
    'service-road': {
      stroke: '#d1d5db',
      strokeWidth: '1',
      strokeDasharray: '3,3'
    }
  };

  return styles[passageType] || styles['corridor'];
}

function formatPassageLabel(passage: PassageVisualization): string {
  const typeLabels: { [key: string]: string } = {
    'door': 'DOOR',
    'corridor': 'CORRIDOR',
    'emergency-exit': 'EXIT',
    'main-aisle': 'AISLE',
    'service-road': 'SERVICE'
  };

  return typeLabels[passage.type] || passage.type.toUpperCase();
}

function generateWarningSymbols(passage: PassageVisualization): Array<{x: number, y: number}> {
  if (!passage.coordinates || passage.coordinates.length < 2) {
    return [];
  }
  const [start, end] = passage.coordinates;
  const length = Math.sqrt((end[0] - start[0]) ** 2 + (end[1] - start[1]) ** 2);
  const symbolCount = Math.min(Math.floor(length / 80), 5); // Max 5 symbols
  
  const symbols: Array<{x: number, y: number}> = [];
  
  for (let i = 1; i <= symbolCount; i++) {
    const ratio = i / (symbolCount + 1);
    const x = start[0] + (end[0] - start[0]) * ratio;
    const y = start[1] + (end[1] - start[1]) * ratio;
    symbols.push({ x, y });
  }
  
  return symbols;
}

function renderPassageLegend(): JSX.Element {
  return (
    <g className="passage-legend" transform="translate(20, 20)">
      <rect
        width="200"
        height="120"
        fill="rgba(255, 255, 255, 0.95)"
        stroke="#d1d5db"
        strokeWidth="1"
        rx="5"
      />
      <text x="10" y="20" className="text-sm font-semibold fill-gray-800">
        Passage Legend
      </text>
      
      {/* Legend items */}
      <g transform="translate(10, 35)">
        <line x1="0" y1="0" x2="20" y2="0" stroke="#374151" strokeWidth="2" strokeDasharray="5,5" />
        <text x="25" y="4" className="text-xs fill-gray-700">Main Aisle</text>
      </g>
      
      <g transform="translate(10, 55)">
        <line x1="0" y1="0" x2="20" y2="0" stroke="#6b7280" strokeWidth="3" strokeDasharray="6,6" />
        <text x="25" y="4" className="text-xs fill-gray-700">Door</text>
      </g>
      
      <g transform="translate(10, 75)">
        <line x1="0" y1="0" x2="20" y2="0" stroke="#ef4444" strokeWidth="4" strokeDasharray="8,4" />
        <text x="25" y="4" className="text-xs fill-gray-700">Blocked Connection</text>
      </g>
      
      <g transform="translate(10, 95)">
        <circle cx="10" cy="0" r="6" fill="#fef3c7" stroke="#f59e0b" strokeWidth="2" />
        <text x="6" y="2" className="text-xs font-bold fill-amber-600">!</text>
        <text x="25" y="4" className="text-xs fill-gray-700">Warning</text>
      </g>
    </g>
  );
}

function renderDebugInfo(): JSX.Element {
  return (
    <g className="debug-info" transform="translate(20, 200)">
      <rect
        width="150"
        height="60"
        fill="rgba(0, 0, 0, 0.8)"
        rx="3"
      />
      <text x="10" y="20" className="text-xs font-mono fill-green-400">
        DEBUG MODE
      </text>
      <text x="10" y="35" className="text-xs font-mono fill-green-400">
        Passages: Active
      </text>
      <text x="10" y="50" className="text-xs font-mono fill-green-400">
        Validation: ON
      </text>
    </g>
  );
}

export default PassageOverlay;
// components/BoothValidationIndicator.tsx - Enhanced Booth State Display

import React, { useMemo } from 'react';
import { EnhancedBoothData } from '../types/booth.types';

interface BoothValidationIndicatorProps {
  booth: EnhancedBoothData;
  currentSelections: string[];
  validBooths: Set<string>;
  suggestedBooths: Set<string>;
  blockedBooths: Set<string>;
  onBoothClick: (boothId: string) => void;
  showValidationFeedback?: boolean;
  showTooltips?: boolean;
  showColumnInfo?: boolean;
  animateStateChanges?: boolean;
}

type BoothDisplayState = 
  | 'available'
  | 'selected'
  | 'booked-by-you'
  | 'booked-by-others'
  | 'valid-next'
  | 'suggested'
  | 'blocked'
  | 'invalid';

interface BoothStateConfig {
  fillColor: string;
  strokeColor: string;
  fillOpacity: number;
  strokeWidth: number;
  strokeDashArray?: string;
  glowEffect?: boolean;
  pulseAnimation?: boolean;
  hoverScale?: number;
}

const BoothValidationIndicator: React.FC<BoothValidationIndicatorProps> = ({
  booth,
  currentSelections,
  validBooths,
  suggestedBooths,
  blockedBooths,
  onBoothClick,
  showValidationFeedback = true,
  showTooltips = true,
  showColumnInfo = false,
  animateStateChanges = true
}) => {
  
  // Calculate booth display state
  const displayState = useMemo((): BoothDisplayState => {
    const { boothId, status } = booth;
    
    // First check actual booth status
    if (status === 'selected') return 'selected';
    if (status === 'booked-by-you') return 'booked-by-you';
    if (status === 'booked-by-others') return 'booked-by-others';
    
    // Then check validation states (only for available booths)
    if (status === 'available' && showValidationFeedback) {
      if (suggestedBooths.has(boothId)) return 'suggested';
      if (validBooths.has(boothId)) return 'valid-next';
      if (blockedBooths.has(boothId)) return 'blocked';
      
      // If we have selections but this booth isn't in any validation set
      if (currentSelections.length > 0) return 'invalid';
    }
    
    return 'available';
  }, [booth, currentSelections, validBooths, suggestedBooths, blockedBooths, showValidationFeedback]);

  // Get state configuration
  const stateConfig = useMemo((): BoothStateConfig => {
    return getBoothStateConfig(displayState, booth.isSpecialBooth);
  }, [displayState, booth.isSpecialBooth]);

  // Generate booth polygon points
  const polygonPoints = useMemo(() => {
    return booth.coords.map(coord => coord.join(',')).join(' ');
  }, [booth.coords]);

  // Calculate center point for labels
  const centerPoint = useMemo(() => {
    const xSum = booth.coords.reduce((sum, coord) => sum + coord[0], 0);
    const ySum = booth.coords.reduce((sum, coord) => sum + coord[1], 0);
    return {
      x: xSum / booth.coords.length,
      y: ySum / booth.coords.length
    };
  }, [booth.coords]);

  // Generate tooltip content
  const tooltipContent = useMemo(() => {
    if (!showTooltips) return '';
    
    return generateTooltipContent(booth, displayState, currentSelections);
  }, [booth, displayState, currentSelections, showTooltips]);

  // Handle booth click
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onBoothClick(booth.boothId);
  };

  // Generate CSS classes
  const cssClasses = useMemo(() => {
    const classes = ['booth-indicator'];
    
    classes.push(`state-${displayState}`);
    
    if (booth.isSpecialBooth) classes.push('special-booth');
    if (animateStateChanges) classes.push('animate-state');
    if (stateConfig.pulseAnimation) classes.push('pulse-animation');
    
    return classes.join(' ');
  }, [displayState, booth.isSpecialBooth, animateStateChanges, stateConfig.pulseAnimation]);

  return (
    <g className={cssClasses}>
      {/* Glow effect (rendered behind main polygon) */}
      {stateConfig.glowEffect && (
        <polygon
          points={polygonPoints}
          fill={stateConfig.fillColor}
          fillOpacity="0.3"
          stroke="none"
          style={{
            filter: 'blur(3px)',
            transform: 'scale(1.1)',
            transformOrigin: `${centerPoint.x}px ${centerPoint.y}px`
          }}
        />
      )}
      
      {/* Main booth polygon */}
      <polygon
        points={polygonPoints}
        fill={stateConfig.fillColor}
        fillOpacity={stateConfig.fillOpacity}
        stroke={stateConfig.strokeColor}
        strokeWidth={stateConfig.strokeWidth}
        strokeDasharray={stateConfig.strokeDashArray}
        onClick={handleClick}
        className="booth-polygon cursor-pointer transition-all duration-300"
        style={{
          transformOrigin: `${centerPoint.x}px ${centerPoint.y}px`,
          transform: 'scale(1)',
          transition: animateStateChanges ? 'all 0.3s ease' : 'none'
        }}
        onMouseEnter={(e) => {
          if (stateConfig.hoverScale) {
            e.currentTarget.style.transform = `scale(${stateConfig.hoverScale})`;
          }
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'scale(1)';
        }}
      >
        {/* Tooltip */}
        {showTooltips && (
          <title>{tooltipContent}</title>
        )}
      </polygon>
      
      {/* Booth ID label */}
      <text
        x={centerPoint.x}
        y={centerPoint.y}
        textAnchor="middle"
        dominantBaseline="middle"
        className="booth-label text-xs font-bold pointer-events-none"
        fill={getTextColor(displayState)}
        style={{
          filter: getTextFilter(displayState),
          textShadow: '1px 1px 2px rgba(0,0,0,0.5)'
        }}
      >
        {booth.boothId}
      </text>
      
      {/* Column info (if enabled) */}
      {showColumnInfo && renderColumnInfo(booth, centerPoint)}
      
      {/* Status indicators */}
      {renderStatusIndicators(displayState, centerPoint)}
      
      {/* Validation feedback icons */}
      {showValidationFeedback && renderValidationIcons(displayState, centerPoint)}
      
      {/* Special booth marker */}
      {booth.isSpecialBooth && renderSpecialBoothMarker(centerPoint)}
    </g>
  );
};

// Helper functions

function getBoothStateConfig(state: BoothDisplayState, isSpecial: boolean): BoothStateConfig {
  const configs: { [key in BoothDisplayState]: BoothStateConfig } = {
    'available': {
      fillColor: isSpecial ? '#dcfce7' : '#fee2e2', // green-100 : red-100
      strokeColor: '#6b7280', // gray-500
      fillOpacity: 0.4,
      strokeWidth: 1,
      hoverScale: 1.05
    },
    'selected': {
      fillColor: '#bbf7d0', // green-200
      strokeColor: '#059669', // green-600
      fillOpacity: 0.8,
      strokeWidth: 3,
      glowEffect: true,
      hoverScale: 1.03
    },
    'booked-by-you': {
      fillColor: '#bfdbfe', // blue-200
      strokeColor: '#1d4ed8', // blue-700
      fillOpacity: 0.7,
      strokeWidth: 2,
      hoverScale: 1.02
    },
    'booked-by-others': {
      fillColor: '#fecaca', // red-200
      strokeColor: '#dc2626', // red-600
      fillOpacity: 0.6,
      strokeWidth: 2,
      strokeDashArray: '5,5'
    },
    'valid-next': {
      fillColor: '#ddd6fe', // violet-200
      strokeColor: '#7c3aed', // violet-600
      fillOpacity: 0.5,
      strokeWidth: 2,
      hoverScale: 1.08
    },
    'suggested': {
      fillColor: '#fef3c7', // amber-100
      strokeColor: '#f59e0b', // amber-500
      fillOpacity: 0.7,
      strokeWidth: 3,
      pulseAnimation: true,
      hoverScale: 1.1
    },
    'blocked': {
      fillColor: '#f3f4f6', // gray-100
      strokeColor: '#9ca3af', // gray-400
      fillOpacity: 0.3,
      strokeWidth: 1,
      strokeDashArray: '3,3'
    },
    'invalid': {
      fillColor: '#fef2f2', // red-50
      strokeColor: '#ef4444', // red-500
      fillOpacity: 0.2,
      strokeWidth: 1,
      strokeDashArray: '2,2'
    }
  };

  return configs[state];
}

function getTextColor(state: BoothDisplayState): string {
  const colors: { [key in BoothDisplayState]: string } = {
    'available': '#374151', // gray-700
    'selected': '#065f46', // green-800
    'booked-by-you': '#1e40af', // blue-800
    'booked-by-others': '#991b1b', // red-800
    'valid-next': '#5b21b6', // violet-800
    'suggested': '#92400e', // amber-800
    'blocked': '#6b7280', // gray-500
    'invalid': '#b91c1c' // red-700
  };

  return colors[state];
}

function getTextFilter(state: BoothDisplayState): string {
  if (state === 'suggested') {
    return 'drop-shadow(0 0 2px rgba(245, 158, 11, 0.8))';
  }
  if (state === 'selected') {
    return 'drop-shadow(0 0 2px rgba(5, 150, 105, 0.8))';
  }
  return 'none';
}

function generateTooltipContent(
  booth: EnhancedBoothData, 
  state: BoothDisplayState,
  currentSelections: string[]
): string {
  const lines = [
    `Booth: ${booth.boothId}`,
    `Size: ${booth.size} (${booth.sqm}m²)`,
    `Status: ${formatStateForTooltip(state)}`,
    `Column: ${booth.columnId}`,
    `Price: ₦${booth.price.toLocaleString()}`
  ];

  if (booth.isSpecialBooth) {
    lines.push('Type: Special Booth');
  }

  if (currentSelections.length > 0) {
    if (state === 'valid-next') {
      lines.push('✓ Valid next selection');
    } else if (state === 'suggested') {
      lines.push('⭐ Recommended selection');
    } else if (state === 'blocked') {
      lines.push('✗ Blocked by passage');
    }
  }

  return lines.join('\n');
}

function formatStateForTooltip(state: BoothDisplayState): string {
  const stateLabels: { [key in BoothDisplayState]: string } = {
    'available': 'Available',
    'selected': 'Selected',
    'booked-by-you': 'Booked by You',
    'booked-by-others': 'Booked by Others',
    'valid-next': 'Valid Selection',
    'suggested': 'Suggested',
    'blocked': 'Blocked',
    'invalid': 'Invalid'
  };

  return stateLabels[state];
}

function renderColumnInfo(
  booth: EnhancedBoothData, 
  centerPoint: { x: number; y: number }
): JSX.Element {
  return (
    <text
      x={centerPoint.x}
      y={centerPoint.y + 15}
      textAnchor="middle"
      className="text-xs fill-gray-600 pointer-events-none"
    >
      {booth.columnId}
    </text>
  );
}

function renderStatusIndicators(
  // booth: EnhancedBoothData,
  state: BoothDisplayState,
  centerPoint: { x: number; y: number }
): JSX.Element | null {
  if (state === 'booked-by-you') {
    return (
      <circle
        cx={centerPoint.x + 15}
        cy={centerPoint.y - 15}
        r="6"
        fill="#10b981"
        stroke="#059669"
        strokeWidth="1"
        className="status-indicator"
      >
        <title>Booked by You</title>
      </circle>
    );
  }

  if (state === 'booked-by-others') {
    return (
      <g className="status-indicator">
        <circle
          cx={centerPoint.x + 15}
          cy={centerPoint.y - 15}
          r="6"
          fill="#ef4444"
          stroke="#dc2626"
          strokeWidth="1"
        />
        <path
          d={`M ${centerPoint.x + 12} ${centerPoint.y - 18} L ${centerPoint.x + 18} ${centerPoint.y - 12}`}
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <title>Booked by Others</title>
      </g>
    );
  }

  return null;
}

function renderValidationIcons(
  state: BoothDisplayState,
  centerPoint: { x: number; y: number }
): JSX.Element | null {
  const iconSize = 8;
  const iconX = centerPoint.x - 15;
  const iconY = centerPoint.y - 15;

  switch (state) {
    case 'valid-next':
      return (
        <g className="validation-icon">
          <circle
            cx={iconX}
            cy={iconY}
            r={iconSize}
            fill="#8b5cf6"
            stroke="#7c3aed"
            strokeWidth="1"
          />
          <path
            d={`M ${iconX - 3} ${iconY} L ${iconX - 1} ${iconY + 2} L ${iconX + 3} ${iconY - 2}`}
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
          <title>Valid Next Selection</title>
        </g>
      );

    case 'suggested':
      return (
        <g className="validation-icon pulse-animation">
          <circle
            cx={iconX}
            cy={iconY}
            r={iconSize}
            fill="#f59e0b"
            stroke="#d97706"
            strokeWidth="1"
          />
          <polygon
            points={`${iconX},${iconY-4} ${iconX+3},${iconY-1} ${iconX+1},${iconY+1} ${iconX+4},${iconY+4} ${iconX},${iconY+2} ${iconX-4},${iconY+4} ${iconX-1},${iconY+1} ${iconX-3},${iconY-1}`}
            fill="white"
            stroke="none"
          />
          <title>Recommended Selection</title>
        </g>
      );

    case 'blocked':
      return (
        <g className="validation-icon">
          <circle
            cx={iconX}
            cy={iconY}
            r={iconSize}
            fill="#6b7280"
            stroke="#4b5563"
            strokeWidth="1"
          />
          <text
            x={iconX}
            y={iconY + 3}
            textAnchor="middle"
            className="text-xs font-bold fill-white"
          >
            !
          </text>
          <title>Blocked by Passage</title>
        </g>
      );

    default:
      return null;
  }
}

function renderSpecialBoothMarker(centerPoint: { x: number; y: number }): JSX.Element {
  return (
    <g className="special-booth-marker">
      <circle
        cx={centerPoint.x + 20}
        cy={centerPoint.y - 20}
        r="8"
        fill="#fbbf24"
        stroke="#f59e0b"
        strokeWidth="2"
      />
      <text
        x={centerPoint.x + 20}
        y={centerPoint.y - 17}
        textAnchor="middle"
        className="text-xs font-bold fill-amber-800"
      >
        S
      </text>
      <title>Special Booth</title>
    </g>
  );
}

// CSS styles for animations (to be added to your CSS file)
export const boothValidationStyles = `
.booth-indicator.animate-state .booth-polygon {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.booth-indicator.pulse-animation .booth-polygon {
  animation: pulse-glow 2s ease-in-out infinite;
}

.booth-indicator.pulse-animation .validation-icon {
  animation: pulse-scale 2s ease-in-out infinite;
}

@keyframes pulse-glow {
  0%, 100% { 
    filter: drop-shadow(0 0 5px rgba(245, 158, 11, 0.5));
  }
  50% { 
    filter: drop-shadow(0 0 15px rgba(245, 158, 11, 0.8));
  }
}

@keyframes pulse-scale {
  0%, 100% { 
    transform: scale(1);
  }
  50% { 
    transform: scale(1.1);
  }
}

.booth-indicator:hover .booth-polygon {
  filter: brightness(1.1);
}
`;

export default BoothValidationIndicator;
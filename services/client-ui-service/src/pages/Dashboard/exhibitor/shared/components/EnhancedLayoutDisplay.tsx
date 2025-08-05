// Fixed EnhancedLayoutDisplay - No Style Property Errors

import React, { useState, useRef } from 'react';
import { ZoomIn, ZoomOut, RotateCcw, Maximize2, Move } from 'lucide-react';

interface EnhancedLayoutDisplayProps {
  layoutData: any;
  enhancedBooths: any;
  currentSelections: string[];
  validNextBooths: Set<string>;
  suggestedBooths: Set<string>;
  blockedBooths: Set<string>;
  onBoothClick: (boothId: string) => void;
  showPassageOverlay: boolean;
  layoutConfig: any;
}

const EnhancedLayoutDisplay: React.FC<EnhancedLayoutDisplayProps> = ({
  layoutData,
  enhancedBooths,
  currentSelections,
  validNextBooths,
  suggestedBooths,
  blockedBooths,
  onBoothClick,
  showPassageOverlay,
  layoutConfig
}) => {
  // Enhanced zoom and pan state
  const [zoomLevel, setZoomLevel] = useState(1);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [lastPanPoint, setLastPanPoint] = useState({ x: 0, y: 0 });
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [layoutSize, setLayoutSize] = useState<'small' | 'medium' | 'large' | 'xl'>('medium');
  
  // State for click animations - BETTER APPROACH
  const [clickedBooth, setClickedBooth] = useState<string | null>(null);
  const [clickAnimation, setClickAnimation] = useState(false);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  // Size configurations for different layout scales
  const sizeConfigs = {
    small: {
      maxWidth: '800px',
      aspectRatio: '3308/4677',
      boothLabelSize: 'text-xs',
      strokeWidth: 1,
      hoverScale: 1.05
    },
    medium: {
      maxWidth: '1200px',
      aspectRatio: '3308/4677', 
      boothLabelSize: 'text-sm',
      strokeWidth: 1.5,
      hoverScale: 1.08
    },
    large: {
      maxWidth: '1600px',
      aspectRatio: '3308/4677',
      boothLabelSize: 'text-base',
      strokeWidth: 2,
      hoverScale: 1.1
    },
    xl: {
      maxWidth: '2000px',
      aspectRatio: '3308/4677',
      boothLabelSize: 'text-lg',
      strokeWidth: 2.5,
      hoverScale: 1.12
    }
  };

  const currentConfig = sizeConfigs[layoutSize];

  // Enhanced zoom controls
  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev * 1.25, 5));
  };

  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev / 1.25, 0.25));
  };

  const handleResetView = () => {
    setZoomLevel(1);
    setPanOffset({ x: 0, y: 0 });
  };

  const handleFitToView = () => {
    if (containerRef.current) {
      const containerRect = containerRef.current.getBoundingClientRect();
      const optimalZoom = Math.min(
        containerRect.width / 3308,
        containerRect.height / 4677
      ) * 0.9;
      setZoomLevel(optimalZoom);
      setPanOffset({ x: 0, y: 0 });
    }
  };

  // Pan functionality with proper typing
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.button === 1 || (e.button === 0 && e.shiftKey)) {
      e.preventDefault();
      setIsDragging(true);
      setLastPanPoint({ x: e.clientX, y: e.clientY });
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isDragging) {
      const deltaX = e.clientX - lastPanPoint.x;
      const deltaY = e.clientY - lastPanPoint.y;
      
      setPanOffset(prev => ({
        x: prev.x + deltaX,
        y: prev.y + deltaY
      }));
      
      setLastPanPoint({ x: e.clientX, y: e.clientY });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Wheel zoom with proper typing
  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();
      const delta = e.deltaY > 0 ? 0.9 : 1.1;
      setZoomLevel(prev => Math.max(0.25, Math.min(5, prev * delta)));
    }
  };

  // Fullscreen toggle
  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
    if (!isFullscreen) {
      setLayoutSize('xl');
    } else {
      setLayoutSize('medium');
    }
  };

  // FIXED: Enhanced booth click without direct style manipulation
  const handleEnhancedBoothClick = (e: React.MouseEvent<SVGPolygonElement>, boothId: string) => {
    e.stopPropagation();
    
    // Add visual feedback for large layouts using state
    if (layoutSize === 'large' || layoutSize === 'xl') {
      setClickedBooth(boothId);
      setClickAnimation(true);
      
      // Reset animation after delay
      setTimeout(() => {
        setClickAnimation(false);
        setClickedBooth(null);
      }, 150);
    }
    
    onBoothClick(boothId);
  };

  // Enhanced booth rendering with size-appropriate details
  const renderEnhancedBooth = (boothId: string, booth: any) => {
    const points = booth.coords.map((coord: number[]) => coord.join(',')).join(' ');
    const centerX = booth.coords.reduce((sum: number, coord: number[]) => sum + coord[0], 0) / booth.coords.length;
    const centerY = booth.coords.reduce((sum: number, coord: number[]) => sum + coord[1], 0) / booth.coords.length;

    // Get booth state for styling
    const boothState = getBoothState(boothId, booth, currentSelections, validNextBooths, suggestedBooths, blockedBooths);
    const styleConfig = getEnhancedBoothStyle(boothState, layoutSize);

    // Check if this booth is currently being clicked
    const isBeingClicked = clickedBooth === boothId && clickAnimation;
    const clickScale = isBeingClicked ? 1.15 : 1;

    return (
      <g key={boothId} className="booth-group">
        {/* Enhanced booth polygon with size-appropriate styling */}
        <polygon
          points={points}
          fill={styleConfig.fillColor}
          fillOpacity={styleConfig.fillOpacity}
          stroke={styleConfig.strokeColor}
          strokeWidth={styleConfig.strokeWidth}
          strokeDasharray={styleConfig.strokeDashArray}
          className={`booth-polygon cursor-pointer transition-all duration-150 ${styleConfig.hoverClass}`}
          onClick={(e) => handleEnhancedBoothClick(e, boothId)}
          style={{
            transformOrigin: `${centerX}px ${centerY}px`,
            transform: `scale(${clickScale})`,
            transition: 'transform 0.15s ease-out'
          }}
        >
          <title>{generateEnhancedTooltip(boothId, booth, boothState)}</title>
        </polygon>

        {/* Enhanced booth label with size-appropriate text */}
        <text
          x={centerX}
          y={centerY}
          textAnchor="middle"
          dominantBaseline="middle"
          className={`${currentConfig.boothLabelSize} font-bold pointer-events-none ${styleConfig.textClass}`}
          style={{
            filter: 'drop-shadow(1px 1px 2px rgba(0,0,0,0.7))',
            transform: `scale(${clickScale})`,
            transformOrigin: `${centerX}px ${centerY}px`,
            transition: 'transform 0.15s ease-out'
          }}
        >
          {boothId}
        </text>

        {/* Additional details for larger layouts */}
        {(layoutSize === 'large' || layoutSize === 'xl') && renderBoothDetails(booth, centerX, centerY)}
        
        {/* Enhanced status indicators for larger layouts */}
        {layoutSize === 'xl' && renderEnhancedStatusIndicators(booth, centerX, centerY)}
      </g>
    );
  };

  // Render additional booth details for larger layouts
  const renderBoothDetails = (booth: any, centerX: number, centerY: number) => {
    return (
      <g className="booth-details">
        {/* Size indicator */}
        <text
          x={centerX}
          y={centerY + 20}
          textAnchor="middle"
          className="text-xs fill-gray-600 pointer-events-none"
        >
          {booth.sqm}m²
        </text>
        
        {/* Price for XL layout */}
        {layoutSize === 'xl' && (
          <text
            x={centerX}
            y={centerY + 35}
            textAnchor="middle"
            className="text-xs fill-gray-500 pointer-events-none"
          >
            ₦{(booth.price / 1000).toFixed(0)}k
          </text>
        )}
      </g>
    );
  };

  // Enhanced status indicators for XL layout
  const renderEnhancedStatusIndicators = (booth: any, centerX: number, centerY: number) => {
    const indicators = [];
    
    // Column indicator
    if (booth.columnId) {
      indicators.push(
        <circle
          key="column"
          cx={centerX - 25}
          cy={centerY - 25}
          r="8"
          fill="rgba(59, 130, 246, 0.8)"
          stroke="#2563eb"
          strokeWidth="1"
        />
      );
      indicators.push(
        <text
          key="column-text"
          x={centerX - 25}
          y={centerY - 22}
          textAnchor="middle"
          className="text-xs font-bold fill-white pointer-events-none"
        >
          {booth.columnId.split('-')[1] || 'C'}
        </text>
      );
    }

    // Special booth indicator
    if (booth.isSpecialBooth) {
      indicators.push(
        <polygon
          key="special"
          points={`${centerX + 25},${centerY - 30} ${centerX + 35},${centerY - 20} ${centerX + 25},${centerY - 10} ${centerX + 15},${centerY - 20}`}
          fill="#fbbf24"
          stroke="#f59e0b"
          strokeWidth="2"
        />
      );
    }

    return <g className="enhanced-status-indicators">{indicators}</g>;
  };

  return (
        <>
     
    <div 
      className={`enhanced-layout-container ${isFullscreen ? 'fixed inset-0 z-50 bg-white' : 'relative'}`}
      style={{ 
        maxWidth: isFullscreen ? '100vw' : currentConfig.maxWidth,
        aspectRatio: currentConfig.aspectRatio 
      }}
    >
      {/* Enhanced Control Panel */}
      <div className="layout-controls bg-white border border-gray-300 rounded-lg p-2 mb-4 flex flex-wrap items-center gap-2 shadow-sm">
        {/* Size Controls */}
        <div className="flex items-center gap-1 border-r border-gray-300 pr-2">
          <label className="text-xs font-medium text-gray-700">Size:</label>
          <select 
            value={layoutSize}
            onChange={(e) => setLayoutSize(e.target.value as any)}
            className="text-xs border border-gray-300 rounded px-2 py-1"
          >
            <option value="small">Small</option>
            <option value="medium">Medium</option>
            <option value="large">Large</option>
            <option value="xl">Extra Large</option>
          </select>
        </div>

        {/* Zoom Controls */}
        <div className="flex items-center gap-1 border-r border-gray-300 pr-2">
          <button onClick={handleZoomOut} className="p-1 hover:bg-gray-100 rounded" title="Zoom Out">
            <ZoomOut size={16} />
          </button>
          <span className="text-xs font-mono min-w-[3rem] text-center">
            {Math.round(zoomLevel * 100)}%
          </span>
          <button onClick={handleZoomIn} className="p-1 hover:bg-gray-100 rounded" title="Zoom In">
            <ZoomIn size={16} />
          </button>
        </div>

        {/* View Controls */}
        <div className="flex items-center gap-1 border-r border-gray-300 pr-2">
          <button onClick={handleResetView} className="p-1 hover:bg-gray-100 rounded" title="Reset View">
            <RotateCcw size={16} />
          </button>
          <button onClick={handleFitToView} className="p-1 hover:bg-gray-100 rounded" title="Fit to View">
            <Move size={16} />
          </button>
        </div>

        {/* Fullscreen Toggle */}
        <button 
          onClick={toggleFullscreen} 
          className="p-1 hover:bg-gray-100 rounded" 
          title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
        >
          <Maximize2 size={16} />
        </button>

        {/* Current zoom info */}
        <div className="text-xs text-gray-500 ml-auto">
          Hold Ctrl+Scroll to zoom • Shift+Click to pan
        </div>
      </div>

      {/* Enhanced Layout Display */}
      <div 
        ref={containerRef}
        className="layout-display-container bg-gray-50 rounded-lg overflow-hidden border-2 border-gray-300 relative"
        style={{ 
          cursor: isDragging ? 'grabbing' : 'grab',
          height: isFullscreen ? 'calc(100vh - 120px)' : 'auto'
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
      >
        {/* Background Image */}
        <img 
          src={layoutData.imageSrc}
          alt={`${layoutData.name} Layout`}
          className="w-full h-auto block"
          style={{
            transform: `scale(${zoomLevel}) translate(${panOffset.x / zoomLevel}px, ${panOffset.y / zoomLevel}px)`,
            transformOrigin: 'center center',
            transition: isDragging ? 'none' : 'transform 0.2s ease'
          }}
          draggable={false}
        />

        {/* Enhanced SVG Overlay */}
        <svg 
          ref={svgRef}
          className="absolute top-0 left-0 w-full h-full pointer-events-none"
          viewBox="0 0 3308 4677"
          preserveAspectRatio="none"
          style={{ 
            pointerEvents: 'all',
            transform: `scale(${zoomLevel}) translate(${panOffset.x / zoomLevel}px, ${panOffset.y / zoomLevel}px)`,
            transformOrigin: 'center center',
            transition: isDragging ? 'none' : 'transform 0.2s ease'
          }}
        >
          {/* Passage Overlay */}
          {showPassageOverlay && layoutConfig && (
            <g className="passage-overlay">
              {/* Add your PassageOverlay component here */}
            </g>
          )}
          
          {/* Enhanced Booth Rendering */}
          {Object.entries(enhancedBooths).map(([boothId, booth]: [string, any]) => 
            renderEnhancedBooth(boothId, booth)
          )}

          {/* Grid overlay for large layouts */}
          {(layoutSize === 'large' || layoutSize === 'xl') && renderGridOverlay()}
        </svg>

        {/* Zoom indicator */}
        {zoomLevel !== 1 && (
          <div className="absolute top-4 left-4 bg-black bg-opacity-75 text-white px-2 py-1 rounded text-xs">
            Zoom: {Math.round(zoomLevel * 100)}%
          </div>
        )}

        {/* Click feedback indicator */}
        {clickAnimation && clickedBooth && (
          <div className="absolute top-4 right-4 bg-blue-600 text-white px-2 py-1 rounded text-xs animate-pulse">
            Selected: {clickedBooth}
          </div>
        )}
      </div>

      {/* Enhanced Layout Info */}
      {/* <div className="layout-info mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
        <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
          <h5 className="font-semibold text-blue-800 mb-1">Layout Details</h5>
          <div className="text-blue-600">
            <div>Size: {layoutSize.toUpperCase()}</div>
            <div>Zoom: {Math.round(zoomLevel * 100)}%</div>
            <div>Booths: {Object.keys(enhancedBooths).length}</div>
          </div>
        </div>
        
        <div className="bg-green-50 rounded-lg p-3 border border-green-200">
          <h5 className="font-semibold text-green-800 mb-1">Selection Status</h5>
          <div className="text-green-600">
            <div>Selected: {currentSelections.length}</div>
            <div>Valid Next: {validNextBooths.size}</div>
            <div>Suggested: {suggestedBooths.size}</div>
          </div>
        </div>
        
        <div className="bg-amber-50 rounded-lg p-3 border border-amber-200">
          <h5 className="font-semibold text-amber-800 mb-1">Navigation Tips</h5>
          <div className="text-amber-600 text-xs">
            <div>• Ctrl+Scroll: Zoom</div>
            <div>• Shift+Click: Pan</div>
            <div>• Click booth: Select</div>
          </div>
        </div>
      </div> */}
    </div>
    </>
  );
};

// Helper functions (same as before, but without style manipulation)
function getBoothState(boothId: string, booth: any, selections: string[], valid: Set<string>, suggested: Set<string>, blocked: Set<string>) {
  if (selections.includes(boothId)) return 'selected';
  if (booth.status === 'booked-by-you') return 'booked-you';
  if (booth.status === 'booked-by-others') return 'booked-others';
  if (suggested.has(boothId)) return 'suggested';
  if (valid.has(boothId)) return 'valid';
  if (blocked.has(boothId)) return 'blocked';
  return 'available';
}

function getEnhancedBoothStyle(state: string, size: string) {
  const configs: any = {
    selected: {
      fillColor: '#10b981',
      fillOpacity: 0.8,
      strokeColor: '#059669',
      strokeWidth: size === 'xl' ? 4 : size === 'large' ? 3 : 2,
      textClass: 'fill-white',
      hoverClass: 'hover:brightness-110'
    },
    suggested: {
      fillColor: '#f59e0b',
      fillOpacity: 0.7,
      strokeColor: '#d97706',
      strokeWidth: size === 'xl' ? 3 : 2,
      textClass: 'fill-white',
      hoverClass: 'hover:brightness-110 animate-pulse'
    },
    valid: {
      fillColor: '#8b5cf6',
      fillOpacity: 0.6,
      strokeColor: '#7c3aed',
      strokeWidth: size === 'xl' ? 3 : 2,
      textClass: 'fill-white',
      hoverClass: 'hover:brightness-110'
    },
    blocked: {
      fillColor: '#6b7280',
      fillOpacity: 0.3,
      strokeColor: '#4b5563',
      strokeWidth: 1,
      strokeDashArray: '5,5',
      textClass: 'fill-gray-600',
      hoverClass: ''
    },
    available: {
      fillColor: '#ef4444',
      fillOpacity: 0.4,
      strokeColor: '#dc2626',
      strokeWidth: 1,
      textClass: 'fill-gray-800',
      hoverClass: 'hover:brightness-110'
    }
  };

  return configs[state] || configs.available;
}

function generateEnhancedTooltip(boothId: string, booth: any, state: string) {
  return [
    `Booth: ${boothId}`,
    `Size: ${booth.sqm}m² (${booth.size})`,
    `Price: ₦${booth.price.toLocaleString()}`,
    `Column: ${booth.columnId}`,
    `Status: ${state.replace('-', ' ').toUpperCase()}`,
    booth.isSpecialBooth ? 'Type: Special Booth' : '',
    state === 'suggested' ? '⭐ Recommended selection' : '',
    state === 'valid' ? '✓ Valid next choice' : '',
    state === 'blocked' ? '✗ Blocked by rules' : ''
  ].filter(Boolean).join('\n');
}

function renderGridOverlay() {
  const gridLines = [];
  const spacing = 200;
  
  // Vertical lines
  for (let x = 0; x <= 3308; x += spacing) {
    gridLines.push(
      <line
        key={`v-${x}`}
        x1={x}
        y1={0}
        x2={x}
        y2={4677}
        stroke="rgba(0,0,0,0.1)"
        strokeWidth="1"
        strokeDasharray="2,2"
      />
    );
  }
  
  // Horizontal lines
  for (let y = 0; y <= 4677; y += spacing) {
    gridLines.push(
      <line
        key={`h-${y}`}
        x1={0}
        y1={y}
        x2={3308}
        y2={y}
        stroke="rgba(0,0,0,0.1)"
        strokeWidth="1"
        strokeDasharray="2,2"
      />
    );
  }
  
  return <g className="grid-overlay">{gridLines}</g>;
}


export default EnhancedLayoutDisplay;
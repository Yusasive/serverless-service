import React, { useState, useRef, useEffect } from 'react';
import { ZoomIn, ZoomOut, Maximize2, Move } from 'lucide-react';
import BoothGrid from './booth/BoothGrid';
import { convertBoothsToGrid, getGridConfig } from '../../../../../utils/boothDataConverter';

interface EnhancedLayoutDisplayGridProps {
  layoutData: {
    name: string;
    title: string;
    type: 'hall' | 'sector';
    color: string;
    boothCount: number;
    description: string;
    imageSrc: string;
    existingBooths?: { [key: string]: any };
    ratePerSqm: number;
  };
  enhancedBooths: { [key: string]: any };
  currentSelections: string[];
  validNextBooths: Set<string>;
  suggestedBooths: Set<string>;
  blockedBooths: Set<string>;
  onBoothClick: (boothId: string) => void;
  showPassageOverlay?: boolean;
  layoutConfig?: any;
}

const EnhancedLayoutDisplayGrid: React.FC<EnhancedLayoutDisplayGridProps> = ({
  layoutData,
  enhancedBooths,
  currentSelections,
  validNextBooths,
  suggestedBooths,
  blockedBooths,
  onBoothClick,
  showPassageOverlay = true,
}) => {
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const gridContainerRef = useRef<HTMLDivElement>(null);

  // Convert coordinate-based booths to grid-based booths
// Convert coordinate-based booths to grid-based booths
const gridBooths = React.useMemo(() => {
  const boothsToConvert = enhancedBooths || layoutData.existingBooths || {};
  console.log('🔍 DEBUG - About to convert booths for:', layoutData.name);
  console.log('🔍 DEBUG - Booths before conversion:', Object.keys(boothsToConvert).map(id => ({
    id,
    gridPosition: boothsToConvert[id].gridPosition
  })));
  
  const converted = convertBoothsToGrid(boothsToConvert, layoutData.name);
  
  console.log('🔍 DEBUG - Booths after conversion:', Object.keys(converted).map(id => ({
    id,
    gridPosition: converted[id].gridPosition
  })));
  
  return converted;
}, [enhancedBooths, layoutData.existingBooths, layoutData.name]);

  // Get grid configuration for this layout
  const gridConfig = React.useMemo(() => {
    return getGridConfig(layoutData.name);
  }, [layoutData.name]);

  // Generate validation messages for blocked booths
  const validationMessages = React.useMemo(() => {
    const messages: { [boothId: string]: string } = {};
    
    blockedBooths.forEach(boothId => {
      // Check various blocking reasons
      if (currentSelections.length >= 10) {
        messages[boothId] = 'Maximum selection limit reached (10 booths)';
      } else if (gridBooths[boothId]?.status === 'booked-by-others') {
        messages[boothId] = 'Already booked by another exhibitor';
      } else if (gridBooths[boothId]?.status === 'booked-by-you') {
        messages[boothId] = 'You have already booked this booth';
      } else {
        // More specific messages based on booth location
        const boothType = boothId.startsWith('S') ? 'S' : 'N';
        if (boothType === 'S') {
          messages[boothId] = 'This booth must connect to your existing selection. S-series booths can connect vertically within their column or horizontally to adjacent S-series booths.';
        } else {
          messages[boothId] = 'This booth must connect to your existing selection. N-series booths can only connect vertically within their column.';
        }
      }
    });
    
    // Add helpful messages for suggested booths
    suggestedBooths.forEach(boothId => {
      if (!messages[boothId]) {
        messages[boothId] = 'Recommended: This booth creates an optimal layout with your current selection';
      }
    });
    
    return messages;
  }, [blockedBooths, suggestedBooths, currentSelections, gridBooths]);

  // Handle zoom
  const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.1, 2));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.1, 0.5));
  const handleResetZoom = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  // Handle pan
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button === 0 && e.ctrlKey) { // Only pan with Ctrl+Click
      setIsDragging(true);
      setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      setPan({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Handle fullscreen
  const toggleFullscreen = () => {
    if (!document.fullscreenElement && containerRef.current) {
      containerRef.current.requestFullscreen();
      setIsFullscreen(true);
    } else if (document.fullscreenElement) {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  // Listen for fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  return (
    <div 
      ref={containerRef}
      className={`enhanced-layout-display-grid ${isFullscreen ? 'fullscreen' : ''}`}
      style={{
        backgroundColor: isFullscreen ? '#f3f4f6' : 'transparent',
        height: isFullscreen ? '100vh' : 'auto',
        display: isFullscreen ? 'flex' : 'block',
        flexDirection: 'column',
        position: 'relative', // Add relative positioning
      }}
    >
      {/* Controls - Fixed positioning to prevent overlap */}
      <div 
        className="layout-controls flex justify-between items-center mb-4 p-4 bg-white rounded-lg shadow-sm"
        style={{
          position: isFullscreen ? 'fixed' : 'relative',
          top: isFullscreen ? '20px' : 'auto',
          left: isFullscreen ? '50%' : 'auto',
          transform: isFullscreen ? 'translateX(-50%)' : 'none',
          zIndex: 1000, // High z-index to stay on top
          maxWidth: '600px',
          width: isFullscreen ? '90%' : '100%',
        }}
      >
        <div className="flex items-center ">
          <button
            onClick={handleZoomOut}
            className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            title="Zoom Out"
          >
            <ZoomOut size={20} />
          </button>
          <span className="text-sm font-medium px-3">{Math.round(zoom * 100)}%</span>
          <button
            onClick={handleZoomIn}
            className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            title="Zoom In"
          >
            <ZoomIn size={20} />
          </button>
          <button
            onClick={handleResetZoom}
            className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors ml-2"
            title="Reset View"
          >
            <Move size={20} />
          </button>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="text-sm text-gray-600">
            <span className="font-medium">{currentSelections.length}</span> booths selected
          </div>
          <button
            onClick={toggleFullscreen}
            className="p-2 bg-blue-100 hover:bg-blue-200 rounded-lg transition-colors"
            title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
          >
            <Maximize2 size={20} />
          </button>
        </div>
      </div>

      {/* Grid Container */}
      <div 
        ref={gridContainerRef}
        className="grid-viewport"
        style={{
          overflow: 'auto', // Changed from conditional to always auto
          flex: isFullscreen ? 1 : 'none',
          cursor: isDragging ? 'grabbing' : 'default',
          userSelect: 'none',
          position: 'relative',
          marginTop: isFullscreen ? '80px' : '0', // Add margin to prevent overlap with fixed controls
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <div
          className="grid-transform-container"
          style={{
            transform: `scale(${zoom}) translate(${pan.x / zoom}px, ${pan.y / zoom}px)`,
            transformOrigin: 'top center', // Changed from 'center' to 'top center'
            transition: isDragging ? 'none' : 'transform 0.3s ease',
            minHeight: '500px', // Ensure minimum height
          }}
        >
          <BoothGrid
            booths={gridBooths}
            gridConfig={gridConfig}
            onBoothClick={onBoothClick}
            validNextBooths={validNextBooths}
            suggestedBooths={suggestedBooths}
            blockedBooths={blockedBooths}
            showPassageLabels={showPassageOverlay}
            layoutName={layoutData.name}
            validationMessages={validationMessages}
            currentSelections={currentSelections}
            portalContainer={containerRef.current}
            isFullscreen={isFullscreen}
            is_indoor={layoutData.type === 'hall'}
          />
        </div>
      </div>

      {/* Instructions */}
      {!isFullscreen && (
        <div className="text-center text-sm text-gray-600 mt-4">
          <p>Use zoom controls or Ctrl+Scroll to zoom • Ctrl+Click and drag to pan • Click booths to select</p>
        </div>
      )}

      {/* Fullscreen instructions */}
      {isFullscreen && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-75 text-white px-4 py-2 rounded-lg text-sm">
          Press ESC to exit fullscreen
        </div>
      )}
    </div>
  );
};

export default EnhancedLayoutDisplayGrid;
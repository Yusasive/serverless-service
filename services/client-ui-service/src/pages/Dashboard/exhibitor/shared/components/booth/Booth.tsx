import React, { useState, useRef } from 'react';
import ReactDOM from 'react-dom';

interface BoothTooltipProps {
  show: boolean;
  content: string;
  anchorRect: DOMRect | null;
  type?: 'info' | 'warning' | 'error' | 'success';
  portalContainer?: HTMLElement | null;
  isFullscreen?: boolean;
}

const TOOLTIP_WIDTH = 250;
const TOOLTIP_HEIGHT = 80;
const TOOLTIP_MARGIN = 12;

const BoothTooltip: React.FC<BoothTooltipProps> = ({ show, content, anchorRect, type = 'info', portalContainer, isFullscreen = false }) => {
  if (!show || !content || !anchorRect) return null;

  // Calculate position
  const viewportWidth = window.innerWidth;
  // const viewportHeight = window.innerHeight;

  // Default: above the booth, centered
  let left = anchorRect.left + anchorRect.width / 2 - TOOLTIP_WIDTH / 2;
  let top = anchorRect.top - TOOLTIP_HEIGHT - TOOLTIP_MARGIN;

  // If not enough space above, show below
  if (top < 0) {
    top = anchorRect.bottom + TOOLTIP_MARGIN;
  }
  // Clamp horizontally
  if (left < 8) left = 8;
  if (left + TOOLTIP_WIDTH > viewportWidth - 8) left = viewportWidth - TOOLTIP_WIDTH - 8;

  const getTooltipStyles = () => {
    const baseClasses = "fixed z-[10000] px-3 py-2 text-sm rounded-lg shadow-xl pointer-events-none transition-opacity duration-200 whitespace-pre-line";
    switch (type) {
      case 'error':
        return `${baseClasses} bg-red-600 text-white`;
      case 'warning':
        return `${baseClasses} bg-amber-500 text-white`;
      case 'success':
        return `${baseClasses} bg-green-600 text-white`;
      default:
        return `${baseClasses} bg-gray-800 text-white`;
    }
  };

  return ReactDOM.createPortal(
    <div
      className={getTooltipStyles()}
      style={{
        left,
        top,
        width: TOOLTIP_WIDTH,
        opacity: show ? 1 : 0,
      }}
    >
      {content}
      {/* Arrow */}
      <div
        style={{
          position: 'absolute',
          left: anchorRect.left + anchorRect.width / 2 - left - 6,
          top: top < anchorRect.top ? TOOLTIP_HEIGHT - 2 : -6,
          width: 0,
          height: 0,
          borderLeft: '6px solid transparent',
          borderRight: '6px solid transparent',
          borderTop: top < anchorRect.top ? '6px solid #1f2937' : undefined,
          borderBottom: top < anchorRect.top ? undefined : '6px solid #1f2937',
        }}
      />
    </div>,
    isFullscreen && portalContainer ? portalContainer : document.body
  );
};

interface BoothProps {
  boothId: string;
  status: 'available' | 'selected' | 'booked-by-you' | 'booked-by-others';
  size: string;
  category: 'Standard' | 'Premium';
  price: number;
  sqm: number;
  gridPosition: {
    row: number;
    col: number;
    rowSpan?: number;
    colSpan?: number;
  };
  onBoothClick: (boothId: string) => void;
  isValidNext?: boolean;
  isSuggested?: boolean;
  isBlocked?: boolean;
  validationMessage?: string;
  portalContainer?: HTMLElement | null;
  isFullscreen?: boolean;
  is_indoor?: boolean;
}

const Booth: React.FC<BoothProps> = ({
  boothId,
  is_indoor,
  status,
  // size,
  sqm,
  price,
   category,
  gridPosition,
  onBoothClick,
  isValidNext = false,
  isSuggested = false,
  isBlocked = false,
  validationMessage,
  portalContainer,
  isFullscreen = false,
}) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const [anchorRect, setAnchorRect] = useState<DOMRect | null>(null);
  const boothRef = useRef<HTMLDivElement>(null);

  // Format status for display
  const getStatusDisplay = () => {
    switch (status) {
      case 'available':
        return 'Available';
      case 'selected':
        return 'Selected';
      case 'booked-by-you':
        return 'Booked by You';
      case 'booked-by-others':
        return 'Booked by Others';
      default:
        return status;
    }
  };

  // Determine tooltip content and type
  const getTooltipInfo = () => {
    // Always show status and sqm
    const getIndoorStatus = () => {
      if (is_indoor) {
        return 'Indoor';
      } else {
        return 'Outdoor';
      }
    }
    const statusDisplay = getStatusDisplay();
    const baseInfo = `Status: ${statusDisplay}(${getIndoorStatus()}) - ${category}`;
   // const baseInfo = `Status: ${statusDisplay} | Size: ${sqm}m² | Category: ${category} `;

    // Special booth handling
    if (boothId === 'S009') {
      return { 
        content: `${baseInfo}\nSpecial booth - Cannot be combined`, 
        type: 'warning' as const 
      };
    }

    // Add additional context based on state
    if (status === 'booked-by-others') {
      return { 
        content: `${baseInfo}\nAlready booked by another exhibitor`, 
        type: 'error' as const 
      };
    }
    if (status === 'booked-by-you') {
      return { 
        content: `${baseInfo}\nYou have already booked this booth`, 
        type: 'info' as const 
      };
    }
    if (status === 'selected') {
      return { 
        content: `${baseInfo}\nClick to remove from selection`, 
        type: 'success' as const 
      };
    }
    if (isBlocked) {
      return { 
        content: `${baseInfo}\n${validationMessage || 'Cannot be selected due to layout restrictions'}`, 
        type: 'warning' as const 
      };
    }
    if (isSuggested) {
      return { 
        content: `${baseInfo}\nRecommended for optimal layout`, 
        type: 'success' as const 
      };
    }
    if (isValidNext) {
      return { 
        content: `${baseInfo}\nValid for selection`, 
        type: 'info' as const 
      };
    }

    // Default - show status, sqm, and price
    return { 
      content: `${baseInfo}\nPrice: ₦${price.toLocaleString()}`, 
      type: 'info' as const 
    };
  };

  const handleMouseEnter = () => {
    if (boothRef.current) {
      setAnchorRect(boothRef.current.getBoundingClientRect());
      setShowTooltip(true);
    }
  };
  const handleMouseLeave = () => {
    setShowTooltip(false);
    setAnchorRect(null);
  };

  // Determine booth colors based on status and validation states
  const getBoothClasses = () => {
    const baseClasses = "booth-cell relative flex items-center justify-center font-bold text-xs transition-all duration-300 cursor-pointer select-none";
    
    let statusClasses = "";
    let borderClasses = "border border-gray-400";
    
    // Base status colors
    if (boothId === 'S009') {
      if (status === 'available') {
        statusClasses = "bg-yellow-100 hover:bg-yellow-200";
        borderClasses = "border-2 border-yellow-600 border-dashed";
      }
    } else {
      switch (status) {
        case 'available':
          statusClasses = "bg-red-50 hover:bg-red-100";
          break;
        case 'selected':
          statusClasses = "bg-green-300 hover:bg-green-400";
          borderClasses = "border-2 border-green-600";
          break;
        case 'booked-by-you':
          statusClasses = "bg-blue-300 hover:bg-blue-400";
          borderClasses = "border-2 border-blue-700";
          break;
        case 'booked-by-others':
          statusClasses = "bg-gray-300 hover:bg-gray-400 cursor-not-allowed opacity-60";
          borderClasses = "border-2 border-gray-600";
          break;
      }
    }   
    
    // Validation state overlays
    if (isBlocked && status === 'available') {
      statusClasses = "bg-gray-100 hover:bg-gray-200 cursor-not-allowed opacity-50";
      borderClasses = "border border-gray-400 border-dashed";
    } else if (isValidNext && status === 'available') {
      borderClasses = "border-2 border-purple-600 shadow-md";
    } else if (isSuggested && status === 'available') {
      statusClasses = "bg-amber-100 hover:bg-amber-200 animate-pulse";
      borderClasses = "border-2 border-amber-500";
    }
    
    // Add hover z-index class
    const hoverZIndex = showTooltip ? "z-50" : "z-10 hover:z-40";
    
    return `${baseClasses} ${statusClasses} ${borderClasses} ${hoverZIndex}`;
  };

  // Grid positioning styles
  const gridStyles: React.CSSProperties = {
    gridRow: `${gridPosition.row} / span ${gridPosition.rowSpan || 1}`,
    gridColumn: `${gridPosition.col} / span ${gridPosition.colSpan || 1}`,
    aspectRatio: '1 / 1',
    height: '100%',
    width: '100%',
    minHeight: '60px',
    maxHeight: '80px',
    minWidth: '60px',
    maxWidth: '80px',
  };

  // Extract booth number from ID
  let displayId = boothId;
  if (boothId.includes('-')) {
    displayId = boothId.split('-').pop() || boothId;
  }

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (status !== 'booked-by-others' && !isBlocked) {
      onBoothClick(boothId);
    }
  };

  const tooltipInfo = getTooltipInfo();

  return (
    <>
      <div
        ref={boothRef}
        className={getBoothClasses()}
        style={{ ...gridStyles, position: 'relative' }}
        onClick={handleClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        data-booth-id={boothId}
        data-status={status}
      >
        <div className="booth-content text-center">
     <div className={`booth-id font-bold text-sm md:text-base ${(boothId.startsWith('CGA') || boothId.startsWith('COP')) ? 'text-right pr-2' : ''}`}>
  {displayId}
</div>
          <div className="booth-size text-xs opacity-75">{sqm}m²</div>
        </div>
        {/* Visual indicators for validation states */}
        {isValidNext && status === 'available' && (
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-purple-600 rounded-full animate-ping"></div>
        )}
        {isSuggested && status === 'available' && (
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-amber-500 rounded-full animate-pulse"></div>
        )}
      </div>
      <BoothTooltip
        show={showTooltip}
        content={tooltipInfo.content}
        anchorRect={anchorRect}
        type={tooltipInfo.type}
        portalContainer={portalContainer}
        isFullscreen={isFullscreen}
      />
    </>
  );
};

export default Booth;
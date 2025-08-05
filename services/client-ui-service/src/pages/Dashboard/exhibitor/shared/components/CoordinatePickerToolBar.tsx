import React, { useState, useRef, useEffect } from 'react';

interface CoordinatePickerToolbarProps {
  isActive: boolean;
  onToggle: () => void;
  onUndo: () => void;
  onClear: () => void;
  onComplete: (name: string, type: string) => void;
  onExport: () => void;
  currentPointsCount: number;
  mode: 'create' | 'edit';
  onModeChange: (mode: 'create' | 'edit') => void;
}

const CoordinatePickerToolbar: React.FC<CoordinatePickerToolbarProps> = ({
  isActive,
  onToggle,
  onUndo,
  onClear,
  onComplete,
  onExport,
  currentPointsCount,
  mode,
  onModeChange
}) => {
  const [polygonName, setPolygonName] = useState('');
  const [polygonType, setPolygonType] = useState('sector');
  
  // Dragging state
  const [position, setPosition] = useState({ x: 20, y: window.innerHeight - 400 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const toolbarRef = useRef<HTMLDivElement>(null);

  const handleComplete = () => {
    if (!polygonName.trim()) {
      alert('Please enter a name for the polygon');
      return;
    }
    onComplete(polygonName, polygonType);
    setPolygonName('');
    setPolygonType('sector');
  };

  // Dragging handlers
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).classList.contains('drag-handle')) {
      setIsDragging(true);
      setDragStart({
        x: e.clientX - position.x,
        y: e.clientY - position.y
      });
    }
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, dragStart]);

  return (
    <div 
      ref={toolbarRef}
      className="fixed bg-white bg-opacity-95 border-2 border-gray-800 rounded-lg shadow-lg z-50"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        width: '300px'
      }}
      onMouseDown={handleMouseDown}
    >
      {/* Drag Handle */}
      <div className="drag-handle bg-gray-700 text-white p-2 rounded-t-md cursor-move flex justify-between items-center">
        <span className="text-sm font-semibold">📍 Coordinate Picker</span>
        <span className="text-xs opacity-70">Drag to move</span>
      </div>
      
      <div className="p-4">
        {/* Mode Toggle */}
        <div className="mb-3">
          <div className="flex gap-2">
            <button
              onClick={() => onModeChange('create')}
              className={`px-3 py-1 rounded text-sm font-medium transition-all ${
                mode === 'create' 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Create
            </button>
            <button
              onClick={() => onModeChange('edit')}
              className={`px-3 py-1 rounded text-sm font-medium transition-all ${
                mode === 'edit' 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Edit
            </button>
          </div>
        </div>

        {/* Activate Button */}
        <button
          onClick={onToggle}
          className={`w-full mb-3 px-4 py-2 rounded font-bold text-sm transition-all ${
            isActive
              ? 'bg-red-500 text-white hover:bg-red-600'
              : 'bg-green-500 text-white hover:bg-green-600'
          }`}
        >
          {isActive ? '⏹️ Stop Picking' : '▶️ Start Picking'}
        </button>

        {/* Status */}
        {isActive && (
          <div className="mb-3 p-2 bg-blue-50 rounded text-sm">
            <p className="font-medium">Points: {currentPointsCount}</p>
            <p className="text-xs text-gray-600">Click on the map to add points</p>
          </div>
        )}

        {/* Controls - Only show when active and in create mode */}
        {isActive && mode === 'create' && currentPointsCount > 0 && (
          <>
            <div className="space-y-2 mb-3">
              <button
                onClick={onUndo}
                className="w-full px-3 py-1 bg-yellow-500 text-white rounded text-sm font-medium hover:bg-yellow-600 transition-all"
                disabled={currentPointsCount === 0}
              >
                ↩️ Undo Last Point
              </button>
              <button
                onClick={onClear}
                className="w-full px-3 py-1 bg-red-500 text-white rounded text-sm font-medium hover:bg-red-600 transition-all"
              >
                🗑️ Clear All Points
              </button>
            </div>

            {/* Complete Polygon Form */}
            {currentPointsCount >= 3 && (
              <div className="border-t pt-3">
                <input
                  type="text"
                  placeholder="Polygon name"
                  value={polygonName}
                  onChange={(e) => setPolygonName(e.target.value)}
                  className="w-full mb-2 px-2 py-1 border rounded text-sm"
                />
                <select
                  value={polygonType}
                  onChange={(e) => setPolygonType(e.target.value)}
                  className="w-full mb-2 px-2 py-1 border rounded text-sm"
                >
                  <option value="sector">Sector</option>
                  <option value="hall">Hall</option>
                  <option value="cga-sector">CGA Sector</option>
                  <option value="eei-sector">EEI Sector</option>
                  <option value="fda-sector">FDA Sector</option>
                  <option value="hct-sector">HCT Sector</option>
                  <option value="ta-sector">TA Sector</option>
                  <option value="rbf-sector">RBF Sector</option>
                  <option value="cog-sector">COG Sector</option>
                  <option value="oth-sector">OTH Sector</option>
                </select>
                <button
                  onClick={handleComplete}
                  className="w-full px-3 py-1 bg-green-500 text-white rounded text-sm font-medium hover:bg-green-600 transition-all"
                >
                  ✅ Complete Polygon
                </button>
              </div>
            )}
          </>
        )}

        {/* Export Button */}
        <button
          onClick={onExport}
          className="w-full mt-3 px-3 py-1 bg-purple-500 text-white rounded text-sm font-medium hover:bg-purple-600 transition-all"
        >
          💾 Export All Polygons
        </button>
      </div>
    </div>
  );
};

export default CoordinatePickerToolbar;
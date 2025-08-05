import React, { useState } from 'react';

interface GridSettings {
  enabled: boolean;
  snapToGrid: boolean;
  gridSize: number;
}

interface DetailLayoutToolbarProps {
  isActive: boolean;
  onToggle: () => void;
  onUndo: () => void;
  onClear: () => void;
  onComplete: (boothNumber: string, category: 'Standard' | 'Premium', pricePerSqm: number) => void;
  onExport: () => void;
  onBatchCreate: (
    startNumber: number,
    count: number,
    width: number,
    height: number,
    category: 'Standard' | 'Premium',
    pricePerSqm: number,
    direction: 'horizontal' | 'vertical'
  ) => void;
  currentPointsCount: number;
  drawMode: 'polygon' | 'rectangle';
  onDrawModeChange: (mode: 'polygon' | 'rectangle') => void;
  gridSettings: GridSettings;
  onGridSettingsChange: (settings: GridSettings) => void;
  hallName: string;
  ratePerSqm: number;
}

const DetailLayoutToolbar: React.FC<DetailLayoutToolbarProps> = ({
  isActive,
  onToggle,
  onUndo,
  onClear,
  onComplete,
  onExport,
  onBatchCreate,
  currentPointsCount,
  drawMode,
  onDrawModeChange,
  gridSettings,
  onGridSettingsChange,
  hallName,
  ratePerSqm
}) => {
  const [boothNumber, setBoothNumber] = useState('');
  const [category, setCategory] = useState<'Standard' | 'Premium'>('Standard');
  const [showBatchCreate, setShowBatchCreate] = useState(false);
  
  // Batch create form state
  const [batchStartNumber, setBatchStartNumber] = useState(1);
  const [batchCount, setBatchCount] = useState(10);
  const [batchWidth, setBatchWidth] = useState(300); // 3m in cm
  const [batchHeight, setBatchHeight] = useState(300); // 3m in cm
  const [batchDirection, setBatchDirection] = useState<'horizontal' | 'vertical'>('horizontal');

  const handleComplete = () => {
    if (!boothNumber.trim()) {
      alert('Please enter a booth number');
      return;
    }
    onComplete(boothNumber, category, ratePerSqm);
    setBoothNumber('');
  };

  const handleBatchCreate = () => {
    onBatchCreate(
      batchStartNumber,
      batchCount,
      batchWidth,
      batchHeight,
      category,
      ratePerSqm,
      batchDirection
    );
    setShowBatchCreate(false);
  };

  const minPoints = drawMode === 'rectangle' ? 2 : 3;
  const canComplete = drawMode === 'rectangle' ? currentPointsCount >= 2 : currentPointsCount >= 3;

  return (
    <div className="bg-white bg-opacity-95 border-2 border-gray-800 rounded-lg p-4 shadow-lg mb-4">
      <h3 className="text-lg font-semibold mb-3">🏢 {hallName} - Booth Coordinate Picker</h3>
      
      {/* Draw Mode Toggle */}
      <div className="mb-3">
        <label className="text-sm font-medium mb-1 block">Draw Mode:</label>
        <div className="flex gap-2">
          <button
            onClick={() => onDrawModeChange('rectangle')}
            className={`px-3 py-1 rounded text-sm font-medium transition-all ${
              drawMode === 'rectangle' 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            ▭ Rectangle
          </button>
          <button
            onClick={() => onDrawModeChange('polygon')}
            className={`px-3 py-1 rounded text-sm font-medium transition-all ${
              drawMode === 'polygon' 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            ⬟ Polygon
          </button>
        </div>
      </div>

      {/* Grid Settings */}
      <div className="mb-3 p-2 bg-gray-50 rounded">
        <label className="flex items-center text-sm">
          <input
            type="checkbox"
            checked={gridSettings.enabled}
            onChange={(e) => onGridSettingsChange({ ...gridSettings, enabled: e.target.checked })}
            className="mr-2"
          />
          Show Grid
        </label>
        <label className="flex items-center text-sm mt-1">
          <input
            type="checkbox"
            checked={gridSettings.snapToGrid}
            onChange={(e) => onGridSettingsChange({ ...gridSettings, snapToGrid: e.target.checked })}
            className="mr-2"
          />
          Snap to Grid
        </label>
        <label className="flex items-center text-sm mt-1">
          Grid Size:
          <input
            type="number"
            value={gridSettings.gridSize}
            onChange={(e) => onGridSettingsChange({ ...gridSettings, gridSize: parseInt(e.target.value) || 50 })}
            className="ml-2 w-16 px-1 border rounded text-sm"
            min="10"
            max="200"
            step="10"
          />
          cm
        </label>
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
        {isActive ? '⏹️ Stop Drawing' : '▶️ Start Drawing'}
      </button>

      {/* Status */}
      {isActive && (
        <div className="mb-3 p-2 bg-blue-50 rounded text-sm">
          <p className="font-medium">Points: {currentPointsCount}/{minPoints}</p>
          <p className="text-xs text-gray-600">
            {drawMode === 'rectangle' 
              ? 'Click two opposite corners to create a rectangle'
              : 'Click to add points for polygon'}
          </p>
        </div>
      )}

      {/* Controls */}
      {isActive && currentPointsCount > 0 && (
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

          {/* Complete Booth Form */}
          {canComplete && (
            <div className="border-t pt-3">
              <input
                type="text"
                placeholder="Booth number (e.g., N001)"
                value={boothNumber}
                onChange={(e) => setBoothNumber(e.target.value)}
                className="w-full mb-2 px-2 py-1 border rounded text-sm"
              />
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as 'Standard' | 'Premium')}
                className="w-full mb-2 px-2 py-1 border rounded text-sm"
              >
                <option value="Standard">Standard</option>
                <option value="Premium">Premium</option>
              </select>
              <p className="text-xs text-gray-600 mb-2">
                Rate: ₦{ratePerSqm.toLocaleString()}/m²
              </p>
              <button
                onClick={handleComplete}
                className="w-full px-3 py-1 bg-green-500 text-white rounded text-sm font-medium hover:bg-green-600 transition-all"
              >
                ✅ Complete Booth
              </button>
            </div>
          )}
        </>
      )}

      {/* Batch Create Button */}
      <button
        onClick={() => setShowBatchCreate(!showBatchCreate)}
        className="w-full mt-3 px-3 py-1 bg-purple-500 text-white rounded text-sm font-medium hover:bg-purple-600 transition-all"
      >
        ⚡ Batch Create Booths
      </button>

      {/* Batch Create Form */}
      {showBatchCreate && (
        <div className="mt-3 p-3 bg-purple-50 rounded">
          <h4 className="font-medium text-sm mb-2">Batch Create Settings</h4>
          <div className="space-y-2">
            <input
              type="number"
              placeholder="Start number"
              value={batchStartNumber}
              onChange={(e) => setBatchStartNumber(parseInt(e.target.value) || 1)}
              className="w-full px-2 py-1 border rounded text-sm"
            />
            <input
              type="number"
              placeholder="Number of booths"
              value={batchCount}
              onChange={(e) => setBatchCount(parseInt(e.target.value) || 10)}
              className="w-full px-2 py-1 border rounded text-sm"
            />
            <div className="flex gap-2">
              <input
                type="number"
                placeholder="Width (cm)"
                value={batchWidth}
                onChange={(e) => setBatchWidth(parseInt(e.target.value) || 300)}
                className="w-full px-2 py-1 border rounded text-sm"
              />
              <input
                type="number"
                placeholder="Height (cm)"
                value={batchHeight}
                onChange={(e) => setBatchHeight(parseInt(e.target.value) || 300)}
                className="w-full px-2 py-1 border rounded text-sm"
              />
            </div>
            <select
              value={batchDirection}
              onChange={(e) => setBatchDirection(e.target.value as 'horizontal' | 'vertical')}
              className="w-full px-2 py-1 border rounded text-sm"
            >
              <option value="horizontal">Horizontal Layout</option>
              <option value="vertical">Vertical Layout</option>
            </select>
            <button
              onClick={handleBatchCreate}
              className="w-full px-3 py-1 bg-purple-600 text-white rounded text-sm font-medium hover:bg-purple-700 transition-all"
            >
              Create {batchCount} Booths
            </button>
          </div>
        </div>
      )}

      {/* Export Button */}
      <button
        onClick={onExport}
        className="w-full mt-3 px-3 py-1 bg-teal-500 text-white rounded text-sm font-medium hover:bg-teal-600 transition-all"
      >
        💾 Export Booth Coordinates
      </button>
    </div>
  );
};

export default DetailLayoutToolbar;
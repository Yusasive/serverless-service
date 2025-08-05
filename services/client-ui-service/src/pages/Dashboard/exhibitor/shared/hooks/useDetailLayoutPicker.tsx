import { useState, useCallback, useRef } from 'react';

interface Point {
  x: number;
  y: number;
}

interface BoothCoordinate {
  id: string;
  boothId: string;
  points: Point[];
  size: string;
  category: 'Standard' | 'Premium';
  price: number;
  sqm: number;
  hallName: string;
  completed: boolean;
}

interface GridSettings {
  enabled: boolean;
  snapToGrid: boolean;
  gridSize: number;
}


export const useDetailLayoutPicker = (hallName: string, viewBoxWidth: number = 3308, viewBoxHeight: number = 4677) => {
  const [isPickerActive, setIsPickerActive] = useState(false);
  const [currentPoints, setCurrentPoints] = useState<Point[]>([]);
  const [booths, setBooths] = useState<BoothCoordinate[]>([]);
  const [selectedBoothId, setSelectedBoothId] = useState<string | null>(null);
  const [drawMode, setDrawMode] = useState<'polygon' | 'rectangle'>('rectangle');
  const [gridSettings, setGridSettings] = useState<GridSettings>({
    enabled: true,
    snapToGrid: true,
    gridSize: 50
  });
  const boothIdCounter = useRef(1);

  const snapToGrid = useCallback((value: number) => {
    if (!gridSettings.snapToGrid) return value;
    return Math.round(value / gridSettings.gridSize) * gridSettings.gridSize;
  }, [gridSettings]);

  const addPoint = useCallback((x: number, y: number) => {
    if (!isPickerActive) return;
    
    const snappedX = snapToGrid(x);
    const snappedY = snapToGrid(y);
    const newPoint = { x: snappedX, y: snappedY };

    if (drawMode === 'rectangle' && currentPoints.length === 1) {
      // For rectangle mode, automatically complete the rectangle
      const firstPoint = currentPoints[0];
      const rectanglePoints = [
        firstPoint,
        { x: snappedX, y: firstPoint.y },
        { x: snappedX, y: snappedY },
        { x: firstPoint.x, y: snappedY }
      ];
      setCurrentPoints(rectanglePoints);
    } else {
      setCurrentPoints(prev => [...prev, newPoint]);
    }
  }, [isPickerActive, drawMode, currentPoints, snapToGrid]);

  const removeLastPoint = useCallback(() => {
    setCurrentPoints(prev => prev.slice(0, -1));
  }, []);

  const clearCurrentPoints = useCallback(() => {
    setCurrentPoints([]);
  }, []);

  const calculateBoothSize = useCallback((points: Point[]) => {
    if (points.length < 3) return { width: 0, height: 0, sqm: 0, sizeStr: '0m x 0m' };
    
    const xs = points.map(p => p.x);
    const ys = points.map(p => p.y);
    const minX = Math.min(...xs);
    const maxX = Math.max(...xs);
    const minY = Math.min(...ys);
    const maxY = Math.max(...ys);
    
    // Assuming 1 unit = 1cm, convert to meters
    const widthCm = maxX - minX;
    const heightCm = maxY - minY;
    const widthM = widthCm / 100;
    const heightM = heightCm / 100;
    
    // Calculate area
    const sqm = Math.round(widthM * heightM);
    const sizeStr = `${widthM}m x ${heightM}m`;
    
    return { width: widthM, height: heightM, sqm, sizeStr };
  }, []);

  const completeBooth = useCallback((boothNumber: string, category: 'Standard' | 'Premium', pricePerSqm: number) => {
    const minPoints = drawMode === 'rectangle' ? 4 : 3;
    if (currentPoints.length < minPoints) {
      alert(`A ${drawMode} needs at least ${minPoints} points`);
      return;
    }

    const { sqm, sizeStr } = calculateBoothSize(currentPoints);
    const totalPrice = sqm * pricePerSqm;

    const newBooth: BoothCoordinate = {
      id: `booth-${hallName}-${boothIdCounter.current++}`,
      boothId: boothNumber,
      points: [...currentPoints],
      size: sizeStr,
      category,
      price: totalPrice,
      sqm,
      hallName,
      completed: true
    };

    setBooths(prev => [...prev, newBooth]);
    setCurrentPoints([]);
  }, [currentPoints, drawMode, hallName, calculateBoothSize]);

  const deleteBooth = useCallback((id: string) => {
    setBooths(prev => prev.filter(b => b.id !== id));
    if (selectedBoothId === id) {
      setSelectedBoothId(null);
    }
  }, [selectedBoothId]);

  const batchCreateBooths = useCallback((
    startNumber: number,
    count: number,
    width: number,
    height: number,
    category: 'Standard' | 'Premium',
    pricePerSqm: number,
    direction: 'horizontal' | 'vertical'
  ) => {
    const newBooths: BoothCoordinate[] = [];
    const spacing = 10; // 10cm spacing between booths
    
    for (let i = 0; i < count; i++) {
      const boothNumber = `N${String(startNumber + i).padStart(3, '0')}`;
      const offset = i * (direction === 'horizontal' ? width + spacing : height + spacing);
      
      const x = direction === 'horizontal' ? offset : 0;
      const y = direction === 'vertical' ? offset : 0;
      
      const points = [
        { x: snapToGrid(x), y: snapToGrid(y) },
        { x: snapToGrid(x + width), y: snapToGrid(y) },
        { x: snapToGrid(x + width), y: snapToGrid(y + height) },
        { x: snapToGrid(x), y: snapToGrid(y + height) }
      ];
      
      const { sqm, sizeStr } = calculateBoothSize(points);
      const totalPrice = sqm * pricePerSqm;
      
      newBooths.push({
        id: `booth-${hallName}-${boothIdCounter.current++}`,
        boothId: boothNumber,
        points,
        size: sizeStr,
        category,
        price: totalPrice,
        sqm,
        hallName,
        completed: true
      });
    }
    
    setBooths(prev => [...prev, ...newBooths]);
  }, [hallName, snapToGrid, calculateBoothSize]);

  const getPointsString = useCallback((points: Point[]) => {
    return points.map(p => `${p.x},${p.y}`).join(' ');
  }, []);

  const exportBoothCoordinates = useCallback(() => {
    const exportData = booths.map(booth => ({
      boothId: booth.boothId,
      coords: booth.points.map(p => [p.x, p.y]),
      status: 'available',
      size: booth.size,
      category: booth.category,
      price: booth.price,
      sqm: booth.sqm,
      hallName: booth.hallName
    }));

    const codeFormat = booths.reduce((acc, booth) => {
      acc[booth.boothId] = {
        coords: booth.points.map(p => [p.x, p.y]),
        status: 'available',
        size: booth.size,
        category: booth.category,
        price: booth.price,
        sqm: booth.sqm,
        boothId: booth.boothId
      };
      return acc;
    }, {} as Record<string, any>);

    const exportObj = {
      hallName,
      totalBooths: booths.length,
      generatedAt: new Date().toISOString(),
      viewBox: { width: viewBoxWidth, height: viewBoxHeight },
      booths: exportData,
      codeFormat
    };

    const dataStr = JSON.stringify(exportObj, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${hallName.toLowerCase().replace(/\s+/g, '-')}-booth-coordinates-${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);
  }, [booths, hallName, viewBoxWidth, viewBoxHeight]);

  const calculateSvgCoordinates = useCallback((event: React.MouseEvent<SVGSVGElement | HTMLImageElement>, element: Element) => {
    const rect = element.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * viewBoxWidth;
    const y = ((event.clientY - rect.top) / rect.height) * viewBoxHeight;
    return { x: Math.round(x), y: Math.round(y) };
  }, [viewBoxWidth, viewBoxHeight]);

  return {
    // State
    isPickerActive,
    currentPoints,
    booths,
    selectedBoothId,
    drawMode,
    gridSettings,
    
    // Actions
    setIsPickerActive,
    addPoint,
    removeLastPoint,
    clearCurrentPoints,
    completeBooth,
    deleteBooth,
    setSelectedBoothId,
    setDrawMode,
    setGridSettings,
    batchCreateBooths,
    
    // Utilities
    getPointsString,
    exportBoothCoordinates,
    calculateSvgCoordinates,
    calculateBoothSize
  };
};
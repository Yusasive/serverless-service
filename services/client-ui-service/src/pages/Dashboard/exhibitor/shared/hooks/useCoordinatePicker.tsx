import { useState, useCallback, useRef } from 'react';

interface Point {
  x: number;
  y: number;
}

interface PolygonData {
  id: string;
  points: Point[];
  name: string;
  type: string;
  completed: boolean;
}


export const useCoordinatePicker = (viewBoxWidth: number = 3308, viewBoxHeight: number = 2340) => {
  const [isPickerActive, setIsPickerActive] = useState(false);
  const [currentPoints, setCurrentPoints] = useState<Point[]>([]);
  const [polygons, setPolygons] = useState<PolygonData[]>([]);
  const [selectedPolygonId, setSelectedPolygonId] = useState<string | null>(null);
  const [pickerMode, setPickerMode] = useState<'create' | 'edit'>('create');
  const polygonIdCounter = useRef(1);

  const addPoint = useCallback((x: number, y: number) => {
    if (!isPickerActive) return;
    
    const newPoint = { x: Math.round(x), y: Math.round(y) };
    setCurrentPoints(prev => [...prev, newPoint]);
  }, [isPickerActive]);

  const removeLastPoint = useCallback(() => {
    setCurrentPoints(prev => prev.slice(0, -1));
  }, []);

  const clearCurrentPoints = useCallback(() => {
    setCurrentPoints([]);
  }, []);

  const completePolygon = useCallback((name: string, type: string) => {
    if (currentPoints.length < 3) {
      alert('A polygon needs at least 3 points');
      return;
    }

    const newPolygon: PolygonData = {
      id: `polygon-${polygonIdCounter.current++}`,
      points: [...currentPoints],
      name,
      type,
      completed: true
    };

    setPolygons(prev => [...prev, newPolygon]);
    setCurrentPoints([]);
  }, [currentPoints]);

  const deletePolygon = useCallback((id: string) => {
    setPolygons(prev => prev.filter(p => p.id !== id));
    if (selectedPolygonId === id) {
      setSelectedPolygonId(null);
    }
  }, [selectedPolygonId]);

  const getPointsString = useCallback((points: Point[]) => {
    return points.map(p => `${p.x},${p.y}`).join(' ');
  }, []);

  const getPolygonString = useCallback((points: Point[]) => {
    return points.map(p => `${p.x},${p.y}`).join(',');
  }, []);

  const exportPolygons = useCallback(() => {
    const exportData = polygons.map(polygon => ({
      id: polygon.id,
      name: polygon.name,
      type: polygon.type,
      pointsString: getPolygonString(polygon.points),
      points: polygon.points
    }));

    const dataStr = JSON.stringify(exportData, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `main-site-coordinates-${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);
  }, [polygons, getPolygonString]);

  const copyToClipboard = useCallback((text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      console.log('Coordinates copied to clipboard');
    }).catch(err => {
      console.error('Failed to copy coordinates:', err);
    });
  }, []);

  const togglePicker = useCallback(() => {
    setIsPickerActive(prev => !prev);
    if (isPickerActive) {
      // Clear current points when deactivating
      setCurrentPoints([]);
    }
  }, [isPickerActive]);

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
    polygons,
    selectedPolygonId,
    pickerMode,
    
    // Actions
    setIsPickerActive,
    addPoint,
    removeLastPoint,
    clearCurrentPoints,
    completePolygon,
    deletePolygon,
    setSelectedPolygonId,
    setPickerMode,
    togglePicker,
    
    // Utilities
    getPointsString,
    getPolygonString,
    exportPolygons,
    copyToClipboard,
    calculateSvgCoordinates
  };
};
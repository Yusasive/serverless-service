import React, { useState, useCallback, useEffect,  useMemo } from 'react';
import TwoStepBoothReservation from './TwoStepBoothReservation';
import { useTwoStepModalProps } from '../../../../hooks/useTwoStepModalProps';
import { useDispatch, useSelector } from 'react-redux';
import { getUserBoothReservations } from '../../../../store/booth-slice';
import { useUser } from '@/context/UserContext';
import { useCoordinatePicker } from './hooks/useCoordinatePicker';
// import CoordinatePickerToolbar from './components/CoordinatePickerToolBar';
import PolygonList from './components/PolygonList';
import CoordinatePickerOverlay from './components/CoordinatePickerOverlay';
import CurrentPointsDisplay from './components/CurrentPointsDisplay';
// import {useDetailLayoutPicker} from './hooks/useDetailLayoutPicker';
// import DetailBoothList from './components/DetailBoothList';
// import DetailLayoutOverlay from './components/DetailLayoutOverlay';
// import DetailLayoutToolbar from './components/DetailLayoutToolBar';
import  { getBoothsForLocation} from'./components/BoothsData/boothDataManager';
import { INDOOR_PRICING, OUTDOOR_PRICING, PREMIUM_OUTDOOR_PRICING, MINIMUM_REQUIREMENTS } from './components/BoothsData/pricingConfig';
import EnhancedUnifiedInteractiveLayout  from './EnhancedBoothManagement';
import {  groupBoothsByLocation } from '../../../../utils/priceCalculations';

// interface SelectedBoothExtended extends BoothData {
//   selectedAt: string;
//   locationName: string;
//   locationType: 'hall' | 'sector';
// }
// //import { internationalHallBooths } from './components/BoothsData/internationalHallBooths';
// // Types and Interfaces
// interface Coordinate {
//   x: number;
//   y: number;
// }

interface BoothData {
  coords: number[][];
  status: 'available' | 'selected' | 'booked-by-you' | 'booked-by-others';
  size: string;
  category: 'Standard' | 'Premium';
  price: number;
  sqm: number;
  boothId?: string; // Optional, can be used for unique identification
}

interface SectorData {
  name: string;
  description: string;
  color: string;
  boothCount: number;
  ranges: string[];
}

interface SelectedBooth extends BoothData {
  selectedAt: string;
}

interface BoothSelections {
  [boothId: string]: SelectedBooth;
}

// Constants
const INDOOR_RATE_PER_SQM = 36680;

const africaHallBooths: { [key: string]: BoothData } = {
  'N016': { 
    coords: [[1017, 667], [1215, 667], [1218, 865], [1013, 868]], 
    status: 'available', 
    size: '3m x 3m', 
    category: 'Standard',
    price: 250000,
    sqm: 9,
    boothId: 'N016'
  },
  'N058': { 
    coords: [[1818, 665], [2013, 665], [2026, 870], [1821, 867]], 
    status: 'booked-by-others', 
    size: '3m x 3m', 
    category: 'Standard',
    price: 250000,
    sqm: 9,
    boothId: 'N058'
  },
  'N015': { 
    coords: [[1017, 867], [1218, 864], [1218, 1065], [1017, 1065]], 
    status: 'available', 
    size: '3m x 3m', 
    category: 'Standard',
    price: 250000,
    sqm: 9,
    boothId: 'N015'
  },
  'N057': { 
    coords: [[1825, 867], [2023, 864], [2023, 1065], [1821, 1065]], 
    status: 'selected', 
    size: '3m x 3m', 
    category: 'Standard',
    price: 250000,
    sqm: 9,
    boothId: 'N057'
  },
  'N014': { 
    coords: [[1017, 1068], [1218, 1068], [1218, 1266], [1017, 1270]], 
    status: 'booked-by-you', 
    size: '3m x 3m', 
    category: 'Premium',
    price: 350000,
    sqm: 9,
    boothId: 'N014'
  },
  'N056': { 
    coords: [[1825, 1068], [2023, 1068], [2023, 1266], [1825, 1270]], 
    status: 'available', 
    size: '3m x 3m', 
    category: 'Premium',
    price: 350000,
    sqm: 9,
    boothId: 'N056'
  },
  'N013': { 
    coords: [[1017, 1270], [1218, 1273], [1218, 1468], [1013, 1471]], 
    status: 'available', 
    size: '3m x 3m', 
    category: 'Standard',
    price: 280000,
    sqm: 9,
    boothId: 'N013'
  },
  'N055': { 
    coords: [[1821, 1270], [2023, 1270], [2026, 1468], [1825, 1468]], 
    status: 'available', 
    size: '3m x 3m', 
    category: 'Standard',
    price: 280000,
    sqm: 9,
    boothId: 'N055'
  },
  'N012': { 
    coords: [[1017, 1474], [1218, 1471], [1215, 1676], [1013, 1679]], 
    status: 'available', 
    size: '3m x 3m', 
    category: 'Standard',
    price: 280000,
    sqm: 9,
    boothId: 'N012'
  },
  'N011': { 
    coords: [[1017, 1679], [1215, 1669], [1218, 1870], [1020, 1870]], 
    status: 'available', 
    size: '3m x 3m', 
    category: 'Standard',
    price: 280000,
    sqm: 9,
    boothId: 'N011'
  },
  'N010': { 
    coords: [[1013, 1870], [1215, 1877], [1215, 2069], [1013, 2069]], 
    status: 'available', 
    size: '3m x 3m', 
    category: 'Standard',
    price: 280000,
    sqm: 9,
    boothId: 'N010'
  },
  'N009': { 
    coords: [[1017, 2075], [1215, 2065], [1218, 2270], [1020, 2270]], 
    status: 'available', 
    size: '3m x 3m', 
    category: 'Standard',
    price: 280000,
    sqm: 9,
    boothId: 'N009'
  },
  'N008': { 
    coords: [[1020, 2270], [1218, 2267], [1215, 2472], [1017, 2475]], 
    status: 'available', 
    size: '3m x 3m', 
    category: 'Standard',
    price: 280000,
    sqm: 9,
    boothId: 'N008'
  },
  'N007': { 
    coords: [[1017, 2475], [1215, 2465], [1218, 2670], [1020, 2670]], 
    status: 'available', 
    size: '3m x 3m', 
    category: 'Standard',
    price: 280000,
    sqm: 9,
    boothId: 'N007'
  },
  'N006': { 
    coords: [[1020, 2670], [1218, 2667], [1215, 2872], [1017, 2875]], 
    status: 'available', 
    size: '3m x 3m', 
    category: 'Standard',
    price: 280000,
    sqm: 9,
    boothId: 'N006'
  },
  'N005': { 
    coords: [[1017, 2875], [1215, 2865], [1218, 3070], [1020, 3070]], 
    status: 'available', 
    size: '3m x 3m', 
    category: 'Standard',
    price: 280000,
    sqm: 9,
    boothId: 'N005'
  },
  'N004': { 
    coords: [[1020, 3070], [1218, 3067], [1215, 3272], [1017, 3275]], 
    status: 'available', 
    size: '3m x 3m', 
    category: 'Standard',
    price: 280000,
    sqm: 9,
    boothId: 'N004'
  },
  'N003': { 
    coords: [[1017, 3275], [1215, 3265], [1218, 3470], [1020, 3470]], 
    status: 'available', 
    size: '3m x 3m', 
    category: 'Standard',
    price: 280000,
    sqm: 9,
    boothId: 'N003'
  },
  'N002': { 
    coords: [[1020, 3470], [1218, 3467], [1215, 3672], [1017, 3675]], 
    status: 'available', 
    size: '3m x 3m', 
    category: 'Standard',
    price: 280000,
    sqm: 9,
    boothId: 'N002'
  },
  'N001': { 
    coords: [[1017, 3675], [1215, 3665], [1218, 3870], [1020, 3870]], 
    status: 'available', 
    size: '3m x 3m', 
    category: 'Standard',
    price: 280000,
    sqm: 9,
    boothId: 'N001'
  },
  'N054': { 
    coords: [[1825, 1474], [2023, 1474], [2026, 1676], [1825, 1676]], 
    status: 'available', 
    size: '3m x 3m', 
    category: 'Standard',
    price: 280000,
    sqm: 9,
    boothId: 'N054'
  },
  'N053': { 
    coords: [[1821, 1682], [2026, 1682], [2023, 1884], [1825, 1884]], 
    status: 'available', 
    size: '3m x 3m', 
    category: 'Standard',
    price: 280000,
    sqm: 9,
    boothId: 'N053'
  },
  'N052': { 
    coords: [[1825, 1890], [2023, 1890], [2026, 2092], [1825, 2092]], 
    status: 'available', 
    size: '3m x 3m', 
    category: 'Standard',
    price: 280000,
    sqm: 9,
    boothId: 'N052'
  },
  'N051': { 
    coords: [[1821, 2098], [2026, 2098], [2023, 2300], [1825, 2300]], 
    status: 'available', 
    size: '3m x 3m', 
    category: 'Standard',
    price: 280000,
    sqm: 9,
    boothId: 'N051'
  },
  'N050': { 
    coords: [[1825, 2306], [2023, 2306], [2026, 2508], [1825, 2508]], 
    status: 'available', 
    size: '3m x 3m', 
    category: 'Standard',
    price: 280000,
    sqm: 9,
    boothId: 'N050'
  },
  'N049': { 
    coords: [[1821, 2514], [2026, 2514], [2023, 2716], [1825, 2716]], 
    status: 'available', 
    size: '3m x 3m', 
    category: 'Standard',
    price: 280000,
    sqm: 9,
    boothId: 'N049'
  },
  'N048': { 
    coords: [[1825, 2722], [2023, 2722], [2026, 2924], [1825, 2924]], 
    status: 'available', 
    size: '3m x 3m', 
    category: 'Standard',
    price: 280000,
    sqm: 9,
    boothId: 'N048'
  },
  'N047': { 
    coords: [[1821, 2930], [2026, 2930], [2023, 3132], [1825, 3132]], 
    status: 'available', 
    size: '3m x 3m', 
    category: 'Standard',
    price: 280000,
    sqm: 9,
    boothId: 'N047'
  },
  'N046': { 
    coords: [[1825, 3138], [2023, 3138], [2026, 3340], [1825, 3340]], 
    status: 'available', 
    size: '3m x 3m', 
    category: 'Standard',
    price: 280000,
    sqm: 9,
    boothId: 'N046'
  },
  'N045': { 
    coords: [[1821, 3346], [2026, 3346], [2023, 3548], [1825, 3548]], 
    status: 'available', 
    size: '3m x 3m', 
    category: 'Standard',
    price: 280000,
    sqm: 9,
    boothId: 'N045'
  },
  'N044': { 
    coords: [[1825, 3554], [2023, 3554], [2026, 3756], [1825, 3756]], 
    status: 'available', 
    size: '3m x 3m', 
    category: 'Standard',
    price: 280000,
    sqm: 9,
    boothId: 'N044'
  },
  'N043': { 
    coords: [[1821, 3762], [2026, 3762], [2023, 3964], [1825, 3964]], 
    status: 'available', 
    size: '3m x 3m', 
    category: 'Standard',
    price: 280000,
    sqm: 9,
    boothId: 'N043'
  },
  'S029': { 
    coords: [[1389, 804], [1525, 807], [1511, 1009], [1386, 999]], 
    status: 'available', 
    size: '2m x 3m', 
    category: 'Standard',
    price: 220080,
    sqm: 6,
    boothId: 'S029'
  },
  'S028': { 
    coords: [[1389, 1005], [1511, 1005], [1515, 1204], [1389, 1204]], 
    status: 'available', 
    size: '2m x 3m', 
    category: 'Standard',
    price: 220080,
    sqm: 6,
    boothId: 'S028'
  },
  'S027': { 
    coords: [[1389, 1210], [1515, 1210], [1511, 1409], [1386, 1409]], 
    status: 'available', 
    size: '2m x 3m', 
    category: 'Standard',
    price: 220080,
    sqm: 6,
    boothId: 'S027'
  },
  'S026': { 
    coords: [[1389, 1415], [1511, 1415], [1525, 1614], [1389, 1614]], 
    status: 'available', 
    size: '2m x 3m', 
    category: 'Standard',
    price: 220080,
    sqm: 6,
    boothId: 'S026'
  },
  'S025': { 
    coords: [[1389, 1620], [1525, 1623], [1511, 1819], [1386, 1809]], 
    status: 'available', 
    size: '2m x 3m', 
    category: 'Standard',
    price: 220080,
    sqm: 6,
    boothId: 'S025'
  },
  'S024': { 
    coords: [[1389, 1825], [1511, 1825], [1515, 2024], [1389, 2024]], 
    status: 'available', 
    size: '2m x 3m', 
    category: 'Standard',
    price: 220080,
    sqm: 6,
    boothId: 'S024'
  },
  'S023': { 
    coords: [[1389, 2030], [1521, 2033], [1515, 2232], [1383, 2229]], 
    status: 'available', 
    size: '2m x 3m', 
    category: 'Standard',
    price: 220080,
    sqm: 6,
    boothId: 'S023'
  },
  'S022': { 
    coords: [[1389, 2235], [1521, 2238], [1515, 2437], [1383, 2434]], 
    status: 'available', 
    size: '2m x 3m', 
    category: 'Standard',
    price: 220080,
    sqm: 6,
    boothId: 'S022'
  },
  'S021': { 
    coords: [[1383, 2440], [1511, 2437], [1515, 2636], [1376, 2639]], 
    status: 'available', 
    size: '2m x 3m', 
    category: 'Standard',
    price: 220080,
    sqm: 6,
    boothId: 'S021'
  },
  'S020': { 
    coords: [[1383, 2642], [1511, 2639], [1521, 2838], [1389, 2841]], 
    status: 'available', 
    size: '2m x 3m', 
    category: 'Standard',
    price: 220080,
    sqm: 6,
    boothId: 'S020'
  },
  'S019': { 
    coords: [[1376, 2844], [1515, 2841], [1511, 3040], [1383, 3043]], 
    status: 'available', 
    size: '2m x 3m', 
    category: 'Standard',
    price: 220080,
    sqm: 6,
    boothId: 'S019'
  },
  'S018': { 
    coords: [[1389, 3046], [1521, 3043], [1515, 3242], [1376, 3245]], 
    status: 'available', 
    size: '2m x 3m', 
    category: 'Standard',
    price: 220080,
    sqm: 6,
    boothId: 'S018'
  },
  'S017': { 
    coords: [[1383, 3248], [1511, 3245], [1521, 3444], [1389, 3447]], 
    status: 'available', 
    size: '2m x 3m', 
    category: 'Standard',
    price: 220080,
    sqm: 6,
    boothId: 'S017'
  },
  'S042': { 
    coords: [[1525, 807], [1656, 804], [1650, 1005], [1518, 1002]], 
    status: 'available', 
    size: '2m x 3m', 
    category: 'Standard',
    price: 220080,
    sqm: 6,
    boothId: 'S042'
  },
  'S041': { 
    coords: [[1521, 1012], [1653, 1002], [1653, 1210], [1518, 1204]], 
    status: 'available', 
    size: '2m x 3m', 
    category: 'Standard',
    price: 220080,
    sqm: 6,
    boothId: 'S041'
  },
  'S040': { 
    coords: [[1518, 1216], [1650, 1213], [1656, 1414], [1521, 1411]], 
    status: 'available', 
    size: '2m x 3m', 
    category: 'Standard',
    price: 220080,
    sqm: 6,
    boothId: 'S040'
  },
  'S039': { 
    coords: [[1525, 1420], [1653, 1414], [1650, 1622], [1518, 1616]], 
    status: 'available', 
    size: '2m x 3m', 
    category: 'Standard',
    price: 220080,
    sqm: 6,
    boothId: 'S039'
  },
  'S038': { 
    coords: [[1521, 1628], [1656, 1625], [1653, 1826], [1518, 1823]], 
    status: 'available', 
    size: '2m x 3m', 
    category: 'Standard',
    price: 220080,
    sqm: 6,
    boothId: 'S038'
  },
  'S037': { 
    coords: [[1518, 1832], [1650, 1829], [1656, 2030], [1525, 2027]], 
    status: 'available', 
    size: '2m x 3m', 
    category: 'Standard',
    price: 220080,
    sqm: 6,
    boothId: 'S037'
  },
  'S036': { 
    coords: [[1521, 2036], [1656, 2033], [1656, 2232], [1521, 2235]], 
    status: 'available', 
    size: '2m x 3m', 
    category: 'Standard',
    price: 220080,
    sqm: 6,
    boothId: 'S036'
  },
  'S035': { 
    coords: [[1521, 2238], [1656, 2235], [1656, 2434], [1521, 2437]], 
    status: 'available', 
    size: '2m x 3m', 
    category: 'Standard',
    price: 220080,
    sqm: 6,
    boothId: 'S035'
  },
  'S034': { 
    coords: [[1515, 2440], [1656, 2437], [1653, 2636], [1518, 2639]], 
    status: 'available', 
    size: '2m x 3m', 
    category: 'Standard',
    price: 220080,
    sqm: 6,
    boothId: 'S034'
  }
};

const sectorData: { [key: string]: SectorData } = {
  'CGA': {
    name: 'Corporate Organizations & Government Agencies',
    description: 'Government ministries, agencies, corporate organizations, NGOs, and institutional exhibitors displaying their services and initiatives.',
    color: '#9C27B0',
    boothCount: 57,
    ranges: ['CGA101-CGA157']
  },
  'EEI': {
    name: 'ICT & Electronics Products',
    description: 'Latest technology, electronics, computers, mobile devices, software solutions, telecommunications equipment, and digital innovations.',
    color: '#2196F3',
    boothCount: 72,
    ranges: ['EEI101-EEI104', 'EEI201-EEI208', 'EEI301-EEI308', 'EEI401-EEI408', 'EEI501-EEI508', 'EEI601-EEI608', 'EEI701-EEI708', 'EEI801-EEI808', 'EEI901-EEI908']
  },
  'FDA': {
    name: 'Food, Drinks, Agriculture & Allied Products',
    description: 'Food products, beverages, agricultural equipment, farming technology, organic products, livestock, and agro-processing solutions.',
    color: '#4CAF50',
    boothCount: 286,
    ranges: ['FDA101-FDA108', 'FDA210-FDA217', 'FDA319-FDA326', 'FDA419-FDA438', 'FDA501-FDA544', 'FDA601-FDA644', 'FDA701-FDA750', 'FDA801-FDA821', 'FDA901-FDA942', 'FDA1001-FDA1041']
  },
  'HCT': {
    name: 'Household Cosmetics & Textile Products',
    description: 'Beauty products, skincare, makeup, household items, cleaning products, textiles, fabrics, clothing, and fashion accessories.',
    color: '#FF9800',
    boothCount: 152,
    ranges: ['HCT101-HCT112', 'HCT201-HCT212', 'HCT301-HCT312', 'HCT401-HCT412', 'HCT501-HCT524', 'HCT601-HCT624', 'HCT701-HCT724', 'HCT801-HCT808', 'HCT901-HCT916', 'HCT1001-HCT1008']
  },
  'TA': {
    name: 'Transport and Allied/Power Products',
    description: 'Automotive industry, transportation solutions, logistics, power generation equipment, energy solutions, and related services.',
    color: '#00BCD4',
    boothCount: 132,
    ranges: ['TA101-TA122', 'TA201-TA222', 'TA301-TA322', 'TA401-TA421', 'TA501-TA522', 'TA601-TA622']
  },
  'RBF': {
    name: 'Real Estate, Building Furniture & Fittings',
    description: 'Property developers, construction companies, furniture manufacturers, interior design, building materials, and home improvement solutions.',
    color: '#795548',
    boothCount: 16,
    ranges: ['RBF101-RBF104', 'RBF201-RBF212']
  },
  'COG': {
    name: 'Conglomerate',
    description: 'Large multi-industry corporations and business conglomerates showcasing diverse products and services across multiple sectors.',
    color: '#FF5722',
    boothCount: 50,
    ranges: ['COG101-COG108', 'COG201-COG208', 'COG301-COG308', 'COG401-COG408', 'COG501-COG508', 'COG601-COG608', 'COG701-COG706']
  },
   'OTH': {
    name: 'Publication, Healthcare & Sport Products',
    description: 'Publishing houses, educational materials, healthcare products, medical equipment, sports goods, fitness equipment, and miscellaneous products.',
    color: '#E91E63',
    boothCount: 60,
    ranges: ['PHS101-PHS124', 'PHS201-PHS212', 'PHS301-PHS324']
  },
  'COP': {
    name: 'Commercial Premium',
    description: 'Commercial premium sector for multi-industry corporations showcasing diverse products and services across multiple sectors.',
    color: '#FF5722', // Orange-red color
    boothCount: 60,
    ranges: ['COP101-COP160']
  },
  
};

// const UnifiedInteractiveLayout: React.FC<{
//   layoutData: {
//     name: string;
//     title: string;
//     type: 'hall' | 'sector';
//     color: string;
//     boothCount: number;
//     description: string;
//     imageSrc: string;
//     existingBooths?: { [key: string]: BoothData }; // Pre-defined booth coordinates
//     boothTypes?: Array<{
//       size: string;
//       count: number;
//       description: string;
//       range: string;
//     }>;
//     ratePerSqm: number;
//   };
//   onClose: () => void;
//   // Selection props
//   selectedBooths: any;
//   feedback: any;
//   onBoothClick: (boothId: string) => void;
//   onRemoveBooth: (boothId: string) => void;
//   onExport: () => void;
//   onSave: () => void;
//   onClearAll: () => void;
//   onCompleteReservation?: () => void;
// }> = ({
//   layoutData,
//   onClose,
//   selectedBooths,
//   feedback,
//   onBoothClick,
//   onRemoveBooth,
//   onExport,
//   onSave,
//   onClearAll,
//   onCompleteReservation
// }) => {
//   // Initialize coordinate picker for creating/editing booths
//   const {
//     isPickerActive,
//     currentPoints,
//     booths,
//     selectedBoothId,
//     drawMode,
//     gridSettings,
//     setIsPickerActive,
//     addPoint,
//     removeLastPoint,
//     clearCurrentPoints,
//     completeBooth,
//     deleteBooth,
//     setSelectedBoothId,
//     setDrawMode,
//     setGridSettings,
//     batchCreateBooths,
//     getPointsString,
//     exportBoothCoordinates,
//     calculateSvgCoordinates
//   } = useDetailLayoutPicker(layoutData.name);
//  // Add state for forcing re-renders
//   const [, forceUpdate] = useReducer(x => x + 1, 0);

//   // Enhanced remove handler
// const handleRemoveBoothWithStatus = useCallback((boothId: string) => {
//     // Update booth status in the layout data (with null check)
//     if (layoutData.existingBooths && layoutData.existingBooths[boothId]) {
//       layoutData.existingBooths?.[boothId]?.status && (layoutData.existingBooths[boothId].status = 'available');
//     }
    
//     // Call parent's remove function
//     onRemoveBooth(boothId);
    
//     // Force component to re-render
//     forceUpdate();
//   }, [layoutData.existingBooths, onRemoveBooth]);
  
//   // Enhanced clear all handler with proper null checks
//   const handleClearAllWithStatus = useCallback(() => {
//     // Reset all booth statuses in current location (with null check)
//     if (layoutData.existingBooths) {
//       Object.keys(selectedBooths).forEach(boothId => {
//         if (layoutData.existingBooths && layoutData.existingBooths[boothId]) {
//           layoutData.existingBooths[boothId].status = 'available';
//         }
//       });
//     }
    
//     // Call parent's clear function
//     onClearAll();
    
//     // Force re-render
//     forceUpdate();
//   }, [layoutData.existingBooths, selectedBooths, onClearAll]);

//  const handleImageClick = (e: React.MouseEvent<HTMLDivElement>) => {
//   if (!isPickerActive) return;
  
//   const img = e.currentTarget.querySelector('img');
//   if (!img) return;
  
//   // Create a new event-like object with the correct target
//   const rect = img.getBoundingClientRect();
//   const x = e.clientX - rect.left;
//   const y = e.clientY - rect.top;
  
//   // Calculate coordinates directly
//   const coords = {
//     x: Math.round((x / rect.width) * 3308),
//     y: Math.round((y / rect.height) * 4677)
//   };
  
//   addPoint(coords.x, coords.y);
// };

// // In your UnifiedInteractiveLayout component
// const handleBoothClick = useCallback((boothId: string) => {
 
//   onBoothClick(boothId);
// }, [onBoothClick]);
//   // Check if this layout has existing booth coordinates
//   const hasExistingBooths = layoutData.existingBooths && Object.keys(layoutData.existingBooths).length > 0;
// console.log('UnifiedInteractiveLayout - selectedBooths:', selectedBooths);
// console.log('UnifiedInteractiveLayout - hasExistingBooths:', hasExistingBooths);
//   return (
//     <div className="space-y-4">
//       {/* Header */}
//       <div 
//         className="inline-block text-white px-5 py-3 rounded-full font-bold text-lg"
//         style={{ backgroundColor: layoutData.color }}
//       >
//         {layoutData.type === 'hall' ? '🏛️' : '📍'} {layoutData.title} - {layoutData.boothCount} Exhibition Booths
//       </div>

//       <button 
//         onClick={onClose}
//         className="bg-gray-500 text-white px-5 py-2 border-none rounded cursor-pointer mb-5 font-bold hover:bg-gray-600 transition-all duration-200"
//       >
//         ← Back to Site Plan
//       </button>

//       {/* Selection Summary - Show if there are selected booths */}
    
//       {hasExistingBooths && (
//         <SelectionSummary
//           selectedBooths={selectedBooths}
//            onRemoveBooth={handleRemoveBoothWithStatus} // Use the new handler
//           onExport={onExport}
//           onSave={onSave}
//            onClearAll={handleClearAllWithStatus} // Use the new handler
//           onCompleteReservation={onCompleteReservation}
//           currentLocationName={layoutData.name} // Works for both halls and sectors
//     currentLocationType={layoutData.type}  // 'hall' or 'sector'
//         />
//       )}

//       {/* Booth Legend */}
//       {hasExistingBooths && <BoothLegend />}

//       {/* Description */}
//       <div className="leading-relaxed mb-5 text-gray-600">
//         {layoutData.description}
//       </div>

//       {/* Feedback Message */}
//       <FeedbackMessage feedback={feedback} />

//       {/* Coordinate Picker Toolbar */}
//       <DetailLayoutToolbar
//         isActive={isPickerActive}
//         onToggle={() => setIsPickerActive(!isPickerActive)}
//         onUndo={removeLastPoint}
//         onClear={clearCurrentPoints}
//         onComplete={completeBooth}
//         onExport={exportBoothCoordinates}
//         onBatchCreate={batchCreateBooths}
//         currentPointsCount={currentPoints.length}
//         drawMode={drawMode}
//         onDrawModeChange={setDrawMode}
//         gridSettings={gridSettings}
//         onGridSettingsChange={setGridSettings}
//         hallName={layoutData.name}
//         ratePerSqm={layoutData.ratePerSqm}
//       />

//       {/* Layout Display */}
//       <div className="bg-gray-50 rounded-lg p-5 text-center relative">
//         <h4 className="text-lg font-semibold text-gray-800 mb-4">
//           📐 Interactive Booth Layout
//           {isPickerActive && " - COORDINATE PICKER ACTIVE"}
//         </h4>
//         <div 
//           className="relative inline-block"
//           onClick={handleImageClick}
//           style={{ cursor: isPickerActive ? 'crosshair' : 'default' }}
//         >
//           <img 
//             src={layoutData.imageSrc}
//             alt={`${layoutData.name} Layout`}
//             className="max-w-full h-auto border-2 border-gray-300 rounded-lg"
//             style={{ width: '100%', maxWidth: '1200px' }}
//           />
//           <svg 
	   
//             className="absolute top-0 left-0 w-full h-full pointer-events-none"
//             viewBox="0 0 3308 4677"
//             preserveAspectRatio="none"
//             style={{ 
//               pointerEvents: isPickerActive ? 'none' : 'all', 
//               height: '100%', 
//               width: '100%'
//             }}
//           >
//             {/* Coordinate Picker Overlay */}
//             <DetailLayoutOverlay
//               currentPoints={currentPoints}
//               booths={booths}
//               selectedBoothId={selectedBoothId}
//               isPickerActive={isPickerActive}
//               drawMode={drawMode}
//               gridSettings={gridSettings}
//               getPointsString={getPointsString}
//               viewBoxWidth={3308}
//               viewBoxHeight={4677}
//             />
            
//             {/* Existing Booth Polygons */}
//           {!isPickerActive && hasExistingBooths && layoutData.existingBooths &&
//   Object.entries(layoutData.existingBooths).map(([boothId, booth]: [string, any]) => (
//     <BoothPolygon
//       key={boothId}
//       boothId={boothId}
//       booth={booth}
     
//        onBoothClick={handleBoothClick} // Now it's being used
//     />
//   ))
// }
//           </svg>
//         </div>
//       </div>

//       {/* Created Booths List */}
//       <DetailBoothList
//         booths={booths}
//         selectedBoothId={selectedBoothId}
//         onSelectBooth={setSelectedBoothId}
//         onDeleteBooth={deleteBooth}
//         ratePerSqm={layoutData.ratePerSqm}
//       />

//       {/* Booth Types Display */}
//       {layoutData.boothTypes && (
//         <div className="bg-gray-100 rounded-lg p-5">
//           <h4 className="text-lg font-semibold text-gray-800 mb-4">🎯 Available Booth Types</h4>
//           <div className={`grid gap-4 ${layoutData.boothTypes.length === 1 ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2'}`}>
//             {layoutData.boothTypes.map((boothType, index) => (
//               <div 
//                 key={index}
//                 className={`p-4 rounded-lg text-center border-2 ${
//                   boothType.size.includes('6m²') 
//                     ? 'bg-green-100 border-green-600' 
//                     : 'bg-red-100 border-red-600'
//                 }`}
//               >
//                 <h5 className="font-semibold mb-2">{boothType.size}</h5>
//                 <p><strong>{boothType.count} Booths Available</strong></p>
//                 <p>{boothType.description}</p>
//                 <small className="text-gray-600">{boothType.range}</small>
//               </div>
//             ))}
//           </div>
//         </div>
//       )}

//       {/* Call to Action */}
//       <div 
//         className="text-white p-5 rounded-lg text-center"
//         style={{ backgroundColor: layoutData.color }}
//       >
//         <strong>
//           {hasExistingBooths 
//             ? `🏛️ Ready to book ${layoutData.name}?`
//             : `📍 Use the coordinate picker to define booths for ${layoutData.name}`
//           }
//         </strong><br /><br />
//         {hasExistingBooths 
//           ? 'Use the interactive booth layout above to select your preferred booths, then use the export function to generate your booking request.'
//           : 'Start by activating the coordinate picker and drawing booth boundaries on the layout image.'
//         }<br /><br />
//         <strong>Indoor Rate: ₦{layoutData.ratePerSqm.toLocaleString()}/m²</strong>
//       </div>
//     </div>
//   );
// };
// Custom Hooks
const useBoothSelection = () => {
  const [selectedBooths, setSelectedBooths] = useState<BoothSelections>(() => {
    const initialSelections: BoothSelections = {};
    Object.keys(africaHallBooths).forEach(boothId => {
      if (africaHallBooths[boothId].status === 'selected') {
        initialSelections[boothId] = {
          ...africaHallBooths[boothId],
          selectedAt: new Date().toISOString()
        };
      }
    });
    return initialSelections;
  });

  const [feedback, setFeedback] = useState<{message: string; type: 'success' | 'error' | 'removal'} | null>(null);

  const showFeedback = useCallback((message: string, type: 'success' | 'error' | 'removal' = 'success') => {
    setFeedback({ message, type });
    setTimeout(() => setFeedback(null), 3000);
  }, []);

 // In your useBoothSelection hook, update the toggleBoothSelection function:
const toggleBoothSelection = useCallback((
  boothId: string, 
  sourceBooths?: any,
  locationInfo?: { name: string; type: 'hall' | 'sector' }
) => {
  const boothSource = sourceBooths || africaHallBooths;
  const booth = boothSource[boothId];
  
  if (!booth) {
    console.error(`Booth ${boothId} not found`);
    return;
  }

  if (booth.status === 'available') {
    booth.status = 'selected';
    setSelectedBooths(prev => ({
      ...prev,
      [boothId]: {
        ...booth,
        selectedAt: new Date().toISOString(),
        // Use provided location info or defaults
        locationName: locationInfo?.name || 'Africa Hall',
        locationType: locationInfo?.type || 'hall'
      }
    }));
    showFeedback(`Booth ${boothId} added to selection`);
  } else if (booth.status === 'selected') {
    booth.status = 'available';
    setSelectedBooths(prev => {
      const newSelections = { ...prev };
      delete newSelections[boothId];
      return newSelections;
    });
    showFeedback(`Booth ${boothId} removed from selection`, 'removal');
  }
}, [showFeedback]);

const removeBoothFromSelection = useCallback((boothId: string) => {
  // Get the booth data to reset its status
  const booth = selectedBooths[boothId];
  
  if (booth) {
    // Find the booth in the appropriate source and reset status
    // This is the issue - we need to know which location's booths to update
    
    // For now, let's update the selection state
    setSelectedBooths(prev => {
      const newSelections = { ...prev };
      delete newSelections[boothId];
      return newSelections;
    });
    
    showFeedback(`Booth ${boothId} removed from selection`, 'removal');
  }
}, [selectedBooths, showFeedback]);

// In your useBoothSelection hook or TradeFairMap component:
const clearAllSelections = useCallback((currentLocationBooths?: any) => {
  const count = Object.keys(selectedBooths).length;
  
  // Only proceed if there are actually selections to clear
  if (count === 0) {
    return;
  }
  
  // Reset booth statuses
  Object.keys(selectedBooths).forEach(boothId => {
    // Try current location booths first
    if (currentLocationBooths?.[boothId]) {
      currentLocationBooths[boothId].status = 'available';
    }
    // Fallback to africaHallBooths
    else if (africaHallBooths[boothId]) {
      africaHallBooths[boothId].status = 'available';
    }
  });
  
  // Clear the selections
  setSelectedBooths({});
  
  // Show feedback with correct count
  showFeedback(`All ${count} booth selections cleared`, 'removal');
}, [selectedBooths, showFeedback, africaHallBooths]);

  const exportBoothSelections = useCallback(() => {
    const selections = Object.entries(selectedBooths);
    
    if (selections.length === 0) {
      showFeedback('No booth selections to export', 'error');
      return;
    }
    
    let csvContent = 'S/N,Booth ID,Size (m²),Rate per m²,Total Price,Hall,Category\n';
    let totalSqm = 0;
    
    selections.forEach(([boothId, booth], index) => {
      const unitPrice = booth.sqm * INDOOR_RATE_PER_SQM;
      totalSqm += booth.sqm;
      csvContent += `${index + 1},${boothId},${booth.sqm},₦${INDOOR_RATE_PER_SQM.toLocaleString()},₦${unitPrice.toLocaleString()},Africa Hall,${booth.category}\n`;
    });
    
    const totalPrice = totalSqm * INDOOR_RATE_PER_SQM;
    csvContent += `\nTOTAL,${selections.length} booths,${totalSqm}m²,₦${INDOOR_RATE_PER_SQM.toLocaleString()},₦${totalPrice.toLocaleString()},Africa Hall,Mixed\n`;
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `africa-hall-booth-selections-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    
    showFeedback('CSV export completed successfully');
  }, [selectedBooths, showFeedback]);

  const saveBoothSelections = useCallback(() => {
    const allSelections = {
      timestamp: new Date().toISOString(),
      hall: 'Africa Hall',
      selections: selectedBooths,
      summary: {
        totalBooths: Object.keys(selectedBooths).length,
        totalSqm: Object.values(selectedBooths).reduce((sum, booth) => sum + booth.sqm, 0),
        totalPrice: Object.values(selectedBooths).reduce((sum, booth) => sum + (booth.sqm * INDOOR_RATE_PER_SQM), 0),
        ratePerSqm: INDOOR_RATE_PER_SQM
      }
    };
    
    const dataStr = JSON.stringify(allSelections, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `africa-hall-selections-${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    
    showFeedback('JSON save completed successfully');
  }, [selectedBooths, showFeedback]);

  return {
    selectedBooths,
    feedback,
    toggleBoothSelection,
    removeBoothFromSelection,
    clearAllSelections,
    exportBoothSelections,
    saveBoothSelections
  };
};

const useZoomControls = () => {
  const [zoom, setZoom] = useState(1);
  const [debugMode, setDebugMode] = useState(false);
  const [coordinatesMode, setCoordinatesMode] = useState(false);
  const [mouseCoords, setMouseCoords] = useState({ x: 0, y: 0 });

  const zoomIn = useCallback(() => {
    setZoom(prev => Math.min(prev * 1.2, 3));
  }, []);

  const zoomOut = useCallback(() => {
    setZoom(prev => Math.max(prev / 1.2, 0.5));
  }, []);

  const resetZoom = useCallback(() => {
    setZoom(1);
  }, []);

  const toggleDebug = useCallback(() => {
    setDebugMode(prev => !prev);
  }, []);

  const toggleCoordinates = useCallback(() => {
    setCoordinatesMode(prev => !prev);
  }, []);

  const updateMouseCoords = useCallback((e: React.MouseEvent<HTMLImageElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.round((e.clientX - rect.left) * (3308 / rect.width));
    const y = Math.round((e.clientY - rect.top) * (2340 / rect.height));
    setMouseCoords({ x, y });
  }, []);

  return {
    zoom,
    debugMode,
    coordinatesMode,
    mouseCoords,
    zoomIn,
    zoomOut,
    resetZoom,
    toggleDebug,
    toggleCoordinates,
    updateMouseCoords
  };
};

// Components
const SectorLegend: React.FC = () => {
  return (
    <div className="bg-gray-100 p-4 border-b-2 border-gray-300">
      <h1 className="text-lg font-bold text-gray-800 mb-2">🎨 Sector Legend</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
        {Object.entries(sectorData).map(([code, sector]) => (
          <div key={code} className="flex items-center p-1">
            <div 
              className="w-5 h-5 rounded border border-gray-800 mr-2"
              style={{ backgroundColor: sector.color }}
            ></div>
            <span className="text-sm">{code} - {sector.name.split(' & ')[0]} ({sector.boothCount})</span>
          </div>
        ))}
      </div>
      <h1 className="text-lg font-bold text-gray-800 mt-4 mb-2">🏛️ Halls Legend</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
        <div className="flex items-center p-1">
          <div className="w-5 h-5 rounded border border-gray-800 mr-2 bg-red-700"></div>
          <span className="text-sm">Africa Hall (58 booths) - Interactive booth selection</span>
        </div>
        <div className="flex items-center p-1">
          <div className="w-5 h-5 rounded border border-gray-800 mr-2 bg-purple-700"></div>
          <span className="text-sm">Hall A (47 booths)</span>
        </div>
        <div className="flex items-center p-1">
          <div className="w-5 h-5 rounded border border-gray-800 mr-2 bg-green-600"></div>
          <span className="text-sm">Hall B (97 booths)</span>
        </div>
        <div className="flex items-center p-1">
          <div className="w-5 h-5 rounded border border-gray-800 mr-2 bg-orange-500"></div>
          <span className="text-sm">International Hall (58 booths)</span>
        </div>
      </div>
    </div>
  );
};

const ZoomControls: React.FC<{
  onZoomIn: () => void;
  onZoomOut: () => void;
  onResetZoom: () => void;
  onToggleDebug: () => void;
  onToggleCoordinates: () => void;
}> = ({ onZoomIn, onZoomOut, onResetZoom, onToggleDebug, onToggleCoordinates }) => {
  return (
    <div className="fixed top-82 left-15 bg-white bg-opacity-95 border-2 border-gray-800 rounded-lg p-2 z-50 shadow-lg">
      <button 
        onClick={onZoomIn}
        className="block w-10 h-10 mb-1 bg-blue-500 text-white border-none rounded cursor-pointer font-bold text-lg hover:bg-blue-600 transition-all duration-200 hover:scale-105"
        title="Zoom In"
      >
        +
      </button>
      <button 
        onClick={onZoomOut}
        className="block w-10 h-10 mb-1 bg-blue-500 text-white border-none rounded cursor-pointer font-bold text-lg hover:bg-blue-600 transition-all duration-200 hover:scale-105"
        title="Zoom Out"
      >
        -
      </button>
      <button 
        onClick={onResetZoom}
        className="block w-10 h-10 mb-1 bg-blue-500 text-white border-none rounded cursor-pointer font-bold text-xs hover:bg-blue-600 transition-all duration-200 hover:scale-105"
        title="Reset View"
      >
        ⌂
      </button>
      <button 
        onClick={onToggleDebug}
        className="block w-10 h-10 mb-1 bg-orange-500 text-white border-none rounded cursor-pointer font-bold text-xs hover:bg-orange-600 transition-all duration-200 hover:scale-105"
        title="Show/Hide All Outlines"
      >
        🎯
      </button>
      <button 
        onClick={onToggleCoordinates}
        className="block w-10 h-10 bg-blue-500 text-white border-none rounded cursor-pointer font-bold text-xs hover:bg-blue-600 transition-all duration-200 hover:scale-105"
        title="Show Coordinates"
      >
        📍
      </button>
    </div>
  );
};

const CoordinateDisplay: React.FC<{ 
  visible: boolean; 
  coords: { x: number; y: number } 
}> = ({ visible, coords }) => {
  if (!visible) return null;
  
  return (
    <div className="fixed bottom-64 left-5 bg-black bg-opacity-80 text-white p-2 rounded text-xs font-mono z-50">
      X: {coords.x}, Y: {coords.y}
    </div>
  );
};

// const StatusDisplay: React.FC = () => {
//   return (
//     <div className="fixed bottom-5 right-5 bg-green-700 bg-opacity-90 text-white p-4 rounded-lg text-sm z-50">
//       ✅ Sectors Traced from Site Plan<br />
//       🎯 Tilted Polygon Coordinates<br />
//       📊 All Visible Colored Areas<br />
//       🏛️ Interactive Africa Hall Booths
//     </div>
//   );
// };

const BoothPolygon: React.FC<{
  boothId: string;
  booth: BoothData;
  onBoothClick: (boothId: string) => void;
}> = ({ boothId, booth, onBoothClick }) => {
  const points = booth.coords.map(coord => coord.join(',')).join(' ');
  const centerX = booth.coords.reduce((sum, coord) => sum + coord[0], 0) / booth.coords.length;
  const centerY = booth.coords.reduce((sum, coord) => sum + coord[1], 0) / booth.coords.length;

  const getBoothClasses = () => {
    const baseClasses = "cursor-pointer transition-all duration-300 hover:opacity-80 hover:stroke-[3] hover:filter hover:drop-shadow-lg";
    
    switch (booth.status) {
      case 'available':
        return `${baseClasses} fill-red-200 fill-opacity-30 stroke-gray-600`;
      case 'selected':
        return `${baseClasses} fill-green-300 fill-opacity-60 stroke-green-500`;
      case 'booked-by-you':
        return `${baseClasses} fill-blue-300 fill-opacity-60 stroke-blue-700`;
      case 'booked-by-others':
        return `${baseClasses} fill-red-300 fill-opacity-60 stroke-red-700`;
      default:
        return baseClasses;
    }
  };

  return (
    <g>
      <polygon
        points={points}
        className={getBoothClasses()}
        strokeWidth="1"
        onClick={(e) => {
          e.stopPropagation();
          onBoothClick(boothId);
        }}
      />
      <text
        x={centerX}
        y={centerY}
        className="text-6xl font-blue-500 font-extrabold  pointer-events-none "
        textAnchor="middle"
        dominantBaseline="middle"
      >
        {booth.boothId}
      </text>
    </g>
  );
};

const BoothLegend: React.FC = () => {
  return (
    <div className="bg-gray-50 rounded-lg p-4 mb-5">
      <h4 className="text-lg font-semibold text-gray-800 mb-3">🎨 Booth Status Legend</h4>
      <div className="grid grid-cols-2 gap-2">
        <div className="flex items-center gap-2 text-xs">
          <div className="w-4 h-4 border border-gray-600 bg-red-200 bg-opacity-60"></div>
          <span>Available (Click to select)</span>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <div className="w-4 h-4 border border-gray-600 bg-green-300 bg-opacity-60"></div>
          <span>Selected by You</span>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <div className="w-4 h-4 border border-gray-600 bg-blue-300 bg-opacity-60"></div>
          <span>Booked by You</span>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <div className="w-4 h-4 border border-gray-600 bg-red-300 bg-opacity-60"></div>
          <span>Booked by Others</span>
        </div>
      </div>
    </div>
  );
};

// In your SelectionSummary component, update the button onClick handlers:

const SelectionSummary: React.FC<{
  selectedBooths: BoothSelections;
  onRemoveBooth: (boothId: string) => void;
  onExport: () => void;
  onSave: () => void;
  onClearAll: () => void;
  onCompleteReservation?: () => void;
  currentLocationName?: string;
  currentLocationType?: 'hall' | 'sector';
}> = ({ 
  selectedBooths, 
  onRemoveBooth, 
  // onExport, 
  // onSave, 
  onClearAll,
  onCompleteReservation,
   currentLocationName = 'Africa Hall',
  // currentLocationType = 'hall'
}) => {
  const selections = Object.entries(selectedBooths);
  
  if (selections.length === 0) return null;

  // Helper functions - define them inside the component

 // In the getEntitlements function, return with proper typing
const getEntitlements = (totalSqm: number, locationType: string, booths?: any[]) => {
  const actualLocationType = booths ? getLocationType(locationType, booths) : 'indoor';
  
  const pricingTable = 
    actualLocationType === 'indoor' ? INDOOR_PRICING :
    actualLocationType === 'premium-outdoor' ? PREMIUM_OUTDOOR_PRICING :
    OUTDOOR_PRICING;
  
  const pricing = pricingTable[totalSqm];
  if (!pricing) return null;
  
  // Return with optional furniture property
  if (actualLocationType === 'indoor') {
    return {
      ...pricing,
      furniture: actualLocationType === 'indoor' ? (pricing as any).furniture : undefined
    };
  }
};

 // In SelectionSummary, update the getLocationType function:
const getLocationType = (locationName: string, booths: any[]): 'indoor' | 'outdoor' | 'premium-outdoor' => {
  // Check if it's a hall (indoor) or sector (outdoor)
  const isHall = locationName.toLowerCase().includes('hall');
 const isSector = ['food', 'hct', 'ict','eei', 'cga', 'ta', 'rbf', 'cog', 'publication','household','transport','conglomerate','corporate'].some(
    sector => locationName.toLowerCase().includes(sector.toLowerCase())
  );
  
  if (isHall) {
    return 'indoor'; // All halls are indoor
  }
  
  if (isSector) {
    // Check if any booth is premium for outdoor sectors
    const hasPremium = booths.some(booth => booth.category === 'Premium');
    return hasPremium ? 'premium-outdoor' : 'outdoor';
  }
  
  // Default to indoor if unclear
  return 'indoor';
};

  const calculatePackagePrice = (totalSqm: number, locationType: string, booths?: any[]): number | null => {
    const actualLocationType = booths ? getLocationType(locationType, booths) : 'indoor';
    
    const pricingTable = 
      actualLocationType === 'indoor' ? INDOOR_PRICING :
      actualLocationType === 'premium-outdoor' ? PREMIUM_OUTDOOR_PRICING :
      OUTDOOR_PRICING;
    
    if (pricingTable[totalSqm]) {
      return pricingTable[totalSqm].price;
    }
    
    return null;
  };

  const validateMinimumRequirement = (totalSqm: number, locationType: string, booths?: any[]): {
    isValid: boolean;
    message: string;
  } => {
    const actualLocationType = booths ? getLocationType(currentLocationName, booths) : 'indoor';
    console.log("Actual location type", locationType);
    const minimum = MINIMUM_REQUIREMENTS[actualLocationType];
    
    if (totalSqm < minimum) {
      return {
        isValid: false,
        message: `Below minimum (${minimum}m² required)`
      };
    }
    
    return {
      isValid: true,
      message: 'Valid'
    };
  };

  const isAllSelectionsValid = (groupedSelections: Record<string, any>): boolean => {
    return Object.values(groupedSelections).every(data => {
      const validation = validateMinimumRequirement(data.totalSqm, data.locationType, data.booths);
      return validation.isValid;
    });
  };

  
  // Group selections by location
 const groupedSelections = groupBoothsByLocation(selections);

  const handleRemoveBooth = (e: React.MouseEvent, boothId: string) => {
    e.stopPropagation();
    onRemoveBooth(boothId);
  };

  const handleClearAll = (e: React.MouseEvent) => {
    e.stopPropagation();
    onClearAll();
  };


  // Check if all selections are valid for enabling the Complete Reservation button
  const allValid = isAllSelectionsValid(groupedSelections);

  
  return (
    <div className="bg-gray-50 border-2 border-blue-500 rounded-lg p-5 mb-5 shadow-lg">
      <h4 className="text-xl font-semibold text-blue-700 mb-4">
        🛒 Selected Booths Summary
      </h4>
      
      <div className="overflow-x-auto">
        <table className="w-full border-collapse bg-white rounded-lg overflow-hidden shadow-md">
          <thead>
            <tr className="bg-blue-600 text-white text-xs uppercase">
              <th className="p-3 text-left">Location</th>
              <th className="p-3 text-left">Booth IDs</th>
              <th className="p-3 text-left">Total Area</th>
              <th className="p-3 text-left">Package Price</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(groupedSelections).map(([location, data]) => {
              const packagePrice = calculatePackagePrice(data.totalSqm, data.locationType, data.booths);
              const status = validateMinimumRequirement(data.totalSqm, data.locationType, data.booths);
              
              return (
                <tr key={location} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="p-3 text-sm font-medium">{location}</td>
                  <td className="p-3 text-xs">
                    <div className="flex flex-wrap gap-1">
                      {data.boothIds.map((id: string) => (
                        <span key={id} className="inline-flex items-center">
                          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                            {id}
                          </span>
                          <button
                            onClick={(e) => handleRemoveBooth(e, id)}
                            className="ml-1 text-red-500 hover:text-red-700"
                            title={`Remove ${id}`}
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="p-3 text-sm">{data.totalSqm}m²</td>
                  <td className="p-3 text-sm font-medium">
                    {packagePrice ? `₦${packagePrice.toLocaleString()}` : '---'}
                  </td>
                  <td className="p-3 text-sm">
                    {status.isValid ? (
                      <span className="text-green-600">✓ Valid</span>
                    ) : (
                      <span className="text-red-600">{status.message}</span>
                    )}
                  </td>
                  <td className="p-3">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        data.boothIds.forEach((id: string) => onRemoveBooth(id));
                      }}
                      className="text-red-600 hover:text-red-800 text-sm"
                    >
                      Clear Location
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-2 mt-4">
        {/* <button
          onClick={(e) => {
            e.stopPropagation();
            onExport();
          }}
          className="flex items-center gap-1 px-4 py-2 bg-green-600 text-white border-none rounded cursor-pointer font-bold text-xs hover:bg-green-700 transition-all duration-200"
        >
          📄 Export CSV
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onSave();
          }}
          className="flex items-center gap-1 px-4 py-2 bg-teal-600 text-white border-none rounded cursor-pointer font-bold text-xs hover:bg-teal-700 transition-all duration-200"
        >
          💾 Save JSON
        </button> */}
        {onCompleteReservation && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onCompleteReservation();
            }}
            className="flex items-center gap-1 px-4 py-2 bg-blue-600 text-white border-none rounded cursor-pointer font-bold text-xs hover:bg-blue-700 transition-all duration-200"
            disabled={!allValid}
          >
            🎫 Complete Reservation
          </button>
        )}
        <button
          onClick={handleClearAll}
          className="flex items-center gap-1 px-4 py-2 bg-red-600 text-white border-none rounded cursor-pointer font-bold text-xs hover:bg-red-700 transition-all duration-200"
        >
          🗑️ Clear All
        </button>
      </div>
      {Object.entries(groupedSelections).map(([location, data]) => {
  const entitlements = getEntitlements(data.totalSqm, data.locationType, data.booths);
  
  if (!entitlements) return null;
  
  return (
    <div key={`entitlements-${location}`} className="mt-6 bg-blue-50 rounded-lg p-4 border border-blue-200">
      <h5 className="text-lg font-semibold text-blue-800 mb-3">
        📋 Package Entitlements - {location} ({data.totalSqm}m²)
      </h5>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="flex items-center space-x-3">
          <div className="bg-blue-100 p-3 rounded-full">
            <span className="text-2xl">🚗</span>
          </div>
          <div>
            <p className="text-sm text-gray-600">Car Stickers</p>
            <p className="text-xl font-bold text-blue-800">{entitlements.carStickers}</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <div className="bg-blue-100 p-3 rounded-full">
            <span className="text-2xl">🎫</span>
          </div>
          <div>
            <p className="text-sm text-gray-600">Exhibitor Passes</p>
            <p className="text-xl font-bold text-blue-800">{entitlements.passes}</p>
          </div>
        </div>
        
        {entitlements.furniture && (
          <div className="flex items-center space-x-3">
            <div className="bg-blue-100 p-3 rounded-full">
              <span className="text-2xl">🪑</span>
            </div>
            <div>
              <p className="text-sm text-gray-600">Furniture</p>
              <p className="text-sm font-bold text-blue-800">{entitlements.furniture}</p>
            </div>
          </div>
        )}
      </div>
      
      {/* Show warning if custom size */}
      {!entitlements && (
        <div className="mt-3 p-3 bg-yellow-100 rounded-lg border border-yellow-300">
          <p className="text-sm text-yellow-800">
            ⚠️ Custom booth size ({data.totalSqm}m²) - Please contact sales for pricing and entitlements
          </p>
        </div>
      )}
    </div>
  );
})}

{/* Grand Total Section */}
{Object.keys(groupedSelections).length > 1 && (
  <div className="mt-6 bg-gray-100 rounded-lg p-4 border border-gray-300">
    <h5 className="text-lg font-semibold text-gray-800 mb-3">
      💰 Grand Total Summary
    </h5>
    <div className="space-y-2">
      {Object.entries(groupedSelections).map(([location, data]) => {
        const price = calculatePackagePrice(data.totalSqm, data.locationType, data.booths);
        return (
          <div key={`total-${location}`} className="flex justify-between">
            <span className="text-gray-600">{location} ({data.totalSqm}m²):</span>
            <span className="font-bold">
              {price ? `₦${price.toLocaleString()}` : 'Custom Pricing'}
            </span>
          </div>
        );
      })}
      <div className="border-t pt-2 mt-2">
        <div className="flex justify-between text-lg">
          <span className="font-bold text-gray-800">Total Amount:</span>
          <span className="font-bold text-green-600">
            ₦{Object.entries(groupedSelections)
              .reduce((sum, [_, data]) => {
                const price = calculatePackagePrice(data.totalSqm, data.locationType, data.booths);
                return sum + (price || 0);
              }, 0)
              .toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  </div>
)}
    </div>
  );
};

const FeedbackMessage: React.FC<{
  feedback: {message: string; type: 'success' | 'error' | 'removal'} | null;
}> = ({ feedback }) => {
  if (!feedback) return null;

  const getClasses = () => {
    const baseClasses = "bg-opacity-90 border rounded p-2 mb-2 text-center font-bold transition-all duration-300";
    switch (feedback.type) {
      case 'success':
        return `${baseClasses} bg-green-200 border-green-600 text-green-700`;
      case 'error':
        return `${baseClasses} bg-red-200 border-red-600 text-red-700`;
      case 'removal':
        return `${baseClasses} bg-yellow-200 border-yellow-600 text-yellow-800`;
      default:
        return baseClasses;
    }
  };

  return (
    <div className={getClasses()}>
      {feedback.message}
    </div>
  );
};

const AfricaHallLayout: React.FC<{
  selectedBooths: BoothSelections;
  feedback: {message: string; type: 'success' | 'error' | 'removal'} | null;
  onBoothClick: (boothId: string) => void;
  onRemoveBooth: (boothId: string) => void;
  onExport: () => void;
  onSave: () => void;
  onClearAll: () => void;
  onResetAll: () => void;
  onShowAvailable: () => void;
  onShowSelected: () => void;
  onShowStatistics: () => void;
  onCompleteReservation?: () => void;
}> = ({ 
  selectedBooths, 
  feedback, 
  onBoothClick, 
  onRemoveBooth, 
  onExport, 
  onSave, 
  onClearAll,
  onResetAll,
  onShowAvailable,
  onShowSelected,
  onShowStatistics,
  onCompleteReservation
}) => {
  return (
    <div className="space-y-4">
      <SelectionSummary
        selectedBooths={selectedBooths}
        onRemoveBooth={onRemoveBooth}
        onExport={onExport}
        onSave={onSave}
        onClearAll={onClearAll}
        onCompleteReservation={onCompleteReservation} // Pass the new prop
      />

      <BoothLegend />

      <div className="leading-relaxed mb-5 text-gray-600">
        🖱️ <strong>Click on any booth to select/deselect it instantly.</strong> Africa Hall features both 6m² and 9m² booth options with premium positioning and excellent visibility. Indoor rate: <strong>₦{INDOOR_RATE_PER_SQM.toLocaleString()} per m²</strong>
      </div>

      <FeedbackMessage feedback={feedback} />

      <div className="bg-gray-50 rounded-lg p-5 text-center relative">
        <h4 className="text-lg font-semibold text-gray-800 mb-4">📐 Interactive Booth Layout</h4>
        <div className="relative inline-block"
        
        >
          <img 
            src="/siteplan/DIM_AFRICAHALL15mx50m-1.png" 
            alt="Africa Hall Layout" 
            className="max-w-full h-auto border-2 border-gray-300 rounded-lg"
            style={{ width: '800px',position: 'relative', zIndex: 1  }}
            
          />
          <svg 
            className="absolute top-0 left-0 w-full h-full pointer-events-none"
            viewBox="0 0 3308 4677" 
            preserveAspectRatio="none"
            style={{    pointerEvents: 'all',
      zIndex: 2, // Add this
      mixBlendMode: 'multiply' // Try this - it might help with transparency
       }}
          >
            {Object.entries(africaHallBooths).map(([boothId, booth]) => (
              <BoothPolygon
                key={boothId}
                boothId={boothId}
                booth={booth}
                onBoothClick={onBoothClick}
              />
            ))}
          </svg>
        </div>
      </div>

      <div className="bg-gray-100 rounded-lg p-5">
        <h4 className="text-lg font-semibold text-gray-800 mb-4">🎯 Available Booth Types</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-green-100 border-2 border-green-600 p-4 rounded-lg text-center">
            <h5 className="font-semibold mb-2">6m² Booths</h5>
            <p><strong>26 Booths Available</strong></p>
            <p>Perfect for startups and small businesses</p>
            <p><strong>Price: ₦{(6 * INDOOR_RATE_PER_SQM).toLocaleString()} per booth</strong></p>
            <small className="text-gray-600">Booths: S017-S042</small>
          </div>
          <div className="bg-red-100 border-2 border-red-600 p-4 rounded-lg text-center">
            <h5 className="font-semibold mb-2">9m² Booths</h5>
            <p><strong>32 Booths Available</strong></p>
            <p>Ideal for established companies</p>
            <p><strong>Price: ₦{(9 * INDOOR_RATE_PER_SQM).toLocaleString()} per booth</strong></p>
            <small className="text-gray-600">Booths: N001-N016, N043-N058</small>
          </div>
        </div>
      </div>

      <div className="bg-gray-100 rounded-lg p-5">
        <h4 className="text-lg font-semibold text-gray-800 mb-4">🛠️ Booth Management Tools</h4>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={onResetAll}
            className="p-2 border border-gray-300 bg-white cursor-pointer rounded text-xs hover:bg-gray-50 transition-all duration-200 hover:-translate-y-0.5"
          >
            Reset All Booths
          </button>
          <button
            onClick={onShowAvailable}
            className="p-2 border border-gray-300 bg-white cursor-pointer rounded text-xs hover:bg-gray-50 transition-all duration-200 hover:-translate-y-0.5"
          >
            Show Available Only
          </button>
          <button
            onClick={onShowSelected}
            className="p-2 border border-gray-300 bg-white cursor-pointer rounded text-xs hover:bg-gray-50 transition-all duration-200 hover:-translate-y-0.5"
          >
            Show Selected
          </button>
          <button
            onClick={onShowStatistics}
            className="p-2 border border-gray-300 bg-white cursor-pointer rounded text-xs hover:bg-gray-50 transition-all duration-200 hover:-translate-y-0.5"
          >
            Booth Statistics
          </button>
        </div>
      </div>

      <div className="bg-red-700 text-white p-5 rounded-lg text-center">
        <strong>🏛️ Ready to book Africa Hall?</strong><br /><br />
        Use the interactive booth layout above to select your preferred booths, then use the export function to generate your booking request.<br /><br />
        <strong>Indoor Rate: ₦{INDOOR_RATE_PER_SQM.toLocaleString()}/m² • Premium positioning • Mixed booth sizes</strong>
      </div>
    </div>
  );
};

const generateBoothNumbers = (prefix: string, start: number, end: number, className: string) => {
  const booths = [];
  for (let i = start; i <= end; i++) {
    const paddedNumber = i.toString().padStart(3, '0');
    booths.push(
      <div key={`${prefix}${paddedNumber}`} className={`bg-white p-2 rounded text-center text-xs border border-gray-300 font-bold hover:bg-blue-50 hover:border-blue-500 transition-all duration-200 hover:scale-105 ${className === 'size-6' ? 'bg-green-100 border-green-600' : className === 'size-9' ? 'bg-red-100 border-red-600' : ''}`}>
        {prefix}{paddedNumber}
      </div>
    );
  }
  return booths;
};

const NotReadyMessage: React.FC = () => {
  return (
    <div className="bg-yellow-100 border-2 border-yellow-500 rounded-lg p-5 mb-5 text-center">
      <h4 className="text-yellow-800 font-semibold mb-4">⏳ Interactive Booth Selection Coming Soon</h4>
      <p className="text-yellow-800 mb-2"><strong>Polygon coordinates for this hall are not ready yet.</strong></p>
      <p className="text-yellow-800 mb-2">We're working hard to bring you the same interactive booth selection experience available in Africa Hall.</p>
      <p className="text-yellow-800 mb-4"><strong>Expected Features:</strong></p>
      <ul className="text-left text-yellow-800 mb-4 list-disc pl-5">
        <li>🖱️ Click-to-select booth interface</li>
        <li>💰 Real-time pricing calculations</li>
        <li>📊 Live selection summary</li>
        <li>📄 CSV export functionality</li>
        <li>💾 JSON save options</li>
      </ul>
    </div>
  );
};

const SectorInfoPanel: React.FC<{
  sectorCode: string;
  onClose: () => void;
}> = ({ sectorCode, onClose }) => {
  const sector = sectorData[sectorCode];
  if (!sector) return null;

  return (
    <div className="space-y-4">
      <div 
        className="inline-block text-white px-5 py-3 rounded-full font-bold text-lg"
        style={{ backgroundColor: sector.color }}
      >
        📍 {sector.boothCount} Exhibition Booths Available
      </div>

      <button 
        onClick={onClose}
        className="bg-gray-500 text-white px-5 py-2 border-none rounded cursor-pointer mb-5 font-bold hover:bg-gray-600 transition-all duration-200"
      >
        ← Back to Site Plan
      </button>

      <NotReadyMessage />

      <div className="leading-relaxed mb-5 text-gray-600">
        {sector.description}
      </div>

      <div className="bg-gray-50 rounded-lg p-5 mb-5">
        <h4 className="text-lg font-semibold text-gray-800 mb-4">📋 Available Booth Ranges:</h4>
        <div className="grid grid-cols-4 gap-2">
          {sector.ranges.map(range => (
            <div key={range} className="bg-white p-2 rounded text-center text-xs border border-gray-300 font-bold">
              {range}
            </div>
          ))}
        </div>
      </div>

      <div 
        className="text-white p-5 rounded-lg text-center"
        style={{ backgroundColor: sector.color }}
      >
        <strong>💡 Interested in this sector?</strong><br /><br />
        Contact the organizers for booth booking and pricing information. For immediate interactive selection, try Africa Hall!<br /><br />
        <strong>Sector Code: {sectorCode}</strong>
      </div>
    </div>
  );
};

const HallInfoPanel: React.FC<{
  hallName: string;
  hallData: {
    title: string;
    color: string;
    boothCount: number;
    description: string;
    imageSrc: string;
    boothTypes: Array<{
      size: string;
      count: number;
      description: string;
      range: string;
    }>;
    boothRanges: Array<{
      title: string;
      color: string;
      prefix: string;
      ranges: Array<{ start: number; end: number; className: string }>;
    }>;
  };
  onClose: () => void;
}> = ({ hallData, onClose }) => {
  return (
    <div className="space-y-4">
      <div 
        className="inline-block text-white px-5 py-3 rounded-full font-bold text-lg"
        style={{ backgroundColor: hallData.color }}
      >
        🏛️ {hallData.title} - {hallData.boothCount} Exhibition Booths Available
      </div>

      <button 
        onClick={onClose}
        className="bg-gray-500 text-white px-5 py-2 border-none rounded cursor-pointer mb-5 font-bold hover:bg-gray-600 transition-all duration-200"
      >
        ← Back to Site Plan
      </button>

      <NotReadyMessage />

      <div className="leading-relaxed mb-5 text-gray-600">
        {hallData.description}
      </div>

      <div className="bg-gray-50 rounded-lg p-5 text-center">
        <h4 className="text-lg font-semibold text-gray-800 mb-4">📐 Hall Layout & Booth Distribution</h4>
        <img 
          src={`/siteplan/${hallData.imageSrc}`}
          alt={`${hallData.title} - Booth Layout`}
          className="max-w-full h-auto border-2 border-gray-300 rounded-lg mb-2"
        />
        <p className="text-sm text-gray-600">{hallData.description}</p>
      </div>

      <div className="bg-gray-100 rounded-lg p-5">
        <h4 className="text-lg font-semibold text-gray-800 mb-4">🎯 Available Booth Types</h4>
        <div className={`grid gap-4 ${hallData.boothTypes.length === 1 ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2'}`}>
          {hallData.boothTypes.map((boothType, index) => (
            <div 
              key={index}
              className={`p-4 rounded-lg text-center border-2 ${
                boothType.size.includes('6m²') 
                  ? 'bg-green-100 border-green-600' 
                  : 'bg-red-100 border-red-600'
              }`}
            >
              <h5 className="font-semibold mb-2">{boothType.size}</h5>
              <p><strong>{boothType.count} Booths Available</strong></p>
              <p>{boothType.description}</p>
              <small className="text-gray-600">{boothType.range}</small>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-gray-50 rounded-lg p-5">
        <h4 className="text-lg font-semibold text-gray-800 mb-4">📋 Available Booth Numbers</h4>
        {hallData.boothRanges.map((range, index) => (
          <div key={index} className="mb-4">
            <h5 className="font-semibold mb-2" style={{ color: range.color }}>
              {range.title}
            </h5>
            <div className="grid grid-cols-8 gap-2">
              {range.ranges.map((r) => 
                generateBoothNumbers(range.prefix, r.start, r.end, r.className).slice(0, 32)
              )}
            </div>
          </div>
        ))}
      </div>

      <div 
        className="text-white p-5 rounded-lg text-center"
        style={{ backgroundColor: hallData.color }}
      >
        <strong>🏛️ Interested in {hallData.title}?</strong><br /><br />
        {hallData.title} offers excellent positioning for your exhibition. Interactive selection coming soon!<br /><br />
        <strong>Contact organizers for booking and pricing</strong>
      </div>
    </div>
  );
};

const InfoPanel: React.FC<{
  isOpen: boolean;
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}> = ({ isOpen, title, onClose, children }) => {
  return (
    <>
      {/* Backdrop overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-[999] transition-opacity duration-300"
          onClick={onClose}
          style={{ zIndex: 999 }}
        />
      )}
      
      {/* Centered Panel - Updated to 95% viewport */}
      <div className={`info-panel-container fixed top-1/2 left-1/2 w-[95vw] h-[95vh] max-w-[1800px] max-h-[95vh] bg-white shadow-2xl transition-all duration-400 z-[1000] overflow-hidden rounded-lg border border-gray-300 ${
        isOpen 
          ? 'transform -translate-x-1/2 -translate-y-1/2 scale-100 opacity-100' 
          : 'transform -translate-x-1/2 -translate-y-1/2 scale-95 opacity-0 pointer-events-none'
      }`}>
        {/* Header */}
        <div className="sticky top-0 bg-slate-700 text-white p-3 sm:p-4 md:p-5 z-10 flex items-center justify-between">
          <h3 className="text-base sm:text-lg md:text-xl font-semibold pr-2 truncate flex-1">
            {title}
          </h3>
          <button
            onClick={onClose}
            className="bg-red-600 text-white border-none rounded-full w-8 h-8 sm:w-9 sm:h-9 cursor-pointer text-base sm:text-lg font-bold flex items-center justify-center hover:bg-red-700 transition-all duration-200 hover:scale-110 flex-shrink-0 ml-2"
            aria-label="Close panel"
          >
            ×
          </button>
        </div>
        
        {/* Content - Adjusted height calculation */}
        <div className="p-4 sm:p-5 md:p-6 overflow-y-auto h-[calc(100%-56px)] sm:h-[calc(100%-64px)] md:h-[calc(100%-76px)]">
          {children}
        </div>
      </div>
    </>
  );
};
const SectorPolygon: React.FC<{
  points: string;
  sectorType: string;
  title: string;
  onClick: () => void;
  debugMode: boolean;
  style?: React.CSSProperties;
  user?: any;
}> = ({ points, sectorType, title, onClick, debugMode, style, user }) => {
  const getSectorClasses = () => {
    if (debugMode) {
      return "fill-red-500 fill-opacity-20 stroke-red-500 stroke-2";
    }
    
    const baseClasses = "cursor-pointer transition-all duration-300";
    
    switch (sectorType) {
      case 'cga-sector':
        return `${baseClasses} fill-transparent stroke-transparent hover:fill-purple-700 hover:fill-opacity-40 hover:stroke-purple-700 hover:stroke-[3]`;
      case 'eei-sector':
        return `${baseClasses} fill-transparent stroke-transparent hover:fill-blue-500 hover:fill-opacity-40 hover:stroke-blue-500 hover:stroke-[3]`;
      case 'fda-sector':
        return `${baseClasses} fill-transparent stroke-transparent hover:fill-green-600 hover:fill-opacity-40 hover:stroke-green-600 hover:stroke-[3]`;
      case 'hct-sector':
        return `${baseClasses} fill-transparent stroke-transparent hover:fill-orange-500 hover:fill-opacity-40 hover:stroke-orange-500 hover:stroke-[3]`;
      case 'ta-sector':
        return `${baseClasses} fill-transparent stroke-transparent hover:fill-cyan-500 hover:fill-opacity-40 hover:stroke-cyan-500 hover:stroke-[3]`;
      case 'rbf-sector':
        return `${baseClasses} fill-transparent stroke-transparent hover:fill-amber-700 hover:fill-opacity-40 hover:stroke-amber-700 hover:stroke-[3]`;
      case 'cog-sector':
        return `${baseClasses} fill-transparent stroke-transparent hover:fill-red-600 hover:fill-opacity-40 hover:stroke-red-600 hover:stroke-[3]`;
      case 'oth-sector':
        return `${baseClasses} fill-transparent stroke-transparent hover:fill-pink-600 hover:fill-opacity-40 hover:stroke-pink-600 hover:stroke-[3]`;
      case 'africa-hall':
        return `${baseClasses} fill-transparent stroke-transparent hover:fill-red-700 hover:fill-opacity-40 hover:stroke-red-700 hover:stroke-[3]`;
      case 'hall-a':
        return `${baseClasses} fill-transparent stroke-transparent hover:fill-purple-700 hover:fill-opacity-40 hover:stroke-purple-700 hover:stroke-[3]`;
      case 'hall-b':
        return `${baseClasses} fill-transparent stroke-transparent hover:fill-green-600 hover:fill-opacity-40 hover:stroke-green-600 hover:stroke-[3]`;
      case 'international-hall':
        return `${baseClasses} fill-transparent stroke-transparent hover:fill-orange-500 hover:fill-opacity-40 hover:stroke-orange-500 hover:stroke-[3]`;
      case 'cop-sector':
         return `${baseClasses} fill-transparent stroke-transparent hover:fill-orange-600 hover:fill-opacity-40 hover:stroke-orange-600 hover:stroke-[3]`;
        default:
        return `${baseClasses} fill-transparent stroke-transparent`;
    }
  };



  const handleClick = () => {
    if (user.local.toLowerCase() === 'local' && (sectorType == 'hall-a' || sectorType == 'hall-b')) {
      return onClick();
    } else if (user.local.toLowerCase() == 'international' && (sectorType == 'africa-hall' || sectorType == 'international-hall')) {
      return onClick();
    } else {
      if (sectorType == 'eei-sector' && user?.boothType == 'ICT & Electronics Products') {
        return onClick();
      } else if (sectorType == 'cga-sector' && user?.boothType == 'Corporate Organizations & Government Agencies') {
        return onClick();
      }else if (sectorType == 'fda-sector' && user?.boothType == 'Food, Drinks, Agriculture & Allied Products') {
        return onClick();
      }else if (sectorType == 'hct-sector' && user?.boothType == 'Household Cosmetics & Textile Products') {
        return onClick();
      }else if (sectorType == 'ta-sector' && user?.boothType == 'Transport and Allied/Power Products') {
        return onClick();
      }else if (sectorType == 'cog-sector' && user?.boothType == 'Conglomerate') {
        return onClick();
      }else if (sectorType == 'oth-sector' && user?.boothType == 'Publication, Healthcare & Sport Products') {
        return onClick();
      
      }else if (sectorType == 'rbf-sector' && user?.boothType == 'Real Estate, Building Furniture & Fittings') {
        return onClick();
      
      }else if (sectorType == 'rbf-sector' && user?.boothType == 'Real Estate, Building Furniture & Fittings') {
        return onClick();
      }else if (sectorType == 'cop-sector' && user?.boothType == 'Commercial Premium') {
       return onClick();
      }
    }
    alert('You are not eligible to select a booth in this sector');
    return null;
  };

  return (
    <polygon
      points={points}
      className={getSectorClasses()}
      onClick={handleClick}
      style={{
        pointerEvents: 'all',
        fillOpacity: 0,
        strokeOpacity: 0,
        ...style
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.fillOpacity = '0.4';
        e.currentTarget.style.strokeOpacity = '1';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.fillOpacity = '0';
        e.currentTarget.style.strokeOpacity = '0';
      }}
    >
      <title>{title}</title>
    </polygon>
  );
};

// Main Component
const TradeFairMap: React.FC = () => {
  
  const [panelState, setPanelState] = useState<{
    isOpen: boolean;
    type: 'sector' | 'hall' | 'africa-hall'| 'interactive-layout';
    data: any;
    title: string;
  }>({
    isOpen: false,
    type: 'sector',
    data: null,
    title: ''
  });
// Add these new state variables
// Add these new state variables inside the TradeFairMap component
const [showTwoStepModal, setShowTwoStepModal] = useState<boolean>(false);
const [reservedBoothsData, setReservedBoothsData] = useState<any[]>([]);
  // const [toastType, setToastType] = useState<'success' | 'error' | 'warning' | 'info'>('success');
  // const [toastMessage, setToastMessage] = useState<string>('');
  // const [showToast, setShowToast] = useState<boolean>(false);
  
// Add this state to track selections by location
// const [selectionsByLocation, setSelectionsByLocation] = useState<{
//   [locationName: string]: BoothSelections
// }>({});


// Find this section in your BoothManagement.tsx:
const dispatch = useDispatch();
const { profile } = useSelector((state: any) => state.userReducer || {});
const { user } = useUser();

// ADD THIS SECTION RIGHT AFTER ⬇️
const boothState = useSelector((state: any) => {
  console.log('Full Redux State:', state);
  return state.booth || {};
});

const { loading: boothLoading, error: boothError, reservationIds = [] } = boothState;

console.log('Redux booth state:', {
  loading: boothLoading,
  error: boothError,
  reservationIds: reservationIds
});

// Also check userReducer state
const userState = useSelector((state: any) => {
  console.log('User Redux State:', state.userReducer);
  return state.userReducer || {};
});

console.log('User state loading:', userState.loading);


console.log('User state loading:', userState.loading);
   const {
    selectedBooths,
    feedback,
    toggleBoothSelection,
    removeBoothFromSelection,
    clearAllSelections,
    exportBoothSelections,
    saveBoothSelections
  } = useBoothSelection();

    // ADD THIS DEBUG FUNCTION HERE ⬇️
  // const debugModalProps = () => {
  //   console.log('=== DEBUGGING MODAL PROPS ===');
  //   console.log('showTwoStepModal:', showTwoStepModal);
  //   console.log('selectedBooths (original):', Object.keys(selectedBooths));
  //   console.log('reservedBoothsData:', reservedBoothsData);
  //   console.log('profile:', profile);
  //   console.log('user:', user);
  //   console.log('=== END MODAL PROPS DEBUG ===');
  // };

  // ADD THIS HANDLER HERE ⬇️
  // const handleOpenModal = () => {
  //   debugModalProps();
  //   setShowTwoStepModal(true);
  // };

  // Prepare props for TwoStepModal
const allLocationBooths = useMemo(() => {
  const locations = new Set(
    Object.values(selectedBooths).map((booth: any) => 
      booth.locationName || 'Africa Hall'
    )
  );
  
  let combinedBooths: { [key: string]: any } = {};
  
  locations.forEach(location => {
    const locationBooths = getBoothsForLocation(location);
    combinedBooths = { ...combinedBooths, ...locationBooths };
  });
  
  // If no location-specific booths found, fallback to africaHallBooths
  if (Object.keys(combinedBooths).length === 0) {
    combinedBooths = africaHallBooths;
  }
  
  return combinedBooths;
}, [selectedBooths, africaHallBooths]);

const twoStepProps = useTwoStepModalProps({
  selectedBooths,
  africaHallBooths: allLocationBooths, // Pass combined booths instead
  reservedBoothsData,
  profile,
  user,
  INDOOR_RATE_PER_SQM
});

    // Add this useEffect to fetch reserved booths
  useEffect(() => {
    const fetchReservedBooths = async (): Promise<void> => {
      try {
        dispatch(getUserBoothReservations() as any)
          .unwrap()
          .then((response: any) => {
            setReservedBoothsData(response.data.data || []);
            
          })
          .catch((err: any) => {
            console.log('Error fetching reserved booths:', err);
            // setToastType('error');
            // setToastMessage(err || 'Failed to fetch reserved booths');
            // setShowToast(true);
          });
      } catch (error) {
        console.error('Error fetching reserved booths:', error);
      }
    };

    fetchReservedBooths();
    const intervalId = setInterval(fetchReservedBooths, 30000);

    return () => clearInterval(intervalId);
  }, [dispatch]);

 // Add handler for reservation completion
  const handleReservationComplete = useCallback(() => {
    // Update booth statuses to 'booked-by-you'
    Object.keys(selectedBooths).forEach(boothId => {
      if (africaHallBooths[boothId]) {
        africaHallBooths[boothId].status = 'booked-by-you';
      }
    });
    
    // Clear selections
    clearAllSelections();
    
    // Refresh reserved booths data
    dispatch(getUserBoothReservations() as any);
    
    // Close modal
    setShowTwoStepModal(false);
    
    // Create feedback message directly
    // setToastType('success');
    // setToastMessage('Booth reservation completed successfully!');
    // setShowToast(true);
  }, [selectedBooths, africaHallBooths, clearAllSelections, dispatch]);

  const {
    zoom,
    debugMode,
    coordinatesMode,
    mouseCoords,
    zoomIn,
    zoomOut,
    resetZoom,
    toggleDebug,
    toggleCoordinates,
    updateMouseCoords
  } = useZoomControls();

 const {
  isPickerActive,
  currentPoints,
  polygons,
  selectedPolygonId,
  pickerMode,
  // setIsPickerActive,
  addPoint,
  // removeLastPoint,
  // clearCurrentPoints,
  // completePolygon,
  deletePolygon,
  setSelectedPolygonId,
  // setPickerMode,
  // togglePicker,
  getPointsString,
  getPolygonString,
  // exportPolygons,
  copyToClipboard,
  calculateSvgCoordinates
} = useCoordinatePicker(3308, 2340); // Main site viewBox dimensions

  // const showSectorInfo = useCallback((sectorCode: string) => {
  //   setPanelState({
  //     isOpen: true,
  //     type: 'sector',
  //     data: sectorCode,
  //     title: sectorData[sectorCode]?.name || 'Sector Information'
  //   });
  // }, []);


// const hasUnsavedSelections = Object.keys(selectedBooths).length > 0;

// Create a confirmation function
// const confirmLocationChange = useCallback((callback: () => void) => {
//   if (hasUnsavedSelections) {
//     const confirmed = window.confirm(
//       'You have unsaved booth selections. Switching locations will clear your current selections. Continue?'
//     );
//     if (confirmed) {
//       callback();
//     }
//   } else {
//     callback();
//   }
// }, [hasUnsavedSelections]);

// In your TradeFairMap component, update the clearAllLocationSelections function:
const clearAllLocationSelections = useCallback(() => {
  // Clear the main selectedBooths state
  clearAllSelections();
  
  // Reset all booth statuses to 'available' in the current location
  if (panelState.data?.existingBooths) {
    Object.values(panelState.data.existingBooths).forEach((booth: any) => {
      if (booth.status === 'selected') {
        booth.status = 'available';
      }
    });
  }
}, [clearAllSelections, panelState.data]);


  // For Africa Hall
const showAfricaHall = useCallback(() => {
    if (Object.keys(selectedBooths).length > 0) {
    clearAllSelections(africaHallBooths);
  }
          const layoutData = {
          name: 'Africa Hall',
          title: 'AFRICA HALL - Interactive Booth Selection',
          type: 'hall' as const,
          color: '#dc2626',
          boothCount: 58,
          description: 'Africa Hall features both 6m² and 9m² booth options with premium positioning and excellent visibility.',
          imageSrc: '/siteplan/DIM_AFRICAHALL15mx50m-1.png',
          existingBooths:getBoothsForLocation('Africa Hall') ,
          boothTypes: [
            {
              size: '6m² Booths',
              count: 26,
              description: 'Perfect for startups and small businesses',
              range: 'Booths: S017-S042'
            },
            {
              size: '9m² Booths',
              count: 32,
              description: 'Ideal for established companies',
              range: 'Booths: N001-N016, N043-N058'
            }
          ],
          ratePerSqm: INDOOR_RATE_PER_SQM
    };

    setPanelState({
      isOpen: true,
      type: 'interactive-layout',
      data: layoutData,
      title: layoutData.title
    });

}, [selectedBooths, clearAllSelections, africaHallBooths]);

  const showHallA = useCallback(() => {
    const proceedWithChange = () => {
    clearAllLocationSelections();
    const layoutData = {
      name: 'Hall A',
      title: 'HALL A - Booth Layout',
      type: 'hall' as const,
      color: '#8e44ad',
      boothCount: 47,
      description: 'Hall A is a spacious exhibition hall featuring exclusively 9m² booth spaces. This hall provides excellent visibility and accessibility for medium to large exhibitors.',
      imageSrc: '/siteplan/DIMENSIONED_HALLA25mx30m-1.png',
     existingBooths:getBoothsForLocation('Hall A') ,
      boothTypes: [
        {
          size: '9m² Booths Only',
          count: 47,
          description: 'Ideal for established companies and larger displays',
          range: 'Booths: N001-N047'
        }
      ],
      ratePerSqm: INDOOR_RATE_PER_SQM
    };

    setPanelState({
      isOpen: true,
      type: 'interactive-layout',
      data: layoutData,
      title: layoutData.title
    });
   };
   proceedWithChange()
  //  confirmLocationChange(proceedWithChange);
}, [clearAllSelections]);

  const showHallB = useCallback(() => {
    const proceedWithChange = () => {
    clearAllLocationSelections();
    const layoutData = {
      name: 'Hall B',
      title: 'HALL B - Booth Layout',
      type: 'hall' as const,
      color: '#27ae60',
      boothCount: 97,
      description: 'Hall B is the largest exhibition hall featuring exclusively 9m² booth spaces. This hall is ideal for major exhibitions with high visitor traffic and premium positioning.',
      imageSrc: '/siteplan/DIMENSIONED_HALLB25mx55m-1.png',
       existingBooths:getBoothsForLocation('Hall B') ,
      boothTypes: [
        {
          size: '9m² Booths Only',
          count: 97,
          description: 'Perfect for large companies and comprehensive displays',
          range: 'Booths: N001-N097'
        }
      ],
      ratePerSqm: INDOOR_RATE_PER_SQM
    };

    setPanelState({
      isOpen: true,
      type: 'interactive-layout',
      data: layoutData,
      title: layoutData.title
    });
   };
   proceedWithChange()
  //  confirmLocationChange(proceedWithChange);
}, [clearAllSelections]);


  const showInternationalHall = useCallback(() => {
     const proceedWithChange = () => {
    clearAllLocationSelections()
    const layoutData = {
      name: 'International Hall',
      title: 'International Hall - Booth Layout',
      type: 'hall' as const,
      color: '#f39c12',
      boothCount: 58,
      description: 'International Hall is designed for global exhibitors featuring both 6m² and 9m² booth options. This hall specializes in international business opportunities and cross-border trade.',
      imageSrc: '/siteplan/DIM_INTERNATIONALHALL15mx50m-1.png',
      existingBooths: getBoothsForLocation('International Hall'),
      boothTypes: [
        {
          size: '6m² Booths',
          count: 26,
          description: 'Perfect for international startups',
          range: 'Booths: S017-S042'
        },
        {
          size: '9m² Booths',
          count: 32,
          description: 'Ideal for established international companies',
          range: 'Booths: N001-N016, N043-N058'
        }
      ],
      ratePerSqm: INDOOR_RATE_PER_SQM
    };

    setPanelState({
      isOpen: true,
      type: 'interactive-layout',
      data: layoutData,
      title: layoutData.title
    });
  };
   proceedWithChange()
  //  confirmLocationChange(proceedWithChange);
}, [clearAllSelections]);


  const showSectorInfo = useCallback((sectorCode: string) => {
     const proceedWithChange = () => {
    const sector = sectorData[sectorCode];
    clearAllLocationSelections();
    if (!sector) return;

    const layoutData = {
      name: sector.name,
      title: `${sectorCode} - ${sector.name}`,
      type: 'sector' as const,
      color: sector.color,
      boothCount: sector.boothCount,
      description: sector.description,
      imageSrc: `/siteplan/sectors/${sectorCode.toLowerCase()}-layout.png`, // You'll need sector layout images
      existingBooths: getBoothsForLocation(sector.name), // Get sector booth data
      ratePerSqm: INDOOR_RATE_PER_SQM
    };

    setPanelState({
      isOpen: true,
      type: 'interactive-layout',
      data: layoutData,
      title: layoutData.title
    });
  };
   proceedWithChange()
  //  confirmLocationChange(proceedWithChange);
}, [clearAllSelections]);



// const showInternationalHall = useCallback(() => {
//   const layoutData = {
//     name: 'International Hall',
//     title: 'International Hall - Booth Layout',
//     type: 'hall' as const,
//     color: '#f39c12',
//     boothCount: 58,
//     description: 'International Hall is designed for global exhibitors featuring both 6m² and 9m² booth options. This hall specializes in international business opportunities and cross-border trade.',
//     imageSrc: '/siteplan/DIM_INTERNATIONALHALL15mx50m-1.png',
//     existingBooths: {}, // Empty until coordinates are defined
//     boothTypes: [
//       {
//         size: '6m² Booths',
//         count: 26,
//         description: 'Perfect for international startups',
//         range: 'Booths: S017-S042'
//       },
//       {
//         size: '9m² Booths',
//         count: 32,
//         description: 'Ideal for established international companies',
//         range: 'Booths: N001-N016, N043-N058'
//       }
//     ],
//     ratePerSqm: INDOOR_RATE_PER_SQM
//   };

//   setPanelState({
//     isOpen: true,
//     type: 'interactive-layout',
//     data: layoutData,
//     title: layoutData.title
//   });
// }, []);
  const closePanel = useCallback(() => {
    setPanelState(prev => ({ ...prev, isOpen: false }));
  }, []);

  // Booth management functions
  const resetAllAfricaHallBooths = useCallback(() => {
    // const count = Object.keys(selectedBooths).length;
    Object.keys(africaHallBooths).forEach(boothId => {
      if (africaHallBooths[boothId].status === 'selected') {
        africaHallBooths[boothId].status = 'available';
      }
    });
    clearAllSelections();
  }, [selectedBooths, clearAllSelections]);

  const getAvailableBooths = useCallback(() => {
    const available = Object.keys(africaHallBooths).filter(id => 
      africaHallBooths[id].status === 'available'
    );
    alert(`Available booths: ${available.join(', ')}\n\nTotal available: ${available.length}`);
  }, []);

  const getSelectedBooths = useCallback(() => {
    const selected = Object.keys(selectedBooths);
    
    if (selected.length === 0) {
      alert('No booths currently selected');
    } else {
      alert(`Selected booths: ${selected.join(', ')}\n\nTotal selected: ${selected.length}`);
    }
  }, [selectedBooths]);

  const showBoothStatistics = useCallback(() => {
    const stats = {
      available: Object.keys(africaHallBooths).filter(id => africaHallBooths[id].status === 'available').length,
      selected: Object.keys(selectedBooths).length,
      bookedByYou: Object.keys(africaHallBooths).filter(id => africaHallBooths[id].status === 'booked-by-you').length,
      bookedByOthers: Object.keys(africaHallBooths).filter(id => africaHallBooths[id].status === 'booked-by-others').length,
      total: Object.keys(africaHallBooths).length
    };
    
    alert(`Africa Hall Booth Statistics:\n\n` +
          `Available: ${stats.available}\n` +
          `Selected: ${stats.selected}\n` +
          `Booked by You: ${stats.bookedByYou}\n` +
          `Booked by Others: ${stats.bookedByOthers}\n` +
          `Total: ${stats.total}`);
  }, [selectedBooths]);

  // Close panel when clicking outside
// Find this useEffect in your TradeFairMap component and update it:
useEffect(() => {
  const handleClickOutside = (e: MouseEvent) => {
    const target = e.target as Element;
    
    // Check if click is on the info panel or its children
    const infoPanel = document.querySelector('.info-panel-container');
    if (infoPanel && infoPanel.contains(target)) {
      return; // Don't close if clicking inside the panel
    }
    
    // Check if click is on the main site plan SVG
    const mainSiteSvg = target.closest('.main-site-svg');
    if (mainSiteSvg) {
      closePanel();
      return;
    }
    
    // Check if click is outside both the panel and the site plan
    const sitePlanContainer = document.querySelector('.site-plan-container');
    if (!sitePlanContainer?.contains(target)) {
      closePanel();
    }
  };

  if (panelState.isOpen) {
    // Small delay to prevent immediate closing
    setTimeout(() => {
      document.addEventListener('click', handleClickOutside);
    }, 100);
    
    return () => document.removeEventListener('click', handleClickOutside);
  }
}, [panelState.isOpen, closePanel]);

  const renderPanelContent = () => {
    switch (panelState.type) {
      case 'sector':
        return (
          <SectorInfoPanel
            sectorCode={panelState.data}
            onClose={closePanel}
          />
        );
      case 'hall':
        return (
          <HallInfoPanel
            hallName={panelState.title}
            hallData={panelState.data}
            onClose={closePanel}
          />
        );
      case 'africa-hall':
        return (
          <AfricaHallLayout
            selectedBooths={selectedBooths}
            feedback={feedback}
            onBoothClick={toggleBoothSelection}
            onRemoveBooth={removeBoothFromSelection}
            onExport={exportBoothSelections}
            onSave={saveBoothSelections}
            onClearAll={clearAllSelections}
            onResetAll={resetAllAfricaHallBooths}
            onShowAvailable={getAvailableBooths}
            onShowSelected={getSelectedBooths}
            onShowStatistics={showBoothStatistics}
            onCompleteReservation={() => setShowTwoStepModal(true)} // Add this line
          />
        );
      case 'interactive-layout':
  return (
    <EnhancedUnifiedInteractiveLayout
    // <UnifiedInteractiveLayout
      layoutData={panelState.data}
      onClose={closePanel}
      selectedBooths={selectedBooths}
      feedback={feedback}
      onBoothClick={(boothId) => {
  toggleBoothSelection(
    boothId, 
    panelState.data.existingBooths,
    { name: panelState.data.name, type: panelState.data.type }
  );
}}
      onRemoveBooth={removeBoothFromSelection}
      onExport={exportBoothSelections}
      onSave={saveBoothSelections}
        onClearAll={() => clearAllSelections(panelState.data.existingBooths)} // Pass current booths
      onCompleteReservation={() => setShowTwoStepModal(true)}
    />
  );
      default:
        return null;
    }
  };

  return (
    <div className="font-sans m-0 p-0 bg-gray-100 overflow-x-auto">
      <div className="max-w-[1600px] mx-auto bg-white shadow-2xl">
        {/* Header */}
        <div className="bg-slate-700 text-white p-5 text-center">
          <h1 className="m-0 text-3xl font-bold">2025 LAGOS INTERNATIONAL TRADE FAIR</h1>
          <p className="mt-2">Comprehensive Interactive Site Plan</p>
        </div>

        {/* Instructions */}
        {/* <div className="bg-blue-600 text-white p-4 text-center font-bold">
          🖱️ Click on any colored sector or hall to view detailed information. Click Africa Hall for interactive booth selection.
        </div> */}

        {/* Legend */}
        <SectorLegend />

        {/* Zoom Controls */}
        <ZoomControls
          // zoom={zoom}
          // debugMode={debugMode}
          // coordinatesMode={coordinatesMode}
          onZoomIn={zoomIn}
          onZoomOut={zoomOut}
          onResetZoom={resetZoom}
          onToggleDebug={toggleDebug}
          onToggleCoordinates={toggleCoordinates}
        />
{/* Coordinate Picker Toolbar */}
{/* <CoordinatePickerToolbar
  isActive={isPickerActive}
  onToggle={togglePicker}
  onUndo={removeLastPoint}
  onClear={clearCurrentPoints}
  onComplete={completePolygon}
  onExport={exportPolygons}
  currentPointsCount={currentPoints.length}
  mode={pickerMode}
  onModeChange={setPickerMode}
/> */}

{/* Current Points Display */}
<CurrentPointsDisplay
  points={currentPoints}
  isActive={isPickerActive}
  onCopyCoordinates={copyToClipboard}
  getPolygonString={getPolygonString}
/>

{/* Polygon List */}
<PolygonList
  polygons={polygons}
  selectedPolygonId={selectedPolygonId}
  onSelectPolygon={setSelectedPolygonId}
  onDeletePolygon={deletePolygon}
  onCopyCoordinates={copyToClipboard}
  getPolygonString={getPolygonString}
/>
        {/* Coordinate Display */}
        <CoordinateDisplay visible={coordinatesMode} coords={mouseCoords} />

        {/* Status Display */}
        {/* <StatusDisplay /> */}

        {/* Site Plan Container */}
        {/* Site Plan Container */}
<div className="site-plan-container p-5 text-center relative bg-white">
  <div 
    className="inline-block relative shadow-2xl border-2 border-gray-800 rounded-lg overflow-hidden"
    style={{ 
      transform: `scale(${zoom})`,
      backgroundColor: 'transparent'
    }}
  >
    {/* Background layer - Image */}
    <div className="relative">
      <img 
        src="/siteplan/2025litf.png"
        alt="2025 Lagos International Trade Fair Site Plan"
        className="max-w-full h-auto block"
        onMouseMove={coordinatesMode ? updateMouseCoords : undefined}
      />
    </div>
    
    {/* Overlay layer with SVG */}
    <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
 <svg 
  className={`main-site-svg absolute top-0 left-0 w-full h-full pointer-events-none ${debugMode ? 'debug-mode' : ''}`}
  viewBox="0 0 3308 2340" 
  preserveAspectRatio="none"
  style={{ 
    pointerEvents: isPickerActive ? 'all' : 'none', // Only capture events when picker is active
    mixBlendMode: 'normal'
  }}
  onClick={(e) => {
    if (isPickerActive && pickerMode === 'create') {
      const svg = e.currentTarget;
      const coords = calculateSvgCoordinates(e, svg);
      addPoint(coords.x, coords.y);
    }
  }}
>
        {/* Add the coordinate picker overlay first */}
        <CoordinatePickerOverlay
          currentPoints={currentPoints}
          polygons={polygons}
          selectedPolygonId={selectedPolygonId}
          isPickerActive={isPickerActive}
          getPointsString={getPointsString}
        />
        
        {/* HALLS with detailed sub-layouts */}
        <SectorPolygon
          points="1774,1431,1944,1269,1994,1320,1825,1478,1772,1431"
          // className="sector-area africa-hall"
          sectorType="africa-hall"
          title="🏛️ Africa Hall - Click to view interactive booth layout (58 booths)"
          onClick={() => {
            if (!isPickerActive) {
              showAfricaHall();
            }
          }}
          debugMode={debugMode}
          style={{ pointerEvents: 'all' }} // Add this to each polygon
          user={user}
        />
        
        <SectorPolygon
          points="1857,907,1973,790,2060,874,1941,986"
      
          sectorType="hall-a"
          title="🏛️ Hall A - Click to view booth layout (47 booths)"
          onClick={() => {
            if (!isPickerActive) {
              showHallA();
            }
          }}
          debugMode={debugMode}
          style={{ pointerEvents: 'all' }}
          user={user}
        />

        <SectorPolygon
          points="1931,1214,2117,1032,2197,1116,2009,1299"
         
          sectorType="hall-b"
          title="🏛️ Hall B - Click to view booth layout (97 booths)"
          onClick={() => {
            if (!isPickerActive) {
              showHallB();
            }
          }}
          debugMode={debugMode}
          style={{ pointerEvents: 'all' }}
          user={user}
        />

        <SectorPolygon
          points="1721,1370,1886,1209,1937,1259,1767,1420"
    
          sectorType="international-hall"
          title="🏛️ International Hall - Click to view booth layout (58 booths)"
          onClick={() => {
            if (!isPickerActive) {
              showInternationalHall();
            }
          }}
          debugMode={debugMode}
          style={{ pointerEvents: 'all' }}
          user={user}
        />

        {/* MAIN SECTORS */}
        <SectorPolygon
          points="1908,1045,2081,879,2112,846,2015,749,2039,724,2082,769,2121,731,2203,804,2136,865,2105,897,2239,1029,2187,1081,2124,1020,2112,1008,2049,1073,1990,1128"
         
          sectorType="hct-sector"
          title="💄 HCT - Household Cosmetics & Textile Products (152 booths)"
          onClick={() => {
            if (!isPickerActive) {
              showSectorInfo('HCT')
            }
          }}
          debugMode={debugMode}
          style={{ pointerEvents: 'all' }}
          user={user}
        />

        <SectorPolygon
          points="1608,744,1725,639,1723,617,1635,527,1686,472,1812,355,1948,493,2051,600,1981,665,2021,707,2000,728,1893,825,1774,708,1743,696,1647,781"
         
          sectorType="fda-sector"
          title="🌾 FDA - Food, Drinks, Agriculture & Allied Products (286 booths)"
          onClick={() => {
            if (!isPickerActive) {
              showSectorInfo('FDA')
            }
          }}
          debugMode={debugMode}
          style={{ pointerEvents: 'all' }}
          user={user}
        />

        {/* <SectorPolygon
          points="1589,1286,1715,1170,2050,1484,1956,1566,2005,1619,1976,1648,1813,1494"
          className="sector-area fda-sector"
          sectorType="fda-sector"
          title="🌾 FDA - Food, Drinks, Agriculture & Allied Products"
          onClick={() => showSectorInfo('FDA')}
          debugMode={debugMode}
          style={{ pointerEvents: 'all' }}
        /> */}

        <SectorPolygon
          points="1332,1012,1592,761,1635,800,1480,948,1377,1048,1329,1009"
          sectorType="eei-sector"
          title="💻 EEI - ICT & Electronics Products (72 booths)"
          onClick={() => {
            if (!isPickerActive) {
              showSectorInfo('EEI')
            }
          }}
          debugMode={debugMode}
          style={{ pointerEvents: 'all' }}
          user={user}
        />

        <SectorPolygon
          points="1637,1313,1837,1118,1856,1137,1863,1175,1882,1194,1698,1374"
         
          sectorType="cog-sector"
          title="🏭 COG - Conglomerate (50 booths)"
          onClick={() => {
            if (!isPickerActive) {
              showSectorInfo('COG')
            }
          }}
          debugMode={debugMode}
          style={{ pointerEvents: 'all' }}
          user={user}
        />

        <SectorPolygon
          points="1833,332,1854,313,2467,921,2443,944,1832,336"
          sectorType="cop-sector"
          title="🏭 COP - Commercial Premium (60 booths)"
          onClick={() => {
            if (!isPickerActive) {
              showSectorInfo('COP')
            }
          }}
          debugMode={debugMode}
          style={{ pointerEvents: 'all' }}
          user={user}
        />

        <SectorPolygon
          points="1553,1839,1745,1642,1882,1773,1684,1973,1551,1839"
         
          sectorType="ta-sector"
          title=" TA - Transport and Allied/Power Products (132 booths)"
          onClick={() => {
            if (!isPickerActive) {
              showSectorInfo('TA')
            }
          }}
          debugMode={debugMode}
          style={{ pointerEvents: 'all' }}
          user={user}
        />

        <SectorPolygon
          points="1189,947,1208,930,1797,1515,1779,1538,1189,945"
         
          sectorType="cga-sector"
          title="🏢 CGA - Corporate Organizations & Government Agencies (57 booths)"
          onClick={() => {
            if (!isPickerActive) {
              showSectorInfo('CGA')
            }
          }}
          debugMode={debugMode}
          style={{ pointerEvents: 'all' }}
          user={user}
        />

        <SectorPolygon
          points="1842,1114,1896,1060,1974,1142,1924,1193,1837,1113"
        
          sectorType="rbf-sector"
          title="🏠 RBF - Real Estate, Building Furniture & Fittings (16 booths)"
          onClick={() => {
            if (!isPickerActive) {
              showSectorInfo('RBF')
            }
          }}
          debugMode={debugMode}
          style={{ pointerEvents: 'all' }}
          user={user}
        />

        <SectorPolygon
          points="2158,891,2226,825,2365,970,2298,1031"
          sectorType="oth-sector"
          title="📚 OTH - Publication, Healthcare & Sport Products (98 booths)"
          onClick={() => {
            if (!isPickerActive) {
              showSectorInfo('OTH')
            }
          }}
          debugMode={debugMode}
          style={{ pointerEvents: 'all' }}
          user={user}
        />
      </svg>
    </div>
  </div>
</div>
      </div>

      {/* Info Panel */}
      <InfoPanel
        isOpen={panelState.isOpen}
        title={panelState.title}
        onClose={closePanel}
      >
        {renderPanelContent()}
      </InfoPanel>

      

        {/* ADD THE TWO-STEP MODAL HERE */}
      {showTwoStepModal && (
         <>
    {/* {console.log('About to render TwoStepModal with loading state:', boothLoading)} */} 
        <TwoStepBoothReservation
          show={showTwoStepModal}
          layoutData={panelState.data}
          onHide={() => setShowTwoStepModal(false)}
          selectedBooths={twoStepProps.selectedBooths}
          personalInfo={twoStepProps.personalInfo}
          sectorLayouts={twoStepProps.sectorLayouts}
          BOOTH_PRICES={twoStepProps.BOOTH_PRICES}
          isReservedByCurrentUser={twoStepProps.isReservedByCurrentUser}
          taxConfig={twoStepProps.taxConfig}
          currencyConfig={twoStepProps.currencyConfig}
                totalAmount={twoStepProps.totalAmount}  // Add this
      boothBreakdown={twoStepProps.boothBreakdown}  // Add this
          onReservationComplete={handleReservationComplete}
          standalone={false}
        />
        </>
      )}
    </div>
  );
};

export default TradeFairMap;
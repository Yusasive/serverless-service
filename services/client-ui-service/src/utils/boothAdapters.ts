// utils/boothAdapters.ts
interface BoothSelections {
  [boothId: string]: {
    coords: number[][];
    status: 'available' | 'selected' | 'booked-by-you' | 'booked-by-others';
    size: string;
    category: 'Standard' | 'Premium';
    price: number;
    sqm: number;
    boothId?: string;
    selectedAt: string;
    locationName?: string;
    locationType?: 'hall' | 'sector';
  };
}
interface BoothData {
  coords: number[][];
  status: 'available' | 'selected' | 'booked-by-you' | 'booked-by-others';
  size: string;
  category: 'Standard' | 'Premium';
  price: number;
  sqm: number;
  boothId?: string;
}

interface SectorLayout {
  size: 'sm' | 'md' | 'lg';
}

/**
 * Get layout prefix for transformation
 * africa-hall → AFRICAHALL
 * hall-b → HALLB
 * international-hall → INTERNATIONALHALL
 */
export const getLayoutPrefix = (layoutId: string): string => {
  return layoutId.toUpperCase().replace(/-/g, '');
};

/**
 * Transform booth ID from new system format to TwoStepModal format
 * Context-aware version
 */
export const transformBoothId = (newBoothId: string, layoutId: string = 'africa-hall'): string => {
  const prefix = getLayoutPrefix(layoutId);
  return `${prefix}-${newBoothId}`;
};

/**
 * Reverse transform booth ID from TwoStepModal format to new system format
 * Context-aware version
 */
export const reverseTransformBoothId = (oldBoothId: string, layoutId?: string): string => {
  if (layoutId) {
    const prefix = getLayoutPrefix(layoutId);
    return oldBoothId.replace(`${prefix}-`, '');
  }
  // Fallback: remove any known prefix
  return oldBoothId.replace(/^(AFRICAHALL|HALLB|INTERNATIONALHALL|HALLA)-/, '');
};

/**
 * Get the price category for a booth based on its ID
 * Context-aware version
 */
export const getBoothPriceCategory = (
  boothId: string, 
  currentLayoutBooths: { [key: string]: BoothData },
  layoutId: string = 'africa-hall'
): 'sm' | 'md' | 'lg' => {
  const originalId = reverseTransformBoothId(boothId, layoutId);
  const booth = currentLayoutBooths[originalId];
  
  if (!booth) return 'md'; // Default fallback
  
  // Map booth size to price category
  if (booth.sqm <= 6) {
    return 'sm'; // Small booths (6m²)
  } else if (booth.sqm <= 9) {
    return 'md'; // Medium booths (9m²)
  } else {
    return 'lg'; // Large booths (12m²+)
  }
};

/**
 * Create sector layouts from current layout booth data
 * Context-aware version
 */
export const createSectorLayouts = (
  currentLayoutBooths: { [key: string]: BoothData },
  layoutId: string = 'africa-hall'
): { [key: string]: SectorLayout } => {
  const layouts: { [key: string]: SectorLayout } = {};
  const prefix = getLayoutPrefix(layoutId);
  
  // Create main layout sector
  layouts[prefix] = { size: 'md' }; // Default to medium
  
  // Create specific series layouts for more precise control
  const nSeriesBooths = Object.values(currentLayoutBooths).filter(booth => 
    booth.boothId?.startsWith('N')
  );
  const sSeriesBooths = Object.values(currentLayoutBooths).filter(booth => 
    booth.boothId?.startsWith('S')
  );
  
  if (nSeriesBooths.length > 0) {
    // N-series are typically 9m² -> 'md'
    layouts[`${prefix}-N`] = { size: 'md' };
  }
  
  if (sSeriesBooths.length > 0) {
    // S-series are typically 6m² -> 'sm'
    layouts[`${prefix}-S`] = { size: 'sm' };
  }
  
  return layouts;
};

/**
 * Transform selected booths from new system to TwoStepModal format
 * Context-aware version
 */
export const transformSelectedBooths = (
  selectedBooths: BoothSelections, 
  layoutId?: string
): string[] => {
  return Object.keys(selectedBooths).map(boothId => {
    // If boothId already contains a hyphen, use it as is
    if (boothId.includes('-')) {
      return boothId;
    }
    
    // Otherwise, try to extract sector info from the booth data
    const booth = selectedBooths[boothId];
    const locationName = booth.locationName || 'Africa Hall';
    
    // Map location names to sector codes
    const locationToSector: { [key: string]: string } = {
      'Africa Hall': 'AFRICAHALL',
      'Hall A': 'HALLA',
      'Hall B': 'HALLB',
      'International Hall': 'INTERNATIONAL',
      // Add sector mappings
      'Food, Drinks, Agriculture & Allied Products': 'FDA',
      'Household Cosmetics & Textile Products': 'HCT',
      'ICT & Electronics Products': 'EEI',
      'Corporate Organizations & Government Agencies': 'CGA',
      'Transport and Allied/Power Products': 'TA',
      'Real Estate, Building Furniture & Fittings': 'RBF',
      'Conglomerate': 'COG',
      'Commercial Premium': 'COP',
      'Commercial Premium Sector': 'COP',
      'Publication, Healthcare & Sport Products': 'OTH',

      // Also support short codes for backward compatibility
      'FDA': 'FDA',
      'HCT': 'HCT',
      'EEI': 'EEI',
      'CGA': 'CGA',
      'TA': 'TA',
      'RBF': 'RBF',
      'COG': 'COG',
      'OTH': 'OTH',
      'COP': 'COP'
      
    };
    
    // If layoutId is provided, use it to determine the prefix
    if (layoutId) {
      const prefix = getLayoutPrefix(layoutId);
      return `${prefix}-${boothId}`;
    }
    
    // Otherwise use the location name mapping
    const sector = locationToSector[locationName] || 'AFRICAHALL';
    return `${sector}-${boothId}`;
  });
};

/**
 * Interface matching TwoStepBoothReservation expectations
 */
interface BoothPrices {
  sm: number;
  md: number;
  lg: number;
}

/**
 * Create booth price mapping for TwoStepModal
 * Context-aware version
 */
export const createBoothPrices = (
  currentLayoutBooths: { [key: string]: BoothData },
  INDOOR_RATE_PER_SQM: number
): BoothPrices => {
  // Get sample booths to determine pricing
  const nSeriesBooths = Object.values(currentLayoutBooths).filter(booth => 
    booth.boothId?.startsWith('N')
  );
  const sSeriesBooths = Object.values(currentLayoutBooths).filter(booth => 
    booth.boothId?.startsWith('S')
  );
  
  // Create pricing based on actual booth sizes
  const prices: BoothPrices = {
    sm: sSeriesBooths.length > 0 ? sSeriesBooths[0].sqm * INDOOR_RATE_PER_SQM : 6 * INDOOR_RATE_PER_SQM, // 6m² booths
    md: nSeriesBooths.length > 0 ? nSeriesBooths[0].sqm * INDOOR_RATE_PER_SQM : 9 * INDOOR_RATE_PER_SQM, // 9m² booths  
    lg: 12 * INDOOR_RATE_PER_SQM // Future use for larger booths
  };
  
  return prices;
};

/**
 * Create function to check if booth is reserved by current user
 * Context-aware version
 */
export const createReservedBoothChecker = (
  currentLayoutBooths: { [key: string]: BoothData },
  reservedBoothsData: any[],
  layoutId: string = 'africa-hall'
) => {
  return (boothId: string): boolean => {
    const originalId = reverseTransformBoothId(boothId, layoutId);
    
    // Check in current layout booths first
    const boothStatus = currentLayoutBooths[originalId]?.status;
    if (boothStatus === 'booked-by-you') {
      return true;
    }
    
    // Check in reservedBoothsData as fallback
    return reservedBoothsData.some(reservation => 
      reservation.boothId === originalId || 
      reservation.booth === originalId ||
      reservation.id === originalId
    );
  };
};

/**
 * Debug function to log transformed data
 * Context-aware version
 */
export const debugTransformedData = (
  selectedBooths: { [key: string]: any },
  currentLayoutBooths: { [key: string]: BoothData },
  INDOOR_RATE_PER_SQM: number,
  layoutId: string = 'africa-hall'
) => {
  console.log('=== DEBUGGING BOOTH TRANSFORMATION ===');
  console.log('Layout ID:', layoutId);
  console.log('Layout Prefix:', getLayoutPrefix(layoutId));
  
  // Log original selected booths
  console.log('Original Selected Booths:', Object.keys(selectedBooths));
  
  // Log transformed booth IDs
  const transformedBooths = transformSelectedBooths(selectedBooths, layoutId);
  console.log('Transformed Booth IDs:', transformedBooths);
  
  // Log sector layouts
  const sectorLayouts = createSectorLayouts(currentLayoutBooths, layoutId);
  console.log('Sector Layouts:', sectorLayouts);
  
  // Log booth prices
  const boothPrices = createBoothPrices(currentLayoutBooths, INDOOR_RATE_PER_SQM);
  console.log('Booth Prices:', boothPrices);
  
  // Log detailed booth analysis
  transformedBooths.forEach(boothId => {
    const originalId = reverseTransformBoothId(boothId, layoutId);
    const booth = currentLayoutBooths[originalId];
    const [sector, number] = boothId.split('-');
    
    console.log(`Booth Analysis for ${boothId}:`, {
      originalId,
      booth: booth ? {
        sqm: booth.sqm,
        price: booth.price,
        category: booth.category
      } : 'NOT FOUND',
      sector,
      number,
      expectedSectorLayout: sectorLayouts[`${sector}-${originalId?.charAt(0)}`] || sectorLayouts[sector]
    });
  });
  
  console.log('=== END DEBUG ===');
};

/**
 * Extract personal info from user profile for TwoStepModal
 */
export const extractPersonalInfo = (profile: any, user: any) => {
  return {
    firstName: profile?.firstName || user?.firstName || '',
    lastName: profile?.lastName || user?.lastName || '',
    email: profile?.email || user?.email || '',
    phoneNumber: profile?.phoneNumber || profile?.phone || user?.phone || '',
    company: profile?.company || profile?.ownerName || '',
    sector: profile?.sector || '',
    address: typeof profile?.address === 'object' 
      ? profile?.address?.street 
      : profile?.address || '',
    city: typeof profile?.address === 'object' 
      ? profile?.address?.city 
      : profile?.city || '',
    state: typeof profile?.address === 'object' 
      ? profile?.address?.state 
      : profile?.state || '',
    postalCode: typeof profile?.address === 'object' 
      ? profile?.address?.postalCode 
      : profile?.postalCode || '',
    country: typeof profile?.address === 'object' 
      ? profile?.address?.country 
      : profile?.country || '',
  };
};
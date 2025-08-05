// hooks/useTwoStepModalProps.ts
import { calculateTotalAmount, getBoothBreakdown } from '../utils/priceCalculations';
import { useMemo } from 'react';
import {
  transformSelectedBooths,
  createSectorLayouts,
  createBoothPrices,
  createReservedBoothChecker,
  extractPersonalInfo,
  debugTransformedData
} from '../utils/boothAdapters';

interface BoothData {
  coords: number[][];
  status: 'available' | 'selected' | 'booked-by-you' | 'booked-by-others';
  size: string;
  category: 'Standard' | 'Premium';
  price: number;
  sqm: number;
  boothId?: string;
}

interface BoothSelections {
  [boothId: string]: any;
}

interface TaxConfig {
  enabled: boolean;
  rate: number;
  label: string;
}

interface CurrencyConfig {
  showForeignCurrency: boolean;
  foreignCurrency: string;
  exchangeRates: {
    [key: string]: number;
  };
}

interface UseTwoStepModalPropsParams {
  selectedBooths: BoothSelections;
  africaHallBooths: { [key: string]: BoothData };
  reservedBoothsData: any[];
  profile: any;
  user: any;
  INDOOR_RATE_PER_SQM: number;
}

export const useTwoStepModalProps = ({
  selectedBooths,
  africaHallBooths,
  reservedBoothsData,
  profile,
  user,
  INDOOR_RATE_PER_SQM
}: UseTwoStepModalPropsParams) => {
  
  // Add safety checks for undefined/null values
  const safeSelectedBooths = selectedBooths || {};
  const safeAfricaHallBooths = africaHallBooths || {};
  const safeReservedBoothsData = reservedBoothsData || [];
  const safeProfile = profile || {};
  const safeUser = user || {};
  const safeIndoorRate = INDOOR_RATE_PER_SQM || 36680; // fallback rate
  
  console.log('Hook Input Check:', {
    selectedBooths: Object.keys(safeSelectedBooths).length,
    africaHallBooths: Object.keys(safeAfricaHallBooths).length,
    reservedBoothsData: safeReservedBoothsData.length,
    profile: !!safeProfile,
    user: !!safeUser,
    INDOOR_RATE_PER_SQM: safeIndoorRate
  });
  
  // Transform selected booth IDs to TwoStepModal format
  const transformedSelectedBooths = useMemo(() => {
    const result = transformSelectedBooths(safeSelectedBooths);
    console.log('Transformed booths:', result);
    return result;
  }, [safeSelectedBooths]);
  
  // Create sector layouts based on Africa Hall booth data
  const sectorLayouts = useMemo(() => {
    const result = createSectorLayouts(safeAfricaHallBooths);
    console.log('Sector layouts:', result);
    return result;
  }, [safeAfricaHallBooths]);
  
  // Create booth prices mapping
  const BOOTH_PRICES = useMemo(() => {
    const result = createBoothPrices(safeAfricaHallBooths, safeIndoorRate);
    console.log('Booth prices:', result);
    return result;
  }, [safeAfricaHallBooths, safeIndoorRate]);
  
  // Create reserved booth checker function
  const isReservedByCurrentUser = useMemo(() => {
    const checker = createReservedBoothChecker(safeAfricaHallBooths, safeReservedBoothsData);
    console.log('Reserved booth checker created');
    return checker;
  }, [safeAfricaHallBooths, safeReservedBoothsData]);
  
  // Extract personal info from profile and user
  const personalInfo = useMemo(() => {
    const result = extractPersonalInfo(safeProfile, safeUser);
    console.log('Personal info:', result);
    return result;
  }, [safeProfile, safeUser]);
  
  // Debug logging (remove this after fixing)
  useMemo(() => {
    if (Object.keys(selectedBooths).length > 0) {
      debugTransformedData(selectedBooths, africaHallBooths, INDOOR_RATE_PER_SQM);
    }
  }, [selectedBooths, africaHallBooths, INDOOR_RATE_PER_SQM]);
  
  // Tax configuration
  const taxConfig: TaxConfig = useMemo(() => ({
    enabled: true,
    rate: 7.5,
    label: 'VAT'
  }), []);
  
  // Currency configuration
  const currencyConfig: CurrencyConfig = useMemo(() => ({
    showForeignCurrency: false,
    foreignCurrency: 'USD',
    exchangeRates: {
      USD: 0.0012, // Example rate: 1 NGN = 0.0012 USD
      EUR: 0.0011  // Example rate: 1 NGN = 0.0011 EUR
    }
  }), []);

   // Add total amount calculation
  const totalAmount = useMemo(() => {
    return calculateTotalAmount(selectedBooths);
  }, [selectedBooths]);

  
  // Add booth breakdown for detailed display
  const boothBreakdown = useMemo(() => {
    return getBoothBreakdown(selectedBooths);
  }, [selectedBooths]);
  
  return {
    selectedBooths: transformedSelectedBooths,
    personalInfo,
    sectorLayouts,
    BOOTH_PRICES,
    isReservedByCurrentUser,
    taxConfig,
    currencyConfig,
        totalAmount,  // Add this
    boothBreakdown  // Add this
  };
};
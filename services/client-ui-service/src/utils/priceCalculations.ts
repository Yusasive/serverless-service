// utils/priceCalculations.ts
import { INDOOR_PRICING, OUTDOOR_PRICING, PREMIUM_OUTDOOR_PRICING, MINIMUM_REQUIREMENTS } from '../pages/Dashboard/exhibitor/shared/components/BoothsData/pricingConfig';

interface BoothInfo {
  boothId: string;
  sqm: number;
  locationName?: string;
  locationType?: 'hall' | 'sector';
  category?: 'Standard' | 'Premium';
}

interface LocationGroup {
  locationName: string;
  locationType: 'hall' | 'sector';
  booths: BoothInfo[];
  totalSqm: number;
  boothIds: string[];
}

export const getLocationType = (locationName: string, booths: any[]): 'indoor' | 'outdoor' | 'premium-outdoor' => {

  const isHall = locationName.toLowerCase().includes('hall');
 const isSector = ['food', 'hct', 'ict','eei', 'cga', 'ta', 'rbf', 'cog', 'publication','household','transport','conglomerate','corporate','commercial'].some(
    sector => locationName.toLowerCase().includes(sector.toLowerCase())
  );
  
  
  if (isHall) {
    return 'indoor';
  }
  
  if (isSector) {
    const hasPremium = booths.some(booth => booth.category === 'Premium');
     console.log("HasPremium", hasPremium);
    return hasPremium ? 'premium-outdoor' : 'outdoor';
  }
  
  return 'indoor';
};



export const calculatePackagePrice = (totalSqm: number, locationName: string, booths?: any[]): number | null => {
 const actualLocationType = booths ? getLocationType(locationName, booths) : 'indoor';
  console.log("actualLocationType nnnn", actualLocationType);
 
  const pricingTable = 
    actualLocationType.trim() === 'indoor' ? INDOOR_PRICING :
    actualLocationType.trim() === 'premium-outdoor' ? PREMIUM_OUTDOOR_PRICING :
    OUTDOOR_PRICING;
  
  if (actualLocationType.trim() === 'indoor') {
    // Return 0 if no booths
    if (!booths || booths.length === 0) {
      return 0;
    }
    
    const sqm = booths[0].sqm;
    //console.log("BOO 2027", JSON.stringify(booths));
    
    // Check if pricing exists for this sqm
    if (!pricingTable[sqm]) {
      return null; // No pricing found for this sqm
    }
    

    if(sqm === 6){
      // For 6 sqm booths, we need to check if there are multiple booths
      // If there are multiple booths, we return the price for 6 sqm multiplied by the number of booths
      if (booths.length > 1) {
        return pricingTable[sqm].price * booths.length;
      }
    }
    
     if (!pricingTable[totalSqm]) {
      return null; // No pricing found for this totalSqm
    }
    return pricingTable[totalSqm].price 

  } else {
    // For outdoor/premium-outdoor, use totalSqm
    if (!pricingTable[totalSqm]) {
      return null; // No pricing found for this totalSqm
    }
    
    return pricingTable[totalSqm].price;
  }
};

export const groupBoothsByLocation = (selectedBooths: { [key: string]: any }): { [key: string]: LocationGroup } => {
  const selections = Object.entries(selectedBooths);
  
  return selections.reduce((acc, [boothId, booth]) => {
    const locationKey = booth.locationName || 'Africa Hall';
    
    if (!acc[locationKey]) {
      acc[locationKey] = {
        locationName: locationKey,
        locationType: booth.locationType || 'hall',
        booths: [],
        totalSqm: 0,
        boothIds: []
      };
    }
    
    acc[locationKey].booths.push({ boothId, ...booth });
    acc[locationKey].totalSqm += booth.sqm;
    acc[locationKey].boothIds.push(boothId);
    
    return acc;
  }, {} as { [key: string]: LocationGroup });
};

export const calculateTotalAmount = (selectedBooths: { [key: string]: any }): number => {
  const groupedSelections = groupBoothsByLocation(selectedBooths);
  
  return Object.values(groupedSelections).reduce((total, locationData) => {
    const packagePrice = calculatePackagePrice(
      locationData.totalSqm, 
      locationData.locationType, 
      locationData.booths
    );
    return total + (packagePrice || 0);
  }, 0);
};

export const getBoothBreakdown = (selectedBooths: { [key: string]: any }) => {
  const groupedSelections = groupBoothsByLocation(selectedBooths);
  //  console.log("BOO 202999", groupedSelections);
  return Object.entries(groupedSelections).map(([location, data]) => {
  //  console.log("BOO 202999", data.totalSqm, data.locationName);
    // Calculate package price for each location
    const packagePrice = calculatePackagePrice(data.totalSqm, data.locationName, data.booths);
    
    return {
      location,
      ...data,
      packagePrice,
      isValid: data.totalSqm >= MINIMUM_REQUIREMENTS[getLocationType(data.locationName, data.booths)]
    };
  });
};
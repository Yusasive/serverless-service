//import { MINIMUM_REQUIREMENTS } from './pricingConfig';

// Determine location type based on location name and booth category
// const getLocationType = (locationName: string, booths: any[]): 'indoor' | 'outdoor' | 'premium-outdoor' => {
//   // Check if any booth in this location is marked as outdoor
//   const hasOutdoor = booths.some(booth => 
//     booth.category === 'Outdoor' || 
//     locationName.toLowerCase().includes('outdoor')
//   );
  
//   const hasPremium = booths.some(booth => 
//     booth.category === 'Premium' && hasOutdoor
//   );
  
//   if (hasPremium && hasOutdoor) return 'premium-outdoor';
//   if (hasOutdoor) return 'outdoor';
//   return 'indoor';
// };

// Calculate package price based on total area and location type
// const calculatePackagePrice = (totalSqm: number, locationType: string, booths?: any[]): number | null => {
//   // Determine the actual location type
//   const actualLocationType = booths ? getLocationType(locationType, booths) : 
//     locationType.includes('outdoor') ? 
//       (locationType.includes('premium') ? 'premium-outdoor' : 'outdoor') : 
//       'indoor';
  
//   // Select appropriate pricing table
//   const pricingTable = 
//     actualLocationType === 'indoor' ? INDOOR_PRICING :
//     actualLocationType === 'premium-outdoor' ? PREMIUM_OUTDOOR_PRICING :
//     OUTDOOR_PRICING;
  
//   // Check if exact match exists
//   if (pricingTable[totalSqm]) {
//     return pricingTable[totalSqm].price;
//   }
  
//   // For custom sizes, we might need to calculate based on closest tier
//   // or return null to indicate custom pricing needed
//   return null;
// };

// Validate minimum requirements
// const validateMinimumRequirement = (totalSqm: number, locationType: string, booths?: any[]): {
//   isValid: boolean;
//   message: string;
// } => {
//   const actualLocationType = booths ? getLocationType(locationType, booths) : 
//     locationType.includes('outdoor') ? 
//       (locationType.includes('premium') ? 'premium-outdoor' : 'outdoor') : 
//       'indoor';
  
//   const minimum = MINIMUM_REQUIREMENTS[actualLocationType];
  
//   if (totalSqm < minimum) {
//     return {
//       isValid: false,
//       message: `Below minimum (${minimum}m² required)`
//     };
//   }
  
//   return {
//     isValid: true,
//     message: 'Valid'
//   };
// };

// Check if all selections are valid
// const isAllSelectionsValid = (groupedSelections: Record<string, any>): boolean => {
//   return Object.values(groupedSelections).every(data => {
//     const validation = validateMinimumRequirement(data.totalSqm, data.locationType, data.booths);
//     return validation.isValid;
//   });
// };

// // Get entitlements for a given area and location type
// const getEntitlements = (totalSqm: number, locationType: string, booths?: any[]) => {
//   const actualLocationType = booths ? getLocationType(locationType, booths) : 
//     locationType.includes('outdoor') ? 
//       (locationType.includes('premium') ? 'premium-outdoor' : 'outdoor') : 
//       'indoor';
  
//   const pricingTable = 
//     actualLocationType === 'indoor' ? INDOOR_PRICING :
//     actualLocationType === 'premium-outdoor' ? PREMIUM_OUTDOOR_PRICING :
//     OUTDOOR_PRICING;
  
//   return pricingTable[totalSqm] || null;
// };
import { Country, State, ICountry, IState } from 'country-state-city';

// Get all countries
export const countriesList = Country.getAllCountries().map((country: ICountry) => ({
  code: country.isoCode,
  name: country.name,
  phoneCode: country.phonecode
}));

// Get states for a specific country
export const getStatesForCountry = (countryCode: string): string[] => {
  const states = State.getStatesOfCountry(countryCode);
  return states.map((state: IState) => state.name);
};

// Get country name by code
export const getCountryNameByCode = (countryCode: string): string => {
  const country = Country.getCountryByCode(countryCode);
  return country ? country.name : '';
};

// Get country code by name
export const getCountryCodeByName = (countryName: string): string => {
  const country = Country.getAllCountries().find((c: ICountry) => c.name === countryName);
  return country ? country.isoCode : '';
}; 
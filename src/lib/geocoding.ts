// Reverse geocoding using OpenStreetMap's Nominatim API (free, no API key required)
export interface LocationInfo {
  area: string;
  city: string;
  fullAddress: string;
}

export const reverseGeocode = async (
  latitude: number,
  longitude: number
): Promise<LocationInfo> => {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`,
      {
        headers: {
          'User-Agent': 'NagarikVani/1.0',
        },
      }
    );

    if (!response.ok) {
      throw new Error('Geocoding failed');
    }

    const data = await response.json();
    const address = data.address || {};

    // Extract area (suburb, neighbourhood, or locality)
    const area =
      address.suburb ||
      address.neighbourhood ||
      address.locality ||
      address.hamlet ||
      address.village ||
      address.town ||
      'Unknown Area';

    // Extract city
    const city =
      address.city ||
      address.town ||
      address.municipality ||
      address.county ||
      address.state_district ||
      'Unknown City';

    // Full address for reference
    const fullAddress = data.display_name || `${area}, ${city}`;

    return { area, city, fullAddress };
  } catch (error) {
    console.error('Reverse geocoding error:', error);
    return {
      area: 'Unknown Area',
      city: 'Unknown City',
      fullAddress: 'Location unavailable',
    };
  }
};

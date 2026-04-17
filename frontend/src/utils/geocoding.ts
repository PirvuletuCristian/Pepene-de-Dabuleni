/**
 * Reverse geocoding utility to get city names from coordinates
 */

export const getCityFromCoordinates = async (
  latitude: number,
  longitude: number
): Promise<string> => {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
    );
    const data = await response.json();
    
    // Extract city name from address - try different fallback options
    const address = data.address || {};
    const city = 
      address.city || 
      address.town || 
      address.village || 
      address.county || 
      "Unknown";
    
    return city;
  } catch (error) {
    console.error("Geocoding error:", error);
    return "Unknown";
  }
};

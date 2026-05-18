/**
 * Reverse geocoding utility to get city names from coordinates.
 * Uses an in-memory cache and a request queue to respect Nominatim's
 * usage policy (max 1 req/sec, User-Agent required).
 */

const cache = new Map<string, string>();

let lastRequestTime = 0;
const requestQueue: Array<() => void> = [];
let processingQueue = false;

const processQueue = () => {
  if (processingQueue || requestQueue.length === 0) return;
  processingQueue = true;
  const next = requestQueue.shift()!;
  const now = Date.now();
  const delay = Math.max(0, 1000 - (now - lastRequestTime));
  setTimeout(() => {
    lastRequestTime = Date.now();
    next();
    processingQueue = false;
    processQueue();
  }, delay);
};

const queueRequest = (): Promise<void> =>
  new Promise((resolve) => {
    requestQueue.push(resolve);
    processQueue();
  });

export const getCityFromCoordinates = async (
  latitude: number,
  longitude: number
): Promise<string> => {
  const key = `${latitude.toFixed(4)},${longitude.toFixed(4)}`;
  if (cache.has(key)) return cache.get(key)!;

  await queueRequest();

  try {
    const contact = process.env.REACT_APP_NOMINATIM_CONTACT || "contact@example.com";
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`,
      { headers: { "User-Agent": `PepeneDeDabuleni/1.0 (${contact})` } }
    );
    const data = await response.json();
    const address = data.address || {};
    const city =
      address.city ||
      address.town ||
      address.village ||
      address.county ||
      "Unknown";
    cache.set(key, city);
    return city;
  } catch (error) {
    console.error("Geocoding error:", error);
    return "Unknown";
  }
};

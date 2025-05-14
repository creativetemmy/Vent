
// Configuration for Neynar API
export const NEYNAR_API_KEY = import.meta.env.VITE_NEYNAR_API_KEY || '';

// If no API key is provided, log a warning
if (!NEYNAR_API_KEY) {
  console.warn('NEYNAR_API_KEY not found in environment variables');
}

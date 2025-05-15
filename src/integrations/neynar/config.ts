
// Configuration for Neynar API
export const NEYNAR_API_KEY = import.meta.env.VITE_NEYNAR_API_KEY || 'NEYNAR_DUMMY_API_KEY_REPLACE_ME';
export const NEYNAR_CLIENT_ID = import.meta.env.VITE_NEYNAR_CLIENT_ID || 'NEYNAR_DUMMY_CLIENT_ID_REPLACE_ME';

// If the API key is the dummy value, log a warning
if (NEYNAR_API_KEY === 'NEYNAR_DUMMY_API_KEY_REPLACE_ME') {
  console.warn('Please set a valid NEYNAR_API_KEY in your environment variables');
}

// If the client ID is the dummy value, log a warning
if (NEYNAR_CLIENT_ID === 'NEYNAR_DUMMY_CLIENT_ID_REPLACE_ME') {
  console.warn('Please set a valid NEYNAR_CLIENT_ID in your environment variables');
}


// Create a Neynar API client for Farcaster authentication
import { NeynarAPIClient } from '@neynar/nodejs-sdk';
import { NEYNAR_API_KEY } from './config';

// Create Neynar client
export const neynarClient = new NeynarAPIClient({ apiKey: NEYNAR_API_KEY });

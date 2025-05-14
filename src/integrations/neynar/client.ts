
// Create a Neynar API client for Farcaster authentication
import { createClient } from '@neynar/nodejs-sdk';
import { NEYNAR_API_KEY } from './config';

// Create Neynar client
export const neynarClient = createClient(NEYNAR_API_KEY);

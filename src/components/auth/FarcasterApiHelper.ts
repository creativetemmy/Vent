import { supabase } from '@/integrations/supabase/client';

const NEYNAR_API_URL = "https://api.neynar.com/v2/farcaster/user";
const NEYNAR_API_KEY = "2725A6F7-8E91-419F-80F0-8ED75BDB8223";

export interface FarcasterUserInput {
  type: "fid" | "username";
  value: string;
}

export interface FarcasterUser {
  fid: number;
  username: string;
  display_name?: string;
  pfp_url?: string;
  custody_address?: string;
}

/**
 * Normalize user input to determine if it's an FID or username
 */
export const normalizeInput = (input: string): FarcasterUserInput => {
  input = input.trim();
  // Remove @ if present
  if (input.startsWith("@")) input = input.slice(1);
  
  // If it's all digits, treat as FID
  if (/^\d+$/.test(input)) return { type: "fid", value: input };
  
  // Otherwise treat as username
  return { type: "username", value: input };
};

/**
 * Fetch Farcaster user data from cache or API
 */
export const fetchFarcasterUser = async (input: FarcasterUserInput): Promise<FarcasterUser> => {
  const { type, value } = input;
  
  // First, try to find in Supabase if it's a username
  if (type === "username") {
    const { data: cachedUser, error } = await supabase
      .from("farcaster_users")
      .select("*")
      .eq("username", value)
      .maybeSingle();

    if (cachedUser && !error) {
      console.log("Found user in cache:", cachedUser);
      return cachedUser as FarcasterUser;
    }
  }
  
  // If not found in cache, fetch from Neynar
  const param = type === "fid" ? `fid=${value}` : `username=${value}`;
  const endpoint = type === "fid" ? "lookup" : "by_username";
  
  console.log(`Fetching from Neynar API: ${endpoint} with ${param}`);
  
  try {
    const res = await fetch(
      `${NEYNAR_API_URL}/${endpoint}?${param}`,
      {
        headers: { 
          "accept": "application/json", 
          "api_key": NEYNAR_API_KEY 
        }
      }
    );
    
    if (!res.ok) {
      const errorText = await res.text();
      console.error("Neynar API error:", res.status, errorText);
      throw new Error(`Account not found (${res.status}): ${errorText}`);
    }
    
    const json = await res.json();
    const user = json.user || (json.result?.user);
    
    if (!user) {
      console.error("No user data in response:", json);
      throw new Error("No user found, check spelling or FID.");
    }
    
    console.log("User found from API:", user);
    return user as FarcasterUser;
  } catch (error) {
    console.error("Error fetching Farcaster user:", error);
    throw error;
  }
};

/**
 * Save or update user data in Supabase
 */
export const saveUserToSupabase = async (user: FarcasterUser) => {
  if (!user || !user.fid) {
    throw new Error("Invalid user data");
  }
  
  // Use the upsert_farcaster_user RPC function to safely insert or update
  const { error, data } = await supabase.rpc("upsert_farcaster_user", {
    p_fid: user.fid,
    p_username: user.username || "",
    p_display_name: user.display_name || "",
    p_avatar_url: user.pfp_url || "",
    p_did: user.custody_address || "",
    p_user_id: null
  });

  if (error) {
    console.error("Error upserting user:", error);
    throw new Error(`Failed to save user data: ${error.message}`);
  }

  return data;
};

/**
 * Store essential user data in local storage
 */
export const storeUserInLocalStorage = (fid: string, username: string) => {
  localStorage.setItem('fid', fid);
  localStorage.setItem('username', username);
};

/**
 * Remove all auth data from storage (logout helper)
 */
export const clearFarcasterAuth = () => {
  localStorage.removeItem('fid');
  localStorage.removeItem('username');
};


import { supabase } from '@/integrations/supabase/client';

const NEYNAR_API_URL = "https://api.neynar.com/v2/farcaster/user";
const NEYNAR_API_KEY = "2725A6F7-8E91-419F-80F0-8ED75BDB8223";

export interface FarcasterUserInput {
  type: "fid" | "username";
  value: string;
}

export const normalizeInput = (input: string): FarcasterUserInput => {
  input = input.trim();
  if (/^\d+$/.test(input)) return { type: "fid", value: input };
  if (input.startsWith("@")) input = input.slice(1);
  return { type: "username", value: input };
};

export const fetchFarcasterUser = async (input: FarcasterUserInput) => {
  const { type, value } = input;
  
  // First, try to find in Supabase if it's a username
  if (type === "username") {
    const { data: cachedUser } = await supabase
      .from("farcaster_users")
      .select("*")
      .eq("username", value)
      .maybeSingle();

    if (cachedUser) {
      return cachedUser;
    }
  }
  
  // If not found in cache, fetch from Neynar
  const param = type === "fid" ? `fid=${value}` : `username=${value}`;
  const endpoint = type === "fid" ? "lookup" : "by_username";
  
  const res = await fetch(
    `${NEYNAR_API_URL}/${endpoint}?${param}`,
    {
      headers: { 
        "accept": "application/json", 
        "api_key": NEYNAR_API_KEY 
      }
    }
  );
  
  if (!res.ok){ 
    throw new Error(`Account not found: ${res.status}`);
  }
  
  const json = await res.json();
  const user = json.user || (json.result?.user);
  
  if (!user) throw new Error("No user found, check spelling or FID.");

  return user;
};

export const saveUserToSupabase = async (user: any) => {
  // Use the upsert_farcaster_user RPC function to safely insert or update
  const { error, data } = await supabase.rpc("upsert_farcaster_user", {
    p_fid: user.fid,
    p_username: user.username,
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

export const storeUserInLocalStorage = (fid: string, username: string) => {
  localStorage.setItem('fid', fid);
  localStorage.setItem('username', username);
};

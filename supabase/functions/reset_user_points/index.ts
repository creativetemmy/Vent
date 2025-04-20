
/**
 * Supabase Edge Function: reset_user_points
 * POST: Resets all user points to 100 and (optionally) notifies users via Warpcas.
 * Make this function public (no JWT required) so you can call it with a scheduler.
 */
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  let log: string[] = [];
  try {
    // Set up Supabase client using environment variables
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY"); // should be set as secret
    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      log.push("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY env.");
      return new Response(JSON.stringify({ error: "Missing config." }), {
        status: 500,
        headers: corsHeaders,
      });
    }

    // Call Supabase to update all user points
    const { createClient } = await import("https://esm.sh/@supabase/supabase-js@2.49.4");
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    const { error } = await supabase
      .from("profiles")
      .update({ points: 100 });

    if (error) {
      log.push("Error updating points: " + error.message);
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: corsHeaders,
      });
    }
    log.push("Points reset for all users to 100.");

    // Warpcas notification (optional - provide API endpoint/account/fid, etc.)
    // Uncomment and adjust the below if you want to notify users
    /*
    const WARPCAS_API = Deno.env.get("WARPCAS_API");
    if (WARPCAS_API) {
      // Implement Warpcas notification logic here
      // Example:
      // await fetch(WARPCAS_API, { method: "POST", body: JSON.stringify({ ... }) });
      log.push("Notified Warpcas.");
    } else {
      log.push("No Warpcas API configured.");
    }
    */

    return new Response(JSON.stringify({ message: "Points reset successful.", log }), {
      status: 200,
      headers: corsHeaders,
    });
  } catch (err) {
    log.push("General error: " + (err?.message || String(err)));
    return new Response(JSON.stringify({ error: "Unknown error", log }), {
      status: 500,
      headers: corsHeaders,
    });
  }
});

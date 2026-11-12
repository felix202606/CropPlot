import { supabasePublishableKey, supabaseUrl } from "@/lib/supabase-public";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let client: SupabaseClient | undefined;

export function browserSupabase() {
  client ??= createClient(supabaseUrl, supabasePublishableKey, {
    auth: { flowType: "pkce", detectSessionInUrl: true },
  });
  return client;
}

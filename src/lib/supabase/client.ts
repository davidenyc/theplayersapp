import { createBrowserClient } from "@supabase/auth-helpers-nextjs";

import type { Database } from "@/types";

export const createClient = () =>
  createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL ?? "https://demo.supabase.co",
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "demo-anon-key",
  );

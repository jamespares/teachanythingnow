import { createClient } from "@supabase/supabase-js";

if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
  throw new Error("NEXT_PUBLIC_SUPABASE_URL is not set in environment variables");
}

if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error("SUPABASE_SERVICE_ROLE_KEY is not set in environment variables");
}

// Server-side client with service role key (bypasses RLS)
export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);

// Database types
export interface User {
  id: string;
  email: string;
  stripe_customer_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface Subscription {
  id: string;
  user_id: string;
  stripe_subscription_id: string;
  stripe_customer_id: string;
  status: "active" | "canceled" | "past_due" | "incomplete" | "trialing";
  current_period_end: number;
  created_at: string;
  updated_at: string;
}

export const STORAGE_BUCKET = "generations";

export async function uploadToStorage(
  buffer: Buffer,
  fileName: string,
  contentType: string
): Promise<{ path: string; error: any }> {
  try {
    const { data, error } = await supabaseAdmin.storage
      .from(STORAGE_BUCKET)
      .upload(fileName, buffer, {
        contentType,
        upsert: true,
      });

    if (error) {
      console.error(`Error uploading ${fileName} to storage:`, error);
      return { path: "", error };
    }

    return { path: data?.path || fileName, error: null };
  } catch (error) {
    console.error(`Unexpected error uploading ${fileName}:`, error);
    return { path: "", error };
  }
}

export async function downloadFromStorage(path: string): Promise<{ data: Blob | null; error: any }> {
  try {
    const { data, error } = await supabaseAdmin.storage
      .from(STORAGE_BUCKET)
      .download(path);

    if (error) {
      console.error(`Error downloading ${path} from storage:`, error);
      return { data: null, error };
    }

    return { data, error: null };
  } catch (error) {
    console.error(`Unexpected error downloading ${path}:`, error);
    return { data: null, error };
  }
}


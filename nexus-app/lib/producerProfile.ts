"use client";

import { browserSupabase } from "./supabaseBrowser";

export type MyProducer = {
  id: string;
  name: string;
  company: string | null;
  phone: string | null;
  email: string | null;
  whatsapp: string | null;
  avatarUrl: string | null;
  logoUrl: string | null;
};

export type MyProducerPatch = {
  name?: string;
  company?: string | null;
  phone?: string | null;
  email?: string | null;
  whatsapp?: string | null;
  avatar_url?: string | null;
  logo_url?: string | null;
};

/** The signed-in producer's own profile (created on first access). */
export async function getMyProducer(): Promise<MyProducer | null> {
  const sb = browserSupabase();
  if (!sb) return null;
  const { data: id } = await sb.rpc("ensure_my_producer");
  if (!id) return null;
  const { data } = await sb
    .from("producer_profiles")
    .select("id,name,company,phone,email,whatsapp,avatar_url,logo_url")
    .eq("id", id as string)
    .maybeSingle();
  if (!data) return null;
  return {
    id: data.id as string,
    name: (data.name as string) ?? "",
    company: (data.company as string) ?? null,
    phone: (data.phone as string) ?? null,
    email: (data.email as string) ?? null,
    whatsapp: (data.whatsapp as string) ?? null,
    avatarUrl: (data.avatar_url as string) ?? null,
    logoUrl: (data.logo_url as string) ?? null,
  };
}

/** Updates the producer's own profile (owner-only RLS). */
export async function updateMyProducer(patch: MyProducerPatch): Promise<boolean> {
  const sb = browserSupabase();
  if (!sb) return true;
  const { data: { user } } = await sb.auth.getUser();
  if (!user) return false;
  const { error } = await sb.from("producer_profiles").update(patch).eq("user_id", user.id);
  return !error;
}

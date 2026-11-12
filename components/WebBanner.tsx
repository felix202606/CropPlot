"use client";

import { browserSupabase } from "@/lib/supabase-browser";
import Link from "next/link";
import { useEffect, useState } from "react";

type Banner = {
  id: string;
  title: string;
  body: string;
  cta_label: string | null;
  starts_at: string | null;
  ends_at: string | null;
};

function onSchedule(row: Banner) {
  const now = Date.now();
  if (row.starts_at && Date.parse(row.starts_at) > now) return false;
  if (row.ends_at && Date.parse(row.ends_at) < now) return false;
  return true;
}

export function WebBanner() {
  const [banner, setBanner] = useState<Banner | null>(null);

  useEffect(() => {
    browserSupabase()
      .from("banners")
      .select("id,title,body,cta_label,starts_at,ends_at")
      .eq("audience", "web")
      .eq("active", true)
      .order("updated_at", { ascending: false })
      .then(({ data }) => {
        const row = (data ?? []).find(onSchedule);
        if (row) setBanner(row);
      });
  }, []);

  if (!banner) return null;

  return (
    <Link
      href={`/activity/?id=${banner.id}`}
      className="block bg-leaf-900 px-5 py-3 text-center text-sm text-white hover:bg-leaf-700"
    >
      <span className="font-semibold">{banner.title}</span>
      {banner.body ? <span className="ml-2 text-leaf-100">{banner.body}</span> : null}
      {banner.cta_label ? <span className="ml-2 underline">{banner.cta_label}</span> : null}
    </Link>
  );
}

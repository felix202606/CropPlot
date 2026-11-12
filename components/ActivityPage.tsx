"use client";

import { browserSupabase } from "@/lib/supabase-browser";
import Link from "next/link";
import { useEffect, useState } from "react";

type Banner = {
  title: string;
  body: string;
  cta_label: string | null;
  cta_url: string | null;
};

export function ActivityPage() {
  const [banner, setBanner] = useState<Banner | null>(null);
  const [missing, setMissing] = useState(false);

  useEffect(() => {
    const id = new URLSearchParams(window.location.search).get("id");
    if (!id) {
      setMissing(true);
      return;
    }
    browserSupabase()
      .from("banners")
      .select("title,body,cta_label,cta_url")
      .eq("id", id)
      .maybeSingle()
      .then(({ data }) => {
        if (!data) setMissing(true);
        else setBanner(data);
      });
  }, []);

  return (
    <section className="px-5 py-20">
      <div className="mx-auto max-w-2xl">
        {missing ? (
          <p className="text-soil-900/70">This activity is not available.</p>
        ) : banner ? (
          <>
            <h1 className="font-display text-5xl font-semibold text-leaf-900">{banner.title}</h1>
            <p className="mt-6 whitespace-pre-wrap text-lg text-soil-900/80">{banner.body}</p>
            {banner.cta_label && banner.cta_url ? (
              <Link
                href={banner.cta_url}
                className="mt-8 inline-block rounded-full bg-leaf-600 px-6 py-3 font-semibold text-white hover:bg-leaf-700"
              >
                {banner.cta_label}
              </Link>
            ) : null}
          </>
        ) : (
          <p className="text-soil-900/70">Loading…</p>
        )}
      </div>
    </section>
  );
}

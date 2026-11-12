"use client";

import { asDownloadCopy, defaultDownloadCopy, type DownloadCopy } from "@/lib/home-copy";
import { site } from "@/lib/site";
import { browserSupabase } from "@/lib/supabase-browser";
import { useEffect, useState } from "react";

export function DownloadBand() {
  const [copy, setCopy] = useState<DownloadCopy>(defaultDownloadCopy);

  useEffect(() => {
    browserSupabase()
      .from("site_copy")
      .select("data")
      .eq("slug", "download")
      .maybeSingle()
      .then(({ data }) => {
        if (data?.data) setCopy(asDownloadCopy(data.data));
      });
  }, []);

  return (
    <section id="download" className="scroll-mt-20 px-5 py-20">
      <div className="mx-auto max-w-5xl rounded-[2.5rem] bg-leaf-900 px-8 py-16 text-center text-white">
        <h2 className="font-display text-4xl font-semibold">{copy.title}</h2>
        <p className="mx-auto mt-4 max-w-xl text-leaf-100">{copy.body}</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <span className="rounded-2xl bg-white/10 px-5 py-3 text-sm ring-1 ring-white/20">
            App Store · Coming soon
          </span>
          <span className="rounded-2xl bg-white/10 px-5 py-3 text-sm ring-1 ring-white/20">
            ▶ Google Play · Coming soon
          </span>
        </div>
        <a
          href={`mailto:${site.email}?subject=CropPlot%20early%20access`}
          className="mt-8 inline-block rounded-full bg-sun-400 px-6 py-3 font-semibold text-soil-900 hover:bg-white"
        >
          {copy.cta}
        </a>
      </div>
    </section>
  );
}

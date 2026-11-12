"use client";

import { asHomeCopy, defaultHomeCopy, type HomeCopy } from "@/lib/home-copy";
import { browserSupabase } from "@/lib/supabase-browser";
import Link from "next/link";
import { useEffect, useState } from "react";

function lines(value: string) {
  return value.split("\n");
}

export function HomeHero() {
  const [copy, setCopy] = useState<HomeCopy>(defaultHomeCopy);

  useEffect(() => {
    browserSupabase()
      .from("site_copy")
      .select("data")
      .eq("slug", "home")
      .maybeSingle()
      .then(({ data }) => {
        if (data?.data) setCopy(asHomeCopy(data.data));
      });
  }, []);

  const headline = lines(copy.headline);

  return (
    <div>
      <span className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-xs font-semibold text-leaf-700 ring-1 ring-leaf-200">
        {copy.eyebrow}
      </span>
      <h1 className="mt-5 font-display text-5xl font-semibold leading-[1.05] tracking-tight text-leaf-900 md:text-6xl">
        {headline.map((line, index) => (
          <span key={index}>
            {index > 0 ? <br /> : null}
            {line}
          </span>
        ))}
      </h1>
      <p className="mt-6 max-w-lg text-lg text-soil-900/75">{copy.subhead}</p>
      <div className="mt-8 flex flex-wrap gap-3">
        <Link
          href={copy.primaryHref || "#download"}
          className="rounded-full bg-leaf-600 px-6 py-3 font-semibold text-white hover:bg-leaf-700"
        >
          {copy.primaryLabel}
        </Link>
        <Link
          href={copy.secondaryHref || "#features"}
          className="rounded-full bg-white px-6 py-3 font-semibold text-leaf-900 ring-1 ring-soil-100 hover:ring-leaf-200"
        >
          {copy.secondaryLabel}
        </Link>
      </div>
      <p className="mt-4 text-sm text-soil-900/60">{copy.footnote}</p>
    </div>
  );
}

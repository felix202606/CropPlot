import type { MetadataRoute } from "next";
import { plants } from "@/lib/plants";
import { site } from "@/lib/site";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ["", "/pricing/", "/companion-planting/", "/privacy/", "/terms/"];
  return [
    ...pages.map((p) => ({ url: `${site.url}${p || "/"}` })),
    ...plants.map((p) => ({ url: `${site.url}/companion-planting/${p.slug}/` })),
  ];
}

import type { Metadata } from "next";
import { Pricing } from "@/components/Pricing";

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "CropPlot is free for unlimited plants and beds. Pro adds AI pest diagnosis, frost alerts, yield tracking and companion grid recommendations for $35.99/year.",
  alternates: { canonical: "/pricing/" },
};

export default function PricingPage() {
  return (
    <section className="px-5 py-20">
      <h1 className="text-center font-display text-5xl font-semibold text-leaf-900">Pricing</h1>
      <p className="mx-auto mt-4 mb-14 max-w-xl text-center text-soil-900/70">
        Plan your whole garden for free. Go Pro for AI and weather intelligence.
      </p>
      <Pricing />
    </section>
  );
}

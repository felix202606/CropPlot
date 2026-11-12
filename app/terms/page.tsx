import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Terms of Service",
  alternates: { canonical: "/terms/" },
};

export default function TermsPage() {
  return (
    <LegalPage title="Terms of Service" updated="November 12, 2026">
      <p>By using {site.name} you agree to these terms.</p>
      <h2>Subscriptions</h2>
      <p>
        {site.name} Pro is billed yearly at $35.99 USD (or local equivalent) and renews
        automatically until cancelled. You can cancel at any time and keep Pro features until
        the end of the current billing period.
      </p>
      <h2>Advice disclaimer</h2>
      <p>
        Growing guides, AI diagnoses and weather alerts are provided for general information.
        They may be inaccurate and are not a substitute for professional or local
        agricultural advice. Always follow product labels when applying any treatment.
      </p>
      <h2>Your content</h2>
      <p>
        You own the garden data and photos you add. You grant us permission to store and
        process them solely to provide the service.
      </p>
      <h2>Contact</h2>
      <p>
        Questions? Email <a className="text-leaf-700 underline" href={`mailto:${site.email}`}>{site.email}</a>.
      </p>
    </LegalPage>
  );
}

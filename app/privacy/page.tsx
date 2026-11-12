import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy Policy",
  alternates: { canonical: "/privacy/" },
};

export default function PrivacyPage() {
  return (
    <LegalPage title="Privacy Policy" updated="November 12, 2026">
      <p>
        This policy explains what information {site.name} collects when you use our mobile
        apps and website, and how we use it.
      </p>
      <h2>Information we collect</h2>
      <ul>
        <li>Account information: your email address and sign-in details.</li>
        <li>Garden data: beds, plants, reminders, harvest logs and notes you create.</li>
        <li>Photos you submit for pest and disease diagnosis.</li>
        <li>Approximate location, if you enable weather alerts.</li>
        <li>Subscription status. Payments are processed by Stripe, Apple or Google; we never see your full card details.</li>
      </ul>
      <h2>How we use it</h2>
      <ul>
        <li>To provide and sync your garden across devices.</li>
        <li>To generate diagnoses, weather alerts and recommendations.</li>
        <li>To manage your subscription and provide support.</li>
      </ul>
      <p>We do not sell your personal information.</p>
      <h2>Service providers</h2>
      <p>
        We use Supabase (database and authentication), Cloudflare (hosting and file storage),
        Stripe (payments) and weather data providers to operate {site.name}.
      </p>
      <h2>Your choices</h2>
      <p>
        You can export or delete your account and data at any time from the app settings or
        by emailing <a className="text-leaf-700 underline" href={`mailto:${site.email}`}>{site.email}</a>.
      </p>
    </LegalPage>
  );
}

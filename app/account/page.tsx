import type { Metadata } from "next";
import { AccountForm } from "@/components/AccountForm";

export const metadata: Metadata = {
  title: "Account",
  description: "Create a CropPlot account with email, Google, or Apple.",
  robots: { index: false, follow: false },
  alternates: { canonical: "/account/" },
};

export default function AccountPage() {
  return (
    <section className="px-5 py-20">
      <h1 className="text-center font-display text-5xl font-semibold text-leaf-900">Account</h1>
      <p className="mx-auto mt-4 mb-10 max-w-xl text-center text-soil-900/70">
        Create an account with email, Google, or Apple. Use the same email in the app so Pro
        can unlock.
      </p>
      <AccountForm />
    </section>
  );
}

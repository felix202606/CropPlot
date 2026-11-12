import type { Metadata } from "next";
import { AdminApp } from "@/components/AdminApp";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

export default function AdminPage() {
  return (
    <section className="px-5 py-16">
      <h1 className="mb-8 text-center font-display text-5xl font-semibold text-leaf-900">Admin</h1>
      <AdminApp />
    </section>
  );
}

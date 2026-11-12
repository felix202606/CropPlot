import Link from "next/link";
import { Logo } from "@/components/Logo";
import { site } from "@/lib/site";

export function Footer() {
  return (
    <footer className="border-t border-soil-100 bg-white">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-12 md:grid-cols-4">
        <div className="md:col-span-2">
          <Logo />
          <p className="mt-3 max-w-sm text-sm text-soil-900/70">{site.tagline}</p>
        </div>
        <div>
          <h3 className="text-sm font-semibold">Product</h3>
          <ul className="mt-3 space-y-2 text-sm text-soil-900/70">
            <li><Link href="/#features" className="hover:text-leaf-700">Features</Link></li>
            <li><Link href="/pricing/" className="hover:text-leaf-700">Pricing</Link></li>
            <li><Link href="/companion-planting/" className="hover:text-leaf-700">Companion Planting Guide</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="text-sm font-semibold">Company</h3>
          <ul className="mt-3 space-y-2 text-sm text-soil-900/70">
            <li><a href={`mailto:${site.email}`} className="hover:text-leaf-700">Contact</a></li>
            <li><Link href="/privacy/" className="hover:text-leaf-700">Privacy Policy</Link></li>
            <li><Link href="/terms/" className="hover:text-leaf-700">Terms of Service</Link></li>
          </ul>
        </div>
      </div>
      <p className="border-t border-soil-100 py-6 text-center text-xs text-soil-900/50">
        © {new Date().getFullYear()} {site.name}. All rights reserved.
      </p>
    </footer>
  );
}

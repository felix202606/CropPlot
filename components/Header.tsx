import Link from "next/link";
import { Logo } from "@/components/Logo";

const nav = [
  { href: "/#features", label: "Features" },
  { href: "/pricing/", label: "Pricing" },
  { href: "/companion-planting/", label: "Companion Planting" },
];

export function Header() {
  return (
    <header className="sticky top-0 z-30 border-b border-soil-100 bg-soil-50/85 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
        <Logo />
        <nav className="hidden items-center gap-8 text-sm font-medium text-soil-900/80 md:flex">
          {nav.map((item) => (
            <Link key={item.href} href={item.href} className="hover:text-leaf-700">
              {item.label}
            </Link>
          ))}
        </nav>
        <Link
          href="/#download"
          className="rounded-full bg-leaf-600 px-4 py-2 text-sm font-semibold text-white hover:bg-leaf-700"
        >
          Get the app
        </Link>
      </div>
    </header>
  );
}

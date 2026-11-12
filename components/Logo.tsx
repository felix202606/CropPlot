import Link from "next/link";

export function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2" aria-label="CropPlot home">
      <svg viewBox="0 0 32 32" className="h-8 w-8" aria-hidden>
        <rect width="32" height="32" rx="8" className="fill-leaf-600" />
        <path d="M16 25V14" stroke="white" strokeWidth="2.2" strokeLinecap="round" />
        <path d="M16 15c0-4 3-7 8-7 0 4-3 7-8 7Z" fill="white" />
        <path d="M16 18c0-3.5-2.6-6-7-6 0 3.5 2.6 6 7 6Z" fill="white" opacity=".85" />
      </svg>
      <span className="font-display text-xl font-semibold tracking-tight text-leaf-900">
        CropPlot
      </span>
    </Link>
  );
}

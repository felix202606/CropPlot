import Link from "next/link";

export function Logo() {
  return (
    <Link href="/" className="inline-flex items-center" aria-label="CropPlot home">
      <img src="/logo.png" alt="" className="h-10 w-auto" />
    </Link>
  );
}

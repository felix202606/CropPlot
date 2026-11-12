import Link from "next/link";
import { plans } from "@/lib/site";

export function Pricing() {
  return (
    <div className="mx-auto grid max-w-4xl gap-6 md:grid-cols-2">
      {plans.map((plan) => (
        <div
          key={plan.id}
          className={`relative flex flex-col rounded-3xl border p-8 ${
            plan.highlighted
              ? "border-leaf-600 bg-leaf-900 text-white shadow-xl shadow-leaf-900/20"
              : "border-soil-100 bg-white"
          }`}
        >
          {plan.highlighted && (
            <span className="absolute -top-3 right-8 rounded-full bg-sun-400 px-3 py-1 text-xs font-bold text-soil-900">
              Most popular
            </span>
          )}
          <h3 className="font-display text-2xl font-semibold">{plan.name}</h3>
          <p className={`mt-1 text-sm ${plan.highlighted ? "text-leaf-100" : "text-soil-900/70"}`}>
            {plan.blurb}
          </p>
          <p className="mt-6 flex items-baseline gap-2">
            <span className="font-display text-5xl font-semibold">{plan.price}</span>
            <span className={plan.highlighted ? "text-leaf-100" : "text-soil-900/60"}>
              {plan.period}
            </span>
          </p>
          {plan.id === "pro" && (
            <p className="mt-1 text-sm text-leaf-200">That&apos;s about $3 a month.</p>
          )}
          <ul className="mt-8 flex-1 space-y-3 text-sm">
            {plan.features.map((f) => (
              <li key={f} className="flex gap-3">
                <span className={plan.highlighted ? "text-sun-400" : "text-leaf-600"}>✓</span>
                <span>{f}</span>
              </li>
            ))}
          </ul>
          <Link
            href="/#download"
            className={`mt-8 rounded-full px-5 py-3 text-center font-semibold ${
              plan.highlighted
                ? "bg-sun-400 text-soil-900 hover:bg-white"
                : "bg-leaf-600 text-white hover:bg-leaf-700"
            }`}
          >
            {plan.cta}
          </Link>
        </div>
      ))}
    </div>
  );
}

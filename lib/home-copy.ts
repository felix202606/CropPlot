export type HomeCopy = {
  eyebrow: string;
  headline: string;
  subhead: string;
  primaryLabel: string;
  primaryHref: string;
  secondaryLabel: string;
  secondaryHref: string;
  footnote: string;
};

export type DownloadCopy = {
  title: string;
  body: string;
  cta: string;
};

export const defaultHomeCopy: HomeCopy = {
  eyebrow: "🌱 Coming soon to iOS & Android",
  headline: "Grow more food.\nLose fewer plants.",
  subhead:
    "CropPlot is the smart garden planner for home growers. Map your beds, get watering and harvest reminders, diagnose sick plants with a photo, and get warned before frost hits.",
  primaryLabel: "Start free",
  primaryHref: "#download",
  secondaryLabel: "See features",
  secondaryHref: "#features",
  footnote: "Free forever for unlimited plants. Pro from $35.99/year.",
};

export const defaultDownloadCopy: DownloadCopy = {
  title: "Your best season starts here",
  body: "CropPlot is launching soon on the App Store and Google Play. Want early access?",
  cta: "Join the early access list",
};

export function asHomeCopy(value: unknown): HomeCopy {
  const data = (value ?? {}) as Partial<HomeCopy>;
  return { ...defaultHomeCopy, ...data };
}

export function asDownloadCopy(value: unknown): DownloadCopy {
  const data = (value ?? {}) as Partial<DownloadCopy>;
  return { ...defaultDownloadCopy, ...data };
}

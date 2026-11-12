export const site = {
  name: "CropPlot",
  url: "https://cropplot.com",
  email: "hello@cropplot.com",
  tagline: "Plan, grow and protect your vegetable garden.",
  description:
    "CropPlot is the smart garden planner for home growers: unlimited beds, watering and harvest reminders, companion planting, AI pest diagnosis and frost alerts.",
};

export type Plan = {
  id: "free" | "pro";
  name: string;
  price: string;
  period: string;
  blurb: string;
  features: string[];
  cta: string;
  highlighted?: boolean;
};

export const plans: Plan[] = [
  {
    id: "free",
    name: "Free",
    price: "$0",
    period: "forever",
    blurb: "Everything you need to plan and run a home garden.",
    features: [
      "Unlimited plants and garden beds",
      "Growing guides and plant encyclopedia",
      "Watering and harvest reminders",
    ],
    cta: "Get the app",
  },
  {
    id: "pro",
    name: "Pro",
    price: "$35.99",
    period: "per year",
    blurb: "AI and weather intelligence for growers who want more harvest.",
    features: [
      "Everything in Free",
      "AI pest & disease photo diagnosis with organic treatment plans",
      "Smart frost and heavy-rain alerts from live weather forecasts",
      "Yield & Money Saved tracker",
      "Companion planting grid recommendations",
    ],
    cta: "Start Pro",
    highlighted: true,
  },
];

export type Feature = {
  icon: string;
  title: string;
  body: string;
  pro?: boolean;
};

export const features: Feature[] = [
  {
    icon: "🪴",
    title: "Unlimited beds & plants",
    body: "Map every raised bed, container and row. Add as many plants as your garden can hold.",
  },
  {
    icon: "📚",
    title: "Growing guides",
    body: "Clear, practical guides for sowing, spacing, feeding and harvesting common vegetables.",
  },
  {
    icon: "💧",
    title: "Watering & harvest reminders",
    body: "Check-in reminders adapt to each crop so nothing dries out or goes past its best.",
  },
  {
    icon: "📸",
    title: "AI pest & disease diagnosis",
    body: "Snap a photo of a sick leaf. Get a likely diagnosis and an organic treatment plan in seconds.",
    pro: true,
  },
  {
    icon: "🌤️",
    title: "Frost & storm alerts",
    body: "CropPlot watches the forecast for your garden and warns you before frost or heavy rain hits.",
    pro: true,
  },
  {
    icon: "🥗",
    title: "Yield & Money Saved tracker",
    body: "Log every harvest and see exactly how much your garden saves you at grocery prices.",
    pro: true,
  },
  {
    icon: "🧩",
    title: "Companion grid engine",
    body: "Arrange your beds with smart suggestions for which crops thrive together and which to keep apart.",
    pro: true,
  },
];

export const faqs = [
  {
    q: "Is CropPlot really free?",
    a: "Yes. Unlimited plants and beds, growing guides and watering/harvest reminders are free forever. Pro adds AI diagnosis, weather alerts, yield tracking and the companion grid engine.",
  },
  {
    q: "Which devices are supported?",
    a: "CropPlot is coming to iPhone and Android. Your garden data is stored on your device and syncs to your account when you sign in.",
  },
  {
    q: "How accurate is the AI pest diagnosis?",
    a: "Diagnosis works best with a clear, close-up photo in daylight. Every result includes a confidence level and organic-first treatment options, and we recommend confirming serious problems with a local extension service.",
  },
  {
    q: "Can I cancel Pro anytime?",
    a: "Yes. Pro is billed yearly and you can cancel at any time; you keep Pro features until the end of your billing period.",
  },
];

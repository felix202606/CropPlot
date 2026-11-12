export type Relation = { slug: string; reason: string };

export type Plant = {
  slug: string;
  name: string;
  emoji: string;
  family: string;
  sun: string;
  water: string;
  spacing: string;
  daysToHarvest: string;
  intro: string;
  good: Relation[];
  avoid: Relation[];
};

export const plants: Plant[] = [
  {
    slug: "tomato",
    name: "Tomato",
    emoji: "🍅",
    family: "Nightshade (Solanaceae)",
    sun: "Full sun, 6–8+ hours",
    water: "Deep, consistent watering 1–2× per week",
    spacing: "45–60 cm (18–24 in)",
    daysToHarvest: "60–85 days from transplant",
    intro:
      "Tomatoes are the most popular home-grown crop. The right neighbours help deter pests and make better use of bed space, while the wrong ones share diseases.",
    good: [
      { slug: "basil", reason: "Its strong scent helps confuse thrips and whiteflies, and both enjoy the same warm, sunny spot." },
      { slug: "carrot", reason: "Roots grow below tomato canopies without competing, making use of otherwise empty soil." },
      { slug: "onion", reason: "The pungent smell helps mask tomatoes from aphids and other sap-sucking pests." },
      { slug: "garlic", reason: "Helps deter aphids and spider mites around the base of plants." },
      { slug: "marigold", reason: "French marigolds attract hoverflies and may help suppress root-knot nematodes." },
      { slug: "lettuce", reason: "A quick crop that fits in the shade between young tomato plants." },
    ],
    avoid: [
      { slug: "potato", reason: "Same family; they share early and late blight and attract the same beetles." },
      { slug: "corn", reason: "Corn earworm and tomato fruitworm are the same pest, so planting together concentrates it." },
      { slug: "cabbage", reason: "Brassicas and tomatoes compete heavily for nutrients and tend to stunt each other." },
    ],
  },
  {
    slug: "basil",
    name: "Basil",
    emoji: "🌿",
    family: "Mint (Lamiaceae)",
    sun: "Full sun, 6–8 hours",
    water: "Keep soil evenly moist; avoid wetting leaves",
    spacing: "20–30 cm (8–12 in)",
    daysToHarvest: "50–75 days from seed",
    intro:
      "Basil is a compact, aromatic herb that earns its place in almost any vegetable bed. Pinch out flowers to keep it bushy.",
    good: [
      { slug: "tomato", reason: "The classic pair: shares sun and water needs, and its aroma helps repel flying pests." },
      { slug: "pepper", reason: "Fills gaps between pepper plants and helps deter aphids and thrips." },
      { slug: "lettuce", reason: "Low-growing lettuce and upright basil share space without competing." },
    ],
    avoid: [
      { slug: "cabbage", reason: "Brassicas prefer cooler, damper conditions than basil and outgrow it quickly." },
    ],
  },
  {
    slug: "carrot",
    name: "Carrot",
    emoji: "🥕",
    family: "Carrot (Apiaceae)",
    sun: "Full sun to light shade",
    water: "Light, frequent watering until established, then deep weekly",
    spacing: "5–8 cm (2–3 in)",
    daysToHarvest: "60–80 days from seed",
    intro:
      "Carrots need loose, stone-free soil and patience. Their biggest enemy is carrot rust fly, which strong-smelling neighbours help confuse.",
    good: [
      { slug: "onion", reason: "Onion scent masks carrots from carrot rust fly, while carrots mask onions from onion fly." },
      { slug: "lettuce", reason: "Shallow lettuce roots and deep carrot roots use different soil layers." },
      { slug: "pea", reason: "Peas fix nitrogen and are harvested before carrots need the space." },
      { slug: "tomato", reason: "Carrots tolerate light tomato shade and loosen the soil around them." },
      { slug: "garlic", reason: "Its strong smell helps deter carrot rust fly." },
    ],
    avoid: [
      { slug: "potato", reason: "Both are root crops competing for the same soil space and nutrients." },
    ],
  },
  {
    slug: "lettuce",
    name: "Lettuce",
    emoji: "🥬",
    family: "Daisy (Asteraceae)",
    sun: "Full sun in spring/autumn, part shade in summer",
    water: "Shallow, frequent watering; never let it dry out",
    spacing: "20–30 cm (8–12 in)",
    daysToHarvest: "30–60 days from seed",
    intro:
      "Lettuce grows fast and stays small, which makes it the perfect filler crop between slower vegetables.",
    good: [
      { slug: "carrot", reason: "Different root depths mean no competition." },
      { slug: "strawberry", reason: "Low-growing pair that shares beds and edges well." },
      { slug: "onion", reason: "Onion scent helps keep aphids and slugs away from tender leaves." },
      { slug: "cucumber", reason: "Climbing cucumbers give lettuce welcome summer shade." },
      { slug: "pea", reason: "Pea trellises provide shade and peas add nitrogen to the soil." },
    ],
    avoid: [
      { slug: "cabbage", reason: "Large brassicas shade out and outcompete lettuce for nutrients." },
    ],
  },
  {
    slug: "cucumber",
    name: "Cucumber",
    emoji: "🥒",
    family: "Gourd (Cucurbitaceae)",
    sun: "Full sun, 6–8+ hours",
    water: "Deep, regular watering; consistency prevents bitter fruit",
    spacing: "30–45 cm (12–18 in) on a trellis",
    daysToHarvest: "50–70 days from seed",
    intro:
      "Cucumbers are heavy feeders and thirsty climbers. Grow them vertically to save space and keep fruit clean.",
    good: [
      { slug: "bean", reason: "Beans fix nitrogen that hungry cucumbers use." },
      { slug: "pea", reason: "Adds nitrogen early in the season and can share a trellis." },
      { slug: "corn", reason: "Corn stalks act as a natural support and windbreak." },
      { slug: "marigold", reason: "Helps deter cucumber beetles and attracts pollinators." },
      { slug: "lettuce", reason: "Thrives in the shade under a cucumber trellis." },
    ],
    avoid: [
      { slug: "potato", reason: "Potatoes compete for water and can increase blight risk for cucumbers." },
    ],
  },
  {
    slug: "bean",
    name: "Bean",
    emoji: "🫘",
    family: "Legume (Fabaceae)",
    sun: "Full sun",
    water: "Moderate; water at the base once flowering starts",
    spacing: "10–15 cm (4–6 in) for bush beans",
    daysToHarvest: "50–65 days from seed",
    intro:
      "Beans fix nitrogen from the air into the soil, making them generous neighbours for hungry crops.",
    good: [
      { slug: "corn", reason: "Part of the Three Sisters: corn supports climbing beans, beans feed the corn." },
      { slug: "zucchini", reason: "The third Three Sisters crop; squash leaves shade the soil and block weeds." },
      { slug: "cucumber", reason: "Benefits from the nitrogen beans leave in the soil." },
      { slug: "potato", reason: "Beans may help deter Colorado potato beetle." },
      { slug: "carrot", reason: "Carrots loosen the soil and do not compete with bean roots." },
      { slug: "strawberry", reason: "Bush beans add nitrogen for strawberry plants." },
    ],
    avoid: [
      { slug: "onion", reason: "Alliums can inhibit the nitrogen-fixing bacteria on bean roots." },
      { slug: "garlic", reason: "Like onions, garlic can stunt bean growth." },
    ],
  },
  {
    slug: "pepper",
    name: "Pepper",
    emoji: "🫑",
    family: "Nightshade (Solanaceae)",
    sun: "Full sun, warm sheltered position",
    water: "Even moisture; avoid waterlogging",
    spacing: "40–50 cm (16–20 in)",
    daysToHarvest: "60–90 days from transplant",
    intro:
      "Peppers love heat and steady moisture. Good companions help shade the soil and keep aphids in check.",
    good: [
      { slug: "basil", reason: "Helps repel aphids and thrips and shares the same warm conditions." },
      { slug: "onion", reason: "Deters aphids and fits easily between pepper plants." },
      { slug: "carrot", reason: "Fills space at ground level without competing." },
      { slug: "spinach", reason: "Acts as a living mulch to keep the soil cool and moist." },
    ],
    avoid: [
      { slug: "potato", reason: "Same family; shares blight and pests." },
      { slug: "bean", reason: "Vigorous climbing beans can smother and shade out peppers." },
    ],
  },
  {
    slug: "zucchini",
    name: "Zucchini",
    emoji: "🥒",
    family: "Gourd (Cucurbitaceae)",
    sun: "Full sun",
    water: "Deep watering at the base, 2–3 cm per week",
    spacing: "60–90 cm (24–36 in)",
    daysToHarvest: "45–60 days from seed",
    intro:
      "One or two zucchini plants can feed a family all summer. They need room, rich soil and plenty of pollinators.",
    good: [
      { slug: "corn", reason: "Three Sisters partner; corn offers wind protection." },
      { slug: "bean", reason: "Supplies nitrogen for these heavy feeders." },
      { slug: "marigold", reason: "Attracts pollinators and helps deter squash bugs and beetles." },
      { slug: "pea", reason: "Adds nitrogen early before zucchini spreads." },
    ],
    avoid: [
      { slug: "potato", reason: "Both are heavy feeders and compete for nutrients and water." },
    ],
  },
  {
    slug: "onion",
    name: "Onion",
    emoji: "🧅",
    family: "Allium (Amaryllidaceae)",
    sun: "Full sun",
    water: "Regular watering until bulbs swell, then reduce",
    spacing: "10–15 cm (4–6 in)",
    daysToHarvest: "90–120 days from sets",
    intro:
      "Onions are compact and pungent, making them one of the best pest-confusing companions in the vegetable garden.",
    good: [
      { slug: "carrot", reason: "Mutual protection against carrot fly and onion fly." },
      { slug: "tomato", reason: "Helps deter aphids around tomato plants." },
      { slug: "lettuce", reason: "Keeps slugs and aphids away from leafy greens." },
      { slug: "cabbage", reason: "Strong scent helps confuse cabbage moths and loopers." },
      { slug: "strawberry", reason: "Helps deter pests without shading low-growing strawberries." },
    ],
    avoid: [
      { slug: "bean", reason: "Inhibits beneficial nitrogen-fixing bacteria on legume roots." },
      { slug: "pea", reason: "Like beans, peas grow poorly next to alliums." },
    ],
  },
  {
    slug: "garlic",
    name: "Garlic",
    emoji: "🧄",
    family: "Allium (Amaryllidaceae)",
    sun: "Full sun",
    water: "Moderate; stop watering 2–3 weeks before harvest",
    spacing: "10–15 cm (4–6 in)",
    daysToHarvest: "8–9 months from autumn planting",
    intro:
      "Garlic is planted in autumn and harvested the next summer. Its sulfur compounds make it a natural pest deterrent.",
    good: [
      { slug: "tomato", reason: "Helps repel aphids and spider mites." },
      { slug: "pepper", reason: "Deters aphids around peppers." },
      { slug: "carrot", reason: "Helps mask carrots from carrot rust fly." },
      { slug: "cabbage", reason: "Deters cabbage worms and aphids." },
      { slug: "strawberry", reason: "Can help protect strawberries from pests." },
    ],
    avoid: [
      { slug: "bean", reason: "Stunts bean growth by interfering with nitrogen fixation." },
      { slug: "pea", reason: "Same effect on peas as on beans." },
    ],
  },
  {
    slug: "strawberry",
    name: "Strawberry",
    emoji: "🍓",
    family: "Rose (Rosaceae)",
    sun: "Full sun",
    water: "1–2 cm per week, more while fruiting",
    spacing: "30–45 cm (12–18 in)",
    daysToHarvest: "Fruits in late spring–summer of the second year",
    intro:
      "Strawberries are perennial and low-growing. Companions that stay small and deter pests work best.",
    good: [
      { slug: "lettuce", reason: "Shares space at ground level and can help hide berries from birds." },
      { slug: "spinach", reason: "Low-growing green that fits between strawberry rows." },
      { slug: "onion", reason: "Helps deter pests without heavy shading." },
      { slug: "garlic", reason: "Strong scent helps deter pests." },
      { slug: "bean", reason: "Adds nitrogen to the soil." },
    ],
    avoid: [
      { slug: "cabbage", reason: "Brassicas can stunt strawberry growth." },
      { slug: "tomato", reason: "Shares verticillium wilt, a soil-borne disease." },
      { slug: "potato", reason: "Also carries verticillium wilt." },
    ],
  },
  {
    slug: "spinach",
    name: "Spinach",
    emoji: "🥬",
    family: "Amaranth (Amaranthaceae)",
    sun: "Full sun to part shade",
    water: "Keep soil consistently moist",
    spacing: "8–15 cm (3–6 in)",
    daysToHarvest: "35–50 days from seed",
    intro:
      "Spinach is a cool-season green that bolts in heat. Tuck it into the shade of taller summer crops.",
    good: [
      { slug: "strawberry", reason: "Both are low and enjoy similar conditions." },
      { slug: "pea", reason: "Peas add nitrogen and give light shade." },
      { slug: "bean", reason: "Nitrogen boost and summer shade from taller beans." },
      { slug: "cabbage", reason: "Grows quickly between young brassicas before they spread." },
    ],
    avoid: [
      { slug: "potato", reason: "Potatoes compete for nutrients and disturb spinach roots at harvest." },
    ],
  },
  {
    slug: "corn",
    name: "Corn",
    emoji: "🌽",
    family: "Grass (Poaceae)",
    sun: "Full sun",
    water: "Deep watering, especially during tasseling",
    spacing: "20–30 cm (8–12 in) in blocks",
    daysToHarvest: "60–100 days from seed",
    intro:
      "Plant sweet corn in blocks rather than single rows for good wind pollination. It's the backbone of the Three Sisters method.",
    good: [
      { slug: "bean", reason: "Beans climb the stalks and feed the corn with nitrogen." },
      { slug: "zucchini", reason: "Squash leaves shade the soil, keeping moisture in and weeds out." },
      { slug: "cucumber", reason: "Can use corn stalks for support." },
      { slug: "pea", reason: "Adds nitrogen to the soil." },
    ],
    avoid: [
      { slug: "tomato", reason: "Corn earworm and tomato fruitworm are the same pest." },
    ],
  },
  {
    slug: "potato",
    name: "Potato",
    emoji: "🥔",
    family: "Nightshade (Solanaceae)",
    sun: "Full sun",
    water: "Even moisture, especially as tubers form",
    spacing: "30 cm (12 in), rows 60–75 cm apart",
    daysToHarvest: "70–120 days from planting",
    intro:
      "Potatoes are prone to blight and beetles, so where you plant them matters as much as how.",
    good: [
      { slug: "bean", reason: "May help deter Colorado potato beetle and adds nitrogen." },
      { slug: "corn", reason: "Uses different space and nutrients." },
      { slug: "cabbage", reason: "Different root depth and pests." },
      { slug: "marigold", reason: "Helps deter beetles and nematodes." },
    ],
    avoid: [
      { slug: "tomato", reason: "Same family; blight spreads easily between them." },
      { slug: "cucumber", reason: "Increases blight risk for potatoes." },
      { slug: "zucchini", reason: "Heavy feeders compete for nutrients." },
      { slug: "pepper", reason: "Same family; shared pests and disease." },
    ],
  },
  {
    slug: "cabbage",
    name: "Cabbage",
    emoji: "🥬",
    family: "Brassica (Brassicaceae)",
    sun: "Full sun",
    water: "Consistent watering to prevent split heads",
    spacing: "45–60 cm (18–24 in)",
    daysToHarvest: "70–120 days from transplant",
    intro:
      "Cabbage and other brassicas are magnets for caterpillars. Aromatic neighbours help confuse cabbage moths.",
    good: [
      { slug: "onion", reason: "Helps confuse cabbage moths and loopers." },
      { slug: "garlic", reason: "Deters aphids and cabbage worms." },
      { slug: "potato", reason: "Different root depths and pests." },
      { slug: "marigold", reason: "Attracts beneficial insects that prey on caterpillars." },
      { slug: "spinach", reason: "Quick crop between young cabbage plants." },
    ],
    avoid: [
      { slug: "strawberry", reason: "Brassicas stunt strawberries." },
      { slug: "tomato", reason: "Heavy competition for nutrients." },
    ],
  },
  {
    slug: "pea",
    name: "Pea",
    emoji: "🫛",
    family: "Legume (Fabaceae)",
    sun: "Full sun to light shade",
    water: "Moderate; more once pods form",
    spacing: "5–8 cm (2–3 in) along a trellis",
    daysToHarvest: "55–70 days from seed",
    intro:
      "Peas are an early cool-season crop that leaves nitrogen behind for whatever you plant next.",
    good: [
      { slug: "carrot", reason: "Different root depths; peas feed the soil." },
      { slug: "corn", reason: "Nitrogen boost for corn." },
      { slug: "cucumber", reason: "Can share a trellis and enrich the soil." },
      { slug: "spinach", reason: "Both love cool spring weather." },
      { slug: "lettuce", reason: "Pea trellises shade lettuce as days warm up." },
    ],
    avoid: [
      { slug: "onion", reason: "Alliums inhibit pea growth." },
      { slug: "garlic", reason: "Alliums inhibit pea growth." },
    ],
  },
  {
    slug: "marigold",
    name: "Marigold",
    emoji: "🌼",
    family: "Daisy (Asteraceae)",
    sun: "Full sun",
    water: "Low to moderate; drought tolerant once established",
    spacing: "20–30 cm (8–12 in)",
    daysToHarvest: "Flowers 45–60 days from seed",
    intro:
      "French marigolds are the hardest-working flower in the vegetable garden: they attract pollinators and predators and brighten every bed.",
    good: [
      { slug: "tomato", reason: "Attracts hoverflies and may suppress root-knot nematodes." },
      { slug: "cucumber", reason: "Helps deter cucumber beetles." },
      { slug: "zucchini", reason: "Brings in pollinators for better fruit set." },
      { slug: "potato", reason: "Helps deter beetles and nematodes." },
      { slug: "cabbage", reason: "Attracts insects that prey on caterpillars." },
    ],
    avoid: [],
  },
];

export const plantBySlug = new Map(plants.map((p) => [p.slug, p]));

export function getPlant(slug: string) {
  return plantBySlug.get(slug);
}

import { readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { ALL_PAGES } from "./site-config.mjs";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const PUBLIC_PAGES = Object.freeze(ALL_PAGES.map(({ file }) => file));

const FORBIDDEN_PUBLIC_PATTERNS = Object.freeze([
  {
    label: "developer or portfolio terminology",
    pattern:
      /\b(?:demo|mockup|fake|prototype|prototyp)\b|sample project|test website|portfolio simulation/iu,
  },
  {
    label: "unsupported testimonial markup",
    pattern: /testimonials?|card--testimonial|#testimonials/iu,
  },
  {
    label: "unsupported rating markup",
    pattern: /class="rating"|aria-label="5 na 5"|★★★★★/u,
  },
  {
    label: "unsupported email address",
    pattern: /lauren@cleanenglish\.pl|mailto:/iu,
  },
  {
    label: "unsupported phone or WhatsApp",
    pattern: /\+48\s*600\s*000\s*123|wa\.me|whatsapp/iu,
  },
  {
    label: "unsupported opening hours",
    pattern: /openingHours|pn[–-]pt\s*9:00[–-]18:00|<strong>Godziny:/iu,
  },
  {
    label: "unsupported response or availability promise",
    pattern: /24h|24 godzin|wolne sloty|wt\/śr po 17:00/iu,
  },
  {
    label: "generic social profile",
    pattern:
      /href="https:\/\/(?:www\.)?(?:linkedin|instagram|youtube)\.com\/?"/iu,
  },
  {
    label: "placeholder legal destination",
    pattern: /href="\/offline\.html"[^>]*>(?:Polityka prywatności|Regulamin)/iu,
  },
  {
    label: "unsupported legal link",
    pattern: />\s*(?:Polityka prywatności|Regulamin)\s*</iu,
  },
  {
    label: "unsupported credentials",
    pattern: /Certyfikat TESOL|Trener egzaminacyjny/iu,
  },
  { label: "unsupported popularity claim", pattern: /Najczęściej wybier/iu },
  { label: "developer catalogue terminology", pattern: /sklepik|gating/iu },
  {
    label: "active personal-data form",
    pattern: /data-netlify|data-contact-form|name="contact"|type="email"/iu,
  },
  {
    label: "unsupported structured-data field",
    pattern:
      /"(?:address|telephone|email|openingHours|priceRange|sameAs|aggregateRating|review|offers|founder|employee)"\s*:/iu,
  },
  {
    label: "unsupported contact action",
    pattern:
      /Umów lekcję|Umów konsultację|Wyślij zgłoszenie|Zapytaj o wolne terminy|Zapytaj o (?:Start|Regular|Intensive)/iu,
  },
]);

const assert = (condition, message) => {
  if (!condition) throw new Error(message);
};

const pages = new Map();
for (const file of PUBLIC_PAGES) {
  const html = await readFile(resolve(ROOT, file), "utf8");
  pages.set(file, html);

  for (const { label, pattern } of FORBIDDEN_PUBLIC_PATTERNS) {
    assert(!pattern.test(html), `${file}: ${label}`);
  }
}

const home = pages.get("index.html");
const contactSection = home.match(
  /<section\b[^>]*\bid="contact"[\s\S]*?<\/section>/u,
)?.[0];
assert(contactSection, "index.html: missing contact section");
assert(
  contactSection.includes("data-contact-status"),
  "index.html: contact section must expose an honest informational state",
);
assert(
  !contactSection.includes("<form"),
  "index.html: contact section must not submit personal data",
);

console.log(
  `Verified public-content integrity for ${PUBLIC_PAGES.length} pages: no unsupported claims, contact data collection, structured-data fields, social profiles, or legal placeholders.`,
);

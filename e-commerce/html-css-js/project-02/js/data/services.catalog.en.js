export const SERVICES_PAGE = {
  seo: {
    title: "Services - KP_Code Digital Vault",
    description:
      "Explore KP_Code services: modern websites, WordPress, branding, and technical support.",
  },
  hero: {
    title: "Services",
    lead:
      "We build fast, modern websites and digital products with quality, accessibility, and performance in mind. Every project starts with a clear business goal.",
  },
  collaborationSteps: [
    {
      title: "Brief",
      description:
        "We collect requirements, goals, and references. We align scope, budget, and timeline.",
    },
    {
      title: "Prototype",
      description:
        "We design the structure and flow. We lock the content architecture and key views.",
    },
    {
      title: "Implementation",
      description:
        "We build, test, and optimize. You get stable, fast UI.",
    },
    {
      title: "Maintenance",
      description:
        "We evolve the product, ship changes, and keep it secure.",
    },
  ],
  pricing: [
    {
      name: "Starter",
      price: "from 1900 PLN",
      timeline: "1-2 weeks",
      description: "A quick start for a small business or MVP.",
      features: [
        "1-3 pages",
        "Modern layout",
        "Basic SEO",
        "Implementation and setup",
      ],
    },
    {
      name: "Standard",
      price: "from 4900 PLN",
      timeline: "2-4 weeks",
      description: "A larger website with multiple sections.",
      features: [
        "More sections",
        "Reusable components",
        "A11y optimization",
        "Short handover training",
      ],
    },
    {
      name: "Pro",
      price: "from 8900 PLN",
      timeline: "4-8 weeks",
      description: "A project for a brand or product with growing needs.",
      features: [
        "Complex UI",
        "Performance analysis",
        "Report and recommendations",
        "Post-launch support",
      ],
    },
  ],
  quote: {
    title: "Quick quote",
    lead:
      "Share a few details and we will come back with a scope and timeline proposal. This is a demo form, but it helps us understand your needs.",
    submitLabel: "Request a quote",
  },
  faq: [
    {
      question: "How long does a quote take?",
      answer:
        "Usually 24-48h. For more complex projects we schedule a short call.",
    },
    {
      question: "Can we start with a smaller scope?",
      answer:
        "Yes. We often start with an MVP and expand in the next sprints.",
    },
    {
      question: "Do you help with content?",
      answer:
        "Yes, we help with content structure and suggest sections to fill in.",
    },
    {
      question: "How do payments work?",
      answer:
        "Standard is 50/50 or milestone payments for larger projects.",
    },
    {
      question: "Do you offer post-launch maintenance?",
      answer: "Yes, we offer support packages and monthly maintenance.",
    },
    {
      question: "Are projects a11y compliant?",
      answer:
        "We care about semantics, contrast, and keyboard navigation. A full a11y audit can be added.",
    },
  ],
  cta: {
    title: "Have a project in mind?",
    description: "Share your goals and we will suggest the best delivery path.",
    primaryLabel: "Contact",
    primaryHref: "#/contact",
  },
};

export const SERVICES = [
  {
    slug: "web-development",
    name: "Web Development",
    shortDescription:
      "Modern websites and front-end interfaces with a focus on speed, a11y, and SEO.",
    seo: {
      title: "Web Development - Services | KP_Code Digital Vault",
      description:
        "We build fast websites and front-end interfaces. HTML, CSS, JS with a focus on performance, a11y, and SEO.",
    },
    heroLead:
      "We build polished HTML/CSS/JS interfaces. We focus on stable code, performance, and a smooth dev experience. Tailwind and React are a natural next step.",
    summaryBullets: [
      "Company websites, landing pages, microsites",
      "Interactive components and UI dashboards",
      "CLS/LCP optimization and SEO best practices",
    ],
    deliverables: [
      "Code files and implementation guidance",
      "A11y and performance checklists",
      "Component structure for further development",
    ],
    forWho: [
      "Startups and product teams",
      "Service companies that need a modern website",
      "Brands that need a fast MVP",
      "Marketing teams running landing page campaigns",
      "Teams modernizing legacy front ends",
    ],
    sections: {
      forWho: {
        title: "Who it is for",
        lead: "A good fit when you need fast, stable front-end delivery.",
      },
      scope: {
        title: "Scope",
        lead: "From landing pages to complex product interfaces.",
      },
      process: {
        title: "Process",
        lead: "Short sprints, clear communication, and quality control.",
      },
      pricing: {
        title: "Packages and pricing",
        lead: "We start small and scale the team for larger projects.",
      },
      gallery: {
        title: "Selected projects",
        lead: "Examples of layouts and interfaces (demo in progress).",
      },
      quote: {
        title: "Quick quote",
        lead: "Tell us about the project and we will propose the best option.",
      },
      faq: {
        title: "FAQ",
        lead: "Most common questions about web development.",
      },
    },
    scope: [
      {
        title: "Landing pages and company sites",
        description: "Fast marketing pages that support sales and lead gen.",
      },
      {
        title: "Interactive components",
        description: "Sections, calculators, animations, and UI dashboards (front-only).",
      },
      {
        title: "Performance optimization",
        description: "CLS/LCP improvements, a11y, and technical SEO basics.",
      },
      {
        title: "PWA basics",
        description: "Manifest, icons, and offline fallback for simple web apps.",
      },
      {
        title: "Technology roadmap",
        description: "Currently HTML/CSS/JS, with Tailwind and React as extensions.",
      },
    ],
    process: [
      {
        title: "Brief",
        description: "We align on business goals, content, and key views.",
      },
      {
        title: "Prototype",
        description: "We design structure and wireframes for key sections.",
      },
      {
        title: "Implementation",
        description: "Build, test, and optimize for SEO and a11y.",
      },
      {
        title: "Maintenance",
        description: "Further development, fixes, and post-launch support.",
      },
    ],
    pricing: [
      {
        name: "Starter",
        price: "from 2400 PLN",
        timeline: "1-2 weeks",
        features: [
          "1-3 pages",
          "Responsive layout",
          "Basic SEO",
          "Implementation support",
        ],
      },
      {
        name: "Standard",
        price: "from 5200 PLN",
        timeline: "2-4 weeks",
        features: [
          "Multi-section website",
          "UI components",
          "A11y optimization",
          "Basic performance audit",
        ],
      },
      {
        name: "Pro",
        price: "from 9800 PLN",
        timeline: "4-6 weeks",
        features: [
          "Complex UI and interactions",
          "Performance and a11y audit",
          "Reusable components",
          "Post-launch support",
        ],
      },
    ],
    galleryActions: [
      { label: "Demo (Netlify)", disabled: true },
      { label: "Details", type: "case-study" },
    ],
    galleryPlaceholders: [
      {
        title: "SaaS landing",
        tags: ["SaaS", "Marketing"],
        description: "A lightweight landing with animations and conversion sections.",
        caseStudySlug: "landing-saas",
      },
      {
        title: "Analytics dashboard",
        tags: ["UI", "Analytics"],
        description: "Interactive panel with cards and charts.",
        caseStudySlug: "analytics-dashboard",
      },
      {
        title: "Company website",
        tags: ["B2B", "Brand"],
        description: "Sections: offer, case studies, CTA, and FAQ.",
        caseStudySlug: "company-website",
      },
      {
        title: "Event microsite",
        tags: ["Event", "Promo"],
        description: "Event promo site with sign-up form.",
        caseStudySlug: "event-microsite",
      },
      {
        title: "Interactive configurator",
        tags: ["UI", "Logic"],
        description: "Calculator and offer summary generation.",
        caseStudySlug: "interactive-configurator",
      },
      {
        title: "Mini PWA app",
        tags: ["PWA", "Offline"],
        description: "Simple app with offline mode and icons.",
        caseStudySlug: "mini-pwa-app",
      },
    ],
    faq: [
      {
        question: "Can I provide a finished design?",
        answer: "Yes, we implement provided mockups or design from scratch.",
      },
      {
        question: "Will the site be fast on mobile?",
        answer: "Yes, we optimize layouts and performance for mobile.",
      },
      {
        question: "Can I continue development after launch?",
        answer: "Yes, we offer care and ongoing development packages.",
      },
      {
        question: "Do you work with CMS?",
        answer:
          "We specialize in front-end, but we can collaborate with backend or CMS teams.",
      },
      {
        question: "How is code handover handled?",
        answer: "Code is delivered via repo or package with instructions.",
      },
      {
        question: "Can we plan future expansion?",
        answer: "Yes, we prepare a roadmap and propose next sprints.",
      },
    ],
    cta: {
      title: "Need a fast website?",
      description: "Share the scope and we will prepare a proposal.",
      primaryLabel: "Contact me",
      primaryHref: "#/contact",
      secondaryLabel: "View products",
      secondaryHref: "#/products",
    },
  },
  {
    slug: "wordpress",
    name: "WordPress Solutions",
    shortDescription:
      "Company websites and blogs on WordPress with optimization, security, and training.",
    seo: {
      title: "WordPress Solutions - Services | KP_Code Digital Vault",
      description:
        "WordPress delivery: setup, configuration, optimization, and editor training. Secure and fast websites.",
    },
    heroLead:
      "We build and optimize WordPress sites. We pick themes/builders, structure content, and train your team.",
    summaryBullets: [
      "WordPress setup and configuration",
      "Company websites, landing pages, blogs",
      "SEO basics, performance, and security",
    ],
    deliverables: [
      "Production-ready WordPress install",
      "Content structure and menus",
      "Instruction pack and a short training session",
    ],
    forWho: [
      "Small and mid-size businesses",
      "Brands building an expert blog",
      "Teams that want to edit content without code",
      "Organizations that need fast delivery",
    ],
    sections: {
      forWho: {
        title: "Who it is for",
        lead: "WordPress works great when you want to edit content without code.",
      },
      scope: {
        title: "Scope",
        lead: "Full delivery from setup to optimization and training.",
      },
      process: {
        title: "Process",
        lead: "Step by step: from theme selection to optimization and training.",
      },
      pricing: {
        title: "Packages and pricing",
        lead: "Packages matched to site size and customization level.",
      },
      gallery: {
        title: "Project gallery",
        lead: "Case studies coming soon - see example sections below.",
      },
      quote: {
        title: "Quick quote",
        lead: "Share a few details to pick the best WordPress package.",
      },
      faq: {
        title: "FAQ",
        lead: "Most common WordPress questions.",
      },
    },
    scope: [
      {
        title: "Installation and configuration",
        description: "Hosting, domain, SSL, and base WP configuration.",
      },
      {
        title: "Content structure",
        description: "Menus, categories, post and page templates.",
      },
      {
        title: "Implementation and customization",
        description: "Theme/builder selection, sections, and styling.",
      },
      {
        title: "Optimization",
        description: "SEO basics, cache, image optimization, and performance.",
      },
      {
        title: "Security",
        description: "Updates, backups, and basic hardening.",
      },
      {
        title: "Training",
        description: "Usage instructions and short team training.",
      },
    ],
    process: [
      {
        title: "Theme selection",
        description: "We pick a theme or builder that fits your needs.",
      },
      {
        title: "Content structure",
        description: "We define sections, menus, and information hierarchy.",
      },
      {
        title: "Implementation",
        description: "Setup, configuration, and content entry.",
      },
      {
        title: "Optimization",
        description: "SEO, performance, security, and training.",
      },
    ],
    pricing: [
      {
        name: "Starter",
        price: "from 2200 PLN",
        timeline: "1-2 weeks",
        features: [
          "Landing or simple site",
          "Ready theme",
          "Basic SEO",
          "Editor instructions",
        ],
      },
      {
        name: "Standard",
        price: "from 5600 PLN",
        timeline: "2-4 weeks",
        features: [
          "Company site + blog",
          "Theme customization",
          "Performance optimization",
          "Team training",
        ],
      },
      {
        name: "Pro",
        price: "from 9900 PLN",
        timeline: "4-6 weeks",
        features: [
          "Extended structure",
          "Custom sections",
          "Security plan",
          "Post-launch support",
        ],
      },
    ],
    galleryActions: [
      { label: "Demo", disabled: true },
      { label: "Details", type: "case-study" },
    ],
    galleryPlaceholders: [
      {
        title: "Company website",
        tags: ["Business", "WordPress"],
        description: "Case study coming soon. Offer layout and contact section.",
        caseStudySlug: "strona-firmowa",
      },
      {
        title: "Expert blog",
        tags: ["Content", "SEO"],
        description: "Case study coming soon. Post structure and categories.",
        caseStudySlug: "blog-ekspercki",
      },
      {
        title: "Campaign landing",
        tags: ["Campaign", "Leads"],
        description: "Case study coming soon. Sales sections and form.",
        caseStudySlug: "landing-kampanii",
      },
      {
        title: "Portfolio",
        tags: ["Portfolio", "Brand"],
        description: "Case study coming soon. Work gallery and testimonials.",
        caseStudySlug: "portfolio",
      },
      {
        title: "Service website",
        tags: ["Services", "B2B"],
        description: "Case study coming soon. Offer sections and FAQ.",
        caseStudySlug: "strona-uslugowa",
      },
      {
        title: "Local business site",
        tags: ["Local", "Map"],
        description: "Case study coming soon. Local SEO and contact data.",
        caseStudySlug: "strona-lokalna",
      },
    ],
    faq: [
      {
        question: "Is WordPress easy to use?",
        answer: "Yes, we provide instructions and editor training.",
      },
      {
        question: "Can I change the theme myself?",
        answer: "Yes, but it is best to plan it to keep visual consistency.",
      },
      {
        question: "Do you offer post-launch support?",
        answer: "Yes, we offer maintenance and update packages.",
      },
      {
        question: "How do you handle security?",
        answer: "Updates, backups, SSL, and basic hardening.",
      },
      {
        question: "Is WordPress fast?",
        answer: "With optimization and good hosting - yes, we handle cache and images.",
      },
      {
        question: "Can the site be expanded later?",
        answer: "Yes, the structure is prepared for growth.",
      },
    ],
    cta: {
      title: "Need a WordPress site?",
      description: "Describe your needs and we will pick the right package.",
      primaryLabel: "Contact me",
      primaryHref: "#/contact",
      secondaryLabel: "View products",
      secondaryHref: "#/products",
    },
  },
  {
    slug: "ui-ux-branding",
    name: "UI / UX & Branding",
    shortDescription:
      "Logo, brand kit, and marketing graphics. We design a consistent identity and simple UI mocks.",
    seo: {
      title: "UI / UX & Branding - Services | KP_Code Digital Vault",
      description:
        "Logo, brand kit, and social graphics. Design in Canva, with Figma as the next step.",
    },
    heroLead:
      "We build a consistent brand identity: logo, colors, typography, and marketing graphics. We work in Canva today, with Figma as a natural extension.",
    summaryBullets: [
      "Logo and export variants",
      "Brand kit and social media templates",
      "Basic UI mockups as a direction",
    ],
    deliverables: [
      "Logo files in multiple formats",
      "Brand kit with colors and fonts",
      "Social templates and graphics pack",
    ],
    forWho: [
      "New brands and startups",
      "Companies that need a refresh",
      "Marketing and social media teams",
      "Products with a growing customer base",
    ],
    sections: {
      forWho: {
        title: "Who it is for",
        lead: "When you need a consistent identity and communication assets.",
      },
      scope: {
        title: "Scope",
        lead: "Branding and UI in a scalable package.",
      },
      process: {
        title: "Process",
        lead: "Interview, moodboard, design, and delivery.",
      },
      pricing: {
        title: "Packages and pricing",
        lead: "Packages tailored to the scale of identity and materials.",
      },
      gallery: {
        title: "Projects / examples",
        lead: "Mockups and graphics we can deliver (case studies soon).",
      },
      quote: {
        title: "Quick quote",
        lead: "Tell us what you need and we will propose scope options.",
      },
      faq: {
        title: "FAQ",
        lead: "Most common questions about branding and UI.",
      },
    },
    scope: [
      {
        title: "Logo and variants",
        description: "Primary logo, mono version, and exports for print/web.",
      },
      {
        title: "Brand kit",
        description: "Color palette, typography, usage rules, and tone of voice.",
      },
      {
        title: "Social media templates",
        description: "Post and story templates for IG/FB/LinkedIn.",
      },
      {
        title: "Campaign graphics",
        description: "Ad banners, newsletter graphics, and landing visuals.",
      },
      {
        title: "Mini identity",
        description: "Business card, email footer, covers, and mini guideline.",
      },
      {
        title: "UI mockups (direction)",
        description: "Simple landing/dashboard layouts with a path to Figma.",
      },
      {
        title: "Icons and illustrations",
        description: "Consistent icon sets and illustrations aligned with brand.",
      },
    ],
    process: [
      {
        title: "Interview and inspiration",
        description: "We gather brand goals, competitors, and communication style.",
      },
      {
        title: "Moodboard",
        description: "We define a visual direction and references.",
      },
      {
        title: "Design",
        description: "Logo, brand kit, and key materials.",
      },
      {
        title: "Delivery",
        description: "Exports, source files, and usage instructions.",
      },
    ],
    pricing: [
      {
        name: "Starter",
        price: "from 1800 PLN",
        timeline: "1-2 weeks",
        features: [
          "Logo + basic variants",
          "Color palette",
          "Web exports",
          "Short usage notes",
        ],
      },
      {
        name: "Standard",
        price: "from 4200 PLN",
        timeline: "2-3 weeks",
        features: [
          "Brand kit",
          "Social templates",
          "Campaign graphics",
          "Mini guideline",
        ],
      },
      {
        name: "Pro",
        price: "from 7800 PLN",
        timeline: "3-5 weeks",
        features: [
          "Full identity",
          "UI mockups (direction)",
          "Marketing materials pack",
          "Icon/illustration set",
        ],
      },
    ],
    galleryActions: [
      { label: "Demo", disabled: true },
      { label: "Details", type: "case-study" },
    ],
    galleryPlaceholders: [
      {
        title: "Startup brand kit",
        tags: ["Brand", "Canva"],
        description: "Case study coming soon. Logo, colors, and typography.",
        caseStudySlug: "brand-identity",
      },
      {
        title: "Social media templates",
        tags: ["Social", "Templates"],
        description: "Case study coming soon. Post and story pack.",
        caseStudySlug: "social-media-pack",
      },
      {
        title: "Mini identity",
        tags: ["Branding", "Print"],
        description: "Case study coming soon. Business cards and email footer.",
        caseStudySlug: "marketing-graphics",
      },
      {
        title: "Campaign graphics",
        tags: ["Ads", "Marketing"],
        description: "Case study coming soon. Banners and ad graphics.",
        caseStudySlug: "event-visuals",
      },
      {
        title: "UI mockups",
        tags: ["UI", "Figma"],
        description: "Case study coming soon. Landing and dashboard.",
        caseStudySlug: "landing-ui-design",
      },
      {
        title: "Icon set",
        tags: ["Icons", "UI"],
        description: "Case study coming soon. Consistent icons and illustrations.",
        caseStudySlug: "ui-redesign",
      },
    ],
    faq: [
      {
        question: "Will the logo come in multiple versions?",
        answer: "Yes, we deliver light, dark, and mono variants.",
      },
      {
        question: "Do you use Canva?",
        answer: "Yes, we use Canva now. Figma is the next growth step.",
      },
      {
        question: "Can I request revisions?",
        answer: "Yes, revisions are included in the packages.",
      },
      {
        question: "Will I get source files?",
        answer: "Yes, we deliver exports and editable source files.",
      },
      {
        question: "Do you design ad graphics?",
        answer: "Yes, we prepare graphics for campaigns and newsletters.",
      },
      {
        question: "Do you create UI mockups?",
        answer: "Yes, simple UI mockups as a product direction.",
      },
    ],
    cta: {
      title: "Build a consistent identity",
      description: "Share your brand goals and we will propose a branding scope.",
      primaryLabel: "Contact me",
      primaryHref: "#/contact",
      secondaryLabel: "View products",
      secondaryHref: "#/products",
    },
  },
  {
    slug: "consulting-support",
    name: "Consulting & Support",
    shortDescription:
      "Consulting, audits, and implementation support: front-end architecture, performance, a11y, and technical SEO.",
    seo: {
      title: "Consulting & Support - Services | KP_Code Digital Vault",
      description:
        "Consulting, performance and a11y audits, implementation support, and 1:1 mentoring. Clear recommendations and a plan.",
    },
    heroLead:
      "We help teams structure front-end, improve performance and accessibility. We provide consulting, audits, and ongoing implementation support.",
    summaryBullets: [
      "Code review and architecture consulting",
      "Performance/a11y audit + improvement plan",
      "Implementation support, hosting, and mentoring",
    ],
    deliverables: [
      "Report with recommendations",
      "Implementation and performance checklist",
      "Team improvement plan",
    ],
    forWho: [
      "Front-end teams that need expert support",
      "Startups preparing an MVP",
      "Companies with performance issues",
      "Brands preparing large campaigns",
    ],
    sections: {
      forWho: {
        title: "Who it is for",
        lead: "When you need expert support and fast improvements.",
      },
      scope: {
        title: "Scope",
        lead: "Clear feedback and a plan to improve the front-end.",
      },
      process: {
        title: "Process",
        lead: "Analysis, recommendations, and implementation support.",
      },
      pricing: {
        title: "Packages and pricing",
        lead: "Flexible packages tailored to team needs.",
      },
      gallery: {
        title: "Projects / examples",
        lead: "Audit and support case studies (examples coming soon).",
      },
      quote: {
        title: "Quick quote",
        lead: "Describe the issue and we will propose the best support option.",
      },
      faq: {
        title: "FAQ",
        lead: "Most common questions about consulting and support.",
      },
    },
    scope: [
      {
        title: "Code review",
        description: "Code analysis, module structure, and UI architecture guidance.",
      },
      {
        title: "Performance audit",
        description: "CLS/LCP, asset optimization, and a prioritized plan.",
      },
      {
        title: "A11y audit",
        description: "Accessibility checks, quick fixes, and next steps.",
      },
      {
        title: "Technical SEO for SPA",
        description: "Metadata, link structure, indexing, and best practices.",
      },
      {
        title: "Implementation support",
        description: "Hosting, domain, build/deploy configuration, and review.",
      },
      {
        title: "1:1 mentoring",
        description: "60-90 min sessions + summary PDF/checklist (demo).",
      },
      {
        title: "Retainer support",
        description: "Retainer package: X hrs/month for support and growth.",
      },
    ],
    process: [
      {
        title: "Diagnosis",
        description: "We collect issues and analyze the current state.",
      },
      {
        title: "Audit",
        description: "We review performance, a11y, and technical SEO.",
      },
      {
        title: "Improvement plan",
        description: "We prioritize tasks and propose quick wins.",
      },
      {
        title: "Support",
        description: "We help implement changes and monitor impact.",
      },
    ],
    pricing: [
      {
        name: "Consultation",
        price: "from 600 PLN",
        timeline: "60-90 min",
        features: [
          "Problem analysis",
          "Implementation recommendations",
          "Email summary",
        ],
      },
      {
        name: "Audit + plan",
        price: "from 2400 PLN",
        timeline: "1-2 weeks",
        features: [
          "Performance and a11y audit",
          "Improvement plan",
          "Priorities and quick wins",
        ],
      },
      {
        name: "Retainer support",
        price: "from 1900 PLN / month",
        timeline: "X hrs/month",
        features: [
          "Ongoing team support",
          "Change monitoring",
          "Regular consultations",
        ],
      },
    ],
    galleryPlaceholders: [
      {
        title: "Performance audit",
        tags: ["CLS", "LCP"],
        description: "Example report with recommendations (demo).",
      },
      {
        title: "A11y audit",
        tags: ["A11y", "UX"],
        description: "List of quick fixes and priorities (demo).",
      },
      {
        title: "Code review",
        tags: ["Front-end", "Arch"],
        description: "Module and UI structure checklists (demo).",
      },
      {
        title: "Implementation support",
        tags: ["Deploy", "Hosting"],
        description: "Example implementation plan (demo).",
      },
      {
        title: "1:1 mentoring",
        tags: ["Mentoring", "PDF"],
        description: "Draft of summary and checklist (demo).",
      },
      {
        title: "Monthly retainer",
        tags: ["Support", "SLA"],
        description: "Support model with X hrs/month (demo).",
      },
    ],
    faq: [
      {
        question: "Will I get an audit report?",
        answer: "Yes, you receive a report with recommendations and priorities.",
      },
      {
        question: "Can I order only a code review?",
        answer: "Yes, single consultations are available without a full audit.",
      },
      {
        question: "Do you help implement fixes?",
        answer: "Yes, we can support the team during implementation.",
      },
      {
        question: "How does retainer support work?",
        answer: "Monthly billing with a fixed number of support hours.",
      },
      {
        question: "Are consultations remote?",
        answer: "Yes, we work remotely and meet online.",
      },
      {
        question: "Can we identify quick wins?",
        answer: "Yes, we highlight quick fixes that improve results fast.",
      },
    ],
    cta: {
      title: "Need expert support?",
      description: "Describe the issue and we will propose an action plan.",
      primaryLabel: "Contact me",
      primaryHref: "#/contact",
      secondaryLabel: "View products",
      secondaryHref: "#/products",
    },
  },
];

export const getServiceBySlug = (slug) => {
  if (!slug) {
    return null;
  }
  return SERVICES.find((service) => service.slug === slug) || null;
};

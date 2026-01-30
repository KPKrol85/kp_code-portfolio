// Rule: UI strings live in content/.
export const content = {
  common: {
    browseProducts: "Browse products",
    backToCatalog: "Back to catalog",
    goToLibrary: "Go to library",
    goToCheckout: "Go to checkout",
    processing: "Processing...",
    retry: "Try again",
    screenshotSoon: "Screenshot coming soon",
    summaryTitle: "Summary",
    skipLink: "Skip to main content",
    fields: {
      name: "Full name",
      email: "Email",
      company: "Company",
      companyOptional: "Company (optional)",
      taxIdOptional: "Tax ID (optional)",
      password: "Password",
    },
    validation: {
      emailInvalid: "Enter a valid email.",
      passwordMinLength: "Password must be at least 6 characters.",
      nameRequired: "Enter your full name.",
      nameMinLength: "Name must be at least 2 characters.",
      profileNameMinLength: "Name must be at least 2 characters.",
    },
    demo: {
      loginCta: "Sign in (demo)",
      loginSuccess: "Signed in in demo mode.",
    },
  },
  themeToggle: {
    toLight: "Switch to light theme",
    toDark: "Switch to dark theme",
    title: "Toggle theme",
  },
  header: {
    brandAriaLabel: "KP_Code Digital Vault",
    navAriaLabel: "Primary",
    nav: {
      home: "Home",
      products: "Products",
      productsRoot: "All products",
      productsDropdown: {
        uiKits: "UI Kits & Components",
        templates: "Templates & Dashboards",
        assets: "Assets & Graphics",
        knowledge: "Knowledge & Tools",
      },
      services: "Services",
      servicesRoot: "All services",
      servicesDropdown: {
        webDevelopment: "Web Development",
        wordpress: "WordPress Solutions",
        uiUxBranding: "UI / UX & Branding",
        consultingSupport: "Consulting & Support",
      },
      contact: "Contact",
    },
    accountLabel: "Account",
    accountMenu: {
      login: "Sign in",
      register: "Create account",
      demo: "Demo account",
      account: "Account panel",
      library: "Library",
      licenses: "Licenses",
      settings: "Settings",
      logout: "Sign out",
    },
    cartLabel: "Cart ({count})",
    demoBadge: "Demo mode: admin requires backend",
    menuLabel: "Menu",
    menuOpenLabel: "Open menu",
    menuCloseLabel: "Close menu",
    langToggleTitle: "Change language",
    langToggleAria: "Switch language",
  },
  footer: {
    brandAriaLabel: "KP_Code Digital Vault",
    brandTitle: "KP_Code Digital Vault",
    brandDescription:
      "A compact library of digital products for creators and teams. Simple checkout and fast access.",
    newsletter: {
      title: "Newsletter",
      description: "Notifications about new releases and products.",
      emailLabel: "Email address",
      emailPlaceholder: "Email address",
      submitLabel: "Subscribe",
      soonLabel: "Coming soon",
    },
    nav: {
      products: {
        title: "Products",
        ariaLabel: "Products",
        links: {
          browse: "Browse products",
          categories: "Product categories",
          pricing: "Pricing",
          updates: "Updates / Changelog",
        },
      },
      resources: {
        title: "Resources",
        ariaLabel: "Resources",
        links: {
          docs: "Documentation",
          faq: "FAQ",
          support: "Support",
          contact: "Contact",
        },
      },
      company: {
        title: "Company",
        ariaLabel: "Company",
        links: {
          about: "About",
          roadmap: "Roadmap",
          careers: "Careers",
        },
      },
      account: {
        title: "Account",
        ariaLabel: "Account",
      },
    },
    accountLinks: {
      login: "Sign in",
      register: "Create account",
      account: "Account panel",
      library: "My library",
      licenses: "Licenses",
    },
    socialTitle: "Social media",
    socialAria: "KP_Code on {label}",
    legal: {
      privacy: "Privacy Policy",
      terms: "Terms",
      cookies: "Cookies",
    },
    copyright: "(c) {year} KP_Code. All rights reserved.",
    backToTop: "Back to top",
  },
  placeholders: {
    fallbackLead: "In progress.",
    detailsTitle: "What will be here?",
    detailsFallback: "We will add details about features and content for this section.",
    defaultCtas: [
      { label: "Back to products", href: "#/products" },
      { label: "Sign in", href: "#/auth", variant: "secondary" },
    ],
    bullets: {
      products: [
        "Overview of thematic collections and filters.",
        "Example previews and compatibility checklists.",
        "Quick comparison of licenses and file formats.",
      ],
      services: [
        "Scope and service packages with indicative timelines.",
        "Case studies and example deliveries.",
        "Short form for a quick quote.",
      ],
      resources: [
        "Current materials and guides for clients.",
        "FAQ section and knowledge base.",
        "Contact and technical support channels.",
      ],
      company: [
        "Information about the team and brand mission.",
        "Milestones and product development plan.",
        "Collaboration offers and current openings.",
      ],
      account: [
        "Profile and account security settings.",
        "Notifications and communication preferences.",
        "Billing details management.",
      ],
    },
    views: {
      careers: {
        title: "Careers",
        lead: "In progress.",
      },
    },
  },
  access: {
    backHomeCta: "Back to home",
    adminDisabled: {
      title: "Admin unavailable",
      message:
        "The admin panel requires backend verification. It is disabled in demo mode.",
    },
    forbidden: {
      title: "Access denied",
      message: "You do not have permission to access this section.",
    },
  },
  products: {
    count: "Showing {shown} of {total}",
    grid: {
      showMore: "Show more",
    },
    categoryFallbackLabel: "Category",
    categories: [
      {
        slug: "ui-kits",
        title: "UI Kits & Components",
        description:
          "Ready-made UI components and kits for fast interface building: layouts, forms, navigation, and marketing sections.",
        bullets: [
          "Components in a consistent style",
          "Tokens and variants",
          "Sample layouts",
          "Implementation tips",
          "Files: Figma / HTML/CSS (depending on product)",
        ],
        faq: [
          {
            question: "Which tools are UI kits compatible with?",
            answer:
              "Each product lists formats in the card - most often Figma and ready HTML/CSS for implementation.",
          },
          {
            question: "How do I integrate components into an existing project?",
            answer:
              "Import the base styles, then copy components section by section and align color tokens.",
          },
          {
            question: "What license covers UI kits?",
            answer:
              "By default you receive a commercial license for a single project - details are in the description.",
          },
          {
            question: "Can I quickly customize tokens and styles?",
            answer:
              "Yes, components are designed so you can change colors and typography via tokens.",
          },
          {
            question: "Do components consider accessibility?",
            answer:
              "We take care of semantics and a11y basics, but a full audit depends on your implementation.",
          },
        ],
      },
      {
        slug: "templates",
        title: "Templates & Dashboards",
        description:
          "Website and dashboard templates for SaaS, e-commerce, and landing pages - editable and shippable in hours.",
        bullets: [
          "Views: overview, analytics, settings",
          "Information architecture",
          "Responsive layouts",
          "Quality checklists",
          "Files: HTML/CSS/JS or Figma",
        ],
        faq: [
          {
            question: "How quickly can I adapt a template to my brand?",
            answer:
              "You can update colors, typography, and logo in one place thanks to tokens and structure.",
          },
          {
            question: "What exactly is included in the pack?",
            answer:
              "Complete views, sections, components, and source files described in the product card.",
          },
          {
            question: "How do template updates work?",
            answer:
              "If there is an update you get a notification and access to the new version in your library.",
          },
          {
            question: "Can I quickly replace content?",
            answer:
              "Yes, templates have a logical section structure so editing content is fast and safe.",
          },
          {
            question: "How long does implementation take?",
            answer:
              "Usually a few hours to 1-2 days, depending on the scope of changes.",
          },
        ],
      },
      {
        slug: "assets",
        title: "Assets & Graphics",
        description:
          "Graphics, icons, backgrounds, thumbnails, and marketing assets for product and project presentations.",
        bullets: [
          "Icons (SVG/PNG)",
          "Thumbnails, mockups",
          "OG/SEO sets",
          "Consistent styles",
          "Ready size variants",
        ],
        faq: [
          {
            question: "What formats are available?",
            answer:
              "Depending on the product you get SVG, PNG, or source files - described in the product card.",
          },
          {
            question: "Can I use assets in PWAs and manifests?",
            answer:
              "Yes, files are optimized for web and safe to include in manifests.",
          },
          {
            question: "How to best optimize assets?",
            answer:
              "Use the provided resolution variants and lossless compression.",
          },
          {
            question: "Can I use assets for social media and ads?",
            answer:
              "Yes, according to the commercial license described in the product card.",
          },
          {
            question: "Do I get different sizes and exports?",
            answer:
              "Yes, we often provide multiple size variants to speed up implementation.",
          },
        ],
      },
      {
        slug: "knowledge",
        title: "Knowledge & Tools",
        description:
          "Checklists, guides, and mini-tools for devs: processes, quality standards, productivity, and automation.",
        bullets: [
          "Release checklists",
          "A11y/performance",
          "Document templates",
          "Scripts/utility",
          "Educational materials",
        ],
        faq: [
          {
            question: "Who are Knowledge & Tools materials for?",
            answer:
              "For devs, PMs, and product teams that want to structure process and quality.",
          },
          {
            question: "How to use the checklists and tools?",
            answer:
              "Each file includes usage instructions and a suggested implementation order.",
          },
          {
            question: "How often are materials updated?",
            answer:
              "Updates appear when major process changes or new tool versions are released.",
          },
          {
            question: "Are materials suitable for beginners?",
            answer:
              "Yes, most materials are beginner/intermediate and clearly describe how to start.",
          },
          {
            question: "Can I use tools within a team?",
            answer:
              "Yes, the license describes usage within a team and projects.",
          },
        ],
      },
    ],
    categoryPage: {
      searchLabel: "Search in category",
      searchPlaceholder: "Search in this category",
      sortLabel: "Sorting",
      sortOptions: {
        latest: "Newest",
        priceAsc: "Price: low to high",
        priceDesc: "Price: high to low",
      },
      showMore: "Show more",
      aboutTitle: "About this category",
      faqTitle: "FAQ / Guides",
      emptyTitle: "First products coming soon",
      emptyMessage: "We will add the first products soon...",
      emptyCta: "Back to products",
    },
    listPage: {
      title: "Product catalog",
      lead: "Filter, sort, and pick digital products tailored to your workflow.",
      searchLabel: "Search products",
      searchPlaceholder: "Search products",
      sortLabel: "Sorting",
      sortOptions: {
        latest: "Newest",
        priceAsc: "Price: low to high",
        priceDesc: "Price: high to low",
      },
      categoryLabel: "Category",
      categoryAll: "All categories",
      showMore: "Show more",
      faq: {
        ariaLabel: "FAQ",
        title: "FAQ",
        lead: "Most common questions about purchasing, licensing, and digital product updates.",
      },
    },
    faqGeneral: [
      {
        question: "What license applies to digital products?",
        answer:
          "By default you receive a commercial license for one project. The exact scope is described in the product card.",
      },
      {
        question: "How do I receive product updates?",
        answer:
          "New versions appear in your library after purchase, and we announce major changes.",
      },
      {
        question: "Which file formats do you deliver?",
        answer:
          "It depends on the product: most often Figma, HTML/CSS, SVG/PNG, or additional sources.",
      },
      {
        question: "Are digital products refundable?",
        answer:
          "Downloaded digital products are usually non-refundable, but contact us if you face technical issues.",
      },
    ],
  },
  productDetails: {
    meta: {
      title: "{name} - KP_Code Digital Vault",
      fallbackDescription: "Explore this digital product and its contents.",
    },
    aria: {
      galleryThumb: "View image {index}",
    },
    labels: {
      category: "Category: {value}",
      requirements: "Requirements: {value}",
      version: "Version: {value}",
      updated: "Updated: {value}",
    },
    cta: {
      addToCart: "Add to cart",
      goToCart: "Go to cart",
    },
    sections: {
      contents: "Package contents",
      downloads: "Downloads",
    },
  },
  pricing: {
    seo: {
      title: "Pricing - KP_Code Digital Vault",
      description:
        "A transparent pricing model for digital products and KP_Code Digital Vault services.",
    },
    hero: {
      eyebrow: "Pricing",
      title: "Pricing",
      lead:
        "Transparent pricing for digital products and services. Pay once and get access to the panel and files under the license.",
      ctas: [
        { label: "View products", href: "#/products" },
        { label: "Contact", href: "#/contact", variant: "secondary" },
      ],
    },
    explanation: {
      title: "How purchasing works",
      lead: "Short and clear: what you get after purchase and how access works.",
      items: [
        {
          title: "Access and files",
          description:
            "After purchase you get access to the client panel and files to download or product bundles.",
        },
        {
          title: "Licenses",
          description:
            "Available variants: Personal / Commercial. The choice depends on the project scale.",
          linkLabel: "View licenses",
          linkHref: "#/licenses",
        },
        {
          title: "Updates",
          description:
            "Updates are available within the purchased access; details are listed in licenses.",
          linkLabel: "Update details",
          linkHref: "#/licenses",
        },
        {
          title: "Refunds and rules",
          description:
            "Downloaded digital products are usually non-refundable, but we help with technical issues.",
          linkLabel: "Terms",
          linkHref: "#/terms",
        },
      ],
    },
    products: {
      title: "Digital products",
      lead: "Packages tailored to different needs - from single sets to collections.",
      items: [
        {
          name: "Starter Packs",
          price: "from ...",
          description: "Quick start with key components and sections.",
          features: [
            "Starter UI or template sets",
            "Consistent tokens and variants",
            "Fast implementation",
            "Personal or Commercial license",
          ],
          ctaLabel: "View products",
          ctaHref: "#/products",
        },
        {
          name: "Pro Packs",
          price: "from ...",
          description: "Expanded packs for larger projects and teams.",
          features: [
            "More views and variants",
            "Richer layouts and components",
            "Implementation checklists and docs",
            "Updates per license",
          ],
          ctaLabel: "View products",
          ctaHref: "#/products",
        },
        {
          name: "Bundles / Collections",
          price: "from ...",
          description: "Thematic collections of consistent assets.",
          features: [
            "Bundled packs in one style",
            "Visual consistency across larger projects",
            "Time savings in implementation",
            "Commercial license",
          ],
          ctaLabel: "View products",
          ctaHref: "#/products",
        },
        {
          name: "All-Access / Vault Pass",
          price: "from ...",
          description: "Full library access in a single package.",
          features: [
            "Full catalog access",
            "New releases during access",
            "Ideal for teams and agencies",
            "Priority updates",
          ],
          ctaLabel: "View products",
          ctaHref: "#/products",
        },
      ],
    },
    services: {
      title: "Services",
      lead: "Service packages for teams, brands, and startups that need support.",
      items: [
        {
          name: "Landing Page",
          price: "from ...",
          description: "Fast delivery of a sales page.",
          features: [
            "Hero, benefits, and social proof sections",
            "Polished CTA and content structure",
            "Responsive and web-optimized",
          ],
          ctaLabel: "View services",
          ctaHref: "#/services",
        },
        {
          name: "Website / Portfolio",
          price: "from ...",
          description: "A complete site for a brand or offer.",
          features: [
            "Information architecture and content plan",
            "Design + implementation in one process",
            "Integrations and CMS readiness",
          ],
          ctaLabel: "View services",
          ctaHref: "#/services",
        },
        {
          name: "UI / Frontend Implementation",
          price: "from ...",
          description: "Component and design system implementation.",
          features: [
            "Components, tokens, and layouts",
            "Consistent UI aligned with brand",
            "Accessibility and baseline performance",
          ],
          ctaLabel: "View services",
          ctaHref: "#/services",
        },
        {
          name: "Consulting / Audit",
          price: "from ...",
          description: "Audit and recommendations for your product.",
          features: [
            "UX/UI and front-end analysis",
            "Recommendations and quick improvements",
            "Implementation roadmap and priorities",
          ],
          ctaLabel: "Contact",
          ctaHref: "#/contact",
        },
      ],
    },
    faq: {
      title: "FAQ",
      lead: "Most common questions about pricing, licenses, and services.",
      items: [
        {
          question: "Why are prices listed as \"from ...\"?",
          answer:
            "The final price depends on package scope, number of views, and license. This keeps pricing aligned to project scale.",
        },
        {
          question: "Do you issue invoices?",
          answer:
            "Yes. You receive an invoice after purchase. For services we issue invoices per agreement.",
        },
        {
          question: "How does the license work?",
          answer:
            "The license defines the usage scope (Personal or Commercial). Details are in the Licenses section.",
        },
        {
          question: "Are there updates?",
          answer:
            "Yes, we provide updates according to the purchased access and license terms.",
        },
        {
          question: "How long do services take?",
          answer:
            "Usually 1-several weeks, depending on scope and project priorities.",
        },
        {
          question: "Can I order something custom?",
          answer:
            "Yes, we handle custom projects. Get in touch to discuss scope and estimate.",
        },
      ],
    },
    cta: {
      title: "Questions? Get in touch",
      description:
        "Describe your needs and we will prepare a tailored estimate or recommend the best package.",
      primaryLabel: "Contact",
      primaryHref: "#/contact",
      secondaryLabel: "View products",
    secondaryHref: "#/products",
    },
  },
  legal: {
    common: {
      updatedAt: "2026-01-17",
      updatedAtLabel: "Last updated: 2026-01-17",
      draftNotice: "Draft version — pending legal review.",
      relatedTitle: "Related documents and contact",
      relatedLinks: [
        { label: "Privacy Policy", href: "#/privacy" },
        { label: "Terms", href: "#/terms" },
        { label: "Cookies", href: "#/cookies" },
        { label: "Contact", href: "#/contact" },
      ],
      contactEmail: "kontakt@kp-code.pl",
      contactLine: "Contact for legal and privacy matters: kontakt@kp-code.pl",
      contactCta: "Write to us",
      contactSeparator: " — ",
    },
    privacy: {
      title: "Privacy Policy",
      intro:
        "At KP_Code Digital Vault we value transparency. Below we explain what data we collect, why, and how long we store it when you use an account, buy digital products, or contact us.",
      sections: [
        {
          title: "Data controller and contact",
          paragraphs: [
            "The data controller is KP_Code Digital Vault. If you have questions about personal data, you can contact us by email.",
          ],
          list: ["Contact address: kontakt@kp-code.pl"],
        },
        {
          title: "What data we collect",
          paragraphs: [
            "The scope of data depends on the features you use. We process data required to create an account, fulfill purchases, and provide access to the product library.",
          ],
          list: [
            "account data (e.g. email, account identifier, login history),",
            "purchase data (e.g. product list, licenses, transaction history),",
            "contact data shared in support correspondence,",
            "technical data required for service operation (e.g. theme settings, session identifiers).",
          ],
        },
        {
          title: "Processing purposes",
          paragraphs: ["We process data for clearly defined purposes:"],
          list: [
            "fulfillment of contracts and delivery of purchased digital products,",
            "account and user library management,",
            "security and fraud prevention,",
            "customer support and service-related communication,",
            "compliance with legal obligations, including accounting.",
          ],
        },
        {
          title: "Legal basis",
          paragraphs: [
            "We process data based on contract performance, legal obligations, and legitimate interests (e.g. service security, product development).",
          ],
        },
        {
          title: "Retention period",
          paragraphs: [
            "We retain data for the time needed to provide services and meet legal obligations. Account data is processed until deletion, and transaction data for the legally required period.",
          ],
        },
        {
          title: "Data recipients",
          paragraphs: [
            "Data may be entrusted to entities supporting the service. Assumption: hosting providers, analytics tools, and email services.",
          ],
        },
        {
          title: "User rights",
          paragraphs: ["You have the right to:"],
          list: [
            "access your data and obtain a copy,",
            "rectify data,",
            "delete data or restrict processing,",
            "object to processing,",
            "data portability as provided by law.",
          ],
        },
        {
          title: "Data security",
          paragraphs: [
            "We apply technical and organizational measures appropriate to the scale of the service, including access control and infrastructure safeguards.",
          ],
        },
        {
          title: "Policy changes",
          paragraphs: [
            "The privacy policy may be updated as the services evolve. The current version is always available in the service.",
          ],
        },
      ],
    },
    terms: {
      title: "Terms",
      intro:
        "These terms define the rules for using KP_Code Digital Vault and the conditions for purchasing and using digital products available in the service.",
      sections: [
        {
          title: "Definitions",
          paragraphs: ["For the purposes of these terms, we adopt the following definitions:"],
          list: [
            "User – a person using the service.",
            "Account – a user profile created in the service.",
            "Digital product – content delivered in digital form.",
            "Library – the place where purchased products are made available.",
            "License – the permitted scope of use for a digital product.",
          ],
        },
        {
          title: "Service scope",
          paragraphs: [
            "KP_Code Digital Vault enables the purchase and download of digital products. The service provides access to the library of purchased products.",
          ],
        },
        {
          title: "Registration and account",
          paragraphs: [
            "An account is required for full use of the service. The user is responsible for the security of login credentials and keeping contact details up to date.",
          ],
        },
        {
          title: "Purchase and payment",
          paragraphs: [
            "Purchases are processed as one-time payments. After placing an order, the user gains access to the product in the library.",
          ],
        },
        {
          title: "Digital delivery",
          paragraphs: [
            "Delivery is electronic – via the library or a download link. Access is maintained for the duration of service availability.",
          ],
        },
        {
          title: "License and permitted use",
          paragraphs: ["Purchasing a digital product grants a license:"],
          list: [
            "the license covers personal or commercial use as described in the product details,",
            "resale and sharing products with third parties is prohibited,",
            "the detailed license scope may be indicated on the product page or in a license file.",
          ],
        },
        {
          title: "Returns and complaints",
          paragraphs: [
            "For digital content, separate legal provisions on withdrawal apply. Return information is preliminary and requires legal verification.",
          ],
        },
        {
          title: "Liability and limitations",
          paragraphs: [
            "The service provides products as described. Responsibility for using products lies with the user within the scope of the license.",
          ],
        },
        {
          title: "Changes to the terms",
          paragraphs: ["The terms may be updated. Changes will be communicated in the service."],
        },
      ],
    },
    cookies: {
      title: "Cookies",
      intro:
        "This site uses cookies and localStorage to ensure proper operation and convenient use of KP_Code Digital Vault services.",
      sections: [
        {
          title: "What are cookies and localStorage",
          paragraphs: [
            "Cookies are small files stored in the browser to remember settings. localStorage is browser storage that keeps data on the user's side.",
          ],
        },
        {
          title: "File categories",
          paragraphs: ["We use the following categories:"],
          list: [
            "Essential – required for service operation and security.",
            "Functional – remember user settings.",
            "Analytics – assumption: used only after analytics tools are implemented.",
            "Marketing – assumption: currently not used.",
          ],
        },
        {
          title: "How to manage cookies",
          paragraphs: [
            "You can manage cookies in your browser settings, including deleting or blocking them.",
          ],
        },
        {
          title: "Use of localStorage",
          paragraphs: [
            "We use localStorage to store settings and data required for the service to operate:",
          ],
          list: [
            "theme settings (light/dark),",
            "cart contents,",
            "login session and return to the last path.",
          ],
        },
        {
          title: "Contact",
          paragraphs: [
            "If you have questions about cookies, you can contact us at kontakt@kp-code.pl.",
          ],
        },
      ],
    },
  },
  breadcrumbs: {
    sections: {
      products: "Products",
      services: "Services",
      contact: "Contact",
      cart: "Cart",
      checkout: "Checkout",
      checkoutSuccess: "Order success",
      auth: "Sign in",
      account: "Account",
      accountOrders: "Orders",
      accountDownloads: "Downloads",
      accountSettings: "Account settings",
      library: "Library",
      licenses: "Licenses",
      settings: "Account settings",
      legal: "Legal documents",
      privacy: "Privacy Policy",
      terms: "Terms",
      cookies: "Cookies",
      admin: "Administration",
      pricing: "Pricing",
      updates: "Updates",
      docs: "Documentation",
      faq: "FAQ",
      support: "Support",
      about: "About",
      roadmap: "Roadmap",
      careers: "Careers",
      notFound: "Page not found",
    },
    services: {
      webDevelopment: "Web Development",
      wordpress: "WordPress Solutions",
      uiUxBranding: "UI / UX & Branding",
      consultingSupport: "Consulting & Support",
    },
  },
  meta: {
    routes: {
      home: {
        title: "KP_Code Digital Vault - Home",
        description: "Modern store with digital products and a purchase library.",
      },
      products: {
        title: "Product catalog - KP_Code Digital Vault",
        description: "Browse digital products, filters, and sorting.",
      },
      services: {
        title: "Services - KP_Code Digital Vault",
        description:
          "Explore KP_Code services: web development, WordPress, branding, and consulting.",
      },
      serviceDetails: {
        title: "Services - KP_Code Digital Vault",
        description: "Service details and delivery packages.",
      },
      productCategories: {
        uiKits: {
          title: "UI Kits & Components - KP_Code Digital Vault",
          description: "Components, layouts, and UI kits for fast implementation.",
        },
        templates: {
          title: "Templates & Dashboards - KP_Code Digital Vault",
          description: "Website and dashboard templates for SaaS, e-commerce, and landing pages.",
        },
        assets: {
          title: "Assets & Graphics - KP_Code Digital Vault",
          description: "Graphics, icons, and marketing assets for product presentation.",
        },
        knowledge: {
          title: "Knowledge & Tools - KP_Code Digital Vault",
          description: "Checklists, guides, and tools that support developers.",
        },
      },
      productDetails: {
        title: "Product details - KP_Code Digital Vault",
        description: "Explore a digital product and its contents.",
      },
      cart: {
        title: "Cart - KP_Code Digital Vault",
        description: "Review items in your cart and the order summary.",
      },
      checkout: {
        title: "Checkout - KP_Code Digital Vault",
        description: "Place an order for digital products.",
      },
      checkoutSuccess: {
        title: "Order success - KP_Code Digital Vault",
        description: "Confirmation that your order was placed.",
      },
      auth: {
        title: "Sign in - KP_Code Digital Vault",
        description: "Sign in or create a user account.",
      },
      account: {
        title: "Account - KP_Code Digital Vault",
        description: "User panel and order history.",
      },
      accountOrders: {
        title: "Orders - KP_Code Digital Vault",
        description: "Order history in KP_Code Digital Vault.",
      },
      accountDownloads: {
        title: "Downloads - KP_Code Digital Vault",
        description: "Downloads available after purchase.",
      },
      accountSettings: {
        title: "Account settings - KP_Code Digital Vault",
        description: "Manage profile data and preferences.",
      },
      library: {
        title: "Library - KP_Code Digital Vault",
        description: "Download your purchased digital products.",
      },
      licenses: {
        title: "Licenses - KP_Code Digital Vault",
        description: "Check license types and download license files.",
      },
      support: {
        title: "Support - KP_Code Digital Vault",
        description: "Technical help, FAQ, and platform support information.",
      },
      updates: {
        title: "Updates - KP_Code Digital Vault",
        description: "Platform changes and product updates.",
      },
      docs: {
        title: "Documentation - KP_Code Digital Vault",
        description: "Guides and information about using products and the platform.",
      },
      faq: {
        title: "FAQ - KP_Code Digital Vault",
        description: "Common questions about products, licenses, and purchases.",
      },
      pricing: {
        title: "Pricing - KP_Code Digital Vault",
        description: "Transparent pricing for products and services.",
      },
      privacy: {
        title: "Privacy Policy - KP_Code Digital Vault",
        description: "Data processing and privacy information for KP_Code Digital Vault.",
      },
      terms: {
        title: "Terms - KP_Code Digital Vault",
        description: "Rules for using KP_Code Digital Vault and purchasing digital products.",
      },
      cookies: {
        title: "Cookies - KP_Code Digital Vault",
        description: "Information about cookies and localStorage in KP_Code Digital Vault.",
      },
      admin: {
        title: "Admin panel - KP_Code Digital Vault",
        description: "Store administration area (under construction).",
      },
      legal: {
        title: "Legal documents - KP_Code Digital Vault",
        description: "Terms and privacy policy of the store.",
      },
      contact: {
        title: "Contact - KP_Code Digital Vault",
        description: "Contact us about digital products.",
      },
      caseStudies: {
        title: "Case studies - KP_Code Digital Vault",
        description: "Overview of deliveries and case studies.",
      },
      caseStudyDetails: {
        title: "Case study - KP_Code Digital Vault",
        description: "Case study details and delivery description.",
      },
      notFound: {
        title: "404 - KP_Code Digital Vault",
        description: "Page not found.",
      },
      placeholders: {
        uiKits: {
          title: "UI Kits & Components - KP_Code Digital Vault",
          description: "The UI Kits & Components category is in preparation.",
        },
        templates: {
          title: "Templates & Dashboards - KP_Code Digital Vault",
          description: "The Templates & Dashboards category is in preparation.",
        },
        assets: {
          title: "Assets & Graphics - KP_Code Digital Vault",
          description: "The Assets & Graphics category is in preparation.",
        },
        knowledge: {
          title: "Knowledge & Tools - KP_Code Digital Vault",
          description: "The Knowledge & Tools category is in preparation.",
        },
        services: {
          title: "Services - KP_Code Digital Vault",
          description: "The KP_Code Digital Vault services section is in preparation.",
        },
        webDevelopment: {
          title: "Web Development - KP_Code Digital Vault",
          description: "The Web Development service is in preparation.",
        },
        wordpress: {
          title: "WordPress Solutions - KP_Code Digital Vault",
          description: "The WordPress Solutions service is in preparation.",
        },
        uiUxBranding: {
          title: "UI / UX & Branding - KP_Code Digital Vault",
          description: "The UI / UX & Branding service is in preparation.",
        },
        consultingSupport: {
          title: "Consulting & Support - KP_Code Digital Vault",
          description: "The Consulting & Support service is in preparation.",
        },
        pricing: {
          title: "Pricing - KP_Code Digital Vault",
          description: "Pricing is in preparation.",
        },
        updates: {
          title: "Updates - KP_Code Digital Vault",
          description: "Updates and changelog are in preparation.",
        },
        docs: {
          title: "Documentation - KP_Code Digital Vault",
          description: "Documentation is in preparation.",
        },
        faq: {
          title: "FAQ - KP_Code Digital Vault",
          description: "FAQ is in preparation.",
        },
        support: {
          title: "Support - KP_Code Digital Vault",
          description: "Support is in preparation.",
        },
        about: {
          title: "About - KP_Code Digital Vault",
          description: "About section is in preparation.",
        },
        roadmap: {
          title: "Roadmap - KP_Code Digital Vault",
          description: "Roadmap is in preparation.",
        },
        careers: {
          title: "Careers - KP_Code Digital Vault",
          description: "Careers section is in preparation.",
        },
        settings: {
          title: "Account settings - KP_Code Digital Vault",
          description: "Account settings are in preparation.",
        },
      },
    },
  },
  states: {
    emptyFallbackTitle: "No data",
    errorFallbackMessage: "Try again later.",
    route: {
      loading: {
        title: "Loading",
        message: "Loading view...",
      },
      error: {
        title: "Failed to load view",
        message: "Failed to load the view. Please try again.",
        messageWithDetails: "Failed to load the view. Details: {details}",
      },
    },
    products: {
      loading: {
        title: "Loading products",
        message: "Fetching product data.",
      },
      error: {
        title: "Failed to load products",
        message: "Please try again later.",
      },
      empty: {
        title: "No products",
        message: "No products to display.",
      },
      filteredEmpty: {
        title: "No products found.",
        message: "Try adjusting filters or search.",
        cta: "Clear filters",
      },
    },
    cart: {
      loading: {
        title: "Loading cart",
        message: "Fetching cart data.",
      },
      empty: {
        title: "Your cart is empty.",
        message: "Browse products to get started.",
      },
      missingOnly: {
        title: "We cannot display cart items.",
        message: "All items are unavailable. Remove them to continue.",
        cta: "Clear unavailable",
      },
      missingNotice: {
        title: "Unavailable items detected in cart.",
        message: "Remove missing items to continue shopping.",
      },
      missingSection: {
        title: "Unavailable items",
        itemTitle: "Unavailable product",
        itemMessage: "This product is no longer available in the catalog.",
        removeCta: "Remove",
      },
      liveRegion: {
        totalUpdated: "Cart total updated: {total}.",
      },
    },
    checkout: {
      empty: {
        title: "Your cart is empty.",
        message: "Browse products to get started.",
      },
      missingOnly: {
        title: "We cannot display cart items.",
        message: "All items are unavailable. Remove them to continue.",
        cta: "Clear unavailable",
      },
      missingNotice: {
        title: "Unavailable items detected in cart.",
        message: "Remove the items below to continue checkout.",
        removeAllCta: "Remove unavailable products",
      },
      missingSection: {
        title: "Unavailable items",
        itemTitle: "Unavailable product",
        itemMessage: "This product is no longer available in the catalog.",
        removeCta: "Remove",
      },
    },
    library: {
      loading: {
        title: "Loading library",
        message: "Fetching product data.",
      },
      empty: {
        title: "No purchases",
        message: "After purchase, products appear here automatically.",
      },
    },
    licenses: {
      loading: {
        title: "Loading licenses",
        message: "Fetching license data.",
      },
      empty: {
        title: "No licenses",
        message: "No licenses to display.",
      },
    },
    productDetails: {
      loading: {
        metaTitle: "Loading product...",
        title: "Loading product",
        message: "Fetching product data.",
      },
      error: {
        metaTitle: "Failed to load product",
        message: "Please try again later.",
      },
      notFound: {
        metaTitle: "Product not found",
        metaDescription: "Check the address or return to the product catalog.",
        title: "Product not found",
        message: "Check the address or return to the catalog.",
      },
      downloadsHint: "Files will appear in your library after checkout completes.",
    },
  },
  errors: {
    unexpectedTitle: "Something went wrong",
    unexpectedDescription:
      "Refresh the page. If the problem persists, come back later.",
    retryAction: "Refresh",
    homeAction: "Go to homepage",
  },
  toasts: {
    dataFetchError: "Failed to fetch data.",
    addedToCart: "Product added to cart.",
    addedToCartDetails: "Product added to cart.",
    removedFromCart: "Removed from cart.",
    promoApplied: "Promo code applied (demo).",
    checkoutSuccess: "Purchase completed successfully.",
    loginSuccess: "Signed in successfully.",
    accountCreated: "Account created, you can sign in.",
    logout: "Signed out.",
    contactSent: "Message sent (demo).",
    updateAvailable: "A new version is available. Refresh to update.",
    updateCta: "Refresh",
    connectionRestored: "Connection restored.",
    offline: "You are offline - some data may be outdated.",
  },
  auth: {
    title: "User account",
    tabs: {
      login: "Sign in",
      register: "Register",
    },
    login: {
      title: "Sign in",
      submit: "Sign in",
      loading: "Signing in...",
    },
    register: {
      title: "Create account",
      submit: "Create account",
      loading: "Registering...",
    },
    errors: {
      emailExists: "A user with this email already exists.",
      invalidCredentials: "Invalid email or password.",
      invalidData: "Invalid login data.",
      noSession: "No active session.",
    },
  },
  cart: {
    title: "Your cart",
    checkoutCta: "Go to checkout",
  },
  checkout: {
    title: "Checkout",
    orderDetailsTitle: "Order details",
    submit: "Place order",
    fields: {
      name: "Full name",
      email: "Email",
      company: "Company",
    },
    validation: {
      nameInvalid: "Enter your full name (min. 2 characters).",
      formInvalid: "Fix the highlighted fields.",
    },
    success: {
      metaTitle: "Thank you for your purchase",
      metaDescription: "Purchase completed. Files have been added to your library.",
      title: "Thank you for your purchase!",
      message: "Files have been added to your library.",
      ctaLibrary: "Go to library",
      ctaCatalog: "Back to catalog",
    },
  },
  library: {
    title: "Your library",
    emptyCta: "Go to catalog",
    ui: {
      purchasedTitle: "Your products",
      openPanel: "Open panel",
      downloadPackage: "Download package",
      purchasedAtLabel: "Purchased: {date}",
      emptyMessage:
        "No purchased products yet. After purchase, files and the panel will appear here.",
      demoToolsTitle: "Demo tools",
      demoToolsLead:
        "Simulate a purchase without a backend. Data is stored in localStorage.",
      demoToolsAdd: "Simulate purchase",
      demoToolsClear: "Clear purchases",
    },
  },
  productPanels: {
    coreUi: {
      accessDenied: {
        title: "Panel access denied",
        message: "Enable demo access to view the product panel.",
        action: "Enable access (demo)",
      },
      versionBadge: "v1.0",
      hero: {
        title: "Core UI Components Pack",
        lead: "Production-ready system UI for real dashboards.",
        sublead: "Tokens, light/dark modes, and ready-to-ship components.",
      },
      heroPlaceholder: "Access panel for your package.",
      features: {
        title: "Key features",
        lead: "Tokens, light/dark modes, and ready-to-ship components.",
        items: [
          {
            title: "Token-based themes",
            lead: "Semantic tokens keep light and dark modes consistent.",
          },
          {
            title: "Zero dependencies",
            lead: "Pure HTML and CSS, no build tools.",
          },
          {
            title: "Ready patterns",
            lead: "Most common UI patterns ready for production.",
          },
        ],
      },
    },
  },
  account: {
    title: "Your account",
    nav: {
      ariaLabel: "Account",
      overview: "Overview",
      orders: "Orders",
      downloads: "Downloads",
      licenses: "Licenses",
      settings: "Settings",
      logout: "Sign out",
    },
    overview: {
      greeting: "Welcome!",
      greetingWithName: "Welcome, {name}!",
      accountTypeLabel: "Account type",
      accountTypeDemo: "Demo",
      accountTypeClient: "Client",
      status: "Account status: active. You have full access to purchased assets.",
      tiles: {
        orders: {
          title: "Orders",
          description: "Check purchase history and payment statuses.",
          cta: "View orders",
        },
        downloads: {
          title: "Downloads",
          description: "Quick access to all purchased files.",
          cta: "Go to downloads",
        },
      },
    },
    orders: {
      title: "Orders",
      empty: {
        title: "No orders",
        message:
          "You do not have any orders yet. Once you purchase, they will appear here.",
        cta: "Go to products",
      },
      orderLabel: "Order #{id}",
      statusCompleted: "Completed",
      detailsCta: "Details",
      detailsToast: "Order details are in preparation.",
      dateLabel: "Date",
      totalLabel: "Total",
    },
    downloads: {
      title: "Downloads",
      empty: {
        title: "No downloads",
        message:
          "After purchase, downloadable products will be available here.",
        cta: "View products",
      },
      fallbackProduct: "Digital product",
      purchasedAtLabel: "Purchased",
      quantityLabel: "Quantity",
      downloadCta: "Download",
      downloadToast: "File download is in preparation.",
    },
    settings: {
      title: "Account settings",
      lead: "Manage profile data, preferences, and security.",
      profile: {
        title: "Profile",
        lead: "Update your profile name and check the assigned email.",
        saveCta: "Save changes",
        savedToast: "Profile changes saved.",
        nameLabel: "Name",
      },
      preferences: {
        title: "Preferences",
        lead: "Adjust appearance and motion to your preferences.",
        darkMode: "Dark mode",
        reducedMotion: "Reduced motion",
        saveCta: "Save preferences",
        savedToast: "Preferences saved.",
      },
      security: {
        title: "Security",
        lead: "This is a demo environment. Password change will be available after backend rollout.",
        changePasswordCta: "Change password",
      },
      danger: {
        title: "Danger zone",
        lead: "Sign out if you are using a public device.",
        logoutCta: "Sign out",
      },
      hint: {
        title: "Hint",
        message: "Settings are stored locally and work in demo mode.",
      },
    },
    overviewSectionTitle: "Overview",
  },
  licensesPage: {
    title: "Licenses",
    lead: "Check assigned licenses and learn about license types available in Digital Vault.",
    nav: {
      your: "Your licenses",
      types: "License types",
    },
    your: {
      title: "Your licenses",
      lead: "Licenses assigned to your account will appear here after purchase and access activation.",
      emptyTitle: "No assigned licenses.",
      emptyMessage: "After purchase, licenses will be visible here.",
      emptyCta: "Go to products",
      demoNote: "Demo mode: data is sample only.",
      statusActive: "Active",
      assignedAtLabel: "Assigned date",
      issuerLabel: "Issuer",
      productsLabel: "Products covered by license",
      libraryLink: "Library",
    },
    types: {
      title: "License types",
      lead: "Read license terms before purchasing.",
      audienceLabel: "For whom",
      permissionsLabel: "Permissions",
      limitationsLabel: "Limitations",
      supportLabel: "Support",
      legalLinkLabel: "Legal details: Terms",
      docsLinkLabel: "License documentation",
    },
  },
  home: {
    hero: {
      lead:
        "Digital products for creators and teams: website templates, UI kits, components, and mini-tools - ready to use in real projects.",
      ctas: {
        primaryLabel: "Browse products",
        primaryHref: "#/products",
        secondaryLabel: "View account demo",
        secondaryHref: "#/account",
      },
    },
    scrollIndicators: {
      leftAria: "Scroll left",
      rightAria: "Scroll right",
    },
    stats: {
      items: [
        { value: "6", label: "Ready digital solutions" },
        { value: "Senior-level", label: "Code and architecture quality" },
        { value: "< 24h", label: "Product delivery time" },
        { value: "Lifetime access", label: "Updates included" },
      ],
    },
    popular: {
      title: "Popular products",
    },
    info: {
      title: "Why Digital Vault?",
      lead:
        "Digital Vault is a curated set of digital products that help you build, learn, and ship faster. For creators, teams, and anyone who wants good tools without the noise.",
      badges: ["Instant access", "Updates included", "Prices from {price}"],
    },
  },
  about: {
    hero: {
      title: "About",
      lead:
        "KP_Code Digital Vault is a library of professional digital products built for real commercial work.",
    },
    mission: {
      ariaLabel: "Team and mission",
      title: "Team and mission",
      lead:
        "Our mission is to deliver digital products that are ready for production use - not as demos, but as a standard.",
      cardTitle: "Why KP_Code Digital Vault?",
      cardParagraphs: [
        "KP_Code Digital Vault was created in response to the need for structured, high-quality digital products that truly reduce delivery time and raise the standard for product teams.",
        "We build a library of tools, components, and design assets meant for real commercial projects - not as showcases, but as ready, scalable solutions.",
        "KP_Code Digital Vault is a growing platform developed iteratively, with a focus on stability, accessibility, performance, and ecosystem consistency.",
      ],
    },
    founder: {
      name: "Kamil Krol",
      role: "Founder · KP_Code",
      ariaLabel: "Founder photo - Kamil Krol",
      imageAlt: "Kamil Krol - Founder KP_Code",
      bio:
        "Designs and builds digital products based on real business needs. Combines design systems with front-end engineering, focused on stability, accessibility, and predictable platform growth.",
      values: [
        "Quality and consistency in UX",
        "Accessibility from day one",
        "Performance as a standard, not a bonus",
        "Simplicity and clarity of solutions",
      ],
      ctaLabel: "Contact",
    },
    progress: {
      ariaLabel: "Milestones and roadmap",
      title: "Milestones and roadmap",
      lead:
        "We build KP_Code Digital Vault iteratively. Milestones show what has shipped, while the roadmap sets priorities for the next stage - based on data, business goals, and feedback.",
      milestonesTitle: "Milestones",
      milestones: [
        {
          label: "Launch of KP_Code Digital Vault",
          description:
            "Stable platform launch and the first digital product collection release.",
        },
        {
          label: "Catalog expansion and offer standardization",
          description:
            "New product categories and a refined card/preview standard.",
        },
        {
          label: "User library and purchase management",
          description:
            "Downloads, licenses, product versioning, and organized purchase history.",
        },
      ],
      roadmapTitle: "Roadmap (living)",
      roadmapLead:
        "The roadmap describes key platform directions and is updated regularly based on data, sales, and user feedback.",
      roadmapItems: [
        "Product catalog growth - new categories, starter collections, and better discoverability.",
        "UI component library - consistent variants, higher quality, faster product implementation.",
        "Release automation and QA - platform stability, fewer regressions, predictable releases.",
        "Partnerships and affiliates - a safe collaboration program and ecosystem integrations.",
      ],
      roadmapCtaLabel: "View roadmap",
    },
    collaboration: {
      ariaLabel: "Collaboration and hiring",
      title: "Collaboration and hiring",
      lead:
        "We build KP_Code Digital Vault with brands, creators, and partners who value quality, scalability, and long-term product growth.",
      cards: [
        {
          title: "Product collaboration",
          description:
            "Co-design and delivery of digital products: UI packs, templates, components, and tools for real market use cases. We focus on quality, consistency, and end-user value.",
          ctaLabel: "Contact us",
        },
        {
          title: "Brand partnerships",
          description:
            "Partnerships with brands and teams that want to grow product visibility through launches, integrations, and value-first initiatives.",
          ctaLabel: "Lets talk",
        },
        {
          title: "Affiliate program",
          description:
            "A program for creators, communities, and partners who want to co-build distribution in a transparent, long-term model.",
          ctaLabel: "Join the program",
        },
      ],
      careers: {
        title: "Careers",
        description:
          "We are not running open hiring at the moment. If you are interested in future collaboration, leave your contact and we will reach out when the time is right.",
        notice:
          "We treat submissions as a contact pool for future growth.",
        ctaLabel: "Get in touch",
      },
    },
  },
  docs: {
    hero: {
      eyebrow: "Documentation",
      title: "Documentation",
      lead:
        "Guides and information about using products and the KP_Code Digital Vault platform.",
    },
    hub: {
      title: "Documentation hub",
      lead: "Pick the area that best matches your question.",
    },
    search: {
      label: "Search documentation",
      placeholder: "Search documentation...",
    },
    noteLinkLabel: "Terms",
    sections: [
      {
        id: "products",
        title: "Products",
        description:
          "Product downloads, package structure, versioning, and content updates.",
        ctaLabel: "Product docs",
        ctaHref: "#/docs/products",
      },
      {
        id: "ui-kits",
        title: "UI Kits & Components",
        description:
          "How to use components, integrate HTML/CSS, and safely customize sets.",
        ctaLabel: "Component integration",
        ctaHref: "#/docs/components",
      },
      {
        id: "licenses-practical",
        title: "Licenses (practical)",
        description:
          "Differences between personal and commercial licenses, examples, and usage rules.",
        ctaLabel: "License details",
        ctaHref: "#/licenses",
        note: {
          text: "Legal details are available in the Terms.",
          linkLabel: "Terms",
          href: "#/terms",
        },
      },
      {
        id: "account-library",
        title: "Account and library",
        description:
          "How the account works, where purchases appear, and how to download updates.",
        ctaLabel: "Manage account",
        ctaHref: "#/account",
      },
      {
        id: "platform",
        title: "KP_Code Digital Vault platform",
        description:
          "Platform overview: panel, library, access, demo mode, and limitations.",
        ctaLabel: "Explore the platform",
        ctaHref: "#/about",
      },
    ],
    cross: {
      title: "More help",
      lead: "Documentation is the start - use dedicated channels for more.",
      ctaLabel: "Go",
      items: [
        { title: "Have questions?", description: "Read the FAQ answers.", href: "#/faq" },
        { title: "Technical issue?", description: "Visit the support center.", href: "#/support" },
        {
          title: "Changes and new releases?",
          description: "Check updates and the changelog.",
          href: "#/updates",
        },
      ],
    },
    empty: {
      title: "No results",
      lead: "Try another query or browse all documentation sections.",
    },
  },
  faq: {
    hero: {
      eyebrow: "FAQ",
      title: "Frequently asked questions",
      lead: "Questions about products, licenses, and how the platform works.",
    },
    controls: {
      ariaLabel: "FAQ categories",
      title: "Categories",
      lead: "Pick a category or search for an answer.",
    },
    search: {
      label: "Search questions",
      placeholder: "Search questions...",
    },
    categories: [
      { id: "general", label: "General" },
      { id: "digital-products", label: "Digital products" },
      { id: "licenses", label: "Licenses and usage" },
      { id: "purchase", label: "Purchase and payments" },
      { id: "access", label: "Access and account" },
      { id: "services", label: "Services" },
      { id: "support", label: "Technical support" },
    ],
    items: [
      {
        id: "general-01",
        category: "general",
        question: "What is KP_Code Digital Vault?",
        answer:
          "A library of professional digital products and services designed for real commercial use.",
      },
      {
        id: "general-02",
        category: "general",
        question: "Who is this platform for?",
        answer:
          "Founders, product teams, agencies, and independent creators who want to ship quality UI faster.",
      },
      {
        id: "general-03",
        category: "general",
        question: "How fast can I start using it?",
        answer:
          "Immediately after purchase - files appear in your library and download links are active.",
      },
      {
        id: "products-01",
        category: "digital-products",
        question: "What does a digital product include?",
        answer:
          "Each product includes a content description: source files, formats (e.g. Figma, HTML/CSS), and a component list.",
      },
      {
        id: "products-02",
        category: "digital-products",
        question: "Can I use products in multiple projects?",
        answer:
          "It depends on the license. The Commercial license allows use in commercial projects per the license terms.",
      },
      {
        id: "products-03",
        category: "digital-products",
        question: "Are products updated?",
        answer:
          "Yes, updates are delivered based on your access and we notify you in the library.",
      },
      {
        id: "licenses-01",
        category: "licenses",
        question: "What is the difference between Personal and Commercial?",
        answer:
          "Personal is for private/testing use, while Commercial allows delivery in commercial projects.",
      },
      {
        id: "licenses-02",
        category: "licenses",
        question: "Does the license cover a team?",
        answer:
          "It depends on the product - check the product description for team usage scope.",
      },
      {
        id: "licenses-03",
        category: "licenses",
        question: "Where can I find license details?",
        answer:
          "In the Licenses section and product cards - each offer has a clear usage scope.",
      },
      {
        id: "purchase-01",
        category: "purchase",
        question: "Which payment methods are available?",
        answer:
          "Current payment methods are shown at checkout. If you need another form, contact us.",
      },
      {
        id: "purchase-02",
        category: "purchase",
        question: "Do you issue invoices?",
        answer:
          "Yes, you receive an invoice after purchase. For services we invoice per agreement.",
      },
      {
        id: "purchase-03",
        category: "purchase",
        question: "Are digital products refundable?",
        answer:
          "Downloaded digital products are usually non-refundable, but we help with technical issues.",
      },
      {
        id: "access-01",
        category: "access",
        question: "Where can I find purchased files?",
        answer:
          "In your user library - every purchase appears automatically after payment.",
      },
      {
        id: "access-02",
        category: "access",
        question: "Do I need an account to buy a product?",
        answer:
          "Yes, an account is required to access the library, licenses, and purchase history.",
      },
      {
        id: "access-03",
        category: "access",
        question: "Can I download files again?",
        answer:
          "Yes, downloads are available in your library as long as the product is active in your account.",
      },
      {
        id: "services-01",
        category: "services",
        question: "What does the service ordering process look like?",
        answer:
          "After contact we prepare scope, timeline, and estimate. Work starts after approval.",
      },
      {
        id: "services-02",
        category: "services",
        question: "Can I order a custom service?",
        answer:
          "Yes, we deliver custom projects. Share your needs and we will propose the scope and estimate.",
      },
      {
        id: "services-03",
        category: "services",
        question: "How long do services take?",
        answer:
          "Most often 1 to a few weeks, depending on scope and priority.",
      },
      {
        id: "support-01",
        category: "support",
        question: "Where do I report a technical issue?",
        answer:
          "Use the contact form - support typically responds within 24-48 hours.",
      },
      {
        id: "support-02",
        category: "support",
        question: "Do you help with product integration?",
        answer:
          "Yes, we can advise on implementation or propose an integration service.",
      },
      {
        id: "support-03",
        category: "support",
        question: "Do you provide updates and fixes?",
        answer:
          "Yes, new product versions appear in the library and major changes are posted in updates.",
      },
    ],
    cta: {
      ariaLabel: "Contact",
      title: "Didn't find an answer?",
      lead: "Write to us - we respond as quickly as possible.",
      primaryLabel: "Contact",
      secondaryLabel: "Updates / Changelog",
    },
    empty: {
      title: "No results",
      lead: "Try another query or pick a different category.",
    },
  },
  support: {
    hero: {
      eyebrow: "Support",
      title: "Support",
      lead: "Find help, documentation, or technical support information.",
    },
    help: {
      ariaLabel: "How we can help",
      title: "How can we help?",
      lead: "Choose the best path to find an answer quickly.",
      cards: [
        {
          icon: "?",
          title: "FAQ / Documentation",
          description: "Answers to the most common questions about products, licenses, and access.",
          ctaLabel: "Go to FAQ",
          ctaHref: "#/faq",
        },
        {
          icon: "⟳",
          title: "Updates / Changelog",
          description: "See new releases, fixes, and product changes.",
          ctaLabel: "View updates",
          ctaHref: "#/updates",
        },
        {
          icon: "!",
          title: "Technical issues",
          description: "Report a bug or product issue in a structured way.",
          ctaLabel: "How to report",
          ctaTarget: "issue-reporting",
          type: "scroll",
        },
        {
          icon: "•",
          title: "Account and access",
          description: "Purchases, library, licenses, and account management.",
          ctaLabel: "Account panel",
          ctaHref: "#/account",
        },
      ],
    },
    issue: {
      ariaLabel: "How to report a technical issue",
      title: "How to report a technical issue",
      lead: "Before you write, prepare the basics - this helps us respond faster.",
      stepLabel: "Step {index}",
      steps: [
        {
          title: "Check the FAQ",
          description: "Many answers are available immediately in the FAQ section.",
        },
        {
          title: "Check Updates / Changelog",
          description: "Make sure the issue was not already fixed in the latest release.",
        },
        {
          title: "Prepare details",
          description:
            "Product name, version, browser/OS, and a short issue description.",
        },
        {
          title: "Contact us",
          description: "Go to the Contact page and submit your report.",
        },
      ],
      ctaPrimaryLabel: "Go to FAQ",
      ctaSecondaryLabel: "Contact",
    },
    scope: {
      ariaLabel: "Support scope",
      title: "Support scope",
      lead: "Clear rules help solve issues faster.",
      includedTitle: "Support includes",
      excludedTitle: "Support does not include",
      included: [
        "Clarifications about product contents and licenses.",
        "Help with downloads and library access.",
        "Verification of technical issues related to the product.",
        "Information about updates and implementation guidance.",
      ],
      excluded: [
        "Full client-side implementations without a purchased service.",
        "Product modifications beyond the license scope.",
        "Security and hosting infrastructure audits.",
        "Feature work outside the purchased scope.",
      ],
    },
    response: {
      ariaLabel: "Response time",
      title: "Response time",
      lead: "Support is asynchronous - we respond as quickly as possible on business days.",
      primary: "Estimated response time: 24-48 business hours.",
      secondary: "For urgent cases, describe priority and business context in the request.",
    },
    cta: {
      ariaLabel: "Contact",
      title: "Didn't find an answer?",
      lead: "If you need support, contact us.",
      primaryLabel: "Contact",
    },
  },
  updates: {
    hero: {
      eyebrow: "Updates",
      title: "Updates / Changelog",
      lead: "We publish platform changes and product updates here.",
    },
    controls: {
      ariaLabel: "Update filters",
      title: "Updates overview",
      lead: "Filter entries or search for specific changes.",
    },
    search: {
      label: "Search updates",
      placeholder: "Search updates...",
    },
    filters: [
      { id: "all", label: "All" },
      { id: "platform", label: "Platform" },
      { id: "products", label: "Products" },
      { id: "fixes", label: "Fixes" },
      { id: "security", label: "Security" },
    ],
    entries: [
      {
        id: "update-2026-02-10",
        date: "2026-02-10",
        version: "2026.02.1",
        type: "Improved",
        scope: "platform",
        title: "Improved library panel",
        summary: "Faster loading and clearer download states.",
        details: [
          "Optimized loading of purchase lists.",
          "Clearer file availability messaging.",
          "Improved library card layout.",
        ],
        links: [{ label: "Library", href: "#/library" }],
      },
      {
        id: "update-2026-01-28",
        date: "2026-01-28",
        version: "2026.01.4",
        type: "New",
        scope: "products",
        title: "New starter packs for UI Kits",
        summary: "Added starter packs focused on fast implementation.",
        details: [
          "New hero, pricing, and FAQ sections.",
          "Unified color and typography tokens.",
          "Ready responsive variants.",
        ],
        links: [{ label: "UI Kits products", href: "#/products/ui-kits" }],
      },
      {
        id: "update-2026-01-20",
        date: "2026-01-20",
        version: "2026.01.3",
        type: "Fixed",
        scope: "fixes",
        title: "Cart and checkout fixes",
        summary: "Improved stability and messaging during checkout.",
        details: [
          "Clearer missing product messaging.",
          "Refined loading states.",
          "Fixed cart total display.",
        ],
      },
      {
        id: "update-2026-01-12",
        date: "2026-01-12",
        version: "2026.01.2",
        type: "Security",
        scope: "security",
        title: "Strengthened access security",
        summary: "Additional validation and better event logging.",
        details: [
          "Improved input validation.",
          "Enhanced account event logging.",
          "Extra routing-layer checks.",
        ],
      },
      {
        id: "update-2026-01-05",
        date: "2026-01-05",
        version: "2026.01.1",
        type: "Improved",
        scope: "products",
        title: "Better product descriptions",
        summary: "Standardized descriptions and contents in product cards.",
        details: [
          "Consistent product section layout.",
          "Added file format information.",
          "Aligned list and CTA styles.",
        ],
        links: [{ label: "Product catalog", href: "#/products" }],
      },
    ],
    empty: {
      title: "No entries",
      lead: "The first updates will appear with new package releases.",
    },
  },
  notFound: {
    title: "404",
    lead: "Page not found. Check the address or return to the homepage.",
    ctaLabel: "Back",
  },
  servicesUi: {
    stepLabel: "Step {index}",
    schema: {
      itemListName: "KP_Code services",
    },
    galleryActions: [
      { label: "Demo", disabled: true },
      { label: "Details", disabled: true },
    ],
    index: {
      sections: {
        cards: {
          title: "All services",
          lead: "Pick the area where you need support.",
          ctaLabel: "View details",
        },
        collaboration: {
          title: "How does collaboration work?",
          lead: "We run every project in clear, predictable stages.",
        },
        pricing: {
          title: "Packages and pricing",
          lead: "Sample packages that we tailor to your needs.",
        },
        faq: {
          title: "FAQ",
          lead: "Answers to the most common collaboration questions.",
        },
        cta: {
          title: "Contact",
        },
      },
    },
    detail: {
      panelTitle: "What you get",
      contactLabel: "Contact",
      ctaLabel: "CTA",
    },
    quote: {
      ariaLabel: "Quick quote",
      scrollToQuoteLabel: "Quick quote",
      servicePlaceholder: "Select a service",
      serviceLabel: "Service type",
      budgetLabel: "Budget (PLN)",
      timelineLabel: "Timeline",
      emailLabel: "Email",
      budgetPlaceholder: "e.g. 6000",
      timelinePlaceholder: "e.g. 4 weeks / 06-15",
      emailPlaceholder: "you@email.com",
      errors: {
        serviceRequired: "Select a service from the list.",
        budgetRequired: "Provide an estimated budget.",
        timelineRequired: "Provide the preferred timeline.",
        emailInvalid: "Enter a valid email address.",
        required: "Complete the required fields.",
        status: "Check the required fields and try again.",
      },
      success: {
        toast: "Thank you! We will respond within 24-48h.",
        message: "Thank you! You will receive a reply within 24-48h. (Demo)",
        ctaLabel: "Go to contact",
      },
    },
  },
  caseStudies: {
    index: {
      title: "Case studies",
      lead: "The case studies section is in progress. We will add the list soon.",
      cardTitle: "What is coming",
      cardBullets: [
        "Service-related case studies list",
        "Filters by service type",
        "Detailed process descriptions",
      ],
    },
    meta: {
      detailTitle: "{title} - Case study | KP_Code Digital Vault",
    },
    detail: {
      metaTitle: "Project context",
      serviceLabel: "Service",
      categoryLabel: "Category",
      stepLabel: "Step {index}",
      ctaPrimaryFallback: "Request a quote",
      ctaSecondaryFallback: "Contact",
      sections: {
        goal: {
          title: "Goal",
          lead: "High-level client objective.",
        },
        scope: {
          title: "Scope",
          lead: "Scope of delivered elements.",
        },
        stack: {
          title: "Stack",
          lead: "Tools and components used.",
        },
        process: {
          title: "Process",
          lead: "Collaboration steps, end to end.",
        },
        standards: {
          title: "Standards",
          lead: "Quality and standards applied.",
        },
        security: {
          title: "Security",
          lead: "Core approach to project protection.",
        },
        outcome: {
          title: "Outcome",
          lead: "Delivery outcome.",
        },
        gallery: {
          title: "Gallery",
          lead: "Previews of sections and views.",
        },
        cta: {
          title: "CTA",
        },
      },
    },
  },
};

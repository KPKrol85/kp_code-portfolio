const toAbsolute = (href) => new URL(href, window.location.origin).href;

export const injectBreadcrumbJsonLd = (selector = '.breadcrumbs') => {
  const nav = document.querySelector(selector);
  if (!nav) return;

  const items = Array.from(nav.querySelectorAll('ol > li')).map((item, index, list) => {
    const link = item.querySelector('a');
    const isLast = index === list.length - 1;
    return {
      '@type': 'ListItem',
      position: index + 1,
      name: link ? link.textContent.trim() : item.textContent.trim(),
      ...(link && !isLast ? { item: toAbsolute(link.getAttribute('href')) } : { item: window.location.href }),
    };
  });

  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.textContent = JSON.stringify(
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: items,
    },
    null,
    2
  );
  document.head.appendChild(script);
};

export function initJsonLd() {
  const meta = document.querySelector('meta[name="ld-json"]');
  if (!meta) return;

  const jsonUrl = meta.getAttribute('content');
  if (!jsonUrl) return;

  const injectJsonLd = (payload) => {
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(payload);
    document.head.appendChild(script);
  };

  (async () => {
    try {
      const response = await fetch(jsonUrl, { credentials: 'same-origin' });
      if (!response.ok) return;
      const data = await response.json();

      if (Array.isArray(data)) {
        data.forEach((entry) => injectJsonLd(entry));
      } else if (data && typeof data === 'object') {
        injectJsonLd(data);
      }
    } catch {
      // intentionally silent: JSON-LD is non-critical
    }
  })();
}

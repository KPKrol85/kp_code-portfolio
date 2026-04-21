export function initServiceWorker() {
  const isSourcePreviewRuntime = Boolean(
    document.querySelector('meta[name="kp-code-runtime"][content="source-preview"]')
  );

  // Source preview serves the raw service-worker template, so registration must stay disabled
  // until the built runtime provides the generated worker file.
  if (isSourcePreviewRuntime || !('serviceWorker' in navigator) || !window.isSecureContext) {
    return;
  }

  window.addEventListener(
    'load',
    () => {
      navigator.serviceWorker.register('/service-worker.js').catch((error) => {
        console.error('Service worker registration failed:', error);
      });
    },
    { once: true }
  );
}

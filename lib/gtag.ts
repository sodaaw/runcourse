declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

export function trackEvent(
  action: string,
  params?: Record<string, string | number | boolean | undefined>
) {
  if (typeof window === "undefined" || !window.gtag) return;
  window.gtag("event", action, params);
}

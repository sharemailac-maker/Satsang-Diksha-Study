// Google Analytics 4 (GA4) Helper Service
// Measurement ID: G-9H7HL046NP
// Safe, privacy-preserving tracking without collecting any personal data

export const GA_MEASUREMENT_ID = 'G-9H7HL046NP';

declare global {
  interface Window {
    dataLayer: any[];
    gtag?: (...args: any[]) => void;
  }
}

/**
 * Track virtual page views (e.g., tab switches or modal opens)
 */
export function trackPageView(pageTitle: string, pagePath: string) {
  if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
    try {
      window.gtag('event', 'page_view', {
        page_title: pageTitle,
        page_path: pagePath,
        page_location: window.location.href,
        send_to: GA_MEASUREMENT_ID
      });
    } catch {
      // Ignore errors silently
    }
  }
}

/**
 * Track custom anonymous events (e.g. Shloka Audio Play, Quiz Completion)
 */
export function trackEvent(eventName: string, params: Record<string, any> = {}) {
  if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
    try {
      window.gtag('event', eventName, {
        ...params,
        send_to: GA_MEASUREMENT_ID
      });
    } catch {
      // Ignore errors silently
    }
  }
}

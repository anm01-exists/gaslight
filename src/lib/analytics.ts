// Analytics and performance monitoring utilities

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
    dataLayer?: any[];
  }
}

interface AnalyticsEvent {
  action: string;
  category: string;
  label?: string;
  value?: number;
  custom_parameters?: Record<string, any>;
}

class Analytics {
  private isProduction = import.meta.env.PROD;
  private gaId = import.meta.env.VITE_GOOGLE_ANALYTICS_ID;
  private isInitialized = false;

  constructor() {
    if (this.isProduction && this.gaId) {
      this.initGoogleAnalytics();
    }
  }

  private initGoogleAnalytics() {
    // Load Google Analytics script
    const script = document.createElement("script");
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${this.gaId}`;
    document.head.appendChild(script);

    // Initialize gtag
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () {
      window.dataLayer!.push(arguments);
    };

    window.gtag("js", new Date());
    window.gtag("config", this.gaId, {
      // Enhanced measurement
      page_title: document.title,
      page_location: window.location.href,
      // Privacy-friendly settings
      anonymize_ip: true,
      allow_google_signals: false,
      allow_ad_personalization_signals: false,
    });

    this.isInitialized = true;
  }

  // Track page views
  trackPageView(pagePath?: string, pageTitle?: string) {
    if (!this.isInitialized || !window.gtag) return;

    window.gtag("config", this.gaId, {
      page_path: pagePath || window.location.pathname,
      page_title: pageTitle || document.title,
    });
  }

  // Track custom events
  trackEvent({
    action,
    category,
    label,
    value,
    custom_parameters,
  }: AnalyticsEvent) {
    if (!this.isInitialized || !window.gtag) {
      // Log in development
      if (!this.isProduction) {
        console.log("Analytics Event:", {
          action,
          category,
          label,
          value,
          custom_parameters,
        });
      }
      return;
    }

    window.gtag("event", action, {
      event_category: category,
      event_label: label,
      value: value,
      ...custom_parameters,
    });
  }

  // Track user actions
  trackUserAction(action: string, details?: Record<string, any>) {
    this.trackEvent({
      action,
      category: "user_engagement",
      custom_parameters: details,
    });
  }

  // Track business metrics
  trackBusinessEvent(
    event: string,
    value?: number,
    details?: Record<string, any>,
  ) {
    this.trackEvent({
      action: event,
      category: "business",
      value,
      custom_parameters: details,
    });
  }

  // Track errors
  trackError(error: Error, context?: string) {
    this.trackEvent({
      action: "error_occurred",
      category: "errors",
      label: error.message,
      custom_parameters: {
        error_context: context,
        error_stack: error.stack,
        user_agent: navigator.userAgent,
        page_url: window.location.href,
      },
    });
  }

  // Track performance metrics
  trackPerformance(metric: string, value: number, unit: string = "ms") {
    this.trackEvent({
      action: "performance_metric",
      category: "performance",
      label: metric,
      value: Math.round(value),
      custom_parameters: {
        metric_unit: unit,
      },
    });
  }
}

// Performance monitoring using Web Vitals
export const measureWebVitals = () => {
  if (!import.meta.env.VITE_ENABLE_WEB_VITALS) return;

  // Dynamically import web-vitals to avoid adding to main bundle
  import("web-vitals")
    .then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
      const analytics = new Analytics();

      getCLS((metric) => {
        analytics.trackPerformance("CLS", metric.value, "score");
      });

      getFID((metric) => {
        analytics.trackPerformance("FID", metric.value, "ms");
      });

      getFCP((metric) => {
        analytics.trackPerformance("FCP", metric.value, "ms");
      });

      getLCP((metric) => {
        analytics.trackPerformance("LCP", metric.value, "ms");
      });

      getTTFB((metric) => {
        analytics.trackPerformance("TTFB", metric.value, "ms");
      });
    })
    .catch((error) => {
      console.warn("Failed to load web-vitals:", error);
    });
};

// Custom performance observer
export const observeNavigationTiming = () => {
  if (!window.performance || !window.PerformanceObserver) return;

  const analytics = new Analytics();

  // Observe navigation timing
  const observer = new PerformanceObserver((list) => {
    const entries = list.getEntries();

    entries.forEach((entry) => {
      if (entry.entryType === "navigation") {
        const navigationEntry = entry as PerformanceNavigationTiming;

        // Track key navigation metrics
        analytics.trackPerformance(
          "dom_content_loaded",
          navigationEntry.domContentLoadedEventEnd -
            navigationEntry.navigationStart,
        );
        analytics.trackPerformance(
          "load_complete",
          navigationEntry.loadEventEnd - navigationEntry.navigationStart,
        );
        analytics.trackPerformance(
          "first_byte",
          navigationEntry.responseStart - navigationEntry.navigationStart,
        );
      }
    });
  });

  try {
    observer.observe({ entryTypes: ["navigation"] });
  } catch (error) {
    console.warn("Performance observer not supported:", error);
  }
};

// StudyHub specific event tracking
export const trackStudyHubEvents = {
  // User registration and authentication
  signUp: (method: string) => {
    analytics.trackBusinessEvent("sign_up", undefined, { method });
  },

  signIn: (method: string) => {
    analytics.trackBusinessEvent("sign_in", undefined, { method });
  },

  // Assignment related events
  assignmentPosted: (category: string, budget: number) => {
    analytics.trackBusinessEvent("assignment_posted", budget, { category });
  },

  assignmentViewed: (id: string, category: string) => {
    analytics.trackUserAction("assignment_viewed", {
      assignment_id: id,
      category,
    });
  },

  proposalSubmitted: (assignmentId: string, amount: number) => {
    analytics.trackBusinessEvent("proposal_submitted", amount, {
      assignment_id: assignmentId,
    });
  },

  // Service related events
  serviceViewed: (id: string, category: string) => {
    analytics.trackUserAction("service_viewed", { service_id: id, category });
  },

  serviceBooked: (id: string, amount: number) => {
    analytics.trackBusinessEvent("service_booked", amount, { service_id: id });
  },

  // Resource related events
  resourceDownloaded: (id: string, category: string) => {
    analytics.trackUserAction("resource_downloaded", {
      resource_id: id,
      category,
    });
  },

  resourceUploaded: (category: string, subject: string) => {
    analytics.trackUserAction("resource_uploaded", { category, subject });
  },

  // Communication events
  messagesSent: (count: number = 1) => {
    analytics.trackUserAction("messages_sent", { count });
  },

  conversationStarted: (context: "assignment" | "service" | "general") => {
    analytics.trackUserAction("conversation_started", { context });
  },

  // Search and discovery
  searchPerformed: (query: string, category: string, resultsCount: number) => {
    analytics.trackUserAction("search_performed", {
      search_term: query.length > 50 ? query.substring(0, 50) + "..." : query,
      category,
      results_count: resultsCount,
    });
  },

  // Error tracking
  error: (error: Error, context?: string) => {
    analytics.trackError(error, context);
  },
};

// Initialize analytics
const analytics = new Analytics();

export { analytics };
export default analytics;

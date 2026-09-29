// Type definitions for teckgeekz-consent 3.1.3
// Project: https://github.com/rescue96/teckgeekz-consent
// Maintained by: Teckgeekz (https://teckgeekz.com)

export type ConsentStatus = 'allow' | 'deny' | 'dismiss';

export interface GoogleConsentModePayload {
  analytics_storage: 'granted' | 'denied';
  ad_storage: 'granted' | 'denied';
  ad_user_data: 'granted' | 'denied';
  ad_personalization: 'granted' | 'denied';
  functionality_storage?: 'granted' | 'denied';
  personalization_storage?: 'granted' | 'denied';
  security_storage?: 'granted' | 'denied';
  wait_for_update?: number;
  url_passthrough?: boolean;
  ads_data_redaction?: boolean;
}

export interface GoogleConsentModeOptions {
  /**
   * Default consent state if not previously chosen ('denied' | 'granted'). Defaults to 'denied'.
   */
  defaultState?: 'denied' | 'granted';
  default?: 'denied' | 'granted';

  /**
   * Timeout in milliseconds for Google tags to wait for consent update. Defaults to 500ms.
   */
  waitForUpdate?: number;
  wait_for_update?: number;

  /**
   * Custom GTM event name pushed to window.dataLayer on update. Defaults to 'cookie_consent_update'.
   */
  eventName?: string;

  /**
   * Whether to push the custom event to window.dataLayer. Defaults to true.
   */
  pushEvent?: boolean;

  /**
   * Automatically initializes default consent state if not already set. Defaults to true.
   */
  autoDefault?: boolean;

  /**
   * Enable Google Ads URL passthrough. Defaults to false.
   */
  urlPassthrough?: boolean;
  url_passthrough?: boolean;

  /**
   * Redact ad click identifiers when ad_storage is denied. Defaults to false.
   */
  adsDataRedaction?: boolean;
  ads_data_redaction?: boolean;

  /**
   * Optional initial category mapping.
   */
  categories?: {
    analytics?: boolean;
    marketing?: boolean;
    functionality?: boolean;
    personalization?: boolean;
  };
}

export interface CookiePalette {
  popup?: {
    background?: string;
    text?: string;
    link?: string;
  };
  button?: {
    background?: string;
    text?: string;
    border?: string;
  };
  highlight?: {
    background?: string;
    text?: string;
    border?: string;
  };
}

export interface CookieContentOptions {
  header?: string;
  message?: string;
  dismiss?: string;
  allow?: string;
  deny?: string;
  customize?: string;
  link?: string;
  href?: string;
  close?: string;
  target?: string;
  policy?: string;
}

export interface CookieStorageOptions {
  name?: string;
  path?: string;
  domain?: string;
  expiryDays?: number;
  secure?: boolean;
  sameSite?: 'Lax' | 'Strict' | 'None' | string;
}

export interface CookieModalOptions {
  privacyPolicyUrl?: string;
  href?: string;
  getCookieValue?: (name: string) => string;
  storeConsentRecord?: (analytics: boolean, marketing: boolean) => void;
  updateGtagConsent?: (analyticsState: 'granted' | 'denied', marketingState: 'granted' | 'denied') => void;
  googleConsentMode?: GoogleConsentModeOptions;
  onSave?: (consents: { analytics: boolean; marketing: boolean }) => void;
  onReject?: () => void;
}

export interface CookieModalController {
  element: HTMLElement | null;
  open: () => void;
  close: () => void;
}

export interface CookiePopupOptions {
  enabled?: boolean;
  container?: HTMLElement | null;
  cookie?: CookieStorageOptions;

  type?: 'info' | 'opt-in' | 'opt-out' | 'opt-in-customize' | 'opt-out-customize' | string;
  position?: 'top' | 'bottom' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | string;
  theme?: 'block' | 'classic' | 'edgeless' | 'teckgeekz' | string;
  layout?: 'basic' | 'basic-close' | 'basic-header' | string;
  static?: boolean;

  palette?: CookiePalette | null;

  revokable?: boolean;
  animateRevokable?: boolean;
  showLink?: boolean;

  dismissOnScroll?: number | false;
  dismissOnTimeout?: number | false;
  dismissOnWindowClick?: boolean;
  ignoreClicksFrom?: string[];

  autoOpen?: boolean;
  autoAttach?: boolean;

  whitelistPage?: (string | RegExp)[];
  blacklistPage?: (string | RegExp)[];
  overrideHTML?: string | null;

  /**
   * First-class Google Consent Mode v2 integration.
   * If true or an options object, automatically synchronizes banner choices with window.gtag and window.dataLayer.
   */
  googleConsentMode?: boolean | GoogleConsentModeOptions;

  content?: CookieContentOptions;
  elements?: Record<string, string>;
  compliance?: Record<string, string>;
  layouts?: Record<string, string>;

  onPopupOpen?: (this: CookiePopup) => void;
  onPopupClose?: (this: CookiePopup) => void;
  onInitialise?: (this: CookiePopup, status: ConsentStatus | string) => void;
  onStatusChange?: (this: CookiePopup, status: ConsentStatus | string, chosenBefore: boolean) => void;
  onRevokeChoice?: (this: CookiePopup) => void;
  onNoCookieLaw?: (this: CookiePopup, countryCode: string, country: any) => void;
}

export interface CookiePopup {
  options: CookiePopupOptions | null;
  element: HTMLElement | null;
  revokeBtn: HTMLElement | null;

  initialise(options?: CookiePopupOptions): void;
  open(): CookiePopup;
  close(showRevoke?: boolean): CookiePopup;
  destroy(): void;
  fadeIn(): void;
  fadeOut(): void;
  isOpen(): boolean;
  setStatus(status: ConsentStatus | string): void;
  getStatus(): string | undefined;
  clearStatus(): void;
  revokeChoice(preventOpen?: boolean): void;
  hasAnswered(): boolean;
  hasConsented(): boolean;
  openPreferences(customOptions?: CookieModalOptions): CookieModalController | null;
}

export interface CookieConsent {
  status: {
    deny: 'deny';
    allow: 'allow';
    dismiss: 'dismiss';
  };

  Popup: new (options?: CookiePopupOptions) => CookiePopup;

  initialise(
    options?: CookiePopupOptions,
    complete?: (popup: CookiePopup) => void,
    error?: (err: Error, popup: CookiePopup) => void
  ): void;

  /**
   * Injects and returns the Teckgeekz Granular Cookie Preferences Modal.
   */
  createCookieModal(options?: CookieModalOptions): CookieModalController | null;

  /**
   * Initializes Google Consent Mode v2 default state early (e.g. in <head> before tags load).
   */
  initGoogleConsentMode(options?: GoogleConsentModeOptions): GoogleConsentModePayload | undefined;

  /**
   * Updates Google Consent Mode v2 signals and pushes a standardized event to window.dataLayer.
   */
  updateGoogleConsent(
    consentOrCategories: boolean | string | Record<string, any>,
    options?: GoogleConsentModeOptions
  ): GoogleConsentModePayload | undefined;

  /**
   * Helper that translates a boolean or category object into Google Consent Mode v2 4-signal dictionary.
   */
  getGoogleConsentPayload(
    consentOrCategories: boolean | string | Record<string, any>
  ): GoogleConsentModePayload;

  utils: any;
  hasInitialised?: boolean;
}

declare const cookieconsent: CookieConsent;
export default cookieconsent;

declare global {
  interface Window {
    cookieconsent: CookieConsent;
    dataLayer: any[];
    gtag?: (...args: any[]) => void;
  }
}

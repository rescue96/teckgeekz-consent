# teckgeekz-consent

[![npm version](https://img.shields.io/npm/v/teckgeekz-consent.svg?color=0284c7)](https://www.npmjs.com/package/teckgeekz-consent)
[![jsDelivr](https://data.jsdelivr.com/v1/package/npm/teckgeekz-consent/badge)](https://www.jsdelivr.com/package/npm/teckgeekz-consent)
[![Maintained by: Teckgeekz](https://img.shields.io/badge/Maintained%20by-Teckgeekz-0284c7.svg)](https://teckgeekz.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./licence)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/rescue96/teckgeekz-consent/pulls)

A lightweight, accessible, zero-dependency JavaScript plugin for alerting users about cookie usage and managing privacy compliance on modern websites. Available on [npm (teckgeekz-consent)](https://www.npmjs.com/package/teckgeekz-consent) and global CDNs.

Maintained and enhanced by **[Teckgeekz](https://teckgeekz.com)**. This project is a maintained fork of [Osano Cookie Consent](https://github.com/osano/cookieconsent) (originally developed by Silktide / Insites), modernized with robust tooling, full keyboard and ARIA accessibility, Google Consent Mode v2 support, and zero-leak lifecycle management for modern web frameworks.

---

## Table of Contents

- [Why This Fork?](#why-this-fork)
- [Features](#features)
- [Installation](#installation)
- [Quick Start](#quick-start)
- [Interactive Examples Suite](#interactive-examples-suite)
- [Compliance Modes & Recipes](#compliance-modes--recipes)
  - [1. Informational Banner (Default)](#1-informational-banner-default)
  - [2. Opt-In Mode (GDPR / Google Consent Mode v2)](#2-opt-in-mode-gdpr--google-consent-mode-v2)
  - [3. Opt-Out Mode (CCPA / US Compliance)](#3-opt-out-mode-ccpa--us-compliance)
  - [4. Next.js / React Integration](#4-nextjs--react-integration)
  - [5. Teckgeekz Theme & Granular Preferences Modal](#5-teckgeekz-theme--granular-preferences-modal)
- [JavaScript API Reference](#javascript-api-reference)
  - [Initialization](#initialization)
  - [Popup Instance Methods](#popup-instance-methods)
  - [Teckgeekz Cookie Preferences Modal API](#teckgeekz-cookie-preferences-modal-api)
  - [Google Consent Mode v2 API](#google-consent-mode-v2-api)
  - [Status Constants](#status-constants)
- [Configuration Options](#configuration-options)
  - [General Settings](#general-settings)
  - [Palette & Styling](#palette--styling)
  - [Content & Copywriting](#content--copywriting)
  - [Cookie Storage](#cookie-storage)
  - [Lifecycle Callbacks](#lifecycle-callbacks)
  - [Location & Regional Law](#location--regional-law)
- [CSS Classes & Custom Styling](#css-classes--custom-styling)
- [Development & Testing](#development--testing)
- [About Teckgeekz & Acknowledgements](#about-teckgeekz--acknowledgements)
- [License](#license)

---

## Why This Fork?

The original Osano/Silktide Cookie Consent v3 has been one of the most widely adopted open-source cookie solutions on the web. However, upstream maintenance has slowed down, and modern development standards have evolved.

Key enhancements in `teckgeekz-consent`:
- **Updated Tooling & Pipeline**: Upgraded to modern Gulp 4, Terser, Autoprefixer, and Clean-CSS pipelines.
- **Enhanced Accessibility & SEO**: Accessible ARIA roles (`role="dialog"`, `aria-label`, `aria-describedby`, keyboard navigation) and Googlebot exclusion tags (`<!--googleoff: all-->`).
- **Secure Link Handling**: Out-of-the-box `rel="noopener noreferrer nofollow"` attributes on policy links.
- **Framework-Friendly**: Clean lifecycle methods (`open`, `close`, `destroy`) for seamless mounting/unmounting in Single-Page Applications (Next.js, React, Vue, Svelte).
- **Teckgeekz Granular Modal**: Built-in interactive category modal (Essential, Analytics, Marketing) with zero external dependencies.

---

## Features

- **⚡ Zero External Dependencies**: Pure vanilla JavaScript and modular CSS.
- **🛡️ 3+ Compliance Levels**: Simple notice (`info`), prior consent required (`opt-in`), opt-out consent (`opt-out`), and granular customization (`opt-in-customize`).
- **✨ Flagship `teckgeekz` Theme & Preferences Modal**: Premium dark glassmorphic UI paired with an accessible category preferences modal for Essential, Analytics, and Marketing cookies, automatic GDPR audit log generation, and Google Consent Mode v2 sync.
- **🌍 Geolocation Support**: Automatically adapt banner behavior based on the visitor's country (e.g. strict opt-in in the EU, dismissible in non-regulated regions).
- **🎨 Flexible UI & Themes**: Built-in positions (`top`, `bottom`, `floating`), layouts (`basic`, `basic-close`, `basic-header`), and themes (`block`, `classic`, `edgeless`, `teckgeekz`).
- **🔄 Lifecycle Hooks**: Granular callbacks for banner open, close, status change, and consent revocation.
- **🔁 Revoke Consent Option**: Optional floating tab allowing users to change their consent choices at any time.

---

## Installation

### Option 1: Direct CDN Inclusion (Fastest, zero build setup)

Add the stylesheet to your `<head>` and the script before your closing `</body>` tag. Powered by global, ultra-fast CDNs:

#### Via jsDelivr (Recommended)
```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/teckgeekz-consent@3.1.8/build/cookieconsent.min.css" />
<script src="https://cdn.jsdelivr.net/npm/teckgeekz-consent@3.1.8/build/cookieconsent.min.js"></script>
```

#### Via unpkg
```html
<link rel="stylesheet" href="https://unpkg.com/teckgeekz-consent@3.1.8/build/cookieconsent.min.css" />
<script src="https://unpkg.com/teckgeekz-consent@3.1.8/build/cookieconsent.min.js"></script>
```

---

### Option 2: Package Managers (NPM, Yarn, pnpm)

For modern web frameworks (Next.js, React, Vue, Vite, Nuxt, Webpack):

```bash
npm install teckgeekz-consent
# or
yarn add teckgeekz-consent
# or
pnpm add teckgeekz-consent
```

Import into your JavaScript / TypeScript files:

```javascript
import 'teckgeekz-consent/build/cookieconsent.min.css';
import cookieconsent from 'teckgeekz-consent';
```

*(Full TypeScript types are included out of the box via `index.d.ts`).*

---

### Option 3: Local / Self-Hosted Assets

If self-hosting the distribution assets:

```html
<link rel="stylesheet" href="/path/to/cookieconsent.min.css" />
<script src="/path/to/cookieconsent.min.js"></script>
```

---

## Quick Start

Initialize the banner once the DOM is ready:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>My Website</title>
  <link rel="stylesheet" href="build/cookieconsent.min.css">
</head>
<body>

  <script src="build/cookieconsent.min.js"></script>
  <script>
    window.cookieconsent.initialise({
      palette: {
        popup: { background: "#1f2937", text: "#f9fafb" },
        button: { background: "#3b82f6", text: "#ffffff" }
      },
      content: {
        message: "We use cookies to improve your browsing experience.",
        dismiss: "Got it!",
        link: "Privacy Policy",
        href: "/privacy-policy"
      }
    });
  </script>
</body>
</html>
```

---

## Interactive Examples Suite

The repository includes a complete interactive test and demonstration suite located in the [`examples/`](./examples) directory. It walks through every compliance scenario, styling option, and JavaScript integration step-by-step.

### Running Examples Locally

To launch the interactive demos in your browser:

```bash
# Serve the repository root via any static server, e.g.:
npx serve .
# Or with Python:
python -m http.server 8080
```

Then navigate to: **`http://localhost:3000/examples/`** (or port 8080) to access the Master Showcase.

### Demo Directory Breakdown

| Demo | File | Implementation Step & Scenario |
| :--- | :--- | :--- |
| **Index** | [`examples/index.html`](./examples/index.html) | **Master Showcase & Guide**: Complete overview with direct links to all interactive demos. |
| **Demo 1** | [`examples/example-1-themes.html`](./examples/example-1-themes.html) | **Built-in Themes & Palettes**: Live switcher testing Honeybee, Blurple, Mono, Nuclear, Cosmo, Neon, and Corporate themes. |
| **Demo 2** | [`examples/example-2-custom-theme.html`](./examples/example-2-custom-theme.html) | **Custom CSS Overrides**: Shows how to target `.cc-window`, `.cc-btn`, and `.cc-message` with custom stylesheets. |
| **Demo 3** | [`examples/example-3-informational.html`](./examples/example-3-informational.html) | **Informational Mode (`info`)**: The simplest compliance level with a single acknowledgement button. |
| **Demo 4** | [`examples/example-4-opt-out.html`](./examples/example-4-opt-out.html) | **Opt-Out Mode (`opt-out`)**: Implied consent where cookies are allowed unless user declines; includes revoke tab. |
| **Demo 5** | [`examples/example-5-opt-in.html`](./examples/example-5-opt-in.html) | **Opt-In Mode (`opt-in`)**: Explicit consent required before setting cookies; strict GDPR/ePrivacy compliant. |
| **Demo 6** | [`examples/example-6-location.html`](./examples/example-6-location.html) | **Geolocation & Regional Law**: Automatically tests and demonstrates how cookie law varies by country (US, UK, DE, ES, BE, etc.). |
| **Demo 7** | [`examples/example-7-javascript-api.html`](./examples/example-7-javascript-api.html) | **JavaScript API & Verification**: Interactive playground for `open()`, `close()`, `destroy()`, `setStatus()`, `hasConsented()`, and `hasAnswered()`. |
| **Demo 8** | [`examples/example-8-google-consent-mode.html`](./examples/example-8-google-consent-mode.html) | **Google Consent Mode v2 & GTM**: Live integration updating Google Analytics & Ads consent signals and pushing dataLayer events. |
| **Demo 9** | [`examples/example-9-teckgeekz-theme.html`](./examples/example-9-teckgeekz-theme.html) | **Teckgeekz Theme & Preferences Modal**: Flagship dark glassmorphic banner with integrated granular consent modal (Essential, Analytics, Marketing), audit logging, and live status dashboard. |

---

## Compliance Modes & Recipes

### 1. Informational Banner (Default)
Displays a standard notice with a single acknowledgement button.

```javascript
window.cookieconsent.initialise({
  type: 'info',
  position: 'bottom',
  palette: {
    popup: { background: '#222' },
    button: { background: '#f1d600', text: '#000' }
  },
  content: {
    message: 'This website uses cookies to ensure you get the best experience.',
    dismiss: 'Understood',
    href: '/privacy'
  }
});
```

---

### 2. Opt-In Mode with Native Google Consent Mode v2

`teckgeekz-consent` provides **first-class, native support for Google Consent Mode v2**. When `googleConsentMode: true` is enabled, the package automatically manages:
- All 4 required Google Consent Mode v2 signals: `analytics_storage`, `ad_storage`, `ad_user_data`, and `ad_personalization`.
- Real-time `gtag('consent', 'update', ...)` calls on user action (`Accept All`, `Decline`, or `Revoke`).
- Automatic dispatch of standardized `cookie_consent_update` events on `window.dataLayer` so Google Tag Manager (GTM) triggers can fire tags dynamically.

#### Step A: Initialize Default Consent in `<head>` (Before Google / GTM tags load)

```html
<head>
  <!-- Initialize default consent state early (wait_for_update: 500ms) -->
  <!-- Via jsDelivr CDN (or local node_modules / build path) -->
  <script src="https://cdn.jsdelivr.net/npm/teckgeekz-consent@3.1.8/build/cookieconsent.min.js"></script>
  <script>
    // Sets ad_storage, analytics_storage, ad_user_data, and ad_personalization to 'denied'
    window.cookieconsent.initGoogleConsentMode({
      defaultState: 'denied',
      waitForUpdate: 500
    });
  </script>

  <!-- Google Tag Manager / GA4 Container follows -->
  <script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
  new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
  j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
  'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
  })(window,document,'script','dataLayer','GTM-XXXXXXX');</script>
</head>
```

#### Step B: Initialize the Banner with Zero-Boilerplate Consent Mode Sync

```javascript
window.cookieconsent.initialise({
  type: 'opt-in',
  position: 'bottom',
  revokable: true,
  // Native Google Consent Mode v2 integration:
  googleConsentMode: {
    autoUpdate: true,                  // Automatically fires gtag updates on accept/deny/revoke
    eventName: 'cookie_consent_update' // Pushes custom event to window.dataLayer
  },
  palette: {
    popup: { background: '#0f172a', text: '#e2e8f0' },
    button: { background: '#38bdf8', text: '#0f172a' }
  },
  content: {
    message: 'We require your consent before setting analytics and advertising cookies.',
    allow: 'Accept All',
    deny: 'Decline',
    link: 'Cookie Policy',
    href: '/cookie-policy'
  }
});
```

> [!TIP]
> In Google Tag Manager, configure your GA4 and Google Ads tags to trigger on the Custom Event: **`cookie_consent_update`** when `consent_status = allow`.

---

### 3. Opt-Out Mode (CCPA / US Compliance)
Cookies are considered allowed unless the user explicitly declines.

```javascript
window.cookieconsent.initialise({
  type: 'opt-out',
  position: 'bottom-left',
  palette: {
    popup: { background: '#252e39', text: '#ffffff' },
    button: { background: '#14a7d0' }
  },
  content: {
    message: 'We use cookies for analytics and advertising.',
    dismiss: 'Allow',
    deny: 'Opt Out',
    link: 'Do Not Sell My Info',
    href: '/privacy'
  },
  onStatusChange: function (status) {
    if (status === window.cookieconsent.status.deny) {
      // Disable marketing cookies / opt out user
      disableTracking();
    }
  }
});
```

---

### 4. Next.js / React Integration

When using Next.js (App Router or Pages Router) or React, load the script and manage cleanup gracefully:

```tsx
'use client';

import { useEffect, useRef } from 'react';
import Script from 'next/script';
import 'teckgeekz-consent/build/cookieconsent.min.css';

export function CookieBanner() {
  const popupRef = useRef<any>(null);

  const initConsent = () => {
    if (typeof window === 'undefined' || !(window as any).cookieconsent) return;

    (window as any).cookieconsent.initialise({
      type: 'opt-in',
      position: 'bottom',
      palette: {
        popup: { background: '#18181b', text: '#fafafa' },
        button: { background: '#2563eb', text: '#ffffff' },
      },
      content: {
        message: 'This site uses cookies to enhance user experience.',
        allow: 'Accept',
        deny: 'Decline',
        link: 'Learn more',
        href: '/privacy-policy',
      },
      onStatusChange: (status: string) => {
        // Handle consent update
      }
    }, (popup: any) => {
      popupRef.current = popup;
    });
  };

  useEffect(() => {
    return () => {
      if (popupRef.current && typeof popupRef.current.destroy === 'function') {
        try {
          popupRef.current.destroy();
        } catch (e) {
          // Cleanup error handling
        }
      }
    };
  }, []);

  return (
    <Script
      src="/build/cookieconsent.min.js"
      strategy="afterInteractive"
      onLoad={initConsent}
    />
  );
}
```

---

### 5. Teckgeekz Theme & Granular Preferences Modal

The `teckgeekz` theme provides a sleek, dark-mode glassmorphic design paired with an interactive multi-category preferences modal for GDPR and ePrivacy compliance.

```html
<!-- Via jsDelivr CDN (or local build path) -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/teckgeekz-consent@3.1.8/build/cookieconsent.min.css">
<script src="https://cdn.jsdelivr.net/npm/teckgeekz-consent@3.1.8/build/cookieconsent.min.js"></script>

<script>
  window.cookieconsent.initialise({
    theme: 'teckgeekz',
    position: 'bottom',
    type: 'opt-in-customize', // Renders Reject All, Customize, and Accept All buttons
    content: {
      message: 'We use cookies to enhance your experience, analyze site usage, and support our marketing efforts.',
      allow: 'Accept All',
      deny: 'Reject All',
      customize: 'Cookie Settings',
      link: 'Privacy Policy',
      href: 'https://teckgeekz.com/privacy-policy'
    }
  }, function(popup) {
    // Access popup instance or open modal on demand:
    // popup.openPreferences();
  });
</script>
```

When visitors click the **Cookie Settings** button or invoke `popup.openPreferences()` / `cookieconsent.createCookieModal().open()`, a modal opens allowing them to configure granular categories:
- **Essential Cookies**: Strictly necessary for core website functionality (always locked on).
- **Analytics Cookies**: Measures site performance and user navigation.
- **Marketing Cookies**: Powers retargeting, ads, and campaign tracking.

Saving or rejecting preferences automatically updates `analytics` and `marketing` cookies (`SameSite=Strict`), logs GDPR audit records via `storeConsentRecord()`, and updates `gtag('consent', 'update', ...)` signals in real-time.

---

## JavaScript API Reference

### Initialization

```javascript
window.cookieconsent.initialise(options, onSuccess, onError);
```

- `options` *(Object)*: Configuration object (see [Configuration Options](#configuration-options)).
- `onSuccess` *(Function)*: Callback receiving `popup` instance once initialized: `function(popup) {}`.
- `onError` *(Function)*: Callback receiving `error, popup` if initialization fails.

### Popup Instance Methods

The instance returned by `initialise` provides the following methods:

| Method | Parameters | Description |
| :--- | :--- | :--- |
| `popup.open()` | None | Displays the banner dialog. |
| `popup.close(showRevoke)` | `showRevoke?: boolean` | Hides the banner dialog. If `showRevoke` is true and revokable is enabled, displays the revoke button. |
| `popup.destroy()` | None | Removes all banner DOM elements, listeners, and custom style tags. |
| `popup.fadeIn()` | None | Animates the banner into view. |
| `popup.fadeOut()` | None | Animates the banner out of view. |
| `popup.isOpen()` | None | Returns `true` if the banner is currently visible. |
| `popup.setStatus(status)` | `status: string` | Sets the consent status cookie (e.g. `'allow'`, `'deny'`, `'dismiss'`). |
| `popup.getStatus()` | None | Retrieves the current cookie consent status string. |
| `popup.clearStatus()` | None | Clears the stored cookie consent status cookie. |
| `popup.revokeChoice(preventOpen)` | `preventOpen?: boolean` | Clears stored consent and reopens the banner dialog (unless `preventOpen` is `true`). |
| `popup.openPreferences(options)` | `options?: object` | Opens the Teckgeekz granular cookie preferences modal (Essential, Analytics, Marketing). |
| `popup.hasAnswered()` | None | Returns `true` if the user has previously answered the prompt. |
| `popup.hasConsented()` | None | Returns `true` if consent is considered granted under current type (`opt-in`, `opt-out`, `info`). |

### Teckgeekz Cookie Preferences Modal API

`teckgeekz-consent` includes an integrated, zero-dependency modal controller for managing multi-category cookie preferences:

```javascript
// Create or retrieve the preferences modal controller
const modal = window.cookieconsent.createCookieModal({
  privacyPolicyUrl: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Cookies',
  cookie: {
    domain: '',         // Optional cookie domain (e.g. '.example.com')
    path: '/',          // Path scope (default: '/')
    expiryDays: 365,    // Expiry in days (default: 365)
    sameSite: 'Lax'     // 'Lax' | 'Strict' | 'None'
  },
  onOpen: function() {
    console.log('Preferences modal opened');
  },
  onClose: function() {
    console.log('Preferences modal closed');
  },
  onSave: function(consents) {
    console.log('Preferences saved:', consents);
    // e.g. { analytics: true, marketing: false }
  },
  onReject: function() {
    console.log('Non-essential cookies rejected');
  },
  storeConsentRecord: function(analytics, marketing) {
    // Custom audit recorder (defaults to localStorage JSON audit log)
  },
  updateGtagConsent: function(analyticsState, marketingState) {
    // Custom Google Consent Mode updater (defaults to window.gtag update)
  }
});

// Programmatic controls:
modal.open();    // Opens the preferences modal and syncs current category cookie states
modal.close();   // Hides the preferences modal
modal.destroy(); // Completely cleans up modal element and event listeners from DOM
```

### Google Consent Mode v2 API

The package exposes standalone utilities for configuring and updating Google Consent Mode v2 signals directly:

#### `cookieconsent.initGoogleConsentMode(options)`
Sets the `default` consent state for all 4 v2 signals. Call this early in `<head>` before Google/GTM tags load.

```javascript
window.cookieconsent.initGoogleConsentMode({
  defaultState: 'denied',   // 'denied' | 'granted' (default: 'denied')
  waitForUpdate: 500,       // wait_for_update timeout in ms (default: 500)
  urlPassthrough: false,    // Optional Google Ads URL passthrough
  adsDataRedaction: false   // Optional redaction of ad click identifiers
});
```

#### `cookieconsent.updateGoogleConsent(consentOrCategories, options)`
Updates Google Consent Mode v2 signals and automatically pushes an event to `window.dataLayer`.

```javascript
// Update all signals at once:
window.cookieconsent.updateGoogleConsent('granted'); // or 'denied'

// Or update granular categories:
window.cookieconsent.updateGoogleConsent({
  analytics: true,   // sets analytics_storage: 'granted'
  marketing: false   // sets ad_storage, ad_user_data, and ad_personalization: 'denied'
}, {
  eventName: 'cookie_consent_update' // Pushes to window.dataLayer
});
```

#### `cookieconsent.getGoogleConsentPayload(consentOrCategories)`
Helper returning the normalized 4-signal v2 dictionary:
`{ analytics_storage: 'granted', ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied' }`.

### Status Constants

```javascript
window.cookieconsent.status = {
  deny: 'deny',       // User declined cookies
  allow: 'allow',     // User consented to cookies
  dismiss: 'dismiss'  // User dismissed notice / acknowledged
};
```

---

## Configuration Options

### General Settings

| Option | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `type` | `string` | `'info'` | Compliance type: `'info'`, `'opt-in'`, `'opt-out'`, `'opt-in-customize'`, or `'opt-out-customize'`. |
| `position` | `string` | `'bottom'` | Position: `'bottom'`, `'top'`, `'top-left'`, `'top-right'`, `'bottom-left'`, `'bottom-right'`. |
| `theme` | `string` | `'block'` | Built-in theme: `'block'`, `'classic'`, `'edgeless'`, or `'teckgeekz'`. |
| `layout` | `string` | `'basic'` | Layout template: `'basic'`, `'basic-close'`, `'basic-header'`. |
| `googleConsentMode` | `boolean \| object` | `false` | First-class Google Consent Mode v2 integration. Automatically synchronizes all 4 v2 signals (`analytics_storage`, `ad_storage`, `ad_user_data`, `ad_personalization`) and pushes GTM `cookie_consent_update` events on accept/deny/revoke. |
| `static` | `boolean` | `false` | If `true`, renders statically within page flow instead of fixed positioning. |
| `autoOpen` | `boolean` | `true` | Whether to automatically show the banner when unhandled. |
| `autoAttach` | `boolean` | `true` | Automatically appends element to `container`. |
| `container` | `HTMLElement` | `document.body` | DOM element where the banner is appended. |
| `revokable` | `boolean` | `false` | Enables a persistent button allowing users to revoke or change consent. |
| `animateRevokable` | `boolean` | `true` | Animates the revoke button entrance/exit. |
| `dismissOnScroll` | `number \| boolean` | `false` | Number of pixels scrolled before automatically dismissing. |
| `dismissOnTimeout` | `number \| boolean` | `false` | Milliseconds before automatically dismissing. |
| `dismissOnWindowClick` | `boolean` | `false` | Dismisses banner when user clicks anywhere on the page. |
| `ignoreClicksFrom` | `string[]` | `['cc-revoke', 'cc-btn']` | Classes that will not trigger `dismissOnWindowClick`. |
| `whitelistPage` | `(string \| RegExp)[]` | `[]` | Pages where the banner MUST show. |
| `blacklistPage` | `(string \| RegExp)[]` | `[]` | Pages where the banner MUST NOT show. |

### Palette & Styling

```javascript
palette: {
  popup: {
    background: '#1e293b',
    text: '#ffffff',
    link: '#38bdf8'
  },
  button: {
    background: '#38bdf8',
    text: '#0f172a',
    border: 'transparent'
  },
  highlight: { // Optional styling for primary action button
    background: '#0284c7',
    text: '#ffffff',
    border: 'transparent'
  }
}
```

### Content & Copywriting

```javascript
content: {
  header: 'Cookies used on the website!',
  message: 'This website uses cookies to ensure you get the best experience.',
  dismiss: 'Got it!',
  allow: 'Allow cookies',
  deny: 'Decline',
  customize: 'Customize', // Used in opt-in-customize / opt-out-customize compliance types
  link: 'Learn more',
  href: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Cookies',
  close: '&#x274c;',
  target: '_blank',
  policy: 'Cookie Policy'
}
```

### Cookie Storage

| Option | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `cookie.name` | `string` | `'cookieconsent_status'` | Name of the cookie storing user consent. |
| `cookie.path` | `string` | `'/'` | URL path scope for the consent cookie. |
| `cookie.domain` | `string` | `''` | Domain for the consent cookie (e.g. `'.example.com'`). |
| `cookie.expiryDays`| `number` | `365` | Number of days until cookie expiration (`-1` for session). |
| `cookie.secure` | `boolean` | `false` | Enables `Secure` flag (HTTPS only; auto-enabled if `sameSite: 'None'`). |
| `cookie.sameSite` | `string` | `'Lax'` | SameSite cookie policy attribute: `'Lax'`, `'Strict'`, or `'None'`. |

### Lifecycle Callbacks

| Callback | Parameters | Description |
| :--- | :--- | :--- |
| `onInitialise(status)` | `status: string` | Triggered when the component initializes with current consent status. |
| `onPopupOpen()` | None | Triggered when the popup opens. |
| `onPopupClose()` | None | Triggered when the popup closes. |
| `onStatusChange(status, chosenBefore)` | `status, chosenBefore` | Triggered when user selects a choice or status changes. |
| `onRevokeChoice()` | None | Triggered when user revokes their choice. |
| `onNoCookieLaw(countryCode, country)` | `countryCode, country` | Triggered when visitor's country has no applicable cookie laws. |

### Location & Regional Law

Automatically tailor compliance based on user location:

```javascript
window.cookieconsent.initialise({
  law: {
    regionalLaw: true // Adjust revokable & explicitAction automatically
  },
  location: {
    timeout: 5000,
    services: ['ipinfo']
  }
});
```

---

## CSS Classes & Custom Styling

All components are prefixed with `cc-` to prevent collisions with your stylesheets:

- `.cc-window`: The main banner container.
- `.cc-banner`: Applied when position is `'top'` or `'bottom'`.
- `.cc-floating`: Applied when positioned in corners (e.g. `'bottom-left'`).
- `.cc-message`: Container for explanatory message and policy link.
- `.cc-compliance`: Button container group.
- `.cc-btn`: Base class for buttons.
- `.cc-allow`: "Accept / Allow" button.
- `.cc-deny`: "Decline / Deny" button.
- `.cc-dismiss`: "Got it / Dismiss" button.
- `.cc-revoke`: Floating "Change preferences / Revoke" button.
- `.cc-theme-classic`, `.cc-theme-edgeless`: Theme modifier classes.

You can easily override styles in your CSS:

```css
.cc-window.cc-banner {
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  font-family: inherit;
}

.cc-btn {
  border-radius: 8px;
  font-weight: 600;
  transition: all 0.2s ease-in-out;
}
```

---

## Development & Building

### Prerequisites

- Node.js (v14+)
- npm or yarn

### Setup

```bash
# Clone the repository
git clone https://github.com/rescue96/teckgeekz-consent.git
cd teckgeekz-consent

# Install dependencies
npm install
```

### Build Commands

```bash
# Run automated unit and integration tests
npm test

# Compile and minify both JS and CSS into /build
npm run build

# Verify build output matches expected distribution
npm run verify

# Build release tag
npm run build:release --tag=3.1.8
```

---

## Development & Testing

### Running Tests

We provide automated unit and integration tests covering cookie handling, `SameSite` compliance, DOM creation, listener unbinding, keyboard accessibility, and custom cookie names:

```bash
npm test
```

### Building From Source

```bash
# Clean, compile, and minify JS and CSS into /build
npm run build

# Verify build output matches expected distribution
npm run verify

# Build release tag with automated version bump
npm run build:release --tag=3.1.8
```

---

## About Teckgeekz & Acknowledgements

### Maintained by Teckgeekz

This project is maintained, optimized, and enhanced by **[Teckgeekz](https://teckgeekz.com)**.

[Teckgeekz](https://teckgeekz.com) is a high-end digital agency specializing in:
- **Performance Web Development**: Building ultra-fast, accessible, and compliant web applications using Next.js, React, and modern web architectures.
- **Data Privacy & Analytics**: Implementing robust Google Consent Mode v2, Google Tag Manager, and server-side tracking solutions that respect user privacy and adhere to GDPR/CCPA regulations.
- **Digital Marketing & Growth**: Strategic Search Engine Optimization (SEO), PPC campaign management, and conversion rate optimization (CRO).

For business inquiries, custom implementation support, or technical consulting, visit **[teckgeekz.com](https://teckgeekz.com)**.

### Upstream & Technology Acknowledgements

- **Silktide Ltd**: Original author and creator of the open-source Cookie Consent library (v1 - v3).
- **Osano, Inc.**: Subsequent steward and maintainer of Cookie Consent v3.
- **Google Consent Mode v2**: Integration protocols and specifications defined by Google for global privacy compliance.
- **MDN Web Docs (Mozilla)**: Educational and reference documentation for HTTP Cookies and Web Storage security guidelines.
- All open-source contributors who have contributed fixes and translations over the years.

---

## Compliance & Industry Standards Audit

`teckgeekz-consent` v3.1.8 has undergone an independent open-source regulatory and technical audit, achieving an overall compliance score of **Grade A (93.4/100)** across GDPR, ePrivacy, Google Consent Mode v2, CCPA/CPRA, and WCAG AA standards.

Read the full evaluation in the [Compliance Audit Report](./COMPLIANCE_REPORT.md).

---

## License

This project is open-source software licensed under the [MIT License](./LICENSE.md). You are free to use, modify, distribute, and embed it in commercial and personal projects. See [LICENSE.md](./LICENSE.md) (or [licence](./licence)) for the full multi-generation license text and technology credits.

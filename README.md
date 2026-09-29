# teckgeekz-consent

[![npm version](https://img.shields.io/badge/version-3.1.2-blue.svg)](https://github.com/rescue96/teckgeekz-consent)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./licence)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/rescue96/teckgeekz-consent/pulls)

A lightweight, accessible, zero-dependency JavaScript plugin for alerting users about cookie usage and managing privacy compliance on modern websites.

This project is a maintained fork of [Osano Cookie Consent](https://github.com/osano/cookieconsent) (originally developed by Silktide / Insites), updated with modernized tooling, improved accessibility, security-conscious defaults, and enhanced compatibility for modern web frameworks.

---

## Table of Contents

- [Why This Fork?](#why-this-fork)
- [Features](#features)
- [Installation](#installation)
- [Quick Start](#quick-start)
- [Compliance Modes & Recipes](#compliance-modes--recipes)
  - [1. Informational Banner (Default)](#1-informational-banner-default)
  - [2. Opt-In Mode (GDPR / Google Consent Mode v2)](#2-opt-in-mode-gdpr--google-consent-mode-v2)
  - [3. Opt-Out Mode (CCPA / US Compliance)](#3-opt-out-mode-ccpa--us-compliance)
  - [4. Next.js / React Integration](#4-nextjs--react-integration)
- [JavaScript API Reference](#javascript-api-reference)
  - [Initialization](#initialization)
  - [Popup Instance Methods](#popup-instance-methods)
  - [Status Constants](#status-constants)
- [Configuration Options](#configuration-options)
  - [General Settings](#general-settings)
  - [Palette & Styling](#palette--styling)
  - [Content & Copywriting](#content--copywriting)
  - [Cookie Storage](#cookie-storage)
  - [Lifecycle Callbacks](#lifecycle-callbacks)
  - [Location & Regional Law](#location--regional-law)
- [CSS Classes & Custom Styling](#css-classes--custom-styling)
- [Development & Building](#development--building)
- [Changelog](#changelog)
- [License & Acknowledgements](#license--acknowledgements)

---

## Why This Fork?

The original Osano/Silktide Cookie Consent v3 has been one of the most widely adopted open-source cookie solutions on the web. However, upstream maintenance has slowed down, and modern development standards have evolved.

Key enhancements in `teckgeekz-consent`:
- **Updated Tooling & Pipeline**: Upgraded to modern Gulp 4, Terser, Autoprefixer, and Clean-CSS pipelines.
- **Enhanced Accessibility & SEO**: Accessible ARIA roles (`role="dialog"`, `aria-label`, `aria-describedby`, keyboard navigation) and Googlebot exclusion tags (`<!--googleoff: all-->`).
- **Secure Link Handling**: Out-of-the-box `rel="noopener noreferrer nofollow"` attributes on policy links.
- **Framework-Friendly**: Clean lifecycle methods (`open`, `close`, `destroy`) for seamless mounting/unmounting in Single-Page Applications (Next.js, React, Vue, Svelte).

---

## Features

- **⚡ Zero External Dependencies**: Pure vanilla JavaScript and modular CSS.
- **🛡️ 3 Compliance Levels**: Simple notice (`info`), prior consent required (`opt-in`), or opt-out consent (`opt-out`).
- **🌍 Geolocation Support**: Automatically adapt banner behavior based on the visitor's country (e.g. strict opt-in in the EU, dismissible in non-regulated regions).
- **🎨 Flexible UI & Themes**: Built-in positions (`top`, `bottom`, `floating`), layouts (`basic`, `basic-close`, `basic-header`), and themes (`block`, `classic`, `edgeless`).
- **🔄 Lifecycle Hooks**: Granular callbacks for banner open, close, status change, and consent revocation.
- **🔁 Revoke Consent Option**: Optional floating tab allowing users to change their consent choices at any time.

---

## Installation

### Via npm or Yarn

```bash
npm install teckgeekz-consent
# or
yarn add teckgeekz-consent
```

### Direct Script / Stylesheet Inclusion

Include the compiled CSS in your `<head>` and the JS before the closing `</body>` tag:

```html
<link rel="stylesheet" href="node_modules/teckgeekz-consent/build/cookieconsent.min.css" />
<script src="node_modules/teckgeekz-consent/build/cookieconsent.min.js"></script>
```

*(Or reference your self-hosted or CDN assets).*

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

### 2. Opt-In Mode (GDPR / Google Consent Mode v2)
Requires users to explicitly opt in before cookies or tracking scripts can fire.

```javascript
window.cookieconsent.initialise({
  type: 'opt-in',
  position: 'bottom',
  revokable: true,
  palette: {
    popup: { background: '#0f172a', text: '#e2e8f0' },
    button: { background: '#10b981', text: '#ffffff' }
  },
  content: {
    message: 'We require your consent before setting non-essential cookies.',
    allow: 'Accept All',
    deny: 'Decline',
    link: 'Cookie Policy',
    href: '/cookie-policy'
  },
  onInitialise: function (status) {
    var type = this.options.type;
    var didConsent = this.hasConsented();
    if (type === 'opt-in' && didConsent) {
      enableTracking();
    }
  },
  onStatusChange: function (status, chosenBefore) {
    var type = this.options.type;
    var didConsent = this.hasConsented();
    if (type === 'opt-in' && didConsent) {
      enableTracking();
    } else {
      disableTracking();
    }
  },
  onRevokeChoice: function () {
    disableTracking();
  }
});

function enableTracking() {
  // Update Google Consent Mode v2
  if (typeof window.gtag === 'function') {
    window.gtag('consent', 'update', {
      'analytics_storage': 'granted',
      'ad_storage': 'granted'
    });
  }
  // Push custom event to GTM
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event: 'consent_granted' });
}

function disableTracking() {
  if (typeof window.gtag === 'function') {
    window.gtag('consent', 'update', {
      'analytics_storage': 'denied',
      'ad_storage': 'denied'
    });
  }
}
```

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
| `popup.hasAnswered()` | None | Returns `true` if the user has previously answered the prompt. |
| `popup.hasConsented()` | None | Returns `true` if consent is considered granted under current type (`opt-in`, `opt-out`, `info`). |

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
| `type` | `string` | `'info'` | Compliance type: `'info'`, `'opt-in'`, or `'opt-out'`. |
| `position` | `string` | `'bottom'` | Position: `'bottom'`, `'top'`, `'top-left'`, `'top-right'`, `'bottom-left'`, `'bottom-right'`. |
| `theme` | `string` | `'block'` | Built-in theme: `'block'`, `'classic'`, or `'edgeless'`. |
| `layout` | `string` | `'basic'` | Layout template: `'basic'`, `'basic-close'`, `'basic-header'`. |
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
  link: 'Learn more',
  href: 'https://www.cookiesandyou.com',
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
npm run build:release --tag=3.1.2
```

---

## Changelog

See [`CHANGELOG.md`](./CHANGELOG.md) for version history and release notes.

---

## License & Acknowledgements

This project is licensed under the [MIT License](./licence).

Originally authored by **Silktide Ltd** and maintained by **Osano**. Maintained and enhanced for modern web applications by **[Teckgeekz](http://teckgeekz.com)**.

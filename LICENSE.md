# The MIT License (MIT)

```
Copyright (c) 2016 Silktide Ltd
Copyright (c) 2018-2021 Osano, Inc.
Copyright (c) 2026 Teckgeekz (https://teckgeekz.com)

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
```

---

## Attribution, Lineage & Technology Credits

### 1. Original Project Lineage
- **Silktide Ltd (2016)**: Original author and creator of the open-source Cookie Consent JavaScript library.
- **Osano, Inc. (2018–2021)**: Subsequent steward and maintainer who transitioned the library into Cookie Consent v3, introducing modular law compliance rules, internationalization hooks, and location service integrations.

### 2. Teckgeekz Modernization & Enhancements (2026)
This package is maintained, modernized, and enhanced by **[Teckgeekz](https://teckgeekz.com)** (`teckgeekz-consent`). Major modernizations and original contributions include:
- **Google Consent Mode v2 Integration**: Native, first-class support for Google's required Consent Mode v2 signals (`analytics_storage`, `ad_storage`, `ad_user_data`, `ad_personalization`) via window `dataLayer` and `gtag('consent', ...)` for GDPR, EEA, and global compliance.
- **Granular Cookie Preferences Modal**: A zero-dependency, accessible modal dialog (`createCookieModal`, `openPreferences`) enabling category-level opt-ins and opt-outs with smooth animations, state synchronization, and full accessibility (`role="dialog"`, `aria-modal="true"`, `aria-labelledby`, `aria-describedby`).
- **Modern Glassmorphic Dark Theme (`teckgeekz`)**: A sleek, contemporary dark UI theme with backdrop blur, tailored borders, subtle glow accents, and micro-interactions designed to blend seamlessly with modern web stacks.
- **Multi-Tier Resilient Storage Engine**: Robust storage layer implementing `document.cookie` with automatic transparent fallback to `localStorage` and memory storage when cookies are disabled, sandboxed in iframes, or running on local `file://` protocols.
- **TypeScript Type Definitions**: Complete TypeScript typing definitions (`index.d.ts`) covering all configuration options, callback signatures, law rules, and instance methods.
- **Automated Native Test Suite**: Comprehensive regression test coverage (`test/cookieconsent.test.js`) executed with Node.js built-in test runner for enterprise-grade reliability.

### 3. Standards, Specifications & Third-Party Credits
- **Google Consent Mode v2**: Integration patterns conforming to Google's official documentation and Consent Mode v2 specification for Google Tag Manager (GTM) and Google Analytics 4 (GA4).
- **Mozilla Developer Network (MDN Web Docs)**: Reference guides and educational materials for HTTP cookies, privacy standards, and web storage APIs ([MDN Cookies Guide](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Cookies)).
- **Build & Development Ecosystem**:
  - [Gulp.js](https://gulpjs.com/) for automated build pipeline orchestration.
  - [Terser](https://terser.org/) for ES/JS minification and tree-shaking.
  - [Clean-CSS](https://github.com/clean-css/clean-css) & [Autoprefixer](https://github.com/postcss/autoprefixer) for CSS compilation and vendor prefixing.
  - [PostCSS](https://postcss.org/) for modern CSS transforms.
- **Open Source Community**: Thanks to all past and present community contributors who submitted bug reports, translations, and suggestions.

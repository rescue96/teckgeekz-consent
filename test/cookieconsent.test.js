const test = require('node:test');
const assert = require('node:assert');

// Setup mock browser globals for testing
function setupMockDom() {
  const cookies = {};
  const listeners = {};

  const documentMock = {
    get cookie() {
      return Object.entries(cookies)
        .map(([k, v]) => `${k}=${v}`)
        .join('; ');
    },
    set cookie(str) {
      const parts = str.split(';');
      const [nameVal] = parts;
      const eqIdx = nameVal.indexOf('=');
      const name = nameVal.slice(0, eqIdx).trim();
      const val = nameVal.slice(eqIdx + 1).trim();

      // Check for expiration
      const isExpired = parts.some(p => p.trim().startsWith('expires=') && new Date(p.split('=')[1]) < new Date());
      if (isExpired || !val) {
        delete cookies[name];
      } else {
        cookies[name] = val;
      }
    },
    createElement: function(tag) {
      const element = {
        tagName: tag.toUpperCase(),
        className: '',
        style: {},
        children: [],
        childNodes: [],
        parentNode: null,
        _listeners: {},
        addEventListener: function(event, fn) {
          element._listeners[event] = element._listeners[event] || [];
          element._listeners[event].push(fn);
        },
        removeEventListener: function(event, fn) {
          if (element._listeners[event]) {
            element._listeners[event] = element._listeners[event].filter(cb => cb !== fn);
          }
        },
        dispatchEvent: function(event) {
          const cbs = element._listeners[event.type] || [];
          cbs.forEach(cb => cb.call(element, event));
        },
        appendChild: function(child) {
          child.parentNode = element;
          element.children.push(child);
          element.childNodes.push(child);
          if (element.firstChild === undefined) element.firstChild = child;
          return child;
        },
        insertBefore: function(child) {
          child.parentNode = element;
          element.children.unshift(child);
          element.childNodes.unshift(child);
          element.firstChild = child;
          return child;
        },
        removeChild: function(child) {
          element.children = element.children.filter(c => c !== child);
          element.childNodes = element.childNodes.filter(c => c !== child);
          if (element.firstChild === child) {
            element.firstChild = element.children[0] || null;
          }
          child.parentNode = null;
          return child;
        }
      };

      if (tag === 'div') {
        Object.defineProperty(element, 'innerHTML', {
          set: function(html) {
            const inner = documentMock.createElement('div');
            // extract classes if any
            const matchClass = html.match(/class=["']([^"']+)["']/);
            if (matchClass) inner.className = matchClass[1];
            element.children = [inner];
            element.childNodes = [inner];
            element.firstChild = inner;
            inner.parentNode = element;
          }
        });
      }

      if (tag === 'style') {
        element.sheet = {
          insertRule: function() {},
          ownerNode: element
        };
      }

      return element;
    },
    head: null,
    body: null
  };

  documentMock.head = documentMock.createElement('head');
  documentMock.body = documentMock.createElement('body');

  const elementsById = {};
  documentMock.getElementById = function(id) {
    return elementsById[id] || null;
  };
  documentMock.body.insertAdjacentHTML = function(position, html) {
    ['cookie-modal', 'analytics-consent', 'marketing-consent', 'essential-cookies', 'cookie-modal-reject', 'cookie-modal-save'].forEach(function(id) {
      if (html.indexOf('id="' + id + '"') !== -1) {
        const el = documentMock.createElement('div');
        el.id = id;
        el.checked = false;
        elementsById[id] = el;
      }
    });
  };
  documentMock.addEventListener = function(event, fn) {
    listeners[event] = listeners[event] || [];
    listeners[event].push(fn);
  };
  documentMock.removeEventListener = function(event, fn) {
    if (listeners[event]) {
      listeners[event] = listeners[event].filter(function(cb) { return cb !== fn; });
    }
  };

  const windowMock = {
    document: documentMock,
    navigator: {
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0',
      cookieEnabled: true
    },
    addEventListener: function(event, fn) {
      listeners[event] = listeners[event] || [];
      listeners[event].push(fn);
    },
    removeEventListener: function(event, fn) {
      if (listeners[event]) {
        listeners[event] = listeners[event].filter(cb => cb !== fn);
      }
    },
    location: {
      pathname: '/'
    },
    setTimeout: setTimeout,
    clearTimeout: clearTimeout
  };

  global.window = windowMock;
  global.document = documentMock;
  global.navigator = windowMock.navigator;
  global.location = windowMock.location;

  return { cookies, listeners, documentMock, windowMock };
}

test('Module export and Status definitions', () => {
  setupMockDom();
  // Clear require cache for isolated testing
  delete require.cache[require.resolve('../src/cookieconsent.js')];
  const cookieconsent = require('../src/cookieconsent.js');

  assert.ok(cookieconsent, 'cookieconsent is defined');
  assert.strictEqual(cookieconsent.status.allow, 'allow');
  assert.strictEqual(cookieconsent.status.deny, 'deny');
  assert.strictEqual(cookieconsent.status.dismiss, 'dismiss');
  assert.strictEqual(typeof cookieconsent.initialise, 'function');
  assert.strictEqual(typeof cookieconsent.Popup, 'function');
});

test('Cookie utilities support SameSite attribute and expiration', () => {
  const { cookies } = setupMockDom();
  delete require.cache[require.resolve('../src/cookieconsent.js')];
  const cookieconsent = require('../src/cookieconsent.js');

  // Test setCookie with sameSite Lax
  cookieconsent.utils.setCookie('test_cookie', 'test_val', 1, '', '/', false, 'Lax');
  assert.strictEqual(cookieconsent.utils.getCookie('test_cookie'), 'test_val');

  // Test setCookie with sameSite None (should auto set secure)
  cookieconsent.utils.setCookie('secure_cookie', 'secure_val', 1, '', '/', false, 'None');
  assert.strictEqual(cookieconsent.utils.getCookie('secure_cookie'), 'secure_val');

  // Test deletion (-1 days)
  cookieconsent.utils.setCookie('test_cookie', '', -1, '', '/');
  assert.strictEqual(cookieconsent.utils.getCookie('test_cookie'), undefined);
});

test('Popup initialization and status lifecycle callbacks', () => {
  setupMockDom();
  delete require.cache[require.resolve('../src/cookieconsent.js')];
  const cookieconsent = require('../src/cookieconsent.js');

  let statusChangeCount = 0;
  let receivedStatus = null;

  const popup = new cookieconsent.Popup({
    type: 'opt-in',
    onStatusChange: function(status) {
      statusChangeCount++;
      receivedStatus = status;
    }
  });

  assert.strictEqual(popup.hasAnswered(), false);
  assert.strictEqual(popup.hasConsented(), false);

  popup.setStatus(cookieconsent.status.allow);

  assert.strictEqual(statusChangeCount, 1);
  assert.strictEqual(receivedStatus, 'allow');
  assert.strictEqual(popup.hasAnswered(), true);
  assert.strictEqual(popup.hasConsented(), true);

  // Revoke choice
  let revoked = false;
  popup.options.onRevokeChoice = function() {
    revoked = true;
  };
  popup.revokeChoice(true);

  assert.strictEqual(revoked, true);
  assert.strictEqual(popup.hasAnswered(), false);
});

test('Custom cookie.name is honored on initialization', () => {
  const { cookies } = setupMockDom();
  delete require.cache[require.resolve('../src/cookieconsent.js')];
  const cookieconsent = require('../src/cookieconsent.js');

  // Pre-set custom cookie
  cookies['my_custom_consent'] = 'allow';

  let initializedPopup = null;
  cookieconsent.initialise(
    {
      cookie: {
        name: 'my_custom_consent'
      }
    },
    function(p) {
      initializedPopup = p;
    }
  );

  assert.ok(initializedPopup, 'Popup was initialized');
  assert.strictEqual(initializedPopup.hasAnswered(), true);
  assert.strictEqual(initializedPopup.getStatus(), 'allow');
});

test('Destroy cleans up DOM and event listeners', () => {
  const { documentMock } = setupMockDom();
  delete require.cache[require.resolve('../src/cookieconsent.js')];
  const cookieconsent = require('../src/cookieconsent.js');

  const popup = new cookieconsent.Popup({
    palette: {
      popup: { background: '#111' },
      button: { background: '#eee' }
    }
  });

  assert.ok(popup.element, 'Element was created');
  assert.ok(documentMock.body.children.length > 0, 'Element attached to body');

  popup.destroy();

  assert.strictEqual(popup.element, null);
  assert.strictEqual(popup.options, null);
  assert.strictEqual(documentMock.body.children.length, 0, 'DOM cleaned up on destroy');
});

test('onWindowClick handles event without evt.path using composedPath or fallback', () => {
  setupMockDom();
  delete require.cache[require.resolve('../src/cookieconsent.js')];
  const cookieconsent = require('../src/cookieconsent.js');

  let dismissed = false;
  const popup = new cookieconsent.Popup({
    dismissOnWindowClick: true,
    onStatusChange: function(status) {
      if (status === 'dismiss') dismissed = true;
    }
  });

  assert.ok(popup.onWindowClick, 'onWindowClick handler exists');

  // Simulate click event with NO evt.path (like modern Firefox or Safari)
  const mockEvt = {
    target: { parentNode: null, className: '' },
    composedPath: function() {
      return [{ className: 'some-other-element' }];
    }
  };

  // Should not throw Cannot read property of undefined (reading 'length')
  assert.doesNotThrow(() => {
    popup.onWindowClick(mockEvt);
  });

  assert.strictEqual(dismissed, true);
});

test('createCookieModal and popup.openPreferences support teckgeekz granular consent', () => {
  const { documentMock } = setupMockDom();
  delete require.cache[require.resolve('../src/cookieconsent.js')];
  const cookieconsent = require('../src/cookieconsent.js');

  assert.strictEqual(typeof cookieconsent.createCookieModal, 'function');

  let savedRecord = null;
  let gtagConsent = null;

  const modalController = cookieconsent.createCookieModal({
    storeConsentRecord: function(analytics, marketing) {
      savedRecord = { analytics, marketing };
    },
    updateGtagConsent: function(analytics, marketing) {
      gtagConsent = { analytics, marketing };
    }
  });

  assert.ok(modalController, 'createCookieModal returns controller');
  assert.strictEqual(typeof modalController.open, 'function');
  assert.strictEqual(typeof modalController.close, 'function');

  // Verify popup can open preferences
  const popup = new cookieconsent.Popup({
    theme: 'teckgeekz',
    type: 'opt-in-customize'
  });

  assert.strictEqual(typeof popup.openPreferences, 'function');
  const openedModal = popup.openPreferences();
  assert.ok(openedModal, 'popup.openPreferences returned modal controller');
});

test('Google Consent Mode v2 payload mapping and API utilities', () => {
  setupMockDom();
  delete require.cache[require.resolve('../src/cookieconsent.js')];
  const cookieconsent = require('../src/cookieconsent.js');

  // Test getGoogleConsentPayload with boolean
  const grantedPayload = cookieconsent.getGoogleConsentPayload(true);
  assert.strictEqual(grantedPayload.analytics_storage, 'granted');
  assert.strictEqual(grantedPayload.ad_storage, 'granted');
  assert.strictEqual(grantedPayload.ad_user_data, 'granted');
  assert.strictEqual(grantedPayload.ad_personalization, 'granted');

  const deniedPayload = cookieconsent.getGoogleConsentPayload(false);
  assert.strictEqual(deniedPayload.analytics_storage, 'denied');
  assert.strictEqual(deniedPayload.ad_storage, 'denied');
  assert.strictEqual(deniedPayload.ad_user_data, 'denied');
  assert.strictEqual(deniedPayload.ad_personalization, 'denied');

  // Test with category object (analytics only)
  const mixedPayload = cookieconsent.getGoogleConsentPayload({ analytics: true, marketing: false });
  assert.strictEqual(mixedPayload.analytics_storage, 'granted');
  assert.strictEqual(mixedPayload.ad_storage, 'denied');
  assert.strictEqual(mixedPayload.ad_user_data, 'denied');
  assert.strictEqual(mixedPayload.ad_personalization, 'denied');

  // Test initGoogleConsentMode
  const defaultPayload = cookieconsent.initGoogleConsentMode({ defaultState: 'denied', waitForUpdate: 500 });
  assert.ok(defaultPayload);
  assert.strictEqual(defaultPayload.wait_for_update, 500);
  assert.strictEqual(defaultPayload.analytics_storage, 'denied');
  assert.ok(Array.isArray(global.window.dataLayer));
  assert.strictEqual(typeof global.window.gtag, 'function');

  // Test updateGoogleConsent pushes both gtag call and dataLayer event
  cookieconsent.updateGoogleConsent({ analytics: true, marketing: true });
  const lastEvent = global.window.dataLayer[global.window.dataLayer.length - 1];
  assert.strictEqual(lastEvent.event, 'cookie_consent_update');
  assert.strictEqual(lastEvent.consent_analytics, 'granted');
  assert.strictEqual(lastEvent.consent_ad_storage, 'granted');
  assert.strictEqual(lastEvent.consent_ad_user_data, 'granted');
  assert.strictEqual(lastEvent.consent_ad_personalization, 'granted');
});

test('CookiePopup automatically updates Google Consent Mode v2 when enabled', () => {
  setupMockDom();
  delete require.cache[require.resolve('../src/cookieconsent.js')];
  const cookieconsent = require('../src/cookieconsent.js');

  const popup = new cookieconsent.Popup({
    type: 'opt-in',
    googleConsentMode: true
  });

  // User allows cookies
  popup.setStatus(cookieconsent.status.allow);
  let lastEvent = global.window.dataLayer[global.window.dataLayer.length - 1];
  assert.strictEqual(lastEvent.event, 'cookie_consent_update');
  assert.strictEqual(lastEvent.consent_status, 'allow');
  assert.strictEqual(lastEvent.consent_analytics, 'granted');
  assert.strictEqual(lastEvent.consent_ad_storage, 'granted');

  // User revokes choice
  popup.revokeChoice(true);
  lastEvent = global.window.dataLayer[global.window.dataLayer.length - 1];
  assert.strictEqual(lastEvent.event, 'cookie_consent_update');
  assert.strictEqual(lastEvent.consent_status, 'deny');
  assert.strictEqual(lastEvent.consent_analytics, 'denied');
  assert.strictEqual(lastEvent.consent_ad_storage, 'denied');
});



# PWA Test Cases - No Debt App

## TC-01: Manifest Verification
- **Goal**: Ensure the web app manifest is correctly linked and contains essential metadata.
- **Steps**:
    1. Open the app in browser.
    2. Inspect `<head>` for `<link rel="manifest" href="/manifest.json">`.
    3. Navigate to `/manifest.json`.
- **Expected Results**:
    - Manifest link exists.
    - `/manifest.json` contains `short_name: "No Debt"`, `display: "standalone"`, and correct icon paths.

## TC-02: Service Worker Registration
- **Goal**: Verify the Service Worker is registered and active.
- **Steps**:
    1. Open the app in browser.
    2. Check `navigator.serviceWorker.controller` or `getRegistrations()`.
- **Expected Results**:
    - Service Worker is active and controlling the page.

## TC-03: App Icons Accessibility
- **Goal**: Ensure icons defined in manifest are reachable.
- **Steps**:
    1. Access `/icons/icon-192x192.png` and `/icons/icon-512x512.png` directly.
- **Expected Results**:
    - Both icons return HTTP 200 and are valid images.

## TC-04: Offline Loading (Shell Cache)
- **Goal**: Verify the app shell is cached and accessible offline.
- **Steps**:
    1. Visit the app while online.
    2. Go offline (via DevTools).
    3. Refresh the page.
- **Expected Results**:
    - Page loads correctly from the Service Worker cache.

## TC-05: Install Banner Presence
- **Goal**: Verify the custom install banner appears when install criteria are met.
- **Steps**:
    1. Use a PWA-supported browser.
    2. Wait for `beforeinstallprompt` event.
- **Expected Results**:
    - The neo-brutalist "Cài App" banner appears at the bottom.

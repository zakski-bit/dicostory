# DicoStory — Progressive Web App with Offline Sync & Geospatial Mapping

Offline-first Progressive Web App (PWA) for interactive story sharing with geospatial mapping, automated background synchronization, and native device capabilities. Built with **Vanilla JavaScript (ES6+)**, **Vite**, **Leaflet.js**, and modern web APIs.

[![Netlify Status](https://img.shields.io/badge/Netlify-Live%20Demo-00C7B7?style=flat&logo=netlify)](https://dicostory-sub.netlify.app/)
[![Vite](https://img.shields.io/badge/Vite-6.x-646CFF?style=flat&logo=vite)](https://vitejs.dev/)
[![PWA](https://img.shields.io/badge/PWA-Offline--First-5A0FC8?style=flat&logo=pwa)](https://web.dev/progressive-web-apps/)
[![Leaflet](https://img.shields.io/badge/Leaflet-Geospatial-199900?style=flat&logo=leaflet)](https://leafletjs.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

## Live Deployment

- **Production URL**: [https://dicostory-sub.netlify.app/](https://dicostory-sub.netlify.app/)

## Architectural Highlights

DicoStory is designed using the **Model-View-Presenter (MVP)** pattern in pure JavaScript, ensuring separation of concerns, framework-independent maintainability, and optimal performance:

```
src/
├── scripts/
│   ├── config.js              # Application constants & map tile providers
│   ├── index.js               # Application bootstrap & service worker registration
│   ├── routes/                # Client-side hash routing & view transitions
│   ├── views/                 # UI components and view templates
│   ├── presenters/            # Business logic, state coordination & sync handling
│   ├── data/                  # Remote API clients & IndexedDB outbox wrappers
│   └── utils/                 # Camera streaming, notifications & geolocation helpers
├── public/
│   ├── app.webmanifest        # PWA manifest with maskable icons & shortcuts
│   └── sw.js                  # Service Worker with caching & push notification listeners
```

## Core Capabilities

### 1. Progressive Web App (PWA) & Offline-First
- **Installability**: Meets full PWA criteria for standalone homescreen installation across Android, iOS, and desktop browsers.
- **Service Worker Caching**: Multi-tier caching strategy combining `NetworkFirst` (with cache fallback) and `StaleWhileRevalidate` for offline feed availability.
- **Web App Manifest**: Configured with maskable vector icons, shortcuts, and responsive screenshots.

### 2. IndexedDB Outbox & Background Synchronization
- **Local Persistence**: Stories can be bookmarked and stored in IndexedDB for instant offline retrieval.
- **Outbox Queue**: When a user posts a story without internet connectivity, the payload is held in an IndexedDB outbox. Upon network reconnection (`online` event or background sync), the system automatically flushes the queue, uploads content to the API, and notifies the user.

### 3. Web Push Notifications (VAPID)
- Standards-compliant Web Push integration supporting VAPID keys.
- Handles background `push` events and `notificationclick` navigation, routing directly to the target story view via actionable notification buttons.

### 4. Interactive Geospatial Mapping (Leaflet.js)
- Multi-layer map views (OpenStreetMap, CartoDB Positron, Esri Satellite).
- Bi-directional viewport synchronization: selecting map pins highlights the corresponding story card, while scrolling stories navigates the map camera.
- Interactive coordinate picker for attaching geolocation metadata to new posts.

### 5. Hardware Camera Access & Accessibility
- **MediaDevices Stream**: Direct browser camera capture with automatic stream termination to preserve battery and privacy.
- **WCAG 2.1 Compliance**: High-contrast typography, skip-to-content anchors, explicit ARIA roles, and complete keyboard navigation (`Tab`, `Enter`, `Escape`).
- **View Transitions API**: Smooth page transitions between view states.

## Quickstart

### Prerequisites

- Node.js 18+
- npm or pnpm

### Installation & Development

1. Clone the repository:
   ```bash
   git clone https://github.com/zakski-bit/dicostory.git
   cd dicostory
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start development server:
   ```bash
   npm run dev
   ```

4. Build for production:
   ```bash
   npm run build
   npm run preview
   ```

## License

MIT License. See [LICENSE](LICENSE) for details.

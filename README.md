# 📖 DicoStory — Progressive Web App (PWA) with Offline Sync & Geospatial Mapping

[![Netlify Status](https://img.shields.io/badge/Netlify-Live%20Demo-00C7B7?style=flat&logo=netlify)](https://dicostory-sub.netlify.app/)
[![Vite](https://img.shields.io/badge/Vite-6.x-646CFF?style=flat&logo=vite)](https://vitejs.dev/)
[![PWA](https://img.shields.io/badge/PWA-Installable%20%26%20Offline-5A0FC8?style=flat&logo=pwa)](https://web.dev/progressive-web-apps/)
[![Leaflet](https://img.shields.io/badge/Leaflet-Interactive%20Maps-199900?style=flat&logo=leaflet)](https://leafletjs.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

> **DicoStory** adalah platform web modern untuk berbagi cerita inspiratif di seluruh pelosok nusantara dengan visualisasi persebaran geografis interaktif, dukungan Progressive Web App (PWA) penuh, push notifications, dan kemampuan akses luring (offline-first) dengan sinkronisasi otomatis.

🌐 **Live Demo:** [https://dicostory-sub.netlify.app/](https://dicostory-sub.netlify.app/)

---

## 🌟 Fitur Utama (Key Features)

### 1. 📱 Progressive Web App (PWA) & Offline-First
- **Installable**: Dapat dipasang ke layar utama (*home screen*) pada perangkat Android, iOS, maupun desktop seperti aplikasi native via tombol prompt instalasi.
- **App Shell & Dynamic API Caching**: Menggunakan Service Worker dengan strategi *NetworkFirst (cache fallback)* dan *StaleWhileRevalidate* sehingga data cerita dan detail tetap dapat diakses meski tanpa koneksi internet.
- **Web App Manifest**: Lengkap dengan ikon maskable, *app shortcuts*, dan screenshot responsif (*wide* & *narrow*).

### 2. ⚡ IndexedDB & Background Synchronization (Outbox Queue)
- **Koleksi Cerita Tersimpan (`#/saved`)**: Fitur bookmark cerita favorit ke IndexedDB lokal lengkap dengan fitur pencarian teks real-time, penyaringan, dan pengurutan.
- **Offline Outbox Sync**: Saat pengguna membuat cerita baru tanpa koneksi internet (`offline`), cerita disimpan rapi di antrean lokal (*outbox*). Begitu koneksi internet pulih (event `online` / background sync), sistem secara otomatis mengunggah cerita ke server dan memberi notifikasi ke pengguna.

### 3. 🔔 Web Push Notification (VAPID & Service Worker)
- Menerapkan Web Push Notification resmi yang terintegrasi dengan backend API.
- Menangani event `push` dinamis dan event `notificationclick` dengan *action button* ("Lihat Detail Cerita") yang otomatis mengarahkan peramban ke halaman detail cerita terkait.
- Pengguna dapat mengaktifkan atau menonaktifkan langganan push notification langsung dari UI.

### 4. 🗺️ Peta Digital Interaktif (Geospatial Mapping)
- Peta digital berbasis **Leaflet.js** dengan dukungan kontrol multi-layer (OpenStreetMap Standar, CartoDB Positron, dan Esri Citra Satelit Resolusi Tinggi).
- **Sinkronisasi Dwiarah**:
  - Mengklik titik marker peta otomatis menyorot kartu cerita yang bersangkutan.
  - Mengklik kartu cerita otomatis memfokuskan kamera peta dan membuka popup cerita di lokasi tersebut.
- Pemilihan koordinat cerita baru dengan interaksi klik langsung pada peta (*Click Coordinate Picker*).

### 5. 📸 Live Camera Stream Access
- Integrasi MediaDevices API untuk menangkap foto langsung melalui kamera peramban secara real-time.
- Manajemen daya dan privasi: *Media stream tracks* dimatikan secara otomatis segera setelah foto berhasil dipotret atau saat pengguna berpindah halaman.

### 6. ♿ Standar Aksesibilitas WCAG & Transisi Halaman
- Memenuhi standar **Web Content Accessibility Guidelines (WCAG)**:
  - Fitur navigasi cepat *Skip to main content*.
  - Kontras warna teks tinggi (*high contrast*).
  - Navigasi keyboard penuh (`Tab`, `Enter`, `Space`, `Escape`).
  - Atribut ARIA eksplisit dan deskripsi gambar (`alt text`).
- **View Transitions API**: Animasi transisi antar halaman SPA yang halus dan ramah performa.

---

## 🏗️ Arsitektur Proyek (Model-View-Presenter)

Aplikasi dibangun menggunakan pola arsitektur **Model-View-Presenter (MVP)** murni tanpa framework besar, memastikan pemisahan tanggung jawab (*separation of concerns*) yang jelas, mudah diuji, dan modular:

```text
src/
├── scripts/
│   ├── config.js              # Konfigurasi aplikasi & default map
│   ├── index.js               # Entry point, registrasi SW & inisialisasi helper
│   ├── data/                  # MODEL LAYER
│   │   ├── api.js             # Definisi endpoint REST API
│   │   ├── auth-model.js      # Autentikasi sesi & token JWT
│   │   ├── db.js              # Abstraksi IndexedDB (idb)
│   │   └── story-model.js     # Logika data cerita & caching
│   ├── views/                 # VIEW LAYER
│   │   ├── home-view.js       # Template & manipulasi DOM beranda
│   │   ├── detail-view.js     # Template detail cerita
│   │   ├── add-story-view.js  # Template formulir & kamera
│   │   ├── saved-view.js      # Template cerita tersimpan (offline)
│   │   └── ...
│   ├── presenters/            # PRESENTER LAYER
│   │   ├── home-presenter.js  # Logika interaksi beranda & peta
│   │   ├── detail-presenter.js# Logika detail & bookmark
│   │   ├── add-story-presenter.js # Logika kamera, koordinat, & outbox sync
│   │   ├── saved-presenter.js # Logika pencarian & sorting offline
│   │   └── ...
│   ├── routes/                # Client-Side Hash Router
│   └── utils/                 # Push notification, sync, camera, & transitions
├── public/                    # Manifest, ikon, Service Worker (sw.js), & redirects
└── styles/                    # Desain sistem responsif & transisi
```

---

## 🚀 Menjalankan Secara Lokal (Getting Started)

### Prasyarat
- [Node.js](https://nodejs.org/) (versi 18 ke atas disarankan)
- NPM (bawaan Node.js)

### Langkah Instalasi
1. Clone repositori ini:
   ```bash
   git clone https://github.com/<username-anda>/dicostory.git
   cd dicostory
   ```
2. Pasang dependensi:
   ```bash
   npm install
   ```
3. Jalankan server pengembangan lokal:
   ```bash
   npm run dev
   ```
   Buka peramban Anda di `http://localhost:5173/`.

4. Untuk membuat bundel produksi:
   ```bash
   npm run build
   ```
   Hasil build siap saji akan berada di folder `dist/`.

---

## 🛠️ Teknologi yang Digunakan (Tech Stack)

- **Frontend Core**: Vanilla JavaScript (ES6+ Modules), HTML5 Semantic, CSS3 Custom Properties (Design Tokens)
- **Bundler & Tooling**: [Vite](https://vitejs.dev/)
- **PWA & Background Execution**: Service Worker API, Push API, Notifications API, Cache Storage
- **Offline Storage**: [idb](https://github.com/jakearchibald/idb) (IndexedDB wrapper)
- **Maps & Geospatial**: [Leaflet.js](https://leafletjs.com/) (OpenStreetMap, CartoDB, Esri Satellite)
- **Hardware Integration**: MediaDevices API (Camera Stream), Geolocation API
- **Deployment**: [Netlify](https://www.netlify.com/) / [GitHub Pages](https://pages.github.com/)

---

## 📄 Lisensi
Proyek ini dibuat untuk keperluan portofolio pengembangan web modern dan berada di bawah lisensi [MIT](LICENSE).

import { ICONS } from '../utils/icons';

class AboutView {
  getTemplate() {
    return `
      <section class="about-section container" aria-labelledby="about-heading">
        <div class="about-card">
          <header class="about-header">
            <div class="hero-badge">Arsitektur & Spesifikasi</div>
            <h1 id="about-heading" class="about-title">Tentang DicoStory</h1>
            <p class="about-subtitle">Platform web berbagi cerita berbasis lokasi dengan kapabilitas Progressive Web App (PWA), Web Push Notification, dan sinkronisasi offline berstandar industri.</p>
          </header>

          <div class="about-content">
            <article class="about-article">
              <h2>Fitur Utama & Pemenuhan Kriteria</h2>
              <div class="feature-grid">
                <div class="feature-item">
                  <span class="feature-icon" aria-hidden="true">${ICONS.layers(24)}</span>
                  <h3>Pola Desain MVP</h3>
                  <p>Pemisahan arsitektur Model-View-Presenter secara independen untuk memastikan modularitas, kemudahan pengujian, dan pemeliharaan jangka panjang.</p>
                </div>

                <div class="feature-item">
                  <span class="feature-icon" aria-hidden="true">${ICONS.bell(24)}</span>
                  <h3>Web Push Notification</h3>
                  <p>Mendukung langganan push notification server dengan otentikasi VAPID, aksi interaktif langsung ke detail cerita, dan toggle kendali pengguna.</p>
                </div>

                <div class="feature-item">
                  <span class="feature-icon" aria-hidden="true">${ICONS.mapPin(24)}</span>
                  <h3>Peta Digital Multi-Layer</h3>
                  <p>Integrasi peta Leaflet dengan kontrol 3 tile layer (OpenStreetMap, CartoDB Positron, Citra Satelit Esri) dan sinkronisasi dwiarah antara kartu cerita dan marker.</p>
                </div>

                <div class="feature-item">
                  <span class="feature-icon" aria-hidden="true">${ICONS.camera(24)}</span>
                  <h3>Media Capture & Stream</h3>
                  <p>Mendukung potret foto langsung melalui Media Capture API perangkat dengan penutupan stream otomatis setelah foto diambil.</p>
                </div>

                <div class="feature-item">
                  <span class="feature-icon" aria-hidden="true">${ICONS.bookmark(24)}</span>
                  <h3>PWA & Sinkronisasi Offline</h3>
                  <p>Dukungan instalasi PWA, caching aset Service Worker (Stale-While-Revalidate & Cache-First), serta penyimpanan lokal dan antrean Outbox via IndexedDB.</p>
                </div>

                <div class="feature-item">
                  <span class="feature-icon" aria-hidden="true">${ICONS.sliders(24)}</span>
                  <h3>Pusat Uji & Diagnostik</h3>
                  <p>Panel diagnostik terpadu untuk menguji simulasi Web Push, outbox sync offline, dan inspeksi status penyimpanan/jaringan secara transparan.</p>
                </div>
              </div>
            </article>

            <article class="about-article mt-4">
              <h2>Informasi Proyek</h2>
              <p>Proyek ini dikembangkan oleh <strong>Zaki Abdussalam</strong> sebagai pemenuhan <strong>Submission Proyek Kedua: Menjadi Front-End Web Developer Expert / Belajar Pengembangan Web Intermediate</strong> di Dicoding Indonesia.</p>
            </article>
          </div>
        </div>
      </section>
    `;
  }
}

export default AboutView;

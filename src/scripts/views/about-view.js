class AboutView {
  getTemplate() {
    return `
      <section class="about-section container" aria-labelledby="about-heading">
        <div class="about-card">
          <header class="about-header">
            <h1 id="about-heading" class="about-title">Tentang DicoStory</h1>
            <p class="about-subtitle">Aplikasi web berbagi cerita berbasis lokasi dengan standar aksesibilitas dan performa modern.</p>
          </header>

          <div class="about-content">
            <article class="about-article">
              <h2>🌟 Fitur Utama & Kriteria Pemenuhan</h2>
              <div class="feature-grid">
                <div class="feature-item">
                  <span class="feature-icon" aria-hidden="true">🏛️</span>
                  <h3>Arsitektur MVP</h3>
                  <p>Memisahkan kode ke dalam lapisan Model (data & API), View (UI & DOM), dan Presenter (logika bisnis) untuk kemudahan pengujian dan pemeliharaan.</p>
                </div>

                <div class="feature-item">
                  <span class="feature-icon" aria-hidden="true">✨</span>
                  <h3>Custom View Transition</h3>
                  <p>Menerapkan transisi halaman yang halus menggunakan View Transition API dengan animasi kustom CSS dan penanganan <code>prefers-reduced-motion</code>.</p>
                </div>

                <div class="feature-item">
                  <span class="feature-icon" aria-hidden="true">🗺️</span>
                  <h3>Peta Digital Multi-Layer</h3>
                  <p>Integrasi peta Leaflet interaktif dengan kontrol 3 tile layer (OpenStreetMap, CartoDB Positron, dan Citra Satelit Esri), dilengkapi sinkronisasi interaktif antara kartu cerita dan marker.</p>
                </div>

                <div class="feature-item">
                  <span class="feature-icon" aria-hidden="true">📷</span>
                  <h3>Akses Kamera Langsung</h3>
                  <p>Mendukung potret foto langsung melalui Media Capture API perangkat dengan penutupan stream otomatis yang aman setelah selesai digunakan.</p>
                </div>

                <div class="feature-item">
                  <span class="feature-icon" aria-hidden="true">♿</span>
                  <h3>Aksesibilitas (WCAG)</h3>
                  <p>Dilengkapi fitur <em>Skip to Content</em>, navigasi keyboard penuh, teks alternatif kontekstual, elemen HTML semantik, dan pasangan label input yang lengkap.</p>
                </div>

                <div class="feature-item">
                  <span class="feature-icon" aria-hidden="true">📱</span>
                  <h3>Desain Responsif</h3>
                  <p>Tampilan optimal dan bebas tumpang-tindih pada layar ponsel (375px), tablet (768px), hingga monitor desktop (1024px+).</p>
                </div>
              </div>
            </article>

            <article class="about-article mt-4">
              <h2>📖 Informasi Pengembang</h2>
              <p>Proyek ini dikembangkan sebagai pemenuhan <strong>Submission Proyek Pertama: Belajar Pengembangan Web Intermediate</strong> di Dicoding Indonesia.</p>
            </article>
          </div>
        </div>
      </section>
    `;
  }
}

export default AboutView;

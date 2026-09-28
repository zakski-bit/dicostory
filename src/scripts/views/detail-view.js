import { escapeHtml } from '../utils/index';
import { formatIndonesianDate, formatTimeAgo } from '../utils/date-helper';

class DetailView {
  getTemplate() {
    return `
      <section class="detail-section container" aria-labelledby="detail-heading">
        <div class="detail-back-bar">
          <a href="#/" class="btn btn-secondary btn-sm" id="btn-back-home">
            ← Kembali ke Beranda
          </a>
          <button id="btn-favorite" class="btn btn-outline-primary btn-sm btn-favorite" type="button" aria-pressed="false" aria-label="Simpan cerita ke favorit offline">
            ⭐ Simpan Favorit (Offline)
          </button>
        </div>

        <div id="detail-loading" class="state-container" aria-live="polite">
          <div class="spinner" aria-hidden="true"></div>
          <p>Sedang memuat detail cerita...</p>
        </div>

        <div id="detail-error" class="state-container state-error" role="alert" style="display: none;">
          <p id="detail-error-message">Gagal memuat detail cerita.</p>
          <a href="#/" class="btn btn-primary btn-sm mt-3">Kembali ke Beranda</a>
        </div>

        <article id="detail-content" class="detail-card" style="display: none;">
          <div class="detail-image-box">
            <img id="detail-image" src="" alt="Foto dokumentasi cerita" class="detail-image" />
          </div>

          <div class="detail-body">
            <header class="detail-header">
              <h1 id="detail-heading" class="detail-title">Judul Cerita</h1>
              <div class="detail-meta">
                <span class="detail-author" id="detail-author">👤 Penulis</span>
                <span class="detail-dot">•</span>
                <time id="detail-date" class="detail-date">🗓️ Tanggal</time>
              </div>
            </header>

            <div class="detail-description-box">
              <h2 class="visually-hidden">Isi Cerita</h2>
              <p id="detail-description" class="detail-description"></p>
            </div>

            <!-- DETAIL LOCATION MAP -->
            <div id="detail-map-box" class="detail-map-box" style="display: none;">
              <h3 class="detail-map-title">📍 Lokasi Cerita</h3>
              <p class="detail-map-subtitle" id="detail-coords-text"></p>
              <div id="detail-map" class="detail-map" role="region" aria-label="Peta lokasi cerita ini"></div>
            </div>
          </div>
        </article>
      </section>
    `;
  }

  renderStory(story) {
    const loadingEl = document.getElementById('detail-loading');
    const contentEl = document.getElementById('detail-content');
    const headingEl = document.getElementById('detail-heading');
    const authorEl = document.getElementById('detail-author');
    const dateEl = document.getElementById('detail-date');
    const descEl = document.getElementById('detail-description');
    const imgEl = document.getElementById('detail-image');

    if (loadingEl) loadingEl.style.display = 'none';
    if (!story || !contentEl) return;

    contentEl.style.display = 'block';
    if (headingEl) headingEl.textContent = `Cerita oleh ${story.name}`;
    if (authorEl) authorEl.textContent = `👤 ${story.name}`;
    if (dateEl) {
      dateEl.textContent = `🗓️ ${formatIndonesianDate(story.createdAt)} (${formatTimeAgo(story.createdAt)})`;
      dateEl.setAttribute('datetime', story.createdAt);
    }
    if (descEl) descEl.textContent = story.description;
    if (imgEl) {
      imgEl.src = story.photoUrl;
      imgEl.alt = `Foto dokumentasi cerita oleh ${story.name}`;
    }
  }

  showLoading(isLoading) {
    const loadingEl = document.getElementById('detail-loading');
    const contentEl = document.getElementById('detail-content');
    const errorEl = document.getElementById('detail-error');

    if (loadingEl) loadingEl.style.display = isLoading ? 'block' : 'none';
    if (isLoading && contentEl) contentEl.style.display = 'none';
    if (isLoading && errorEl) errorEl.style.display = 'none';
  }

  showError(message) {
    this.showLoading(false);
    const errorEl = document.getElementById('detail-error');
    const msgEl = document.getElementById('detail-error-message');
    if (errorEl && msgEl) {
      msgEl.textContent = message;
      errorEl.style.display = 'block';
    }
  }
}

export default DetailView;

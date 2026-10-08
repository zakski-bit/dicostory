import { escapeHtml, truncateText } from '../utils/index';
import { formatIndonesianDate, formatTimeAgo } from '../utils/date-helper';
import ICONS from '../utils/icons';

class HomeView {
  getTemplate() {
    return `
      <section class="hero-section">
        <div class="container hero-content">
          <div class="hero-text">
            <div class="hero-pill">
              <span class="hero-pill-dot" aria-hidden="true"></span>
              <span>Platform Cerita Nusantara</span>
            </div>
            <h1 class="hero-title">Jelajahi & Bagikan Cerita di Seluruh Nusantara</h1>
            <p class="hero-desc">
              Temukan kisah inspiratif dari berbagai pelosok negeri melalui peta interaktif, simpan ke memori offline, dan abadikan perjalanan Anda.
            </p>
            <div class="hero-actions">
              <a href="#/add-story" class="btn btn-primary" id="btn-hero-add">
                <span class="btn-icon">${ICONS.plus(16)}</span>
                <span>Bagikan Cerita</span>
              </a>
              <a href="#map-section" class="btn btn-secondary" id="btn-hero-map">
                <span class="btn-icon">${ICONS.map(16)}</span>
                <span>Buka Peta</span>
              </a>
              <a href="#/saved" class="btn btn-secondary" id="btn-hero-saved">
                <span class="btn-icon">${ICONS.bookmark(16)}</span>
                <span>Cerita Tersimpan</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      <!-- MAP SECTION -->
      <section id="map-section" class="map-section container" aria-labelledby="map-heading">
        <div class="section-header">
          <div>
            <h2 id="map-heading" class="section-title">Peta Persebaran Cerita</h2>
            <p class="section-subtitle">Gunakan kontrol layer di sudut kanan atas dan klik titik marker untuk melihat kisah di lokasi tersebut.</p>
          </div>
          <div class="map-stats">
            <span class="badge badge-primary" id="map-marker-count">
              <span class="badge-icon">${ICONS.mapPin(13)}</span>
              <span id="map-marker-text">Memuat titik...</span>
            </span>
          </div>
        </div>

        <div class="map-wrapper">
          <div id="map" class="map-container" role="region" aria-label="Peta digital interaktif persebaran lokasi cerita"></div>
          <div class="map-legend">
            <span class="legend-item"><span class="legend-dot active-dot" aria-hidden="true"></span> Marker Terpilih</span>
            <span class="legend-item"><span class="legend-dot normal-dot" aria-hidden="true"></span> Titik Lokasi Cerita</span>
          </div>
        </div>
      </section>

      <!-- STORIES SECTION -->
      <section class="stories-section container" aria-labelledby="stories-heading">
        <div class="stories-header">
          <div>
            <h2 id="stories-heading" class="section-title">Daftar Cerita Terbaru</h2>
            <p class="section-subtitle">Pilih kartu cerita untuk menyorot lokasinya pada peta interaktif.</p>
          </div>

          <div class="search-filter-box">
            <label for="story-search" class="visually-hidden">Cari cerita berdasarkan nama atau isi cerita</label>
            <div class="search-input-wrapper">
              <span class="search-icon" aria-hidden="true">${ICONS.search(16)}</span>
              <input
                type="search"
                id="story-search"
                class="form-control search-input"
                placeholder="Cari cerita atau penulis..."
                autocomplete="off"
              />
            </div>
          </div>
        </div>

        <div class="filter-quick-bar">
          <button type="button" class="quick-filter-btn active" data-filter="all">Semua Cerita</button>
          <button type="button" class="quick-filter-btn" data-filter="geo">
            <span class="btn-icon">${ICONS.mapPin(13)}</span>
            <span>Dengan Lokasi Peta</span>
          </button>
        </div>

        <div id="stories-loading" class="state-container" aria-live="polite">
          <div class="spinner" aria-hidden="true"></div>
          <p>Memuat data cerita dari server...</p>
        </div>

        <div id="stories-error" class="state-container state-error" role="alert" style="display: none;">
          <p id="error-message-text">Gagal memuat cerita.</p>
          <button id="btn-retry-stories" class="btn btn-secondary btn-sm mt-3">Coba Lagi</button>
        </div>

        <div id="stories-empty" class="state-container state-empty" style="display: none;">
          <div class="state-icon-box" aria-hidden="true">
            ${ICONS.book(32)}
          </div>
          <h3>Tidak Ada Cerita Ditemukan</h3>
          <p>Belum ada cerita yang cocok dengan kata kunci atau filter pencarian Anda.</p>
        </div>

        <div id="stories-grid" class="stories-grid" style="display: none;"></div>
      </section>
    `;
  }

  renderStories(stories, onCardClick) {
    const grid = document.getElementById('stories-grid');
    const emptyState = document.getElementById('stories-empty');
    if (!grid) return;

    if (!stories || stories.length === 0) {
      grid.style.display = 'none';
      if (emptyState) emptyState.style.display = 'block';
      return;
    }

    if (emptyState) emptyState.style.display = 'none';
    grid.style.display = 'grid';

    grid.innerHTML = stories
      .map((story) => {
        const hasLocation = typeof story.lat === 'number' && typeof story.lon === 'number';
        return `
          <article
            class="story-card"
            id="story-card-${story.id}"
            data-id="${story.id}"
            tabindex="0"
            role="article"
            aria-label="Cerita oleh ${escapeHtml(story.name)}"
          >
            <div class="story-image-wrapper">
              <img
                src="${story.photoUrl}"
                alt="Foto dokumentasi cerita dari ${escapeHtml(story.name)}"
                class="story-image"
                loading="lazy"
              />
              ${
                hasLocation
                  ? `<span class="story-badge-loc" title="Memiliki koordinat peta">
                      <span class="badge-icon">${ICONS.mapPin(12)}</span>
                      <span>Lokasi Terpetakan</span>
                    </span>`
                  : ''
              }
            </div>

            <div class="story-content">
              <div class="story-meta">
                <span class="story-author-name">
                  <span class="meta-icon">${ICONS.user(13)}</span>
                  <span>${escapeHtml(story.name)}</span>
                </span>
                <time datetime="${story.createdAt}" class="story-time">
                  <span class="meta-icon">${ICONS.calendar(13)}</span>
                  <span>${formatIndonesianDate(story.createdAt)}</span>
                </time>
              </div>

              <p class="story-desc">${escapeHtml(truncateText(story.description, 130))}</p>

              <div class="story-card-footer">
                ${
                  hasLocation
                    ? `
                    <button
                      type="button"
                      class="btn btn-outline-primary btn-sm btn-view-on-map"
                      data-id="${story.id}"
                      aria-label="Sorot lokasi cerita ${escapeHtml(story.name)} pada peta"
                    >
                      <span class="btn-icon">${ICONS.map(13)}</span>
                      <span>Peta</span>
                    </button>
                  `
                    : `
                    <span class="no-loc-text">Tanpa Koordinat</span>
                  `
                }
                <div class="card-footer-buttons">
                  <button
                    type="button"
                    class="btn btn-sm btn-outline-warning btn-card-bookmark"
                    data-id="${story.id}"
                    aria-label="Simpan cerita oleh ${escapeHtml(story.name)} ke tersimpan offline"
                    title="Simpan ke favorit offline"
                  >
                    ${ICONS.bookmark(15)}
                  </button>
                  <a href="#/detail/${story.id}" class="btn btn-secondary btn-sm" aria-label="Buka detail lengkap cerita ${escapeHtml(story.name)}">
                    Detail
                  </a>
                </div>
              </div>
            </div>
          </article>
        `;
      })
      .join('');

    // Pasang listener interaktivitas klik kartu dan tombol lihat di peta
    grid.querySelectorAll('.story-card').forEach((card) => {
      const storyId = card.getAttribute('data-id');
      const story = stories.find((s) => s.id === storyId);

      const triggerClick = () => {
        if (onCardClick && story) {
          onCardClick(story);
        }
      };

      card.addEventListener('click', (e) => {
        // Jangan trigger jika klik tombol detail atau bookmark
        if (e.target.closest('a') || e.target.closest('.btn-card-bookmark')) return;
        triggerClick();
      });

      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          if (!e.target.closest('a') && !e.target.closest('.btn-card-bookmark')) {
            e.preventDefault();
            triggerClick();
          }
        }
      });
    });
  }

  highlightCard(storyId) {
    document.querySelectorAll('.story-card').forEach((c) => c.classList.remove('card-highlight'));
    const targetCard = document.getElementById(`story-card-${storyId}`);
    if (targetCard) {
      targetCard.classList.add('card-highlight');
      targetCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }

  showLoading(isLoading) {
    const loadingEl = document.getElementById('stories-loading');
    const gridEl = document.getElementById('stories-grid');
    const errorEl = document.getElementById('stories-error');
    if (loadingEl) loadingEl.style.display = isLoading ? 'block' : 'none';
    if (isLoading && gridEl) gridEl.style.display = 'none';
    if (isLoading && errorEl) errorEl.style.display = 'none';
  }

  showError(message, onRetry) {
    this.showLoading(false);
    const errorEl = document.getElementById('stories-error');
    const msgEl = document.getElementById('error-message-text');
    const retryBtn = document.getElementById('btn-retry-stories');

    if (errorEl && msgEl) {
      msgEl.textContent = message;
      errorEl.style.display = 'block';
    }

    if (retryBtn && onRetry) {
      retryBtn.onclick = onRetry;
    }
  }

  updateMarkerCount(count) {
    const textEl = document.getElementById('map-marker-text');
    if (textEl) {
      textEl.textContent = `${count} Lokasi Terpetakan`;
    }
  }

  bindSearch(handler) {
    const searchInput = document.getElementById('story-search');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        handler(e.target.value);
      });
    }
  }

  bindQuickFilter(handler) {
    const filterBtns = document.querySelectorAll('.quick-filter-btn');
    filterBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        filterBtns.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        handler(btn.getAttribute('data-filter'));
      });
    });
  }
}

export default HomeView;

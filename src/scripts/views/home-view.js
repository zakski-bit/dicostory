import { escapeHtml, truncateText } from '../utils/index';
import { formatIndonesianDate, formatTimeAgo } from '../utils/date-helper';

class HomeView {
  getTemplate() {
    return `
      <section class="hero-section">
        <div class="container hero-content">
          <div class="hero-text">
            <h1 class="hero-title">Jelajahi & Bagikan Cerita di Seluruh Nusantara</h1>
            <p class="hero-desc">Setiap sudut negeri menyimpan kisah berharga. Bagikan momen Anda dan temukan jejak cerita di peta interaktif.</p>
            <div class="hero-actions">
              <a href="#/add-story" class="btn btn-primary" id="btn-hero-add">
                <span aria-hidden="true">➕</span> Bagikan Cerita Baru
              </a>
              <a href="#map-section" class="btn btn-secondary" id="btn-hero-map">
                <span aria-hidden="true">🗺️</span> Buka Peta Digital
              </a>
              <a href="#/saved" class="btn btn-secondary" id="btn-hero-saved">
                <span aria-hidden="true">⭐</span> Cerita Tersimpan
              </a>
              <button type="button" class="btn btn-secondary" id="btn-hero-push">
                <span aria-hidden="true">🔔</span> Uji Push Notifikasi
              </button>
            </div>
          </div>
        </div>
      </section>

      <!-- MAP SECTION -->
      <section id="map-section" class="map-section container" aria-labelledby="map-heading">
        <div class="section-header">
          <div>
            <h2 id="map-heading" class="section-title">Peta Persebaran Cerita</h2>
            <p class="section-subtitle">Pilih layer peta pada kontrol sudut kanan atas dan klik marker untuk melihat cerita di lokasi tersebut.</p>
          </div>
          <div class="map-stats">
            <span class="badge badge-primary" id="map-marker-count">Memuat titik...</span>
          </div>
        </div>

        <div class="map-wrapper">
          <div id="map" class="map-container" role="region" aria-label="Peta digital interaktif persebaran lokasi cerita"></div>
          <div class="map-legend">
            <span class="legend-item"><span class="legend-dot active-dot" aria-hidden="true"></span> Marker Aktif / Dipilih</span>
            <span class="legend-item"><span class="legend-dot normal-dot" aria-hidden="true"></span> Titik Cerita</span>
          </div>
        </div>
      </section>

      <!-- STORIES SECTION -->
      <section class="stories-section container" aria-labelledby="stories-heading">
        <div class="stories-header">
          <div>
            <h2 id="stories-heading" class="section-title">Semua Cerita Terbaru</h2>
            <p class="section-subtitle">Klik kartu untuk menyorot lokasi pada peta di atas.</p>
          </div>

          <div class="search-filter-box">
            <label for="story-search" class="visually-hidden">Cari cerita berdasarkan nama atau isi cerita</label>
            <div class="search-input-wrapper">
              <span class="search-icon" aria-hidden="true">🔍</span>
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

        <div id="stories-loading" class="state-container" aria-live="polite">
          <div class="spinner" aria-hidden="true"></div>
          <p>Sedang memuat data cerita dari server...</p>
        </div>

        <div id="stories-error" class="state-container state-error" role="alert" style="display: none;">
          <p id="error-message-text">Gagal memuat cerita.</p>
          <button id="btn-retry-stories" class="btn btn-secondary btn-sm mt-3">Coba Lagi</button>
        </div>

        <div id="stories-empty" class="state-container state-empty" style="display: none;">
          <span class="state-icon" aria-hidden="true">📭</span>
          <h3>Tidak Ada Cerita Ditemukan</h3>
          <p>Belum ada cerita yang cocok dengan kata kunci pencarian Anda.</p>
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
                  ? `<span class="story-badge-loc" title="Memiliki koordinat peta">📍 Lokasi Tersedia</span>`
                  : ''
              }
            </div>

            <div class="story-content">
              <div class="story-meta">
                <span class="story-author-name">👤 ${escapeHtml(story.name)}</span>
                <time datetime="${story.createdAt}" class="story-time">
                  🗓️ ${formatIndonesianDate(story.createdAt)}
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
                      🗺️ Lihat di Peta
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
                    ⭐
                  </button>
                  <a href="#/detail/${story.id}" class="btn btn-secondary btn-sm" aria-label="Buka detail lengkap cerita ${escapeHtml(story.name)}">
                    Baca
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
        // Jangan trigger jika klik tombol detail
        if (e.target.closest('a')) return;
        triggerClick();
      });

      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          if (!e.target.closest('a')) {
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
    const badge = document.getElementById('map-marker-count');
    if (badge) {
      badge.textContent = `${count} Titik Lokasi Cerita Terpetakan`;
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
}

export default HomeView;

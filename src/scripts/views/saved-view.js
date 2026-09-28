import { escapeHtml } from '../utils/index';
import { formatIndonesianDate, formatTimeAgo } from '../utils/date-helper';

class SavedView {
  getTemplate() {
    return `
      <section class="saved-section" aria-labelledby="saved-heading">
        <div class="hero-section">
          <div class="container hero-content text-center">
            <h1 id="saved-heading" class="hero-title">⭐ Cerita Tersimpan (Offline)</h1>
            <p class="hero-subtitle">
              Koleksi cerita favorit Anda yang tersimpan di IndexedDB. Anda dapat membaca dan mengelolanya kapan saja, bahkan tanpa koneksi internet.
            </p>
          </div>
        </div>

        <div class="container main-content-container">
          <!-- SEARCH & FILTER TOOLBAR -->
          <div class="filter-toolbar card p-3 mb-4">
            <div class="filter-grid">
              <div class="filter-item filter-search">
                <label for="search-saved-input" class="form-label">Cari di Cerita Tersimpan</label>
                <div class="input-with-icon">
                  <span class="input-icon" aria-hidden="true">🔍</span>
                  <input
                    type="search"
                    id="search-saved-input"
                    class="form-control"
                    placeholder="Cari berdasarkan nama penulis atau isi cerita..."
                    aria-label="Cari cerita tersimpan"
                  />
                </div>
              </div>

              <div class="filter-item filter-sort">
                <label for="sort-saved-select" class="form-label">Urutkan</label>
                <select id="sort-saved-select" class="form-control" aria-label="Urutkan cerita tersimpan">
                  <option value="newest">Terbaru Disimpan</option>
                  <option value="oldest">Terlama Disimpan</option>
                  <option value="author-asc">Nama Penulis (A-Z)</option>
                </select>
              </div>
            </div>

            <div class="filter-status mt-2 d-flex justify-between align-center">
              <span id="saved-count-text" class="text-muted small">Memuat cerita tersimpan...</span>
            </div>
          </div>

          <!-- LOADING STATE -->
          <div id="saved-loading" class="state-container" aria-live="polite">
            <div class="spinner" aria-hidden="true"></div>
            <p>Memuat cerita dari IndexedDB...</p>
          </div>

          <!-- EMPTY STATE -->
          <div id="saved-empty" class="state-container state-empty card p-5 text-center" style="display: none;">
            <div class="empty-icon" style="font-size: 3rem;" aria-hidden="true">📚</div>
            <h2 class="h4 mt-3">Belum Ada Cerita Tersimpan</h2>
            <p class="text-muted max-w-md mx-auto">
              Anda belum menandai cerita apa pun sebagai favorit. Buka beranda dan klik tombol bintang pada cerita yang Anda sukai untuk menyimpannya ke memori offline.
            </p>
            <a href="#/" class="btn btn-primary mt-3">Jelajahi Beranda</a>
          </div>

          <!-- STORIES GRID -->
          <div id="saved-stories-list" class="stories-grid" role="region" aria-label="Daftar Cerita Tersimpan" style="display: none;"></div>
        </div>
      </section>
    `;
  }

  renderStories(stories) {
    const listContainer = document.getElementById('saved-stories-list');
    const emptyContainer = document.getElementById('saved-empty');
    const countText = document.getElementById('saved-count-text');

    if (!listContainer) return;

    if (!stories || stories.length === 0) {
      listContainer.style.display = 'none';
      if (emptyContainer) emptyContainer.style.display = 'block';
      if (countText) countText.textContent = '0 cerita ditemukan';
      return;
    }

    if (emptyContainer) emptyContainer.style.display = 'none';
    listContainer.style.display = 'grid';

    if (countText) {
      countText.textContent = `Menampilkan ${stories.length} cerita tersimpan`;
    }

    listContainer.innerHTML = stories
      .map((story) => {
        const hasCoords = typeof story.lat === 'number' && typeof story.lon === 'number';
        return `
          <article class="story-card card" id="saved-card-${story.id}">
            <div class="story-card-image-box">
              <img
                src="${escapeHtml(story.photoUrl)}"
                alt="Foto cerita oleh ${escapeHtml(story.name)}"
                class="story-card-image"
                loading="lazy"
              />
              <span class="badge badge-saved">⭐ Tersimpan</span>
              ${hasCoords ? `<span class="badge badge-geo">📍 Ada Lokasi</span>` : ''}
            </div>

            <div class="story-card-body">
              <header class="story-card-header">
                <h3 class="story-card-title">${escapeHtml(story.name)}</h3>
                <time class="story-card-date" datetime="${story.createdAt}">
                  🗓️ ${formatIndonesianDate(story.createdAt)}
                </time>
              </header>

              <p class="story-card-description">
                ${escapeHtml(story.description)}
              </p>

              <footer class="story-card-footer mt-auto pt-3 border-top d-flex justify-between align-center">
                <a href="#/detail/${story.id}" class="btn btn-primary btn-sm" aria-label="Baca cerita oleh ${escapeHtml(story.name)}">
                  Baca Detail
                </a>
                <button
                  type="button"
                  class="btn btn-outline-danger btn-sm btn-delete-saved"
                  data-id="${story.id}"
                  aria-label="Hapus cerita ${escapeHtml(story.name)} dari tersimpan"
                >
                  🗑️ Hapus
                </button>
              </footer>
            </div>
          </article>
        `;
      })
      .join('');
  }

  showLoading(isLoading) {
    const loadingEl = document.getElementById('saved-loading');
    if (loadingEl) {
      loadingEl.style.display = isLoading ? 'block' : 'none';
    }
  }
}

export default SavedView;

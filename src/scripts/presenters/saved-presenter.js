import DatabaseHelper from '../data/db';
import NotificationHelper from '../utils/notification';

class SavedPresenter {
  #view = null;
  #allSavedStories = [];

  constructor(view) {
    this.#view = view;
  }

  async init() {
    await this.#loadSavedStories();
    this.#initSearchAndSort();
    this.#initDeleteListener();
  }

  async #loadSavedStories() {
    this.#view.showLoading(true);
    try {
      this.#allSavedStories = await DatabaseHelper.getFavoriteStories();
      this.#renderFilteredList();
    } catch (err) {
      console.error('Gagal memuat cerita dari IndexedDB:', err);
      NotificationHelper.error('Gagal membaca data tersimpan dari penyimpanan lokal.');
    } finally {
      this.#view.showLoading(false);
    }
  }

  #initSearchAndSort() {
    const searchInput = document.getElementById('search-saved-input');
    const sortSelect = document.getElementById('sort-saved-select');

    if (searchInput) {
      searchInput.addEventListener('input', () => {
        this.#renderFilteredList();
      });
    }

    if (sortSelect) {
      sortSelect.addEventListener('change', () => {
        this.#renderFilteredList();
      });
    }
  }

  #renderFilteredList() {
    const searchInput = document.getElementById('search-saved-input');
    const sortSelect = document.getElementById('sort-saved-select');

    const query = searchInput ? searchInput.value.trim().toLowerCase() : '';
    const sortBy = sortSelect ? sortSelect.value : 'newest';

    let filtered = [...this.#allSavedStories];

    if (query) {
      filtered = filtered.filter((story) => {
        const nameMatch = (story.name || '').toLowerCase().includes(query);
        const descMatch = (story.description || '').toLowerCase().includes(query);
        return nameMatch || descMatch;
      });
    }

    filtered.sort((a, b) => {
      if (sortBy === 'newest') {
        return new Date(b.createdAt) - new Date(a.createdAt);
      }
      if (sortBy === 'oldest') {
        return new Date(a.createdAt) - new Date(b.createdAt);
      }
      if (sortBy === 'author-asc') {
        return (a.name || '').localeCompare(b.name || '');
      }
      return 0;
    });

    this.#view.renderStories(filtered);
  }

  #initDeleteListener() {
    const listContainer = document.getElementById('saved-stories-list');
    if (!listContainer) return;

    listContainer.addEventListener('click', async (event) => {
      const deleteBtn = event.target.closest('.btn-delete-saved');
      if (!deleteBtn) return;

      const storyId = deleteBtn.getAttribute('data-id');
      if (!storyId) return;

      const confirmed = window.confirm('Apakah Anda yakin ingin menghapus cerita ini dari daftar tersimpan?');
      if (!confirmed) return;

      try {
        await DatabaseHelper.deleteFavoriteStory(storyId);
        this.#allSavedStories = this.#allSavedStories.filter((s) => s.id !== storyId);
        this.#renderFilteredList();
        NotificationHelper.success('Cerita berhasil dihapus dari daftar tersimpan.');
      } catch (err) {
        console.error('Gagal menghapus cerita tersimpan:', err);
        NotificationHelper.error('Gagal menghapus cerita dari penyimpanan lokal.');
      }
    });
  }

  destroy() {
    this.#allSavedStories = [];
  }
}

export default SavedPresenter;

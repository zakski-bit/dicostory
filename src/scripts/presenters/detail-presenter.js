import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import StoryModel from '../data/story-model';
import DatabaseHelper from '../data/db';
import NotificationHelper from '../utils/notification';
import { ICONS } from '../utils/icons';

class DetailPresenter {
  #view = null;
  #storyId = null;
  #map = null;
  #storyData = null;

  constructor(view, storyId) {
    this.#view = view;
    this.#storyId = storyId;
  }

  async init() {
    if (!this.#storyId) {
      this.#view.showError('ID cerita tidak ditemukan.');
      return;
    }
    await this.#loadDetail();
    await this.#initFavoriteButton();
  }

  async #loadDetail() {
    this.#view.showLoading(true);

    try {
      let story = null;
      try {
        story = await StoryModel.getStoryDetail(this.#storyId);
      } catch (networkErr) {
        // Fallback jika offline: coba cari di IndexedDB favorites
        const localStory = await DatabaseHelper.getFavoriteStory(this.#storyId);
        if (localStory) {
          story = localStory;
          NotificationHelper.info('Mode Offline: Menampilkan cerita dari penyimpanan lokal.');
        } else {
          throw networkErr;
        }
      }

      this.#storyData = story;
      this.#view.renderStory(story);

      if (typeof story.lat === 'number' && typeof story.lon === 'number') {
        this.#initDetailMap(story.lat, story.lon, story.name);
      }
    } catch (err) {
      this.#view.showError(err.message || 'Gagal memuat detail cerita.');
      NotificationHelper.error(err.message);
    } finally {
      this.#view.showLoading(false);
    }
  }

  async #initFavoriteButton() {
    const favoriteBtn = document.getElementById('btn-favorite');
    if (!favoriteBtn) return;

    const isFav = await DatabaseHelper.isFavoriteStory(this.#storyId);
    this.#updateFavoriteButtonUI(favoriteBtn, isFav);

    favoriteBtn.addEventListener('click', async () => {
      if (!this.#storyData) return;

      const currentlyFav = await DatabaseHelper.isFavoriteStory(this.#storyId);
      if (currentlyFav) {
        await DatabaseHelper.deleteFavoriteStory(this.#storyId);
        this.#updateFavoriteButtonUI(favoriteBtn, false);
        NotificationHelper.info('Cerita dihapus dari daftar tersimpan.');
      } else {
        await DatabaseHelper.saveFavoriteStory(this.#storyData);
        this.#updateFavoriteButtonUI(favoriteBtn, true);
        NotificationHelper.success('Cerita berhasil disimpan untuk dibaca offline!');
      }
    });
  }

  #updateFavoriteButtonUI(btn, isFavorite) {
    if (isFavorite) {
      btn.classList.add('btn-warning');
      btn.classList.remove('btn-outline-primary');
      btn.setAttribute('aria-pressed', 'true');
      btn.innerHTML = `${ICONS.bookmarkFilled(15)} Tersimpan (Klik untuk Hapus)`;
    } else {
      btn.classList.remove('btn-warning');
      btn.classList.add('btn-outline-primary');
      btn.setAttribute('aria-pressed', 'false');
      btn.innerHTML = `${ICONS.bookmark(15)} Simpan Favorit (Offline)`;
    }
  }

  #initDetailMap(lat, lon, authorName) {
    const mapBox = document.getElementById('detail-map-box');
    const coordsText = document.getElementById('detail-coords-text');
    const mapContainer = document.getElementById('detail-map');

    if (mapBox && coordsText && mapContainer) {
      mapBox.style.display = 'block';
      coordsText.textContent = `Koordinat: ${lat.toFixed(6)}, ${lon.toFixed(6)}`;

      if (this.#map) {
        this.#map.remove();
        this.#map = null;
      }

      this.#map = L.map('detail-map', {
        center: [lat, lon],
        zoom: 13,
      });

      L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; OpenStreetMap kontributor',
      }).addTo(this.#map);

      const marker = L.marker([lat, lon]).addTo(this.#map);
      marker.bindPopup(`<b>Lokasi Cerita</b><br>Oleh: ${authorName}`).openPopup();

      setTimeout(() => {
        if (this.#map) {
          this.#map.invalidateSize();
        }
      }, 250);
    }
  }

  destroy() {
    if (this.#map) {
      this.#map.remove();
      this.#map = null;
    }
  }
}

export default DetailPresenter;

import CONFIG from '../config';
import ENDPOINTS from './api';
import AuthModel from './auth-model';
import DatabaseHelper from './db';

class StoryModel {
  static async getStories({ page = 1, size = 30, location = 1 } = {}) {
    const token = AuthModel.getToken();
    if (!token) {
      throw new Error('Anda belum login. Silakan login terlebih dahulu.');
    }

    try {
      const url = new URL(ENDPOINTS.STORIES);
      if (page) url.searchParams.append('page', page);
      if (size) url.searchParams.append('size', size);
      if (location !== undefined) url.searchParams.append('location', location);

      const response = await fetch(url.toString(), {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (!response.ok || data.error) {
        if (response.status === 401) {
          AuthModel.logout();
          throw new Error('Sesi Anda telah kedaluwarsa. Silakan login kembali.');
        }
        throw new Error(data.message || 'Gagal memuat daftar cerita.');
      }

      const listStory = data.listStory || [];
      // Simpan data dinamis API ke IndexedDB untuk akses offline
      if (listStory.length > 0) {
        DatabaseHelper.cacheStories(listStory).catch((e) => console.warn('Cache stories error:', e));
      }

      return listStory;
    } catch (networkErr) {
      // Fallback offline: muat data dinamis dari IndexedDB
      console.warn('Gagal memuat dari jaringan, mengambil data dinamis dari cache IndexedDB...', networkErr);
      const cachedStories = await DatabaseHelper.getCachedStories();
      if (cachedStories && cachedStories.length > 0) {
        return cachedStories;
      }
      throw networkErr;
    }
  }

  static async getStoryDetail(id) {
    const token = AuthModel.getToken();
    if (!token) {
      throw new Error('Anda belum login. Silakan login terlebih dahulu.');
    }

    try {
      const response = await fetch(ENDPOINTS.STORY_DETAIL(id), {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (!response.ok || data.error) {
        if (response.status === 401) {
          AuthModel.logout();
          throw new Error('Sesi Anda telah kedaluwarsa. Silakan login kembali.');
        }
        throw new Error(data.message || 'Gagal memuat detail cerita.');
      }

      if (data.story) {
        DatabaseHelper.cacheStories([data.story]).catch((e) => console.warn('Cache story detail error:', e));
      }

      return data.story;
    } catch (networkErr) {
      const cached = await DatabaseHelper.getCachedStory(id);
      if (cached) return cached;
      const fav = await DatabaseHelper.getFavoriteStory(id);
      if (fav) return fav;
      throw networkErr;
    }
  }

  static async createStory({ description, photo, lat, lon }) {
    const token = AuthModel.getToken();
    if (!token) {
      throw new Error('Anda belum login. Silakan login terlebih dahulu.');
    }

    if (!description || description.trim().length === 0) {
      throw new Error('Deskripsi cerita tidak boleh kosong.');
    }

    if (!photo) {
      throw new Error('Foto cerita wajib disertakan.');
    }

    if (photo.size > CONFIG.MAX_IMAGE_SIZE) {
      throw new Error('Ukuran foto melebihi batas maksimal 1MB. Silakan gunakan foto yang lebih kecil.');
    }

    const formData = new FormData();
    formData.append('description', description.trim());
    formData.append('photo', photo);

    if (lat !== undefined && lat !== null && lat !== '') {
      formData.append('lat', parseFloat(lat));
    }
    if (lon !== undefined && lon !== null && lon !== '') {
      formData.append('lon', parseFloat(lon));
    }

    const response = await fetch(ENDPOINTS.STORIES, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    const data = await response.json();
    if (!response.ok || data.error) {
      if (response.status === 401) {
        AuthModel.logout();
        throw new Error('Sesi Anda telah kedaluwarsa. Silakan login kembali.');
      }
      throw new Error(data.message || 'Gagal mengirimkan cerita baru.');
    }

    return data;
  }
}

export default StoryModel;

import DatabaseHelper from '../data/db';
import StoryModel from '../data/story-model';
import NotificationHelper from './notification';
import AuthModel from '../data/auth-model';

let isSyncing = false;

const SyncHelper = {
  init() {
    window.addEventListener('online', () => {
      NotificationHelper.info('Koneksi internet kembali! Memeriksa antrean sinkronisasi cerita...');
      this.processOutbox();
    });

    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('message', (event) => {
        if (event.data && event.data.type === 'SYNC_STORIES') {
          this.processOutbox();
        }
      });
    }

    // Periksa saat inisialisasi awal
    if (navigator.onLine) {
      setTimeout(() => this.processOutbox(), 1500);
    }
  },

  async registerBackgroundSync() {
    if ('serviceWorker' in navigator && 'SyncManager' in window) {
      try {
        const reg = await navigator.serviceWorker.ready;
        await reg.sync.register('sync-stories');
      } catch (err) {
        console.warn('Background sync registration not supported or failed:', err);
      }
    }
  },

  async processOutbox() {
    if (isSyncing || !navigator.onLine || !AuthModel.isAuthenticated()) {
      return;
    }

    try {
      isSyncing = true;
      const outboxStories = await DatabaseHelper.getOutboxStories();

      if (!outboxStories || outboxStories.length === 0) {
        return;
      }

      console.log(`Ditemukan ${outboxStories.length} cerita dalam antrean outbox offline.`);

      for (const item of outboxStories) {
        try {
          // Buat file dari blob jika tersimpan sebagai blob
          let photoFile = item.photo;
          if (item.photoBlob instanceof Blob) {
            photoFile = new File([item.photoBlob], item.photoName || 'story.jpg', {
              type: item.photoBlob.type || 'image/jpeg',
            });
          }

          await StoryModel.createStory({
            description: item.description,
            photo: photoFile,
            lat: item.lat,
            lon: item.lon,
          });

          await DatabaseHelper.deleteOutboxStory(item.id);
          NotificationHelper.success(`Sinkronisasi berhasil: Cerita "${item.description.substring(0, 20)}..." telah diunggah!`);
        } catch (uploadErr) {
          console.error('Gagal mengunggah item outbox:', uploadErr);
          // Berhenti jika masih offline / server error
          break;
        }
      }

      // Beritahu view aktif untuk memuat ulang daftar cerita
      window.dispatchEvent(new CustomEvent('stories-synced'));
    } catch (err) {
      console.error('Error saat memproses outbox:', err);
    } finally {
      isSyncing = false;
    }
  },
};

export default SyncHelper;

import DatabaseHelper from '../data/db';
import PushNotificationHelper from './push-notification-helper';
import SyncHelper from './sync-helper';
import NotificationHelper from './notification';
import ICONS from './icons';

class DiagnosticsModal {
  static #modalElement = null;

  static init() {
    if (this.#modalElement) return;

    const modal = document.createElement('div');
    modal.id = 'diagnostics-modal';
    modal.className = 'diagnostics-modal-backdrop';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.setAttribute('aria-labelledby', 'diagnostics-title');
    modal.style.display = 'none';

    modal.innerHTML = `
      <div class="diagnostics-modal-card">
        <header class="diagnostics-header">
          <div class="diagnostics-header-title">
            <span class="diagnostics-icon">${ICONS.sliders(20)}</span>
            <h2 id="diagnostics-title">Pusat Uji Fitur & Diagnostik</h2>
          </div>
          <button type="button" class="btn-close-diagnostics" aria-label="Tutup panel pengujian">
            ${ICONS.close(18)}
          </button>
        </header>

        <div class="diagnostics-body">
          <p class="diagnostics-desc">
            Panel interaktif untuk menguji background execution, push notification, status IndexedDB, dan sinkronisasi offline.
          </p>

          <!-- 1. PUSH NOTIFICATION TEST -->
          <div class="diag-section">
            <h3 class="diag-section-title">
              <span class="diag-section-icon">${ICONS.bell(16)}</span>
              1. Pengujian Web Push Notification
            </h3>
            <p class="diag-section-desc">Memicu simulasi push notification dengan action navigasi ke detail cerita.</p>
            <div class="diag-actions">
              <button type="button" id="diag-btn-push" class="btn btn-primary btn-sm">
                Kirim Notifikasi Uji Coba
              </button>
            </div>
          </div>

          <!-- 2. OFFLINE OUTBOX & SYNC -->
          <div class="diag-section">
            <h3 class="diag-section-title">
              <span class="diag-section-icon">${ICONS.refresh(16)}</span>
              2. Antrean Outbox & Sinkronisasi Offline
            </h3>
            <p class="diag-section-desc">
              Status antrean offline: <strong id="diag-outbox-count">0 cerita</strong>
            </p>
            <div class="diag-actions">
              <button type="button" id="diag-btn-mock-outbox" class="btn btn-outline-secondary btn-sm">
                + Tambah Mock Cerita ke Outbox
              </button>
              <button type="button" id="diag-btn-trigger-sync" class="btn btn-secondary btn-sm">
                Sinkronkan Outbox Sekarang
              </button>
            </div>
          </div>

          <!-- 3. STORAGE & CACHE STATUS -->
          <div class="diag-section">
            <h3 class="diag-section-title">
              <span class="diag-section-icon">${ICONS.layers(16)}</span>
              3. Status Penyimpanan Lokal & Cache
            </h3>
            <div class="diag-stats-grid">
              <div class="diag-stat-card">
                <span class="diag-stat-num" id="diag-cache-count">0</span>
                <span class="diag-stat-label">Cache Cerita API</span>
              </div>
              <div class="diag-stat-card">
                <span class="diag-stat-num" id="diag-fav-count">0</span>
                <span class="diag-stat-label">Cerita Tersimpan</span>
              </div>
              <div class="diag-stat-card">
                <span class="diag-stat-num" id="diag-net-status">Online</span>
                <span class="diag-stat-label">Status Jaringan</span>
              </div>
            </div>
          </div>
        </div>

        <footer class="diagnostics-footer">
          <button type="button" class="btn btn-secondary btn-sm btn-close-diagnostics">
            Tutup Panel
          </button>
        </footer>
      </div>
    `;

    document.body.appendChild(modal);
    this.#modalElement = modal;

    this.#bindEvents();
  }

  static async open() {
    this.init();
    await this.refreshStats();
    this.#modalElement.style.display = 'flex';
    document.body.classList.add('modal-open');
  }

  static close() {
    if (this.#modalElement) {
      this.#modalElement.style.display = 'none';
      document.body.classList.remove('modal-open');
    }
  }

  static async refreshStats() {
    if (!this.#modalElement) return;

    try {
      const outboxStories = await DatabaseHelper.getOutboxStories();
      const cachedStories = await DatabaseHelper.getCachedStories();
      const favStories = await DatabaseHelper.getFavoriteStories();

      const outboxEl = document.getElementById('diag-outbox-count');
      const cacheEl = document.getElementById('diag-cache-count');
      const favEl = document.getElementById('diag-fav-count');
      const netEl = document.getElementById('diag-net-status');

      if (outboxEl) outboxEl.textContent = `${outboxStories.length} cerita dalam antrean`;
      if (cacheEl) cacheEl.textContent = String(cachedStories.length);
      if (favEl) favEl.textContent = String(favStories.length);
      if (netEl) {
        netEl.textContent = navigator.onLine ? 'Online' : 'Offline';
        netEl.className = navigator.onLine ? 'diag-stat-num text-success' : 'diag-stat-num text-danger';
      }
    } catch (err) {
      console.warn('Gagal memuat diagnostik stats:', err);
    }
  }

  static #bindEvents() {
    const modal = this.#modalElement;
    if (!modal) return;

    modal.querySelectorAll('.btn-close-diagnostics').forEach((btn) => {
      btn.onclick = () => this.close();
    });

    modal.onclick = (e) => {
      if (e.target === modal) this.close();
    };

    // 1. Push test
    const pushBtn = document.getElementById('diag-btn-push');
    if (pushBtn) {
      pushBtn.onclick = async () => {
        await PushNotificationHelper.showTestNotification({
          title: 'DicoStory: Cerita Baru di Sekitar Anda!',
          body: 'Budi Santoso baru saja membagikan pesona matahari terbit di Gunung Bromo.',
          url: '#/',
        });
        NotificationHelper.success('Push notification berhasil dikirim!');
      };
    }

    // 2. Mock Outbox
    const mockBtn = document.getElementById('diag-btn-mock-outbox');
    if (mockBtn) {
      mockBtn.onclick = async () => {
        // Buat dummy 1x1 image blob
        const canvas = document.createElement('canvas');
        canvas.width = 100;
        canvas.height = 100;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#2563eb';
        ctx.fillRect(0, 0, 100, 100);

        canvas.toBlob(async (blob) => {
          await DatabaseHelper.saveOutboxStory({
            description: 'Uji coba cerita offline simulator ' + new Date().toLocaleTimeString(),
            photoBlob: blob,
            photoName: 'mock-story.jpg',
            lat: -6.2088,
            lon: 106.8456,
          });
          NotificationHelper.info('Mock cerita berhasil ditambahkan ke antrean outbox!');
          await this.refreshStats();
        }, 'image/jpeg');
      };
    }

    // 3. Trigger Sync
    const syncBtn = document.getElementById('diag-btn-trigger-sync');
    if (syncBtn) {
      syncBtn.onclick = async () => {
        NotificationHelper.info('Memulai sinkronisasi antrean outbox...');
        await SyncHelper.processOutbox();
        await this.refreshStats();
      };
    }
  }
}

export default DiagnosticsModal;

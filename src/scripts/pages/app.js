import routes from '../routes/routes';
import { getActiveRoute, parseActivePathname } from '../routes/url-parser';
import AuthModel from '../data/auth-model';
import { transitionHelper } from '../utils/view-transition';
import NotificationHelper from '../utils/notification';

import PushNotificationHelper from '../utils/push-notification-helper';
import ICONS from '../utils/icons';
import DiagnosticsModal from '../utils/diagnostics-modal';

class App {
  #content = null;
  #drawerButton = null;
  #navigationDrawer = null;
  #currentPresenter = null;

  constructor({ navigationDrawer, drawerButton, content }) {
    this.#content = content;
    this.#drawerButton = drawerButton;
    this.#navigationDrawer = navigationDrawer;

    this.#setupDrawer();
    this.#setupDiagnostics();
  }

  #setupDiagnostics() {
    const diagBtn = document.getElementById('btn-open-diagnostics');
    if (diagBtn) {
      diagBtn.addEventListener('click', () => {
        DiagnosticsModal.open();
      });
    }
  }

  #setupDrawer() {
    if (this.#drawerButton && this.#navigationDrawer) {
      this.#drawerButton.addEventListener('click', () => {
        const isOpen = this.#navigationDrawer.classList.toggle('open');
        this.#drawerButton.setAttribute('aria-expanded', String(isOpen));
      });

      document.body.addEventListener('click', (event) => {
        if (
          !this.#navigationDrawer.contains(event.target) &&
          !this.#drawerButton.contains(event.target)
        ) {
          this.#navigationDrawer.classList.remove('open');
          this.#drawerButton.setAttribute('aria-expanded', 'false');
        }

        this.#navigationDrawer.querySelectorAll('a, button').forEach((link) => {
          if (link.contains(event.target)) {
            this.#navigationDrawer.classList.remove('open');
            this.#drawerButton.setAttribute('aria-expanded', 'false');
          }
        });
      });
    }
  }

  async #updateNavigation() {
    const navList = document.getElementById('nav-list');
    if (!navList) return;

    const isAuth = AuthModel.isAuthenticated();
    const user = AuthModel.getUser();
    const isPushSubscribed = await PushNotificationHelper.isSubscribed();

    if (isAuth) {
      PushNotificationHelper.syncSubscriptionToServer();
      navList.innerHTML = `
        <li><a href="#/" class="nav-link">Beranda</a></li>
        <li><a href="#/saved" class="nav-link"><span class="nav-link-icon">${ICONS.bookmark(15)}</span> Tersimpan</a></li>
        <li><a href="#/add-story" class="nav-link"><span class="nav-link-icon">${ICONS.plus(15)}</span> Buat Cerita</a></li>
        <li><a href="#/about" class="nav-link">Tentang</a></li>
        <li>
          <button type="button" id="btn-toggle-push" class="btn btn-outline-secondary btn-sm nav-push-btn" aria-label="Aktifkan atau nonaktifkan push notifikasi">
            <span class="btn-icon">${isPushSubscribed ? ICONS.bell(15) : ICONS.bellOff(15)}</span>
            <span>${isPushSubscribed ? 'Notifikasi Aktif' : 'Notifikasi'}</span>
          </button>
        </li>
        <li class="nav-user-item">
          <span class="user-pill" title="Akun Masuk">
            <span class="user-icon">${ICONS.user(13)}</span>
            <span class="user-name">${user?.name || 'Pengguna'}</span>
          </span>
          <button type="button" id="btn-logout" class="btn btn-outline-danger btn-sm">Keluar</button>
        </li>
      `;

      const logoutBtn = document.getElementById('btn-logout');
      if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
          AuthModel.logout();
          NotificationHelper.info('Anda telah keluar dari aplikasi.');
          window.location.hash = '#/login';
        });
      }
    } else {
      navList.innerHTML = `
        <li><a href="#/" class="nav-link">Beranda</a></li>
        <li><a href="#/saved" class="nav-link"><span class="nav-link-icon">${ICONS.bookmark(15)}</span> Tersimpan</a></li>
        <li><a href="#/login" class="nav-link">Masuk</a></li>
        <li><a href="#/register" class="nav-link">Daftar Akun</a></li>
        <li><a href="#/about" class="nav-link">Tentang</a></li>
        <li>
          <button type="button" id="btn-toggle-push" class="btn btn-outline-secondary btn-sm nav-push-btn" aria-label="Aktifkan atau nonaktifkan push notifikasi">
            <span class="btn-icon">${isPushSubscribed ? ICONS.bell(15) : ICONS.bellOff(15)}</span>
            <span>${isPushSubscribed ? 'Notifikasi Aktif' : 'Notifikasi'}</span>
          </button>
        </li>
      `;
    }

    const pushBtn = document.getElementById('btn-toggle-push');
    if (pushBtn) {
      pushBtn.addEventListener('click', async () => {
        const currentlySubscribed = await PushNotificationHelper.isSubscribed();
        if (currentlySubscribed) {
          await PushNotificationHelper.unsubscribe();
          pushBtn.innerHTML = `
            <span class="btn-icon">${ICONS.bellOff(15)}</span>
            <span>Notifikasi</span>
          `;
        } else {
          const success = await PushNotificationHelper.subscribe();
          if (success) {
            pushBtn.innerHTML = `
              <span class="btn-icon">${ICONS.bell(15)}</span>
              <span>Notifikasi Aktif</span>
            `;
            // Tampilkan satu notifikasi sambutan untuk uji langsung
            await PushNotificationHelper.showTestNotification({
              title: 'DicoStory PWA Terhubung',
              body: 'Notifikasi berhasil diaktifkan. Anda siap menerima update cerita terbaru.',
              url: '#/',
            });
          }
        }
      });
    }
  }

  async renderPage() {
    const activeRouteKey = getActiveRoute();
    const parsedPath = parseActivePathname();
    const routeConfig = routes[activeRouteKey] || routes['/'];

    // Route Guard
    const isAuth = AuthModel.isAuthenticated();
    if (routeConfig.needAuth && !isAuth) {
      NotificationHelper.info('Silakan masuk terlebih dahulu untuk mengakses halaman ini.');
      window.location.hash = '#/login';
      return;
    }

    if (routeConfig.onlyGuest && isAuth) {
      window.location.hash = '#/';
      return;
    }

    // Bersihkan presenter halaman sebelumnya (penting untuk mematikan kamera & menghapus map)
    if (this.#currentPresenter && typeof this.#currentPresenter.destroy === 'function') {
      try {
        this.#currentPresenter.destroy();
      } catch (err) {
        console.warn('Gagal membersihkan presenter sebelumnya:', err);
      }
      this.#currentPresenter = null;
    }

    await this.#updateNavigation();

    // Inisialisasi View & Presenter baru
    const viewInstance = new routeConfig.view();
    const presenterInstance = new routeConfig.presenter(viewInstance, parsedPath.id);
    this.#currentPresenter = presenterInstance;

    // Kriteria 1 (Advance): Transisi Halaman dengan View Transition API
    await transitionHelper(async () => {
      this.#content.innerHTML = viewInstance.getTemplate();
      // Scroll to top saat pindah halaman
      window.scrollTo({ top: 0, behavior: 'instant' });
    });

    // Inisialisasi logika presenter setelah DOM ter-render
    await presenterInstance.init();

    // Pastikan fokus aksesibel pada konten utama
    this.#content.setAttribute('tabindex', '-1');
    this.#content.focus({ preventScroll: true });
  }
}

export default App;

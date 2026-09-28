import AuthModel from '../data/auth-model';
import PushNotificationHelper from '../utils/push-notification-helper';
import NotificationHelper from '../utils/notification';

class LoginPresenter {
  #view = null;

  constructor(view) {
    this.#view = view;
  }

  init() {
    this.#view.bindSubmit(async ({ email, password }) => {
      await this.#handleLogin(email, password);
    });

    this.#view.bindDemoLogin(async () => {
      await this.#handleDemoLogin();
    });
  }

  async #handleLogin(email, password) {
    this.#view.clearAlert();

    // Validasi dasar client-side
    if (!email || !email.includes('@')) {
      this.#view.showAlert('Silakan masukkan format email yang valid.');
      return;
    }
    if (!password || password.length < 8) {
      this.#view.showAlert('Kata sandi harus terdiri dari minimal 8 karakter.');
      return;
    }

    try {
      this.#view.showLoading(true);
      await AuthModel.login({ email, password });
      NotificationHelper.success('Login berhasil! Selamat datang di DicoStory.');
      
      // Sinkronkan push subscription ke API Dicoding jika browser sudah diizinkan
      PushNotificationHelper.syncSubscriptionToServer();

      // Arahkan ke beranda setelah berhasil login
      window.location.hash = '#/';
    } catch (err) {
      this.#view.showAlert(err.message || 'Terjadi kesalahan saat masuk.');
      NotificationHelper.error(err.message || 'Login gagal.');
    } finally {
      this.#view.showLoading(false);
    }
  }

  async #handleDemoLogin() {
    this.#view.clearAlert();
    this.#view.showLoading(true);

    const demoEmail = 'dicostory_user@dicoding.test';
    const demoPassword = 'password123';
    const demoName = 'Pengguna Demo';

    try {
      // Coba login langsung
      try {
        await AuthModel.login({ email: demoEmail, password: demoPassword });
      } catch {
        // Jika akun belum terdaftar, otomatis daftarkan akun demo
        await AuthModel.register({ name: demoName, email: demoEmail, password: demoPassword });
        await AuthModel.login({ email: demoEmail, password: demoPassword });
      }

      NotificationHelper.success('Berhasil masuk dengan akun demo!');
      window.location.hash = '#/';
    } catch (err) {
      this.#view.showAlert('Gagal menyiapkan akun demo otomatis. Silakan daftar manual di menu Daftar.');
      NotificationHelper.error(err.message || 'Gagal login demo.');
    } finally {
      this.#view.showLoading(false);
    }
  }
}

export default LoginPresenter;

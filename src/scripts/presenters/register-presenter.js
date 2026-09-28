import AuthModel from '../data/auth-model';
import NotificationHelper from '../utils/notification';

class RegisterPresenter {
  #view = null;

  constructor(view) {
    this.#view = view;
  }

  init() {
    this.#view.bindSubmit(async ({ name, email, password }) => {
      await this.#handleRegister(name, email, password);
    });
  }

  async #handleRegister(name, email, password) {
    this.#view.clearAlert();

    if (!name || name.trim().length === 0) {
      this.#view.showAlert('Nama lengkap wajib diisi.');
      return;
    }
    if (!email || !email.includes('@')) {
      this.#view.showAlert('Silakan masukkan email yang valid.');
      return;
    }
    if (!password || password.length < 8) {
      this.#view.showAlert('Kata sandi harus minimal 8 karakter.');
      return;
    }

    try {
      this.#view.showLoading(true);
      await AuthModel.register({ name, email, password });
      NotificationHelper.success('Registrasi berhasil! Silakan masuk dengan akun baru Anda.');
      window.location.hash = '#/login';
    } catch (err) {
      this.#view.showAlert(err.message || 'Terjadi kesalahan saat pendaftaran.');
      NotificationHelper.error(err.message || 'Registrasi gagal.');
    } finally {
      this.#view.showLoading(false);
    }
  }
}

export default RegisterPresenter;

class RegisterView {
  getTemplate() {
    return `
      <section class="auth-section container" aria-labelledby="register-heading">
        <div class="auth-card">
          <div class="auth-header">
            <h1 id="register-heading" class="auth-title">Daftar Akun Baru</h1>
            <p class="auth-subtitle">Bergabunglah dengan komunitas DicoStory dan bagikan kisah seru Anda.</p>
          </div>

          <div id="auth-alert" class="alert-box" role="alert" style="display: none;"></div>

          <form id="register-form" class="auth-form" novalidate>
            <div class="form-group">
              <label for="register-name" class="form-label">Nama Lengkap</label>
              <input
                type="text"
                id="register-name"
                name="name"
                class="form-control"
                placeholder="Contoh: Budi Santoso"
                required
                autocomplete="name"
              />
            </div>

            <div class="form-group">
              <label for="register-email" class="form-label">Alamat Email</label>
              <input
                type="email"
                id="register-email"
                name="email"
                class="form-control"
                placeholder="nama@email.com"
                required
                autocomplete="email"
              />
            </div>

            <div class="form-group">
              <label for="register-password" class="form-label">Kata Sandi</label>
              <input
                type="password"
                id="register-password"
                name="password"
                class="form-control"
                placeholder="Minimal 8 karakter"
                required
                minlength="8"
                autocomplete="new-password"
              />
              <small class="form-text">Kata sandi minimal 8 karakter demi keamanan akun Anda.</small>
            </div>

            <button type="submit" id="btn-register-submit" class="btn btn-primary btn-block">
              <span class="btn-text">Daftar Akun</span>
              <span class="btn-spinner" aria-hidden="true" style="display: none;"></span>
            </button>
          </form>

          <div class="auth-helper">
            <p>Sudah memiliki akun? <a href="#/login" class="link-primary">Masuk di sini</a></p>
          </div>
        </div>
      </section>
    `;
  }

  bindSubmit(handler) {
    const form = document.getElementById('register-form');
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('register-name').value;
        const email = document.getElementById('register-email').value;
        const password = document.getElementById('register-password').value;
        handler({ name, email, password });
      });
    }
  }

  showLoading(isLoading) {
    const btn = document.getElementById('btn-register-submit');
    if (!btn) return;
    const text = btn.querySelector('.btn-text');
    const spinner = btn.querySelector('.btn-spinner');

    btn.disabled = isLoading;
    if (isLoading) {
      text.textContent = 'Mendaftarkan...';
      if (spinner) spinner.style.display = 'inline-block';
    } else {
      text.textContent = 'Daftar Akun';
      if (spinner) spinner.style.display = 'none';
    }
  }

  showAlert(message, type = 'error') {
    const alertBox = document.getElementById('auth-alert');
    if (!alertBox) return;
    alertBox.textContent = message;
    alertBox.className = `alert-box alert-${type}`;
    alertBox.style.display = 'block';
  }

  clearAlert() {
    const alertBox = document.getElementById('auth-alert');
    if (alertBox) {
      alertBox.textContent = '';
      alertBox.style.display = 'none';
    }
  }
}

export default RegisterView;

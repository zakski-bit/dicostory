class LoginView {
  getTemplate() {
    return `
      <section class="auth-section container" aria-labelledby="login-heading">
        <div class="auth-card">
          <div class="auth-header">
            <h1 id="login-heading" class="auth-title">Masuk ke DicoStory</h1>
            <p class="auth-subtitle">Bagikan momen dan jelajahi cerita dari seluruh pelosok negeri.</p>
          </div>

          <div id="auth-alert" class="alert-box" role="alert" style="display: none;"></div>

          <form id="login-form" class="auth-form" novalidate>
            <div class="form-group">
              <label for="login-email" class="form-label">Alamat Email</label>
              <input
                type="email"
                id="login-email"
                name="email"
                class="form-control"
                placeholder="nama@email.com"
                required
                autocomplete="email"
              />
              <span id="email-error" class="field-error" aria-live="polite"></span>
            </div>

            <div class="form-group">
              <label for="login-password" class="form-label">Kata Sandi</label>
              <input
                type="password"
                id="login-password"
                name="password"
                class="form-control"
                placeholder="Minimal 8 karakter"
                required
                minlength="8"
                autocomplete="current-password"
              />
              <span id="password-error" class="field-error" aria-live="polite"></span>
            </div>

            <button type="submit" id="btn-login-submit" class="btn btn-primary btn-block">
              <span class="btn-text">Masuk</span>
              <span class="btn-spinner" aria-hidden="true" style="display: none;"></span>
            </button>

            <button type="button" id="btn-demo-login" class="btn btn-outline-secondary btn-block mt-3">
              Masuk Cepat dengan Akun Demo
            </button>
          </form>

          <div class="auth-helper">
            <p>Belum memiliki akun? <a href="#/register" class="link-primary">Daftar sekarang</a></p>
          </div>
        </div>
      </section>
    `;
  }

  bindSubmit(handler) {
    const form = document.getElementById('login-form');
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;
        handler({ email, password });
      });
    }
  }

  bindDemoLogin(handler) {
    const btn = document.getElementById('btn-demo-login');
    if (btn) {
      btn.addEventListener('click', () => {
        handler();
      });
    }
  }

  showLoading(isLoading) {
    const btn = document.getElementById('btn-login-submit');
    if (!btn) return;
    const text = btn.querySelector('.btn-text');
    const spinner = btn.querySelector('.btn-spinner');

    btn.disabled = isLoading;
    if (isLoading) {
      text.textContent = 'Memproses...';
      if (spinner) spinner.style.display = 'inline-block';
    } else {
      text.textContent = 'Masuk';
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

export default LoginView;

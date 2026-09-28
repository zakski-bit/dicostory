class NotificationHelper {
  static #container = null;

  static #getContainer() {
    if (!this.#container) {
      let el = document.getElementById('toast-container');
      if (!el) {
        el = document.createElement('div');
        el.id = 'toast-container';
        el.className = 'toast-container';
        el.setAttribute('aria-live', 'polite');
        el.setAttribute('aria-atomic', 'true');
        document.body.appendChild(el);
      }
      this.#container = el;
    }
    return this.#container;
  }

  static show(message, type = 'info', duration = 3500) {
    const container = this.#getContainer();
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.setAttribute('role', type === 'error' ? 'alert' : 'status');

    const iconSvg = type === 'success' 
      ? '<span class="toast-icon" aria-hidden="true">✓</span>' 
      : type === 'error' 
        ? '<span class="toast-icon" aria-hidden="true">✕</span>' 
        : '<span class="toast-icon" aria-hidden="true">ℹ</span>';

    toast.innerHTML = `
      ${iconSvg}
      <span class="toast-text">${message}</span>
      <button class="toast-close" type="button" aria-label="Tutup notifikasi">×</button>
    `;

    const closeBtn = toast.querySelector('.toast-close');
    const removeToast = () => {
      toast.classList.add('hide');
      setTimeout(() => toast.remove(), 250);
    };

    closeBtn.addEventListener('click', removeToast);
    container.appendChild(toast);

    if (duration > 0) {
      setTimeout(removeToast, duration);
    }
  }

  static success(msg) {
    this.show(msg, 'success');
  }

  static error(msg) {
    this.show(msg, 'error', 4500);
  }

  static info(msg) {
    this.show(msg, 'info');
  }
}

export default NotificationHelper;

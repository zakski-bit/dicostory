import NotificationHelper from './notification';

let deferredPrompt = null;

const InstallHelper = {
  init() {
    const installBtn = document.getElementById('btn-install-pwa');

    window.addEventListener('beforeinstallprompt', (event) => {
      event.preventDefault();
      deferredPrompt = event;

      if (installBtn) {
        installBtn.classList.remove('hidden');
        installBtn.onclick = async () => {
          if (!deferredPrompt) return;
          deferredPrompt.prompt();
          const { outcome } = await deferredPrompt.userChoice;
          if (outcome === 'accepted') {
            NotificationHelper.success('Terima kasih telah memasang DicoStory di perangkat Anda!');
          }
          deferredPrompt = null;
          installBtn.classList.add('hidden');
        };
      }
    });

    window.addEventListener('appinstalled', () => {
      deferredPrompt = null;
      if (installBtn) {
        installBtn.classList.add('hidden');
      }
      NotificationHelper.success('DicoStory berhasil dipasang sebagai aplikasi desktop/mobile!');
    });
  },
};

export default InstallHelper;

// CSS imports
import '../styles/styles.css';
import '../styles/transitions.css';

import App from './pages/app';
import swRegister from './utils/sw-register';
import InstallHelper from './utils/install-helper';
import SyncHelper from './utils/sync-helper';

document.addEventListener('DOMContentLoaded', async () => {
  const app = new App({
    content: document.querySelector('#main-content'),
    drawerButton: document.querySelector('#drawer-button'),
    navigationDrawer: document.querySelector('#navigation-drawer'),
  });

  // Inisialisasi Service Worker, Install PWA, dan Offline Sync
  await swRegister();
  InstallHelper.init();
  SyncHelper.init();

  await app.renderPage();

  window.addEventListener('hashchange', async () => {
    await app.renderPage();
  });
});

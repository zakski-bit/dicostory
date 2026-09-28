import NotificationHelper from './notification';
import ENDPOINTS from '../data/api';
import AuthModel from '../data/auth-model';

// Dicoding VAPID Public Key Resmi Sesuai Dokumentasi Dicoding
const VAPID_PUBLIC_KEY = 'BCCs2eonMI-6H2ctvFaWg-UYdDv387Vno_bzUzALpB442r2lCnsHmtrx8biyPi_E-1fSGABK_Qs_GlvPoJJqxbk';

function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

const PushNotificationHelper = {
  isSupported() {
    return 'serviceWorker' in navigator && 'PushManager' in window && 'Notification' in window;
  },

  async getRegistration() {
    if (!('serviceWorker' in navigator)) return null;
    return navigator.serviceWorker.ready;
  },

  async isSubscribed() {
    if (!this.isSupported()) return false;
    try {
      const reg = await this.getRegistration();
      if (!reg) return false;
      const subscription = await reg.pushManager.getSubscription();
      return Boolean(subscription);
    } catch (err) {
      console.warn('Gagal memeriksa status langganan notifikasi:', err);
      return false;
    }
  },

  async subscribe() {
    if (!this.isSupported()) {
      NotificationHelper.error('Browser ini tidak mendukung Push Notification.');
      return false;
    }

    const permission = await Notification.requestPermission();
    if (permission !== 'granted') {
      NotificationHelper.warning('Izin notifikasi tidak diberikan atau ditolak.');
      return false;
    }

    try {
      const reg = await this.getRegistration();
      if (!reg) throw new Error('Service Worker belum siap.');

      const convertedKey = urlBase64ToUint8Array(VAPID_PUBLIC_KEY);
      const subscribeOptions = {
        userVisibleOnly: true,
        applicationServerKey: convertedKey,
      };

      const subscription = await reg.pushManager.subscribe(subscribeOptions);
      console.log('Push subscription browser berhasil didapatkan:', subscription);

      // Kirim data subscription ke backend API Dicoding: POST /notifications/subscribe
      await this.sendSubscriptionToServer(subscription);

      NotificationHelper.success('Push Notification berhasil diaktifkan dan terhubung ke server!');
      return true;
    } catch (err) {
      console.error('Gagal berlangganan push notification:', err);
      NotificationHelper.error(err.message || 'Gagal mengaktifkan push notification.');
      return false;
    }
  },

  async sendSubscriptionToServer(subscription) {
    if (!subscription) return;

    const token = AuthModel.getToken();
    if (!token) {
      console.warn('Pengguna belum login. Data langganan akan disinkronkan saat login.');
      return;
    }

    const subJson = subscription.toJSON();
    const payload = {
      endpoint: subscription.endpoint,
      keys: {
        p256dh: subJson.keys?.p256dh,
        auth: subJson.keys?.auth,
      },
    };

    const response = await fetch(ENDPOINTS.NOTIFICATIONS_SUBSCRIBE, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    if (!response.ok || data.error) {
      throw new Error(data.message || 'Gagal mendaftarkan subscription ke API Dicoding.');
    }

    console.log('Berhasil mendaftarkan langganan push ke API Dicoding:', data);
  },

  async syncSubscriptionToServer() {
    if (!this.isSupported()) return;
    try {
      const reg = await this.getRegistration();
      if (!reg) return;
      const subscription = await reg.pushManager.getSubscription();
      if (subscription && AuthModel.isAuthenticated()) {
        await this.sendSubscriptionToServer(subscription);
      }
    } catch (err) {
      console.warn('Gagal sinkronisasi push subscription ke server:', err);
    }
  },

  async unsubscribe() {
    if (!this.isSupported()) return false;
    try {
      const reg = await this.getRegistration();
      if (!reg) return false;
      const subscription = await reg.pushManager.getSubscription();
      if (subscription) {
        // Beritahu backend Dicoding untuk menghapus langganan: DELETE /notifications/subscribe
        const token = AuthModel.getToken();
        if (token) {
          try {
            await fetch(ENDPOINTS.NOTIFICATIONS_SUBSCRIBE, {
              method: 'DELETE',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({ endpoint: subscription.endpoint }),
            });
            console.log('Berhasil menghapus langganan dari API Dicoding.');
          } catch (apiErr) {
            console.warn('Gagal menghapus langganan dari server:', apiErr);
          }
        }

        await subscription.unsubscribe();
      }
      NotificationHelper.info('Push Notification dinonaktifkan.');
      return true;
    } catch (err) {
      console.error('Gagal membatalkan langganan push:', err);
      NotificationHelper.error('Gagal menonaktifkan notifikasi.');
      return false;
    }
  },

  async showTestNotification({ title = 'DicoStory: Cerita Baru!', body = 'Rian baru saja membagikan kisah seru dari Danau Toba!', url = '#/' } = {}) {
    if (!('Notification' in window)) {
      NotificationHelper.warning('Notifikasi tidak didukung pada perangkat ini.');
      return;
    }

    if (Notification.permission !== 'granted') {
      const permission = await Notification.requestPermission();
      if (permission !== 'granted') {
        NotificationHelper.warning('Silakan izinkan notifikasi terlebih dahulu.');
        return;
      }
    }

    const reg = await this.getRegistration();
    const options = {
      body,
      icon: '/images/icons/icon-192x192.png',
      badge: '/images/icons/icon-72x72.png',
      vibrate: [100, 50, 100],
      data: {
        url,
        timestamp: Date.now(),
      },
      actions: [
        { action: 'open_detail', title: '👀 Buka Sekarang' },
      ],
    };

    if (reg && reg.showNotification) {
      await reg.showNotification(title, options);
    } else {
      new Notification(title, options);
    }

    NotificationHelper.success('Notifikasi simulasi berhasil dikirim!');
  },
};

export default PushNotificationHelper;

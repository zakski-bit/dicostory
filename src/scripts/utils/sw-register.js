const swRegister = async () => {
  if (!('serviceWorker' in navigator)) {
    console.log('Service Worker tidak didukung pada peramban ini.');
    return;
  }

  try {
    const registration = await navigator.serviceWorker.register('./sw.js');
    console.log('Service Worker berhasil didaftarkan:', registration);
  } catch (error) {
    console.error('Gagal mendaftarkan Service Worker:', error);
  }
};

export default swRegister;

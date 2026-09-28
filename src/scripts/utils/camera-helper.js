class CameraHelper {
  #stream = null;
  #videoElement = null;

  constructor(videoElement) {
    this.#videoElement = videoElement;
  }

  get isStreaming() {
    return !!this.#stream && this.#stream.active;
  }

  async startCamera(constraints = { video: { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 720 } } }) {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      throw new Error('Peramban Anda tidak mendukung akses kamera (Media Capture API).');
    }

    // Pastikan stream sebelumnya dihentikan jika ada
    this.stopCamera();

    try {
      this.#stream = await navigator.mediaDevices.getUserMedia(constraints);
      if (this.#videoElement) {
        this.#videoElement.srcObject = this.#stream;
        await this.#videoElement.play();
      }
      return this.#stream;
    } catch (err) {
      this.stopCamera();
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        throw new Error('Izin akses kamera ditolak. Silakan izinkan akses kamera di pengaturan peramban Anda.');
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        throw new Error('Kamera tidak ditemukan pada perangkat Anda.');
      }
      throw new Error(`Gagal membuka kamera: ${err.message}`);
    }
  }

  takeSnapshot() {
    if (!this.#videoElement || !this.isStreaming) {
      throw new Error('Kamera belum aktif untuk mengambil foto.');
    }

    const video = this.#videoElement;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;

    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    return new Promise((resolve, reject) => {
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error('Gagal mengonversi frame kamera ke gambar.'));
            return;
          }
          const file = new File([blob], `capture-${Date.now()}.jpg`, {
            type: 'image/jpeg',
            lastModified: Date.now(),
          });
          const previewUrl = URL.createObjectURL(blob);
          resolve({ file, blob, previewUrl });
        },
        'image/jpeg',
        0.85
      );
    });
  }

  stopCamera() {
    if (this.#stream) {
      this.#stream.getTracks().forEach((track) => {
        try {
          track.stop();
        } catch {
          // Abaikan kesalahan saat menghentikan track
        }
      });
      this.#stream = null;
    }

    if (this.#videoElement) {
      this.#videoElement.srcObject = null;
    }
  }
}

export default CameraHelper;

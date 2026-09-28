import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import CONFIG from '../config';
import StoryModel from '../data/story-model';
import DatabaseHelper from '../data/db';
import SyncHelper from '../utils/sync-helper';
import CameraHelper from '../utils/camera-helper';
import NotificationHelper from '../utils/notification';

class AddStoryPresenter {
  #view = null;
  #map = null;
  #marker = null;
  #cameraHelper = null;
  #selectedFile = null;
  #previewUrl = null;
  #selectedLat = null;
  #selectedLon = null;

  constructor(view) {
    this.#view = view;
  }

  async init() {
    this.#view.bindTabs();
    this.#initPickerMap();
    this.#setupFileUpload();
    this.#setupCameraControls();
    this.#setupLocationButtons();
    this.#setupDescriptionCount();
    this.#setupFormSubmit();
  }

  #initPickerMap() {
    const mapContainer = document.getElementById('picker-map');
    if (!mapContainer) return;

    if (this.#map) {
      this.#map.remove();
      this.#map = null;
    }

    // Peta pemilih koordinat berpusat di Indonesia
    this.#map = L.map('picker-map', {
      center: CONFIG.DEFAULT_MAP_COORDINATES,
      zoom: CONFIG.DEFAULT_MAP_ZOOM,
    });

    // Pasang tile layer OpenStreetMap
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; OpenStreetMap kontributor',
    }).addTo(this.#map);

    // Kriteria 3: Pemilihan nilai latitude dan longitude dilakukan melalui event klik di peta digital
    this.#map.on('click', (e) => {
      const { lat, lng } = e.latlng;
      this.#setMarkerPosition(lat, lng);
    });

    setTimeout(() => {
      if (this.#map) {
        this.#map.invalidateSize();
      }
    }, 250);
  }

  #setMarkerPosition(lat, lng) {
    this.#selectedLat = lat;
    this.#selectedLon = lng;

    if (this.#marker) {
      this.#marker.setLatLng([lat, lng]);
    } else {
      this.#marker = L.marker([lat, lng], { draggable: true });
      this.#marker.addTo(this.#map);

      this.#marker.on('dragend', (event) => {
        const position = event.target.getLatLng();
        this.#selectedLat = position.lat;
        this.#selectedLon = position.lng;
        this.#view.setCoordinates(position.lat, position.lng);
      });
    }

    this.#marker.bindPopup(`📍 Lokasi Terpilih:<br>Lat: ${lat.toFixed(5)}<br>Lon: ${lng.toFixed(5)}`).openPopup();
    this.#view.setCoordinates(lat, lng);
  }

  #setupFileUpload() {
    const fileInput = document.getElementById('story-image-file');
    const removeBtn = document.getElementById('btn-remove-image');

    if (fileInput) {
      fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
          this.#processSelectedImage(file);
        }
      });
    }

    if (removeBtn) {
      removeBtn.addEventListener('click', () => {
        this.#clearSelectedImage();
      });
    }
  }

  #processSelectedImage(file) {
    if (!file.type.startsWith('image/')) {
      NotificationHelper.error('Berkas yang dipilih harus berupa gambar (JPG, PNG, atau WebP).');
      return;
    }

    if (file.size > CONFIG.MAX_IMAGE_SIZE) {
      NotificationHelper.error('Ukuran gambar melebihi 1 MB. Silakan pilih foto dengan resolusi lebih rendah.');
      return;
    }

    this.#selectedFile = file;

    if (this.#previewUrl) {
      URL.revokeObjectURL(this.#previewUrl);
    }

    this.#previewUrl = URL.createObjectURL(file);
    this.#view.showPreview(this.#previewUrl);
    NotificationHelper.info('Foto berhasil dipilih.');
  }

  #clearSelectedImage() {
    this.#selectedFile = null;
    if (this.#previewUrl) {
      URL.revokeObjectURL(this.#previewUrl);
      this.#previewUrl = null;
    }

    const fileInput = document.getElementById('story-image-file');
    if (fileInput) fileInput.value = '';

    this.#view.hidePreview();
  }

  #setupCameraControls() {
    const video = document.getElementById('camera-video');
    const placeholder = document.getElementById('camera-placeholder');
    const btnStart = document.getElementById('btn-start-camera');
    const btnCapture = document.getElementById('btn-capture-camera');
    const btnStop = document.getElementById('btn-stop-camera');

    this.#cameraHelper = new CameraHelper(video);

    if (btnStart) {
      btnStart.addEventListener('click', async () => {
        try {
          btnStart.disabled = true;
          btnStart.textContent = 'Menyalakan...';
          await this.#cameraHelper.startCamera();

          if (placeholder) placeholder.style.display = 'none';
          if (btnStart) btnStart.style.display = 'none';
          if (btnCapture) btnCapture.style.display = 'inline-block';
          if (btnStop) btnStop.style.display = 'inline-block';
          NotificationHelper.info('Kamera aktif. Arahkan kamera dan klik "Potret Gambar".');
        } catch (err) {
          NotificationHelper.error(err.message);
        } finally {
          btnStart.disabled = false;
          btnStart.textContent = 'Aktifkan Kamera';
        }
      });
    }

    if (btnCapture) {
      btnCapture.addEventListener('click', async () => {
        try {
          const result = await this.#cameraHelper.takeSnapshot();
          this.#selectedFile = result.file;
          this.#previewUrl = result.previewUrl;
          this.#view.showPreview(result.previewUrl);

          // PENTING (Kriteria 3 Advance): Hentikan media stream setelah foto berhasil diambil
          this.#stopCameraStream();
          NotificationHelper.success('Foto dari kamera berhasil diambil!');
        } catch (err) {
          NotificationHelper.error(err.message);
        }
      });
    }

    if (btnStop) {
      btnStop.addEventListener('click', () => {
        this.#stopCameraStream();
        NotificationHelper.info('Kamera telah dimatikan.');
      });
    }
  }

  #stopCameraStream() {
    if (this.#cameraHelper) {
      this.#cameraHelper.stopCamera();
    }

    const placeholder = document.getElementById('camera-placeholder');
    const btnStart = document.getElementById('btn-start-camera');
    const btnCapture = document.getElementById('btn-capture-camera');
    const btnStop = document.getElementById('btn-stop-camera');

    if (placeholder) placeholder.style.display = 'flex';
    if (btnStart) btnStart.style.display = 'inline-block';
    if (btnCapture) btnCapture.style.display = 'none';
    if (btnStop) btnStop.style.display = 'none';
  }

  #setupLocationButtons() {
    const btnCurrent = document.getElementById('btn-current-location');
    const btnClear = document.getElementById('btn-clear-location');

    if (btnCurrent) {
      btnCurrent.addEventListener('click', () => {
        if (!navigator.geolocation) {
          NotificationHelper.error('Geolokasi tidak didukung oleh peramban Anda.');
          return;
        }

        btnCurrent.disabled = true;
        btnCurrent.textContent = 'Mencari lokasi...';

        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            this.#setMarkerPosition(latitude, longitude);
            if (this.#map) {
              this.#map.flyTo([latitude, longitude], 14);
            }
            btnCurrent.disabled = false;
            btnCurrent.textContent = '📍 Gunakan Lokasi Saat Ini (GPS)';
            NotificationHelper.success('Lokasi saat ini berhasil ditemukan!');
          },
          (err) => {
            btnCurrent.disabled = false;
            btnCurrent.textContent = '📍 Gunakan Lokasi Saat Ini (GPS)';
            NotificationHelper.error(`Gagal mendapatkan lokasi GPS: ${err.message}`);
          },
          { enableHighAccuracy: true, timeout: 10000 }
        );
      });
    }

    if (btnClear) {
      btnClear.addEventListener('click', () => {
        this.#selectedLat = null;
        this.#selectedLon = null;
        if (this.#marker) {
          this.#marker.remove();
          this.#marker = null;
        }
        this.#view.setCoordinates(null, null);
        NotificationHelper.info('Pilihan lokasi telah dibersihkan.');
      });
    }
  }

  #setupDescriptionCount() {
    const textarea = document.getElementById('story-description');
    const countLabel = document.getElementById('char-count');

    if (textarea && countLabel) {
      textarea.addEventListener('input', () => {
        const length = textarea.value.length;
        countLabel.textContent = `${length} karakter`;
      });
    }
  }

  #setupFormSubmit() {
    const form = document.getElementById('add-story-form');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      this.#view.clearAlert();

      const description = document.getElementById('story-description').value;

      // Validasi input form
      if (!this.#selectedFile) {
        this.#view.showAlert('Harap pilih foto cerita terlebih dahulu (melalui upload atau kamera).');
        NotificationHelper.error('Foto cerita wajib diunggah.');
        return;
      }

      if (!description || description.trim().length < 10) {
        this.#view.showAlert('Deskripsi cerita minimal 10 karakter.');
        NotificationHelper.error('Deskripsi cerita terlalu pendek.');
        return;
      }

      try {
        this.#view.showLoading(true);

        // Kriteria 4 (Advance): Deteksi kondisi offline dan simpan ke antrean IndexedDB Outbox
        if (!navigator.onLine) {
          await DatabaseHelper.saveOutboxStory({
            description,
            photoBlob: this.#selectedFile,
            photoName: this.#selectedFile.name || 'story.jpg',
            lat: this.#selectedLat,
            lon: this.#selectedLon,
          });
          await SyncHelper.registerBackgroundSync();
          this.#stopCameraStream();
          NotificationHelper.info('Mode Offline: Cerita disimpan ke antrean lokal (Outbox) dan akan otomatis dikirim saat online kembali!');
          window.location.hash = '#/';
          return;
        }

        try {
          await StoryModel.createStory({
            description,
            photo: this.#selectedFile,
            lat: this.#selectedLat,
            lon: this.#selectedLon,
          });

          this.#stopCameraStream();
          NotificationHelper.success('Cerita baru Anda berhasil diterbitkan!');
          window.location.hash = '#/';
        } catch (postErr) {
          // Jika koneksi terputus saat request berlangsung
          if (!navigator.onLine || postErr.message.includes('fetch') || postErr.name === 'TypeError') {
            await DatabaseHelper.saveOutboxStory({
              description,
              photoBlob: this.#selectedFile,
              photoName: this.#selectedFile.name || 'story.jpg',
              lat: this.#selectedLat,
              lon: this.#selectedLon,
            });
            await SyncHelper.registerBackgroundSync();
            this.#stopCameraStream();
            NotificationHelper.info('Koneksi terputus: Cerita tersimpan di antrean Outbox dan akan disinkronkan saat terhubung kembali.');
            window.location.hash = '#/';
            return;
          }
          throw postErr;
        }
      } catch (err) {
        this.#view.showAlert(err.message || 'Gagal menerbitkan cerita.');
        NotificationHelper.error(err.message || 'Gagal mengirimkan cerita.');
      } finally {
        this.#view.showLoading(false);
      }
    });
  }

  destroy() {
    // PENTING: Tutup media stream kamera saat berpindah halaman
    this.#stopCameraStream();

    if (this.#previewUrl) {
      URL.revokeObjectURL(this.#previewUrl);
      this.#previewUrl = null;
    }

    if (this.#map) {
      this.#map.remove();
      this.#map = null;
    }
    this.#marker = null;
  }
}

export default AddStoryPresenter;

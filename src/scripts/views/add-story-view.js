import { ICONS } from '../utils/icons';

class AddStoryView {
  getTemplate() {
    return `
      <section class="add-story-section container" aria-labelledby="add-story-heading">
        <div class="add-story-card">
          <div class="card-header">
            <h1 id="add-story-heading" class="page-title">Bagikan Cerita Baru</h1>
            <p class="page-subtitle">Abadikan momen Anda dengan foto, cerita inspiratif, dan tandai lokasinya di peta.</p>
          </div>

          <div id="form-alert" class="alert-box" role="alert" style="display: none;"></div>

          <form id="add-story-form" class="story-form" novalidate>
            <!-- PILIHAN MEDIA GAMBAR -->
            <fieldset class="form-fieldset">
              <legend class="form-legend">Foto Cerita <span class="required">*</span></legend>
              <p class="fieldset-desc">Pilih salah satu metode: unggah berkas gambar dari perangkat Anda atau potret langsung menggunakan kamera.</p>

              <div class="media-tabs" role="tablist" aria-label="Metode Pemilihan Gambar">
                <button
                  type="button"
                  id="tab-upload"
                  class="btn-tab active"
                  role="tab"
                  aria-selected="true"
                  aria-controls="panel-upload"
                >
                  ${ICONS.upload(15)} Unggah Berkas
                </button>
                <button
                  type="button"
                  id="tab-camera"
                  class="btn-tab"
                  role="tab"
                  aria-selected="false"
                  aria-controls="panel-camera"
                >
                  ${ICONS.camera(15)} Ambil via Kamera
                </button>
              </div>

              <!-- PANEL UNGGAH FILE -->
              <div id="panel-upload" class="media-panel active" role="tabpanel" aria-labelledby="tab-upload">
                <div class="upload-dropzone" id="dropzone">
                  <input
                    type="file"
                    id="story-image-file"
                    name="photo"
                    accept="image/png, image/jpeg, image/jpg, image/webp"
                    class="file-input-hidden"
                  />
                  <label for="story-image-file" class="dropzone-label">
                    <span class="dropzone-icon" aria-hidden="true">${ICONS.upload(36)}</span>
                    <span class="dropzone-text">Pilih berkas gambar atau seret file ke sini</span>
                    <span class="dropzone-hint">Format JPG, PNG, atau WebP (Maksimal 1 MB)</span>
                  </label>
                </div>
              </div>

              <!-- PANEL KAMERA STREAM -->
              <div id="panel-camera" class="media-panel" role="tabpanel" aria-labelledby="tab-camera" style="display: none;">
                <div class="camera-container">
                  <div class="camera-viewport-box">
                    <video id="camera-video" class="camera-video" playsinline autoplay muted></video>
                    <div id="camera-placeholder" class="camera-placeholder">
                      <span class="camera-icon" aria-hidden="true">${ICONS.camera(36)}</span>
                      <p>Kamera belum diaktifkan</p>
                    </div>
                  </div>

                  <div class="camera-controls">
                    <button type="button" id="btn-start-camera" class="btn btn-outline-primary btn-sm">
                      ${ICONS.camera(14)} Aktifkan Kamera
                    </button>
                    <button type="button" id="btn-capture-camera" class="btn btn-primary btn-sm" style="display: none;">
                      ${ICONS.camera(14)} Potret Gambar
                    </button>
                    <button type="button" id="btn-stop-camera" class="btn btn-danger btn-sm" style="display: none;">
                      ${ICONS.close(14)} Matikan Kamera
                    </button>
                  </div>
                </div>
              </div>

              <!-- PREVIEW GAMBAR TERPILIH -->
              <div id="image-preview-container" class="preview-box" style="display: none;">
                <p class="preview-title">Foto Terpilih:</p>
                <div class="preview-img-wrapper">
                  <img id="image-preview" src="" alt="Pratinjau foto yang akan diunggah" class="image-preview" />
                  <button type="button" id="btn-remove-image" class="btn-remove-preview" aria-label="Hapus foto terpilih">
                    ${ICONS.close(14)}
                  </button>
                </div>
              </div>
              <span id="photo-error" class="field-error" aria-live="polite"></span>
            </fieldset>

            <!-- DESKRIPSI CERITA -->
            <div class="form-group">
              <label for="story-description" class="form-label">
                Deskripsi Cerita <span class="required">*</span>
              </label>
              <textarea
                id="story-description"
                name="description"
                rows="4"
                class="form-control"
                placeholder="Ceritakan pengalaman berkesan, suasana tempat, atau kisah menarik Anda..."
                required
                minlength="10"
              ></textarea>
              <div class="char-count-wrapper">
                <span id="desc-error" class="field-error" aria-live="polite"></span>
                <span id="char-count" class="char-count">0 karakter</span>
              </div>
            </div>

            <!-- KOORDINAT PETA -->
            <fieldset class="form-fieldset">
              <legend class="form-legend">Lokasi Cerita pada Peta (Opsional)</legend>
              <p class="fieldset-desc">Klik titik mana pun pada peta untuk menentukan koordinat lokasi cerita Anda.</p>

              <div class="geo-actions-bar">
                <button type="button" id="btn-current-location" class="btn btn-outline-secondary btn-sm">
                  ${ICONS.mapPin(14)} Gunakan Lokasi Saat Ini (GPS)
                </button>
                <button type="button" id="btn-clear-location" class="btn btn-outline-secondary btn-sm" style="display: none;">
                  ${ICONS.close(14)} Hapus Lokasi
                </button>
              </div>

              <div id="picker-map" class="picker-map" role="region" aria-label="Peta pemilih koordinat lokasi cerita"></div>

              <div class="coordinates-grid">
                <div class="form-group">
                  <label for="story-lat" class="form-label">Latitude</label>
                  <input
                    type="text"
                    id="story-lat"
                    name="lat"
                    class="form-control coord-input"
                    placeholder="Contoh: -6.2088"
                    readonly
                  />
                </div>
                <div class="form-group">
                  <label for="story-lon" class="form-label">Longitude</label>
                  <input
                    type="text"
                    id="story-lon"
                    name="lon"
                    class="form-control coord-input"
                    placeholder="Contoh: 106.8456"
                    readonly
                  />
                </div>
              </div>
            </fieldset>

            <!-- SUBMIT BUTTON -->
            <div class="form-footer">
              <a href="#/" class="btn btn-secondary">Batal</a>
              <button type="submit" id="btn-submit-story" class="btn btn-primary btn-lg">
                <span class="btn-text">${ICONS.upload(15)} Terbitkan Cerita</span>
                <span class="btn-spinner" aria-hidden="true" style="display: none;"></span>
              </button>
            </div>
          </form>
        </div>
      </section>
    `;
  }

  bindTabs() {
    const tabUpload = document.getElementById('tab-upload');
    const tabCamera = document.getElementById('tab-camera');
    const panelUpload = document.getElementById('panel-upload');
    const panelCamera = document.getElementById('panel-camera');

    if (tabUpload && tabCamera && panelUpload && panelCamera) {
      tabUpload.addEventListener('click', () => {
        tabUpload.classList.add('active');
        tabUpload.setAttribute('aria-selected', 'true');
        tabCamera.classList.remove('active');
        tabCamera.setAttribute('aria-selected', 'false');

        panelUpload.style.display = 'block';
        panelCamera.style.display = 'none';
      });

      tabCamera.addEventListener('click', () => {
        tabCamera.classList.add('active');
        tabCamera.setAttribute('aria-selected', 'true');
        tabUpload.classList.remove('active');
        tabUpload.setAttribute('aria-selected', 'false');

        panelCamera.style.display = 'block';
        panelUpload.style.display = 'none';
      });
    }
  }

  showPreview(imageUrl) {
    const container = document.getElementById('image-preview-container');
    const img = document.getElementById('image-preview');
    if (container && img) {
      img.src = imageUrl;
      container.style.display = 'block';
    }
  }

  hidePreview() {
    const container = document.getElementById('image-preview-container');
    const img = document.getElementById('image-preview');
    if (container && img) {
      img.src = '';
      container.style.display = 'none';
    }
  }

  setCoordinates(lat, lon) {
    const latInput = document.getElementById('story-lat');
    const lonInput = document.getElementById('story-lon');
    const clearBtn = document.getElementById('btn-clear-location');

    if (latInput && lonInput) {
      latInput.value = lat !== null && lat !== undefined ? Number(lat).toFixed(6) : '';
      lonInput.value = lon !== null && lon !== undefined ? Number(lon).toFixed(6) : '';
    }

    if (clearBtn) {
      clearBtn.style.display = lat !== null ? 'inline-flex' : 'none';
    }
  }

  showLoading(isLoading) {
    const btn = document.getElementById('btn-submit-story');
    if (!btn) return;
    const text = btn.querySelector('.btn-text');
    const spinner = btn.querySelector('.btn-spinner');

    btn.disabled = isLoading;
    if (isLoading) {
      text.textContent = 'Menerbitkan Cerita...';
      if (spinner) spinner.style.display = 'inline-block';
    } else {
      text.innerHTML = `${ICONS.upload(15)} Terbitkan Cerita`;
      if (spinner) spinner.style.display = 'none';
    }
  }

  showAlert(message, type = 'error') {
    const alertBox = document.getElementById('form-alert');
    if (!alertBox) return;
    alertBox.textContent = message;
    alertBox.className = `alert-box alert-${type}`;
    alertBox.style.display = 'block';
    alertBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  clearAlert() {
    const alertBox = document.getElementById('form-alert');
    if (alertBox) {
      alertBox.textContent = '';
      alertBox.style.display = 'none';
    }
  }
}

export default AddStoryView;

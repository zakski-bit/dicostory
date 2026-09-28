class AboutPresenter {
  #view = null;

  constructor(view) {
    this.#view = view;
  }

  async init() {
    // Tidak ada proses asinkron berat untuk halaman about
  }

  destroy() {}
}

export default AboutPresenter;

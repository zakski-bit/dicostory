/**
 * Icon Utility - Clean, crisp SVG icons (Feather / Lucide style)
 * Menggantikan seluruh emoji agar tampilan website bersih, profesional, dan non-AI slop.
 */

const createSvg = (content, size = 18, className = 'icon-svg') => `
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="${size}"
    height="${size}"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
    class="${className}"
    aria-hidden="true"
    focusable="false"
  >${content}</svg>
`.trim();

export const ICONS = {
  // Brand & Navigation
  book: (size = 18) => createSvg(`
    <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z"></path>
    <path d="M6 6h10"></path>
    <path d="M6 10h10"></path>
  `, size),

  menu: (size = 20) => createSvg(`
    <line x1="4" x2="20" y1="12" y2="12"></line>
    <line x1="4" x2="20" y1="6" y2="6"></line>
    <line x1="4" x2="20" y1="18" y2="18"></line>
  `, size),

  close: (size = 18) => createSvg(`
    <path d="M18 6 6 18"></path>
    <path d="m6 6 12 12"></path>
  `, size),

  download: (size = 16) => createSvg(`
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
    <polyline points="7 10 12 15 17 10"></polyline>
    <line x1="12" x2="12" y1="15" y2="3"></line>
  `, size),

  // Actions
  plus: (size = 16) => createSvg(`
    <path d="M5 12h14"></path>
    <path d="M12 5v14"></path>
  `, size),

  bookmark: (size = 16) => createSvg(`
    <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"></path>
  `, size),

  bookmarkFilled: (size = 16) => `
    <svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon-svg" aria-hidden="true" focusable="false">
      <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"></path>
    </svg>
  `.trim(),

  bell: (size = 16) => createSvg(`
    <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"></path>
    <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"></path>
  `, size),

  bellOff: (size = 16) => createSvg(`
    <path d="M8.7 3A6 6 0 0 1 18 8a21.3 21.3 0 0 0 .6 5"></path>
    <path d="M17 17H3s3-2 3-9a4.67 4.67 0 0 1 .3-1.7"></path>
    <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"></path>
    <line x1="2" x2="22" y1="2" y2="22"></line>
  `, size),

  trash: (size = 15) => createSvg(`
    <path d="M3 6h18"></path>
    <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
  `, size),

  // Geospatial & Media
  map: (size = 16) => createSvg(`
    <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"></polygon>
    <line x1="9" x2="9" y1="3" y2="18"></line>
    <line x1="15" x2="15" y1="6" y2="21"></line>
  `, size),

  mapPin: (size = 15) => createSvg(`
    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path>
    <circle cx="12" cy="10" r="3"></circle>
  `, size),

  camera: (size = 16) => createSvg(`
    <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"></path>
    <circle cx="12" cy="13" r="3"></circle>
  `, size),

  upload: (size = 16) => createSvg(`
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
    <polyline points="17 8 12 3 7 8"></polyline>
    <line x1="12" x2="12" y1="3" y2="15"></line>
  `, size),

  // Meta & Information
  search: (size = 16) => createSvg(`
    <circle cx="11" cy="11" r="8"></circle>
    <path d="m21 21-4.3-4.3"></path>
  `, size),

  calendar: (size = 14) => createSvg(`
    <rect width="18" height="18" x="3" y="4" rx="2" ry="2"></rect>
    <line x1="16" x2="16" y1="2" y2="6"></line>
    <line x1="8" x2="8" y1="2" y2="6"></line>
    <line x1="3" x2="21" y1="10" y2="10"></line>
  `, size),

  user: (size = 14) => createSvg(`
    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
    <circle cx="12" cy="7" r="4"></circle>
  `, size),

  arrowLeft: (size = 16) => createSvg(`
    <path d="m12 19-7-7 7-7"></path>
    <path d="M19 12H5"></path>
  `, size),

  arrowRight: (size = 16) => createSvg(`
    <path d="M5 12h14"></path>
    <path d="m12 5 7 7-7 7"></path>
  `, size),

  check: (size = 16) => createSvg(`
    <path d="M20 6 9 17l-5-5"></path>
  `, size),

  refresh: (size = 16) => createSvg(`
    <path d="M3 12a9 9 0 0 1 15-6.7L21 8"></path>
    <path d="M21 3v5h-5"></path>
    <path d="M21 12a9 9 0 0 1-15 6.7L3 16"></path>
    <path d="M3 21v-5h5"></path>
  `, size),

  sliders: (size = 16) => createSvg(`
    <line x1="4" x2="4" y1="21" y2="14"></line>
    <line x1="4" x2="4" y1="10" y2="3"></line>
    <line x1="12" x2="12" y1="21" y2="12"></line>
    <line x1="12" x2="12" y1="8" y2="3"></line>
    <line x1="20" x2="20" y1="21" y2="16"></line>
    <line x1="20" x2="20" y1="12" y2="3"></line>
    <line x1="1" x2="7" y1="14" y2="14"></line>
    <line x1="9" x2="15" y1="8" y2="8"></line>
    <line x1="17" x2="23" y1="16" y2="16"></line>
  `, size),

  layers: (size = 16) => createSvg(`
    <polygon points="12 2 2 7 12 12 22 7 12 2"></polygon>
    <polyline points="2 17 12 22 22 17"></polyline>
    <polyline points="2 12 12 17 22 12"></polyline>
  `, size),
};

export default ICONS;

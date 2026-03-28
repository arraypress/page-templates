/**
 * Page Renderer
 *
 * Assembles a complete HTML document from a page shell, CSS, body content,
 * and optional scripts. Supports light, dark, and auto themes.
 *
 * @module render
 */

import { CSS } from './styles.js';

/**
 * Render a complete HTML page.
 *
 * @param {Object} options
 * @param {string} options.title - Page <title> text.
 * @param {string} options.body - Inner HTML content (components, etc.).
 * @param {string} [options.storeName=''] - Store name for footer.
 * @param {string} [options.brandColor='#06d6a0'] - Brand/accent color.
 * @param {string} [options.theme='auto'] - Theme: 'light', 'dark', or 'auto'.
 * @param {string} [options.scripts=''] - Inline JavaScript (without <script> tags).
 * @param {string} [options.extraHead=''] - Extra content for <head>.
 * @param {string} [options.footer] - Custom footer HTML (overrides default).
 * @param {string} [options.lang='en'] - HTML lang attribute.
 * @param {string} [options.description] - Meta description.
 * @param {string} [options.favicon] - Favicon URL.
 * @param {boolean} [options.noIndex=false] - Add noindex,nofollow robots meta.
 * @param {string} [options.canonical] - Canonical URL.
 * @param {Object} [options.og] - Open Graph tags: { title?, description?, image?, url? }.
 * @returns {string} Complete HTML document.
 *
 * @example
 * import { renderPage, components } from '@arraypress/page-templates';
 *
 * return c.html(renderPage({
 *   title: 'Order Confirmed',
 *   storeName: 'My Store',
 *   brandColor: '#06d6a0',
 *   theme: 'dark',
 *   noIndex: true,
 *   body: components.header({ icon: 'check', title: 'Thank you!' })
 *       + components.fileRow({ file: { name: 'plugin.zip' }, downloadUrl: '/dl/1' }),
 * }));
 */
export function renderPage({
  title = '',
  body = '',
  storeName = '',
  brandColor = '#06b6d4',
  theme = 'auto',
  scripts = '',
  extraHead = '',
  footer,
  lang = 'en',
  description,
  favicon,
  noIndex = false,
  canonical,
  og,
} = {}) {
  const themeClass = theme === 'dark' ? 'dark' : theme === 'light' ? '' : 'auto';
  const year = new Date().getFullYear();

  const footerHtml = footer !== undefined ? footer : (storeName
    ? `<div class="page-footer"><p>&copy; ${year} ${esc(storeName)}</p></div>`
    : '');

  const colorScheme = theme === 'dark' ? 'dark' : theme === 'light' ? 'light' : 'light dark';
  const fullTitle = `${esc(title)}${storeName ? ` — ${esc(storeName)}` : ''}`;

  // Build meta tags
  let meta = '';
  if (description) meta += `<meta name="description" content="${esc(description)}">`;
  if (noIndex) meta += '<meta name="robots" content="noindex,nofollow">';
  if (canonical) meta += `<link rel="canonical" href="${esc(canonical)}">`;
  if (favicon) meta += `<link rel="icon" href="${esc(favicon)}">`;

  // Open Graph
  if (og) {
    meta += `<meta property="og:title" content="${esc(og.title || title)}">`;
    if (og.description || description) meta += `<meta property="og:description" content="${esc(og.description || description)}">`;
    if (og.image) meta += `<meta property="og:image" content="${esc(og.image)}">`;
    if (og.url) meta += `<meta property="og:url" content="${esc(og.url)}">`;
    meta += '<meta property="og:type" content="website">';
  }

  return `<!DOCTYPE html>
<html lang="${lang}" class="${themeClass}">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="color-scheme" content="${colorScheme}">
<title>${fullTitle}</title>
${meta}
<style>:root{--brand:${brandColor}}${CSS}</style>
${extraHead}
</head>
<body>
<div class="container">
${body}
${footerHtml}
</div>
${scripts ? `<script>${scripts}</script>` : ''}
</body>
</html>`;
}

/**
 * Escape HTML entities.
 * @param {string} str
 * @returns {string}
 */
function esc(str) {
  if (str === null || str === undefined) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/**
 * Page Components
 *
 * Pure functions that return HTML strings for use in page templates.
 * All components use CSS classes from the styles module — no inline styles.
 *
 * @module components
 */

// ── Helpers ─────────────────────────────────

const HTML_ESCAPES = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
};

/**
 * Escape HTML special characters in a string.
 *
 * Handles the full set — `& < > " '` — so the returned string is
 * safe to interpolate into HTML content, double-quoted attributes,
 * and single-quoted JS string literals within `onclick`/`onerror`
 * handlers. `null`/`undefined` become empty strings.
 *
 * Exported as `escapeHtml` from the package root so library consumers
 * can escape their own user input before building HTML strings.
 *
 * @param {*} input - Any value; coerced to string.
 * @returns {string} HTML-escaped string.
 */
export function escapeHtml(input) {
  if (input === null || input === undefined) return '';
  return String(input).replace(/[&<>"']/g, (c) => HTML_ESCAPES[c]);
}

/** Short alias used internally by every component below. */
const esc = escapeHtml;

// ── SVG Icons ───────────────────────────────

const ICONS = {
  download: (color = 'currentColor') => `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>`,
  lock: () => `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>`,
  check: (color = 'currentColor') => `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`,
  mail: (color = 'currentColor') => `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>`,
  alertCircle: (color = 'currentColor') => `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`,
  user: (color = 'currentColor') => `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`,
  key: (color = 'currentColor') => `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"/></svg>`,
};

// ── Components ──────────────────────────────

/**
 * Page header with icon, title, and subtitle.
 *
 * @param {Object} options
 * @param {string} [options.icon] - Icon name: 'check', 'mail', 'alert', 'user', 'key'.
 * @param {string} [options.iconColor] - Icon stroke color (defaults to brand).
 * @param {string} [options.iconBg] - Icon circle background.
 * @param {string} options.title - Page heading.
 * @param {string} [options.subtitle] - Subtitle text.
 * @returns {string} HTML string.
 */
export function header({ icon, iconColor, iconBg, title, subtitle } = {}) {
  let html = '<div class="page-header">';

  if (icon && ICONS[icon]) {
    const bg = iconBg || 'color-mix(in srgb, var(--brand) 12%, transparent)';
    const color = iconColor || 'var(--brand)';
    html += `<div class="icon-circle" style="background:${bg}">${ICONS[icon](color)}</div>`;
  }

  if (title) html += `<h1>${esc(title)}</h1>`;
  if (subtitle) html += `<p class="subtitle">${esc(subtitle)}</p>`;

  html += '</div>';
  return html;
}

/**
 * Call-to-action button.
 *
 * @param {Object} options
 * @param {string} options.text - Button label.
 * @param {string} [options.url] - Link URL (renders <a>).
 * @param {string} [options.type] - Button type for <button> (submit, button).
 * @param {string} [options.variant='primary'] - Style: 'primary', 'outline', 'danger', 'sm'.
 * @param {string} [options.id] - Element ID.
 * @param {boolean} [options.disabled] - Disabled state.
 * @param {boolean} [options.fullWidth] - Full width.
 * @returns {string} HTML string.
 */
export function button({ text, url, type, variant = 'primary', id, disabled, fullWidth } = {}) {
  if (!text) return '';

  const classes = ['btn'];
  if (variant === 'outline') classes.push('btn-outline');
  if (variant === 'danger') classes.push('btn-danger');
  if (variant === 'sm') classes.push('btn-sm');
  if (disabled) classes.push('btn-disabled');

  const style = fullWidth ? ' style="width:100%"' : '';
  const idAttr = id ? ` id="${esc(id)}"` : '';
  const disabledAttr = disabled ? ' disabled' : '';

  if (url) {
    return `<a href="${esc(url)}" class="${classes.join(' ')}"${idAttr}${style}>${esc(text)}</a>`;
  }

  return `<button type="${type || 'button'}" class="${classes.join(' ')}"${idAttr}${disabledAttr}${style}>${esc(text)}</button>`;
}

/**
 * Alert / notice box.
 *
 * @param {Object} options
 * @param {string} options.message - Alert message.
 * @param {string} [options.type='info'] - Type: 'info', 'success', 'warning', 'error'.
 * @returns {string} HTML string.
 */
export function alert({ message, type = 'info' } = {}) {
  if (!message) return '';
  return `<div class="alert alert-${esc(type)}">${esc(message)}</div>`;
}

/**
 * Text input field.
 *
 * @param {Object} options
 * @param {string} [options.name] - Input name attribute.
 * @param {string} [options.type='text'] - Input type (text, email, etc.).
 * @param {string} [options.placeholder] - Placeholder text.
 * @param {string} [options.value] - Default value.
 * @param {string} [options.id] - Element ID.
 * @param {boolean} [options.required] - Required attribute.
 * @param {string} [options.label] - Label text above input.
 * @returns {string} HTML string.
 */
export function input({ name, type = 'text', placeholder, value, id, required, label } = {}) {
  let html = '';
  if (label) {
    html += `<label class="section-label" ${id ? `for="${esc(id)}"` : ''}>${esc(label)}</label>`;
  }
  html += `<input class="input" type="${esc(type)}"`;
  if (name) html += ` name="${esc(name)}"`;
  if (id) html += ` id="${esc(id)}"`;
  if (placeholder) html += ` placeholder="${esc(placeholder)}"`;
  if (value) html += ` value="${esc(value)}"`;
  if (required) html += ' required';
  html += '>';
  return html;
}

/**
 * File download row with optional download count.
 *
 * @param {Object} options
 * @param {Object} options.file - File object: { name, size?, productName? }.
 * @param {string} options.downloadUrl - Download URL.
 * @param {number} [options.downloadCount] - Times downloaded.
 * @param {number} [options.downloadLimit] - Max downloads (0 = unlimited).
 * @param {boolean} [options.isUnlimited] - Override: no limit.
 * @returns {string} HTML string.
 */
export function fileRow({ file, downloadUrl, downloadCount = 0, downloadLimit = 0, isUnlimited = false } = {}) {
  if (!file) return '';

  const hasLimit = !isUnlimited && downloadLimit > 0;
  const isExhausted = hasLimit && downloadCount >= downloadLimit;
  const isWarning = hasLimit && downloadCount >= downloadLimit - 1 && !isExhausted;

  const countClass = isExhausted ? 'download-count-exhausted' : isWarning ? 'download-count-warn' : '';
  const countLabel = hasLimit ? `${downloadCount} of ${downloadLimit} downloads used` : '';

  const fileName = file.name || file.original_name || file.fileName || 'File';
  const fileSize = file.size || file.file_size || file.fileSize || '';
  const productName = file.productName || file.product_name || '';

  let metaParts = [];
  if (productName) metaParts.push(esc(productName));
  if (fileSize) metaParts.push(esc(fileSize));

  return `<div class="file-row ${isExhausted ? 'file-row-exhausted' : ''}">
<div class="file-icon ${isExhausted ? 'file-icon-exhausted' : ''}">${isExhausted ? ICONS.lock() : ICONS.download('var(--brand)')}</div>
<div class="file-info">
<div class="file-name">${esc(fileName)}</div>
${metaParts.length ? `<div class="file-meta">${metaParts.join(' · ')}</div>` : ''}
${countLabel ? `<div class="download-count ${countClass}">${countLabel}</div>` : ''}
</div>
${isExhausted
    ? '<span class="btn btn-sm btn-danger btn-disabled">Limit Reached</span>'
    : `<a href="${esc(downloadUrl)}" class="btn btn-sm">Download</a>`
}
</div>`;
}

/**
 * License key display with copy button.
 *
 * @param {Object} options
 * @param {string} options.key - License key string.
 * @param {string} [options.status] - Status: 'active', 'expired'.
 * @param {string} [options.label] - Product name or label.
 * @returns {string} HTML string.
 */
export function licenseKey({ key, status, label } = {}) {
  if (!key) return '';

  const statusClass = status === 'expired' ? 'license-expired' : 'license-active';
  const statusLabel = status === 'expired' ? 'Expired' : 'Active';

  let html = '<div class="license-row">';
  html += `<div class="license-key" title="Click to select">${esc(key)}</div>`;
  html += `<button class="copy-btn" onclick="navigator.clipboard.writeText('${esc(key)}');this.textContent='Copied!';setTimeout(()=>this.textContent='Copy',1500)">Copy</button>`;
  if (status) html += `<span class="license-status ${statusClass}">${statusLabel}</span>`;
  html += '</div>';

  if (label) {
    html = `<div style="margin-bottom:8px"><div class="section-label">${esc(label)}</div>${html}</div>`;
  }

  return html;
}

/**
 * Download card — groups files under a product with optional license key and notes.
 *
 * Mirrors the email-templates downloadsList pattern: product name at top,
 * files listed below, license key inline, optional note at bottom.
 *
 * @param {Object} options
 * @param {string} options.productName - Product name heading.
 * @param {Array} options.files - Files: { file, downloadUrl, downloadCount?, downloadLimit?, isUnlimited? }[].
 * @param {Object} [options.license] - License: { key, status? }.
 * @param {string} [options.note] - Note text below files (e.g. "Includes 2 bonus packs").
 * @returns {string} HTML string.
 */
export function downloadCard({ productName, files = [], license, note: noteText } = {}) {
  if (!productName && !files.length) return '';

  let html = '<div class="card" style="padding:0;overflow:hidden">';

  // Product header
  if (productName) {
    html += `<div style="padding:16px 20px;border-bottom:1px solid var(--border-light)">
<div style="font-size:14px;font-weight:600;color:var(--text)">${esc(productName)}</div>
</div>`;
  }

  // Files
  if (files.length) {
    html += '<div style="padding:12px 16px">';
    for (const f of files) {
      html += fileRow(f);
    }
    html += '</div>';
  }

  // License key
  if (license && license.key) {
    html += `<div style="padding:0 16px 12px">`;
    html += '<div class="license-row">';
    html += `<div class="license-key" title="Click to select">${esc(license.key)}</div>`;
    html += `<button class="copy-btn" onclick="navigator.clipboard.writeText('${esc(license.key)}');this.textContent='Copied!';setTimeout(()=>this.textContent='Copy',1500)">Copy</button>`;
    if (license.status) {
      const cls = license.status === 'expired' ? 'license-expired' : 'license-active';
      const lbl = license.status === 'expired' ? 'Expired' : 'Active';
      html += `<span class="license-status ${cls}">${lbl}</span>`;
    }
    html += '</div></div>';
  }

  // Note
  if (noteText) {
    html += `<div style="padding:0 16px 14px;font-size:12px;color:var(--text-muted)">${esc(noteText)}</div>`;
  }

  html += '</div>';
  return html;
}

/**
 * Order summary card.
 *
 * @param {Object} options
 * @param {string} [options.orderNumber] - Display order number.
 * @param {string} [options.amount] - Formatted amount string.
 * @param {string} [options.date] - Formatted date string.
 * @param {string} [options.status] - Order status.
 * @param {string} [options.body] - Inner HTML content (file rows, etc.).
 * @returns {string} HTML string.
 */
export function orderCard({ orderNumber, amount, date, status, body } = {}) {
  let html = '<div class="order-card">';

  html += '<div class="order-header">';
  html += '<div>';
  if (orderNumber) html += `<div style="font-size:14px;font-weight:600;color:var(--text)">${esc(orderNumber)}</div>`;
  if (date) html += `<div class="order-date">${esc(date)}</div>`;
  html += '</div>';
  if (amount) html += `<div class="order-amount">${esc(amount)}</div>`;
  html += '</div>';

  if (body) html += `<div class="order-body">${body}</div>`;

  html += '</div>';
  return html;
}

/**
 * Key-value pairs list.
 *
 * @param {Object} options
 * @param {Object} options.items - Object of label:value pairs.
 * @param {string} [options.title] - Section title.
 * @returns {string} HTML string.
 */
export function keyValue({ items = {}, title } = {}) {
  const entries = Object.entries(items);
  if (!entries.length) return '';

  let html = '';
  if (title) html += `<div class="section-label">${esc(title)}</div>`;

  html += '<div class="kv-list">';
  for (const [k, v] of entries) {
    html += `<div class="kv-row"><span class="kv-label">${esc(k)}</span><span class="kv-value">${esc(String(v))}</span></div>`;
  }
  html += '</div>';
  return html;
}

/**
 * Tab bar with vanilla JS switching.
 *
 * @param {Object} options
 * @param {string[]} options.tabs - Tab labels.
 * @param {string} [options.activeTab] - Initially active tab (defaults to first).
 * @returns {string} HTML string (tabs bar + script).
 */
export function tabs({ tabs: tabList = [], activeTab } = {}) {
  if (!tabList.length) return '';

  const active = activeTab || tabList[0];

  let html = '<div class="tabs">';
  for (const tab of tabList) {
    const id = tab.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const isActive = tab === active;
    html += `<button class="tab ${isActive ? 'tab-active' : ''}" data-tab="${esc(id)}" onclick="switchTab('${esc(id)}')">${esc(tab)}</button>`;
  }
  html += '</div>';

  return html;
}

/**
 * Tab panel wrapper.
 *
 * @param {Object} options
 * @param {string} options.id - Tab ID (matches tab data-tab attribute).
 * @param {string} options.content - Panel HTML content.
 * @param {boolean} [options.active] - Whether initially visible.
 * @returns {string} HTML string.
 */
export function tabPanel({ id, content, active = false } = {}) {
  return `<div class="tab-panel ${active ? 'tab-panel-active' : ''}" data-panel="${esc(id)}">${content || ''}</div>`;
}

/**
 * Horizontal divider.
 *
 * @returns {string} HTML string.
 */
export function divider() {
  return '<hr style="border:0;border-top:1px solid var(--border);margin:24px 0;">';
}

/**
 * Vertical spacer.
 *
 * @param {Object} [options]
 * @param {number} [options.height=24] - Height in pixels.
 * @returns {string} HTML string.
 */
export function spacer({ height = 24 } = {}) {
  return `<div style="height:${height}px"></div>`;
}

/**
 * Loading spinner.
 *
 * @param {Object} [options]
 * @param {string} [options.text] - Loading text below spinner.
 * @returns {string} HTML string.
 */
export function spinner({ text } = {}) {
  let html = '<div style="text-align:center;padding:24px 0;">';
  html += '<div class="spinner"></div>';
  if (text) html += `<div style="font-size:13px;color:var(--text-muted)">${esc(text)}</div>`;
  html += '</div>';
  return html;
}

/**
 * Empty state / note.
 *
 * @param {Object} options
 * @param {string} options.message - Message text.
 * @returns {string} HTML string.
 */
export function note({ message } = {}) {
  if (!message) return '';
  return `<div class="note">${esc(message)}</div>`;
}

/**
 * Tab switching script. Include once in the page.
 *
 * @returns {string} Script tag.
 */
export function tabScript() {
  return `<script>
function switchTab(id){
  document.querySelectorAll('.tab').forEach(t=>t.classList.toggle('tab-active',t.dataset.tab===id));
  document.querySelectorAll('.tab-panel').forEach(p=>p.classList.toggle('tab-panel-active',p.dataset.panel===id));
}
</script>`;
}

// Export icons for direct use
export { ICONS as icons };

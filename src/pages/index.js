/**
 * Pre-built Pages
 *
 * Complete page functions that compose the renderer and components
 * into ready-to-use transactional pages. Each function returns a
 * full HTML document string.
 *
 * @module pages
 */

import { renderPage } from '../render.js';
import * as c from '../components/index.js';

/**
 * Shared page options type.
 * @typedef {Object} PageOptions
 * @property {string} [storeName] - Store name.
 * @property {string} [brandColor='#06d6a0'] - Brand color.
 * @property {string} [theme='auto'] - Theme: light, dark, auto.
 */

/**
 * Order success / thank you page.
 *
 * Supports two download display patterns:
 *   1. `downloads` — grouped by product with license keys inline (preferred).
 *   2. `files` + `licenses` — flat lists, kept for backwards compatibility.
 *
 * @param {Object} options
 * @param {string} options.title - Heading (e.g. 'Thank you!').
 * @param {string} [options.subtitle] - Subtitle.
 * @param {Object} [options.order] - Order details: { orderNumber, amount, date, email }.
 * @param {Object} [options.details] - Key-value details object (overrides auto-generated).
 * @param {Array} [options.downloads] - Grouped: { productName, files[], license?, note? }[].
 * @param {Array} [options.files] - Flat files: { file, downloadUrl, downloadCount?, downloadLimit? }[].
 * @param {Array} [options.licenses] - Flat licenses: { key, status?, label? }[].
 * @param {string} [options.message] - Custom message below header.
 * @param {Object} [options.cta] - CTA button: { text, url }.
 * @param {PageOptions} options - Page options.
 * @returns {string} Complete HTML page.
 */
export function successPage({
  title = 'Thank you!',
  subtitle,
  order,
  details,
  downloads,
  files,
  licenses,
  message,
  cta,
  storeName,
  brandColor,
  theme,
} = {}) {
  let body = c.header({ icon: 'check', title, subtitle });

  if (message) body += `<p style="text-align:center;color:var(--text-muted);margin-bottom:24px;font-size:14px;line-height:1.6">${message}</p>`;

  // Order summary — auto-generate key-value details from order if no explicit details
  if (order || details) {
    const orderDetails = details || {};
    if (order && !details) {
      if (order.orderNumber) orderDetails['Order'] = order.orderNumber;
      if (order.amount) orderDetails['Total'] = order.amount;
      if (order.email) orderDetails['Email'] = order.email;
      if (order.date) orderDetails['Date'] = order.date;
    }
    if (Object.keys(orderDetails).length) {
      body += c.keyValue({ items: orderDetails });
    }
  }

  // Grouped downloads (preferred) — product cards with files + license + notes
  if (downloads && downloads.length) {
    body += c.spacer({ height: 8 });
    body += `<div class="section-label">Your Downloads</div>`;
    for (const dl of downloads) {
      body += c.downloadCard(dl);
    }
  }

  // Flat files fallback
  if ((!downloads || !downloads.length) && files && files.length) {
    body += c.spacer({ height: 8 });
    body += `<div class="section-label">Downloads</div>`;
    for (const f of files) {
      body += c.fileRow(f);
    }
  }

  // Flat licenses fallback
  if ((!downloads || !downloads.length) && licenses && licenses.length) {
    body += c.spacer({ height: 8 });
    body += `<div class="section-label">License Keys</div>`;
    for (const l of licenses) {
      body += c.licenseKey(l);
    }
  }

  if (cta) {
    body += c.spacer({ height: 16 });
    body += `<div style="text-align:center">${c.button({ text: cta.text, url: cta.url })}</div>`;
  }

  return renderPage({ title, body, storeName, brandColor, theme, noIndex: true });
}

/**
 * Login / order lookup page with email form.
 *
 * @param {Object} options
 * @param {string} [options.title='Sign In'] - Page title.
 * @param {string} [options.subtitle] - Subtitle text.
 * @param {string} [options.actionUrl] - Form action URL.
 * @param {string} [options.buttonText='Send Magic Link'] - Submit button text.
 * @param {Object} [options.captcha] - CAPTCHA config: { provider: 'turnstile' | 'recaptcha', siteKey: string }.
 * @param {string} [options.turnstileSiteKey] - DEPRECATED: Use captcha instead. Cloudflare Turnstile site key.
 * @param {string} [options.helpText] - Help text below form.
 * @param {string} [options.error] - Error message to display.
 * @param {PageOptions} options - Page options.
 * @returns {string} Complete HTML page.
 */
export function loginPage({
  title = 'Sign In',
  subtitle = 'Enter your email to access your orders and downloads.',
  actionUrl = '/api/magic-link',
  buttonText = 'Send Magic Link',
  captcha,
  turnstileSiteKey,
  helpText,
  error,
  storeName,
  brandColor,
  theme,
} = {}) {
  // Resolve captcha config — new `captcha` object takes priority, fall back to legacy `turnstileSiteKey`
  const resolvedCaptcha = captcha
    || (turnstileSiteKey ? { provider: 'turnstile', siteKey: turnstileSiteKey } : null);

  let body = c.header({ icon: 'mail', title, subtitle });

  if (error) body += c.alert({ message: error, type: 'error' });

  body += '<div class="card">';
  body += `<form method="POST" action="${c.icons ? '' : ''}${actionUrl}" id="login-form">`;
  body += c.input({ name: 'email', type: 'email', placeholder: 'you@example.com', required: true });
  body += c.spacer({ height: 12 });

  if (resolvedCaptcha && resolvedCaptcha.provider === 'turnstile' && resolvedCaptcha.siteKey) {
    body += `<div class="cf-turnstile" data-sitekey="${resolvedCaptcha.siteKey}" data-theme="auto" style="margin-bottom:12px"></div>`;
  } else if (resolvedCaptcha && resolvedCaptcha.provider === 'recaptcha' && resolvedCaptcha.siteKey) {
    body += `<div class="g-recaptcha" data-sitekey="${resolvedCaptcha.siteKey}" style="margin-bottom:12px"></div>`;
  }

  body += c.button({ text: buttonText, type: 'submit', fullWidth: true, id: 'login-btn' });
  body += '</form>';
  body += '</div>';

  if (helpText) body += `<p style="text-align:center;font-size:13px;color:var(--text-muted);margin-top:16px">${helpText}</p>`;

  let extraHead = '';
  if (resolvedCaptcha && resolvedCaptcha.provider === 'turnstile' && resolvedCaptcha.siteKey) {
    extraHead = '<script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer></script>';
  } else if (resolvedCaptcha && resolvedCaptcha.provider === 'recaptcha' && resolvedCaptcha.siteKey) {
    extraHead = '<script src="https://www.google.com/recaptcha/api.js" async defer></script>';
  }

  const scripts = `document.getElementById('login-form').addEventListener('submit',function(e){
var b=document.getElementById('login-btn');b.disabled=true;b.textContent='Sending...';
});`;

  return renderPage({ title, body, storeName, brandColor, theme, extraHead, scripts, noIndex: true });
}

/**
 * Magic link sent confirmation page.
 *
 * @param {Object} options
 * @param {string} [options.email] - Email address the link was sent to.
 * @param {PageOptions} options - Page options.
 * @returns {string} Complete HTML page.
 */
export function magicLinkSentPage({ email, storeName, brandColor, theme } = {}) {
  let body = c.header({
    icon: 'mail',
    title: 'Check Your Email',
    subtitle: email ? `We sent a sign-in link to ${email}` : 'We sent you a sign-in link.',
  });

  body += c.note({ message: 'Click the link in the email to access your orders and downloads. The link expires in 15 minutes.' });

  return renderPage({ title: 'Check Your Email', body, storeName, brandColor, theme, noIndex: true });
}

/**
 * Downloads page — file list with optional license keys.
 *
 * Supports two patterns:
 *   1. `downloads` — grouped by product with license keys inline (preferred).
 *   2. `files` + `licenses` — flat lists.
 *
 * @param {Object} options
 * @param {string} [options.title='Your Downloads'] - Page title.
 * @param {string} [options.subtitle] - Subtitle.
 * @param {Array} [options.downloads] - Grouped: { productName, files[], license?, note? }[].
 * @param {Array} [options.files] - Flat files: { file, downloadUrl, downloadCount?, downloadLimit? }[].
 * @param {Array} [options.licenses] - Flat licenses: { key, status?, label? }[].
 * @param {Object} [options.order] - Order info: { orderNumber, amount, date }.
 * @param {PageOptions} options - Page options.
 * @returns {string} Complete HTML page.
 */
export function downloadsPage({
  title = 'Your Downloads',
  subtitle,
  downloads,
  files = [],
  licenses,
  order,
  storeName,
  brandColor,
  theme,
} = {}) {
  let body = c.header({ icon: 'download', iconColor: 'var(--brand)', title, subtitle });

  if (order) {
    body += c.keyValue({
      items: {
        ...(order.orderNumber ? { 'Order': order.orderNumber } : {}),
        ...(order.amount ? { 'Amount': order.amount } : {}),
        ...(order.date ? { 'Date': order.date } : {}),
      },
    });
    body += c.spacer({ height: 8 });
  }

  // Grouped downloads (preferred)
  if (downloads && downloads.length) {
    for (const dl of downloads) {
      body += c.downloadCard(dl);
    }
  } else if (files.length) {
    // Flat files fallback
    body += `<div class="section-label">Files</div>`;
    for (const f of files) {
      body += c.fileRow(f);
    }

    if (licenses && licenses.length) {
      body += c.spacer({ height: 16 });
      body += `<div class="section-label">License Keys</div>`;
      for (const l of licenses) {
        body += c.licenseKey(l);
      }
    }
  } else {
    body += c.note({ message: 'No downloadable files for this order.' });
  }

  return renderPage({ title, body, storeName, brandColor, theme, noIndex: true });
}

/**
 * Customer portal page with tabbed sections.
 *
 * @param {Object} options
 * @param {string} [options.title='My Account'] - Page title.
 * @param {string} [options.customerName] - Customer display name.
 * @param {string} [options.customerEmail] - Customer email.
 * @param {string} options.apiBase - API base URL for fetch calls.
 * @param {string} options.sessionToken - Auth session token.
 * @param {string} [options.manageUrl] - Stripe billing portal URL.
 * @param {PageOptions} options - Page options.
 * @returns {string} Complete HTML page.
 */
export function portalPage({
  title = 'My Account',
  customerName,
  customerEmail,
  apiBase = '/api/store',
  sessionToken,
  manageUrl,
  storeName,
  brandColor,
  theme,
} = {}) {
  let body = c.header({
    icon: 'user',
    title: customerName || 'My Account',
    subtitle: customerEmail,
  });

  if (manageUrl) {
    body += `<div style="text-align:center;margin-bottom:24px">${c.button({ text: 'Manage Billing', url: manageUrl, variant: 'outline' })}</div>`;
  }

  body += c.tabs({ tabs: ['Orders', 'Downloads', 'Licenses'] });
  body += c.tabPanel({ id: 'orders', content: c.spinner({ text: 'Loading orders...' }), active: true });
  body += c.tabPanel({ id: 'downloads', content: c.spinner({ text: 'Loading downloads...' }) });
  body += c.tabPanel({ id: 'licenses', content: c.spinner({ text: 'Loading licenses...' }) });

  body += c.spacer({ height: 16 });
  body += `<div style="text-align:center">${c.button({ text: 'Sign Out', url: '/store/logout', variant: 'outline' })}</div>`;

  const scripts = `
${c.tabScript().replace(/<\/?script>/g, '')}
var API='${apiBase}';
var TOKEN='${sessionToken || ''}';
function api(path){return fetch(API+path,{headers:{'Authorization':'Bearer '+TOKEN}}).then(r=>r.json())}
function el(id){return document.querySelector('[data-panel="'+id+'"]')}

api('/account/orders').then(function(d){
  var h='';
  if(d.orders&&d.orders.length){
    d.orders.forEach(function(o){
      h+='<div class="order-card"><div class="order-header"><div>';
      h+='<div style="font-size:14px;font-weight:600;color:var(--text)">'+(o.order_number||o.id)+'</div>';
      h+='<div class="order-date">'+(o.created_at||'')+'</div>';
      h+='</div><div class="order-amount">'+(o.amount_formatted||'')+'</div></div></div>';
    });
  }else{h='<div class="note">No orders yet.</div>';}
  el('orders').innerHTML=h;
});

api('/account/downloads').then(function(d){
  var h='';
  if(d.files&&d.files.length){
    d.files.forEach(function(f){
      h+='<div class="file-row"><div class="file-icon">${c.icons.download('var(--brand)')}</div>';
      h+='<div class="file-info"><div class="file-name">'+f.name+'</div>';
      h+='<div class="file-meta">'+(f.size||'')+'</div></div>';
      h+='<a href="'+f.url+'" class="btn btn-sm">Download</a></div>';
    });
  }else{h='<div class="note">No downloads available.</div>';}
  el('downloads').innerHTML=h;
});

api('/account/licenses').then(function(d){
  var h='';
  if(d.licenses&&d.licenses.length){
    d.licenses.forEach(function(l){
      var cls=l.status==='expired'?'license-expired':'license-active';
      var label=l.status==='expired'?'Expired':'Active';
      h+='<div class="license-row">';
      h+='<div class="license-key">'+l.license_key+'</div>';
      h+='<button class="copy-btn" onclick="navigator.clipboard.writeText(\\''+l.license_key+'\\');this.textContent=\\'Copied!\\';setTimeout(()=>this.textContent=\\'Copy\\',1500)">Copy</button>';
      h+='<span class="license-status '+cls+'">'+label+'</span></div>';
    });
  }else{h='<div class="note">No license keys.</div>';}
  el('licenses').innerHTML=h;
});
`;

  return renderPage({ title, body, storeName, brandColor, theme, scripts, noIndex: true });
}

/**
 * Error page.
 *
 * @param {Object} options
 * @param {string} [options.title='Something went wrong'] - Error title.
 * @param {string} [options.message] - Error description.
 * @param {string} [options.code] - Error code (404, 403, etc.).
 * @param {Object} [options.cta] - CTA button: { text, url }.
 * @param {PageOptions} options - Page options.
 * @returns {string} Complete HTML page.
 */
export function errorPage({
  title = 'Something went wrong',
  message,
  code,
  cta,
  storeName,
  brandColor,
  theme,
} = {}) {
  let body = c.header({
    icon: 'alertCircle',
    iconColor: '#ef4444',
    iconBg: 'rgba(239,68,68,0.1)',
    title: code ? `${code} — ${title}` : title,
    subtitle: message,
  });

  if (cta) {
    body += `<div style="text-align:center;margin-top:8px">${c.button({ text: cta.text, url: cta.url, variant: 'outline' })}</div>`;
  }

  return renderPage({ title, body, storeName, brandColor, theme, noIndex: true });
}

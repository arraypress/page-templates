/**
 * Preview Generator — generates HTML previews for all pages and themes.
 *
 * Usage: node preview.js
 * Output: previews/
 */

import { writeFileSync, mkdirSync } from 'fs';
import {
  renderPage, components, successPage, loginPage,
  magicLinkSentPage, downloadsPage, portalPage, errorPage,
} from './src/index.js';

const { header, button, alert, input, fileRow, licenseKey, downloadCard, orderCard, keyValue, tabs, tabPanel, tabScript, divider, spacer, spinner, note } = components;

mkdirSync('previews/pages', { recursive: true });
mkdirSync('previews/themes', { recursive: true });

const STORE = 'ArrayPress';
const BRAND = '#06b6d4';

// ── Helper ──────────────────────────────────

function write(path, html) {
  writeFileSync(path, html);
  console.log(`  ✓ ${path}`);
}

// ── Theme Showcase ──────────────────────────
// Same content rendered in all 3 themes

const showcaseBody = [
  header({ icon: 'check', title: 'Component Showcase', subtitle: 'All components in one page' }),

  '<div class="section-label">Alerts</div>',
  alert({ message: 'This is an info alert — something to know about.', type: 'info' }),
  alert({ message: 'Success! Your order has been confirmed.', type: 'success' }),
  alert({ message: 'Warning: Your subscription expires in 3 days.', type: 'warning' }),
  alert({ message: 'Error: Payment method declined. Please update.', type: 'error' }),

  spacer({ height: 8 }),
  '<div class="section-label">Buttons</div>',
  '<div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:16px">',
  button({ text: 'Primary', url: '#' }),
  button({ text: 'Outline', url: '#', variant: 'outline' }),
  button({ text: 'Danger', url: '#', variant: 'danger' }),
  button({ text: 'Small', url: '#', variant: 'sm' }),
  button({ text: 'Disabled', url: '#', disabled: true }),
  '</div>',

  spacer({ height: 8 }),
  '<div class="section-label">File Downloads</div>',
  fileRow({ file: { name: 'Melodic-House-Pack-v2.1.zip', size: '248 MB', productName: 'Melodic House Pack' }, downloadUrl: '#' }),
  fileRow({ file: { name: 'Bass-Tech-Presets.zip', size: '12.4 MB', productName: 'Bass Tech Presets' }, downloadUrl: '#', downloadCount: 2, downloadLimit: 5 }),
  fileRow({ file: { name: 'Expired-File.zip', size: '89 MB', productName: 'Old Pack' }, downloadUrl: '#', downloadCount: 5, downloadLimit: 5 }),

  spacer({ height: 8 }),
  '<div class="section-label">Download Cards (Grouped)</div>',
  downloadCard({
    productName: 'Melodic House Pack',
    files: [
      { file: { name: 'Melodic-House-Pack-v2.1.zip', size: '248 MB' }, downloadUrl: '#' },
      { file: { name: 'Bonus-Loops.zip', size: '34 MB' }, downloadUrl: '#' },
    ],
    license: { key: 'FA15-328F-84FE-1974-D55D-A3E4', status: 'active' },
    note: 'Includes bonus loop pack',
  }),
  downloadCard({
    productName: 'Bass Tech Presets',
    files: [
      { file: { name: 'Bass-Tech-Presets.zip', size: '12.4 MB' }, downloadUrl: '#', downloadCount: 2, downloadLimit: 5 },
    ],
    license: { key: 'B7A2-91CF-E3D0-4856-AA12-7F33', status: 'active' },
  }),

  spacer({ height: 8 }),
  '<div class="section-label">License Keys</div>',
  licenseKey({ key: 'FA15-328F-84FE-1974-D55D-A3E4', status: 'active', label: 'Melodic House Pack' }),
  licenseKey({ key: 'B7A2-91CF-E3D0-4856-AA12-7F33', status: 'expired', label: 'Old Plugin (Expired)' }),

  spacer({ height: 8 }),
  '<div class="section-label">Order Card</div>',
  orderCard({
    orderNumber: '#FC-2847',
    amount: '$63.20',
    date: 'Mar 27, 2026',
    body: fileRow({ file: { name: 'plugin.zip', size: '4.7 MB' }, downloadUrl: '#' }),
  }),

  spacer({ height: 8 }),
  '<div class="section-label">Key-Value Details</div>',
  keyValue({
    title: 'Order Details',
    items: {
      'Order Number': '#FC-2847',
      'Date': 'March 27, 2026',
      'Payment': 'Visa •••• 4242',
      'Status': 'Complete',
      'Email': 'david@example.com',
    },
  }),

  spacer({ height: 8 }),
  '<div class="section-label">Form Input</div>',
  '<div class="card">',
  input({ label: 'Email Address', name: 'email', type: 'email', placeholder: 'you@example.com' }),
  spacer({ height: 12 }),
  button({ text: 'Submit', type: 'submit', fullWidth: true }),
  '</div>',

  spacer({ height: 8 }),
  '<div class="section-label">Tabs</div>',
  tabs({ tabs: ['Orders', 'Downloads', 'Licenses'] }),
  tabPanel({ id: 'orders', content: note({ message: 'Your orders would appear here.' }), active: true }),
  tabPanel({ id: 'downloads', content: note({ message: 'Your downloads would appear here.' }) }),
  tabPanel({ id: 'licenses', content: note({ message: 'Your licenses would appear here.' }) }),

  spacer({ height: 8 }),
  '<div class="section-label">Loading Spinner</div>',
  spinner({ text: 'Loading your order...' }),

  spacer({ height: 8 }),
  '<div class="section-label">Empty State</div>',
  note({ message: 'No orders found. Your purchases will appear here.' }),

].join('\n');

console.log('Generating previews...\n');

// Theme variations
for (const theme of ['light', 'dark', 'auto']) {
  write(`previews/themes/${theme}.html`, renderPage({
    title: `${theme.charAt(0).toUpperCase() + theme.slice(1)} Theme`,
    storeName: STORE,
    brandColor: BRAND,
    theme,
    body: showcaseBody,
    scripts: tabScript().replace(/<\/?script>/g, ''),
  }));
}

console.log('');

// ── Pre-built Page Previews ─────────────────

// Success page
write('previews/pages/success.html', successPage({
  title: 'Thank you!',
  subtitle: 'Your order has been confirmed',
  storeName: STORE,
  brandColor: BRAND,
  theme: 'auto',
  order: { orderNumber: '#FC-2847', amount: '$63.20', email: 'david@example.com', date: 'Mar 27, 2026' },
  downloads: [
    {
      productName: 'Melodic House Pack',
      files: [
        { file: { name: 'Melodic-House-Pack-v2.1.zip', size: '248 MB' }, downloadUrl: '#' },
        { file: { name: 'Melodic-House-Bonus-Loops.zip', size: '34 MB' }, downloadUrl: '#' },
      ],
      license: { key: 'FA15-328F-84FE-1974-D55D-A3E4', status: 'active' },
      note: 'Includes bonus loop pack',
    },
    {
      productName: 'Bass Tech Presets',
      files: [
        { file: { name: 'Bass-Tech-Presets.zip', size: '12.4 MB' }, downloadUrl: '#' },
      ],
      license: { key: 'B7A2-91CF-E3D0-4856-AA12-7F33', status: 'active' },
    },
    {
      productName: 'Afro House Drum Kit',
      files: [
        { file: { name: 'Afro-House-Drums-WAV.zip', size: '89 MB' }, downloadUrl: '#' },
      ],
    },
  ],
  cta: { text: 'View Order History', url: '#' },
}));

// Login page
write('previews/pages/login.html', loginPage({
  storeName: STORE,
  brandColor: BRAND,
  theme: 'auto',
  helpText: 'We\'ll send you a magic link to access your orders and downloads.',
}));

// Login with error
write('previews/pages/login-error.html', loginPage({
  storeName: STORE,
  brandColor: BRAND,
  theme: 'auto',
  error: 'No account found with that email address. Please check and try again.',
}));

// Login with Turnstile
write('previews/pages/login-turnstile.html', loginPage({
  storeName: STORE,
  brandColor: BRAND,
  theme: 'auto',
  turnstileSiteKey: '0x4AAAAAAAExample',
  helpText: 'Complete the verification and we\'ll send you a sign-in link.',
}));

// Magic link sent
write('previews/pages/magic-link-sent.html', magicLinkSentPage({
  email: 'david@example.com',
  storeName: STORE,
  brandColor: BRAND,
  theme: 'auto',
}));

// Downloads page
write('previews/pages/downloads.html', downloadsPage({
  storeName: STORE,
  brandColor: BRAND,
  theme: 'auto',
  order: { orderNumber: '#FC-2847', amount: '$63.20', date: 'Mar 27, 2026' },
  downloads: [
    {
      productName: 'Melodic House Pack',
      files: [
        { file: { name: 'Melodic-House-Pack-v2.1.zip', size: '248 MB' }, downloadUrl: '#' },
        { file: { name: 'Melodic-House-Bonus-Loops.zip', size: '34 MB' }, downloadUrl: '#', downloadCount: 1, downloadLimit: 5 },
      ],
      license: { key: 'FA15-328F-84FE-1974-D55D-A3E4', status: 'active' },
    },
    {
      productName: 'Bass Tech Presets',
      files: [
        { file: { name: 'Bass-Tech-Presets.zip', size: '12.4 MB' }, downloadUrl: '#' },
      ],
      license: { key: 'B7A2-91CF-E3D0-4856-AA12-7F33', status: 'active' },
    },
    {
      productName: 'Afro House Drum Kit',
      files: [
        { file: { name: 'Afro-House-Drums-WAV.zip', size: '89 MB' }, downloadUrl: '#', downloadCount: 3, downloadLimit: 3 },
      ],
      note: 'Download limit reached — contact support for help',
    },
  ],
}));

// Downloads empty
write('previews/pages/downloads-empty.html', downloadsPage({
  storeName: STORE,
  brandColor: BRAND,
  theme: 'auto',
  files: [],
}));

// Customer portal
write('previews/pages/portal.html', portalPage({
  customerName: 'David Sherlock',
  customerEmail: 'david@example.com',
  sessionToken: 'preview-token',
  manageUrl: '#manage-billing',
  storeName: STORE,
  brandColor: BRAND,
  theme: 'auto',
}));

// Error 404
write('previews/pages/error-404.html', errorPage({
  code: '404',
  title: 'Not Found',
  message: 'The page you\'re looking for doesn\'t exist or has been moved.',
  cta: { text: 'Go Home', url: '#' },
  storeName: STORE,
  brandColor: BRAND,
  theme: 'auto',
}));

// Error 403
write('previews/pages/error-403.html', errorPage({
  code: '403',
  title: 'Access Denied',
  message: 'You don\'t have permission to access this page. Your session may have expired.',
  cta: { text: 'Sign In', url: '#' },
  storeName: STORE,
  brandColor: BRAND,
  theme: 'auto',
}));

// Error generic
write('previews/pages/error-generic.html', errorPage({
  title: 'Something went wrong',
  message: 'An unexpected error occurred. Please try again later.',
  cta: { text: 'Try Again', url: '#' },
  storeName: STORE,
  theme: 'auto',
}));

// Custom page using renderPage + components
write('previews/pages/custom.html', renderPage({
  title: 'Custom Page',
  storeName: STORE,
  brandColor: '#6366f1',
  theme: 'auto',
  body: [
    header({ icon: 'key', title: 'License Activated', subtitle: 'Your license has been activated on this device.' }),
    alert({ message: 'Your license is now active. You can manage activations from your account.', type: 'success' }),
    keyValue({
      title: 'Activation Details',
      items: {
        'Product': 'Pro Audio Plugin',
        'License Key': 'FA15-328F-84FE-1974',
        'Device': 'MacBook Pro (M4)',
        'Activated': 'March 27, 2026',
        'Activations': '1 of 3',
      },
    }),
    spacer({ height: 8 }),
    '<div style="text-align:center">',
    button({ text: 'Manage Activations', url: '#', variant: 'outline' }),
    '</div>',
  ].join('\n'),
}));

console.log('\nDone! Open any file in previews/ in your browser.');

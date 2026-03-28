import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  renderPage, CSS,
  header, button, alert, input, fileRow, licenseKey, downloadCard,
  orderCard, keyValue, tabs, tabPanel, tabScript,
  divider, spacer, spinner, note, icons, components,
  successPage, loginPage, magicLinkSentPage,
  downloadsPage, portalPage, errorPage, pages,
} from '../src/index.js';

// ── renderPage ──────────────────────────────

describe('renderPage', () => {
  it('renders a complete HTML document', () => {
    const html = renderPage({ title: 'Test', body: '<p>Hello</p>' });
    assert.ok(html.includes('<!DOCTYPE html>'));
    assert.ok(html.includes('<p>Hello</p>'));
    assert.ok(html.includes('Test'));
  });

  it('includes CSS', () => {
    const html = renderPage({ title: 'Test' });
    assert.ok(html.includes('<style>'));
    assert.ok(html.includes('--bg'));
  });

  it('sets brand color as CSS variable', () => {
    const html = renderPage({ brandColor: '#ff0000' });
    assert.ok(html.includes('--brand:#ff0000'));
  });

  it('defaults to #06b6d4', () => {
    const html = renderPage({});
    assert.ok(html.includes('--brand:#06b6d4'));
  });

  it('applies dark theme class', () => {
    const html = renderPage({ theme: 'dark' });
    assert.ok(html.includes('class="dark"'));
  });

  it('applies auto theme class', () => {
    const html = renderPage({ theme: 'auto' });
    assert.ok(html.includes('class="auto"'));
  });

  it('applies light theme (no class)', () => {
    const html = renderPage({ theme: 'light' });
    assert.ok(html.includes('class=""'));
  });

  it('includes store name in title and footer', () => {
    const html = renderPage({ title: 'Orders', storeName: 'My Store' });
    assert.ok(html.includes('Orders — My Store'));
    assert.ok(html.includes('My Store'));
  });

  it('includes scripts', () => {
    const html = renderPage({ scripts: 'console.log("hi")' });
    assert.ok(html.includes('<script>console.log("hi")</script>'));
  });

  it('includes extraHead', () => {
    const html = renderPage({ extraHead: '<meta name="robots" content="noindex">' });
    assert.ok(html.includes('noindex'));
  });

  it('supports custom footer', () => {
    const html = renderPage({ footer: '<p>Custom footer</p>' });
    assert.ok(html.includes('Custom footer'));
  });

  it('supports empty footer', () => {
    const html = renderPage({ footer: '' });
    assert.ok(!html.includes('&copy;'));
  });

  it('adds noindex meta', () => {
    const html = renderPage({ noIndex: true });
    assert.ok(html.includes('noindex,nofollow'));
  });

  it('adds meta description', () => {
    const html = renderPage({ description: 'My store page' });
    assert.ok(html.includes('name="description"'));
    assert.ok(html.includes('My store page'));
  });

  it('adds canonical URL', () => {
    const html = renderPage({ canonical: 'https://example.com/page' });
    assert.ok(html.includes('rel="canonical"'));
    assert.ok(html.includes('https://example.com/page'));
  });

  it('adds favicon', () => {
    const html = renderPage({ favicon: '/favicon.ico' });
    assert.ok(html.includes('rel="icon"'));
    assert.ok(html.includes('/favicon.ico'));
  });

  it('adds Open Graph tags', () => {
    const html = renderPage({
      title: 'Test',
      og: { title: 'OG Title', description: 'OG Desc', image: 'https://img.com/og.png', url: 'https://example.com' },
    });
    assert.ok(html.includes('og:title'));
    assert.ok(html.includes('OG Title'));
    assert.ok(html.includes('og:description'));
    assert.ok(html.includes('og:image'));
    assert.ok(html.includes('og:url'));
    assert.ok(html.includes('og:type'));
  });

  it('og falls back to title and description', () => {
    const html = renderPage({ title: 'Page Title', description: 'Page desc', og: {} });
    assert.ok(html.includes('Page Title'));
    assert.ok(html.includes('Page desc'));
  });
});

// ── CSS ─────────────────────────────────────

describe('CSS', () => {
  it('is a string', () => {
    assert.ok(typeof CSS === 'string');
    assert.ok(CSS.length > 1000);
  });

  it('contains theme variables', () => {
    assert.ok(CSS.includes(':root'));
    assert.ok(CSS.includes('.dark'));
    assert.ok(CSS.includes('.auto'));
    assert.ok(CSS.includes('--bg'));
    assert.ok(CSS.includes('--text'));
  });
});

// ── header ──────────────────────────────────

describe('header', () => {
  it('renders title', () => {
    const html = header({ title: 'Hello' });
    assert.ok(html.includes('Hello'));
    assert.ok(html.includes('page-header'));
  });

  it('renders subtitle', () => {
    const html = header({ title: 'Hi', subtitle: 'World' });
    assert.ok(html.includes('World'));
    assert.ok(html.includes('subtitle'));
  });

  it('renders icon', () => {
    const html = header({ icon: 'check', title: 'Done' });
    assert.ok(html.includes('icon-circle'));
    assert.ok(html.includes('<svg'));
  });

  it('supports all icon types', () => {
    for (const icon of ['check', 'mail', 'alertCircle', 'user', 'key']) {
      assert.ok(header({ icon, title: 'X' }).includes('<svg'));
    }
  });

  it('escapes title', () => {
    const html = header({ title: '<script>alert(1)</script>' });
    assert.ok(!html.includes('<script>alert'));
  });
});

// ── button ──────────────────────────────────

describe('button', () => {
  it('renders link button', () => {
    const html = button({ text: 'Click', url: '/go' });
    assert.ok(html.includes('<a'));
    assert.ok(html.includes('Click'));
    assert.ok(html.includes('/go'));
  });

  it('renders submit button', () => {
    const html = button({ text: 'Submit', type: 'submit' });
    assert.ok(html.includes('<button'));
    assert.ok(html.includes('type="submit"'));
  });

  it('supports outline variant', () => {
    assert.ok(button({ text: 'X', url: '#', variant: 'outline' }).includes('btn-outline'));
  });

  it('supports danger variant', () => {
    assert.ok(button({ text: 'X', url: '#', variant: 'danger' }).includes('btn-danger'));
  });

  it('supports disabled', () => {
    assert.ok(button({ text: 'X', disabled: true }).includes('btn-disabled'));
  });

  it('supports fullWidth', () => {
    assert.ok(button({ text: 'X', fullWidth: true }).includes('width:100%'));
  });

  it('returns empty for no text', () => {
    assert.equal(button({}), '');
  });
});

// ── alert ───────────────────────────────────

describe('alert', () => {
  it('renders all types', () => {
    assert.ok(alert({ message: 'X', type: 'info' }).includes('alert-info'));
    assert.ok(alert({ message: 'X', type: 'success' }).includes('alert-success'));
    assert.ok(alert({ message: 'X', type: 'warning' }).includes('alert-warning'));
    assert.ok(alert({ message: 'X', type: 'error' }).includes('alert-error'));
  });

  it('returns empty for no message', () => {
    assert.equal(alert({}), '');
  });

  it('escapes message', () => {
    assert.ok(!alert({ message: '<script>' }).includes('<script>'));
  });
});

// ── input ───────────────────────────────────

describe('input', () => {
  it('renders input', () => {
    const html = input({ name: 'email', type: 'email', placeholder: 'you@example.com' });
    assert.ok(html.includes('name="email"'));
    assert.ok(html.includes('type="email"'));
    assert.ok(html.includes('you@example.com'));
  });

  it('supports label', () => {
    const html = input({ label: 'Email', name: 'email' });
    assert.ok(html.includes('Email'));
    assert.ok(html.includes('section-label'));
  });

  it('supports required', () => {
    assert.ok(input({ required: true }).includes('required'));
  });
});

// ── fileRow ─────────────────────────────────

describe('fileRow', () => {
  it('renders file with download button', () => {
    const html = fileRow({ file: { name: 'plugin.zip', size: '4 MB' }, downloadUrl: '/dl/1' });
    assert.ok(html.includes('plugin.zip'));
    assert.ok(html.includes('4 MB'));
    assert.ok(html.includes('/dl/1'));
    assert.ok(html.includes('Download'));
  });

  it('shows download count', () => {
    const html = fileRow({ file: { name: 'x' }, downloadUrl: '#', downloadCount: 3, downloadLimit: 5 });
    assert.ok(html.includes('3 of 5'));
  });

  it('shows exhausted state', () => {
    const html = fileRow({ file: { name: 'x' }, downloadUrl: '#', downloadCount: 5, downloadLimit: 5 });
    assert.ok(html.includes('Limit Reached'));
    assert.ok(html.includes('file-row-exhausted'));
  });

  it('no count for unlimited', () => {
    const html = fileRow({ file: { name: 'x' }, downloadUrl: '#', isUnlimited: true });
    assert.ok(!html.includes('downloads used'));
  });

  it('returns empty for no file', () => {
    assert.equal(fileRow({}), '');
  });

  it('handles various file property names', () => {
    assert.ok(fileRow({ file: { original_name: 'a.zip' }, downloadUrl: '#' }).includes('a.zip'));
    assert.ok(fileRow({ file: { fileName: 'b.zip' }, downloadUrl: '#' }).includes('b.zip'));
  });
});

// ── licenseKey ──────────────────────────────

describe('licenseKey', () => {
  it('renders key', () => {
    const html = licenseKey({ key: 'ABCD-1234' });
    assert.ok(html.includes('ABCD-1234'));
    assert.ok(html.includes('license-key'));
  });

  it('includes copy button', () => {
    assert.ok(licenseKey({ key: 'X' }).includes('copy-btn'));
    assert.ok(licenseKey({ key: 'X' }).includes('clipboard'));
  });

  it('shows active status', () => {
    const html = licenseKey({ key: 'X', status: 'active' });
    assert.ok(html.includes('license-active'));
    assert.ok(html.includes('Active'));
  });

  it('shows expired status', () => {
    const html = licenseKey({ key: 'X', status: 'expired' });
    assert.ok(html.includes('license-expired'));
    assert.ok(html.includes('Expired'));
  });

  it('supports label', () => {
    assert.ok(licenseKey({ key: 'X', label: 'Pro Plugin' }).includes('Pro Plugin'));
  });

  it('returns empty for no key', () => {
    assert.equal(licenseKey({}), '');
  });
});

// ── downloadCard ────────────────────────────

describe('downloadCard', () => {
  it('renders product card with files', () => {
    const html = downloadCard({
      productName: 'Melodic House Pack',
      files: [{ file: { name: 'pack.zip', size: '248 MB' }, downloadUrl: '/dl/1' }],
    });
    assert.ok(html.includes('Melodic House Pack'));
    assert.ok(html.includes('pack.zip'));
    assert.ok(html.includes('card'));
  });

  it('includes license key inline', () => {
    const html = downloadCard({
      productName: 'Pro Plugin',
      files: [{ file: { name: 'plugin.zip' }, downloadUrl: '#' }],
      license: { key: 'ABCD-1234', status: 'active' },
    });
    assert.ok(html.includes('ABCD-1234'));
    assert.ok(html.includes('license-active'));
    assert.ok(html.includes('copy-btn'));
  });

  it('includes note', () => {
    const html = downloadCard({
      productName: 'Bundle',
      files: [{ file: { name: 'x.zip' }, downloadUrl: '#' }],
      note: 'Includes 3 bonus packs',
    });
    assert.ok(html.includes('Includes 3 bonus packs'));
  });

  it('renders multiple files', () => {
    const html = downloadCard({
      productName: 'Multi-File Product',
      files: [
        { file: { name: 'a.zip' }, downloadUrl: '#' },
        { file: { name: 'b.zip' }, downloadUrl: '#' },
      ],
    });
    assert.ok(html.includes('a.zip'));
    assert.ok(html.includes('b.zip'));
  });

  it('returns empty for no product and no files', () => {
    assert.equal(downloadCard({}), '');
  });
});

// ── orderCard ───────────────────────────────

describe('orderCard', () => {
  it('renders order info', () => {
    const html = orderCard({ orderNumber: '#1234', amount: '$29.00', date: 'Mar 27' });
    assert.ok(html.includes('#1234'));
    assert.ok(html.includes('$29.00'));
    assert.ok(html.includes('Mar 27'));
  });

  it('renders body content', () => {
    const html = orderCard({ body: '<p>Files here</p>' });
    assert.ok(html.includes('Files here'));
  });
});

// ── keyValue ────────────────────────────────

describe('keyValue', () => {
  it('renders pairs', () => {
    const html = keyValue({ items: { 'Order': '#1234', 'Status': 'Complete' } });
    assert.ok(html.includes('Order'));
    assert.ok(html.includes('#1234'));
    assert.ok(html.includes('Status'));
  });

  it('supports title', () => {
    assert.ok(keyValue({ items: { a: 'b' }, title: 'Details' }).includes('Details'));
  });

  it('returns empty for empty items', () => {
    assert.equal(keyValue({ items: {} }), '');
  });
});

// ── tabs ────────────────────────────────────

describe('tabs', () => {
  it('renders tab buttons', () => {
    const html = tabs({ tabs: ['Orders', 'Downloads', 'Licenses'] });
    assert.ok(html.includes('Orders'));
    assert.ok(html.includes('Downloads'));
    assert.ok(html.includes('Licenses'));
    assert.ok(html.includes('tab-active'));
  });

  it('first tab is active by default', () => {
    const html = tabs({ tabs: ['A', 'B'] });
    assert.ok(html.includes('tab-active'));
  });
});

describe('tabPanel', () => {
  it('renders panel', () => {
    const html = tabPanel({ id: 'orders', content: '<p>List</p>', active: true });
    assert.ok(html.includes('tab-panel-active'));
    assert.ok(html.includes('List'));
  });

  it('inactive by default', () => {
    const html = tabPanel({ id: 'test', content: 'X' });
    assert.ok(!html.includes('tab-panel-active'));
  });
});

describe('tabScript', () => {
  it('returns script with switchTab function', () => {
    const html = tabScript();
    assert.ok(html.includes('<script>'));
    assert.ok(html.includes('switchTab'));
  });
});

// ── divider / spacer / spinner / note ───────

describe('divider', () => {
  it('renders hr', () => assert.ok(divider().includes('<hr')));
});

describe('spacer', () => {
  it('renders default height', () => assert.ok(spacer().includes('24px')));
  it('supports custom height', () => assert.ok(spacer({ height: 40 }).includes('40px')));
});

describe('spinner', () => {
  it('renders spinner', () => assert.ok(spinner().includes('spinner')));
  it('supports text', () => assert.ok(spinner({ text: 'Loading...' }).includes('Loading...')));
});

describe('note', () => {
  it('renders note', () => assert.ok(note({ message: 'Empty' }).includes('Empty')));
  it('returns empty for no message', () => assert.equal(note({}), ''));
});

// ── icons ───────────────────────────────────

describe('icons', () => {
  it('exports all icon functions', () => {
    assert.ok(typeof icons.download === 'function');
    assert.ok(typeof icons.lock === 'function');
    assert.ok(typeof icons.check === 'function');
    assert.ok(typeof icons.mail === 'function');
    assert.ok(typeof icons.alertCircle === 'function');
    assert.ok(typeof icons.user === 'function');
    assert.ok(typeof icons.key === 'function');
  });

  it('returns SVG strings', () => {
    assert.ok(icons.download().includes('<svg'));
    assert.ok(icons.check('#f00').includes('#f00'));
  });
});

// ── components namespace ────────────────────

describe('components namespace', () => {
  it('exports all components', () => {
    const names = ['header', 'button', 'alert', 'input', 'fileRow', 'licenseKey', 'downloadCard',
      'orderCard', 'keyValue', 'tabs', 'tabPanel', 'tabScript',
      'divider', 'spacer', 'spinner', 'note', 'icons'];
    for (const n of names) {
      assert.ok(n in components, `Missing: ${n}`);
    }
  });
});

// ── Pre-built Pages ─────────────────────────

describe('successPage', () => {
  it('renders complete success page', () => {
    const html = successPage({
      title: 'Thank you!',
      subtitle: 'Order confirmed',
      storeName: 'My Store',
      brandColor: '#06b6d4',
      theme: 'dark',
      order: { orderNumber: '#1234', amount: '$29.00', date: 'Mar 27' },
      files: [{ file: { name: 'plugin.zip', size: '4 MB' }, downloadUrl: '/dl/1' }],
      licenses: [{ key: 'ABCD-1234', status: 'active' }],
    });
    assert.ok(html.includes('<!DOCTYPE html>'));
    assert.ok(html.includes('Thank you!'));
    assert.ok(html.includes('#1234'));
    assert.ok(html.includes('plugin.zip'));
    assert.ok(html.includes('ABCD-1234'));
    assert.ok(html.includes('My Store'));
  });

  it('auto-generates order details', () => {
    const html = successPage({
      order: { orderNumber: '#FC-99', amount: '$49.00', email: 'test@test.com', date: 'Mar 28' },
    });
    assert.ok(html.includes('#FC-99'));
    assert.ok(html.includes('$49.00'));
    assert.ok(html.includes('test@test.com'));
  });

  it('renders grouped downloads with inline license keys', () => {
    const html = successPage({
      title: 'Thank you!',
      downloads: [
        {
          productName: 'Melodic House Pack',
          files: [{ file: { name: 'pack.zip' }, downloadUrl: '/dl/1' }],
          license: { key: 'AAAA-BBBB', status: 'active' },
          note: 'Includes bonus content',
        },
        {
          productName: 'Bass Presets',
          files: [{ file: { name: 'presets.zip' }, downloadUrl: '/dl/2' }],
        },
      ],
    });
    assert.ok(html.includes('Melodic House Pack'));
    assert.ok(html.includes('AAAA-BBBB'));
    assert.ok(html.includes('Includes bonus content'));
    assert.ok(html.includes('Bass Presets'));
    assert.ok(html.includes('presets.zip'));
  });

  it('uses grouped downloads over flat files when both provided', () => {
    const html = successPage({
      downloads: [{ productName: 'Grouped', files: [{ file: { name: 'g.zip' }, downloadUrl: '#' }] }],
      files: [{ file: { name: 'flat.zip' }, downloadUrl: '#' }],
    });
    assert.ok(html.includes('Grouped'));
    assert.ok(!html.includes('flat.zip'));
  });
});

describe('loginPage', () => {
  it('renders login form', () => {
    const html = loginPage({ storeName: 'My Store', theme: 'dark' });
    assert.ok(html.includes('<form'));
    assert.ok(html.includes('type="email"'));
    assert.ok(html.includes('Send Magic Link'));
  });

  it('includes Turnstile when site key provided', () => {
    const html = loginPage({ turnstileSiteKey: 'xxx' });
    assert.ok(html.includes('cf-turnstile'));
    assert.ok(html.includes('challenges.cloudflare.com'));
  });

  it('shows error message', () => {
    const html = loginPage({ error: 'Invalid email' });
    assert.ok(html.includes('Invalid email'));
    assert.ok(html.includes('alert-error'));
  });
});

describe('magicLinkSentPage', () => {
  it('renders confirmation', () => {
    const html = magicLinkSentPage({ email: 'test@example.com' });
    assert.ok(html.includes('Check Your Email'));
    assert.ok(html.includes('test@example.com'));
  });
});

describe('downloadsPage', () => {
  it('renders files', () => {
    const html = downloadsPage({
      files: [{ file: { name: 'a.zip' }, downloadUrl: '/dl/1' }],
    });
    assert.ok(html.includes('a.zip'));
    assert.ok(html.includes('Your Downloads'));
  });

  it('shows empty state', () => {
    const html = downloadsPage({ files: [] });
    assert.ok(html.includes('No downloadable files'));
  });

  it('includes licenses', () => {
    const html = downloadsPage({
      files: [{ file: { name: 'x' }, downloadUrl: '#' }],
      licenses: [{ key: 'KEY-123' }],
    });
    assert.ok(html.includes('KEY-123'));
  });
});

describe('portalPage', () => {
  it('renders portal with tabs', () => {
    const html = portalPage({
      customerName: 'David',
      customerEmail: 'david@example.com',
      sessionToken: 'abc123',
    });
    assert.ok(html.includes('David'));
    assert.ok(html.includes('Orders'));
    assert.ok(html.includes('Downloads'));
    assert.ok(html.includes('Licenses'));
    assert.ok(html.includes('switchTab'));
  });

  it('includes manage billing button', () => {
    const html = portalPage({ manageUrl: 'https://billing.stripe.com/xxx' });
    assert.ok(html.includes('Manage Billing'));
    assert.ok(html.includes('billing.stripe.com'));
  });

  it('includes sign out button', () => {
    assert.ok(portalPage({}).includes('Sign Out'));
  });
});

describe('errorPage', () => {
  it('renders error', () => {
    const html = errorPage({ title: 'Not Found', code: '404', message: 'Page not found' });
    assert.ok(html.includes('404'));
    assert.ok(html.includes('Not Found'));
    assert.ok(html.includes('Page not found'));
  });

  it('includes CTA', () => {
    const html = errorPage({ cta: { text: 'Go Home', url: '/' } });
    assert.ok(html.includes('Go Home'));
  });
});

// ── pages namespace ─────────────────────────

describe('pages namespace', () => {
  it('exports all pages', () => {
    assert.ok(typeof pages.successPage === 'function');
    assert.ok(typeof pages.loginPage === 'function');
    assert.ok(typeof pages.magicLinkSentPage === 'function');
    assert.ok(typeof pages.downloadsPage === 'function');
    assert.ok(typeof pages.portalPage === 'function');
    assert.ok(typeof pages.errorPage === 'function');
  });
});

// ── Integration ─────────────────────────────

describe('integration', () => {
  it('all themes produce valid HTML', () => {
    for (const theme of ['light', 'dark', 'auto']) {
      const html = successPage({ title: 'Test', theme, storeName: 'Store' });
      assert.ok(html.includes('<!DOCTYPE html>'));
      assert.ok(html.includes('</html>'));
    }
  });

  it('components work inside renderPage', () => {
    const html = renderPage({
      title: 'Custom',
      body: header({ title: 'Hi' })
        + alert({ message: 'Welcome', type: 'success' })
        + fileRow({ file: { name: 'f.zip' }, downloadUrl: '/dl' })
        + keyValue({ items: { A: '1' } })
        + button({ text: 'Go', url: '/' }),
    });
    assert.ok(html.includes('Hi'));
    assert.ok(html.includes('Welcome'));
    assert.ok(html.includes('f.zip'));
    assert.ok(html.includes('Go'));
  });
});

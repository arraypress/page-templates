# @arraypress/page-templates

Server-rendered HTML page templates and components for transactional pages. Order success, downloads, customer portal, login. Light and dark themes with auto-detection.

Pure functions that return HTML strings. Zero dependencies. Works in Node.js, Cloudflare Workers, Deno, Bun, and browsers.

## Install

```bash
npm install @arraypress/page-templates
```

## Quick Start

```js
import { renderPage, components } from '@arraypress/page-templates';

// Build your own page from components
return c.html(renderPage({
  title: 'Your Downloads',
  storeName: 'My Store',
  brandColor: '#06d6a0',
  theme: 'dark',
  body: components.header({ icon: 'check', title: 'Thank you!', subtitle: 'Order confirmed.' })
    + components.fileRow({ file: { name: 'plugin.zip', size: '4.7 MB' }, downloadUrl: '/dl/1' })
    + components.licenseKey({ key: 'FA15-328F-84FE-1974', status: 'active' })
    + components.button({ text: 'View Order', url: '/order/1234' }),
}));
```

Or use a pre-built page:

```js
import { successPage } from '@arraypress/page-templates';

return c.html(successPage({
  title: 'Thank you!',
  storeName: 'My Store',
  brandColor: '#06d6a0',
  theme: 'dark',
  order: { orderNumber: '#FC-1234', amount: '$29.00', date: 'Mar 27, 2026' },
  files: [{ file: { name: 'plugin.zip', size: '4.7 MB' }, downloadUrl: '/dl/1' }],
  licenses: [{ key: 'FA15-328F-84FE-1974', status: 'active' }],
}));
```

## Themes

Three theme modes:

| Theme | Behavior |
|---|---|
| `'auto'` | Follows user's OS preference (default) |
| `'dark'` | Always dark |
| `'light'` | Always light |

All themes use CSS custom properties. Brand color is configurable.

## Pre-built Pages

### `successPage(options)`

Order confirmation with downloads and license keys.

```js
successPage({
  title: 'Thank you!',
  subtitle: 'Order confirmed',
  order: { orderNumber: '#1234', amount: '$29.00', date: 'Mar 27' },
  details: { 'Payment': 'Visa •••• 4242', 'Email': 'david@example.com' },
  files: [{ file: { name: 'plugin.zip', size: '4 MB' }, downloadUrl: '/dl/1' }],
  licenses: [{ key: 'ABCD-1234', status: 'active' }],
  cta: { text: 'View Order History', url: '/store/login' },
  storeName: 'My Store', brandColor: '#06d6a0', theme: 'dark',
})
```

### `loginPage(options)`

Email form with optional Cloudflare Turnstile captcha.

```js
loginPage({
  actionUrl: '/api/magic-link',
  turnstileSiteKey: '0x4AAAA...', // optional, enables captcha
  helpText: 'We\'ll send you a link to access your orders.',
  error: 'Invalid email address', // optional error message
  storeName: 'My Store', theme: 'auto',
})
```

### `magicLinkSentPage(options)`

Confirmation after magic link is sent.

```js
magicLinkSentPage({ email: 'david@example.com', storeName: 'My Store' })
```

### `downloadsPage(options)`

File list with download counts, limits, and license keys.

```js
downloadsPage({
  files: [
    { file: { name: 'plugin.zip', size: '4 MB' }, downloadUrl: '/dl/1', downloadCount: 2, downloadLimit: 5 },
  ],
  licenses: [{ key: 'ABCD-1234', status: 'active', label: 'Pro Plugin' }],
  order: { orderNumber: '#1234', amount: '$29.00' },
  storeName: 'My Store', theme: 'dark',
})
```

### `portalPage(options)`

Customer account page with tabbed sections (orders, downloads, licenses) that fetch data via API.

```js
portalPage({
  customerName: 'David',
  customerEmail: 'david@example.com',
  apiBase: '/api/store',
  sessionToken: 'abc123',
  manageUrl: 'https://billing.stripe.com/session/xxx',
  storeName: 'My Store', theme: 'auto',
})
```

### `errorPage(options)`

Error display with optional CTA.

```js
errorPage({
  title: 'Not Found', code: '404',
  message: 'The page you requested could not be found.',
  cta: { text: 'Go Home', url: '/' },
  storeName: 'My Store',
})
```

## Components

All components are pure functions returning HTML strings.

| Component | Description |
|---|---|
| `header({ icon, title, subtitle })` | Page header with icon circle |
| `button({ text, url, variant, ... })` | CTA button (primary, outline, danger) |
| `alert({ message, type })` | Notice box (info, success, warning, error) |
| `input({ name, type, placeholder, ... })` | Styled text input with optional label |
| `fileRow({ file, downloadUrl, ... })` | Download row with count/limit tracking |
| `licenseKey({ key, status, label })` | License display with copy button |
| `orderCard({ orderNumber, amount, ... })` | Order summary card |
| `keyValue({ items, title })` | Key-value pairs list |
| `tabs({ tabs, activeTab })` | Tab bar with vanilla JS switching |
| `tabPanel({ id, content, active })` | Tab content panel |
| `divider()` | Horizontal rule |
| `spacer({ height })` | Vertical gap |
| `spinner({ text })` | Loading spinner |
| `note({ message })` | Empty state / help text |

Icons: `check`, `mail`, `alertCircle`, `user`, `key`, `download`, `lock`.

## Usage with Hono

```js
import { Hono } from 'hono';
import { successPage, loginPage, errorPage } from '@arraypress/page-templates';

const app = new Hono();

app.get('/order/success', async (c) => {
  const order = await getOrder(c);
  return c.html(successPage({
    title: 'Thank you!',
    order: { orderNumber: order.number, amount: order.formatted_amount },
    files: order.files.map(f => ({ file: f, downloadUrl: `/api/download/${order.id}/${f.id}` })),
    storeName: settings.store_name,
    brandColor: settings.brand_color,
    theme: 'auto',
  }));
});

app.get('/store/login', (c) => {
  return c.html(loginPage({
    turnstileSiteKey: c.env.TURNSTILE_SITE_KEY,
    storeName: settings.store_name,
  }));
});

app.notFound((c) => {
  return c.html(errorPage({ code: '404', title: 'Not Found', cta: { text: 'Go Home', url: '/' } }));
});
```

## License

MIT

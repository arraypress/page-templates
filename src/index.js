/**
 * @arraypress/page-templates
 *
 * Server-rendered HTML page templates and components for transactional pages.
 * Order success, downloads, customer portal, login. Light and dark themes.
 *
 * Pure functions that return HTML strings. Zero dependencies.
 * Works in Node.js, Cloudflare Workers, Deno, Bun, and browsers.
 *
 * @module @arraypress/page-templates
 */

// Core renderer
export { renderPage } from './render.js';

// CSS (exported for custom use)
export { CSS } from './styles.js';

// HTML-escape helper — exposed so callers can escape user input
// before building their own HTML strings around these components.
export { escapeHtml } from './components/index.js';

// Components (individual + namespace)
import * as components from './components/index.js';
export { components };

export {
  header, button, alert, input, fileRow, licenseKey, downloadCard,
  orderCard, keyValue, tabs, tabPanel, tabScript,
  divider, spacer, spinner, note, icons,
} from './components/index.js';

// Pre-built pages
import * as pages from './pages/index.js';
export { pages };

export {
  successPage, loginPage, magicLinkSentPage,
  downloadsPage, portalPage, errorPage,
} from './pages/index.js';

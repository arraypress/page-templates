/**
 * @arraypress/page-templates — TypeScript definitions.
 */

// ── Render ──────────────────────────────────

export interface RenderPageOptions {
  title?: string;
  body?: string;
  storeName?: string;
  brandColor?: string;
  theme?: 'light' | 'dark' | 'auto';
  scripts?: string;
  extraHead?: string;
  footer?: string;
  lang?: string;
  /** Meta description. */
  description?: string;
  /** Favicon URL. */
  favicon?: string;
  /** Add noindex,nofollow robots meta. */
  noIndex?: boolean;
  /** Canonical URL. */
  canonical?: string;
  /** Open Graph tags. */
  og?: { title?: string; description?: string; image?: string; url?: string };
}

export function renderPage(options: RenderPageOptions): string;
export const CSS: string;

// ── Components ──────────────────────────────

export function header(options: {
  icon?: 'check' | 'mail' | 'alertCircle' | 'user' | 'key' | 'download';
  iconColor?: string;
  iconBg?: string;
  title: string;
  subtitle?: string;
}): string;

export function button(options: {
  text: string;
  url?: string;
  type?: string;
  variant?: 'primary' | 'outline' | 'danger' | 'sm';
  id?: string;
  disabled?: boolean;
  fullWidth?: boolean;
}): string;

export function alert(options: {
  message: string;
  type?: 'info' | 'success' | 'warning' | 'error';
}): string;

export function input(options: {
  name?: string;
  type?: string;
  placeholder?: string;
  value?: string;
  id?: string;
  required?: boolean;
  label?: string;
}): string;

export function fileRow(options: {
  file: { name?: string; original_name?: string; size?: string; file_size?: string; productName?: string; product_name?: string };
  downloadUrl: string;
  downloadCount?: number;
  downloadLimit?: number;
  isUnlimited?: boolean;
}): string;

export function licenseKey(options: {
  key: string;
  status?: 'active' | 'expired';
  label?: string;
}): string;

export function downloadCard(options: {
  productName: string;
  files: Array<{ file: any; downloadUrl: string; downloadCount?: number; downloadLimit?: number; isUnlimited?: boolean }>;
  license?: { key: string; status?: 'active' | 'expired' };
  note?: string;
}): string;

export function orderCard(options: {
  orderNumber?: string;
  amount?: string;
  date?: string;
  status?: string;
  body?: string;
}): string;

export function keyValue(options: {
  items: Record<string, string | number>;
  title?: string;
}): string;

export function tabs(options: {
  tabs: string[];
  activeTab?: string;
}): string;

export function tabPanel(options: {
  id: string;
  content: string;
  active?: boolean;
}): string;

export function tabScript(): string;
export function divider(): string;
export function spacer(options?: { height?: number }): string;
export function spinner(options?: { text?: string }): string;
export function note(options: { message: string }): string;

export const icons: {
  download: (color?: string) => string;
  lock: () => string;
  check: (color?: string) => string;
  mail: (color?: string) => string;
  alertCircle: (color?: string) => string;
  user: (color?: string) => string;
  key: (color?: string) => string;
};

export const components: {
  header: typeof header;
  button: typeof button;
  alert: typeof alert;
  input: typeof input;
  fileRow: typeof fileRow;
  licenseKey: typeof licenseKey;
  downloadCard: typeof downloadCard;
  orderCard: typeof orderCard;
  keyValue: typeof keyValue;
  tabs: typeof tabs;
  tabPanel: typeof tabPanel;
  tabScript: typeof tabScript;
  divider: typeof divider;
  spacer: typeof spacer;
  spinner: typeof spinner;
  note: typeof note;
  icons: typeof icons;
};

// ── Pre-built Pages ─────────────────────────

interface PageOptions {
  storeName?: string;
  brandColor?: string;
  theme?: 'light' | 'dark' | 'auto';
}

export function successPage(options: PageOptions & {
  title?: string;
  subtitle?: string;
  order?: { orderNumber?: string; amount?: string; date?: string };
  details?: Record<string, string | number>;
  files?: Array<{ file: any; downloadUrl: string; downloadCount?: number; downloadLimit?: number }>;
  licenses?: Array<{ key: string; status?: string; label?: string }>;
  message?: string;
  cta?: { text: string; url: string };
}): string;

export interface CaptchaConfig {
  provider: 'turnstile' | 'recaptcha';
  siteKey: string;
}

export function loginPage(options: PageOptions & {
  title?: string;
  subtitle?: string;
  actionUrl?: string;
  buttonText?: string;
  /** CAPTCHA config. Takes priority over turnstileSiteKey. */
  captcha?: CaptchaConfig | null;
  /** @deprecated Use `captcha` instead. */
  turnstileSiteKey?: string;
  helpText?: string;
  error?: string;
}): string;

export function magicLinkSentPage(options: PageOptions & {
  email?: string;
}): string;

export function downloadsPage(options: PageOptions & {
  title?: string;
  subtitle?: string;
  files: Array<{ file: any; downloadUrl: string; downloadCount?: number; downloadLimit?: number }>;
  licenses?: Array<{ key: string; status?: string; label?: string }>;
  order?: { orderNumber?: string; amount?: string; date?: string };
}): string;

export function portalPage(options: PageOptions & {
  title?: string;
  customerName?: string;
  customerEmail?: string;
  apiBase?: string;
  sessionToken?: string;
  manageUrl?: string;
}): string;

export function errorPage(options: PageOptions & {
  title?: string;
  message?: string;
  code?: string;
  cta?: { text: string; url: string };
}): string;

export const pages: {
  successPage: typeof successPage;
  loginPage: typeof loginPage;
  magicLinkSentPage: typeof magicLinkSentPage;
  downloadsPage: typeof downloadsPage;
  portalPage: typeof portalPage;
  errorPage: typeof errorPage;
};

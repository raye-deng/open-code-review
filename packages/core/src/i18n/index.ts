/**
 * i18n Module — Internationalization Framework
 *
 * Provides translation services for all user-visible strings.
 * Supports English (en) and Chinese (zh) locales.
 *
 * @since 0.4.0
 */

// Types
export type { Locale, I18nProvider } from './types.js';

// Provider
export { DefaultI18nProvider, createI18n } from './provider.js';

// Message catalogs (for testing or direct access)
export { EN_MESSAGES, EN_LOCALE } from './en.js';
export { ZH_MESSAGES, ZH_LOCALE } from './zh.js';

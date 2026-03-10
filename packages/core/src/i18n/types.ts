/**
 * i18n Framework Types
 *
 * Defines the I18nProvider interface for internationalization support.
 * All user-visible strings pass through this interface.
 *
 * @since 0.4.0
 */

/**
 * Supported locales.
 */
export type Locale = 'en' | 'zh';

/**
 * I18n Provider Interface
 *
 * Provides translation services for all user-visible strings.
 * Implementations should support parameter interpolation.
 */
export interface I18nProvider {
  /** Current locale */
  readonly locale: Locale;

  /**
   * Translate a key with optional interpolation parameters.
   *
   * @param key - Message key (e.g., 'scan.start', 'detector.hallucinated-import')
   * @param params - Optional parameters for interpolation (e.g., { count: 5 })
   * @returns Translated string with parameters interpolated
   */
  t(key: string, params?: Record<string, string | number>): string;

  /**
   * Set the current locale.
   *
   * @param locale - New locale to use
   */
  setLocale(locale: Locale): void;
}

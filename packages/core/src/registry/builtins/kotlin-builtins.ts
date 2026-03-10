/**
 * Kotlin standard library packages.
 *
 * Includes both Kotlin-specific stdlib and Java stdlib packages
 * (since Kotlin runs on the JVM and can use all Java stdlib).
 *
 * @since 0.4.0 (V4)
 */

import { JAVA_BUILTINS } from './java-builtins.js';

export const KOTLIN_BUILTINS = new Set([
  // Kotlin stdlib
  'kotlin',
  'kotlin.collections',
  'kotlin.sequences',
  'kotlin.text',
  'kotlin.io',
  'kotlin.math',
  'kotlin.random',
  'kotlin.time',
  'kotlin.reflect',
  'kotlin.coroutines',
  'kotlin.ranges',
  'kotlin.comparisons',
  'kotlin.properties',
  'kotlin.annotation',
  'kotlin.contracts',
  'kotlin.js',
  'kotlin.jvm',
  'kotlin.native',
  'kotlin.system',
  'kotlin.concurrent',

  // Kotlinx common packages (bundled with Kotlin)
  'kotlinx.coroutines',
  'kotlinx.serialization',

  // Kotlin also uses Java stdlib
  ...JAVA_BUILTINS,
]);

/**
 * Java standard library top-level packages that don't need registry verification.
 *
 * These are packages shipped with the JDK and should never be
 * flagged as hallucinated imports.
 *
 * @since 0.4.0 (V4)
 */

export const JAVA_BUILTINS = new Set([
  // Core java packages
  'java.lang',
  'java.util',
  'java.io',
  'java.nio',
  'java.net',
  'java.sql',
  'java.time',
  'java.math',
  'java.security',
  'java.text',
  'java.beans',
  'java.awt',

  // javax packages
  'javax.swing',
  'javax.annotation',
  'javax.xml',
  'javax.crypto',
  'javax.net',
  'javax.security',
  'javax.sql',
  'javax.naming',
  'javax.imageio',
  'javax.sound',
  'javax.print',
  'javax.management',
  'javax.script',
  'javax.tools',

  // Java module system (Java 9+)
  'java.base',
  'java.desktop',
  'java.logging',
  'java.rmi',
  'java.xml',
  'java.compiler',
  'java.instrument',
  'java.prefs',
  'java.datatransfer',

  // Jakarta (successor to javax in modern Java)
  'jakarta.annotation',
  'jakarta.servlet',
  'jakarta.persistence',
  'jakarta.transaction',
  'jakarta.validation',
  'jakarta.ws',
  'jakarta.xml',
  'jakarta.inject',
  'jakarta.enterprise',
]);

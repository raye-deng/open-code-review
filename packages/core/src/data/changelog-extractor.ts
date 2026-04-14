/**
 * Changelog Extractor for Adaptive Deprecated API Database
 *
 * Fetches GitHub releases and parses deprecation information from changelogs.
 * Updates deprecated-apis-*.json files with new deprecations found in popular
 * libraries and frameworks.
 *
 * @since 0.7.0
 */

import https from 'https';
import http from 'http';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';

// ─── Types ───────────────────────────────────────────────────────

/** Configuration for a package to monitor for deprecations */
export interface PackageConfig {
  /** Package name (e.g., 'nodejs/node', 'vuejs/core') */
  repo: string;
  /** Language this package is for */
  language: 'javascript' | 'typescript' | 'python' | 'java' | 'go' | 'kotlin';
  /** Patterns to identify deprecation mentions in release notes */
  deprecationKeywords: string[];
  /** Custom function to extract deprecation info from release notes */
  extractor?: (release: GitHubRelease) => DeprecationInfo[];
}

/** GitHub release information */
export interface GitHubRelease {
  tag_name: string;
  name: string;
  body: string;
  published_at: string;
  html_url: string;
}

/** Extracted deprecation information */
export interface DeprecationInfo {
  api: string;
  pattern?: string;
  replacement: string;
  deprecated_since: string;
  severity: 'high' | 'medium' | 'low';
  references: string[];
}

/** Result of changelog extraction */
export interface ExtractionResult {
  package: string;
  totalReleases: number;
  deprecationsFound: DeprecationInfo[];
  errors: string[];
}

// ─── Package Registry ─────────────────────────────────────────────

/** Packages to monitor for deprecations */
const MONITORED_PACKAGES: PackageConfig[] = [
  // JavaScript/TypeScript
  {
    repo: 'nodejs/node',
    language: 'javascript',
    deprecationKeywords: [
      'deprecated', 'deprecate', 'removed', 'legacy', 'obsolete',
      'no longer supported', 'will be removed'
    ],
  },
  {
    repo: 'facebook/react',
    language: 'javascript',
    deprecationKeywords: [
      'deprecated', 'deprecate', 'legacy', 'legacy lifecycle',
      'unsafe_', 'UNSAFE_', 'string refs'
    ],
  },
  {
    repo: 'vuejs/core',
    language: 'javascript',
    deprecationKeywords: [
      'deprecated', 'deprecate', 'Vue 2', 'Options API',
      'this.$set', 'this.$delete', 'Vue.set'
    ],
  },
  {
    repo: 'angular/angular',
    language: 'javascript',
    deprecationKeywords: [
      'deprecated', 'deprecate', 'removed', 'breaking change'
    ],
  },
  {
    repo: 'vercel/next.js',
    language: 'javascript',
    deprecationKeywords: [
      'deprecated', 'deprecate', 'legacy', 'removed'
    ],
  },

  // Python
  {
    repo: 'python/cpython',
    language: 'python',
    deprecationKeywords: [
      'deprecated', 'DeprecationWarning', 'PendingDeprecationWarning',
      'removed in', 'will be removed'
    ],
  },
  {
    repo: 'pallets/flask',
    language: 'python',
    deprecationKeywords: ['deprecated', 'deprecate'],
  },
  {
    repo: 'django/django',
    language: 'python',
    deprecationKeywords: ['deprecated', 'deprecate', 'removed'],
  },

  // Java
  {
    repo: 'openjdk/jdk',
    language: 'java',
    deprecationKeywords: ['deprecated', 'deprecate', 'removed'],
  },
  {
    repo: 'spring-projects/spring-framework',
    language: 'java',
    deprecationKeywords: ['deprecated', 'deprecate', 'removed'],
  },

  // Go
  {
    repo: 'golang/go',
    language: 'go',
    deprecationKeywords: ['deprecated', 'deprecate', 'removed'],
  },

  // Kotlin
  {
    repo: 'JetBrains/kotlin',
    language: 'kotlin',
    deprecationKeywords: ['deprecated', 'deprecate', 'removed'],
  },
];

// ─── GitHub API Client ───────────────────────────────────────────

/** Fetch GitHub releases for a repository */
async function fetchReleases(
  repo: string,
  maxReleases: number = 10
): Promise<GitHubRelease[]> {
  const url = `/repos/${repo}/releases?per_page=${maxReleases}`;

  return new Promise((resolve, reject) => {
    const options: https.RequestOptions = {
      hostname: 'api.github.com',
      path: url,
      method: 'GET',
      headers: {
        'User-Agent': 'open-code-review-changelog-extractor',
        'Accept': 'application/vnd.github.v3+json',
      },
    };

    const req = https.request(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        if (res.statusCode === 200) {
          try {
            const releases = JSON.parse(data);
            resolve(releases);
          } catch (error) {
            reject(new Error(`Failed to parse GitHub response: ${error}`));
          }
        } else {
          reject(new Error(`GitHub API error: ${res.statusCode} ${res.statusMessage}`));
        }
      });
    });

    req.on('error', reject);
    req.setTimeout(10000, () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });

    req.end();
  });
}

// ─── Deprecation Extraction ───────────────────────────────────────

/**
 * Extract deprecation information from a GitHub release
 */
function extractDeprecations(
  release: GitHubRelease,
  config: PackageConfig
): DeprecationInfo[] {
  const deprecations: DeprecationInfo[] = [];
  const body = release.body;
  const lines = body.split('\n');

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    // Check if this line mentions deprecation
    const hasDeprecationKeyword = config.deprecationKeywords.some(keyword =>
      line.toLowerCase().includes(keyword)
    );

    if (!hasDeprecationKeyword) continue;

    // Extract API name (simple heuristic)
    const apiMatch = line.match(/`?([A-Za-z0-9_.\(\)]+)`?/);
    const api = apiMatch ? apiMatch[1] : 'Unknown API';

    // Extract version when deprecated
    const versionMatch = release.tag_name.match(/v?(\d+\.\d+)/);
    const deprecatedSince = versionMatch
      ? `v${versionMatch[1]}`
      : release.published_at.split('T')[0];

    // Determine severity based on keywords
    let severity: 'high' | 'medium' | 'low' = 'medium';
    if (line.toLowerCase().includes('removed') || line.toLowerCase().includes('breaking')) {
      severity = 'high';
    } else if (line.toLowerCase().includes('legacy') || line.toLowerCase().includes('obsolete')) {
      severity = 'low';
    }

    // Extract replacement if available
    let replacement = 'Check documentation';
    const replacementMatch = line.match(/(?:use|replace with|instead of)\s+`?([A-Za-z0-9_.\(\)]+)`?/i);
    if (replacementMatch) {
      replacement = replacementMatch[1];
    }

    deprecations.push({
      api,
      replacement,
      deprecated_since: deprecatedSince,
      severity,
      references: [release.html_url],
    });
  }

  return deprecations;
}

/**
 * Extract deprecations for a single package
 */
export async function extractPackageDeprecations(
  config: PackageConfig,
  maxReleases: number = 10
): Promise<ExtractionResult> {
  const errors: string[] = [];
  const deprecations: DeprecationInfo[] = [];

  try {
    const releases = await fetchReleases(config.repo, maxReleases);

    for (const release of releases) {
      try {
        const extracted = config.extractor
          ? config.extractor(release)
          : extractDeprecations(release, config);
        deprecations.push(...extracted);
      } catch (error) {
        errors.push(`Failed to extract from release ${release.tag_name}: ${error}`);
      }
    }

    return {
      package: config.repo,
      totalReleases: releases.length,
      deprecationsFound: deprecations,
      errors,
    };
  } catch (error) {
    return {
      package: config.repo,
      totalReleases: 0,
      deprecationsFound: [],
      errors: [`${error}`],
    };
  }
}

/**
 * Extract deprecations for all monitored packages
 */
export async function extractAllDeprecations(
  maxReleases: number = 10
): Promise<ExtractionResult[]> {
  const results: ExtractionResult[] = [];

  for (const config of MONITORED_PACKAGES) {
    console.log(`Extracting deprecations for ${config.repo}...`);
    const result = await extractPackageDeprecations(config, maxReleases);
    results.push(result);
    console.log(`  Found ${result.deprecationsFound.length} deprecations`);
  }

  return results;
}

// ─── JSON File Management ─────────────────────────────────────────

/** Language to filename mapping */
const LANGUAGE_TO_FILE: Record<string, string> = {
  javascript: 'deprecated-apis-js.json',
  typescript: 'deprecated-apis-js.json', // TypeScript shares with JS
  python: 'deprecated-apis-python.json',
  java: 'deprecated-apis-java.json',
  go: 'deprecated-apis-go.json',
  kotlin: 'deprecated-apis-kotlin.json',
};

/** Load existing deprecations from JSON file */
function loadExistingDeprecations(language: string): DeprecationInfo[] {
  const filename = LANGUAGE_TO_FILE[language];
  if (!filename) return [];

  const filePath = join(__dirname, filename);
  if (!existsSync(filePath)) return [];

  try {
    const content = readFileSync(filePath, 'utf-8');
    return JSON.parse(content);
  } catch (error) {
    console.warn(`Failed to load existing deprecations for ${language}: ${error}`);
    return [];
  }
}

/** Save deprecations to JSON file */
function saveDeprecations(language: string, deprecations: DeprecationInfo[]): void {
  const filename = LANGUAGE_TO_FILE[language];
  if (!filename) {
    console.warn(`No filename mapping for language: ${language}`);
    return;
  }

  const filePath = join(__dirname, filename);

  try {
    // Sort by API name for consistency
    const sorted = [...deprecations].sort((a, b) => a.api.localeCompare(b.api));
    writeFileSync(filePath, JSON.stringify(sorted, null, 2), 'utf-8');
    console.log(`Saved ${sorted.length} deprecations to ${filename}`);
  } catch (error) {
    console.error(`Failed to save deprecations for ${language}: ${error}`);
  }
}

/**
 * Update deprecated API database with newly extracted deprecations
 */
export async function updateDeprecationDatabase(
  maxReleases: number = 10
): Promise<void> {
  console.log('Starting deprecation database update...');

  const results = await extractAllDeprecations(maxReleases);

  // Group new deprecations by language
  const newDeprecationsByLanguage = new Map<string, DeprecationInfo[]>();

  for (const result of results) {
    const config = MONITORED_PACKAGES.find(p => p.repo === result.package);
    if (!config) continue;

    if (!newDeprecationsByLanguage.has(config.language)) {
      newDeprecationsByLanguage.set(config.language, []);
    }

    newDeprecationsByLanguage.get(config.language)!.push(...result.deprecationsFound);

    // Log errors
    if (result.errors.length > 0) {
      console.warn(`Errors for ${result.package}:`);
      result.errors.forEach(err => console.warn(`  - ${err}`));
    }
  }

  // Merge with existing deprecations and save
  for (const [language, newDeprecations] of newDeprecationsByLanguage) {
    console.log(`\nProcessing ${language} deprecations...`);

    // Load existing
    const existing = loadExistingDeprecations(language);

    // Deduplicate by API name and pattern
    const existingApis = new Set(
      existing.map(d => d.api + (d.pattern || ''))
    );

    const uniqueNew = newDeprecations.filter(
      d => !existingApis.has(d.api + (d.pattern || ''))
    );

    console.log(`  Existing: ${existing.length}, New: ${newDeprecations.length}, Unique new: ${uniqueNew.length}`);

    // Merge
    const merged = [...existing, ...uniqueNew];

    // Save
    saveDeprecations(language, merged);
  }

  console.log('\nDeprecation database update complete!');
}

// ─── CLI Entry Point ──────────────────────────────────────────────

if (require.main === module) {
  const maxReleases = parseInt(process.argv[2] || '10', 10);
  updateDeprecationDatabase(maxReleases).catch(console.error);
}

export default { updateDeprecationDatabase, extractAllDeprecations, extractPackageDeprecations };

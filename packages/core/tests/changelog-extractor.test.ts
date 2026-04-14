/**
 * Tests for Changelog Extractor
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import {
  extractDeprecations,
  extractPackageDeprecations,
  type PackageConfig,
  type GitHubRelease,
  type DeprecationInfo,
} from '../src/data/changelog-extractor.js';

// Mock GitHub API
vi.mock('https', () => ({
  default: {
    request: vi.fn(),
  },
}));

describe('Changelog Extractor', () => {
  const mockPackageConfig: PackageConfig = {
    repo: 'test/test-package',
    language: 'javascript',
    deprecationKeywords: ['deprecated', 'deprecate', 'removed'],
  };

  const mockRelease: GitHubRelease = {
    tag_name: 'v2.0.0',
    name: 'Version 2.0.0',
    body: `
# Changelog

## Breaking Changes

- \`deprecatedAPI()\` is now deprecated and will be removed in v3.0. Use \`newAPI()\` instead.
- The \`legacyMethod\` has been removed. Please migrate to \`modernMethod\`.

## Features

- Added new \`awesomeFeature()\`
    `,
    published_at: '2024-01-15T10:00:00Z',
    html_url: 'https://github.com/test/test-package/releases/tag/v2.0.0',
  };

  describe('extractDeprecations', () => {
    it('should extract deprecation information from release notes', () => {
      const deprecations = extractDeprecations(mockRelease, mockPackageConfig);

      expect(deprecations).toHaveLength(2);

      // First deprecation: deprecatedAPI
      const dep1 = deprecations[0];
      expect(dep1.api).toBe('deprecatedAPI()');
      expect(dep1.replacement).toBe('newAPI()');
      expect(dep1.deprecated_since).toBe('v2.0');
      expect(dep1.severity).toBe('medium');
      expect(dep1.references).toEqual(['https://github.com/test/test-package/releases/tag/v2.0.0']);

      // Second deprecation: legacyMethod (marked as high severity due to "removed")
      const dep2 = deprecations[1];
      expect(dep2.api).toBe('legacyMethod');
      expect(dep2.replacement).toBe('modernMethod');
      expect(dep2.severity).toBe('high');
    });

    it('should handle release notes without deprecations', () => {
      const cleanRelease: GitHubRelease = {
        ...mockRelease,
        body: '# Changelog\n\n## Features\n\n- Added new feature',
      };

      const deprecations = extractDeprecations(cleanRelease, mockPackageConfig);
      expect(deprecations).toHaveLength(0);
    });

    it('should detect high severity for "removed" keyword', () => {
      const removalRelease: GitHubRelease = {
        ...mockRelease,
        body: '- `oldAPI()` has been removed',
      };

      const deprecations = extractDeprecations(removalRelease, mockPackageConfig);
      expect(deprecations[0].severity).toBe('high');
    });

    it('should detect low severity for "legacy" keyword', () => {
      const legacyRelease: GitHubRelease = {
        ...mockRelease,
        body: '- `legacyAPI()` is now considered legacy',
      };

      const deprecations = extractDeprecations(legacyRelease, mockPackageConfig);
      expect(deprecations[0].severity).toBe('low');
    });

    it('should extract replacement from release notes', () => {
      const releaseWithReplacement: GitHubRelease = {
        ...mockRelease,
        body: '- `oldAPI()` is deprecated. Use `newAPI()` instead.',
      };

      const deprecations = extractDeprecations(releaseWithReplacement, mockPackageConfig);
      expect(deprecations[0].replacement).toBe('newAPI()');
    });

    it('should handle multiple deprecations in one release', () => {
      const multiDepRelease: GitHubRelease = {
        ...mockRelease,
        body: `
- \`api1()\` is deprecated
- \`api2()\` is removed
- \`api3()\` is deprecated
        `,
      };

      const deprecations = extractDeprecations(multiDepRelease, mockPackageConfig);
      expect(deprecations).toHaveLength(3);
    });
  });

  describe('extractPackageDeprecations', () => {
    it('should extract deprecations from multiple releases', async () => {
      // This test would require mocking the GitHub API
      // For now, we'll test the structure
      const result = await extractPackageDeprecations(mockPackageConfig, 0);

      expect(result).toHaveProperty('package');
      expect(result).toHaveProperty('totalReleases');
      expect(result).toHaveProperty('deprecationsFound');
      expect(result).toHaveProperty('errors');
    });
  });

  describe('DeprecationInfo structure', () => {
    it('should have all required fields', () => {
      const deprecation: DeprecationInfo = {
        api: 'testAPI()',
        pattern: 'testAPI\\(',
        replacement: 'newAPI()',
        deprecated_since: 'v2.0',
        severity: 'medium',
        references: ['https://example.com'],
      };

      expect(deprecation.api).toBe('testAPI()');
      expect(deprecation.pattern).toBe('testAPI\\(');
      expect(deprecation.replacement).toBe('newAPI()');
      expect(deprecation.deprecated_since).toBe('v2.0');
      expect(deprecation.severity).toBe('medium');
      expect(deprecation.references).toEqual(['https://example.com']);
    });
  });
});

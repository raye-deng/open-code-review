/**
 * Cross-File Context Window for L3 AI Analysis
 *
 * Implements multi-file analysis to detect AI-generated contradictions
 * that span across multiple files, such as:
 * - Type mismatches between files
 * - Enum value inconsistencies
 * - Function signature mismatches
 * - Data format contradictions
 *
 * @since 0.5.0
 */

import type { CodeUnit, SupportedLanguage, SymbolDef } from '../../ir/types.js';
import type { DetectorResult } from '../../detectors/v4/types.js';

/**
 * File relationship information for grouping related files
 */
export interface FileRelationship {
  /** File path */
  file: string;
  /** Files that import this file */
  importedBy: string[];
  /** Files imported by this file */
  imports: string[];
  /** Files that share common dependencies (import the same modules) */
  coDependent: string[];
  /** File category (entry point, library, test, config, etc.) */
  category: 'entry' | 'library' | 'test' | 'config' | 'unknown';
}

/**
 * Cross-file issue detected by multi-file analysis
 */
export interface CrossFileIssue {
  /** Type of cross-file contradiction */
  type: 'type-mismatch' | 'enum-inconsistency' | 'signature-mismatch' | 'data-format-contradiction' | 'import-cycle';
  /** Files involved in the contradiction */
  files: string[];
  /** Specific symbols/types/values that are inconsistent */
  symbols: string[];
  /** Detailed description of the issue */
  description: string;
  /** Severity level */
  severity: 'error' | 'warning' | 'info';
  /** Estimated confidence in the detection */
  confidence: number;
}

/**
 * File group for multi-file LLM analysis
 */
export interface FileGroup {
  /** Unique ID for this group */
  id: string;
  /** Files in this group */
  files: CodeUnit[];
  /** Relationship type */
  relationship: 'import-chain' | 'shared-dependencies' | 'circular-imports' | 'cohesive-module';
  /** Primary file (entry point of the analysis) */
  primaryFile: CodeUnit;
}

/**
 * Cross-file context analyzer
 */
export class CrossFileContextAnalyzer {
  private readonly maxFilesPerGroup: number;
  private readonly minGroupSize: number;

  constructor(
    private config: {
      maxFilesPerGroup?: number;
      minGroupSize?: number;
      similarityThreshold?: number;
    } = {}
  ) {
    this.maxFilesPerGroup = config.maxFilesPerGroup ?? 5;
    this.minGroupSize = config.minGroupSize ?? 2;
  }

  /**
   * Analyze import relationships and group files for multi-file analysis
   */
  analyzeFileRelationships(units: CodeUnit[]): FileRelationship[] {
    const fileMap = new Map<string, CodeUnit>();
    const relationships: FileRelationship[] = [];

    // Create file map
    for (const unit of units) {
      if (unit.kind === 'file') {
        fileMap.set(unit.file, unit);
      }
    }

    // Build relationships for each file
    for (const [filePath, unit] of fileMap) {
      const importedBy: string[] = [];
      const imports: string[] = [];
      const coDependent: string[] = [];

      // Find which files import this file
      for (const [otherPath, otherUnit] of fileMap) {
        if (otherPath === filePath) continue;
        
        // Check if other file imports this file
        const hasImport = otherUnit.imports.some(imp => {
          // Handle relative imports
          if (imp.isRelative) {
            // Simple relative import resolution (could be enhanced)
            const otherDir = otherPath.substring(0, otherPath.lastIndexOf('/'));
            const targetPath = `${otherDir}/${imp.module}`;
            return targetPath === filePath;
          }
          // For absolute imports, check if this is the main module
          return imp.module.startsWith(unit.file.split('.')[0]);
        });

        if (hasImport) {
          importedBy.push(otherPath);
        }

        // Find co-dependent files (files that import similar modules)
        const otherImports = otherUnit.imports.map(imp => imp.module);
        const commonImports = unit.imports
          .map(imp => imp.module)
          .filter(module => otherImports.includes(module));

        if (commonImports.length >= 2) {
          coDependent.push(otherPath);
        }
      }

      // Add the file's own imports
      for (const imp of unit.imports) {
        if (!imp.isRelative) {
          imports.push(imp.module);
        }
      }

      // Determine category
      const category = this.categorizeFile(unit, filePath);

      relationships.push({
        file: filePath,
        importedBy,
        imports,
        coDependent: [...new Set(coDependent)], // Remove duplicates
        category,
      });
    }

    return relationships;
  }

  /**
   * Group files for multi-file LLM analysis based on relationships
   */
  groupFilesForAnalysis(units: CodeUnit[], relationships: FileRelationship[]): FileGroup[] {
    const groups: FileGroup[] = [];
    const processedFiles = new Set<string>();

    // Find entry points (files imported by others, or main source files)
    const entryPoints = relationships
      .filter(rel => rel.category === 'entry' || rel.importedBy.length > 0)
      .sort((a, b) => b.importedBy.length - a.importedBy.length);

    // Process each entry point
    for (const relationship of entryPoints) {
      if (processedFiles.has(relationship.file)) continue;

      // Build group around this entry point
      const group = this.buildFileGroup(relationship, units, relationships, processedFiles);
      if (group && group.files.length >= this.minGroupSize) {
        groups.push(group);
      }
    }

    // Add remaining files as single-file groups
    for (const unit of units) {
      if (unit.kind === 'file' && !processedFiles.has(unit.file)) {
        groups.push({
          id: `single-${unit.file.replace(/[^a-zA-Z0-9]/g, '-')}`,
          files: [unit],
          relationship: 'cohesive-module',
          primaryFile: unit,
        });
      }
    }

    return groups;
  }

  /**
   * Build a file group starting from an entry point
   */
  private buildFileGroup(
    startRelationship: FileRelationship,
    allUnits: CodeUnit[],
    relationships: FileRelationship[],
    processedFiles: Set<string>
  ): FileGroup | null {
    const groupFiles: CodeUnit[] = [];
    const importChain: string[] = [];
    let currentFile = startRelationship.file;

    // Traverse import chain
    while (currentFile && groupFiles.length < this.maxFilesPerGroup) {
      if (processedFiles.has(currentFile)) break;

      const unit = allUnits.find(u => u.file === currentFile && u.kind === 'file');
      if (!unit) break;

      groupFiles.push(unit);
      importChain.push(currentFile);
      processedFiles.add(currentFile);

      // Find next file in the chain (most imported file)
      const nextFile = this.findNextInChain(currentFile, relationships);
      if (!nextFile || processedFiles.has(nextFile)) break;

      currentFile = nextFile;
    }

    if (groupFiles.length < this.minGroupSize) {
      // Rollback processed files if group is too small
      for (const file of importChain) {
        processedFiles.delete(file);
      }
      return null;
    }

    return {
      id: `group-${importChain.join('-').replace(/[^a-zA-Z0-9]/g, '-')}`,
      files: groupFiles,
      relationship: 'import-chain',
      primaryFile: groupFiles[0],
    };
  }

  /**
   * Find the next file in the import chain
   */
  private findNextInChain(currentFile: string, relationships: FileRelationship[]): string | null {
    const relationship = relationships.find(r => r.file === currentFile);
    if (!relationship) return null;

    // Find the most imported file that's not already processed
    const nextFiles = relationship.importedBy
      .filter(file => relationships.find(r => r.file === file)?.category !== 'test');

    if (nextFiles.length === 0) return null;

    // Prefer entry points or files with many importers
    return nextFiles.reduce((best, file) => {
      const fileRel = relationships.find(r => r.file === file);
      const bestRel = relationships.find(r => r.file === best);
      return (fileRel?.importedBy.length || 0) > (bestRel?.importedBy.length || 0) ? file : best;
    });
  }

  /**
   * Categorize a file based on its characteristics
   */
  private categorizeFile(unit: CodeUnit, filePath: string): 'entry' | 'library' | 'test' | 'config' | 'unknown' {
    const fileName = filePath.toLowerCase();

    // Entry points: main, index, app, server, etc.
    if (fileName.includes('main') || fileName.includes('index') || fileName.includes('app') || 
        fileName.includes('server') || fileName.includes('client')) {
      return 'entry';
    }

    // Test files
    if (fileName.includes('test') || fileName.includes('spec') || fileName.includes('__tests__')) {
      return 'test';
    }

    // Config files
    if (fileName.includes('config') || fileName.includes('env') || fileName.includes('setting')) {
      return 'config';
    }

    // Library/utility files
    if (fileName.includes('util') || fileName.includes('helper') || fileName.includes('lib') ||
        fileName.includes('service') || fileName.includes('controller') || fileName.includes('model')) {
      return 'library';
    }

    return 'unknown';
  }

  /**
   * Extract cross-file issues from LLM responses
   */
  extractCrossFileIssues(llmResponse: string, fileGroup: FileGroup): DetectorResult[] {
    const issues: DetectorResult[] = [];

    try {
      // Parse LLM response (assuming JSON format)
      const response = JSON.parse(llmResponse);
      
      if (response.issues && Array.isArray(response.issues)) {
        for (const issue of response.issues) {
          if (issue.crossFile && issue.files && issue.files.length > 1) {
            issues.push({
              detectorId: 'cross-file-context',
              severity: issue.severity || 'warning',
              category: 'cross-file-contradiction',
              messageKey: 'ai.cross-file.detected',
              message: issue.message || `Cross-file issue detected: ${issue.type}`,
              file: fileGroup.primaryFile.file,
              line: issue.line || 1,
              confidence: issue.confidence || 0.7,
              metadata: {
                crossFile: true,
                files: issue.files,
                issueType: issue.type,
                symbols: issue.symbols || [],
              },
            });
          }
        }
      }
    } catch (error) {
      // If LLM response is not valid JSON, skip cross-file extraction
      console.warn('Failed to parse LLM response for cross-file analysis:', error);
    }

    return issues;
  }

  /**
   * Build a multi-file prompt for LLM analysis
   */
  buildMultiFilePrompt(fileGroup: FileGroup): string {
    const { files, primaryFile } = fileGroup;

    let prompt = `You are a cross-file code analyzer specializing in detecting AI-generated contradictions across multiple files.

**File Group**: ${fileGroup.id}
**Relationship**: ${fileGroup.relationship}
**Files Analyzed**: ${files.length}

${files.map((file, index) => `
**File ${index + 1}**: ${file.file}
**Language**: ${file.language}
**Code**:
\`\`\`${file.language}
${file.source.slice(0, 2000)}
\`\`\`
`).join('\n')}

**Cross-File Analysis Tasks**:
1. **Type Inconsistencies**: Check if the same type/interface has different definitions across files
2. **Enum Value Mismatches**: Look for enum values used inconsistently (e.g., Status.ACTIVE vs Status.active)
3. **Function Signature Contradictions**: Verify function calls match their definitions across files
4. **Data Format Conflicts**: Check if data structures are passed in incompatible formats
5. **Import Path Issues**: Detect circular imports or missing imports
6. **API Contract Violations**: Ensure function calls, class instantiations, and property access match actual definitions

**Focus on AI-Specific Issues**:
- AI often generates inconsistent type definitions across files
- AI may use different naming conventions for the same concept
- AI sometimes creates function signatures that don't match their usage
- AI might import modules but not use them correctly
- AI can create data structures that are incompatible with their usage

**Respond in JSON format**:
{
  "issues": [
    {
      "line": <line_number>,
      "severity": "error|warning|info",
      "message": "<detailed description of the cross-file issue>",
      "category": "type-mismatch|enum-inconsistency|signature-mismatch|data-format-contradiction|import-cycle",
      "crossFile": true,
      "files": ["<file1>", "<file2>", ...],
      "symbols": ["<symbol1>", "<symbol2>", ...]
    }
  ]
}

If no cross-file issues found, respond with: { "issues": [] }`;

    return prompt;
  }
}
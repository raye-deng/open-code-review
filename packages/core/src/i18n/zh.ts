/**
 * Chinese Message Catalog
 *
 * All user-visible strings in Simplified Chinese (简体中文).
 *
 * @since 0.4.0
 */

import type { Locale } from './types.js';

export const ZH_MESSAGES: Record<string, string> = {
  // ─── Scan Messages ────────────────────────────────────────────

  'scan.start': '正在扫描 {count} 个文件...',
  'scan.complete': '扫描完成，耗时 {duration}ms',
  'scan.noFiles': '没有要扫描的文件',

  // ─── Detector Messages ────────────────────────────────────────

  'detector.hallucinated-import': 'AI 幻觉导入：包 "{package}" 在 {registry} 中不存在',
  'detector.hallucinated-import.offline': '无法验证导入 "{package}"（离线模式）',
  'detector.hallucinated-import.phantom-function': '函数 "{name}" 被调用但未在此文件中声明或导入',
  'detector.stale-api': '已废弃 API："{api}" — 请使用 "{replacement}"',
  'detector.stale-api.since': '自 {since} 起已废弃："{api}" — 请使用 "{replacement}"',
  'detector.context-coherence.unused': '未使用且未导出的{kind} "{name}"（可能是 AI 上下文丢失）',
  'detector.context-coherence.duplicate': '同一作用域中重复的{kind}名称 "{name}"',
  'detector.context-coherence.inconsistent-import': '不一致的导入："{module1}" 和 "{module2}" 用途相似',
  'detector.context-coherence.undefined-ref': '引用未定义的符号 "{name}"',
  'detector.over-engineering.params': '函数 "{name}" 有 {count} 个参数（建议最多 {max} 个）',
  'detector.over-engineering.nesting': '嵌套深度 {depth} 超过最大值 {max}',
  'detector.over-engineering.loc': '函数 "{name}" 有 {lines} 行（建议最多 {max} 行）',
  'detector.over-engineering.complexity': '圈复杂度 {value} 超过最大值 {max}',
  'detector.security.hardcoded-secret': '可能的硬编码密钥：{pattern}',
  'detector.security.eval': '危险的 eval/exec 使用',
  'detector.security.weak-crypto': '弱加密算法：{algo}',
  'detector.security.sql-injection': '可能的 SQL 注入（字符串拼接）',
  'detector.incomplete.empty-catch': '空 catch 块 — 可能吞掉错误',
  'detector.incomplete.stub': '发现存根实现：{indicator}',

  // ─── Scoring ──────────────────────────────────────────────────

  'score.grade.excellent': '优秀',
  'score.grade.good': '良好',
  'score.grade.fair': '一般',
  'score.grade.poor': '较差',
  'score.grade.fail': '不合格',
  'score.dimension.faithfulness': 'AI 忠实度',
  'score.dimension.freshness': '代码新鲜度',
  'score.dimension.coherence': '上下文一致性',
  'score.dimension.quality': '实现质量',

  // ─── SLA ──────────────────────────────────────────────────────

  'sla.L1': 'L1 快速 — 仅结构分析',
  'sla.L2': 'L2 标准 — 结构 + 嵌入 + 本地 AI',
  'sla.L3': 'L3 深度 — 结构 + 嵌入 + 远端 AI',

  // ─── Report ───────────────────────────────────────────────────

  'report.title': 'Open Code Review 报告',
  'report.summary': '在 {files} 个文件中发现 {total} 个问题',
  'report.noIssues': '未发现问题',
  'report.generated': '由 Open Code Review v{version} 生成',
  'report.project': '项目：{name}',
  'report.date': '日期：{date}',
  'report.score': '总分：{score}/100',
  'report.grade': '评级：{grade}',
  'report.filesScanned': '已扫描文件：{count}',
  'report.passed': '通过：{count}',
  'report.failed': '失败：{count}',
  'report.threshold': '阈值：{threshold}',
  'report.status.passed': '通过',
  'report.status.failed': '未通过',
  'report.duration': '耗时：{duration}',
  'report.languages': '语言：{languages}',
  'report.dimensions': '评分维度',
  'report.issues': '问题',
  'report.issues.found': '发现 {count} 个问题',
  'report.more': '... 还有 {count} 个',

  // ─── CLI ──────────────────────────────────────────────────────

  'cli.scanning': '扫描中...',
  'cli.done': '完成！',
  'cli.error': '错误：{message}',
  'cli.noFiles': '没有文件匹配扫描模式',
  'cli.offline': '注册表验证不可用（离线模式）。包存在性检查已跳过。',

  // ─── Errors ───────────────────────────────────────────────────

  'error.parser.init': '解析器初始化失败：{message}',
  'error.registry.verify': '验证包 "{package}" 失败：{message}',
  'error.config.load': '加载配置失败：{message}',
};

/**
 * Get the locale identifier for Chinese.
 */
export const ZH_LOCALE: Locale = 'zh';

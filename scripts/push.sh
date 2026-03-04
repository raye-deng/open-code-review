#!/bin/bash
# ============================================================
# ai-code-validator 双端推送脚本
#
# GitLab (origin): 完整代码（包含 apps/ packages/worker/）
# GitHub (github): 仅公开包（排除 apps/ packages/worker/）
#
# 使用方式: bash scripts/push.sh
# ============================================================
set -e

BRANCH=$(git rev-parse --abbrev-ref HEAD)
echo "📦 Branch: $BRANCH"

# ── Step 1: GitLab 推送完整代码 ──────────────────────────────
echo ""
echo "🦊 [1/2] Pushing FULL code to GitLab..."
git push origin "$BRANCH"
echo "✅ GitLab done"

# ── Step 2: GitHub 推送公开包（排除 apps/ worker/） ──────────
echo ""
echo "🐙 [2/2] Pushing PUBLIC packages to GitHub..."

# 创建临时孤立分支（不含私有目录历史）
TEMP="github-pub-$(date +%s)"
git checkout -b "$TEMP"

# 移除私有目录（只从 index 移除，不删本地文件）
git rm -r --cached apps/ 2>/dev/null || true
git rm -r --cached packages/worker/ 2>/dev/null || true

# 如果有变化才 commit
if ! git diff --cached --quiet; then
  git commit -m "chore: public release (apps/worker excluded)"
fi

# 推送
GH_TOKEN=$(gh auth token 2>/dev/null)
if [ -n "$GH_TOKEN" ]; then
  git remote set-url github "https://x-access-token:${GH_TOKEN}@github.com/raye-deng/ai-code-validator.git"
fi

git push github "${TEMP}:main" --force-with-lease || \
  git push github "${TEMP}:main" -f

echo "✅ GitHub done (apps/ and packages/worker/ excluded)"

# ── 清理 ──────────────────────────────────────────────────────
git remote set-url github "https://github.com/raye-deng/ai-code-validator.git" 2>/dev/null || true
git checkout "$BRANCH"
git branch -D "$TEMP"

echo ""
echo "🎉 Push complete!"
echo "   GitLab : https://INTERNAL_REGISTRY/fengsen.deng/ai-code-validator (full)"
echo "   GitHub : https://github.com/raye-deng/ai-code-validator (packages only)"

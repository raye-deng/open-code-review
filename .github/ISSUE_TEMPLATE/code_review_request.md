---
name: AI Code Defect Report
about: Report a defect found in AI-generated code (hallucinated imports, stale APIs, over-engineering, etc.)
title: "[AI Defect] "
labels: ai-defect, triage
assignees: ""
---

**Which AI tool generated the code?**
- [ ] GitHub Copilot
- [ ] Cursor
- [ ] Claude Code
- [ ] Windsurf
- [ ] Codex
- [ ] Other: _______________

**Defect type**
- [ ] Hallucinated import / non-existent package
- [ ] Stale / deprecated API usage
- [ ] Over-engineered pattern (unnecessary abstraction, dead code)
- [ ] Security anti-pattern (hardcoded secrets, eval, etc.)
- [ ] Context window artifact (logic contradiction across files)
- [ ] Other: _______________

**Language / Framework**
e.g., TypeScript + React, Python + FastAPI, Java + Spring Boot

**Code snippet**
```language
// Paste the problematic AI-generated code here
```

**What's wrong with it?**
Describe the defect clearly.

**Expected correct behavior**
What should the code look like instead?

**Open Code Review output (if applicable)**
```bash
# Paste the relevant OCR scan output here
ocr scan path/ --sla L3
```

**Additional context**
Any other information (settings used, prompt given to the AI, etc.)

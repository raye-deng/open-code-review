# Open Code Review — GitLab CI Component

A GitLab CI/CD component that validates AI-generated code quality as part of your pipeline.

## Usage

### As a CI/CD Component (GitLab 16.0+)

```yaml
include:
  - component: INTERNAL_REGISTRY/fengsen.deng/open-code-review/validate@main
    inputs:
      threshold: 70
      paths: src
```

### As a Regular Include

```yaml
include:
  - project: 'fengsen.deng/open-code-review'
    file: '/packages/gitlab-component/templates/validate.yml'

ai-code-validate:
  variables:
    THRESHOLD: "70"
    SCAN_PATHS: "src"
```

## Inputs

| Input | Default | Description |
|-------|---------|-------------|
| `threshold` | `70` | Minimum quality score (0-100) to pass |
| `paths` | `src` | Root paths to scan |
| `node-image` | `node:20-slim` | Docker image to use |

## Output

- **Code Quality report**: Integrated with GitLab's Code Quality widget on merge requests
- **Pipeline status**: Fails if score is below threshold

## What It Detects

- 🔍 **Hallucinated packages/functions** — imports that don't exist
- 🧩 **Logic gaps** — empty catch blocks, TODO markers, unreachable code
- 📋 **Code duplication** — near-identical functions, redundant imports
- 🎨 **Style inconsistencies** — mixed naming conventions, module systems

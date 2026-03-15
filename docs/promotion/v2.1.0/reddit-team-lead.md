# After mandating AI coding tools for our team, we had a silent quality problem — here's how we solved it

About six months ago, our engineering team fully embraced AI coding tools — Cursor for most developers, Copilot for the holdouts. Productivity numbers went through the roof. Velocity up 40%. PRs shipping faster than ever. Leadership was thrilled.

Then the bugs started showing up.

Not obvious bugs — our existing CI pipeline (ESLint, Prettier, unit tests, integration tests) caught most of those. These were *subtle* bugs. An import that resolved fine in the AI's training data but didn't exist in our actual dependency tree. A function call that used a deprecated API from two major versions ago. A utility class with six layers of abstraction for something a one-liner could handle. Code that compiled and tested fine but broke at runtime because the AI lost track of the variable names across files.

We went back and audited the last three months of AI-generated commits. Roughly 15–20% had at least one issue that our entire CI pipeline missed. Two of those made it to production and caused incidents. One required a 4-hour rollback during peak traffic.

The uncomfortable realization: **our quality tools were built for human mistakes, not AI mistakes.**

Human-written code tends to have typos, logic errors, and style inconsistencies — things linters are great at catching. AI-generated code tends to have a completely different failure profile: it looks syntactically perfect, it sometimes even has good test coverage, but it *hallucinates* things that don't exist in your codebase.

We looked at a few options. Adding more tests helped but was slow — you can't write a test for every possible hallucinated import. Code review caught some issues but reviewers were starting to trust the AI output too much (the "it looks fine" problem). We needed something automated that specifically targeted AI-generated code defects.

We ended up adding **Open Code Review** to our CI pipeline. It's an open-source tool that specifically checks for AI code issues — hallucinated imports, outdated APIs, security anti-patterns, over-engineering, and context inconsistency.

The setup was trivially simple — one line in our GitHub Actions workflow:

```yaml
- name: AI Code Review
  run: npx @opencodereview/cli scan . --sla L1
```

The L1 tier runs in about 3 seconds and doesn't require any AI model or API key. It's just pattern matching and AST analysis. In the first week, it caught 11 issues across 47 PRs that our entire existing pipeline had missed. Most were hallucinated imports and deprecated API calls — exactly the kind of thing that's invisible to traditional linters but causes runtime failures.

After a month, our AI-generated code quality noticeably improved. Developers got instant feedback on AI-specific issues (right in the PR check, just like any other lint failure), which also made them more aware of what to watch for when reviewing AI suggestions.

A few things I'd note for anyone in a similar situation:

1. **AI coding tools are amazing for productivity, but they shift the quality problem, they don't eliminate it.** You need tools designed for the new failure mode, not just more of the same tools.

2. **The biggest risk isn't bad AI code — it's code that *looks* fine to both humans and existing tools.** That's what slips through.

3. **Running locally matters.** We didn't want to send our code to another cloud service. OCR runs entirely on our CI runners — no data leaves our infrastructure.

4. **Start with the simplest tier.** L1 caught the vast majority of issues for us. We're evaluating L2 (local LLM via Ollama) for more nuanced checks, but L1 alone was a game-changer.

Curious if other teams have run into this — how are you handling quality for AI-generated code? Is anyone else finding that traditional tooling isn't keeping up?

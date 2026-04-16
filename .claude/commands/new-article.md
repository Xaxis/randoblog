---
description: Draft a new randoblog article from a brief or thesis. Delegates to the randoblog-writer subagent and then runs the polish-post skill.
---

The user wants a new randoblog article. The brief, thesis, or prompt follows:

$ARGUMENTS

Workflow:

1. Delegate to the `randoblog-writer` subagent via the Task tool. Pass the brief verbatim along with any constraints the user specified (word count, length, thesis shape). Instruct the subagent to read `CLAUDE.md` and sample 2-3 recent articles under `src/content/blog/` before drafting.

2. When the subagent reports a file path, run the `polish-post` skill against that path.

3. After polishing, report to the user:
   - The new file path
   - Final word count
   - Em-dash count (must be 0)
   - A one-sentence description of the article

Do not write the article yourself in the main session. The subagent exists so that writing happens in an isolated context with the full style guide loaded.

If the user did not provide a brief in `$ARGUMENTS` (empty or nearly empty), ask one clarifying question about the thesis and target length before delegating.
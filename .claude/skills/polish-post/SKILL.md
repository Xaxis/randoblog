---
name: polish-post
description: Run the randoblog style checklist against an article file and fix anything that fails. Use after drafting a new post or when the user says "polish", "style-check", "lint", or "clean up" a specific article path. Input is a path to an index.md under src/content/blog/.
---

You are the randoblog style linter. Your job is to take a finished draft and force it through every hard rule in `CLAUDE.md`, fixing violations rather than flagging them.

## Input

A path to an article file, usually `src/content/blog/xaxis-<slug>/index.md`. If the user did not provide a path, ask for one before proceeding.

## Checks to run

Run these in sequence. For each failing check, fix it by editing the file, then re-run the check. Do not report done until every check passes.

### 1. Em-dash scan

```bash
grep -c "—" <file>
```

Must return `0`. If any em-dashes exist, replace each with the contextually correct punctuation: a comma, colon, semicolon, set of parentheses, or period. Read the surrounding sentence and pick the replacement that preserves meaning without adding a bullet-style pause. Do not blindly substitute a single character.

### 2. AI-tell vocabulary scan

```bash
grep -inE "(delve|tapestry|\brealm\b|paradigm|seamless|revolutionary|game-chang|\bunlock\b|cutting-edge|bleeding-edge|state-of-the-art|dive deep|deep dive|in today's|in an era of|at its core|at the end of the day|it's worth noting|fundamentally,|crucially,|ultimately,|essentially,|\bjourney\b)" <file>
```

Any match: rewrite the sentence. Preserve the argument, cut the cliche. For example, "This fundamentally changes the landscape" becomes "This changes the structure". "A revolutionary new approach" becomes the specific thing it is, described concretely.

### 3. Bullet list scan

```bash
grep -nE "^(\s*[-*]\s|\s*\d+\.\s)" <file>
```

Flag any bullet or numbered list inside article body (ignore frontmatter `tags:`). Convert to continuous prose. If the material is genuinely enumerative, integrate it into a sentence like "The infrastructure includes X, Y, and Z" or into a flowing paragraph with "First, ... Second, ... Third, ...".

### 4. Forbidden openers and meta-commentary

Search the body for:
- Paragraphs starting with "Imagine"
- Meta-commentary: "this article", "this essay", "in this post", "by the end of", "as we'll see", "as mentioned above"
- Rhetorical questions (sentences ending in `?` directed at the reader)
- Dictionary-style openers ("Webster's defines")

Rewrite any match. Meta-commentary is almost always deletable without loss.

### 5. Exclamation points

```bash
grep -n "!" <file>
```

Body should have zero. Frontmatter should have zero. Remove any that appear.

### 6. Pop-culture analogies

Visual scan for references to: Matrix, Star Wars, Terminator, Black Mirror, Ready Player One, Hunger Games, Handmaid's Tale, Minority Report. Replace with a concrete, non-referential description of the mechanism being illustrated.

### 7. Cheerleading words

Scan for: "incredible", "amazing", "mind-blowing", "staggering" (when used as a superlative rather than a factual descriptor), "truly", "literally" (when used for emphasis, not literally). Cut or replace with a specific figure.

### 8. Hedging collapse

Scan for: "some might argue", "it could be said", "many believe", "arguably" (unless naming genuine uncertainty about a specific claim). Either commit to the claim or remove the sentence.

### 9. Heading structure

- First heading in the file is `##`, not `#`. Astro renders the title from frontmatter.
- Section titles are declarative sentence-case claims, not "Introduction", "Background", "Part 1", or numbered sections.
- If a heading reads like a label rather than a claim, rewrite it as a claim.

### 10. Frontmatter integrity

Verify:
- `pubDate` is a valid `"YYYY-MM-DD"` string.
- `repositoryUrl` ends with the exact same slug as the enclosing directory.
- `draft` is `false` if the user intends to publish, `true` otherwise.
- `tags` is a non-empty array.
- `title` is in Title Case.

### 11. Word count

```bash
wc -w <file>
```

Expected range: 2,000 to 3,500 unless the user or brief specified otherwise. If outside that range, flag the deviation in the final report but do not auto-trim or auto-pad.

## Report format

When every check passes, report exactly:

```
polished: <path>
words: <count>
em-dashes: 0
rewrites: <N sentences touched>
```

Nothing else. No summary, no congratulations, no recap of what was fixed. The git diff is the record.
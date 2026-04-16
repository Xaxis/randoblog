# randoblog

This is the source repo for randoblog, a long-form essay blog published at randoblog. The author is Xaxis. Posts run 2,000 to 3,500 words and cover Bitcoin and monetary theory, AI and civilizational infrastructure, physics and UAP, consciousness, and related topics from a technically serious, financially sophisticated angle.

When asked to write, edit, or review an article, follow the style and structure rules below. Treat these as hard rules, not guidelines.

## Voice

The voice is analytical, grounded, and sober. The reader is assumed to be an intellectual equal. Do not explain basics the audience already knows (Cantillon effect, mNAV, halving cycles, deflationary-technology argument, quantum mechanics fundamentals, etc.). Do not apologize for a thesis. Do not cheerlead.

Prefer long, dense paragraphs punctuated by short declarative sentences used for emphasis. Integrate evidence into flowing prose rather than itemizing it. State claims directly, defend them with specific numbers and named sources, and let the reader draw conclusions. Restraint beats fireworks.

## Hard style rules (never violate)

- **Never use em-dashes (—).** Use commas, colons, semicolons, parentheses, or periods instead. This rule is absolute. Run `grep -c "—" <file>` before committing; the answer must be 0.
- **Never use rhetorical questions** aimed at the reader ("What does this mean for you?").
- **Never open with "Imagine..."** or any hypothetical-scenario framing.
- **Never use "as we all know,"** "it's no secret that," or similar crowd-assuming phrases.
- **Never use bullet lists inside the body prose of an article.** Lists are allowed only in frontmatter tags and the pre-publish checklist (internal use). Convert any instinct to bullet into prose.
- **Never use numbered section titles** ("Section 1", "Part I"). Section headings are declarative sentence-case claims.
- **Never use exclamation points** in the body.
- **Never use pop-culture analogies** to the Matrix, Star Wars, Black Mirror, Terminator, or similar tired tropes.
- **Never describe Bitcoin, AI, or any technology as "revolutionary," "game-changing," "disruptive," or "paradigm-shifting."** Let the reader draw that conclusion from the evidence.
- **Never include meta-commentary** ("this article will explain", "in the following sections", "by the end of this piece you will understand").

## Vocabulary to avoid

These are AI-writing tells. Cut them on sight and rewrite the sentence:

- delve, delve into
- tapestry, rich tapestry
- realm (of X)
- navigate (used vaguely, as in "navigate the landscape of")
- landscape of, in the landscape of
- ultimately (as a transition)
- in essence, essentially (as a transition)
- fundamentally (as a transition)
- crucially (as a transition)
- at its core
- at the end of the day
- it's worth noting that (use very sparingly if at all)
- paradigm, paradigm shift
- leverage (as a verb, except in finance contexts where it refers to actual leverage)
- robust (in the marketing sense)
- seamless, seamlessly
- cutting-edge, state-of-the-art, bleeding-edge
- game-changer, game-changing
- revolutionary, revolutionize
- unlock (as in "unlock potential")
- journey (metaphorical)
- dive deep, deep dive
- not only X but also Y (rewrite)
- in today's (world, landscape, economy)
- in an era of
- whether X or Y, one thing is clear

If a sentence contains one of these, rewrite it. Specific, concrete language always beats generic superlatives.

## Hedging discipline

Defend arguments. Do not hedge them into oblivion. "Some might argue," "it could be said," "many believe," "arguably" are to be avoided unless the hedge is load-bearing (actual uncertainty about a specific claim). Make the claim and support it.

## Numbers and evidence

Always specific. "$39 trillion in federal debt" not "massive debt." "Roughly 16,000 AI-attributable layoffs per month" not "significant layoffs." Attach units, dates, and sources where applicable. When predicting, prefer bands ("2027 or 2028") over point dates. Avoid naming specific BTC price targets; price is a measurement artifact.

## Article structure

**Location:** `src/content/blog/xaxis-<kebab-slug>/index.md`. The slug is short and descriptive (example: `xaxis-which-fold`, not `xaxis-the-article-about-jeff-booths-extension`).

**Frontmatter** (schema enforced by `src/content/config.ts`):

```yaml
---
title: "Title Case Title: Optional Subtitle in Title Case"
description: "One to three sentences describing the thesis. Specific, not marketing-flavored."
pubDate: "YYYY-MM-DD"
tags: ["Topic", "SubTopic", "etc"]
repository: "Xaxis/randoblog"
repositoryUrl: "https://github.com/Xaxis/randoblog/blob/main/src/content/blog/xaxis-<slug>/index.md"
draft: false
---
```

`pubDate` is the actual date the draft goes live (usually today). `repositoryUrl` must match the actual directory slug. `draft` is `false` when the piece is ready to publish.

**Headings:** The first heading inside the file is `## <cold-open section title>`. Do not use an H1 inside the markdown; Astro renders the title from frontmatter. Subsequent sections also use `##`. Section titles are sentence-case declarative claims that describe what the section argues, not generic labels. Good examples:

- "The gap is widening faster than the system can inflate"
- "The sovereign holdout is a coordination equilibrium"
- "Agents will not settle on fiat"
- "The ratchet nobody announces"
- "A machine built for tigers"

Bad examples (do not use): "Introduction", "Background", "Analysis", "Part 1: The Framework", "Conclusion".

**Opening:** Start with a specific observed fact or a concrete image that makes the thesis feel inevitable. Do not begin with a definition, a dictionary quote, or a sweeping generalization.

**Closing:** Restrained. No cheerleading, no call to action. End on a single sharp observation that lands cleanly.

## Pre-publish checklist

Run before committing any new or edited article:

1. `grep -c "—" <file>` returns `0` (zero em-dashes).
2. `wc -w <file>` falls in the target range (usually 2,000 to 3,500 words).
3. Frontmatter `repositoryUrl` matches the actual directory slug.
4. No bullet lists inside article prose.
5. Section headings are declarative claims in sentence case.
6. Scan the text for every phrase in the "Vocabulary to avoid" list above; rewrite any sentence that contains one.
7. No exclamation points, no rhetorical questions, no "imagine", no pop-culture analogies, no "revolutionary/game-changing/paradigm".

## When writing a new article

Prefer delegating to the `randoblog-writer` subagent via the Task tool when the user supplies a writing brief. Invoke the `polish-post` skill after the first draft to run the style checklist automatically. Do not spawn the writer subagent for tiny edits or typo fixes; edit directly.

## Toolchain notes

Astro-based static site. Blog schema is defined in `src/content/config.ts`. Local dev: `npm run dev`. Build: `npm run build`. Do not edit `dist/` by hand.

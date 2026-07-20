---
title: "The Cost of Emission: Slop Is a Monetary Problem"
description: "AI slop is not a quality failure or an aesthetic one. It is what happens when the cost of producing something falls to near zero while the cost of checking it stays pinned to human attention. Hashcash solved this in 1997 by putting a real price back on emission, Bitcoin inherited the machinery, and almost nobody is pointing it at the problem it was built for."
pubDate: "2026-07-20"
tags: ["Bitcoin", "AI", "proof of work", "software engineering", "Lightning Network", "open source", "Hashcash", "monetary theory"]
repository: "Xaxis/randoblog"
repositoryUrl: "https://github.com/Xaxis/randoblog/blob/main/src/content/blog/xaxis-the-cost-of-emission/index.md"
draft: false
---

## Twenty reports, seven in sixteen hours, zero vulnerabilities

In the first twenty-one days of January 2026, the curl project received twenty submissions to its bug bounty program. Seven arrived inside a single sixteen-hour window. Not one described a real vulnerability. Every one had to be read, understood, traced against the source, and dismissed by people who could have been doing something else, because a security report that is ignored and turns out to be real is the kind of mistake a project running in effectively every networked device on the planet does not get to make twice. Daniel Stenberg shut the program down, with submissions accepted through the end of the month. He described what was happening as AI slop DDoSing open source, and updated the project's security.txt to say plainly that curl offers no monetary compensation and that people submitting junk would be banned. The program reopened in March 2026 once report quality recovered, though the volume kept climbing.

The thing worth noticing is not that the reports were bad. Bad bug reports are as old as bug reports. It is the ratio. Producing twenty plausible-looking security disclosures now costs one person one afternoon and a few dollars of inference. Reading them costs a senior maintainer several days of the most expensive cognition in the industry, and there is no way to shorten it, because the entire value of the review is that a human who understands the code held the claim in their head and decided it was false. Generation got cheap. Verification did not move.

That gap is the whole story, and it is not a story about writing quality.

## Slop is what falling prices look like when they are lying

Jeff Booth's argument is that technological deflation is the natural state of a productive economy, that prices in real terms want to fall as we learn to make things with less, and that a debt-based monetary system has to fight that tendency because it cannot survive it. That is correct, and everything since he first laid it out has strengthened rather than weakened it. What I want to add is not a correction. It is a condition on the outcome.

Deflation in the cost of producing work, without matching deflation in the cost of verifying work, does not produce abundance. It produces slop.

Abundance requires the price signal to stay honest on both sides of the transaction. When you drive generation cost toward zero using compute financed by credit created out of nothing, while verification cost stays pinned to human attention, you have not created abundance. You have created a transfer, from the person pressing generate to the person who has to read the result. The output looks free at the point of emission and is expensive at the point of receipt, and because those two points sit inside different people, nobody with the power to slow it down feels the cost of not slowing it down.

Booth's free market produces abundance because prices tell the truth. Falling prices signal that something genuinely got cheaper to make, and that signal is what lets everyone downstream reallocate correctly. Slop is what falling prices look like when they are lying. The marginal cost of a pull request went to nothing. The marginal cost of reviewing one did not. Anywhere those two diverge and the divergence goes unpriced, a queue forms, and it forms in the place with the least power to refuse.

## The nineteen points nobody felt

METR ran the experiment that most people arguing about this have not read. Sixteen experienced open-source developers, 246 real tasks (bug fixes, features, refactors) in mature codebases they already knew well, half with AI assistance available and half without. The developers were nineteen percent slower with the tools. They estimated afterward that they had been twenty percent faster.

The thirty-nine-point gap between what happened and what it felt like is the most important number in this whole argument, more important than the slowdown itself. Be honest about what the study covers: experienced developers, mature codebases they knew intimately, tooling as it stood in early 2025. It does not generalize to juniors, it does not generalize to greenfield work, and it does not establish that the tools are useless. Anyone citing it as proof that AI coding does not work is misusing it. Saying so out loud makes the argument stronger, because the finding that survives scrutiny is the perception gap, and the perception gap is not a claim about capability at all. It is a claim about measurement. These were people at the top of their craft, working in code they wrote, and they could not feel the direction of their own throughput. If they cannot feel it, a vice president reading a dashboard three levels up certainly cannot.

I have been writing software for a long time, and the shape of where agentic coding works is not mysterious to anyone who has used it in anger. It works, and works genuinely well, wherever verification is cheap and the problem decomposes. Test scaffolding. Migrations. Glue code. Exploring an unfamiliar API. First drafts of well-specified functions where the specification is the hard part and the typing is not. In that territory the tools are the largest single improvement in developer ergonomics I have seen in twenty years, and I use them daily.

Then there is a ceiling, and it is a bandwidth ceiling rather than a capability one. Past the point where the essential complexity of a system exceeds what fits in a context window and what the model can hold as a causal account of the whole thing, output quality stops tracking effort spent. Token burn substitutes for understanding. The code compiles, the tests pass, the diff is enormous, and nobody can say why it works. That substitution is invisible to everyone except the person who has to maintain the result, which is to say invisible to everyone who authorized it.

## The tell is the enforcement

Uber's CTO disclosed that the company burned its entire 2026 AI coding budget in four months. By March 2026, eighty-four percent of Uber engineers had adopted Claude Code, and roughly seventy percent of committed code originated with AI. Those numbers were reported as achievements, which tells you what was being measured. Adoption became the KPI.

A tool that genuinely made people faster would not need a mandate. It would not need a budget line defended in an all-hands, a dashboard tracking adoption by team, or a manager asking why your usage numbers are low this sprint. Compilers did not need this. Version control did not need this. Continuous integration did not need this. Every tool that actually shortened the distance between a developer and a working system spread by developers telling other developers, and the adoption curve was the evidence, not the target. When the adoption curve becomes the target, you are no longer measuring whether the thing works. You are measuring compliance, and you have conceded that compliance and usefulness came apart.

The aggregate numbers say the same thing more coldly. The FinOps Foundation's 2026 State of FinOps found seventy-three percent of enterprises reporting AI costs above original projections. MIT Media Lab found ninety-five percent of organizations reporting no measurable return on AI investment. Set those against the adoption statistics and the picture is not a technology failing. It is a technology deployed by people who are not the ones reading the output, on the authority of a narrative rather than a measurement, with the perception gap METR documented running interference the entire time.

None of this is an argument against the tools. It is an argument against the executives and founders mistaking spend for progress, and against a founder-class story in which the only permissible engineering opinion is enthusiasm. The developers who quietly report that this is not working as advertised on their particular problem are usually the ones who tried hardest.

## The commons absorbs what the generator externalizes

A 2026 paper, "AI Slop and the Software Commons," analyzed 1,154 posts across fifteen Reddit and Hacker News threads where developers explicitly used the phrase. It frames the situation through Hardin's tragedy of the commons and Ostrom's work on governing shared resources, and the frame fits better than most borrowed frames do. The benefit of generating is privatized: the contributor gets a submitted pull request, a filed report, a line on a performance review. The costs of review, of maintenance, of the slow degradation of a codebase, and of the talent pipeline that used to be trained by careful review, are externalized onto maintainers. One team in the study reported thirty pull requests a day split among six reviewers.

Outside open source it has a different name and the same arithmetic. BetterUp Labs and Stanford Social Media Lab published in Harvard Business Review in September 2025 on what they called workslop: a survey of 1,150 US full-time workers found forty-one percent had received it in the preceding month, each incident averaging one hour and fifty-six minutes to resolve, roughly $186 per worker per month, or more than $9 million annually for a company of ten thousand. The number that matters more than the dollars is that forty-two percent of recipients viewed the sender as less trustworthy afterward. That is the commons noticing the transfer and pricing it the only way it can, in reputation, because it has no other instrument.

A developer in that study said the thing that settles the ethics of it: it is not AI's code, it is my code. Slop is an accountability failure before it is a quality failure. The person who presses generate and forwards the output without reading it has not produced work. They have moved the work of understanding onto whoever comes next, without asking. Everyone downstream pays in attention for something never checked by the one person who had context, intent, and the ability to say no.

## Burning tokens is cheap because someone else is paying for the fire

Here is where this stops being a story about software culture. The instinct to burn more tokens rather than stop and think is not a technical judgment made badly. It is a rational response to an artificially low price.

Inference is currently sold below what it costs to serve. OpenAI reportedly spends close to two dollars for every dollar of inference revenue, and Sam Altman has said publicly that the company loses money on the $200 per month tier. Token prices tracked by Ramp averaged $0.72 per million in April 2026, the cheapest production models near $0.04 per million and frontier reasoning models running upward of $180 per million. Underneath that, hyperscaler capital expenditure for 2026 runs roughly $660 to $725 billion, with total compute capex near $1.04 trillion, the first trillion-dollar year of compute capex in history.

The accounting has its own softness. Hyperscalers depreciate AI hardware over five to six years when its economic life may be two to three, understating true depreciation by something on the order of $176 billion across 2026 through 2028. And the demand side has a circularity problem anyone who watched the last telecom cycle will recognize at once: NVIDIA taking equity positions in customers, take-or-pay compute commitments between OpenAI, Oracle, and CoreWeave, GPU purchases funded by debt against the GPUs. Lucent and Nortel did the same thing with vendor financing between 1999 and 2001, and the effect then was the effect now. End demand looks larger and more independent than it is, because some meaningful fraction of the buyer's money came from the seller.

Put those together and the price of a token is not a market price. It is a subsidized one, and the subsidy is credit created out of nothing. Under that price, generating is cheap and thinking is expensive, and every rational actor responds accordingly. Under honest pricing, the calculation flips more often than not, and paying skilled people to build the thing wins on cost.

The developers complaining that something feels off are not imagining the pinch and not being nostalgic. They are correctly reading a price signal that happens to be false. That is the failure mode Booth spends his time describing, showing up in a place he did not name.

## Never generate faster than you can verify

One rule resolves nearly all of this, and it is a throughput constraint rather than a moral position.

Never generate faster than you can verify.

Slop is precisely the condition where generation rate exceeds verification rate. That definition holds at every scale and in every medium: a pull request, a bug report, a design document, a quarterly strategy memo, twenty security disclosures in twenty-one days. Everything else follows from it. Agentic work belongs wherever the check is cheap and mechanical, which is to say a passing test suite, a type checker, a reproducible benchmark, or a diff small enough that a human can hold the whole thing in their head at once. It does not belong where verification requires reconstructing the author's reasoning from scratch, because there reading the output costs more than writing it would have, and the transaction is a loss the moment it clears.

This is not an anti-AI rule, and applying it slows down no one who was already being careful. It is the constraint that governs any pipeline: the system runs at the speed of its narrowest stage, and pretending otherwise does not increase throughput. It moves the queue somewhere you have stopped looking. Every organization celebrating that seventy percent of its commits originate with AI has moved the queue into its maintainers, its on-call rotation, and the codebase it will still own in five years.

## Hashcash inverted the asymmetry in 1997

This problem has been solved before, in the same shape, and the solution is the direct ancestor of the thing most of this blog is about.

In 1997 Adam Back proposed Hashcash, formalized in the 2002 paper "Hashcash: A Denial of Service Counter-Measure." The construction is almost embarrassingly simple. Attach to each email a stamp that is computationally expensive to produce and instantaneous to check. For someone sending a few dozen messages a day the cost rounds to nothing. For someone sending ten million it is prohibitive. The scarcity is administered by no one: no list to get on, no reputation to build, no central authority deciding who is legitimate. There is only work, and work costs what it costs.

Satoshi cited Hashcash directly as the inspiration for Bitcoin's proof of work. This is the part people consistently misread. Proof of work is not primarily a consensus trick, and calling it "how the blockchain agrees on ordering" undersells it. It is a mechanism for making emission cost something real when the medium itself is free to copy. Bitcoin is the largest working deployment of that idea, and it has been running for seventeen years.

Look at the asymmetry Hashcash exploits, the cheapest and most reliable one in all of computing: expensive to create, cheap to verify. Now look at slop: cheap to create, expensive to verify. Same axis, exactly inverted. The machinery built to fix costless emission was built for spam, it generalized into money, and it is sitting right there, largely unapplied to the problem it was designed for, at the exact moment that problem has returned at a scale email never approached.

## A budget constraint that closes in milliseconds

The metering piece already exists. L402, from Lightning Labs, puts payment into the HTTP 402 path so that the payment is the authentication: no accounts, no API keys, no subscription. An agent pays per call in satoshis, on the order of one to ten sats for an LLM call, and Lightning handles sub-cent amounts natively, where x402 on Base has a practical floor near a penny. Lightning Labs shipped L402 agent tooling in February 2026; the x402 Foundation launched in July 2026 with forty members, which tells you the direction of travel even among people not on Bitcoin rails.

What that does to slop is more interesting than what it does to payments. An agent metered in a money nobody can print faces a real budget constraint at the moment of the call rather than in a quarterly reconciliation nobody reads. The feedback loop closes in milliseconds instead of quarters. A process that would happily burn ten thousand tokens rediscovering something it already knew now runs against a balance that does not refill because someone upstairs approved a line item. Costless emission stops being costless, and the correction happens at the point of decision, which is the only place a price has ever done useful work.

## "It is my code" becomes checkable

Provenance is the other half, and it needs care, because this area is full of overclaiming.

OpenTimestamps anchors a hash to the Bitcoin chain, proving that a specific piece of data existed at a specific time, with no authority to trust and nothing to renew. That is the entire claim, and the limits are strict: it proves existence at a time for a particular hash. It does not prove authorship, and it emphatically does not prove a human wrote anything. No cryptography ever will. Anyone selling timestamping or signing as AI detection is selling something that does not exist.

Paired with a signature, though, it becomes an attestation of who committed to what, and when. That is a smaller claim and a more useful one, because it restores the thing slop destroys: a durable, unforgeable record of who put their name on the work. A developer signing and anchoring a commit is staking reputation on a claim, permanently, in a way no employer or platform can later revise. It does not tell you whether a model wrote the code. It tells you who said it was fit to ship, and it makes that statement impossible to walk back. "It is my code" becomes checkable. Given that the underlying failure is accountability rather than quality, that is the part worth building.

## Hard money prices slop rather than banning it

Under a monetary system that cannot inflate, capital cannot be routed indefinitely into negative-return token burn, because there is no mechanism to paper over the loss. No next round funded by credit that did not exist last quarter, no vendor equity recycling the same dollar through three balance sheets, no depreciation schedule stretched until the write-down lands on someone else's watch. A project would have to compute the real return on generating against the real return on building, at an honest hurdle rate, with its own capital.

Plenty of agentic work clears that bar without breaking a sweat, and it would keep being funded, probably more than now, because the money would go where it actually returns. A great deal of what is currently mandated does not clear it and would stop within a quarter. Hard money does not ban slop and does not need to. It prices it, and pricing it turns out to be sufficient, which is true of nearly every problem people propose to solve with a rule.

The costs never disappeared. Not one of them. They were moved onto maintainers who did not agree to absorb them, reviewers who were never asked, codebases that cannot object, and a generation of junior developers who will inherit systems nobody alive fully understands. That transfer is the product. Everything else is the receipt.

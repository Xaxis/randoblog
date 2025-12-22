---
title: "Quantum Mechanics Is Already an Information Engine (and That Might Be Our Best Shot at Testing Simulation Talk)"
description: "If you want simulation theory to stop being a campfire story, you need a physical fingerprint. Quantum mechanics offers a few pressure points: holography, error correction, Bell-certified randomness, and the weird global consistency of delayed-choice experiments. Here’s a testable premise I actually like: complexity-triggered decoherence."
pubDate: 2025-12-22
tags: ["physics", "quantum", "simulation theory", "holography", "information theory"]
---

People love simulation theory because it feels like a shortcut. You look at the world, notice it’s quantized, noisy, probabilistic, sometimes absurd, and your brain goes: yep, software.

The problem is physics does not care what feels plausible. If “we are in a simulation” is going to graduate from late-night philosophy to something sharper, it needs an operational bite. It needs a place where the simulation story makes predictions that non-simulation physics would not.

Quantum mechanics is the best hunting ground for that, not because it screams “computer,” but because it already behaves like an information protocol that happens to generate matter, fields, and spacetime as outputs. That sentence used to be poetic. Now it is almost literal, at least in some corners of modern theory.

Here’s the premise I find most interesting, mostly because it puts a real experiment on the table:

**Spacetime may behave like an error-corrected encoding of quantum information, and if that is true, there may be a resource limit that shows up as an extra kind of decoherence when we push quantum state complexity too far.**

That’s the whole blog post, basically. But the road to it matters, because otherwise it sounds like I’m just stapling buzzwords together.

## The part where “the universe is information” stops being a metaphor

Start with holography. In certain models of quantum gravity, a higher-dimensional spacetime can be fully described by a lower-dimensional quantum theory on its boundary. Bulk physics encoded on a boundary. Volume traded for surface. It is a mind-bender, but it is not vague. It’s math that works.

Two famous ingredients show up again and again:

1) **Entropy behaves like an area, not a volume.**  
   There are bounds and conjectures (Bekenstein-style bounds, covariant entropy bounds) that point toward a limit on how much information a region can contain that scales with surface area. That is already a “memory budget” style statement, regardless of whether you think a literal computer is involved.

2) **Entanglement seems to build geometry.**  
   In AdS/CFT, the Ryu-Takayanagi formula ties entanglement entropy of a region in the boundary theory to the area of a minimal surface in the bulk. The geometry is reading out like a derived quantity from entanglement bookkeeping.

If you want the straight sources:
- Ryu and Takayanagi’s original 2006 paper (arXiv): https://arxiv.org/abs/hep-th/0603001

Now add the twist that made a bunch of physicists do a double-take:

**Bulk locality in holography looks like quantum error correction.**

Almheiri, Dong, and Harlow argued that the way bulk operators can be reconstructed from different boundary regions is naturally explained if the boundary encoding behaves like a quantum error-correcting code. In other words: what feels like “local stuff happening in space” is consistent with “logical information protected against erasures.” It is the kind of thing you would build if you needed a robust representation of a world inside a noisy substrate.

- Almheiri, Dong, Harlow (arXiv PDF): https://arxiv.org/pdf/1411.7041
- Pastawski, Yoshida, Harlow, Preskill toy holographic codes (arXiv): https://arxiv.org/abs/1503.06237

Pause on that for a second. If spacetime is stabilized by something code-like, then locality is not a primitive. It’s a property that emerges when the encoding behaves nicely.

That is a simulation-flavored idea, sure. But it is also just an “information first” view of quantum gravity that shows up even if you never mention the word simulation again.

## Bell tests: the universe refuses to be a local mechanical clock

The other pillar is Bell nonlocality. Bell’s theorem is one of those results that does not care about your preferred story. If you assume local hidden variables and a form of statistical independence between hidden variables and measurement settings, nature breaks your inequality.

If you want a good map of the territory, Brunner et al. wrote a very thorough review:
- Bell nonlocality review (APS): https://link.aps.org/doi/10.1103/RevModPhys.86.419

Simulation fans often reach for “fine, it’s deterministic underneath” and then gesture at superdeterminism. The main experimental move against the lazier versions of that is to push measurement-setting choices back into deep cosmic history, so any hypothetical coordination would need to have been arranged billions of years ago.

That is not a thought experiment. It has been done.

- Cosmic Bell test using high-redshift quasars (APS): https://link.aps.org/doi/10.1103/PhysRevLett.121.080403
- Same paper on arXiv: https://arxiv.org/abs/1808.05966

This does not “disprove” superdeterminism. But it raises the price. If your model needs the universe to have pre-coordinated not just the particles, but the exact wavelengths of quasar photons used to pick measurement settings, you are building a theory whose main feature is that it refuses to be cornered.

Then there’s the part that feels even more simulation-relevant:

**You can certify randomness from Bell violations.**

Pironio and collaborators showed that Bell-violating correlations can be used to certify genuine randomness in a device-independent way. Translation: you can generate randomness while not trusting the internal details of your hardware, because the observed correlations themselves bound predictability.

- “Random numbers certified by Bell’s theorem” (Nature): https://www.nature.com/articles/nature09008
- arXiv version: https://arxiv.org/abs/0911.3427

If some simulator is trying to “fake it” with a pseudorandom generator, this is where the story gets interesting. Either the simulator has access to true randomness, or it has to arrange deep correlations between our choices and the hidden state of the world. Again, not impossible in principle, but increasingly engineered.

## Delayed-choice entanglement swapping: reality prefers global consistency over local narrative

There are experiments that don’t violate quantum theory at all, but do violate your attempt to tell a clean causal story.

Delayed-choice entanglement swapping is the classic example. You can measure two photons, record outcomes, then later choose a joint measurement on their partner photons that sorts those earlier records into “these earlier photons were entangled” versus “they were not,” depending on the later choice. No faster-than-light messaging. No retrocausal telegram. Just quantum correlations that make your everyday causal storytelling feel like a user interface, not the source code.

- Ma et al. 2012 (Nature Physics): https://www.nature.com/articles/nphys2294
- arXiv: https://arxiv.org/abs/1203.4834

This matters because simulation narratives often assume the world is computed forward like a game engine: step-by-step updates in local chunks. Quantum mechanics sometimes looks less like “forward simulation” and more like “satisfy global constraints while preserving no-signaling.”

That does not prove anything about an external computer. But it does tell you where your intuitions break.

## What we already tried, and what got ruled out

It’s worth mentioning one very literal attempt to detect “pixelation” type artifacts: Fermilab’s Holometer. The idea was to search for correlated noise signatures that might appear if spacetime had certain holographic, quantized correlation structures at measurable scales.

It didn’t find what it was built to find, at least not for the specific models tested.

- Fermilab writeup: https://news.fnal.gov/2015/12/holometer-rules-out-first-theory-of-space-time-correlations/
- 2017 Holometer constraints paper (arXiv): https://arxiv.org/abs/1703.08503

This is important because it kills the simplest simulation trope: “space is a grid and we will see the pixels.” If spacetime is discrete in some way, it hides it well. It respects Lorentz symmetry absurdly well. It does not behave like a naive lattice.

So where does that leave us?

It leaves us with simulation ideas that are not about pixels. They’re about **resources**.

## The premise I actually like: complexity-triggered decoherence

Here’s the claim in plain language:

**If the universe enforces an information budget (entropy bounds, holographic encoding, code-like protection), then there may be a practical limit on how “complex” a coherent quantum state can get before an extra error channel turns on.**

Call it *complexity-triggered decoherence*.

Not “your lab gets noisy.” Not “your lasers drift.” Those are boring and we already understand them. I mean a new term in the effective dynamics that correlates with *state complexity* itself.

Why complexity? Because if you imagine any underlying substrate with finite capacity, the hard part is not representing a few qubits in a product state. The hard part is representing huge, deeply entangled states with high circuit depth and strong scrambling.

This is the same engineering truth you learn the first week you build distributed systems. Simple state is cheap. Coordinated state is expensive. Coherence is bookkeeping.

And quantum gravity is already whispering: bookkeeping might be the whole game.

### What would this look like in a real experiment?

You set up two families of quantum states on a platform that can scale entanglement depth cleanly:

- Family A: low-depth entanglement, shallow circuits, structured entanglement.
- Family B: high-depth circuits that scramble strongly, pushing toward high complexity for the same number of qubits.

You then match the boring stuff:
- same hardware
- same time duration
- same temperature and shielding
- same calibration regime
- same total gate count where possible, or at least controlled comparisons across depths

And you look for an **excess** decoherence term that tracks complexity measures better than it tracks ordinary noise.

If you see nothing, that is still valuable. It tightens the leash on a whole class of “resource-limited reality” stories.

If you do see something, you do not get to shout “simulation confirmed.” You do get to say: our effective quantum theory is missing a term, and that term smells like a resource constraint rather than an environment.

That would be a big deal.

### Why this is the right flavor of test

Most simulation arguments die because they are too powerful. A sufficiently advanced simulator can always say “I simulated that too.” So you need a constraint the simulator cannot hand-wave away without changing the premise.

Resource limits are that constraint. If the simulator has infinite compute, you can never win. If the simulator has bounded compute per region or per update, you might.

Holography and entropy bounds are the closest thing physics has to hinting that “bounded resources” might be structural, not optional. And the QEC picture of spacetime suggests stability comes from an encoding, not from classical solidity.

So the practical move is: stop looking for pixels. Start looking for **where coherence becomes too expensive**.

## So, are we in a simulation?

I don’t know. Nobody knows.

But I do think quantum theory has quietly shifted the best version of the question.

It’s not “is there a computer outside the universe.”
It’s “is the universe’s consistency maintained by information-theoretic rules that look like computation, complete with protection, budgets, and tradeoffs.”

If the answer is yes, it might not matter whether there is an “outside” at all. The world would still be running on constraints that smell like an information engine.

And the one place we can actually push that engine hard, right now, is in the lab, with large entangled systems that are flirting with complexity.

If there is a hidden tax on complexity, we can hunt it.

That’s a simulation theory I can live with: one that can lose.

## References (primary and useful)

- Bulk locality and quantum error correction in AdS/CFT (Almheiri, Dong, Harlow): https://arxiv.org/pdf/1411.7041
- Holographic quantum error-correcting codes (Pastawski et al.): https://arxiv.org/abs/1503.06237
- Ryu-Takayanagi entanglement entropy formula: https://arxiv.org/abs/hep-th/0603001
- Bell nonlocality review (Brunner et al.): https://link.aps.org/doi/10.1103/RevModPhys.86.419
- Cosmic Bell test with quasars (Rauch et al.): https://link.aps.org/doi/10.1103/PhysRevLett.121.080403
- Bell-certified randomness (Pironio et al., Nature): https://www.nature.com/articles/nature09008
- Delayed-choice entanglement swapping (Ma et al., Nature Physics): https://www.nature.com/articles/nphys2294
- Holometer constraints (Chou et al., arXiv): https://arxiv.org/abs/1703.08503
- Fermilab Holometer summary: https://news.fnal.gov/2015/12/holometer-rules-out-first-theory-of-space-time-correlations/

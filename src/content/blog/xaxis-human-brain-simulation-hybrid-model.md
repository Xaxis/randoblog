---
title: "The Only Plausible Path to a Human Brain Simulation Is a Hybrid"
description: "A pragmatic blueprint for stitching together neural mass models, spiking networks, biophysical microcircuits, and ML surrogates into something that can actually scale."
pubDate: 2025-12-22
tags: ["neuroscience", "brain-simulation", "computational-neuroscience", "spiking-neural-networks", "systems"]
---

I keep seeing this question show up in different disguises: *What computational or ML model should we use to simulate a human brain?*

And the honest answer is: if someone gives you a single model name, they’re either selling something, or they haven’t tried building one of these things.

A brain is not a single scale problem. It’s not even a single *kind* of computation problem. It’s a stack of interacting phenomena that live on different time scales, use different representations, and have wildly different constraints. You’ve got slow global rhythms that shape attention and sleep, fast spike timing that gates information, dendritic computations that look like their own little analog computers, and learning rules that can play out over minutes, days, or a lifetime. If you try to cram all of that into one universal modeling choice, you get either a toy, or a furnace.

So if we’re serious about “closest to a full brain simulation,” the only plausible approach is combinatory. Not “let’s throw a bunch of models together and hope.” I mean disciplined modular co-simulation: a system where different model families live where they are least-wrong, connected by explicit interface contracts that you treat like engineering APIs.

That’s the game.

## Four layers, one organism

A workable brain simulation stack ends up looking like four layers running together:

**1) Whole-brain dynamics (minutes to seconds)**  
This is where you capture big network behavior: oscillations, resting state networks, large-scale coordination, and things you’d associate with fMRI/EEG-ish patterns. At this level, simulating each neuron is waste. You want region-level or population-level models.

**2) Circuit dynamics (seconds to milliseconds)**  
Here’s where spike timing, synchrony, inhibition-stabilized regimes, gating, and rhythm generation actually matter. This is where spiking networks earn their keep.

**3) Cellular and dendritic microdynamics (milliseconds down to microseconds)**  
This is where you pay for realism: multi-compartment neurons, dendritic spikes, channel distributions, and biophysical detail. It matters a lot, but not everywhere. You use this layer selectively, or you die.

**4) Functional cognition and control (seconds to hours and beyond)**  
Planning, working memory motifs, sequence control, structured behavior. Some of this can be implemented in spiking substrates. Some of it might be best represented with higher-level cognitive machinery that still interfaces cleanly with the spiking layer. Purists hate this. Engineers ship it.

The point is that each layer is doing a different job, and pretending otherwise is how you end up with an overfit monster that doesn’t scale or explain anything.

## The real trick: defining boundaries

Every multi-model brain sim lives or dies on interfaces. The problem isn’t “can we simulate neurons.” The problem is: can we connect a rate-based whole-brain model to a spiking circuit model without introducing nonsense, and can we do it in a way that stays stable over long runs?

There are a few boundary types you keep seeing because they’re the only ones that are sane:

- **Spikes**: discrete events. Time stamp + neuron ID. This is the cleanest lingua franca for circuit-level systems.
- **Rates**: smoothed population activity. Useful for whole-brain dynamics and low-dimensional coupling.
- **Fields / modulators**: continuous slow variables that represent neuromodulatory “tone” or global state shifts (dopamine-like, acetylcholine-like, sleep pressure-like, gain changes, etc).
- **Connectivity rules**: not always explicit adjacency matrices, but generator programs with seeds, because you often don’t have ground-truth wiring.

Once you accept those boundaries, the rest becomes a system design exercise: who speaks spikes, who speaks rates, who speaks fields, and how do you translate without breaking causality or inventing phantom dynamics.

## The “best available” combinatory stack

Here’s the version of the stack I’d actually build if the goal is “closest feasible” rather than “cute demo.”

### Whole-brain scaffold: neural mass / mean-field

At the top you put a whole-brain scaffold. Think region-level nodes connected by weights and delays. This layer is cheap enough to run for long durations and big enough to keep global coordination on the table.

This layer does not replace spiking. It sets the stage. It’s the thing that lets you say, “We have a whole brain,” while still allowing high-resolution islands to exist where they matter.

The key feature is that this layer can host embedded modules. You can take, say, a cortical region and replace it with a spiking network module, then feed its aggregate output back into the global scaffold.

That’s the first major hybrid seam.

### Circuit engine: spiking networks with point neurons

Next you need a spiking circuit layer that can scale. These are point neuron models: leaky integrate-and-fire variants, adaptive spiking models, maybe Izhikevich-style motifs depending on the circuit needs. The point isn’t to be “perfect,” it’s to get the timing, rhythms, E/I balance, and plasticity behavior right enough that circuit function emerges.

This is where you model:

- cortical microcircuits (in point-neuron form)
- thalamocortical loops (gating, rhythm coordination)
- basal ganglia action selection motifs
- hippocampal sequence and replay dynamics at a functional level

A lot of “brain-ness” lives here because timing is everything. Rate-only models often feel like the brain on tranquilizers.

### Selective biophysics: multi-compartment microcircuits

Then you carve out certain subcircuits and run them at biophysical resolution. Not the whole brain. Not even the whole cortex. You pick hotspots where morphology and channel dynamics change the computation in ways you care about.

Examples of where you might actually justify this cost:

- dendritic integration effects in certain cortical layers
- hippocampal subfields where bursting and dendritic spikes matter for memory dynamics
- cerebellar Purkinje cells if you’re modeling fine timing and error-driven adaptation with some seriousness
- neuromodulatory nuclei where firing modes and rebound effects matter

This is the second major hybrid seam: point-neuron spiking modules connected to biophysical modules that emit spikes and maybe field proxies back.

### ML’s ground role: surrogates, encoders, and compression

This is where ML belongs if you’re building a hybrid brain emulator instead of a philosophical monument.

ML is not the “brain model” in this setup. ML is the tool you use to compress expensive components into tractable surrogates.

Three useful roles:

1) **Surrogate models for biophysics**  
   You run a detailed microcircuit, collect input-output behavior, and train a surrogate that preserves the interface contract: spikes in, spikes out, plus whatever summary variables you need. You keep the “API,” you compress the internals.

2) **Sensory encoding front-ends**  
   Instead of simulating retina biophysics and early sensory microanatomy in full detail, you can use filtering models or learned encoders that produce realistic spiking patterns given stimuli. Clean contract: stimulus in, spikes out.

3) **Functional scaffolding for cognition**  
   If you want behavior that looks like planning and structured decision-making, you can build higher-level control modules that interact with spiking circuits via modulators and gating signals. This is not a cheap shortcut. It’s acknowledging that functional organization matters, and you can represent it explicitly without pretending every component is cell-for-cell identical.

If you keep the boundaries strict, ML becomes an accelerant rather than a replacement religion.

## Complexity isn’t the enemy. Hidden complexity is.

Hybrid brain simulation fails for a handful of predictable reasons. None of them are sexy.

### Time-step mismatch

Biophysical sims want tiny time steps. Spiking network engines might be event-based or run at millisecond-ish resolution. Whole-brain scaffolds can run coarse steps for long horizons.

If you try to couple these naively, you either violate causality or create weird oscillations that look “brain-like” but are actually numerical artifacts.

The fix is multi-rate co-simulation: define a coupling macro-step where components exchange data, but allow each component to substep internally. You also need buffering and delay handling so the system stays causal and stable.

### Representation mismatch: spikes vs rates vs fields

You have to accept that conversions are lossy. The goal is to make the loss predictable, not pretend it doesn’t exist.

Spikes to rates is smoothing. Rates to spikes is usually an inhomogeneous Poisson-ish generator or something slightly smarter that preserves correlations. Fields and modulators are slow variables that shift gain, thresholds, plasticity, and excitability.

A mature hybrid sim treats these conversions as first-class components, not “utility functions” buried in a notebook.

### Parameter identity across tools

“Pyramidal neuron” is not a single parameter set. Even within one cortical area, cell types and subtypes differ. Across species, it’s a different beast again. Across individuals, it varies.

So the interface needs typed schemas: this class of neuron has these intrinsic dynamics, these synapse families, this connectivity preference matrix, these plasticity rules. Then you generate tool-specific instantiations from canonical definitions.

Otherwise you end up with a Frankenstein sim where the same “cell type” behaves differently depending on which engine is running it.

### Connectivity uncertainty

This is the elephant. For humans, we don’t have synapse-level ground truth connectomes. We have partial constraints, imaging-derived scaffolds, and a lot of statistical inference.

Which means: much of your connectivity must be defined by wiring rules, not explicit adjacency. Distance-dependent rules, layer-specific probabilities, type compatibility matrices, development-inspired constraints. Your network isn’t a static file. It’s a generator program plus a seed.

This is where engineering discipline matters. If you don’t treat connectivity generation as a reproducible artifact, you can’t debug anything, and you can’t compare runs.

## How I’d partition the brain in practice

If you’re actually mapping model families onto anatomy, you end up with something like this:

- Most cortex: point-neuron spiking networks, with selective biophysical microcircuits in places you care about dendritic effects
- Thalamus and thalamocortical loops: spiking modules with mode-switching dynamics (burst/tonic motifs), and strong coupling to the whole-brain scaffold
- Hippocampus: spiking sequence and replay modules with plasticity, plus selective biophysics if you’re chasing dendritic phenomena
- Basal ganglia: spiking action selection motifs coupled to a dopamine-like modulator field
- Cerebellum: spiking timing circuits, optionally more detailed in Purkinje pathways
- Neuromodulatory systems: low-dimensional dynamical systems or small spiking nuclei that produce modulatory fields that affect other modules
- Whole-brain integration: a mean-field scaffold that keeps global coordination and long timescales feasible

That’s not “perfect.” It’s not supposed to be. It’s an architecture that can scale, can be constrained by data, and can be upgraded module-by-module as better models and better measurements arrive.

## What “full brain simulation” actually means

This is where people get confused and then start fighting on the internet.

If you mean **biophysical human brain emulation**, you are up against data limits and compute limits. You can still build a hybrid emulator that’s scientifically useful and gets closer and closer, but you won’t pretend you’ve captured the literal human brain in silicon.

If you mean **functionally human-like cognition on brain-shaped substrates**, then you can get surprisingly far with the hybrid approach: spiking circuits where timing matters, whole-brain scaffolds for coordination, modulators for state control, and ML surrogates to compress expensive pieces while keeping interface contracts intact.

The path that feels most promising to me is to treat “whole brain simulation” like building an operating system: you don’t write it in one language, you don’t model everything at the same granularity, and you don’t pretend you can debug it without logs, standards, and reproducible builds.

The brain isn’t one model. It’s a federation.

And if we want to emulate it, we should build the way biology built: modular, layered, and capable of swapping parts without killing the organism.

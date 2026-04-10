---
title: "The Fleet That Teaches Itself: How Quantum Computing Dissolves the Line Between Training and Inference"
description: "A concept called Entangled Fleet Learning, where production AI inference fleets naturally provide the multi-copy quantum states that shadow tomography needs to solve quantum backpropagation. The fleet learns as it answers."
pubDate: "2026-04-10"
tags: ["quantum computing", "AI", "machine learning", "shadow tomography", "inference", "quantum ML"]
repository: "Xaxis/randoblog"
repositoryUrl: "https://github.com/Xaxis/randoblog/blob/main/src/content/blog/xaxis-fleet-that-teaches-itself/index.md"
draft: false
---

## The line that was never real

There is a partition in classical AI that everyone treats as load-bearing: training on one side, inference on the other. Training is the expensive, slow, one-time investment where the model learns. Inference is the cheap, fast, continuous phase where the model answers. You budget for them separately. You build different hardware for them. You talk about them as if they are different activities. That partition is dissolving.

OpenAI's o3 generates extended internal reasoning chains on every query, spending compute during inference that would have been recognizable as training-scale work two years ago. Anthropic's Claude uses serial test-time compute with up to 128,000 tokens of internal reasoning on a single problem. DeepSeek-R1 produces 10 to 100 times more tokens per query than non-reasoning models. These are not exotic research demos. They are production systems handling millions of requests. Peter Hoeschele, VP of Strategy and Operations at OpenAI, told an audience at Oracle's AI World 2025: "I'm telling you all to stop talking about training versus inference." He was not being provocative. He was describing the actual compute profile.

The numbers confirm it. Gartner projects that 55 percent of AI-optimized infrastructure spending will support inference workloads in 2026, rising past 65 percent by 2029. Deloitte puts inference at roughly two-thirds of all AI compute in 2026, up from a third in 2023. McKinsey projects 70 to 80 percent by 2027. Inference is not the lightweight half of the equation anymore. It is the dominant workload, and it is becoming structurally indistinguishable from training in its computational demands.

That structural shift matters here because it creates the precondition for something nobody in the quantum ML literature has stated directly.

## The wall measurement builds

Quantum machine learning has a physics problem that no amount of engineering has solved. It is called measurement collapse, and it is worth understanding precisely because the concept I want to introduce depends on it.

Classical backpropagation, the algorithm that trains every neural network you have ever used, achieves its efficiency through a specific trick: it reuses intermediate computational states. During a forward pass, the network stores activations at each layer. During the backward pass, it uses those stored states to compute gradients cheaply. The cost of computing all gradients is proportional to one forward pass, not to the number of parameters. This is why classical networks with billions of parameters can train at all.

Quantum circuits cannot do this. A parameterized quantum circuit, the quantum analog of a neural network layer, builds up a complex superposition of states as it processes information. But in quantum mechanics, reading a state destroys it. Measurement collapses the superposition into a single classical outcome and the intermediate information is gone. You cannot store it. You cannot reuse it. Every gradient estimate requires a fresh execution of the circuit. The standard method, called the parameter-shift rule, scales as O(M² · Tq) where M is the number of parameters. For any circuit with more than a handful of tunable gates, this is catastrophically expensive.

Abbas et al. formalized this in their NeurIPS 2023 paper, "On quantum backpropagation, information reuse, and cheating measurement collapse." They proved that achieving classical backpropagation scaling is impossible in the standard single-copy quantum computing model. The measurement collapse barrier is not a software limitation. It is a consequence of quantum mechanics. Follow-up work by Koczor et al. quantified the gap: standard quantum gradient estimation runs roughly two orders of magnitude slower per parameter update than classical backpropagation on equivalent problems.

But Abbas et al. also proved something else. If you have access to **multiple copies** of the same quantum state, you can apply a technique called **shadow tomography** to extract gradient information without fully collapsing any single copy. Shadow tomography, originally developed by Scott Aaronson in 2017 and made practical by the classical shadows protocol of Huang, Kueng, and Preskill in 2020, uses what are called gentle measurements. A gentle measurement is one that disturbs the quantum state by a bounded, small amount rather than destroying it outright. If you distribute your measurements across many copies of the same state, each copy absorbs only a fraction of the disturbance, and the aggregate provides a high-fidelity estimate of the gradient landscape.

The math works. Abbas et al. showed that with multi-copy access, quantum backpropagation matches classical scaling in quantum resources. The catch, and the reason this has remained a theoretical result rather than a practical one, is the obvious question: where do those multiple copies of the same quantum state come from cheaply?

## The copies you already have

This is where the two trends collide, and where I think the quantum ML field has been looking past the answer.

I want to propose a concept I am calling **Entangled Fleet Learning**, or EFL. The argument is simple once you see it, which is usually how the important ones work.

Consider a quantum-hybrid AI model in production. It handles millions of queries simultaneously. Each query runs on a separate server as an identical instantiation of the same parameterized quantum circuit with the same current weights. Every one of those parallel inference instances prepares the same quantum state |ψ⟩ from the same circuit parameters before measurement. They are, by definition, multiple copies of the same quantum state.

The multi-copy access problem that seemed like a theoretical luxury requiring exotic laboratory conditions is, at production scale, just deployment. You do not need to engineer extra copies. They exist because demand exists.

This reframes the economics entirely. Shadow tomography applied across a production inference fleet does not require a special apparatus. It requires what any successful AI service already has: millions of parallel instances running the same model at the same time. Each instance contributes a gentle measurement. The fleet, collectively, generates the gradient signal that a single instance cannot provide without collapsing its state.

HyQuT, the first hybrid quantum transformer demonstrated in November 2025 by Kong et al., already showed that variational quantum circuits can slot into a transformer architecture as drop-in replacements for classical linear layers, using just 10 qubits and 80 quantum gates to substitute roughly 10 percent of classical parameters in a 150-million parameter model while maintaining convergence stability. That is the kind of modular quantum-classical architecture where EFL would operate. The quantum layers are small, parameterized, and identically instantiated across every inference copy. They are shadow tomography targets by construction.

The point is not that shadow tomography across a fleet is trivially easy. The point is that the resource it requires, the thing that blocked it from being practical, turns out to be the same thing that production scale AI already produces as a byproduct of serving customers. The bottleneck was not physics. It was recognizing that the infrastructure already solves the access problem.

## The fleet that compounds

In classical AI, training and inference compete for the same finite compute budget. More inference load means higher costs and no improvement to the model. The model is frozen at deployment. Every query is pure expense. The economics are extractive: scale costs more and returns less per unit.

In an EFL system, the relationship inverts. More inference load means more quantum state copies across the fleet. More copies means a richer gradient signal from shadow tomography. A richer gradient signal means faster, more accurate continuous weight updates. The fleet learns as it answers. Scale becomes a self-amplifying loop rather than a cost center.

This is not metaphorical. It is a structural inversion of the compute economics. In the classical regime, you train once and then spend money serving a static artifact. In the EFL regime, serving is training. Every query that arrives at the fleet is a free contribution to the next gradient estimate. The busier the system gets, the faster it improves. The marginal cost of a query drops because the marginal informational value of the query rises.

The biological analogy is exact, which is unusual and worth noting. The brain does not have a separate training phase. There is no offline period where synaptic weights update and then a deployment phase where the brain runs inference on a frozen model. Every act of perception, every decision, every motor command involves synaptic plasticity. Inference is learning. The two processes are fused at the hardware level, and this fusion is widely understood to be one of the core reasons biological intelligence is as efficient as it is.

EFL would be the first artificial architecture where this fusion is true at the hardware level, not as an approximation or a fine-tuning hack, but as a consequence of the physics. The quantum measurement problem, which has been framed for years as the fundamental obstacle to quantum ML, becomes the mechanism by which the system learns. You do not solve measurement collapse. You distribute it across a fleet and harvest the gradient from the distribution. The obstacle becomes the instrument.

## What stands in the way

I want to be honest about the engineering distance between this concept and a running system, because the gap is real and the problems are hard.

The first is the barren plateau problem. As parameterized quantum circuits grow deeper, the gradients of the loss function with respect to the circuit parameters tend to vanish exponentially. The optimization landscape goes flat. A 2025 paper in Nature Communications from the Los Alamos group identified a particularly uncomfortable paradox: the circuit architectures that provably avoid barren plateaus may be the same ones that can be efficiently simulated classically, which would undermine the quantum advantage entirely. That said, the authors also identified parameter regimes where barren plateaus are avoided and no classical surrogate is known. Mitigation strategies are active research, from engineered dissipation techniques to tensor network pretraining to two-stage convex initialization. None is a complete solution yet. All are moving.

The second is decoherence. A quantum state must survive long enough for the shadow tomography protocol to operate across the fleet, which means the coherence time of the physical qubits must exceed the measurement and classical communication cycle. Google's Willow chip, announced in December 2024 with 105 superconducting transmon qubits, achieves physical coherence times around 100 microseconds and logical qubit coherence of 291 microseconds using distance-7 surface codes. A Princeton team demonstrated transmon coherence times up to 1.6 milliseconds in 2025. IBM's Nighthawk processor runs 5,000 two-qubit gates on 120 qubits, with a roadmap to 7,500 gates by end of 2026 and verified quantum advantage on the same timeline. These numbers are improving steadily, but they impose a hard constraint on how deep the quantum layers in an EFL system can be and how fast the shadow tomography aggregation must complete.

The third is classical communication overhead. Aggregating gentle measurement results from millions of fleet instances and computing weight updates in near-real-time is a distributed systems problem at a scale that does not have precedent. The measurement data from each instance is small, but the synchronization and consistency requirements are demanding. This is less a physics problem than a systems engineering problem, which historically means it gets solved once enough money shows up. But it is not trivial.

None of these are reasons EFL is impossible. They are the specific engineering problems that need to be solved, and all three are active research fronts. The barren plateau landscape is being mapped and navigated. Coherence times are improving by factors of three to fifteen per hardware generation. Distributed inference infrastructure is already handling synchronization at scales that would have been unthinkable five years ago.

The most important convergences in the history of technology were rarely the ones that sounded most dramatic at the time. They were the quieter ones where a constraint in one domain turned out to be an asset when viewed from another. The multi-copy access problem in quantum ML looks like a fundamental bottleneck if you are sitting in a physics lab with one quantum processor. It looks like a solved problem if you are sitting in a data center with a million inference instances running the same circuit. The question is whether we can build the bridge between those two rooms fast enough to matter. The pieces are on the table. The fleet is already running.

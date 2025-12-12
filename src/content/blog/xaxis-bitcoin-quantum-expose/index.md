---
title: "Bitcoin vs Quantum: What Actually Breaks, What Doesn’t, and What We Should Do"
description: "A practical walk through the quantum computer risk to Bitcoin, why signatures are the only real attack surface, and how we migrate with calm engineering instead of panic."
pubDate: "2025-11-12"
tags: ["bitcoin", "security", "cryptography", "quantum", "engineering"]
repository: "Xaxis/randoblog"
repositoryUrl: "https://github.com/Xaxis/randoblog/blob/main/src/content/blog/xaxis-bitcoin-quantum-expose/index.md"
draft: false
---

I keep getting the same two questions. First, will a future quantum computer blow a hole through Bitcoin. Second, if it can, is there anything we can do that does not look like complete chaos. The short version is simple. Hashing is fine. Signatures are not. That is the center of gravity for the whole conversation.

I will attempt to lay out the risks, then the concrete attack paths, and finally the sane path forward that respects Bitcoin’s values without pretending physics is on pause.

## What actually breaks

Bitcoin relies on two big cryptographic tools. Hash functions and digital signatures.

Hashing shows up everywhere. Proof of work, Merkle trees, address creation, commitment schemes. Quantum gives a square root speedup against raw brute force on a hash. That still leaves a gigantic security margin with SHA-256. If the world ever felt nervous, moving to a longer hash output regains the lost margin. That change is trivial compared to the rest of this topic.

Signatures are the problem. We use ECDSA on the secp256k1 curve. A fault tolerant quantum computer running Shor’s algorithm can recover a private key from its public key. That is the only meaningful break that lets an attacker spend coins they do not own. Not the chain. Not proof of work. Keys.

## What the attacker actually does

A real QC does not steal all coins at once. It unlocks two theft modes. One is slow and methodical. One is a race.

**Long range sweep.** Anything that has ever revealed a public key on chain is fair game. Think early pay to public key outputs, addresses that were reused, some old multisig paths, and a few creative footguns where people exposed keys in scripts. An attacker can sit offline, run the math, and collect those UTXOs at their leisure once the keys are solved. There is no timer and no mempool drama. If your key is exposed and a capable QC exists, the clock already ran out unless you moved earlier.

**Short range race.** Modern outputs hide the public key until you spend. When you broadcast a transaction, the witness or control block reveals the key. A quantum attacker watches the mempool. The moment your pubkey appears, they try to compute your private key, sign their own conflicting transaction, attach a bigger fee, and get it mined first. This only works if they can finish the math before your transaction confirms. Today that is science fiction. _One day soon_ it will not be. When that day gets close, speed and fees start to matter a lot for any spend that reveals a key.

Lightning sits on top of the same signature assumptions. If signatures can be forged, channel funding outputs and state updates can be attacked. In practice the first blow still lands on the on chain keys. The rest follows.

## How “big” does the quantum computer have to be

You can drown in papers and still miss the punchline consensus. The attack needs thousands of error corrected, logical qubits, not just a lab demo of some noisy qubits. Then you need a very deep circuit to finish in hours not months, and a pile of error correction factories running in parallel to keep the whole thing stable. Translate that into physical qubits and you are talking million scale machines for the surface code families that are the workhorse of practical fault tolerance today. That is not a laptop. That is an industrial grade physics facility with serious power, cooling, control electronics, and engineering talent.

Could clever encodings or new architectures lower the overhead. Yes. Could a scary team with resources build something earlier than public labs. Also yes. Which is why our plan cannot be “hope the physicists are slow.”

## What is safe right now

Hygiene helps. The simple rule remains. Do not reuse addresses. Keep public keys hidden until spend. Prefer fast confirmation if a public key is revealed. Avoid sweeping a stack of vulnerable UTXOs in a single transaction when the world is already on edge. That is not a strategy for the next half century, but it does keep the attack surface narrow while we prepare the real fix.

## The real fix is signatures that are safe against quantum

We add post quantum signatures to Bitcoin. We do it in a way that keeps old coins spendable, lets people opt in gradually, and does not set fire to the social contract. This is not an exotic path forward. Bitcoin has added new script paths and new spending rules before using soft forks. Taproot already gave us a flexible place to define new leaves. The playbook is clear.

Pick one or two post quantum schemes that meet our constraints. **SPHINCS Plus** is conservative and stateless with bigger signatures. **Dilithium** is fast and compact but stateful designs and implementation surfaces need careful treatment. Hybrid paths are the prudent middle ground. Require both a classical signature and a post quantum signature to spend. That buys us defense in depth during a long transition and it lets hardware wallets ease into new code and new storage formats.

Define new tapscript leaf types that enforce these conditions. Ship a BIP that documents encoding details, PSBT fields, and wallet interaction. Make it easy for vendors to add support, and easy for users to choose the safer path.

## Migration without panic

We do not need to force everyone on day one. The migration story should be phased and boring by design.

**Phase one.** Wallets add support for hybrid outputs behind a simple toggle. Developers build one click sweep tooling that moves coins from legacy outputs into hybrid outputs with sane fee defaults and Replace by Fee enabled. Exchanges accept hybrid deposits and eventually make them the default. Education focuses on address reuse and on why this is a simple insurance policy, not a moral panic.

**Phase two.** Once there is public evidence that quantum machines can run real cryptanalytic workloads with thousands of logical qubits and hours scale runtime, recommended becomes strongly recommended. Nodes and mempools can prefer relay policies that are friendly to hybrid spends. Services can raise fees or reduce limits for legacy only deposits. This is basic risk pricing, not coercion.

**Phase three.** When the world actually gets close to a machine that can front run fresh spends inside the mempool window, the defaults flip. New coins should land in post quantum only outputs. Old script types can be discouraged at the policy layer. We still do not need to break consensus or confiscate anything. We just stop rewarding risky behavior with cheap convenience.

Throughout all phases, there should be a clear answer for the ugliest question. Do we ever consider protocol level “recovery” of coins demonstrably stolen by a quantum attacker. _I will make the answer very clear_:

**No! The rule of law on Bitcoin is the consensus rules. The entire value of the system rests on the idea that valid spends are valid spends. The day we rewrite the ledger by committee is the day we teach the world that private agreements overpower public rules.** That does not mean we shrug. It means we do the engineering early so that we are never forced into that corner.

## What this costs

Nothing comes for free. Hybrid signatures make transactions bigger. That impacts fees in crowded blocks and lowers the number of transactions per block at the margin. Hardware wallets need firmware updates. QR codes for PSBTs get chunkier. Backups grow a little. Test suites get wider. We should measure that cost carefully and be honest about it. We should also keep perspective. Paying a few extra vbytes to remove an extinction risk is a good trade.

## How to tell when the risk is real

Hype will outrun reality. It always does. So set objective markers.

**Number one.** Logical qubits. Not headlines about physical qubits or error rates in tiny test beds. We need to see sustained, error corrected, logical qubits at the thousand scale.

**Number two.** Circuit depth and runtime. Running a toy instance for a few seconds is not relevant. A credible ECDSA break demands hours scale stability with heavy duty error correction.

**Number three.** End to end demonstrations on systems that look like they could scale. Real control stacks. Real cryogenics and photonics. Real magic state factories churning in parallel. If that shows up in public, assume private labs are at least as far.

By the time those markers are in the open, it will already have been obvious to the people paying attention. That is why we should do the work before the headlines. The best time to fix the roof is when the sun is out.

## A short checklist for builders

If you maintain a wallet, add a post quantum toggle, wire up hybrid leaves, and expose it in the UI with a calm sentence, not a flashing warning. Support one click sweeps from P2PK, P2PKH, reused addresses, and any script where a key has ever been exposed.

If you build hardware, plan for bigger signatures and more code. Budget flash and RAM accordingly. Map out your secure element story for post quantum keys. Think through backups that are friendly to larger key material without pushing users into bad practices.

If you run an exchange or custodian, accept hybrid deposits first. Then make them the default. Later, require them for large transfers. Publish a migration calendar so users can plan ahead.

If you run a node or write policy code, keep an eye on mempool behavior that shortens the exposure window when a public key is revealed. None of that needs consensus change. It is relay and fee market tuning.

If you hold bitcoin and nothing else, move off any address you have ever reused. When your wallet offers a post quantum option, take it. That is it.

## The values check

There is a temptation to say that preparing for quantum is anti Bitcoin because it smells like fear. I see it as the opposite. Bitcoin’s promise is credible neutrality and credible permanence. You do not protect that promise by ignoring physics. You protect it by adapting slowly, minimally, and in a way that leaves yesterday’s coins valid tomorrow. The chain stays the chain. The rules stay the rules. We just need to add a safer way to sign.

## In the end

Quantum does not erase proof of work. It does not let someone mine blocks from thin air or pull a time machine trick on the ledger. It attacks one assumption that we can swap out with careful engineering. When the day comes that a real machine exists, the first people to get hurt will be those sitting on very old outputs that exposed public keys years ago. The next wave would be the mempool race once runtimes shrink. The community’s job is to make both outcomes boring by moving early, and by giving users a better default before it feels urgent.

If you want a single sentence to carry around, use this. Signatures are the only fire door that needs replacing. We know how to build the new door. Let’s built it and install it while the building is quiet.

---

## Resources and further discussions

For the sake of keeping this article short I didn't dive deep into every nuance but I wanted to provide a few reources I've been building and tracking.

### Publicly known quantum computers

| System | Tech | Physical qubits | Logical qubits | Year | Source |
|---|---|---:|---:|---:|---|
| IBM — Condor (Quantum System Two / Condor chip) | Superconducting transmons | 1,121 | — | 2023–2024 | IBM Research press/annual updates |
| Google — Willow | Superconducting transmons | 105 | 1 logical memory demo | 2024 | Google Quantum AI blog and Willow spec |
| Quantinuum — H2-1 | Trapped ions (Ba⁺) | 56 | 12 logical via Azure “virtualization” | 2024 | Quantinuum posts and Microsoft Azure blog |
| Quantinuum — Helios | Trapped ions (Ba⁺), QCCD | 98 | Not publicly stated | 2025 | Quantinuum Helios benchmarking |
| Atom Computing — AC1000 | Neutral atoms (¹⁷¹Yb) | 1,200+ | Not disclosed | 2025 | Atom Computing product page |
| IonQ — Tempo | Trapped ions | 100 (target) | Not disclosed | 2025 | IonQ Tempo page and roadmap |
| IonQ — Forte / Forte Enterprise | Trapped ions | 36 | Not disclosed | 2022–2025 | IonQ system pages, AWS Braket |
| Rigetti — Ankaa-3 | Superconducting | 84 | — | 2024 | Rigetti announcement |
| QuEra — Aquila | Neutral atoms (analog/FPQA) | 256 | — | 2022 | QuEra site and arXiv paper |
| Xanadu — Borealis | Photonic (Gaussian boson sampling) | 216 | — | 2022 | Nature paper and company refs |
| D-Wave — Advantage2 (annealer) | Quantum annealing, superconducting | 4,400+ | — | 2025 | D-Wave press materials |

---
title: "Make Cheating Expensive: Bitcoin Inside a Nuclear Non-Proliferation Stack"
description: "A concrete, buildable design for nuclear non-proliferation that uses Bitcoin: immutable time, auditable custody, and skin-in-the-game incentives."
pubDate: "2025-09-16"
tags: ["bitcoin", "security", "nonproliferation", "verification", "zero-knowledge", "lightning", "dlc", "taproot"]
repository: "Xaxis/randoblog"
repositoryUrl: "https://github.com/Xaxis/randoblog/blob/main/src/content/blog/xaxis-bitcoin-nuclear-non-proliferation-plan/index.md"
draft: false
---

## The problem

Non-proliferation breaks when records get edited after the fact, when custody trails are ambiguous, and when the cost of cheating is mostly political theater. We already have people and physics. What is missing is a neutral memory and money that moves only when reality lines up.

## Where Bitcoin actually fits

Bitcoin is not the database for safeguards. It is three primitives that help the parts that keep failing:

1) **Time that nobody can rewrite.** Anchor cryptographic commitments to logs so you can prove what existed before block height N.  
2) **Final settlement between adversaries.** Move value without asking any single state or vendor for permission.  
3) **Contracts with teeth.** Lock up a bond that only unlocks when independent witnesses attest to the same outcome.

Everything else stays off chain.

## What never goes on chain

No raw gamma or neutron spectra. No schedules. No coordinates. No plant identifiers. You publish **hashes** and proofs, not secrets. Think Merkle roots salted and batched so the outside world cannot correlate a single facility with a single timestamp. Later, if questioned, you reveal the minimal slice plus the path that matches the anchor. That is the contract: show the proof or pay the penalty.

## The edge is where truth is born

Start where the physics happens. Electronic seals, flow meters, neutron and gamma counters, even inspector badge readers. Give each device a private key inside a secure element. Every log line is signed at the source. The inspector app rolls those signatures into a Merkle tree for the visit or the shift. You now have a small root that commits to a big pile of evidence.

Storage is boring on purpose. Raw logs are encrypted and stored in three places: operator, regulator, international body. Use secret sharing so no single party can reconstruct everything. If someone disappears, the others can still open the box.

## Anchoring without leakage

You send Merkle roots to a public timestamping calendar that aggregates thousands of roots and drops a single commitment into a Bitcoin transaction on a schedule. Daily for low risk, hourly when stakes go up. To avoid pattern-of-life leakage, you salt, you batch, and you jitter the publish time. Outsiders see a stream of anchors. Insiders can later prove which anchor binds which data.

The payoff is simple. If someone tries to “fix” a number two months later, the math refuses to forget. The altered file will not match the committed root. No debate. No spin. Just math.

## Custody that is joint control, not a circus

Treat declared items as cryptographic claims that live off chain and are **rooted** to Bitcoin. Cylinders of UF6, fuel assemblies, sealed containers. Each gets an ID. Moves require multi-party signatures. Use Taproot style policies so the visible footprint on chain stays tiny while you still get flexible M-of-N control under the hood.

Every transfer produces a new state and a new anchor. The on-chain data is minimal. The heavy data lives where it should live. The audit trail is still end-to-end because every state references a previous commitment. You can hand the whole chain to an auditor without handing them secrets.

## Make cheating cost real money

Now the part that changes behavior. You size a **bond** to the risk of the operation and you lock real bitcoin in a contract that only pays out when independent witnesses say the same thing. Discreet Log Contracts are the right tool here. Oracles sign a statement like “shipment ABC arrived sealed by 2025-10-01T00:00Z” or “no unplanned outage exceeding 48 hours occurred in window W.” If the threshold of oracles agree, funds move. If not, funds route to the counterparty or to an inspection pool.

The trick is governance, not code. Your oracle set is heterogeneous on purpose: international agency, a national lab, and a neutral academic lab. Keys rotate on a schedule. Attestations are themselves anchored so the oracle history is auditable.

Cheating then has a predictable price. Not an argument, not a memo. A price.

## Corroboration you can buy in small bites

There is value in paid signals that do not reveal the facility. Think corridors and buffer zones. Satellite tasking for specific windows. Calibrated community sensors near transport routes. Environmental samples from pre-agreed coordinates. Pay for signed measurements that fit anonymized windows and simple physics checks. Lightning makes this trivial: small payments for small pieces of evidence. Anchor those claims too so you can later prove nobody swapped them.

None of this replaces an inspector or a containment and surveillance system. It is reinforcement. If a truck goes dark, you will likely see it in your side channels.

## Disputes without drama

When a dispute hits, the accused reveals the narrow slice that matters plus the path to the anchor. Verifiers run the math and check device signatures. If it matches, the claim stands. If it does not, the bond is slashed. If parties still disagree, the contract already names the oracles for final attestation. Their decision moves the money. After that, you can fight in a room with flags if you want. The settlement already cleared.

This process matters because it compresses the time between suspicion and consequence. That is how you change incentives.

## Threat model and the boring mitigations

- **Back-dating and silent edits.** Anchoring frequency bounds the window for funny business. Hourly anchors make the worst case an hour of wiggle room.  
- **Key theft at the sensor.** Use secure elements, short-lived device certificates, and in-person key ceremonies during commissioning. Inspectors verify device public keys on every visit.  
- **Oracle capture.** Threshold oracles from different institutions, public issuance and revocation of keys, attestations anchored for audit.  
- **Pattern-of-life leakage.** Salting, batching, and variable publication times limit correlation. Keep roots unlinked until a dispute or routine audit.  
- **Network denial.** Store-and-forward. You only need periodic access to broadcast anchors. If a site goes offline, you catch up when it comes back.

None of this is magic. It is hygiene with better tools.

## Why Bitcoin instead of a permissioned ledger

Neutrality and longevity. You need a timeline and settlement layer that nobody in the room controls. That is the point. Also, the tooling already exists. Timestamping with aggregated anchors is mature. DLCs exist. Taproot policies exist. Lightning works. You are not inventing a new platform and begging everyone to run it. You are using a public utility for the few things it is best at.

## A pilot that fits in one quarter

Pick a low-sensitivity workflow. Example: declared UF6 cylinder transfers between two controlled sites inside one jurisdiction.

- **Scope.** Device signing for seals and flow meters, inspector app that builds Merkle roots, daily anchoring, encrypted storage with secret sharing across operator and regulator, a small auditor that can verify end-to-end.  
- **Success.** A third party can reproduce the same audit verdict from the same committed data without touching any raw secrets from other workflows.  
- **Stretch.** Add a tiny bond on each transfer with a two-oracle DLC. Size it so it stings but does not derail operations. Release on on-time arrival with matching seal codes.

Run that for 90 days. Measure friction, fees, false positives, and how many times the math caught a paperwork mistake before it mattered. Adjust.

## Interfaces, not wish lists

If you want this to be buildable by normal teams, you define four skinny interfaces and you stick to them:

1) **Device signature format.** Include device ID, monotonic counter, timestamp from a tamper-resistant clock, and a payload hash.  
2) **Batching and anchor format.** Merkle tree rules, salt rules, anchor cadence, and the exact way the root is written to the chain.  
3) **Custody policy template.** The M-of-N script template, rotation rules, and handoff checklist.  
4) **DLC oracle statement schema.** What is being attested, how the time window is defined, how conflicts are resolved, and how key rotation is announced.

Everything else is implementation detail you can localize to each agency or vendor. Keep the surface small and the math universal.

## What this does to behavior

It reduces the value of soft power and increases the value of acting clean. If you are a good actor, you get lower bond sizes over time. Your cost of capital for operations goes down because your history is easy to verify. If you are sloppy or you like to “fix” logs later, your bond gets bigger and your counterparties stop trusting your paperwork. You can still posture at press conferences. The money will not care.

There is also an internal benefit that nobody talks about. Anchoring makes your own teams more careful. When you know the system will prove you changed a number on Tuesday, you stop changing numbers on Tuesday.

## Limits that keep us honest

Bitcoin cannot tell you whether a warhead is real. It cannot calibrate a detector. It does not read a seal. It only binds evidence to time and binds money to shared outcomes. The physics and the people remain the foundation. That is fine. The goal here is not to replace the IAEA. The goal is to remove the places where trust keeps getting laundered through spreadsheets.

## What to build next

- A reference inspector app with Merkle batching and anchor verification.  
- A small custody service that implements Taproot policies for declared items with clean handoff UX.  
- A DLC kit with a mock oracle set and clear governance docs so lawyers do not stall the whole thing.  
- A red team that tries to leak pattern-of-life from the anchor stream and proves the mitigation works.  
- A tabletop exercise that runs a full dispute from suspicion to settlement using only blinded proofs and the DLC.

Ship those. Run a pilot. Iterate on the boring parts. Publish the interface specs so other countries or programs can copy the playbook without copying your data.

## In summary

**Bottom line:** Bitcoin is not a silver bullet for non-proliferation. It is a hammer for three nails that bend a lot of treaties out of shape: immutable time, auditable custody, and money that moves only when witnesses agree. Use it there. Keep secrets off chain. Make cheating cost real money. And let the math eat the arguments that used to drag on for months.

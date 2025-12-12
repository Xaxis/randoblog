---
title: "Bitcoin Proof-of-Ownership Without Disclosure"
description: "A Bitcoin-native protocol that lets users prove they control coins meeting or exceeding a value threshold without revealing which UTXOs they own. Using zero-knowledge proofs, UTXO set accumulators, and updatable witnesses, it enables portable, persistent, and privacy-preserving proofs that remain valid until the coins are spent, allowing verifiers to check collateral without ongoing interaction or surveillance."
pubDate: "2025-08-12"
tags: ["bitcoin", "zero-knowledge", "privacy", "collateral", "UTXO", "zkp", "proof-of-ownership"]
repository: "Xaxis/randoblog"
repositoryUrl: "https://github.com/Xaxis/randoblog/blob/main/src/content/blog/xaxis-bitcoin-proof-of-ownership/index.md"
draft: false
---

# Bitcoin Proof-of-Ownership Without Disclosure  
## A Privacy-Preserving, Bitcoin-Native System for Verifiable Collateral and Persistent Attestation

---

## 1. Introduction

Bitcoin’s core innovation is that it enables direct ownership and transfer of value without intermediaries. However, in its default form, Bitcoin’s transparency and privacy properties create a paradox for certain use cases.

If you want to prove that you own Bitcoin:

- You can reveal an address or transaction output (UTXO) and let someone monitor it. This destroys your privacy forever for that address.
- Or you can refuse to reveal any address. This keeps your privacy intact, but the other party must take your claim on faith.

Neither is satisfying when trust must be established between parties who do not wish to reveal more than necessary.

There is currently **no Bitcoin-native primitive** that allows you to:

1. Prove you own a certain amount of Bitcoin **without revealing which coins you own**.
2. Provide that proof in a portable form that anyone can verify.
3. Allow that proof to remain valid until those coins are moved.
4. Let verifiers detect, without your further involvement, when the coins have been spent.

This document describes a system to achieve exactly that.

The design is:

- **Privacy-preserving** — No addresses, txids, or identifiable on-chain markers are revealed.
- **Portable** — A proof can be given to anyone and verified independently.
- **Persistent** — It remains valid until the underlying coins are moved.
- **Detectable** — A verifier can check, without asking you again, whether the coins are still unspent.

---

## 2. Problem Definition

When a party (the *Prover*) wants to demonstrate ownership of a certain value in Bitcoin to another party (the *Verifier*), several challenges arise:

- **Linkability**: Revealing an address ties it to the prover forever, enabling chain surveillance.
- **Persistence**: A proof must not only show ownership at a single point in time, but also enable detection if the coins move later.
- **Portability**: The proof should be verifiable without contacting the prover again.
- **Non-custodial**: The prover should never have to hand over control of the coins to make the proof.
- **Trust minimization**: The verifier should not have to trust a third party to vouch for the prover.

The core problem is to design a protocol where:

- The prover demonstrates control of coins meeting or exceeding a value threshold.
- The proof hides which coins they are.
- The verifier can later determine if those coins have been spent.

---

## 3. System Goals

Our design must meet the following goals:

1. **Ownership Proof Without Identification**  
   Show control over one or more UTXOs without revealing their identifiers.

2. **Value Proof**  
   Prove that the sum of the UTXOs meets or exceeds a public threshold.

3. **Live Verifiability**  
   Allow any verifier with the proof to re-verify at any time, using public blockchain data, without contacting the prover.

4. **Movement Detection**  
   If the coins are moved (spent), re-verification fails.

5. **Accessibility**  
   The system should not require running a full Bitcoin node for everyday users.

6. **Bitcoin-Native**  
   It should work entirely within current Bitcoin consensus rules — no changes to the protocol, no off-chain custodial assumptions.

---

## 4. Core Concepts

The design relies on three main cryptographic ideas:

1. **UTXO Set Accumulators**  
   A cryptographic commitment to the current Bitcoin UTXO set, updated every block, with short membership proofs for each UTXO.

2. **Zero-Knowledge Proofs (ZKPs)**  
   Proofs that you know a private key corresponding to a public key in the UTXO set, and that the associated value meets a threshold — without revealing the UTXO or the key.

3. **Updatable Proofs**  
   A structure that allows the proof to be refreshed as the blockchain grows, and fails when the UTXO is spent.

---

## 5. Detailed Methodology

### 5.1 UTXO Set Accumulators

An accumulator is a cryptographic data structure that commits to a large set of elements in a compact form.

- **Root**: A single hash or digest that commits to the entire set.
- **Membership Proof**: A small proof that a given element is in the set.
- **Updatable**: When the set changes (e.g., new block), the proof can be updated without re-downloading the entire set.

**Example: Utreexo**  
Utreexo represents the Bitcoin UTXO set as a forest of Merkle trees. Each block update changes the root; membership proofs can be updated with minimal data.

**Why we use it**:  
It allows us to prove “UTXO X is unspent” without revealing X, by combining the membership proof with zero-knowledge techniques.

---

### 5.2 Zero-Knowledge Proof Structure

We construct a ZKP circuit that proves the following:

1. The prover knows a secret key `x` such that `P = x·G` (Schnorr/secp256k1 relation).
2. There exists a UTXO `(P, v)` in the accumulator committed to by the public root.
3. The value `v` meets or exceeds a threshold `T`.
4. No information about `(P, v)` is revealed other than that it exists and meets the threshold.

The ZKP uses:

- **Pedersen Commitments** for the value: `C_v = v·G + r·H`  
  This hides `v` but allows range proofs.
- **Range/Threshold Proof**: Show that `v ≥ T` without revealing `v`.
- **Accumulator Membership Proof in ZK**: Prove that `(P, v)` is a member without revealing which member.

---

### 5.3 Proof Creation

Steps for the prover:

1. Identify UTXO(s) they wish to prove ownership of.
2. Obtain a membership proof for each UTXO from:
   - Their own node + accumulator indexer, or
   - A trust-minimized proof provider (see §8).
3. Construct a ZK proof:
   - Input: private key(s) for the UTXO(s), membership proof(s), value(s), random blinding factors.
   - Output: proof blob `π` and public parameters (threshold, accumulator root).
4. Share `π`, threshold, and block height with the verifier.

---

### 5.4 Verification

Steps for the verifier:

1. Obtain the accumulator root for the given block height from:
   - Their own node, or
   - Any public source they trust (cross-checkable).
2. Run `verifyZK(π, root, threshold)`.
3. If `true`, the prover controlled ≥ `threshold` BTC at that block height.

---

### 5.5 Ongoing Verification

The key property: the verifier can re-verify at any time.

1. Obtain the latest accumulator root.
2. Update the membership proof for the UTXO(s) using the updatable witness structure.
3. Run the same `verifyZK` check.
4. If it fails, the coins were spent.

---

### 5.6 Failure Modes

- **Coins Spent**: Proof update fails — verifier detects collateral is gone.
- **Stale Proof**: If proof isn’t refreshed (for example, in heartbeat mode), the verifier may assume liveness has failed.
- **Mismatched Roots**: Indicates a discrepancy between data sources — requires cross-checking.

---

## 6. Privacy Properties

The verifier never learns:

- Which address or UTXO is involved.
- The transaction history.
- Any exact value (if threshold-only mode is used).

The prover’s privacy is protected as long as:

- They don’t reuse the same key in identifiable ways elsewhere.
- They source membership proofs from providers without leaking identity.

---

## 7. Accessibility and Usability

Requiring every prover to run a full node with a custom accumulator indexer would kill adoption for non-technical users.

Instead, we support three modes:

### 7.1 Full Node Mode (Technical Users)

- Prover runs a Bitcoin full node with an accumulator indexer.
- Absolute trustlessness; all proofs generated locally.

### 7.2 Light Client Mode (SPV + Accumulator)

- Downloads block headers and accumulator updates.
- Can verify membership proofs without trusting a single provider.

### 7.3 Proof Service Mode

- Independent, redundant proof providers maintain full nodes and accumulators.
- Prover requests membership proof over an encrypted channel.
- Can query multiple providers and cross-check results.

This makes it possible to integrate into wallet software as a one-click action: “Generate Ownership Proof”.

---

## 8. Game Theory

Two main actors:

- **Prover**: Wants to prove ownership without revealing UTXO.
- **Verifier**: Wants assurance and to detect changes.

### Incentive Alignment

To keep both honest:

1. **Proof Expiry**: Proofs expire quickly; stale proofs are rejected.
2. **Heartbeat Updates**: Provers refresh proofs regularly to maintain liveness.
3. **Penalty Bonds**: Optionally, collateral is locked in a contract that penalizes movement before expiry.
4. **Vault Scripts**: Enforce a delay before spend to allow reaction.

---

## 9. Example Use Cases

### 9.1 Decentralized Reputation

Users can hold “reputation badges” showing they’ve maintained a certain level of collateral over time without revealing their holdings.

### 9.2 Anonymous Credit Markets

Borrowers can prove they meet collateral requirements for a loan without revealing their wallet.

### 9.3 DAO Governance

Participants prove stake without revealing addresses.

### 9.4 OTC Settlement Assurance

Before an over-the-counter trade, a party can prove they can settle the agreed amount without revealing the settlement address until execution.

---

## 10. Case Study: Mortgage Collateral

As one concrete scenario:

- A borrower wants to show a lender they have sufficient Bitcoin as collateral for a mortgage.
- The borrower generates an ownership proof with threshold equal to the required collateral.
- The lender verifies it and monitors it over time.
- If the proof fails, the lender can trigger contractual responses.

This is not the primary use case, but illustrates the concept in a familiar setting.

---

## 11. Risks and Limitations

- **Proof Reuse**: The same coins could back multiple commitments; market-level controls are needed.
- **Proof Provider Trust**: Mitigated by redundancy and cross-checking.
- **User Privacy Leaks**: Users must avoid correlating UTXOs with known identities.

---

## 12. Implementation Plan

1. **Accumulator Service**: Deploy Utreexo indexers.
2. **ZKP Circuit**: Implement in Halo2 or Plonkish.
3. **Light Client**: Build SPV-compatible verifier.
4. **Wallet Integration**: Add one-click proof generation.

---

## 13. Conclusion

This system enables Bitcoin holders to prove ownership of value without revealing their coins, while allowing ongoing verification and movement detection. It is privacy-preserving, non-custodial, and works within current Bitcoin consensus.

With wallet integration and independent proof services, it becomes accessible to everyday users, enabling new forms of trust and collateralization in Bitcoin without sacrificing privacy.

---

*Prove without revealing. Verify without surveilling.*

---
title: "OrangeCheck: A Simple Bitcoin Reputation You Can Verify Yourself"
description: "I just launched the OrangeCheck beta. It is a minimal, Bitcoin-first proof of skin in the game that you can verify locally. The initial badge is only the doorway. The real journey is an open protocol for auth, credit, and identity mechanics, plus a hosted verifier API, shareable badge embeds, and a Nostr overlay where a community can pressure test the idea."
pubDate: "2025-10-02"
tags: ["Bitcoin", "OrangeCheck", "reputation", "BIP-322", "Nostr"]
repository: "Xaxis/randoblog"
repositoryUrl: "https://github.com/Xaxis/randoblog/blob/main/src/content/blog/xaxis-orangecheck-bitcoin-reputation-introduction/index.md"
draft: false
---

I just shipped the beta of OrangeCheck. It is tiny on purpose. Sign one canonical message with a Bitcoin address you control. Anyone can verify it and compute two numbers from public chain data: how many sats you have bonded to that address and how long they have stayed unspent. That is it. No accounts. No custody. No trusted server in the middle telling you what to believe. If you want to see it, the demo is live here at [https://ochk.io](https://ochk.io) and the protocol lives at [https://github.com/orangecheck/oc-protocol](https://github.com/orangecheck/oc-protocol).

I am not pretending this solves reputation in one go. It is a doorway. A primitive. A simple proof that says: I control this key and I actually have some skin in the game right now. From that small truth, a lot opens up.

Let me explain what I built, why I built it this way, where I want to take it, and how I think Nostr can be the first playground to shake it apart and make it better.

## The simplest possible move

If you have been in Bitcoin long enough, you know how messy identity and reputation get online. Usernames are easy to fake. Screenshots lie. Centralized reputation is a leaderboard you rent until the platform bans you or changes the rules. I wanted a primitive that did not rely on a platform. I wanted something that rides only on Bitcoin facts and a signature you can check yourself.

So OrangeCheck starts with a human readable message. Seven fixed lines. Line endings are defined. There is a required trailing newline. There is a short list of optional extensions that live inside the signed text. You sign that text with your wallet. Modern wallets can use BIP-322, which works for any script type. If someone is stuck on older tooling, legacy signmessage exists for old P2PKH. The point is that the signature is verifiable without my server involved. Then the verifier fetches confirmed and unspent UTXOs for that address and computes two values. Bond. Streak. How many sats and how many days unspent. Those two feed a small score function. The score has a version number so it can change without breaking the protocol.

That is the primitive. Nothing fancy. You can check the signature locally. You can recompute the numbers locally. You can ignore my website and still verify a claim.

Why so minimal. Because I want this to be boring and reliable. Because I want you to be able to carry it anywhere without asking for permission. Because the more opinionated I make the product, the less portable it becomes. OrangeCheck should be a tiny receipt of stake and time, not a walled garden.

## What the beta includes

The beta is a clean path from idea to badge. You paste an address. You add an identity hint if you want one. The app shows you the canonical text. Your wallet signs it. The app verifies the signature and pulls UTXOs to compute bond and streak. You get a compact badge and a link that anyone can click to watch the verification happen. You can embed the image anywhere or just post the link.

Under the hood, the beta is biased toward modern signing. It prefers BIP-322. The canonical text enforces strict formatting so two different verifiers will reach the same verdict. Optional fields let you bind the proof to a site origin or set an expiry window. The address should be fresh for privacy. If you spend the UTXOs, your bond goes to zero and your streak resets. That is part of the honesty of it. You cannot fake time without keeping those sats sitting there.

I built it this way because I want a shared mental model that is easy to reason about. No confusion about what is being measured. No guesswork about how the score was computed. You can read the text. You can check the math. If you do not like the score, you can run your own score function. The protocol does not care.

## This is an exploratory space

A lot of people will immediately jump to complicated use cases. They are valid. Risk models. Credit lines. Tiered access to communities. Marketplaces with limits based on stake or streak. Anti-bot measures for forums and APIs. Dynamic pricing for services. Write access to feeds that only unlocks if you have been bonded for a month. It is a wide surface.

The trick is to resist bloating the primitive. The badge is a hinge. It opens a door between anonymous keys and higher trust interactions, without doxing your life. The next steps should be modules and services that build on top, not extra rules packed into the core.

So, yes, I plan to push beyond a simple badge. But I want to do it with boundaries, and with versioning that preserves old proofs. I want to keep the signed text stable for a whole version window. I want scoring to be versioned separately. I want extension keys to be registered and documented, not invented ad hoc by every app. That is what makes this composable for more than one site.

## Where I want to take it next

Three directions are obvious.

First, a hosted verifier API. Developers should be able to send a message, signature, and address to a simple endpoint and get back a clear result with bond, streak, and a labeled score version. No secrets required. No lock-in. This would sit next to the open protocol, not replace it. The API lets sites verify without building indexing and explorer logic themselves. You should also be able to self-host it or run a light client that hits your own node.

Second, badge hosting and embeds. Right now you can export images and share links. I want first class, cacheable, signed SVGs that include a verify link and render well in any theme. I want a tiny web component you can drop into a page that verifies on intersection and exposes some CSS variables for styling. If you run a community, you should be able to paste a single tag and get a live badge. If you are posting to a profile, the share card should look clean without needing a whole guide.

Third, an opinionated set of best practices for privacy and reliability. Multi explorer quorum so one endpoint does not become a single point of failure. A default confirmation depth. Clear time source rules. Obvious warnings when you are reusing addresses. Error codes that are human friendly. These are not glamorous features, but they keep the thing honest in the rough parts of the internet.

## Why this matters for auth, credit, and identity mechanics

The core is about proof of control and proof of ongoing commitment. That maps nicely to authorization and risk. If I am running an API, maybe I let any key in but I rate limit anonymous users and lift the ceiling for keys that carry a minimum bond. If the bond stays unspent for 30 days, maybe you get a higher tier that includes write access to a public index. If you spend the bond tomorrow, your tier decays. No support ticket. No paperwork. The on-chain truth updates the trust level.

For credit, I am not promising underwriting. I am saying that time and stake are input signals that are hard to fake. If you see a key that has kept 0.1 BTC parked for a year, that does not tell you who the person is, but it tells you something about discipline and time preference. It tells you that this is not a throwaway account. Combine that with application specific behavior and you can design carrots and gates that are not just vibes.

For identity, this sits between anon and KYC. Sometimes you do not want a passport. You just want a reason to believe that an account is persistent and carries consequence. That is what OrangeCheck is trying to give you. It is not a social graph. It is not a dossier. It is a receipt of skin in the game. Pair it with your own logic.

## Nostr as the first proving ground

Nostr makes this interesting because it already has a grammar for identity and badges. NIP-05 gives you a way to map a pubkey to a human readable handle using DNS. NIP-58 defines how to publish badge definitions and award badges to pubkeys. Clients already display them in profiles. There is also NIP-98 for authenticating HTTP requests with signed Nostr events, and NIP-46 for remote signing. In other words, the universe is ready for a small proof to slide in at the edges.

Here is what I want to try with the Nostr community.

Publish an OrangeCheck badge definition that says something like Bond at least X sats for at least Y days, computed by the open score v0 rules. When someone presents a valid verify link, award the badge to their pubkey. Let clients display it under profile badges like any other. I want this to be opt in and clean. No scraping. No backroom registry. You present a proof. The network can see the proof. You get a badge.

Also, put the verify URL inside a small Nostr event so it can be previewed in clients. If a client wants to, it can call the verifier API, cache the result for a short window, and show a tiny checkmark with the computed numbers. If the user spends their UTXOs and the bond goes to zero, the client will reflect that on the next refresh. Honest dynamism.

And for service operators on Nostr, use NIP-98 to secure the API and rate limits, and optionally use OrangeCheck to tier access without moving to custodial accounts. Your pubkey proves who you are. Your OrangeCheck proves you have some stake and time in the mix. Together, that gives you enough room to run a community that is less brittle without hiring a trust and safety department.

I like Nostr for this because the ethos matches. Small parts. Plain text. Signatures. No single authority. If there is a place for a Bitcoin native reputation primitive to evolve in the open, it is there.

## What I still need to tighten

I need to publish conformance fixtures. Small, medium, and extensions heavy canonical messages. Known signatures. Known UTXO sets. Expected outputs. A tiny reference verifier that anyone can run to check their implementation. This is the boring work that makes interoperability real.

I need a wallet support matrix that is honest about BIP-322 coverage and legacy behavior. I can do clever things in the UI to guide people to the right path based on their address type, but docs matter. People should know what to expect from Sparrow, Electrum, Specter, and others. Also, yes, I want to contribute back where I can to improve message signing ergonomics.

I need to write the threat model clearly. Spoofed verify links. Explorer poisoning. Parameter smuggling if someone ignores the rule that extensions live inside the signed text. Reorg behavior. I have notes in the spec, but I need a straight ahead doc that lives next to the repo and that products can crib from for their own reviews.

I need to be opinionated about time and confirmations. It is not enough to say days unspent. I should say what clock drives that and what minimum confirmations a verifier should respect before declaring a bond confirmed. This is also where a multi explorer quorum matters to reduce single source weirdness.

And finally, I need to keep the message format stable for v0 while I iterate on product. The message format is the bedrock. The site will change. The API will change. The extensions list may grow. But the v0 header and the seven core lines need to remain exactly the same until v1. That is what keeps proofs evergreen.

## What I want from you

Try it. Try the demo. If you have a wallet that does BIP-322, use that. If you are stuck with legacy signmessage, use an old P2PKH address and understand the caveats. Generate a fresh address for privacy. Sign the text. Watch the verification happen. If something feels off, tell me. If something breaks, file an issue on the repo.

If you run a forum, an API, or a client, consider where a tiny proof of stake and time could make your abuse controls less punishing and your honest users less throttled. I am not asking you to rebuild your trust model. I am asking you to add one more input that is hard to fake.

If you are active on Nostr, help me pressure test the badge flow. I want to get the spec right and I want to make it easy for clients to show the proof in a way that is readable and lightweight. If you maintain a client and you want a tiny verify component, I will ship it.

If you are a wallet developer, talk to me about BIP-322 messaging and UX. The more natural we make message signing, the more accessible any proof scheme becomes. OrangeCheck does not work if signing a message is a scavenger hunt.

## Where this could go if we keep it small

A lot of good systems start as a small, boring part. If OrangeCheck stays small, it has a chance to become a utility that blends into many corners. A marketplace can require a minimum score to list high value items. A research community can gate write access to lower spam while staying open to new users. A Bitcoin education site can use streak to unlock advanced lessons without asking for identity. An open source project can use bond to raise rate limits for API calls. All without a shared database of user records.

There is a version of this that turns into a centralized reputation company. I have no interest in building that. I want a protocol and a reference implementation that anyone can reuse. I want a public API that is convenient but not required. I want people to host their own verifier if they want. I want more wallets to surface message signing as a first class feature so the whole pattern becomes normal.

If we do it right, the badge ends up boring but useful. The interesting parts happen when people chain it with their own context. That is the magic of Bitcoin. Simple pieces. Honest rules. Local verification.

## Thank you

Thank you to the folks who poked holes in early drafts. Thank you to everyone who sent wallet notes and explorer quirks. Thank you to the builders in the Nostr world who published open specs we can link into. This is still early. The beta is a start, not the finish. I will ship fixes and fixtures and better docs as fast as I can without breaking the versioning promises.

If you want to explore the guts, the repo is here: https://github.com/orangecheck/oc-protocol  
If you want to play, the site is here: https://ochk.io

Tell me what you build with it. Tell me what breaks. Tell me what is missing. And if you want to go deep on a specific integration or a new extension key, open an issue and let us draft it together. I want OrangeCheck to be useful where the Bitcoin community finds real utility, not just where I imagine it. That is the whole point of keeping it small and verifiable. We can reason about it. We can compose it. We can improve it in the open.

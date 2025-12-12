---
title: "Hide Bitcoin Keys in Plain Sight: DIY multisig with RF sentinels and real-time tamper pings"
description: "A practical, buildable plan for a self-custodial multisig that uses hidden geo-wallet sentinels to whisper encrypted status over unlicensed RF, warn on tamper, and keep you in control without putting signing keys online."
pubDate: "2025-09-01"
tags: ["bitcoin", "self custody", "multisig", "hardware", "RF", "privacy", "DIY"]
repository: "Xaxis/bitcoin-hide-keys-in-plain-sight"
repositoryUrl: "https://github.com/Xaxis/bitcoin-hide-keys-in-plain-sight"
draft: false
---

I like self custody that does more than sit on a shelf. I want situational awareness. I want to know if a cache moved, if a lid opened, if a battery dipped under the threshold. I want my wallet policy to be boring and robust, and my hardware to be quiet until I ask it to speak. Most of all, I want the parts to be DIY, swappable, and understandable with a multimeter and a weekend.

This is my blueprint for that system: a standard multisig you already trust, paired with hidden “geo-wallet” sentinels that report their state over short, encrypted bursts on unlicensed RF. The sentinels never carry a spend over the air. They do not leak seeds. They are boring little boxes that sleep most of the time, wake on tamper, and answer only to your challenge. Think of them as motion sensors for money.

No diagrams today. Just a clear overview of how it should work and how you can build it.

## The wallet policy that everything orbits

The safest way to get “real time control” without accidentally creating a hot wallet is to separate **spend authority** from **situational awareness**.

Use a conservative, well-supported policy like **3-of-5 multisig** with PSBTs and output descriptors. That gives you portability between coordinators, clean backups, and a healthy pool of hardware options. Now split those five keys across different trust surfaces:

- Two **fully air-gapped DIY signers** that never touch a network. This is where SeedSigner, Specter-DIY, or an ESP32-class signer makes sense. Different hardware, different firmware, different storage media.
- Two **hidden sentinels** in different physical locations. Each sentinel can either hold a cosigner key sealed behind a secure element or hold a Shamir share. I prefer the share model because it avoids in-place signing in the field.
- One **time-locked recovery key** that activates after a defined delay. If a sentinel is compromised, you can still spend with your two DIY signers plus this delayed path.

Your coordinator watches the UTXOs and labels where coins live. Spending stays offline. Awareness stays online. The two never cross.

## What “real-time control” means here

People hear “real time” and think remote signing. Hard pass. The control I want is **operational**:

- I can see that each hidden device is alive, charged, and inside its geofence.
- If someone opens a lid, moves a box, or peels epoxy, I get a tamper flag fast.
- I can query a specific sentinel at will using a short radio probe only I can generate.
- If a sentinel looks suspect, I change my signing quorum on the coordinator side and plan a deliberate sweep using keys that never went anywhere near that box.

That is control without risk. It is also practical to build at home.

## The hidden geo-wallet sentinel

Picture a small, weather-sealed enclosure the size of a paperback. Inside:

- A low-power microcontroller with deep sleep.
- A **secure element** that holds a device identity key and protects a wrapping key for anything sensitive at rest.
- A **GNSS module** with a simple geofence. No constant GPS streaming. Just a fence crossing interrupt.
- A **LoRa transceiver** for long-range, very low-bitrate, license-free telemetry.
- A handful of **tamper sensors**: accelerometer for shock and tilt, light sensor to notice a lid opening, a simple Hall switch for a hidden magnet latch.
- A battery with honest capacity, trickle charged if the cache spot allows light.

Most of the time the device does nothing. It sleeps. When a sensor interrupts, it wakes, prepares a tiny status frame, and sends a couple of encrypted beacons across a few channels. Then it goes back to sleep. On your schedule, it briefly listens for your challenge. If it hears your challenge and only your challenge, it replies with a short encrypted status: battery, last fence status, an incrementing counter, and a tamper bit.

No seed phrases are ever transmitted. No PSBTs over the air. If the sentinel holds a cosigner, it only signs when you physically attach to a service header and present an admin token in person. If the sentinel holds a share, you extract that share by QR or short serial when you are standing in front of it. The radio is strictly for awareness.

## Why LoRa, and why not ham bands

I want private, encrypted telemetry. Amateur radio bands forbid obscuring the meaning of a transmission. That rules out ham for this job. The unlicensed ISM band in the United States at 902 to 928 MHz is perfect for tiny, infrequent packets. LoRa gives you long range at the cost of throughput, which is exactly the trade I want. A status frame here is 16 to 24 bytes, maybe once every few hours, unless something is wrong.

We keep duty cycle extremely low. We use the lowest power that still works for the distances involved. We keep payloads short and boring. That makes the signal hard to notice and not worth chasing.

## How only you can find your boxes

A hidden device that beacons on a fixed schedule is easy to hunt. So do not do that. The trick is to make the sentinel predictable **only to you**.

Give each sentinel a **discovery seed** that never leaves your own brainspace and backups. Derive a daily schedule of brief receive windows and a per-packet channel list from that seed. The device turns on its receiver for a few hundred milliseconds at those times, listens, and then goes back to sleep if it hears nothing. An outsider cannot predict those windows without your seed. If someone spams the band at random, the device still ignores them, because the probe must carry a valid message authentication code the secure element can verify.

Your handheld probe uses the same seed to predict when and where to ping. You press a button. It transmits a tiny challenge on the right channel at the right moment. The sentinel hears it, verifies the MAC in hardware, and answers. If you are within range, you get a status overlay in a second. If you are not, you move and try again later. Quiet, deliberate, targeted.

## What the messages actually contain

A good rule for RF telemetry near money: send less, not more.

A normal heartbeat from a sentinel includes just enough to prove liveness and support a trend:

- A rolling counter so you can tell if you missed one.
- A battery level compressed to a byte.
- A geofence flag, not a full coordinate.
- A hash of the last self-test result.
- An authenticated timestamp to catch replay.

On tamper, the payload is the same, but the device sends two or three beacons across different channels in quick succession, then stops. That burst is your alarm. Your gateway verifies the cryptographic tag, logs the event, and pushes an alert to your phone or matrix room. The device does not stay chatty. The goal is to inform you, not carry on a conversation.

## Life with the system

Here is how this plays out in normal use.

You set up the wallet, generate descriptors, and label the UTXOs by policy. You put a modest balance behind the multisig and send a few test spends to shake out your PSBT flow.

You build two sentinels and cache them in places that make sense for your life. One might be close enough to pop in on foot. One might be far and quiet. You pot the area around the secure element and sensors, but you leave a hidden service header accessible if you someday need to reflash or extract a share in person. You set a small geofence radius that matches each stash.

At home, a small LoRa gateway sits near your node. It listens for frames, verifies the tags, and updates a tiny dashboard. A green dot means the last heartbeat arrived within its window and the battery is healthy. A yellow dot means the device is due for a visit soon. A red event means get moving.

When you want to spend, nothing about the radio network changes. You retrieve the PSBT on a safe path, present it to your DIY signers, and choose whether the third signature comes from visiting a sentinel to extract a share or from another signer you keep under your control. The radio is not part of the spend. It is part of your decision making.

If a box goes weird, you can immediately stop creating change that depends on it. You can switch to a quorum that excludes it. If your design uses a timelocked recovery key, you already have the sweep transactions templated for that path. It is boring, as it should be.

## Fieldcraft that matters more than code

The difference between a neat project and a resilient one is usually the physical layer.

Enclosures: use a fiberglass or polycarbonate case with a proper gasket. Conformal coat the board. Pot only the critical zones, not the entire interior, so you can service it later without a grinder. Add a tamper mesh tape under the lid so light plus mesh break gives you high confidence of opening. Mount the Hall sensor in a way that a casual peek breaks the field.

Power: pick a battery chemistry that matches the environment. LiFePO4 is boring and long lived. If there is sun where you stash it, a tiny panel and a real charge controller buy you years. If there is no sun, design for months between quiet check-ins. You do not need hourly heartbeats. You need predictability.

Antenna: do not get cute. A small, well-matched monopole inside a plastic case is fine. If the stash is buried, use a short pigtail to route the radiator up to where the soil thins. Bury cables as if you were hiding irrigation.

Placement: hide from people first, RF second. A spot where nobody goes beats a spot with perfect RF. You can always walk closer with your probe.

## What happens if someone steals a box

They get a sealed plastic brick with epoxy and sensors inside. If they move it, you already got a tamper burst. If they open it, light triggers another. If they try to power it up on a bench and hammer the radio, the device will not speak without your challenge. The secure element will not reveal keys. If you used a Shamir share model, there is nothing inside that can sign on its own. If you used a cosigner model, the firmware requires an in-person admin session to ever sign, and you planned your wallet so that box is never the critical third when it is out of your hands.

Meanwhile you are at home telling your coordinator to exclude that xpub from new change, and you are preparing a sweep that uses the remaining good keys. Annoying. Not catastrophic.

## Legal and social notes

Encrypted telemetry belongs on unlicensed ISM. Do not use amateur bands for this. Keep your duty cycle low, your power reasonable, and your payloads short. You are not building a tracker for your neighbor’s car. You are building a quiet status line for your own equipment.

And tell future-you where you put things. Record the discovery seeds and wallet descriptors with the same care you use for your BIP-39 material. Your radio probe without the seeds is just a random noise maker.

## Why this mixes well with today’s tools

The wallet side is intentionally conventional. PSBT and descriptors are mature. Coordinators like Sparrow and Specter understand them. Timelocked recovery flows are finally usable with Miniscript-aware wallets. All of this means you can build the radio layer without inventing a new spend model or waiting on a research wallet.

On the radio side, small LoRa dev boards are everywhere. ESP-class microcontrollers sip power and sleep well. Secure elements like the 608A give you simple attestation and key wrapping so you never need to roll your own crypto storage. GNSS modules have a basic fence GPIO that costs almost nothing to wire. If you have ever built a battery sensor that pings a base station, you can build this.

## What this system is not

It is not a remote signer. It is not cloud custody. It is not a GPS tracker streaming your coordinates all day. It is not perfect stealth. A persistent, well-equipped adversary can find almost anything that emits an RF photon. That is why the system talks rarely, quietly, and only when you ask. The rest of the security comes from the wallet policy and the simple fact that you kept spend authority offline.

## Where I would take it next

Once this baseline feels good, there are clean upgrades that do not change the philosophy. Silent receiving for donations to avoid address reuse. A better recovery script that slowly shifts spending power toward you over time if you do nothing. A handheld probe with an OLED that shows battery and tamper at a glance. Maybe a tiny audio chirp only you would notice if you are standing within a few meters.

The core idea stays the same. Coins behind boring, standard multisig. Hidden boxes that act like motion sensors for money. A private, low-duty-cycle radio link that lets you ask, quietly, if everything is still where you left it.

That is self custody I can live with. Quiet. Verifiable. DIY all the way down.

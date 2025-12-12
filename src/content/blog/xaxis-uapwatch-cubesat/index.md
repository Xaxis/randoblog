---
title: "UAPWatch: A Multisensor CubeSat Constellation for Anomalous Object Detection"
description: "A comprehensive open-science mission concept for detecting and characterizing unidentified anomalous phenomena in near-Earth space using a coordinated CubeSat constellation with optical, thermal, and radio sensing."
pubDate: "2025-08-15"
tags: ["UAP", "CubeSat", "small satellites", "space situational awareness", "multisensor fusion", "space exploration", "remote sensing", "optical tracking", "infrared astronomy", "radio astronomy", "AI in science", "open data", "space technology"]
repository: "Xaxis/uapwatch-cubesat"
repositoryUrl: "https://github.com/Xaxis/uapwatch-cubesat"
draft: false
---

# UAPWatch: A Multisensor CubeSat Constellation for Anomalous Object Detection  

## Preface

This document proposes a specific, buildable hardware and mission architecture for a small satellite constellation aimed at detecting, characterizing, and triangulating unidentified anomalous phenomena (UAP) in and near Earth orbit. It is written as an explanatory narrative rather than a checklist—because the problem demands more than a bill of materials. It asks for a way of thinking: a systems mindset that resists wishful speculation, embraces rigorous measurement, and turns ambiguity into evidence through layered sensing and careful inference.

The intent is not to adjudicate claims about UAP, nor to promise the impossible. Instead, the aim is to show how a carefully designed CubeSat-based system, fielded in sensible phases, can collect high-quality data that either explains curious observations or tightens the constraints around phenomena that remain unexplained. The value comes not from extraordinary claims but from ordinary engineering executed unusually well.

---

## 1. Why a Constellation—Not a Single Hero Satellite

The core challenge in UAP sensing is that the targets, by definition, are **non-cooperative**. They do not beacon their position, carry transponders, or honor your observing schedule. They can be transient, fast, dim, glinty, hot, cold, radio-quiet, or radio-loud. If you pick only one modality—say, visible imagery—you inherit its blind spots. If you rely on one spacecraft, you inherit single-point failure and poor geometry for range estimation.

Constellations change the geometry and the statistics. With multiple vantage points you obtain **parallax**, and with a bit of timing discipline you obtain **time difference of arrival (TDOA)** and **frequency difference of arrival (FDOA)** for radio emissions. With overlapping coverage, you test the **consistency** of a hypothesis across sensors and platforms. Constellations turn “I saw a streak” into “three platforms at known states saw a moving point whose fitted state vector implies a coherent 3D trajectory.” They allow a modest sensor to punch well above its weight.

The lesson is simple: one satellite gives you a picture; three give you a measurement.

---

## 2. Measurement Philosophy: Layered Evidence, Not Single Proofs

Deception in measurement arises when multiple explanations fit the same data. The antidote is **redundancy of explanation**: multiple independent channels that should agree if the phenomenon is real and disagree if it is a sensor artefact, a natural atmospheric transient, or a cataloged object. The UAPWatch architecture therefore insists on **three** primary lanes of evidence:

1. **Passive optics** (visible, high-speed, and event-based) to capture angular motion, photometric behavior, specular flashes, and occultations.
2. **Thermal infrared** to disambiguate reflectance from emission and to flag anomalous heat signatures or plume-like structures.
3. **Passive radio sensing** to detect emissions and derive geolocations through TDOA/FDOA across a small cluster.

Each lane is useful alone; together, they produce a joint posterior belief about what was seen. If two out of three lanes cohere and the third is ambiguous, you still have a strong case. If all three align, you can be confident. If they disagree in specific ways, you learn what your instruments are lying about.

---

## 3. A Realistic Mission Envelope

A mission that tries to do everything will never launch. The initial envelope must be disciplined.

- **Spatial scope:** near-Earth space, primarily low Earth orbit (LEO) from ~350 km to ~1,200 km altitude, with sensitivity to fast transients that may graze the upper atmosphere or cross LEO vantage lines. We explicitly do not claim cislunar tracking in phase one; we design in a path to it if radio geolocation targets are sufficiently strong.
- **Temporal scope:** continuous survey with bursty “cued” observations at high frame rates when a trigger fires. Schedule is not the master; triggers are.
- **Target behaviors:** bright or dim point-like movers, rapid angular accelerations, specular glints, brief stellar occultations, short-lived thermal signatures, impulsive or persistent RF emissions. We do not assume continuous signals; we design for sparse events.

By bounding scope we gain **testability**. We can stage a ground truth campaign—on known satellites, aircraft, meteors, and calibration beacons—and verify that our system behaves the way we claim before attributing words like “anomalous” to anything.

---

## 4. Spacecraft Classes: 12U Flagships and 6U Pickets

The constellation uses two satellite classes that share a common bus lineage: a **12U “flagship”** that carries the full multisensor payload, and a **6U “picket”** that focuses on wide-field optical/event sensing and timing. This division yields a good blend of capability and cost. The 12U has the power, volume, and thermal headroom for a narrow-field tracker and an LWIR camera alongside the wide-field optical sensors and SDR. The 6U picket broadens coverage, increases the parallax baseline, and improves the odds that at least one satellite catches the birth of a transient and distributes a cue to neighbors.

This asymmetry allows you to build **clusters**: a triad with one 12U flagship and two 6U pickets, separated along-track or cross-track by a few hundred kilometers. In each orbital plane you deploy one or two such clusters. Three planes—one sun-synchronous and two mid-inclination—yield global latitude diversity and varied lighting geometries.

The clusters act like a stereo camera with an extra eye: wide fields watch, thin fields pounce, radio ears listen, and clocks keep faith.

---

## 5. The Payload Story: Four Eyes, One Brain

The payload arrangement on the 12U flagship is a quilt of complementary strengths.

**Wide-field visible CMOS** sits behind a fast optic. Its job is to keep watch—always. Even at modest apertures, continuous imaging at 50–200 frames per second is practical with modern low-noise sensors if we narrow the bandwidth and perform on-chip windowing. This sensor finds streaks and points, tracks their centroids frame-to-frame, and extracts light curves. It feeds the onboard brain with a clean stream of compact “tracklets”—timestamps, angles, rates, photometric features—rather than raw frames, unless a threshold is crossed.

**Event-based (dynamic vision) sensing** lies beside it, co-boresighted. Event cameras do not read out frames; they emit microsecond timestamped “events” when a pixel’s brightness changes. This means they handle rapid motion and high dynamic range without blur and, crucially, at **orders of magnitude lower data rates** than traditional cameras for the same temporal fidelity. They shine at terminators, during glints, and in daylight where a conventional sensor would saturate or smear. Their sparse output allows real-time tracking of fast movers with minimal power and storage.

**A narrow-field tracker** occupies a short telescope—think 150–300 mm focal length, f/4 to f/6—paired with a high-frame-rate sensor. This eye is not always open. It wakes when cued by the wide-field/event sensors and stares hard at a small patch of sky to perform precision centroiding, jitter-compensated photometry, and morphological analysis of the target’s point spread function (PSF). If you need to estimate angular accelerations or detect non-gravitational motion, this is the eye you dispatch.

**Thermal infrared** closes the loop. An uncooled long-wave infrared microbolometer with a modest field of view provides temperature-contrast images. It is not a thermal sniper rifle; it is a reality check. If visible shows a glossy glint and thermal shows nothing above background, you tentatively infer reflectance. If thermal shows a plume-like structure or a hard hot-spot without visible correlation, you revisit your priors. The thermal channel also reveals thermal inertia; repeated looks can tell you whether a target retains heat between passes or lights up only under sun, which says something about its composition or activity.

All of this lands in **one brain**: a radiation-tolerant onboard computer augmented by a low-power AI accelerator and an FPGA fabric for real-time pixel/event reduction. The brain’s job is not to decide cosmic truths on orbit; it is to **filter, fuse, and prioritize**. The payload is a set of eyes; the brain decides which blinks matter.

---

## 6. Time Is the Secret Ingredient

A system that pretends to measure without trusting its clocks is a system that lies to itself. For multi-satellite geolocation and cross-satellite consistent kinematics, **time discipline** is everything. The constellation uses GNSS receivers to tie to absolute time and **chip-scale atomic clocks (CSACs)** aboard each satellite to ride through GNSS dropouts and to hold inter-satellite offsets to microseconds. That level of discipline makes TDOA geolocation feasible across hundreds of kilometers of baseline and allows precise alignment of optical/event detections between platforms.

Timing also underwrites **stellar occultation** techniques. If an otherwise featureless moving object briefly occludes a star, the dropout—in microseconds to milliseconds—imprints size and shape hints when combined with geometry. Event sensors are optimally suited here: they time-tag the edge transitions without frame blur. But occultation signatures are fragile; they demand trustworthy clocks and careful pipeline design.

The architecture treats the clock as a payload, not a housekeeping afterthought.

---

## 7. How Detection Actually Works (and Fails)

Consider the life of a single detection, from sky to disk.

The wide-field sensor picks up a faint streak against the star field—three consecutive frames show a point with consistent angular rate. The event sensor reports a flurry of events along the same path with a temporal signature consistent with motion rather than scintillation. The onboard pipeline runs a streak detector that is indifferent to orientation, projects a hypothesized track forward, and tests for continuation. On its own, this is nice but unremarkable—meteors, satellites, and aircraft do this all day.

Then something odd happens: the fitted angular acceleration deviates sharply from what a simple ballistic target at typical LEO distance would manifest, given the satellite’s own motion and the Earth’s gravity. Maybe the residuals aren’t huge—just enough to raise an eyebrow. The system raises a **cue**.

The narrow-field tracker spins, and the ADCS snaps to the predicted bearing. Within a second or two it’s locked and tracking at high frame rate. A refined centroid time series emerges, and the system computes a more accurate angular acceleration. Meanwhile the thermal camera grabs a handful of frames of the same patch, and the SDR opens its ears, sweeping preconfigured bands while the cluster mates do the same.

If a neighbor satellite already saw the same target a fraction of a second earlier, inter-satellite coordination shares tracklets and the ground can later reconstruct a **parallax solution**—the simplest way to turn angles into ranges. If the target radiates, the SDRs derive TDOA/FDOA and produce **geolocation ellipses**. If it does not radiate, you still have geometry in angle space.

Now we picture how this can fail. The false positives are legion: tumbling debris glinting like a disco ball. High-altitude aircraft with sun reflecting off contrails. Lightning sprites and transient luminous events that our event sensor loves but our pipeline misclassifies. Satellites you forgot to filter out because their TLEs were stale by a few days.

The defense is not a single clever trick. It is a gauntlet: catalog cross-checks; meteor shower correlation; lightning map correlation; requirement that non-cooperative tracks survive more than one instrument and, ideally, more than one platform; and the insistence on extracting **physically coherent kinematics**. If a three-body parallax solution places the object below you in the atmosphere but the light curve says it never dimmed through airmass like it should, something is off with your assumptions. Investigate. Fail fast. Tighten priors. Iterate.

---

## 8. The ADCS Compact: Pointing as a First-Class Payload

High-speed optical sensing tries to do two incompatible things: stare fast and stare steady. Reaction wheels and magnetorquers provide torque; star trackers provide absolute attitude; gyros bridge gaps; precision pointing controllers ensure the target stays within a few pixels of the predicted path under jitter and wheel zero-crossings.

On a 6U/12U platform, **attitude determination and control** is not an afterthought. It is the enabling technology. Sub-arcminute pointing, with controlled slews up to ~10 degrees per second, is within reach of flight-proven integrated ADCS units today. The payload design should assume **aggressive slew and settle** profiles and restrain the narrow-field tracker’s focal length to what the ADCS can hold. You are not building a Hubble; you are building a hunter.

A practical workflow: the wide-field/event pair maintain **body-fixed** pointing to simplify bias estimation; when a cue fires, the ADCS executes a short waypoint plan that brings the narrow-field tracker onto target while the wide-field sensors continue to monitor context. Slew budgets are guarded jealously—tracking a false positive is costly in opportunity. Therefore the onboard brain attaches a **value of information** score to each cue, balancing rarity, kinematic oddity, and geometry before committing limited pointing resources.

---

## 9. The Radio Ear: What to Listen For and Why

Not all targets will speak. But when they do, even in whispers, radio geolocation provides the cleanest geometry you can get without active radar. A small software-defined radio (SDR) front-end, digitizing in configurable bands from VHF through L-band and upward depending on front-end design, provides **energy detectors** for impulsive events, **cyclostationary detectors** for modulated carriers, and **spectrogram snapshots** for later forensics. The real prize is **synchrony across the cluster**: if three satellites see the same burst within microseconds of one another, TDOA defines a hyperboloid of possible origins for each pair, and their intersection converges toward a point or line. If the burst is long enough to resolve Doppler changes, FDOA adds another constraint.

The practical compromise is to **avoid continuous wideband recording**. It is data-suicide. Instead, the optical/event pipeline cues the SDR, and the SDR likewise can cue optics if it hears something odd. Cross-cueing is the secret sauce. The system does not presume that the most interesting targets are loud; it simply refuses to miss a chance to correlate channels when luck provides it.

As with optics, the enemy is the mundane: Earth-based emitters ducted through the ionosphere, reflections from known satellites, and plain old interference. The ground pipeline must maintain a library of expected interferers and a disciplined habit of **falsifying the interesting**.

---

## 10. The Orbit Conundrum: SSO and Friends

Orbits are compromises between geometry, lighting, power, and downlink constraints. A **sun-synchronous orbit (SSO)** at ~550–600 km is an attractive first plane. It yields stable lighting and long passes over polar ground stations and makes thermal control easier. SSO, however, tends to see the world at similar local times. Its predictability is both blessing and curse.

To break the degeneracy, add one or two **mid-inclination planes** between 45° and 60°. These planes experience different lighting conditions, yield different ground tracks, and—critically—offer different parallax directions on the same events when geometry cooperates. The baseline between satellites in a plane can be set by slight differences in mean motion and argument of latitude; the cross-plane baselines come for free.

Formation-keeping is performed with **differential drag** if propulsion is limited, augmented by small cold-gas or electric thrusters when the budget allows. You do not need centimeter-accurate formation to produce useful TDOA; you need to **know** where you are and when you were there. If you can maintain in-plane separations of a few hundred kilometers and cross-plane separations of a few hundred to a thousand, your geometry for RF and parallax becomes rich.

---

## 11. The Ground Segment: Where Boring Makes You Brilliant

It is fashionable to fetishize the spacecraft. The truth is that the **ground segment**—the software pipeline, the archives, the calibration regime, the operator tools—is where a mission lives or dies. UAPWatch’s ground pipeline should be opinionated about **provenance**: every detection carries a chain of custody from raw instrument readings through each transformation, with parameter snapshots so that reprocessing under new algorithms is possible years later. This is not bureaucracy; it is how you get better.

The pipeline fuses optical/event/thermal/RF channels into a **unified event record**. It performs catalog matches against up-to-date orbital elements; consults meteor shower predictions; overlays lightning, sprite, and ionospheric activity maps; and computes posterior probabilities over a taxonomy of outcomes: *known satellite/debris*, *meteor/bolide*, *aircraft/contrail*, *atmospheric transient*, *instrumental*, and *candidate anomaly*. The taxonomy matters less than the discipline: never label what you can’t exclude; never exclude what you didn’t test.

Your dashboards should show not only pretty sky pictures but **residual plots**, timing offsets, GDOP maps, and the confidence ellipses of any geolocation. The operators should be empowered to tag events not just as “interesting” but as “likely mundane because…,” feeding an **active learning loop** that improves the onboard filters.

Finally, the ground is where **open science** happens. Publish event records with enough metadata for independent analysis, subject to licensing constraints. Invite replication, not applause.

---

## 12. The Regulatory Thread: Do It Right the First Time

Even small satellites must obey real rules. Optical and thermal imaging from orbit touches **remote sensing regulations** in several jurisdictions. In the United States, that puts you under NOAA’s Commercial Remote Sensing Regulatory Affairs (CRSRA) licensing regime. Radio emissions and reception fall under **FCC Part 25** for space stations and the associated Earth stations. International coordination flows through **ITU filings** managed by your national administration.

Paperwork seems orthogonal to discovery, but in fact it disciplines your system. Licensing forces you to articulate **what you will sense, how you will store it, whom you will share with**, and how you will mitigate debris. Embrace it as part of the engineering. Build privacy and safety considerations into your architecture rather than bolting them on.

---

## 13. Phased Development: From Balloon to Cluster

No one should believe a mission whose first milestone is a launch campaign. The path to orbit begins **beneath the atmosphere**.

- **Phase 0: Ground + Stratosphere.** Put your wide-field, event-based, and thermal sensors on tripods, then on stabilized mounts, then on a balloon. Track aircraft, satellites, and meteors. Validate the trigger pipeline. Demonstrate stellar occultation sensing by recording commercial satellites crossing dense star fields. Prove that your data products are useful without space magic.
  
- **Phase 1: Single-Sat Tech Demo (6U).** Fly the wide-field + event pair with disciplined timing. Show that you can produce high-fidelity tracklets, trigger the narrow-field experiment (even if simulated in software), and downlink prioritized “postage stamp” imagery. Demonstrate autonomy: the satellite decides when to spend pointing budget.

- **Phase 2: Triad Cluster (one 12U + two 6U).** Add the thermal camera and the SDR. Demonstrate **cross-satellite parallax** on cooperative targets. Run **TDOA/FDOA** exercises on known emitters. The goal is to close the **geometry loop**: angles + time + frequency become position and motion in 3D.

- **Phase 3: Three-Plane Constellation (9–12 sats).** Globalize coverage. Refine false-positive filtering by cross-modality coincidence. Publish the first **open catalog** of anomaly candidates with uncertainty budgets, and solicit independent re-analysis.

At each phase, the success criterion is not a glossy video. It is a **validated metric**: centroid error distributions, timing stability, detection probability at a given SNR, geolocation accuracy as a function of baseline and burst length. If you hit your metrics on mundane targets, you’ve earned the right to claim an anomaly when the world offers one.

---

## 14. Data Economy: When Less Is More

Raw pixels are intoxicating. They are also a liability in power, storage, and downlink. The architecture bakes in **data thrift** without sacrificing science. Event cameras generate inherently sparse data. Wide-field sensors run **windowed readouts** and **rolling subframes** around predicted tracks. The narrow-field tracker stores **short bursts** at high bit depth rather than hours of emptiness. The thermal camera captures **few-shot confirmations** around optical detections. The SDR records **spectral bursts** with carefully chosen pre- and post-trigger buffers.

Onboard, the brain computes **salient features**: track curvature, jerk, glint periodicity, photometric color proxies from dual-band filters, thermal contrast statistics, and RF modulation fingerprints. These features are downlinked alongside a handful of **postage stamps**: small cutouts of the raw data around the event, sufficient for independent verification without saturating the link.

This is not an austerity program; it is a design stance: transmit what is informative, not what is voluminous.

---

## 15. False Positives: An Honest Catalog of Things That Will Trick You

A responsible proposal names the gremlins aloud.

- **Glints from tumbling debris** will look uncanny in visible light. Their periodicity gives them away if you look for it; their absence in thermal helps.
- **High-altitude aircraft** can masquerade as fast movers when viewed from LEO, especially when contrails create bright linear features. Parallax and ADS-B correlation (for cooperative aircraft) eliminate most of these.
- **Meteors/bolides** produce gorgeous event signatures and sometimes thermal wakes. Their atmospheric deceleration profile and radiant match observations from meteor networks. If you treat meteors as a calibration target rather than a nuisance, you will become a better anomaly hunter.
- **Sprites and other transient luminous events** tickle event sensors and may produce radio sferics. Their morphology and ground-based lightning data are your defense.
- **Ionospheric ducting and reflections** can displace RF geolocation dramatically. Learning to distrust easy TDOA solutions over ocean when HF/VHF is in play is part of the craft.
- **Catalogue staleness** is the oldest trap. If your TLEs are stale or your propagator is subpar, your “unknown” is often a “known poorly tracked.” Build TLE hygiene into your daily routine.
- **Instrumental ghosts** lurk in hot pixels, rolling shutter artifacts, and ADCS micro-vibrations. Lab and balloon time is how you learn your instrument’s personality and subtract it from your brain before flight.

You won’t eliminate false positives. You will **domesticate** them—turning surprises into checklists, and checklists into software.

---

## 16. Ethics and Openness: Owning the Uncertainty

There is a temptation in anomaly hunting to adopt an adversarial posture: to treat skepticism as hostility and openness as risk. The better posture is humility. Publish detections with calibrated uncertainty. Share your classifiers and your misclassifications. Invite duplication and, yes, refutation. The worst-case outcome of a serious UAP observation program should be a set of **useful space situational awareness tools**, better meteor science, and a community of practice that knows how to do **high-integrity smallsat sensing**.

If something genuinely strange persists after you have exhausted the mundane, the community will be poised to understand it, not merely to marvel at it. A data commons built on solid provenance makes that possible.

---

## 17. Systems Engineering Details (Told as a Story of Constraints)

A 12U spacecraft presents you with about 20 kg of mass and a handful of liters of volume distributed among payloads, avionics, power, propulsion, and thermal. Every cubic centimeter is borrowed from something else. The **optical train** wants dark space, baffling, and rigidity. The **thermal camera** wants a clean radiative view and a stable temperature. The **SDR** wants RF hygiene, away from noisy digital systems and harmonics from switching converters. The **star tracker** begs for an unobstructed view far from stray light.

You, as the architect, become a choreographer of compromises. You place the wide-field optic and the event sensor along a common boresight and mount the narrow-field tracker on a stiff optical bench angled to avoid mutual vignetting. You route the SDR’s RF front end with discipline, place filters close to the feed, and ensure the digital back end is shielded. You carve a clean field for the star tracker, even if it means a minor redesign of a solar panel edge.

Power is a similar dance. High-frame-rate imaging spikes current. Reaction wheels gulp power during slews. Downlinks in X-band are thirsty. You keep a **power schedule** that anticipates triggers: when the onboard brain detects a likely event, it pre-conditions the power rails for the slew and downlink that may follow. Between events, you sleep sensors, but not so deeply that wake-up latency costs you the first second of a transient.

Thermal control is not glamorous until it ruins you. Fast optics and sensors disgorge heat. The microbolometer prefers a stable temperature. The ADCS star tracker hates gradients. You design **thermal paths** that carry heat to radiators without compromising structural stiffness, and you perform **thermal-structural coupled analysis** to ensure that a warm narrow-field tube won’t misalign your focus by three arcminutes when you need it most.

In short: every subsystem is a jealous god. Your job is to keep them at peace.

---

## 18. A Concrete Reference Build (v1.0)

To anchor the narrative, here’s a coherent reference configuration for the **12U flagship**, expressed descriptively rather than as a parts list:

- A compact 12U aluminum structure with a stiff optical bench running along the long axis. Two instrument ports share a common boresight: a fast wide-field lens feeding a radiation-tolerant global-shutter CMOS sensor, and an event-based sensor behind a matched field lens. A side-mounted short refractor (f/4 to f/6, 150–300 mm) holds the narrow-field tracker, its focus motor thermally isolated from the tube. Opposite sits a small LWIR camera with a moderate field, looking out through a baffled window.

- The **attitude control** is handled by an integrated unit with reaction wheels, torque rods, gyros, and a star tracker, with a forward-mounted star tracker for redundancy and improved sky access. Thrusters are optional in v1; formation-keeping relies first on differential drag.

- The **brain** is a radiation-tolerant computer-on-module mounted near the optical bench to minimize cable lengths to sensors, paired with a low-power AI accelerator for on-the-fly tracklet extraction and novelty scoring. An FPGA mezzanine ingests the event stream and runs real-time filters at microsecond granularity.

- The **radio ear** is an SDR connected to configurable front-ends; it sits on the RF island of the bus, its analog parts shielded and grounded with care. A low-phase-noise clock tree distributes disciplined time from a GNSS receiver and a CSAC; the 1-PPS winds its way to the SDR, the event sensor, and the camera triggers.

- The **comms** subsystem uses S-band for TT&C and X-band for data dumps, with a modest X-band patch or small deployable antenna mounted on a face with clear sky access during typical downlink passes. A power system sized for the worst-case event window provides sufficient bus capacity that the satellite doesn’t brown out during a thrill of activity.

This is a telescope that can turn its head, with a clock that refuses to lie, and a brain that knows when to care.

---

## 19. Cost and Schedule Without the Fairy Dust

A plausible first cluster—one 12U and two 6U satellites—can be developed for a small-team budget in the low tens of millions of dollars, inclusive of design, build, test, launch, and early operations, if you reuse heritage bus components and focus your custom work on the payload and software. The true long pole is **people time**, not sensor price. Your schedule will be set by how fast you can iterate Phase 0 and Phase 1, not by lead times on optics.

The critical path runs through software integration, ADCS-payload coordination, and regulatory approvals. None of these are solved by throwing money; they are solved by **clear interfaces**, **short feedback loops**, and **ruthless de-scoping** when a “nice to have” threatens your launch date. Flight is a harsh teacher; go sooner with a kernel of capability and expand in Phase 2.

---

## 20. How We Measure Success (and Avoid Self-Deception)

Declare victory only against metrics you declare now:

- **Pointing performance** as measured by on-orbit star field tests and centroid stability under slew.  
- **Detection probability** versus target SNR for wide-field, event-based, and narrow-field channels.  
- **Timing stability** across the constellation under GNSS dropouts, measured by inter-satellite calibration experiments.  
- **Geolocation accuracy** by TDOA/FDOA against cooperative beacons with known positions.  
- **False-positive rate** before and after cross-modality filtering on a catalog of known “tricksters.”  
- **Downlink efficiency** in bits per interesting event.

Make these metrics public. Invite independent teams to design tests that you commit to run. The point of this mission is not to look smart. It is to become correct.

---

## 21. Extensions: What We Might Add After We Prove the Basics

Once the core architecture is fielded, a handful of improvements suggest themselves.

- **Polarimetry** in the visible bands can distinguish surface materials and scattering mechanisms, and may reveal orientation changes in tumbling objects. A compact micropolarizer array or rotating element can be integrated with moderate effort.

- **Short-wave infrared (SWIR)** expands sensitivity to different thermal regimes and can be done with small sensors, though cooling budgets complicate matters.

- **Inter-satellite links**—even low-rate—can turn the cluster into a tightly coupled sensor network, allowing real-time **cooperative tracking** and a more graceful handoff between platforms.

- **Cislunar awareness** becomes a viable stretch goal when radio targets are strong and baselines long. This requires different orbital planes and higher gain antennas, but the algorithms are cousins of what you will already have proven.

Add only what your Phase 1/2 results justify. The fastest way to ruin a clean architecture is to gild its edges before its heart is beating.

---

## 22. Community and Collaboration: Turning a Mission Into a Movement

A UAP data program that hoards its findings in a proprietary vault will win headlines and lose history. The better course is to embrace **open data and community calibration**. Publish **event catalogs** with sky coordinates, times, instrument states, and uncertainty estimates. Release **simulated datasets** that mirror your real ones so that students and independent researchers can build tooling without waiting on flywheels to spin. Organize **cross-calibration campaigns** with radar, optical observatories, and amateur astronomers. Make it easy for skeptics to reproduce your analysis pipeline and to find your mistakes. If the world corrects you, thank it publicly and iterate.

In parallel, work with universities and labs on **algorithm challenges**: event detection at low SNR, occultation inference, multi-sensor fusion under missing data, and residual-based anomaly ranking. The challenges should have ground-truthed answers drawn from your Phase 0/1 campaigns and must be designed so that winning solutions transfer to flight software with minimal surgery.

A constellation becomes credible when a constellation of people cares about it.

---

## 23. The Narrative You Can Share With Non-Specialists

If you need a simple story to explain to an interested public what you are doing, tell them this:

> “We put small telescopes and radio ears into orbit and taught them to work as a team. Most of what they see will be ordinary—the stuff of satellites, meteors, and lightning. But sometimes, for a few seconds, the world offers something odd. When that happens, we want to be looking from more than one place, in more than one way, with clocks we trust and software that remembers what it did. If it turns out to be familiar after all, that’s good; we learned how to be less easily fooled. If it stays strange, we will have the right kind of evidence: clear, cross-checked, and shared. That’s how knowledge grows.”

This is a mission about **curiosity with discipline**.

---

## 24. Risk Register (Told Plainly)

Some risks deserve names:

- **ADCS underperforms**: Your narrow-field tracker smears and your centroiding goes soft. Mitigation: conservative focal lengths, extensive lab characterization, and balloon tests that mimic jitter spectra.

- **Event camera immaturity**: Space environment surprises you; radiation upsets or fixed-pattern quirks contaminate streams. Mitigation: redundancy with conventional sensors; FPGA filters that detect and scrub pathological patterns; bake-offs during Phase 0.

- **Clock drift**: TDOA solutions degrade silently. Mitigation: aggressive inter-satellite calibration, on-orbit time transfer experiments, and continuous monitoring of timing residuals against known emitters.

- **RF interference**: The real RF world is noisier than your lab. Mitigation: band plans that avoid the worst culprits; notch filters; ground-side subtractors that model persistent offenders.

- **Data pipeline overload**: Operators drown in events. Mitigation: robust novelty scoring and strict downlink prioritization; accept that you will miss some events and design for **graceful misses** rather than catastrophic buffer overflows.

- **Regulatory delays**: Paperwork slips your launch. Mitigation: early engagement, explicit documentation, fallbacks for payload modes that can be disabled if required.

A risk named is a risk halved. A risk mitigated is a teacher paid.

---

## 25. A Worked Example: From Streak to State Vector

Let’s dramatize a detection with numbers omitted and logic intact.

At 03:14:08 UTC, the wide-field sensor aboard Plane A, Cluster 1 catches a faint, two-pixel streak moving east-to-west at roughly 0.8 degrees per second. The event sensor reports a dense cloud of microsecond events aligned to the same vector. The onboard brain fits a constant-velocity model and predicts a continuation. The next two frames agree; the residuals are low.

A small deviation in the third second triggers a curiosity score: the angular rate decreases faster than predicted for a target at common LEO range under the satellite’s own motion. Not definitive—could be the satellite’s pointing drift—but large enough to merit escalation. The narrow-field tracker is cued; the ADCS slews.

Two seconds later, the tracker is locked, and at 500 frames per second a crisp centroid appears. Simultaneously, the thermal camera snaps three images. Nothing sharp emerges in thermal above noise, but that is expected at this range and size. No RF emission is detected in the default bands.

Meanwhile, a 6U picket in the same plane, ~450 km behind, saw the same object 2.7 seconds later and shares a tracklet through the downlink on the next pass. A third satellite in a different plane catches the tail end of the event at high angle. The ground pipeline fuses the three angle tracks and computes a parallax solution that places the object near the upper atmosphere at ~95 km altitude, descending at a shallow angle with deceleration consistent with a meteor grazing event. The light curve shows a rise and a flare. The morphology suggests ablation. Case closed: a beautiful meteor, not an anomaly. The data is precious anyway; it improves the pipeline.

Had the parallax placed the object well above the atmosphere with inconsistent deceleration and absent thermal, and had later catalog cross-checks not matched any satellite track, the event would have been promoted to **candidate anomaly**, subject to re-observation on subsequent orbits. The logic is the same; the labels differ.

---

## 26. A Note on What We Deliberately Did Not Include

You may ask: where is the space-based radar, the big dish, the laser ranging, the hyperspectral cube, the interplanetary ambitions? They are intentionally absent from phase one. Active radar at useful ranges wants power and aperture beyond a 12U budget, except in narrow scientific modes. Hyperspectral imaging is wonderful but punishingly expensive in photon budget and data rate, and would be wasted if your pointing and timing are not yet bulletproof. Lasers introduce safety and regulatory burdens that are orthogonal to the core objective.

We leave these for later because prudence is a superpower. Early ambition ferments late regret.

---

## 27. What Success Looks Like in a Year

Twelve months after project kickoff, a plausible success story reads like this:

- The team has flown a balloon campaign that produced dozens of clean aircraft, meteor, and satellite detections with cross-validated event and visible channels, including a few stellar occultations with convincing edge timing.

- A 6U tech demo launched and has been in orbit for three months, producing thousands of tracklets, event signatures, and a handful of gorgeous narrow-field bursts on cues. The onboard novelty score correlates well with operator judgments. The downlink carries mostly features and postage stamps; the bit budget is healthy.

- The regulatory filings for the triad are approved; the thermal camera and SDR have passed space qualification tests; the CSAC timing discipline is validated by inter-satellite tests against a ground truth beacon.

- The ground pipeline has matured into a modest **open data portal** with simulated datasets, real anonymized event records, and a living list of known false-positive types with examples. An external student team has already improved the streak detector and donated code back.

No headlines are required. Only momentum.

---

## 28. Conclusion: A Modest Machine for Honest Seeing

UAPWatch is a small machine aimed at a large question. Its novelty is not in any single sensor or slogan but in the **composition**: a tight braid of visible, event-based, thermal, and radio sensing; a fetish for time; and a respect for geometry. It is sober on power, ruthless on data, and humble about what it can and cannot know. It sees better because it knows how it sees.

If the world offers you only meteors, you will make good meteor science. If it offers you an uncooperative visitor with peculiar behavior, you will have the right instruments to notice, the right teammates to corroborate, and the right records to convince. That is all a measurement system can promise—and it is enough.

Launch, learn, and let the sky teach you.

---

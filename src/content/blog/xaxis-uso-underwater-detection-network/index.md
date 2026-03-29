---
title: "The Ocean Layer: A Distributed Underwater Sensor Network for Anomalous Submerged Object Detection"
description: "The UAP detection stack has a ground layer and a space layer. The ocean, covering 71 percent of Earth's surface and the setting of some of the most credible anomalous reports on record, is completely dark to both. This article proposes a practical, citizen-buildable distributed hydrophone and magnetometer mooring network for detecting and characterizing unidentified submerged objects, integrated with the existing air and orbital detection stack through time-correlated multi-modal event fusion."
pubDate: "2026-03-29"
tags: ["UAP", "USO", "underwater", "hydrophone", "SOFAR", "citizen science", "multi-sensor", "magnetometer", "AUV", "open data", "CTBTO"]
repository: "Xaxis/randoblog"
repositoryUrl: "https://github.com/Xaxis/randoblog/blob/main/src/content/blog/xaxis-uso-underwater-detection-network/index.md"
draft: false
---

The UAP detection stack I have proposed so far has two layers. One sits on the ground: a distributed network of citizen-science honeypot nodes emitting distinctive gamma, infrared, and RF signatures while listening with every modality we can mount on a drone mast. The other sits in low Earth orbit: a CubeSat constellation tracking kinematics, thermal signatures, and radio emissions from above the atmosphere. Between those two layers, the air is covered reasonably well. The ocean is not covered at all.

That is a significant gap. The ocean covers 71 percent of Earth's surface. More importantly, a disproportionate share of high-credibility UAP reports involve water. The 2004 Nimitz encounter took place over the Pacific 60 miles southwest of San Diego. The 2019 USS Omaha footage showed a spherical object entering the water. Declassified AATIP documents reference dozens of reports describing objects that transition seamlessly between air and water, or that were tracked acoustically by submarine crews. The term USO (Unidentified Submerged Object) has been in the vocabulary of naval intelligence for decades.

The ocean is not just a geographical gap. It is a physics-rich medium with sensing properties that are completely different from air. Acoustic anomalies propagate globally through the SOFAR channel, the deep sound channel formed by the ocean's pressure and temperature gradient, where sound velocity reaches a minimum and energy refracts back toward the axis rather than dispersing in all directions. Low-frequency sound injected into the SOFAR channel can be detected thousands of kilometers away. The ocean already has a global listening infrastructure. We have just never asked it the right questions.

## What is already in the water

The Comprehensive Nuclear-Test-Ban Treaty Organization runs an International Monitoring System that includes eleven hydroacoustic stations positioned around the globe, with six using hydrophone arrays anchored in the water column and five using seismoacoustic sensors on islands. These stations monitor for the acoustic signatures of underwater nuclear explosions, which means they are tuned for transients, they log continuously, and they have been running since the late 1990s. The raw waveform data is archived and portions of it are accessible to qualified researchers.

Before that, the United States Navy operated the Sound Surveillance System, SOSUS, a Cold War-era network of bottom-mounted hydrophone arrays spanning the North Atlantic and Pacific. SOSUS was used to track Soviet submarines. Parts of it have been repurposed for marine mammal and seismic research under the name IUSS, and some of that data flows through academic channels.

Both networks were designed to detect things we understood: submarines, nuclear tests, earthquakes, and volcanic eruptions. Nobody optimized them for what we do not understand. That is not a criticism of the network operators. It is an opportunity.

## What anomalous underwater propulsion would actually sound like

Before you can look for something, you need a physical model of what it produces.

A conventional submarine at operational speed generates noise through three main channels: propeller cavitation, machinery vibration transmitted through the hull, and hydrodynamic flow over the hull surface. These produce a characteristic signature with tonal line components from rotating machinery, cavitation broadband noise peaking in the few-hundred-hertz range, and low-frequency structural modes. Naval sonar operators spend careers learning these fingerprints.

What would a craft operating outside those propulsion physics produce? A craft moving through seawater at high speed without cavitation has to either manage the pressure boundary at its surface to suppress bubble formation, envelope itself in a gas layer through supercavitation, or, in the case that demands the most serious attention, modify the fluid coupling at its boundary in a way we do not currently have a model for. The first two have analogues in known engineering. The acoustic signature of a supercavitating object differs from a conventionally propelled one: reduced propeller line components, replaced by a continuous broadband hiss from the gas-water interface at the object's nose.

The case that would genuinely force a rethink is a craft moving fast and silently, with no cavitation, no machinery noise, and no flow turbulence. That would produce a pressure wave from water displacement and little else. The acoustic signature would look like a moving point source of very low-amplitude broadband noise, identifiable by its Doppler shift sweeping across a hydrophone array. The kinematic profile (speed, depth, maneuver rates) is what would flag it as anomalous, not the raw sound level. A track with the Doppler signature of something moving at `200 knots` at `300 meters` depth with no correlated surface contact and no known submarine in the area is not a whale, and it is not a geological event.

Magnetic signatures add a second independent channel. Seawater is conductive. A moving magnetized body or a body carrying anomalous current loops induces eddy currents in the surrounding water, producing a detectable field perturbation at range. A SQUID-based magnetic anomaly detector can sense variations in the ambient field at the femtotesla level. The Navy uses towed magnetic anomaly detectors for exactly this class of detection against submarines. The same physics applies to any anomalous moving mass with a significant magnetic moment.

The important point is that neither the acoustic nor the magnetic channel requires you to know the propulsion mechanism in advance. You are looking for kinematic inconsistency in acoustic tracks and for magnetic perturbations with no correlated known source. Both channels are mechanism-agnostic. That is the right design posture when you do not know what you are looking for.

## A citizen-buildable deep mooring node

The CTBTO and SOSUS exist, and they are not ours to retask. So we build our own, at smaller scale but aimed at the specific physics we care about.

A practical citizen mooring node starts with an anchor weight holding a tethered subsurface float at a chosen depth, typically `50 to 300 meters` depending on site geometry and local SOFAR axis depth. The float houses a pressure-tolerant electronics enclosure with the following payload:

- A three-element hydrophone array with `10 cm` baseline spacing, giving directional sensitivity at frequencies above roughly `500 Hz`. Bandwidth from `10 Hz` to `20 kHz`. Self-noise at or below sea state zero, which means roughly $-25\ \text{dB re}\ 1\ \mu\text{Pa}^2/\text{Hz}$.
- A three-axis fluxgate magnetometer at `1 nT` baseline sensitivity. If budget allows, an optically pumped cesium vapor magnetometer pushes that to the picotesla range and adds three orders of magnitude in sensitivity for detecting the eddy-current wake of a passing object.
- A precision pressure sensor for depth verification and infrasound coupling.
- A MEMS IMU to track platform motion. This is non-negotiable. Tether-induced sway mimics very convincingly the Doppler signature of a slow-moving contact. You cannot separate genuine acoustic events from platform self-noise without a high-sample-rate motion record running in parallel.
- A GPS-disciplined acoustic modem for time synchronization. Time tagging to better than `1 millisecond` is essential for any triangulation between nodes. Without it you have bearings. With it you have geometry.

The surface component is a small solar-charged buoy carrying an `Iridium 9603N` short-burst data transceiver. The mooring node pushes feature vectors and event triggers topside over an acoustic modem link. Full waveform data buffers on local SSD and gets retrieved on scheduled uplink windows or on event cue. The architecture is the same push-sparse-pull-rich discipline the CubeSat constellation uses: transmit what is informative, not what is voluminous.

Per-node cost in quantity is achievable below `USD 8,000` using commercial hydrophone elements from manufacturers like `Benthowave` or `DolphinEar Professional`, a `Teledyne Benthos` or `EvoLogics` acoustic modem, and a `Raspberry Pi`-class compute node running inside a `Subconn`-connector-sealed housing rated to `300 meters`.

## Mobile characterization with AUVs

A mooring node tells you that something passed by and gives you a bearing and approximate range. It does not close the distance and characterize at short range. That is the job of the mobile layer.

The autonomous underwater vehicle is the underwater analog of the free-flight UAS in the ground network. A `REMUS 100`, a `Bluefin-9`, or an `Iver3` in the `50 to 100 cm` class can be programmed with a waypoint plan triggered by an acoustic cue from a mooring node. A node that detects an anomalous track broadcasts a cue on the modem channel. An AUV in a pre-positioned holding pattern prosecutes the bearing within its endurance radius. Range is limited; these platforms run `four to eight hours` at `three to five knots`, and they carry their own hydrophone, camera, and magnetometer. A close-approach characterization at a `20 to 50 meter` standoff produces fundamentally different data quality than a distant mooring detection. If the target is still present and has any magnetic signature or acoustic output at short range, the AUV finds it.

This is more expensive than the drone analog in the surface network. A `REMUS 100` is not a DJI Mavic. But the principle is identical to what the CubeSat constellation does with its narrow-field tracker: the wide-field sensor detects and cues, and the close-in asset commits resources only when the cue survives the initial quality filter.

## Cross-correlating with the layers above

The real value of the underwater layer is not what it detects in isolation. It is what it confirms in correlation with the ground and orbital layers.

A trans-medium event (an object that enters water, transits underwater, and re-emerges) produces a simultaneous signature in both layers. The surface honeypot node sees a radar return and optical event at water entry. The mooring node below sees the acoustic and magnetic signature of the entry transient and the subsequent submerged track. The time-delta between the surface event and the first acoustic detection at the node, corrected for the local sound speed profile, gives depth and bearing. Two mooring nodes give a full three-dimensional track in the water column. A match between that track and a surface radar track with the correct geometry is the multi-modal coherence signature that moves a report from curious to compelling.

That discipline, requiring coherence across physically separate, independent sensing layers before escalating a detection, is the same standard the CubeSat constellation requires before labeling anything a candidate anomaly. One instrument gives you a picture. Two physically separated instruments in different media give you a measurement.

If a track survives that cross-layer test, meaning an optical and radar event at the surface matched to an acoustic and magnetic track below with no correlated ship or submarine contact in the maritime domain awareness picture, the explanation space shrinks very quickly. You are not looking at a weather balloon. You are not looking at a whale. You are looking at something that entered the water and moved through it, and you have independent geometry from two physical domains to anchor that claim.

## What a null result proves

If you deploy a network of nodes in historically active zones (the Puerto Rico Trench, the Catalina Channel, the coast of Baja California) and run them for a year and find nothing that survives the cross-correlation gauntlet, that is a meaningful result. It means either the ocean reports are noise, or the phenomena avoid the sensing geometry, or the physical signatures fall below the detection floor of the network as built. All three outcomes are informative. The second and third give you a design target for the next iteration. The first gives you something more valuable: a closed door.

Either way you have done real science, because you built an instrument with a characterized sensitivity and a defined statistical threshold, you ran it in the right place, and you published the outcome. That is more than any anecdotal report ever produced.

The ocean is not empty of data. It has been recording for decades through its own infrastructure, and it will keep recording whether we ask useful questions of it or not. The only thing missing is a network pointed at the right phenomena with the right physics in mind. The mooring node described here is not a grand project. It is a weekend build, an Iridium subscription, and the patience to leave something in the water long enough to catch something worth seeing. The detection architecture is already proven. The physics is clear. The gap in the coverage stack is embarrassingly obvious once you look at it from the right angle, and gaps that obvious have a way of being worth closing.

/* Single source of truth for the projects listed on /about and indexed by the
   site search. Adding an entry here puts it in both places. */

export type Project = {
  name: string;
  url: string;
  category: 'Bitcoin' | 'AI' | 'Hardware' | 'Space' | 'Tools';
  tags: string[];
  blurb: string;
  featured?: boolean;
  /** Span both columns without the "New" badge, so the grid closes evenly. */
  wide?: boolean;
};

export const projects: Project[] = [
  {
    name: 'airship.diy',
    url: 'https://airship.diy',
    category: 'Hardware',
    tags: ['Aerostatics', 'Open hardware', 'Solar'],
    featured: true,
    blurb:
      'An open engineering notebook for the smallest hydrogen airship a competent person could build in a shop and then never land. The physics is gated against ships that actually flew: the buoyancy model reproduces the Hindenburg and the Macon to within 2 percent, which is also how it establishes that gas purity is a first-order term rather than a refinement. Energy turns out not to be the binding constraint (the solar loop closes with a 539 percent annual margin, and lift makeup is under 2 percent of demand). Structure is, and phase 3 remains undecided, which the notebook says out loud instead of rendering around.',
  },
  {
    name: 'nband.space',
    url: 'https://nband.space',
    category: 'Hardware',
    tags: ['Sensing', 'Open hardware', 'UAP'],
    featured: true,
    blurb:
      'An open multi-spectral sensing platform. A buildable node that watches the sky across as many as thirteen bands at once, disciplines its clock against GNSS to a few hundred nanoseconds so cross-band coincidence is a measurement rather than a figure of speech, and publishes everything it records. The top of the classification ladder is "unresolved". The schema has no way to encode "artificial", and that is deliberate.',
  },
  {
    name: 'oapogee.space',
    url: 'https://oapogee.space',
    category: 'Hardware',
    tags: ['Telemetry', 'Rocketry', 'Open hardware'],
    featured: true,
    blurb:
      'An open source telemetry payload for model rockets, and the documentation that teaches you to build one. Altitude, acceleration and orientation logged to onboard flash through a flight, optionally downlinked over LoRa with GNSS position for recovery. One rule governs the whole project: never publish a number that has not been measured or sourced. Which is why the bill of materials currently has no prices in it.',
  },
  {
    name: 'manta.flights',
    url: 'https://manta.flights',
    category: 'Hardware',
    tags: ['Aerodynamics', 'Deployable structures', 'Flight dynamics'],
    blurb:
      'A rigid carbon wing that unfolds off a pilot\'s back in about 0.6 seconds, where the pilot is the fuselage and nine bistable ribs per side unroll from 11 mm coils. The analysis keeps overruling the brief: best glide came back at 16 m/s rather than the 25 it assumed, and deployment symmetry misses its 10 ms gate at 16.3 ms, which retires the passive pneumatic sequencing the whole design was built around.',
  },
  {
    name: 'ochk.io',
    url: 'https://ochk.io',
    category: 'Bitcoin',
    tags: ['Proof of reserves', 'Signatures'],
    blurb:
      'OrangeCheck: a Bitcoin-native proof of skin in the game. Sign a message with an address you control and anyone can verify your bonded sats and how long they have sat, straight from public chain data. No accounts, no custody, nothing to trust.',
  },
  {
    name: 'btcar.app',
    url: 'https://btcar.app',
    category: 'Bitcoin',
    tags: ['AR', 'On-device OCR'],
    blurb:
      'Point your camera at any price tag and see its Bitcoin value in place. Real-time OCR with an AR overlay, all processing on-device. Nothing leaves the phone.',
  },
  {
    name: 'hodl.pub',
    url: 'https://hodl.pub',
    category: 'Bitcoin',
    tags: ['Self-custody', 'Monetary theory'],
    blurb:
      '100 Bitcoin rules to live by. Self-custody, operational security, monetary philosophy, and the ideological foundations of money nobody can print.',
  },
  {
    name: 'atypic.ai',
    url: 'https://atypic.ai',
    category: 'AI',
    tags: ['Agents', 'Enterprise'],
    blurb:
      'Managed AI agent automations for enterprise. Deployment and operation at scale, handled end to end, so large organizations can automate complex workflows without standing up the infrastructure themselves.',
  },
  {
    name: 'sentio.bot',
    url: 'https://sentio.bot',
    category: 'AI',
    tags: ['Consciousness', '3D simulation'],
    blurb:
      'A 3D interactive simulation for modeling consciousness. Adjust information integration and self-referential processing and watch how the resulting scores move across different systems.',
  },
  {
    name: 'job.rip',
    url: 'https://job.rip',
    category: 'AI',
    tags: ['Satire', 'Labor'],
    blurb:
      'A satirical "AI Labor Transition Authority" that performs career autopsies on your job title. Enter your profession, receive a darkly comedic report on how the machines intend to replace you. The joke has aged worse than expected.',
  },
  {
    name: 'apophis.bot',
    url: 'https://apophis.bot',
    category: 'Space',
    tags: ['Orbital mechanics', '3D'],
    blurb:
      'An interactive 3D orbital simulator for asteroid 99942 Apophis, built around the 2029 close approach that threads the needle between Earth and the geostationary belt.',
  },
  {
    name: 'onon.me',
    url: 'https://onon.me',
    category: 'Tools',
    tags: ['Local-first', 'Privacy'],
    blurb:
      'A private, local-first personal vault. Tag, save, and organize fragments of thought without handing your data to anyone. Everything stays on your device.',
  },
  {
    name: 'brickworks.diy',
    url: 'https://brickworks.diy',
    category: 'Tools',
    tags: ['CAD', 'LDraw', 'Browser-based'],
    blurb:
      'A browser-based LEGO design tool that takes the dimensions literally. Every placement snaps to a 2 LDU lattice where 1 LDU is exactly 0.4 mm, so collisions are computed rather than approximated and a model reproduces brick for brick. 28,319 parts across 322 colors, stability checks for joints carrying more than their studs hold, and export to LDraw with a shopping list by lot.',
  },
  {
    name: 'globb.bot',
    url: 'https://globb.bot',
    category: 'Tools',
    tags: ['Canvas', 'Generative'],
    wide: true,
    blurb:
      'A canvas-based interactive visualization. Best experienced rather than explained.',
  },
];

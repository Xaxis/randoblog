---
title: "Basement Hash, Warm Apartment: A Forced-Air First Build for a Juneau 5-plex"
description: "A complete, practical plan to launch a small Bitcoin mine that heats a basement apartment with ducted forced air, routes excess to the roof, and uses smart controls to keep everyone comfortable while you cover the power bill."
pubDate: "2025-10-09"
tags: ["bitcoin mining", "home mining", "forced air", "heat reuse", "Juneau", "HVAC", "ROI"]
repository: "Xaxis/randoblog"
repositoryUrl: "https://github.com/Xaxis/randoblog/blob/main/src/content/blog/xaxis-basement-bitcoin-hash-plan/index.md"
draft: false
---

I am going to start with a constraint and treat it like a feature. First iteration is forced air. No immersion yet. No hydronic loop yet. We will take hot air off efficient miners, push it into the basement apartment through real ductwork, and if we have more heat than the room can absorb we will send the extra up and out the roof cleanly. The controls matter. The noise profile matters. The airflow math matters. If we do those right, we get a warm apartment, a safer electrical install, and a mining system that feels like a quiet appliance instead of a leaf blower in a closet.

This is the design I would actually build in a Juneau 5-unit. It starts small, stays modular, and leaves doors open for future upgrades.

---

## What we are building in phase one

- One to three modern air-cooled miners in a dedicated closet or mechanical nook.
- A sealed, filtered intake from the basement ambient air or a small outside make-up air duct with damper (if possible).
- A short, insulated supply trunk that feeds the basement apartment with controllable flow.
- An insulated roof exhaust line with a backdraft damper, rain cap, and an inline muffler section.
- A simple control layer that decides whether heat goes to the room, the roof, or both. It also manages miner fan curves and underclocking so we do not overshoot comfort or noise.

_The underlying goal is just good airflow and a clean control loop._

---

## Hardware, power, and the airflow target

Pick from the two workhorses:

- Antminer S21 around 200 TH at roughly 3.5 kW, efficiency near 17 to 18 J per TH.
- Whatsminer M60S around 185 TH at roughly 3.4 kW, efficiency near 18 to 19 J per TH.

Each air miner pushes a surprising amount of air. Treat one as a 3 to 4 kW electric heater with a fan. Three miners will behave like a small furnace. That could be perfect for a basement apartment.

For airflow planning we do not need perfect spec sheets. Here is the practical target:

- Per miner planning airflow: 220 to 260 CFM through the chassis at typical fan curves.
- Static pressure tolerance is low. Keep ducts short, smooth, and wide. Six inch round minimum on each branch. Eight inch round on shared runs with two or three miners. Long runs or multiple elbows will force the miner fans to scream.

---

## The forced-air topology

Imagine a tee right after the miner plenum. One leg goes to the apartment. The other goes up to the roof. A pair of motorized dampers decides which leg gets how much air. A simple controller reads the apartment thermostat, the miner outlet temperature, and the closet temperature. It makes three decisions:

1) Shove almost everything to the room until the room hits setpoint.
2) Once the room is satisfied, split flow and underclock the miners to a quieter profile.
3) If the room is warm and the closet is getting hot or humid, dump to the roof at full damper and let the miners idle or pause.

All these controls can be implemented with a cheap microcontroller and two dampers can do this with one page of logic.

---

## Controls overview

You need three sensors and two actuators to start.

- Sensors: room temperature in the apartment, miner exhaust temperature in the plenum, closet temperature and humidity.
- Actuators: two motorized round dampers, one on the room branch and one on the roof branch. Optional third actuator for a make-up air damper if we end up drawing from outside.

Add a smart outlet or a relay on each miner for emergency cut and for night quiet hours if noise levels demands it. Firmware underclocking handles normal throttling. A simple script can move frequency and fan targets in response to room demand.

I like a small ESP32 based board running a tiny web UI. Or if we want to go simple, a pair of off-the-shelf HVAC zone controllers will do it. Thermostat calls to W1 energize the room damper open and park the roof damper mostly closed. Satisfied room flips the dampers and the miners drop to a lower fan curve.

### Control table

| State | Room Temp vs Setpoint | Closet Temp | Action on Dampers | Miner Profile | Notes |
|---|---|---|---|---|---|
| Heat Priority | Below | Normal | Room damper open 90 to 100 percent. Roof damper cracked 0 to 10 percent. | Full hash or mid hash. Fans normal. | Fast warmup. Good comfort. |
| Hold | At setpoint | Normal | Room at 30 to 50 percent. Roof at 50 to 70 percent. | Underclock. Fan low. | Quiet and steady. |
| Dump | Above | High | Roof open 90 to 100 percent. Room nearly closed. | Underclock or pause. | Prevents overheating the closet. |
| Quiet Hour | Any | Any | Room as above. Roof as needed. | Low fixed fan and low hash. | Lease friendly. |
| Fault | Any | High or sensor fault | Roof full open. Power relays off. | Off. | Safe default. |

The whole point is to make the miner behave like a furnace with zoning instead of a box that either roasts the room or howls into the night.

---

## The ductwork

Short, smooth, and insulated. That is the entire philosophy.

- Use rigid round metal wherever you can. Smooth walls beat flex by a mile for noise and static loss.
- Keep elbows to a minimum. When you must turn, use long radius fittings.
- Every joint gets foil tape and screws. Then wrap in R-4 to R-8 insulation to avoid condensation and to keep noise inside the pipe.
- Put a real backdraft damper under the roof cap so wind gusts cannot push cold air back toward the miners.
- Add an inline acoustic section on the roof leg. A simple lined box or a purpose built muffler will likely soften the fan harmonics far more than one might expect.
- On the room leg, consider a short plenum box with an internal baffle before the supply grille. That will knock out the last bit of fan tone that sneaks through a straight run.

---

## Filtration and make-up air

Salt and moisture are bad. We should not pull foggy outdoor air into a hot miner and expect long fan life.

- If we draw intake air from the basement hallway, put a MERV 8 to 11 filter frame on the closet door or on the intake duct. Change filters on a real schedule.
- If we draw make-up air from outside, use a short, downward facing hood with a bug screen and a damper that only opens when needed. Keep that run short and insulated. The goal is to avoid pulling cold fog directly into the miners. Mix it with hallway air first if we can.

---

## Electrical and noise reality

Treat each miner as a continuous load on a dedicated 240 V circuit (if possible?). Size conductors and breakers with the usual 125 percent rule for continuous loads. Install a subpanel if planning for two or three units. Label everything. Put a smoke detector with an interlock in the closet. Mount miners on rubber isolation feet. The little ring of neoprene under each chassis is the difference between a quiet hum and a resonant drone that drives everyone crazy.

---

## What goes where

- **Closet:** miners on a rack, intake filter frame, temperature and humidity sensor, smoke and water leak sensor, subpanel, ESP32 control box or zone controller, two round dampers on the supply tee, access to swap filters and pull a unit.
- **Room branch:** short run, one or two quiet supply grilles at low level, a thermostat the tenant can actually use.
- **Roof branch:** insulated run to cap, backdraft damper, acoustic section, cleanout access.
- **Optional intake branch:** small outside duct with motorized damper, mixed with hallway air in the closet so we do not shock the miners with fog.

---

## Bill of materials for the first build

| Category | Item | Qty | Notes |
|---|---|---:|---|
| Miners | S21 or M60S | 1 to 3 | Buy with a real warranty. |
| Power | 240 V circuit parts | per miner | Dedicated run. Continuous load sizing. |
| Rack | Shelf or rail kit | 1 | Keep miners off the floor. |
| Filtration | MERV 8 to 11 filter frame | 1 | On intake to the closet. |
| Duct | 6 in or 8 in round rigid, elbows, tees | as needed | Keep runs short. Long radius elbows. |
| Dampers | 24 V round motorized | 2 | One for room leg, one for roof leg. |
| Mufflers | Inline acoustic section | 1 | On the roof leg. |
| Insulation | R-4 to R-8 wrap and foil tape | as needed | For all duct runs. |
| Sensors | Temp, humidity, smoke, leak | 1 set | Closet and plenum. |
| Controls | ESP32 or zone controller | 1 | Web UI or off the shelf HVAC logic. |
| Safety | Backdraft damper, roof cap, flashing | 1 set | Weather tight. |
| Misc | Rubber isolation feet, screws, sealant | many | Peace with tenants. |

---

## Pools, payout, and coin selling technicals

For a small fleet the right answer is boring. Join a large, reputable pool that pays on FPPS or PPS plus fees. Set weekly payouts. Auto sell just enough to cover the power bill plus a small maintenance reserve. Keep the rest in BTC. If we less zero thinking, set a fixed percentage split on arrival so a portion turns into dollars automatically and the remainder stays as coin.

---

## Heat math for the basement apartment

A miner that draws 3.5 kW produces that much heat in the room. That is 84 kWh of heat per day. Three miners are 252 kWh of heat per day. A typical basement apartment in a damp coastal climate can soak up a lot of that if we let the air circulate and not blast it into one corner.

We will not always need full heat. The control loop above is what keeps the space comfortable. It is fine to throw extra heat to the roof in the shoulder hours. The mega win is winter hours when that heat replaces oil or resistance electric. That is when the miner is goes into boost mode and really starts paying for itself.

---

## The first winter

- Default to heating the room until the thermostat is happy. That makes the miner feel like a quiet furnace to the tenant.
- Hold temp with underclocked profiles. There is no trophy for running 100 percent if 60 percent maintains comfort. Underclocking is the cheapest silencer if noise is a problem.
- Experiment with dumping excess heat to the hallways otherwise out through the roof. 
- Clean filters once a month. Check sensor readings. Log power and payouts weekly. Keep a simple dashboard.

---

## Simple monthly accounting

- Pool payout arrives once a week. Automation skims the utility amount into dollars. A small percentage goes to a maintenance wallet. Remainder stays as BTC.
- Track three things on one sheet. kWh from the submeter. BTC mined from the pool API. Average room temperature from the thermostat log. That is enough to prove heat reuse and to push a fair heat credit into any split model.
---

## Safety that is not negotiable

- Smoke detector in the closet with an interlock that drops power to the miners and opens the roof damper.
- Water leak sensor on the floor that does the same.
- Thermal limit on the plenum that forces a roof dump if the exhaust temperature exceeds your comfort envelope.
- Proper roof flashing and a cap that sheds real rain. Though I think this is already done.

---

## A realistic cost snapshot

You can build a clean forced-air first phase for less than you think, and you can do it without cutting corners.

| Bucket | Low | High | Notes |
|---|---:|---:|---|
| One miner with warranty | 2,600 | 4,200 | S21 or M60S pricing moves with market. |
| Electrical per miner | 250 | 600 | Dedicated 240 V circuit, parts, labor. |
| Ducts, dampers, muffler, insulation | 500 | 1,200 | Depends on run length and fittings. |
| Controls and sensors | 120 | 350 | ESP32 or zone controller, probes, relays. |
| Filtration and closet work | 120 | 300 | Filter frame, door work, sealants. |

Two to three miners scale mostly linearly on electrical and dampers. The roof run is one time. The controller is one time. That is why a second or third unit often makes the economics feel better as long as we can use the heat.

---

## Month by month plan

Month 1. One miner. One clean duct to the apartment. One duct to the roof with real dampers. FPPS pool. Weekly auto sell to cover power. Minimal underclocking at night. Listen for noise. Adjust baffling until the fan tone disappears.

Month 2. Add a second miner if the room wants more heat or if you want redundancy at lower per-unit fan curves. Bring the controller online fully. Tune the damper splits so the room gets priority without overshoot.

Month 3. Make-up air needed. If the closet is going negative and pulling door gaps hard, add a small outside intake with a motorized damper that opens only when both dampers are sending air to the roof.

Months 4 to 6. Decide if a third miner makes sense for the deepest winter weeks. If yes, add it now while we still have time to observe behavior in cold weather.

Spring. If the apartment does not need much heat, let the roof branch carry more and underclock to a quiet profile. Consider whether DHW preheat in a future phase would let you keep more of your watts working in summer.

---

# Investment cost basis, standard expenses, and ROI scenarios

This is the cash spine for the forced-air first build. It covers one-time costs, recurring costs, how to value the heat, and simple payback bands so we can say yes or no with a little less guess work.

> Assumptions we can can swap:
> - Miner class: 200 TH unit at ~3.5 kW
> - Forced-air distribution as designed above
> - Heating season: ~210 days
> - Power plan for steady 24 by 7 load uses your demand-style rate if available
> - Heating oil value: 6.60 per gallon, 85 percent furnace efficiency
> - If baseline heat is resistance electric, value heat as kWh avoided times your actual cents per kWh
> - If baseline heat is heat pump, divide the electric heat credit by your seasonal COP

## One-time investment for phase one

| Item | Unit Cost | Qty | Subtotal | Notes |
|---|---:|---:|---:|---|
| Miner (S21 or M60S class) | 2,600 to 4,200 | 1 to 3 | 2,600 to 12,600 | Buy with real warranty |
| 240 V circuit per miner | 250 to 600 | 1 to 3 | 250 to 1,800 | Continuous load sizing, dedicated run |
| Ducts, dampers, muffler, insulation | 500 to 1,200 | 1 set | 500 to 1,200 | Roof run is one time |
| Controls and sensors | 120 to 350 | 1 | 120 to 350 | ESP32 or zone controller, probes, relays |
| Filtration and closet work | 120 to 300 | 1 | 120 to 300 | Filter frame, sealing, misc hardware |

**Typical all-in:**
- **One miner:** ~3,400 to 5,000
- **Three miners:** ~10,100 to 13,200 (controller and roof run shared)

## Recurring winter costs

Rule of thumb at 3.5 kW per miner:
- Energy per miner per month ~ 3.5 × 24 × 30 = **2,520 kWh**
- If we get a demand-style residential plan for steady loads, the all-in usually beats the simple energy-only plan for this application

**Daily power cost anchor for ROI math below**
- **One miner:** ~6.73 per day
- **Three miners:** ~19.43 per day

_(TODO: These are representative. Replace with actual bill math.)_

## Heat credit in winter (propane)

Per miner heat output: **84 kWh/day = 286,608 BTU/day**.  

Useful BTU per gallon of propane at 90%: **~82,350 BTU/gal**.  

Three miners: **~10.44 gal/day**.

**Heat credit by propane price** (pick the column that matches actual delivered price):

| Fleet | Gallons/day | Credit @ \$3.50 | Credit @ \$4.50 | Credit @ \$5.50 |
|---|---:|---:|---:|---:|
| 1 miner | 3.48 | **\$12.18/day** | **\$15.66/day** | **\$19.14/day** |
| 3 miners | 10.44 | **\$36.54/day** | **\$46.98/day** | **\$57.43/day** |


## Revenue bands

Use hashprice in dollars per TH per day. Revenue per day = hashrate_TH × hashprice.

| Band | Hashprice (per TH per day) | 1 miner at 200 TH | 3 miners at 600 TH |
|---|---:|---:|---:|
| Defensive | 0.040 | **8.00** | **24.00** |
| Base case | 0.060 | **12.00** | **36.00** |
| Rip | 0.080 | **16.00** | **48.00** |

## Daily net and seasonal net

**Formula**

```
net_per_day = mining_revenue + heat_credit − power_cost
seasonal_net = net_per_day × heating_days
```

Tables below use the power placeholders above and a 210-day winter. Pick the propane price column that matches actual bill.

### One miner

| Band | Propane price | Revenue | Heat | Power | Net/day | Seasonal net (210 d) |
|---|---|---:|---:|---:|---:|---:|
| Defensive | \$3.50 | 8.00 | 12.18 | 6.73 | **13.45** | **2,825** |
| Defensive | \$4.50 | 8.00 | 15.66 | 6.73 | **16.93** | **3,556** |
| Defensive | \$5.50 | 8.00 | 19.14 | 6.73 | **20.41** | **4,286** |
| Base | \$3.50 | 12.00 | 12.18 | 6.73 | **17.45** | **3,665** |
| Base | \$4.50 | 12.00 | 15.66 | 6.73 | **20.93** | **4,396** |
| Base | \$5.50 | 12.00 | 19.14 | 6.73 | **24.41** | **5,126** |
| Rip | \$3.50 | 16.00 | 12.18 | 6.73 | **21.45** | **4,505** |
| Rip | \$4.50 | 16.00 | 15.66 | 6.73 | **24.93** | **5,236** |
| Rip | \$5.50 | 16.00 | 19.14 | 6.73 | **28.41** | **5,966** |

**Simple payback, one miner**
- Capex **3,400–5,000**
- Base winter at \$4.50/gal nets **~4,396**
- Payback **~0.8–1.1 winters** before any off-season mining

### Three miners

| Band | Propane price | Revenue | Heat | Power | Net/day | Seasonal net (210 d) |
|---|---|---:|---:|---:|---:|---:|
| Defensive | \$3.50 | 24.00 | 36.54 | 19.43 | **41.11** | **8,634** |
| Defensive | \$4.50 | 24.00 | 46.98 | 19.43 | **51.55** | **10,827** |
| Defensive | \$5.50 | 24.00 | 57.43 | 19.43 | **62.00** | **13,020** |
| Base | \$3.50 | 36.00 | 36.54 | 19.43 | **53.11** | **11,153** |
| Base | \$4.50 | 36.00 | 46.98 | 19.43 | **63.55** | **13,347** |
| Base | \$5.50 | 36.00 | 57.43 | 19.43 | **74.00** | **15,540** |
| Rip | \$3.50 | 48.00 | 36.54 | 19.43 | **65.11** | **13,673** |
| Rip | \$4.50 | 48.00 | 46.98 | 19.43 | **75.55** | **15,867** |
| Rip | \$5.50 | 48.00 | 57.43 | 19.43 | **86.00** | **18,060** |

**Simple payback, three miners**
- Capex **10,100–13,200**
- Base winter at \$4.50/gal nets **~13,347**
- Payback **~0.8–1.0 winters** before any off-season mining

## Off-season reality

If the apartment does not need heat and you dump to the roof, net compresses to mining revenue minus power. Underclock or curtail if hashprice is soft. Augment the controller to make this a schedule and not a guess.

## Cash cadence and reserve

- Weekly auto-sell exactly enough to pay the power bill  
- Monthly reserve 2–3% of gross for fans, PSUs, filters  
- Remainder stays as BTC, basis tracked on receipt

## Sensitivities that move ROI the most

- Hashprice is the big lever  
- Tariff class for steady loads matters  
- Percentage of winter hours where room heat is actually absorbed  
- Night noise tolerance that allows steady duty hours

Update three dials before buying: the miner invoice, the actual power rate math, and the **delivered propane price**. 

## Bottom line for this first build

Forced air is not a compromise. It is the right first move. Duct the heat to where people actually live, give the roof a clean path for surplus, and put a thin layer of controls between the thermostat and the miners so the whole thing behaves like a well-mannered appliance. Keep payouts predictable, sell just enough to pay the bill, and let the rest ride. When you have a winter of data and a well honed machine, that is the moment to choose whether to go water-side. Until then, this system will keep the apartment warm and move us further towards the Bitcoin standard of living where our purchasing power only increases as the rest of fiat crumbles around us.

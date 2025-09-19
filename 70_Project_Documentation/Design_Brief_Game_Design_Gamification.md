---
uid: brief-game-design-gamification
project: VR Mines
tags: [brief, design, gamification, mda, storytelling]
updated: 2025-09-15
---

# VR Training — Game Design & Gamification Brief (Designer View)

## 1. Core Design Frameworks (short)
- **MDA (Mechanics → Dynamics → Aesthetics)**: build mechanics (rules, systems), test dynamics (player/system), iterate toward targeted aesthetics (feelings: competence, tension, discovery). Use MDA to ensure every mechanic supports training outcomes (safety, skill).  
  See: [[../../80_Research_Notes/MDA_and_Game_Design_Principles_for_VR|MDA for VR]] and [[../../80_Research_Notes/Game_Design_Fundamentals_Bible|Game Design Fundamentals — Bible]]
- **Gamification: Octalysis** (8 core drives — Meaning, Accomplishment, Empowerment, Ownership, Social Influence, Scarcity, Unpredictability, Avoidance). Use to choose meaningful motivators (not just points).  
  See: [[../../80_Research_Notes/Gamification_Frameworks_Octalysis_Principles|Gamification Frameworks]]
- **Player‑centred design / UX**: align to user goals (learn safety, not chase points). Research + iteration; don’t paint gamification on top.  
  Source roundup in research note above.

## 2. High‑level Game Design Principles to Follow
- **Meaningful Choice**: every mechanic forces tradeoffs (mine faster vs. check safety)
- **Clear Feedback**: immediate, perceivable (audio, haptics, HUD)
- **Progression & Mastery**: short loops (tutorial → repeat) + long loops (badges, ranks)
- **Risk & Reward**: calibrated penalties; positive reinforcement; safe failure
- **Narrative Context**: embed tasks in “day in a miner’s life”; narrative debriefs  
  See: [[../../80_Research_Notes/VR_Storytelling_and_Narrative_Design|VR Storytelling]]

## 3. MDA Applied to VR Mining Simulator (examples)
- **Mechanics**: tool physics (drill head), PPE checks, hazard systems (roof/gas/equipment), scoring & badges, NPC states
- **Dynamics**: speed vs. safety; helping NPCs vs. throughput; tension cycles (calm → hazard → resolution)
- **Aesthetics**: competence, arousal/tension, relatedness, meaning (real‑world impact)

## 4. Gamification Design (practical structure)
- **Core Drives to use**: Meaning (CD1), Accomplishment (CD2), Empowerment (CD3), Social Influence (CD5), Unpredictability (CD7)
- **Concrete Mechanics**:
  - Session Score = w1·Efficiency + w2·Safety + w3·ResponseTime (breakdown in debrief)
  - Badges/Titles: Safety First, Quick Responder (<2s avg), Team Saver
  - Daily Objectives / Micro‑quests (guided practice)
  - Progression gates: unlock higher risk only after safety competence
  - Persistent Profile: history + heatmaps of common mistakes
  - Reward Economy: cosmetics, advanced scenarios, certificates (where supported)

## 5. Storytelling & Narrative (practical)
- Slice‑of‑life framing: start‑of‑shift ritual, small NPC beats, reflective debriefs
- Micro‑narratives per hazard: cause + short learning clip
- Tone: serious, respectful — gamification must not trivialize danger

## 6. Procedural Boss‑Level (key mechanics)
- Hazard Manager: rule‑based + probability curves; frequency rises with time/unsafe acts
- Hazard Composition: single + compound events (gas → equipment → roof)
- Priority Events: conflict‑of‑priorities (save NPC vs. stop conveyor)
- Adaptive Difficulty: simplify hazards for low safety score; increase repetition for practice
- Debrief: after‑action review, replay highlights, coaching

## 7. Implementation & Testing Checklist (VR/DOTS)
- Build minimal viable hazard in DOTS; measure alarm perception latency (<200 ms)
- Metrics: safety infractions, reaction time distribution, completion time, repeated errors, sickness reports
- Usability: miners/domain experts; iterate on comfort (locomotion, warnings)
- Ethics: avoid traumatic realism; opt‑outs; gradual exposure

## 8. Example Design Recipes (quick wins)
- **Recipe A — Safety Streak**: consecutive compliant sessions → badge + small XP boost
- **Recipe B — Quick Rescue Mini‑quest**: timed NPC assist sequence → Team Saver badge + learning clip
- **Recipe C — Procedural Boss Wave**: 3 hazards in 120s; scoring favors safety + efficiency balance

## 9. Metrics & Success Criteria
- Learning: fewer repeated infractions after 5 sessions
- Engagement: session completion rate; time‑on‑task
- Transfer: improved checklist compliance in assessments
- Comfort: low sickness reports; stable 72–90 Hz

## 10. References & Foundations (curated)
- MDA; The Design Gym; Juegos Studio; MagicMedia storytelling; Octalysis (Yu‑kai Chou); academic gamification reviews; Interaction Design Foundation; [[../../80_Research_Notes/Game_Design_Fundamentals_Bible|Bible]]

## Scope & Timeline Note
- Development targets Day 90 for a complete, demo‑ready training build.
- A dedicated Post‑90 Polish phase follows for performance, UX, audio/visual, and localization refinements.  
  See: [[../90_Roadmap_Updates/90_Day_Master_Plan|90-Day Build Plan + Post-90 Polish]].

---

> Final design note: Treat the sim as a learning ecosystem — mechanics teach, dynamics reveal mistakes, aesthetics respect real‑world risk while motivating practice. Gamification scaffolds deliberate practice and must map to correct behaviors.

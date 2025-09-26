---
uid: plan-90-master
project: VR Mines
tags: [plan, roadmap]
updated: 2025-09-26
---

# 90-Day Build Plan + Post-90 Polish (Solo-dev realistic)

## Phase A — Build (Days 1–90)
- Day 1–21: Foundations + Learning Buffer (URP, OpenXR, XRI, Entities intro, SubScenes)
- Day 22–42: Core Loop v1 (Drill mono MVP), PPE check, basic scoring
- Day 43–63: Hazards v1 (gas zone + roof warning), debrief v1
- Day 64–84: DOTS uplift for hot paths (spawners, scoring), perf pass 1
- Day 85–90: Integration, stabilization, demo packaging

## Phase B — Polish (Post Day 90)
- Perf pass 2 (GPU/CPU), memory trimming, hitches removal
- Audio polish: mixing, sidechain ducking, localized VO QC
- Visual polish: lighting, materials, VFX optimization
- UX polish: menu flow, debrief visuals, accessibility refinements
- Content: instructor guide finalization, scenario authoring templates
- Validation: extended playtests, SSQ/NASA‑TLX analysis

## Deliverables
- Day 90: Quest 3 build (AAB), demo video, documentation set (core loop + 2 hazards)
- Post‑90: Polished build candidate; trainer materials

## Links
- [[../70_Project_Documentation/GDD/VR_Mines_GDD|GDD]] • [[./90_Day_Roadmap_Update_Week1|Week 1]] • [[../70_Project_Documentation/DOTS_Migration_Plan|DOTS Plan]]

## Infographics

```mermaid
gantt
  dateFormat  YYYY-MM-DD
  title Solo 90-Day Plan (high-level)
  section Foundations
  Learning + Setup (OpenXR/XRI/Entities) :2025-09-08, 21d
  section Core Loop
  Drill MVP + PPE + Scoring              :2025-09-29, 14d
  section Hazards & Debrief
  Gas + Roof + Debrief v1                :2025-10-13, 21d
  section DOTS + Perf
  DOTS uplift + Perf pass                :2025-11-03, 21d
  section Ship
  Integrate + Demo                       :2025-11-24, 7d
```

```mermaid
pie title Time Allocation (Solo)
  "Learning/Onboarding" : 20
  "Core Loop Build" : 25
  "Hazards & Debrief" : 25
  "DOTS Uplift + Perf" : 25
  "Integration/Docs" : 5
```


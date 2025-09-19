---
uid: roadmap-90d
project: VR Mines
tags: [roadmap, plan]
updated: 2025-09-19
---

# 90-Day Roadmap — VR Miner Training (Quest 3)

> Solo dev with Unity experience, learning VR and DOTS by building. Uses existing assets. Target: playable training sim on Quest 3 with core loop, hazards, scoring, and debrief.

## Goals
- Shipping goal: Tutorial + 2 training drills; hazards, PPE check, scoring, debrief dashboard.
- Technical goal: Learn XR Interaction Toolkit (XRI), OpenXR, and Unity Entities (DOTS) fundamentals; migrate high-impact systems to DOTS.
- Performance goal: 72–90 FPS on Quest 3; frame timing stable under 13.8 ms.

## Scope
- Platforms: Quest 3 (standalone). Editor: Unity 2023 LTS.
- Input: Hand controllers first; hand-tracking optional in post-90.
- Assets: Reuse existing 3D models and textures; avoid heavy shaders.
- Out-of-scope (90 days): Networking, multiplayer, advanced AI, pickaxe interaction.

## High-Level Phases
1. Foundation & VR onboarding (Days 1–21)
2. Core loop & environment (Days 22–42)
3. Hazards, scoring, debrief (Days 43–63)
4. DOTS migration, polish, and ship (Days 64–90)

## Gantt
```mermaid
gantt
  dateFormat  YYYY-MM-DD
  title 90-Day Roadmap — VR Miner Training
  section Phase 1: Foundations
  Setup Unity 2023 LTS, OpenXR, XRI     :done,    p1a, 2025-09-20, 3d
  Learn VR basics (locomotion, grabs)   :active,  p1b, 2025-09-23, 7d
  Build input bridge + interactions     :         p1c, 2025-09-30, 7d
  Mobile build pipeline (Quest 3)       :         p1d, 2025-10-07, 4d
  section Phase 2: Core Loop
  Scene setup + lighting pass           :         p2a, 2025-10-12, 5d
  Drill tool MVP (mono)                 :         p2b, 2025-10-17, 6d
  UI HUD + prompts (UX)                 :         p2c, 2025-10-23, 4d
  section Phase 3: Hazards & Scoring
  Gas zone + roof collapse (mono)       :         p3a, 2025-10-27, 6d
  Scoring rubric + feedback cues        :         p3b, 2025-11-02, 5d
  Debrief dashboard                     :         p3c, 2025-11-07, 4d
  section Phase 4: DOTS & Polish
  DOTS migrate: drill + spawner         :         p4a, 2025-11-11, 8d
  DOTS hazards system                   :         p4b, 2025-11-19, 6d
  Perf pass + QA + ship                 :         p4c, 2025-11-25, 6d
```

## Weekly Breakdown

### Weeks 1–3: Foundations
- Install Unity 2023 LTS + Android/Quest toolchain; set up OpenXR + XRI rig.
- Locomotion: teleport + snap turn + continuous move; comfort vignettes.
- Grabbing/using tools; build `XRInput_Bridge` wrapper to centralize inputs.
- First Quest 3 build; verify framerate and render scale; enable Vulkan.

Deliverables:
- "VR Playground" scene with interactables; APK running on Quest 3.

### Weeks 4–6: Core Loop
- Create mine scene using existing assets; budget triangles and textures.
- Implement Drill MVP using monobehaviour first; haptics + audio loop.
- UX prompts, tooltips, and basic tutorial guide; pause menu.

Deliverables:
- Playable loop: pick up drill → drill ore → deposit sample.

### Weeks 7–9: Hazards & Scoring
- Implement Gas Zone and Roof Collapse hazards (mono prototype).
- Scoring rubric: time, safety compliance, error penalties; feedback cues.
- Debrief dashboard with session summary and guidance.

Deliverables:
- Two hazards active; end-of-run score with insights.

### Weeks 10–12: DOTS & Polish
- Migrate high-impact systems to DOTS: drill updates, hazard spawner, scoring events.
- Convert spawners and hazard checks to Entities with Systems; keep XRI mono.
- Performance pass: URP mobile profile, GPU instancing, occlusion culling, LODs.

Deliverables:
- Stable 72–90 FPS; DOTS systems for spawning and scoring events.

## Learning Plan (by building)
- VR Essentials: XRI interactables, locomotion, haptics, UI in world space.
- Mobile VR Performance: URP settings, baked lighting, texture compression, frame timing.
- DOTS Basics: Entities, Components, Systems; authoring components; baking workflow.
- Data-Driven Hazards: event channels, rule-driven penalties, ECS queries.

## Milestones & Demos
- Day 21: Playground demo APK (inputs + interactions).
- Day 42: Core loop demo APK (drill MVP + scene + tutorial).
- Day 63: Hazards + scoring demo APK.
- Day 90: DOTS-polished training build with debrief.

## Risks & Mitigations
- VR sickness: offer teleport + snap turn; vignette strength options.
- Performance dips: profiling cadence; reduce draw calls; mesh atlases; LOD.
- DOTS learning curve: migrate only perf-critical paths; keep XRI in mono.
- Solo bandwidth: cut features aggressively; reuse assets; scope weekly.

## Links
- [[../70_Project_Documentation/XR_to_DOTS_Bridge_Plan|XR → DOTS Bridge Plan]]
- [[../70_Project_Documentation/DOTS_Migration_Plan|DOTS Migration Plan]]
- [[../70_Project_Documentation/VR_Coal_Mining_Simulator/Backlog|Backlog]]

## Backlinks
- [[../Project_Directory_Index|Project Directory Index]]


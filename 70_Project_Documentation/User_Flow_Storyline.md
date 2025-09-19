---
uid: user-flow-story
project: VR Mines
tags: [flow, ux, narrative]
updated: 2025-09-15
---

# User Flow + Storyline — VR Mines (SafeOps)

> [!info] Hubs
> [[./GDD/VR_Mines_GDD|GDD]] • [[./VR_Coal_Mining_Simulator/Features/Drill_System_DOTS|Drill (DOTS)]] • [[../80_Research_Notes/VR_Storytelling_and_Narrative_Design|VR Storytelling]] • [[./Instructor_Guide_Template|Instructor Guide]]

## 1) High-Level Flow (Act Structure)
```mermaid
graph TD
  A[Launch] --> B[Briefing & Calibration]
  B --> C[PPE Check]
  C --> D[Tutorial: Controls & Safety]
  D --> E[Module Select]
  E --> F1[M1 Drilling L1]
  E --> F2[M2 Drilling L2]
  E --> F3[M3 Drilling L3]
  E --> F4[M4 Water Logging]
  E --> F5[M5 Forklift Ops]
  F1 --> G[Debrief]
  F2 --> G
  F3 --> G
  F4 --> G
  F5 --> G
  G --> H[Progress Dashboard]
  H --> E
```

## 2) Detailed Interaction Flow (Example: M1 Drilling L1)
```mermaid
graph LR
  S0((Start)) --> S1[Enter Tunnel]
  S1 --> S2[Safety Prompt: Helmet]
  S2 -->|ok| S3[Approach Drill Spot]
  S2 -->|fail| P1[Penalty + Prompt]
  S3 --> S4[Grip Drill]
  S4 --> S5[Angle & Pressure Coaching]
  S5 -->|good| S6[Progress Bar Builds]
  S5 -->|bad| P2[Warning + Haptic Feedback]
  S6 --> S7[Complete Spot]
  S7 --> S8[Move To Next]
  S8 --> S9((End → Debrief))
```

## 3) Hazard Flow (Procedural Boss-Level)
```mermaid
graph TD
  H0[Hazard Manager] --> H1[Roll Hazard Seed]
  H1 -->|Gas| HG[Gas Leak]
  H1 -->|Roof| HR[Roof Instability]
  H1 -->|Equip| HE[Equipment Failure]
  HG --> R1[Alarm + Mask Check]
  HR --> R2[Evac Route + Support Props]
  HE --> R3[Machine Stop Procedure]
  R1 --> D1[Score: Response Time + Safety]
  R2 --> D2[Score: Correct Sequence]
  R3 --> D3[Score: Incident Contained]
  D1 --> C[Debrief]
  D2 --> C
  D3 --> C
```

## 4) Storyline Beats (Slice‑of‑Life)
- Opening VO (Dispatcher): “Shift 3, safety first. Two drills at the east face.”
- Locker Room Ritual: don PPE; minor chit‑chat about last incident (tone setting)
- On‑site Brief: instructor points to hazard signage; explains objectives
- Work Phase: steady loop of tasks; ambient radio chatter makes world feel alive
- Spike: alert tone; hazard forces decision under pressure
- Resolution: correct procedure leads to calm and praise; mistakes → coaching
- Debrief: instructor highlights positives; shows heatmap of issues; proposes micro‑quests

## 5) UX States & Transitions
```mermaid
stateDiagram-v2
  [*] --> Idle
  Idle --> Briefing
  Briefing --> Calibration
  Calibration --> PPE
  PPE --> Tutorial
  Tutorial --> ModuleSelect
  ModuleSelect --> InScenario
  InScenario --> Hazard
  Hazard --> InScenario: contained
  InScenario --> Debrief: objectives complete
  Debrief --> Dashboard
  Dashboard --> ModuleSelect
```

## 6) Feedback & Scoring Surfaces
- In‑scenario: subtle progress bar, timer, minimal HUD
- Audio: VO guidance ducking ambience by 6–9 dB
- Haptics: graded by impact/urgency
- Debrief Dashboard: score breakdown (Efficiency/Safety/Response), badges, next micro‑quests

## 7) Data & Telemetry
- Track: infractions, reaction times, repeated errors, completion, comfort
- Store per run; show trends over sessions (streaks, improvement)

## 8) Acceptance Criteria (per module)
- Clear success/fail routes; recoverable errors
- Safety cues detectable ≤200 ms
- 72–90 Hz on Quest 3 in stress case
- Debrief suggests actionable next steps

## 9) Links
- [[./GDD/VR_Mines_GDD|GDD]] • [[./VR_Coal_Mining_Simulator/Backlog|Backlog]] • [[./VR_Coal_Mining_Simulator/Features/Drill_System_DOTS|Drill System]] • [[../90_Roadmap_Updates/90_Day_Roadmap_Update_Week1|Roadmap W1]]


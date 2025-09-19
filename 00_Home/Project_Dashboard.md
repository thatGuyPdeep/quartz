---
uid: dashboard-vr-mines
project: VR Mines
status: active
updated: 2025-09-15
tags: [dashboard]
---

# VR Mines — Project Dashboard

> [!info] Quick Entry Points
> [[./INDEX|Home Index]] • [[./MOC_VR_Mines|MOC]] • [[../70_Project_Documentation/GDD/VR_Mines_GDD|GDD]] • [[../70_Project_Documentation/DOTS_Migration_Plan|DOTS Plan]] • [[../70_Project_Documentation/VR_Coal_Mining_Simulator/Backlog.kanban|Kanban]]

## Status Summary

| Area | Status | Owner | Notes |
|---|---|---|---|
| Drill (DOTS) | In Progress | PDT | Input/Motion systems prototyped |
| DOTS Plan | Active | PDT | Scope defined, week 2 targets |
| Roadmap W1 | Completed | PDT | Next: ECS Physics week |
| Research | Ongoing | PDT | Immersion + mining workflow |

## Milestone Flow
```mermaid
graph LR
  W1[Week 1: Foundation] --> W2[Week 2: ECS Physics]
  W2 --> W3[Week 3: Extraction + Cart]
  W3 --> W4[Week 4: Safety Integration]
  W4 --> R[Release Candidate @ Day 90]
  R --> P[Post-90 Polish]
```

## Component Map
```mermaid
graph TD
  XR --> Input
  Input --> Motion
  Motion --> Collision
  Collision --> Feedback
  Collision --> Scoring
  Scoring --> Telemetry
```

> [!tip] Graph View
> Filter by tag `#project/vr-mines` for a clean project-only network.

## Key Documents
- [[../70_Project_Documentation/GDD/VR_Mines_GDD|GDD — SafeOps]]
- [[../70_Project_Documentation/VR_Coal_Mining_Simulator/Features/Drill_System_DOTS|Drill System (DOTS)]]
- [[../70_Project_Documentation/DOTS_Migration_Plan|DOTS Migration Plan]]
- [[../90_Roadmap_Updates/90_Day_Roadmap_Update_Week1|Roadmap W1]]
- [[../70_Project_Documentation/VR_Coal_Mining_Simulator/Backlog|Backlog]]

## Workload Split
```mermaid
pie title Work Focus (Week 1)
  "ECS Drill" : 40
  "Docs & Planning" : 25
  "Research" : 20
  "Content/Devlog" : 15
```

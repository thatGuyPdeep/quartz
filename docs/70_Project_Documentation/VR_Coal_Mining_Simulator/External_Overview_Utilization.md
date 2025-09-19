---
uid: external-overview-utilization
project: VR Mines — Obsidian Second Brain
tags: [docs, migration, assets, DOTS]
updated: 2025-09-16
---

# External Overview and Utilization Plan

> Reference and apply the detailed architecture, systems, scenes, gameplay, scoring, user flow, and DOTS plan authored in the OOP project repo.

## Source Document
- Windows path: `c:\Users\ADMIN\Documents\GitHub\VR-Mines-New-Project\Assets\artifacts\Project_Overview_and_DOTS_Migration.md`
- Contains: architecture, scenes, gameplay, scoring; storyline and user flow; DOTS migration guidance (reuse/refactor/bakers/systems); full PowerShell asset-inventory script and run steps.

## How to Use It in This Project
- Asset reuse planning
  - Run the inventory script (below) to produce `Assets_Inventory.csv` and `Assets_Inventory.md`.
  - Triage by size and reuse category; prioritize converting large Prefabs/Scenes first.
- DOTS port sequencing
  - Follow the per-system suggestions to define Authoring+Bakers and ECS Systems for: Drill, DrillSpot progression, WaterLogging, Vehicles, PPE, Scoring.
  - Mirror scene content into SubScenes and bake entity prefabs.
- Documentation linkage
  - Keep this note as the bridge; results should be summarized in [[./Systems_Analysis|Systems Analysis]] and tasks tracked in [[./Backlog|Backlog]].

## Run the Asset Inventory (PowerShell)
```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File artifacts\gen_inventory.ps1
```

Expected outputs:
- `artifacts/Assets_Inventory.csv`
- `artifacts/Assets_Inventory.md`

## Triage Workflow (Actionable)
1. Open `Assets_Inventory.md` → review "Top 50 Largest" and "Summary by Reuse Category".
2. Create entries in [[./Backlog|Backlog]]:
   - "Convert Prefabs to Authoring+Bakers" for top-10 size prefabs.
   - "Create SubScenes for Cave_Drill and Blasting".
   - "Unify ScoreSystem (ECS) and HUD presenter bridge".
3. For each high-impact item, link to a corresponding feature doc (e.g., [[./Features/Drill_System_DOTS|Drill System (DOTS)]]).
4. Update [[./Systems_Analysis|Systems Analysis]] table with any newly discovered dependencies from CSV.

## Integration Diagram (where this fits)
```mermaid
graph TD
  ExternalDoc[External Overview (OOP repo)] --> ThisNote[External Overview Utilization]
  ThisNote --> Inventory[Run Asset Inventory]
  Inventory --> Findings[CSV/MD Findings]
  Findings --> Backlog[[Backlog Items]]
  Findings --> Analysis[[Systems Analysis Updates]]
  Backlog --> Features[Feature Docs]
  Features --> DOTS[DOTS Systems/Bakers]
```

## Quick Links
- [[./Systems_Analysis|Systems Analysis]]
- [[./Features/Drill_System_DOTS|Drill System (DOTS)]]
- [[../DOTS_Migration_Plan|DOTS Migration Plan]]
- [[../XR_to_DOTS_Bridge_Plan|XR → DOTS Bridge Plan]]



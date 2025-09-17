---
uid: plan-xr-dots-bridge
project: VR Mines
tags: [plan, xr, dots]
updated: 2025-09-15
---

# Unity XR → DOTS Bridge Plan

## Objectives
- Keep XR Interaction Toolkit (XRI) + UI on GameObjects
- Move heavy simulation (drill, hazards, vehicles, scoring) into DOTS
- Provide minimal, testable bridges for inputs, events, and spawning

## Architecture Overview
```mermaid
graph TD
  XRI[XRI Hands/Controllers]
  MB[Mono Bridge (Authoring + Update)]
  ECS[DOTS Systems]
  XRI --> MB --> ECS
```

### Components
- GameObject side: `XRInputAuthoring`, `InteractionEventAuthoring`, `SpawnerAuthoring`
- DOTS side: `XRInput` (singleton), `InputEvent` buffer, `InteractionEvent` buffer, `SpawnRequest` buffer

## Patterns
- Buffer pattern: GO writes `InputEvent`/`InteractionEvent` into DynamicBuffers on a singleton entity
- Baker pattern: convert static config from ScriptableObjects into BlobAssets for ECS consumption
- Subscene pattern: author scenes as usual; bake to Entities for play
- System groups: input → motion/logic → collision → feedback → scoring

## Data Contracts
- InputEvent { type: byte, value: float }
- InteractionEvent { id: ushort, data: float }
- SpawnRequest { prefab: Entity, pos: float3 }
- PenaltyEvent/BonusEvent for scoring

## Implementation Steps
1. Create `XRInputAuthoring` MonoBehaviour to read XRI actions
2. Bake singleton entity with `XRInput` and `InputEvent` buffer
3. Implement `XRInputBridgeSystem` writing buffer entries
4. Implement ECS consumers: `DrillInputSystem`, `VehicleInputSystem`
5. Create `InteractionEventAuthoring` for tool grabs/uses
6. Add `InteractionEventBridgeSystem` to feed ECS
7. Build `SpawnerAuthoring` + `SpawnRequestSystem` for ECS-driven instantiation
8. Validate with drill prototype; measure latency and allocations

## Performance Considerations
- Burst all ECS systems on hot paths
- Avoid per-frame allocations; reuse structs
- Gate bridge writes to changed inputs only
- Use `FixedStepSimulationSystemGroup` for physics-coherent updates

## Testing Plan
- Unit tests for buffer writes/reads
- Profiler: ensure bridge overhead < 0.2 ms per frame
- Integration: drill loop + hazards with XR input → ECS motion → scoring

## Risks & Mitigations
- Input lag: use minimal marshalling; avoid heavy work on GO side
- Complexity: strictly separate bridges vs. gameplay systems
- XR package changes: keep interfaces lean and documented

## References
- [[./Code_Templates/XRInput_Bridge_ECS|XR Input Bridge Template]]
- [[./Code_Templates/Drill_Mining_Loop_ECS|Drill ECS Template]]
- [[./DOTS_Migration_Plan|DOTS Migration Plan]]


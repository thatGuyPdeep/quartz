# Feature Backlog — VR Coal Mining Simulator

## Core Loop (Month 1–2)
- Drill arm interaction (DOTS): mass, haptics, material impacts
- Coal extraction system: chunking, dust, yield
- Cart/conveyor: loading, transport, unloading
- Safety gear enforcement: helmet, oxygen mask
- Hazard simulation: gas leak detection, tunnel collapse cues

## Feedback & Penalties
- Penalty system for drops, proximity violations, missed steps
- Alarm system: gas, structural, equipment failure
- Narration/UI panels added after core stability

## Immersion & Comfort
- Spatial audio mix with clear voice vs. noise separation
- Hindi/Multilingual instruction tracks
- 4 levels of loading/fatigue (forced break model)
- 90+ FPS target; comfort tests and load testing

## DOTS Migration
- SubScenes
  - [ ] Create SubScenes: Menu, Level, Cave_Drill, Cave_Drill_L2, Cave_Drill_L3, Blasting, Control_Instruction, Safety_Inst
- Prefab Baking
  - [ ] Convert drill machine, lever base/handle, pipes, coal, cave prefabs via Bakers
- Authoring + Bakers
  - [ ] DrillArmAuthoring → `DrillArm`
  - [ ] DrillSpotAuthoring → `DrillSpot`
  - [ ] WaterLoggingAuthoring → `WaterLogging`
  - [ ] VehicleAuthoring → `Vehicle`
  - [ ] ForkliftLiftAuthoring → `ForkliftLift`
  - [ ] CoalSpawnerAuthoring → `CoalSpawner`
  - [ ] WearZoneAuthoring → `WearZone`
- ECS Systems
  - [ ] `DrillArmControlSystem`
  - [ ] `DrillProgressSystem`
  - [ ] `WaterLeakStartSystem`
  - [ ] `WaterLevelRaiseSystem`
  - [ ] `WaterLevelLowerSystem`
  - [ ] `PumpToggleSystem`
  - [ ] `VehicleMoveSystem`
  - [ ] `ForkliftLiftSystem`
  - [ ] `CoalSpawnSystem`
  - [ ] `ScoreSystem` + `ScoreEvent` buffer
  - [ ] `MistakeSystem`
- Bridges & UI
  - [ ] HUD Score Presenter (ECS → TMP)
  - [ ] Audio Bridge (ECS events → AudioSource)
  - [ ] Particles Bridge (ECS events → VFX/ParticleSystem)
- Input Mapping
  - [ ] Map Input System actions → ECS input components (XR axes/buttons)
- Rendering/Shaders
  - [ ] Audit URP materials/shaders; replace Surface Shaders
- Performance/Content
  - [ ] Run asset inventory; optimize top-50 imports (ASTC/ETC, Vorbis)
- Validation
  - [ ] Parity tests for drilling, water logging, XR interactions
  - [ ] Frame time budget met (72/90 Hz)

## Validation
- Usability playtests with lab peers
- Metrics: success rate, safety score, comfort, learning curve

## Month 3 — Polish & Rollout
- [ ] Performance hardening on Quest (GPU overdraw, SRP batcher, lightmaps)
- [ ] Comfort modes (snap/continuous turn, vignette, seated/standing)
- [ ] Accessibility (color-safe UI, scale text, audio captions toggle)
- [ ] Instructor Mode (pause/rewind, spawn hazards, override results)
- [ ] Debrief Dashboard (per-event timeline, mistakes breakdown, grade)
- [ ] Analytics hooks (anonymized events; opt-in; local export)
- [ ] Localization scaffolding (en, hi) for UI and narration keys
- [ ] Save/Load session summaries (JSON) for training records
- [ ] Build & CI: cloud build profile, SubScene bake verification step
- [ ] Bug bash & triage (stability, null refs, race conditions)
- [ ] Documentation polish (authoring→component map, admin handbook)
- [ ] Public notes update in `Publish/` (no sensitive data)

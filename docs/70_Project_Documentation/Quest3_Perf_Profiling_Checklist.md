# Quest 3 Performance & Profiling Checklist

## Frame Targets
- 72–90 Hz; GPU < 11 ms@90; CPU main-thread < 6 ms

## Rendering
- URP: Single-Pass Instanced; FFR/DFR if compatible
- Light baking where possible; minimal real-time shadows
- LODs and occlusion culling
- ASTC textures; reduce overdraw/transparency

## DOTS
- Burst enabled; Safety checks off in release
- Zero GC alloc per frame; `ISystem` where possible
- Use `FixedStepSimulationSystemGroup` for physics-bound systems

## Audio
- Use mixer groups; ducking for VO; limit concurrent voices

## Profiling Steps
1. Player build with Development + Autoconnect Profiler
2. Record 60s in target scene; capture CPU/GPU frame time
3. Check entity counts, system timings (Entities Profiler)
4. GPU capture (RenderDoc, PCVR) for draw calls/overdraw
5. Log metrics to `TelemetryBuffer`

## Pass/Fail Gates
- Meets target Hz with ≥10% margin in stress scene
- No frame spikes > 16 ms over 1% of frames
- Memory within budget; no leaks

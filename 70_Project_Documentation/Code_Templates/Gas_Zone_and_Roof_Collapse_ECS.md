# Gas Zone + Roof Collapse — Template

```csharp
using Unity.Burst;
using Unity.Entities;

public struct GasZone : IComponentData { public float ppm; public float threshold; public bool alarmed; }
public struct RoofInstability : IComponentData { public float risk; public float timeToFail; public bool collapsed; }

[BurstCompile]
public partial struct GasZoneSystem : ISystem
{
    public void OnUpdate(ref SystemState state)
    {
        foreach (var zone in SystemAPI.Query<RefRW<GasZone>>())
        {
            if (!zone.ValueRO.alarmed && zone.ValueRO.ppm >= zone.ValueRO.threshold)
            {
                zone.ValueRW.alarmed = true;
                // TODO: emit alarm event
            }
        }
    }
}

[BurstCompile]
public partial struct RoofCollapseSystem : ISystem
{
    public void OnUpdate(ref SystemState state)
    {
        foreach (var roof in SystemAPI.Query<RefRW<RoofInstability>>())
        {
            if (roof.ValueRO.collapsed) continue;
            roof.ValueRW.timeToFail -= SystemAPI.Time.DeltaTime * roof.ValueRO.risk;
            if (roof.ValueRW.timeToFail <= 0f)
            {
                roof.ValueRW.collapsed = true;
                // TODO: spawn debris, block path, trigger penalties
            }
        }
    }
}
```

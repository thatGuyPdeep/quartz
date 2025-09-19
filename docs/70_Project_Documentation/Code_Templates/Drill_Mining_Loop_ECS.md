# Drill Mining Loop (ECS) — Template

```csharp
using Unity.Burst;
using Unity.Entities;
using Unity.Mathematics;
using Unity.Transforms;

public struct DrillHead : IComponentData { public float pressure; public float angle; }
public struct DrillSpot : IComponentData { public float hardness; public float progress; public float3 normal; }
public struct DrillContact : IBufferElementData { public Entity spot; public float delta; }

[BurstCompile]
public partial struct DrillMotionSystem : ISystem
{
    public void OnUpdate(ref SystemState state)
    {
        foreach (var (drill, xform) in SystemAPI.Query<RefRW<DrillHead>, RefRW<LocalTransform>>())
        {
            // integrate pressure/angle into transform or physics proxy
        }
    }
}

[BurstCompile]
public partial struct DrillCollisionSystem : ISystem
{
    public void OnUpdate(ref SystemState state)
    {
        // Detect contacts (via physics events or proximity) and write to DrillContact buffers
    }
}

[BurstCompile]
public partial struct DrillProgressSystem : ISystem
{
    public void OnUpdate(ref SystemState state)
    {
        foreach (var (contacts, head) in SystemAPI.Query<DynamicBuffer<DrillContact>, RefRO<DrillHead>>())
        {
            for (int i = 0; i < contacts.Length; i++)
            {
                var c = contacts[i];
                if (!SystemAPI.Exists(c.spot)) continue;
                var spot = SystemAPI.GetComponentRW<DrillSpot>(c.spot);
                float rate = math.max(0f, head.ValueRO.pressure - spot.ValueRO.hardness);
                spot.ValueRW.progress += rate * SystemAPI.Time.DeltaTime;
            }
        }
    }
}
```

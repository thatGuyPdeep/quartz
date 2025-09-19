# Hazards: Random Spawner — Template

```csharp
using Unity.Burst;
using Unity.Entities;
using Unity.Mathematics;

public struct HazardSeed : IComponentData { public uint value; public float cooldown; public float timer; }
public struct HazardSpawn : IComponentData { public Entity prefab; public float minDelay; public float maxDelay; }

[BurstCompile]
public partial struct HazardSpawnerSystem : ISystem
{
    public void OnUpdate(ref SystemState state)
    {
        foreach (var (seed, spawn) in SystemAPI.Query<RefRW<HazardSeed>, RefRO<HazardSpawn>>())
        {
            seed.ValueRW.timer -= SystemAPI.Time.DeltaTime;
            if (seed.ValueRW.timer > 0) continue;

            var rand = Random.CreateFromIndex(seed.ValueRO.value++);
            var delay = math.lerp(spawn.ValueRO.minDelay, spawn.ValueRO.maxDelay, rand.NextFloat());
            seed.ValueRW.timer = delay;

            var ecb = new EntityCommandBuffer(Unity.Collections.Allocator.Temp);
            var e = ecb.Instantiate(spawn.ValueRO.prefab);
            ecb.Playback(state.EntityManager);
        }
    }
}
```

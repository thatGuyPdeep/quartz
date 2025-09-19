# NPC Miner State Machine — Template

```csharp
using Unity.Burst;
using Unity.Entities;

public enum MinerState : byte { Idle, Mining, Panic, Injured, Assisting }

public struct MinerAI : IComponentData { public MinerState state; public float timer; }

[BurstCompile]
public partial struct MinerAISystem : ISystem
{
    public void OnUpdate(ref SystemState state)
    {
        foreach (var ai in SystemAPI.Query<RefRW<MinerAI>>())
        {
            ai.ValueRW.timer -= SystemAPI.Time.DeltaTime;
            if (ai.ValueRW.timer > 0) continue;

            switch (ai.ValueRO.state)
            {
                case MinerState.Idle: ai.ValueRW.state = MinerState.Mining; ai.ValueRW.timer = 5f; break;
                case MinerState.Mining: /* hazard check */ break;
                case MinerState.Panic: /* seek help */ break;
                case MinerState.Injured: /* wait */ break;
                case MinerState.Assisting: /* assist neighbor */ break;
            }
        }
    }
}
```

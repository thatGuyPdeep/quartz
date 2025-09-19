# Scoring and Feedback — Template

```csharp
using Unity.Burst;
using Unity.Entities;

public struct ScoreAccumulator : IComponentData { public int value; }
public struct PenaltyEvent : IBufferElementData { public int delta; public ushort code; }
public struct BonusEvent : IBufferElementData { public int delta; public ushort code; }

[BurstCompile]
public partial struct ScoringSystem : ISystem
{
    public void OnUpdate(ref SystemState state)
    {
        foreach (var (score, penalties, bonuses) in SystemAPI.Query<RefRW<ScoreAccumulator>, DynamicBuffer<PenaltyEvent>, DynamicBuffer<BonusEvent>>())
        {
            for (int i = 0; i < penalties.Length; i++) score.ValueRW.value += penalties[i].delta;
            penalties.Clear();
            for (int i = 0; i < bonuses.Length; i++) score.ValueRW.value += bonuses[i].delta;
            bonuses.Clear();
        }
    }
}
```

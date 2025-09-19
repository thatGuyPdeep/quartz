# XR Input Bridge → ECS (Template)

```csharp
// XRInputAuthoring.cs (GO-side)
using Unity.Entities;
using UnityEngine;

public class XRInputAuthoring : MonoBehaviour
{
    public float trigger;
    public Vector2 joystick;
}

public class XRInputBaker : Baker<XRInputAuthoring>
{
    public override void Bake(XRInputAuthoring authoring)
    {
        var entity = GetEntity(TransformUsageFlags.None);
        AddComponent(entity, new XRInput());
        AddBuffer<InputEvent>(entity);
    }
}

public struct XRInput : IComponentData {}

public struct InputEvent : IBufferElementData
{
    public byte type; // 0=Trigger,1=JoyX,2=JoyY,3=Button
    public float value;
}
```

```csharp
// XRInputBridgeSystem.cs (ECS-side)
using Unity.Burst;
using Unity.Entities;

[BurstCompile]
public partial struct XRInputBridgeSystem : ISystem
{
    public void OnUpdate(ref SystemState state)
    {
        foreach (var (buffer, authoring) in SystemAPI.Query<DynamicBuffer<InputEvent>, RefRO<XRInput>>())
        {
            // TODO: push values from XRI (via MonoBehaviour update) to buffer
            // Example placeholder: buffer.Add(new InputEvent { type=0, value=1f });
        }
    }
}
```


# Unity 2023.3 Quest 3 + DOTS Setup

## Versions
- Unity 2023.3 LTS
- Android SDK/NDK via Hub
- Meta Quest Developer Hub (for device)

## Packages (minimum)
- OpenXR Plugin
- XR Interaction Toolkit
- XR Hands (optional)
- URP
- Entities, Entities Graphics
- Unity Physics (for Entities)
- Burst, Collections, Mathematics, Jobs

## Steps
1. Create 3D (URP) project
2. Enable XR Plugin Management → OpenXR
3. Add XR Interaction Toolkit; import default input actions
4. Add DOTS packages (Entities 1.x) and Burst
5. Switch platform to Android; set Quest 3 settings (ARM64, Vulkan, IL2CPP)
6. Create Subscene; convert environment to Entities
7. Install Meta ODH; pair headset; enable developer mode

## Android Player Settings (Quest 3)
- Graphics: Vulkan, Multiview stereo
- Scripting Backend: IL2CPP, ARM64
- Target framerate: 72/90
- Minimum SDK: 29+

## Sample manifest.json block
```json
{
  "dependencies": {
    "com.unity.render-pipelines.universal": "15.0.0",
    "com.unity.xr.openxr": "1.10.0",
    "com.unity.xr.interaction.toolkit": "3.1.0",
    "com.unity.entities": "1.3.1",
    "com.unity.entities.graphics": "1.3.1",
    "com.unity.physics": "1.3.1",
    "com.unity.burst": "1.8.12",
    "com.unity.collections": "2.4.0",
    "com.unity.mathematics": "1.3.2"
  }
}
```

## Links
- [[./DOTS_Migration_Plan|DOTS Migration Plan]]
- [[../70_Project_Documentation/Code_Templates/README|Code Templates]]

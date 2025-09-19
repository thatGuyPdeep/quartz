 # Meta Quest 3 Deployment Guide

## Pre-Deployment Checklist

### Performance Optimization
- [ ] **Frame Rate**: Maintain 72 FPS consistently
- [ ] **Memory Usage**: Keep under 4GB RAM
- [ ] **Draw Calls**: Minimize to < 100 per frame
- [ ] **Texture Size**: Optimize for mobile GPU
- [ ] **Polygon Count**: Keep scenes under 100k triangles

### VR Comfort Guidelines
- [ ] **Locomotion**: Provide multiple movement options
- [ ] **Snap Turning**: Implement for comfort
- [ ] **UI Distance**: Position UI 1-2 meters away
- [ ] **Motion Sickness**: Avoid rapid movements
- [ ] **Audio**: Use spatial audio appropriately

## Build Configuration

### Unity Build Settings
```csharp
// Build Configuration Script
public class BuildConfiguration : MonoBehaviour
{
    [Header("Build Settings")]
    public string productName = "Your VR App";
    public string packageName = "com.yourcompany.yourapp";
    public string version = "1.0.0";
    
    [Header("Quest 3 Optimization")]
    public bool enableFoveatedRendering = true;
    public bool enableDynamicResolution = true;
    public int targetFrameRate = 72;
    
    void ConfigureBuildSettings()
    {
        // Configure Player Settings
        PlayerSettings.productName = productName;
        PlayerSettings.bundleIdentifier = packageName;
        PlayerSettings.bundleVersion = version;
        
        // Android Settings
        PlayerSettings.Android.minSdkVersion = AndroidSdkVersions.AndroidApiLevel24;
        PlayerSettings.Android.targetSdkVersion = AndroidSdkVersions.AndroidApiLevel34;
        PlayerSettings.Android.targetArchitectures = AndroidArchitecture.ARM64;
        
        // Graphics Settings
        PlayerSettings.SetGraphicsAPIs(BuildTarget.Android, new GraphicsDeviceType[] 
        { 
            GraphicsDeviceType.Vulkan 
        });
    }
}
```

### Quest 3 Specific Settings
1. **Player Settings → Android**:
   - **Scripting Backend**: IL2CPP
   - **Target Architectures**: ARM64
   - **Graphics APIs**: Vulkan
   - **Minimum API Level**: Android 7.0 (API 24)
   - **Target API Level**: Android 14 (API 34)

2. **XR Settings**:
   - **Initialize XR on Startup**: ✅
   - **Meta Quest Support**: ✅
   - **Hand Tracking**: ✅ (if using)

3. **Quality Settings**:
   - **Quality Level**: Medium (for Quest 3)
   - **Texture Quality**: Half Res
   - **Anisotropic Textures**: Disabled
   - **Anti Aliasing**: 2x Multi Sampling

## Build Process

### Step 1: Pre-Build Optimization
```csharp
// Build Optimization Script
public class BuildOptimizer : MonoBehaviour
{
    public void OptimizeForQuest3()
    {
        // Optimize textures
        OptimizeTextures();
        
        // Reduce polygon count
        OptimizeMeshes();
        
        // Compress audio
        OptimizeAudio();
        
        // Remove unused assets
        RemoveUnusedAssets();
    }
    
    void OptimizeTextures()
    {
        // Set texture compression to ASTC
        // Reduce texture sizes
        // Use texture atlasing
    }
    
    void OptimizeMeshes()
    {
        // Enable mesh compression
        // Use LOD groups
        // Optimize polygon count
    }
}
```

### Step 2: Build Configuration
1. **File → Build Settings**
2. **Platform**: Android
3. **Scenes**: Add all scenes to build
4. **Player Settings**: Configure as above
5. **Build**: Create APK file

### Step 3: APK Installation
```bash
# Install APK on Quest 3
adb install -r YourApp.apk

# Or use SideQuest for easier installation
# 1. Install SideQuest on PC
# 2. Connect Quest 3 via USB
# 3. Drag APK to SideQuest
# 4. Install on device
```

## Testing and Debugging

### Performance Testing
```csharp
// Performance Monitor
public class Quest3PerformanceMonitor : MonoBehaviour
{
    public float targetFrameTime = 1f / 72f; // 72 FPS
    public float performanceWarningThreshold = 0.9f;
    
    void Update()
    {
        MonitorPerformance();
        LogPerformanceData();
    }
    
    void MonitorPerformance()
    {
        float currentFrameTime = Time.deltaTime;
        float performanceRatio = currentFrameTime / targetFrameTime;
        
        if (performanceRatio > performanceWarningThreshold)
        {
            Debug.LogWarning($"Performance Warning: {performanceRatio:P}");
        }
    }
}
```

### Debug Tools
1. **Oculus Performance HUD**:
   - Enable in Quest 3 settings
   - Shows FPS, CPU/GPU usage
   - Memory consumption

2. **Unity Profiler**:
   - Connect to Quest 3 via WiFi
   - Monitor real-time performance
   - Identify bottlenecks

3. **ADB Logcat**:
   ```bash
   adb logcat -s Unity
   ```

### Comfort Testing
- **Session Length**: Test 30+ minute sessions
- **Movement**: Test all locomotion methods
- **UI Interaction**: Verify comfortable UI usage
- **Audio**: Test spatial audio positioning

## Publishing Options

### Meta Quest Store
**Requirements**:
- Complete Meta Developer account
- App review process (2-4 weeks)
- Quality standards compliance
- Revenue sharing (30% to Meta)

**Submission Process**:
1. Create Meta Developer account
2. Submit app for review
3. Provide store assets (screenshots, videos)
4. Complete store listing
5. Wait for approval

### App Lab
**Requirements**:
- Lighter review process
- Discoverable through search
- No revenue sharing
- Good for testing/early access

**Submission Process**:
1. Create Meta Developer account
2. Submit to App Lab
3. Provide basic store assets
4. Wait for approval (1-2 weeks)

### SideQuest
**Requirements**:
- No review process
- Direct APK installation
- Good for development/testing
- Community-driven discovery

**Upload Process**:
1. Create SideQuest account
2. Upload APK file
3. Add description and screenshots
4. Publish immediately

## Optimization Techniques

### Rendering Optimization
```csharp
// Quest 3 Rendering Optimizer
public class Quest3Renderer : MonoBehaviour
{
    [Header("Foveated Rendering")]
    public bool enableFoveatedRendering = true;
    public float foveationLevel = 0.5f;
    
    [Header("Dynamic Resolution")]
    public bool enableDynamicResolution = true;
    public float minResolutionScale = 0.7f;
    public float maxResolutionScale = 1.0f;
    
    void Start()
    {
        ConfigureRendering();
    }
    
    void ConfigureRendering()
    {
        if (enableFoveatedRendering)
        {
            // Configure foveated rendering
            OVRManager.instance.fixedFoveatedRenderingLevel = 
                OVRManager.FixedFoveatedRenderingLevel.Medium;
        }
        
        if (enableDynamicResolution)
        {
            // Configure dynamic resolution
            OVRManager.instance.enableDynamicResolution = true;
        }
    }
}
```

### Memory Optimization
```csharp
// Memory Manager
public class Quest3MemoryManager : MonoBehaviour
{
    public int maxMemoryUsage = 3500; // MB
    public float memoryCheckInterval = 1f;
    
    void Start()
    {
        InvokeRepeating(nameof(CheckMemoryUsage), 0f, memoryCheckInterval);
    }
    
    void CheckMemoryUsage()
    {
        long memoryUsage = System.GC.GetTotalMemory(false) / (1024 * 1024);
        
        if (memoryUsage > maxMemoryUsage)
        {
            TriggerMemoryCleanup();
        }
    }
    
    void TriggerMemoryCleanup()
    {
        // Unload unused assets
        Resources.UnloadUnusedAssets();
        
        // Force garbage collection
        System.GC.Collect();
    }
}
```

### Audio Optimization
```csharp
// Audio Optimizer
public class Quest3AudioOptimizer : MonoBehaviour
{
    [Header("Audio Settings")]
    public int maxAudioSources = 32;
    public float audioLODDistance = 50f;
    
    void Start()
    {
        ConfigureAudio();
    }
    
    void ConfigureAudio()
    {
        // Set audio quality for Quest 3
        AudioSettings.outputSampleRate = 48000;
        AudioSettings.SetDSPBufferSize(256, 4);
        
        // Configure spatial audio
        AudioSettings.spatializerPlugin = "OculusSpatializer";
    }
}
```

## Troubleshooting

### Common Build Issues
1. **Build Fails**:
   - Check Android SDK installation
   - Verify Java JDK setup
   - Clear Unity cache

2. **APK Won't Install**:
   - Check package name format
   - Verify signing configuration
   - Ensure Quest 3 has enough storage

3. **Performance Issues**:
   - Use Unity Profiler
   - Check draw calls
   - Optimize textures and meshes

### Runtime Issues
1. **App Crashes**:
   - Check ADB logcat
   - Verify memory usage
   - Test on different Quest 3 devices

2. **Poor Performance**:
   - Enable Oculus Performance HUD
   - Reduce quality settings
   - Optimize rendering pipeline

3. **Hand Tracking Issues**:
   - Check hand tracking permissions
   - Verify lighting conditions
   - Test gesture recognition

## Final Checklist

### Before Publishing
- [ ] **Performance**: 72 FPS consistently
- [ ] **Memory**: Under 4GB usage
- [ ] **Comfort**: No motion sickness
- [ ] **Accessibility**: Multiple input methods
- [ ] **Testing**: Multiple user sessions
- [ ] **Documentation**: User guide and controls
- [ ] **Store Assets**: Screenshots and videos
- [ ] **Legal**: Privacy policy and terms

### Post-Launch
- [ ] **Analytics**: Track usage and performance
- [ ] **Feedback**: Monitor user reviews
- [ ] **Updates**: Plan for bug fixes and features
- [ ] **Marketing**: Promote your VR app

Your RTX 5090 setup will make development and testing much smoother - you can test at high fidelity and have plenty of headroom for complex scenes!







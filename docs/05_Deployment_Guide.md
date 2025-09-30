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

## Graph Panel

The VR Mines platform includes an interactive knowledge graph visualization that provides an Obsidian-style interface for exploring project documentation and relationships.

### Features

#### **Interactive Graph Visualization**
- **Node Selection**: Click nodes to select them (Ctrl/Cmd+Click for multi-select)
- **Search & Filter**: Use the control panel to search nodes and filter by category
- **Zoom & Pan**: Mouse wheel to zoom, drag to pan around the graph
- **Node Categories**: Color-coded nodes by content type (Home, Project, Research, Daily, etc.)
- **Neighbor Highlighting**: Selected nodes highlight their connected neighbors

#### **Control Panel**
Located at the top of the graph pane:
- **Search Input**: Type to search for specific nodes by name
- **Category Filter**: Dropdown to filter nodes by category
- **Clear Selection**: Button to deselect all selected nodes
- **Reset View**: Button to reset zoom and center the graph

#### **Keyboard Shortcuts**
- **Ctrl/Cmd + G**: Toggle graph panel visibility
- **Escape**: Close graph panel
- **Ctrl/Cmd + Click**: Multi-select nodes

### Enabling the Graph Panel

The graph panel is automatically available on all pages. To toggle it:

1. **Keyboard**: Press `Ctrl + G` (or `Cmd + G` on Mac)
2. **Button**: Look for the graph icon button in the top-right corner
3. **Mobile**: Tap the circular graph button for mobile-optimized controls

### Troubleshooting Graph Issues

#### **Graph Not Loading**
```bash
# Check if graph.json exists and is valid
ls -la docs/assets/graph/graph.json

# Regenerate graph data
cd tools && python build_graph.py
```

#### **Performance Issues**
- **Large Graphs**: Use category filtering to reduce visible nodes
- **Slow Rendering**: Check browser console for JavaScript errors
- **Memory Usage**: Close and reopen the graph panel to reset state

#### **Missing Nodes**
- **New Files**: Run `python tools/build_graph.py` to include new markdown files
- **Broken Links**: Check that internal links use proper wiki-link format `[[Page Name]]`
- **File Structure**: Ensure files follow the established folder structure

#### **Search Not Working**
- **Case Sensitivity**: Search is case-insensitive
- **Partial Matches**: Search matches partial node names
- **Special Characters**: Avoid special regex characters in search

### Graph Data Structure

The graph is generated from your markdown files and includes:

```json
{
  "metadata": {
    "version": "1.0",
    "generated": "2025-01-27T...",
    "totalNodes": 150,
    "totalEdges": 300,
    "categories": {
      "home": 5,
      "project": 45,
      "research": 30,
      "daily": 25,
      "roadmap": 15,
      "templates": 10,
      "publish": 10,
      "devlog": 10
    }
  },
  "nodes": [
    {
      "id": "00_Home/INDEX",
      "title": "Home Index",
      "category": "home",
      "importance": "high",
      "tags": ["index", "navigation"]
    }
  ],
  "edges": [
    {
      "source": "00_Home/INDEX",
      "target": "Project_Directory_Index",
      "weight": 0.8,
      "type": "navigation"
    }
  ]
}
```

### Customization

#### **Adding New Categories**
1. Update `CATEGORY_MAPPING` in `tools/build_graph.py`
2. Add corresponding CSS colors in `docs/assets/ui/graph-pane.css`
3. Regenerate graph data: `python tools/build_graph.py`

#### **Modifying Node Colors**
Edit the `--graph-category-*` CSS variables in `docs/assets/ui/graph-pane.css`:

```css
:root {
  --graph-category-home: #4285f4;
  --graph-category-project: #34a853;
  --graph-category-research: #fbbc04;
  /* Add more categories as needed */
}
```

#### **Adjusting Graph Physics**
Modify the `CONFIG.graph` object in `docs/assets/ui/graph-pane.js`:

```javascript
const CONFIG = {
  graph: {
    linkDistance: 100,        // Distance between connected nodes
    chargeStrength: -300,     // Repulsion between nodes
    velocityDecay: 0.3,       // Friction/damping
    alphaDecay: 0.02,         // Simulation cooling rate
    alphaMin: 0.01,           // Minimum simulation energy
    linkStrength: 0.5,        // Link stiffness
    centerStrength: 0.1,      // Center attraction
    collisionRadius: 20       // Node collision radius
  }
};
```







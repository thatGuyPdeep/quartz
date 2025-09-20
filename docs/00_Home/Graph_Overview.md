---
uid: graph-overview
project: VR Mines
tags: [graph, overview]
updated: 2025-09-19
---

# Graph Overview

This interactive graph shows pages and their wiki-link connections. Click nodes to navigate.

<div id="graph" style="height:70vh;"></div>

<script>
async function draw() {
  const container = document.getElementById('graph');
  const resp = await fetch('/quartz/assets/graph/graph.json');
  const data = await resp.json();

  // fallback: render minimal force layout with d3 if available
  const script = document.createElement('script');
  script.src = 'https://cdn.jsdelivr.net/npm/force-graph@1.44.0/dist/force-graph.min.js';
  script.onload = () => {
    const Graph = ForceGraph()(container)
      .graphData({
        nodes: data.nodes.map(n => ({ id: n.id, name: n.label, path: n.path })),
        links: data.edges.map(e => ({ source: e.from, target: e.to }))
      })
      .nodeLabel(n => n.name)
      .onNodeClick(n => {
        if (n.path) window.location.href = '/' + 'quartz/' + n.path;
      })
      .linkDirectionalParticles(0)
      .nodeRelSize(6);
  };
  document.body.appendChild(script);
}
draw();
</script>

---
uid: graph-overview
project: VR Mines
status: active
updated: 2025-09-15
tags: [graph]
---

# Graph Overview — VR Mines

## Network (Concept Map)
```mermaid
graph TD
  GDD --> Backlog
  Backlog --> Features
  Features --> Drill
  Features --> Safety
  Features --> Vehicles
  Backlog --> Roadmap
  Roadmap --> Daily
  Research --> Features
  Research --> UX
```

## Mindmap (Modules)
```mermaid
mindmap
  root((VR Mines))
    Controls & PPE
    Drilling
      L1 Basics
      L2 Coolant
      L3 Hazards
    Water Logging
    Vehicles
    Blasting Prep
    Material Handling
```

## Pie — Effort Allocation
```mermaid
pie title Focus Split
  "Drill ECS" : 40
  "Safety/Hazards" : 25
  "Vehicles" : 20
  "Research" : 15
```

> [!hint] Use Graph Settings
> - Group by: Path
> - Show tags; filter `#project/vr-mines`

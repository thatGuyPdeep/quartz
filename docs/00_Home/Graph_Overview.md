---
uid: graph-overview
project: VR Mines
tags: [graph, overview]
updated: 2025-09-19
---

# Graph Overview

This page hosts a lightweight, self-contained graph view inspired by Obsidian’s Graph plugin settings: search, tag/path filters, and neighbor highlighting. See reference: [Obsidian Graph](https://help.obsidian.md/plugins/graph).

<style>
  .graph-wrap { position: relative; height: 72vh; border: 1px solid #e1e5ea; border-radius: 8px; overflow: hidden; }
  .graph-toolbar { position: absolute; top: 8px; left: 8px; right: 8px; display: flex; gap: 8px; flex-wrap: wrap; background: rgba(250,250,252,0.9); border: 1px solid #e1e5ea; border-radius: 8px; padding: 6px 8px; z-index: 5; }
  .graph-toolbar input, .graph-toolbar select { font-size: 12px; padding: 4px 6px; }
  .graph-canvas { position: absolute; inset: 0; }
</style>

<div class="graph-wrap">
  <div class="graph-toolbar">
    <input id="gv-search" type="text" placeholder="Search..." />
    <input id="gv-tag" type="text" placeholder="Filter tag (e.g., #project/vr-mines)" />
    <input id="gv-path" type="text" placeholder="Filter path (e.g., 70_Project_Documentation/)" />
    <label><input id="gv-neighbors" type="checkbox" /> Neighbors-only on select</label>
    <button id="gv-reset">Reset</button>
  </div>
  <div id="gv-canvas" class="graph-canvas"></div>
  <noscript>Enable JavaScript to view the interactive graph.</noscript>
  <script>
  (function(){
    const container = document.getElementById('gv-canvas');
    const base = location.pathname.startsWith('/quartz/') ? '/quartz/' : '/';
    const dataUrls = [ base + 'assets/graph/graph.json', 'assets/graph/graph.json', (location.pathname.replace(/[^\/]+\/?$/, '')) + 'assets/graph/graph.json' ];
    const state = { raw:null, filtered:null, selected:null };

    function matchFilters(n){
      const q = document.getElementById('gv-search').value.trim().toLowerCase();
      const tag = document.getElementById('gv-tag').value.trim();
      const path = document.getElementById('gv-path').value.trim();
      let ok = true;
      if(q) ok = ok && ((n.title||n.id||'').toLowerCase().includes(q));
      if(tag) ok = ok && ((n.tags||[]).some(t => ('#'+t)===tag || t===tag || (''+t).includes(tag.replace('#',''))));
      if(path) ok = ok && ((n.id||'').startsWith(path));
      return ok;
    }

    function buildFiltered(){
      if(!state.raw) return {nodes:[], links:[]};
      const nodes = state.raw.nodes.filter(matchFilters);
      const keep = new Set(nodes.map(n=>n.id));
      const links = state.raw.edges.filter(e => keep.has(e.source||e.from) && keep.has(e.target||e.to))
        .map(e => ({ source: e.source||e.from, target: e.target||e.to }));
      return {nodes, links};
    }

    function applyFilters(){
      state.filtered = buildFiltered();
      Graph.graphData({ nodes: state.filtered.nodes.map(n=>({ id:n.id, name:n.title||n.id, path:n.path, tags:n.tags||[] })), links: state.filtered.links });
    }

    function highlightSelection(n){
      const neighborsOnly = document.getElementById('gv-neighbors').checked;
      const neighbor = new Set();
      if(n){
        state.filtered.links.forEach(l => { if(l.source.id===n.id) neighbor.add(l.target.id); if(l.target.id===n.id) neighbor.add(l.source.id); });
      }
      Graph.nodeColor(node => {
        if(!n) return '#5b8def';
        if(node.id===n.id) return '#34a853';
        if(neighbor.has(node.id)) return '#fbbc04';
        return neighborsOnly ? 'rgba(120,120,140,0.15)' : '#5b8def';
      });
      Graph.linkColor(l => {
        if(!n) return 'rgba(120,120,140,0.35)';
        const isNeighbor = l.source.id===n.id || l.target.id===n.id;
        return isNeighbor ? '#fbbc04' : (neighborsOnly ? 'rgba(120,120,140,0.1)' : 'rgba(120,120,140,0.35)');
      });
    }

    function goto(n){ if(n && n.path){ const prefix = base.replace(/\/$/,''); window.location.href = prefix + '/' + n.path; } }

    function wireControls(){
      ['gv-search','gv-tag','gv-path'].forEach(id => document.getElementById(id).addEventListener('input', () => applyFilters()));
      document.getElementById('gv-neighbors').addEventListener('change', () => highlightSelection(state.selected));
      document.getElementById('gv-reset').addEventListener('click', () => { ['gv-search','gv-tag','gv-path'].forEach(id=>document.getElementById(id).value=''); state.selected=null; applyFilters(); highlightSelection(null); });
    }

    async function loadGraph(){
      for(const url of dataUrls){
        try{ const r = await fetch(url, {cache:'no-store'}); if(r.ok){ const j = await r.json();
          // normalize keys
          const nodes = (j.nodes||[]).map(n=>({ id: n.id||n.key||n.path, title: n.title||n.label||n.id, path: n.path||n.id, tags: n.tags||[] }));
          const edges = (j.edges||j.links||[]).map(e=>({ source: e.source||e.from, target: e.target||e.to }));
          return { nodes, edges };
        }}catch(e){}
      }
      return {nodes:[], edges:[]};
    }

    let Graph;
    (async function init(){
      state.raw = await loadGraph();
      state.filtered = buildFiltered();
      const s = document.createElement('script');
      s.src = 'https://cdn.jsdelivr.net/npm/force-graph@1.44.0/dist/force-graph.min.js';
      s.onload = () => {
        Graph = ForceGraph()(container)
          .graphData({ nodes: state.filtered.nodes.map(n=>({ id:n.id, name:n.title||n.id, path:n.path })), links: state.filtered.links })
          .nodeLabel(n => n.name)
          .nodeRelSize(6)
          .linkDirectionalParticles(0)
          .onNodeClick(n => goto(n))
          .onNodeHover(n => { state.selected = n || null; highlightSelection(state.selected); });
        wireControls();
      };
      document.body.appendChild(s);
    })();
  })();
  </script>
</div>

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

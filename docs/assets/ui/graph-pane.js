(() => {
  const BASE = location.pathname.startsWith('/quartz/') ? '/quartz/' : '/';
  function ensurePane() {
    if (document.getElementById('vrmines-graph-pane')) return document.getElementById('vrmines-graph-pane');
    const pane = document.createElement('aside');
    pane.id = 'vrmines-graph-pane';
    pane.innerHTML = '<div id="vrmines-graph-canvas"></div>';
    document.body.appendChild(pane);
    document.body.classList.add('vrmines-graph-active');
    return pane;
  }

  async function loadGraph() {
    try {
      const resp = await fetch(BASE + 'assets/graph/graph.json');
      return await resp.json();
    } catch (e) {
      console.warn('Graph load failed', e);
      return null;
    }
  }

  function currentPageId(nodes) {
    // current path like /quartz/dir/page/
    let p = location.pathname;
    if (p.startsWith('/')) p = p.slice(1);
    if (p.startsWith('quartz/')) p = p.slice('quartz/'.length);
    if (!p.endsWith('/')) p += '/';
    // nodes paths end with '/'
    const n = nodes.find(n => (n.path || '') === p);
    return n ? n.id : null;
  }

  function highlightNeighbors(data, centerId) {
    const neigh = new Set();
    data.edges.forEach(e => {
      if (e.from === centerId) neigh.add(e.to);
      if (e.to === centerId) neigh.add(e.from);
    });
    return neigh;
  }

  function renderGraph(data) {
    const container = document.getElementById('vrmines-graph-canvas');
    if (!container) return;
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/force-graph@1.44.0/dist/force-graph.min.js';
    script.onload = () => {
      const nodes = data.nodes.map(n => ({ id: n.id, name: n.label, path: n.path }));
      const links = data.edges.map(e => ({ source: e.from, target: e.to }));
      const center = currentPageId(nodes);
      const neighbors = center ? highlightNeighbors(data, center) : new Set();

      const fg = ForceGraph()(container)
        .graphData({ nodes, links })
        .nodeLabel(n => n.name)
        .nodeCanvasObject((n, ctx, scale) => {
          const r = (n.id === center) ? 6 : (neighbors.has(n.id) ? 4.5 : 3);
          ctx.beginPath();
          ctx.arc(n.x, n.y, r, 0, 2 * Math.PI, false);
          ctx.fillStyle = (n.id === center) ? '#ffcc00' : (neighbors.has(n.id) ? '#66ccff' : '#8899aa');
          ctx.fill();
        })
        .linkColor(l => (l.source.id === center || l.target.id === center) ? '#66ccff' : 'rgba(136,153,170,0.4)')
        .onNodeClick(n => {
          if (n.path) window.location.href = BASE + n.path;
        })
        .width(container.clientWidth)
        .height(container.clientHeight)
        .linkDirectionalParticles(0)
        .cooldownTicks(120)
        .d3VelocityDecay(0.3);

      const onResize = () => {
        fg.width(container.clientWidth);
        fg.height(container.clientHeight);
      };
      window.addEventListener('resize', onResize);
    };
    document.body.appendChild(script);
  }

  async function init() {
    const pane = ensurePane();
    const data = await loadGraph();
    if (data) renderGraph(data);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();




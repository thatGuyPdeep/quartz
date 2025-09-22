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
    const candidates = [
      BASE + 'assets/graph/graph.json',
      'assets/graph/graph.json',
      (location.pathname.replace(/[^\/]+\/?$/, '')) + 'assets/graph/graph.json'
    ];
    for (const url of candidates) {
      try {
        const resp = await fetch(url, { cache: 'no-store' });
        if (resp.ok) return await resp.json();
      } catch (e) {
        // try next
      }
    }
    console.warn('Graph json not found via candidates');
    return null;
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
    
    // Add toggle button with improved styling
    if (!document.getElementById('vrmines-graph-toggle')) {
      const btn = document.createElement('button');
      btn.id = 'vrmines-graph-toggle';
      btn.innerHTML = '📊';
      btn.title = 'Toggle Graph View';
      const setLabel = () => {
        btn.innerHTML = document.body.classList.contains('vrmines-graph-collapsed') ? '📊' : '✕';
        btn.title = document.body.classList.contains('vrmines-graph-collapsed') ? 'Show Graph' : 'Hide Graph';
      };
      btn.addEventListener('click', () => {
        const collapsed = document.body.classList.toggle('vrmines-graph-collapsed');
        if (!collapsed) {
          document.body.classList.add('vrmines-graph-active');
        }
        try { localStorage.setItem('vrGraphCollapsed', String(collapsed)); } catch {}
        setLabel();
        window.dispatchEvent(new Event('resize'));
      });
      setLabel();
      document.body.appendChild(btn);
    }

    // Resizer drag behavior
    const pane = document.getElementById('vrmines-graph-pane');
    let dragging = false;
    const onDown = (e) => {
      if (!pane) return;
      const x = e.clientX || (e.touches && e.touches[0]?.clientX);
      if (!x) return;
      // if near left edge of the pane (10px resizer)
      const rect = pane.getBoundingClientRect();
      if (Math.abs(x - rect.left) <= 10) {
        dragging = true;
        e.preventDefault();
      }
    };
    const onMove = (e) => {
      if (!dragging || !pane) return;
      const x = e.clientX || (e.touches && e.touches[0]?.clientX);
      if (!x) return;
      const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
      const newW = Math.min(Math.max(vw - x, 280), Math.floor(vw * 0.4)); // clamp between 280px and 40vw
      document.documentElement.style.setProperty('--vr-graph-w', newW + 'px');
      try { localStorage.setItem('vrGraphW', String(newW)); } catch {}
      window.dispatchEvent(new Event('resize'));
    };
    const onUp = () => { dragging = false; };
    document.addEventListener('mousedown', onDown);
    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
    document.addEventListener('touchstart', onDown, { passive: false });
    document.addEventListener('touchmove', onMove, { passive: false });
    document.addEventListener('touchend', onUp);
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/force-graph@1.44.0/dist/force-graph.min.js';
    script.onload = () => {
      const nodes = data.nodes.map(n => ({ id: n.id, name: n.label, path: n.path }));
      const links = data.edges.map(e => ({ source: e.from, target: e.to }));
      const center = currentPageId(nodes);
      const neighbors = center ? highlightNeighbors(data, center) : new Set();

      const fg = ForceGraph()(container)
        .graphData({ nodes, links })
        .nodeLabel(n => `${n.name}\n${n.path || ''}`)
        .nodeCanvasObject((n, ctx, scale) => {
          // Enhanced node sizing based on guidelines
          const connectionCount = links.filter(l => l.source.id === n.id || l.target.id === n.id).length;
          const isCurrent = n.id === center;
          const isNeighbor = neighbors.has(n.id);
          
          let radius;
          if (isCurrent) radius = 8;
          else if (isNeighbor) radius = 6;
          else if (connectionCount > 5) radius = 5;
          else if (connectionCount > 2) radius = 4;
          else radius = 3;
          
          // Enhanced visual design
          ctx.beginPath();
          ctx.arc(n.x, n.y, radius, 0, 2 * Math.PI, false);
          
          // Color coding based on guidelines
          if (isCurrent) {
            ctx.fillStyle = '#ffcc00';
            ctx.strokeStyle = '#ffaa00';
            ctx.lineWidth = 2;
          } else if (isNeighbor) {
            ctx.fillStyle = '#66ccff';
            ctx.strokeStyle = '#44aaff';
            ctx.lineWidth = 1.5;
          } else if (connectionCount > 2) {
            ctx.fillStyle = '#8899aa';
            ctx.strokeStyle = '#667788';
            ctx.lineWidth = 1;
          } else {
            ctx.fillStyle = '#556677';
            ctx.strokeStyle = '#445566';
            ctx.lineWidth = 0.5;
          }
          
          ctx.fill();
          ctx.stroke();
          
          // Add glow effect for current node
          if (isCurrent) {
            ctx.shadowColor = '#ffcc00';
            ctx.shadowBlur = 8;
            ctx.beginPath();
            ctx.arc(n.x, n.y, radius + 2, 0, 2 * Math.PI, false);
            ctx.stroke();
            ctx.shadowBlur = 0;
          }
        })
        .linkColor(l => {
          const isConnected = l.source.id === center || l.target.id === center;
          return isConnected ? 'rgba(102, 204, 255, 0.6)' : 'rgba(136, 153, 170, 0.3)';
        })
        .linkWidth(l => {
          const isConnected = l.source.id === center || l.target.id === center;
          return isConnected ? 2 : 1;
        })
        .onNodeClick(n => {
          if (n.path) window.location.href = BASE + n.path;
        })
        .onNodeHover(n => {
          container.style.cursor = n ? 'pointer' : 'default';
        })
        .width(container.clientWidth)
        .height(container.clientHeight)
        .linkDirectionalParticles(0)
        .cooldownTicks(120);

      // Use supported d3Force API for link distance and charge strength
      try {
        const linkForce = fg.d3Force('link');
        if (linkForce && typeof linkForce.distance === 'function') {
          linkForce.distance(100);
        }
        const chargeForce = fg.d3Force('charge');
        if (chargeForce && typeof chargeForce.strength === 'function') {
          chargeForce.strength(-400);
        }
        if (typeof fg.d3VelocityDecay === 'function') fg.d3VelocityDecay(0.4);
        if (typeof fg.d3AlphaDecay === 'function') fg.d3AlphaDecay(0.02);
        if (typeof fg.d3AlphaMin === 'function') fg.d3AlphaMin(0.01);
      } catch (e) {
        // no-op if API differs
      }

      const onResize = () => {
        fg.width(container.clientWidth);
        fg.height(container.clientHeight);
      };
      window.addEventListener('resize', onResize);
    };
    document.body.appendChild(script);
  }

  // Auto-resize functionality
  function setupAutoResize() {
    let resizeTimeout;
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        const pane = document.getElementById('vrmines-graph-pane');
        const main = document.querySelector('.md-main');
        const content = document.querySelector('.md-content');
        
        if (pane && main) {
          const paneWidth = pane.offsetWidth;
          const viewportWidth = window.innerWidth;
          const minContentWidth = 400;
          const availableWidth = viewportWidth - paneWidth;
          
          // Ensure content never gets too narrow
          if (availableWidth < minContentWidth) {
            const newPaneWidth = viewportWidth - minContentWidth;
            pane.style.width = Math.max(280, newPaneWidth) + 'px';
            try { localStorage.setItem('vrGraphW', String(Math.max(280, newPaneWidth))); } catch {}
          }
          
          // Update CSS custom properties
          document.documentElement.style.setProperty('--vr-graph-w', paneWidth + 'px');
          
          // Trigger graph resize if it exists
          window.dispatchEvent(new Event('graph-resize'));
        }
      }, 100);
    };
    
    window.addEventListener('resize', handleResize);
    handleResize(); // Initial call
  }
  
  // Hotkeys similar to Obsidian
  function setupHotkeys() {
    document.addEventListener('keydown', (e) => {
      const isMac = navigator.platform && navigator.platform.toUpperCase().includes('MAC');
      const mod = isMac ? e.metaKey : e.ctrlKey;
      // Toggle right graph sidebar: Cmd/Ctrl + /
      if (mod && (e.key === '/' || e.key === '?')) {
        e.preventDefault();
        const btn = document.getElementById('vrmines-graph-toggle');
        if (btn) btn.click();
      }
      // Focus search: Cmd/Ctrl + P
      if (mod && e.key && e.key.toLowerCase() === 'p') {
        e.preventDefault();
        const search = document.querySelector('input.md-search__input');
        const trigger = document.querySelector('label[for="__search"]');
        if (search) { search.focus(); search.select(); }
        else if (trigger) { trigger.click(); }
      }
    });
  }

  async function init() {
    const pane = ensurePane();
    // Mark layout as active so CSS shifts content
    document.body.classList.add('vrmines-graph-active');
    // Restore persisted width and collapsed state
    try {
      const savedW = localStorage.getItem('vrGraphW');
      if (savedW) {
        const px = parseInt(savedW, 10);
        if (!Number.isNaN(px)) {
          document.documentElement.style.setProperty('--vr-graph-w', px + 'px');
          const paneEl = document.getElementById('vrmines-graph-pane');
          if (paneEl) paneEl.style.width = px + 'px';
        }
      }
      const savedCollapsed = localStorage.getItem('vrGraphCollapsed');
      if (savedCollapsed === 'true') {
        document.body.classList.add('vrmines-graph-collapsed');
      }
    } catch {}
    setupAutoResize();
    setupHotkeys();
    const data = await loadGraph();
    if (data) renderGraph(data);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();




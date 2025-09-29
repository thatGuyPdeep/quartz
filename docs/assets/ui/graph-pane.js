(() => {
  const BASE = location.pathname.startsWith('/quartz/') ? '/quartz/' : '/';
  
  // Enhanced configuration with Obsidian-style interactions
  const CONFIG = {
    graph: {
      nodeSize: { min: 3, max: 12, current: 12, neighbor: 8, highConnect: 6, mediumConnect: 5 },
      linkDistance: 120,
      chargeStrength: -600,
      velocityDecay: 0.3,
      alphaDecay: 0.01,
      alphaMin: 0.005,
      cooldownTicks: 200,
      // Obsidian-style physics
      linkStrength: 0.3,
      centerStrength: 0.1,
      collisionRadius: 8
    },
    ui: {
      animationDuration: 300,
      resizeDebounce: 100,
      loadingTimeout: 5000,
      zoom: {
        min: 0.1,
        max: 4,
        initial: 1,
        wheelSensitivity: 0.1
      },
      pan: {
        sensitivity: 1.2
      }
    },
    colors: {
      current: '#ffcc00',
      currentStroke: '#ffaa00',
      selected: '#ff6b6b',
      selectedStroke: '#ff5252',
      neighbor: '#66ccff',
      neighborStroke: '#44aaff',
      highConnect: '#8899aa',
      highConnectStroke: '#667788',
      default: '#556677',
      defaultStroke: '#445566',
      linkConnected: 'rgba(102, 204, 255, 0.8)',
      linkDefault: 'rgba(136, 153, 170, 0.4)',
      linkSelected: 'rgba(255, 107, 107, 0.8)',
      // Category colors
      home: '#4CAF50',
      project: '#2196F3',
      research: '#FF9800',
      daily: '#9C27B0',
      roadmap: '#F44336',
      templates: '#607D8B',
      publish: '#795548',
      devlog: '#E91E63'
    },
    interactions: {
      enableSelection: true,
      enableMultiSelect: true,
      enableZoom: true,
      enablePan: true,
      enableSearch: true,
      enableFiltering: true,
      enableClustering: true
    }
  };

  // Performance monitoring
  const perfMonitor = {
    startTime: 0,
    start: () => { perfMonitor.startTime = performance.now(); },
    end: (label) => {
      const duration = performance.now() - perfMonitor.startTime;
      if (duration > 16) console.warn(`${label} took ${duration.toFixed(2)}ms`);
    }
  };

  // Obsidian-style interaction state
  const graphState = {
    selectedNodes: new Set(),
    hoveredNode: null,
    filteredNodes: new Set(),
    searchQuery: '',
    categoryFilter: 'all',
    zoomLevel: CONFIG.ui.zoom.initial,
    isPanning: false,
    lastPanPoint: { x: 0, y: 0 },
    isMultiSelecting: false,
    selectionBox: { start: null, end: null }
  };

  function ensurePane() {
    if (document.getElementById('vrmines-graph-pane')) return document.getElementById('vrmines-graph-pane');
    
    perfMonitor.start();
    const pane = document.createElement('aside');
    pane.id = 'vrmines-graph-pane';
    pane.setAttribute('role', 'complementary');
    pane.setAttribute('aria-label', 'Knowledge Graph Visualization');
    pane.innerHTML = '<div id="vrmines-graph-canvas" class="loading" tabindex="0"></div>';
    document.body.appendChild(pane);
    document.body.classList.add('vrmines-graph-active');
    perfMonitor.end('Pane creation');
    return pane;
  }

  async function loadGraph() {
    perfMonitor.start();
    const candidates = [
      BASE + 'assets/graph/graph.json',
      'assets/graph/graph.json',
      (location.pathname.replace(/[^\/]+\/?$/, '')) + 'assets/graph/graph.json'
    ];
    
    for (const url of candidates) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), CONFIG.ui.loadingTimeout);
        
        const resp = await fetch(url, { 
          cache: 'no-store',
          signal: controller.signal,
          headers: {
            'Accept': 'application/json',
            'Cache-Control': 'no-cache'
          }
        });
        
        clearTimeout(timeoutId);
        
        if (resp.ok) {
          const data = await resp.json();
          perfMonitor.end('Graph data loading');
          return data;
        }
      } catch (e) {
        if (e.name !== 'AbortError') {
          console.warn(`Failed to load graph from ${url}:`, e.message);
        }
      }
    }
    
    console.warn('Graph json not found via candidates');
    perfMonitor.end('Graph data loading (failed)');
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
    const visited = new Set();
    
    // Use a more efficient approach for large graphs
    if (data.edges.length > 1000) {
      const edgeMap = new Map();
      data.edges.forEach(e => {
        if (!edgeMap.has(e.from)) edgeMap.set(e.from, []);
        if (!edgeMap.has(e.to)) edgeMap.set(e.to, []);
        edgeMap.get(e.from).push(e.to);
        edgeMap.get(e.to).push(e.from);
      });
      
      const queue = [centerId];
      visited.add(centerId);
      
      while (queue.length > 0) {
        const current = queue.shift();
        const connections = edgeMap.get(current) || [];
        
        connections.forEach(conn => {
          if (!visited.has(conn)) {
            visited.add(conn);
            neigh.add(conn);
            queue.push(conn);
          }
        });
      }
    } else {
      // Original approach for smaller graphs
      data.edges.forEach(e => {
        if (e.from === centerId) neigh.add(e.to);
        if (e.to === centerId) neigh.add(e.from);
      });
    }
    
    return neigh;
  }

  // Obsidian-style interaction functions
  function selectNode(nodeId, multiSelect = false) {
    if (!multiSelect) {
      graphState.selectedNodes.clear();
    }
    graphState.selectedNodes.add(nodeId);
    updateGraphVisualization();
  }

  function deselectNode(nodeId) {
    graphState.selectedNodes.delete(nodeId);
    updateGraphVisualization();
  }

  function clearSelection() {
    graphState.selectedNodes.clear();
    updateGraphVisualization();
  }

  function filterByCategory(category) {
    graphState.categoryFilter = category;
    updateGraphVisualization();
  }

  function searchNodes(query) {
    graphState.searchQuery = query.toLowerCase();
    updateGraphVisualization();
  }

  function isNodeVisible(node) {
    // Check category filter
    if (graphState.categoryFilter !== 'all' && node.category !== graphState.categoryFilter) {
      return false;
    }
    
    // Check search query
    if (graphState.searchQuery) {
      const searchText = (node.label + ' ' + node.id + ' ' + (node.tags || []).join(' ')).toLowerCase();
      if (!searchText.includes(graphState.searchQuery)) {
        return false;
      }
    }
    
    return true;
  }

  function getNodeColor(node, isCurrent, isNeighbor) {
    if (isCurrent) return CONFIG.colors.current;
    if (isNeighbor) return CONFIG.colors.neighbor;
    if (graphState.selectedNodes.has(node.id)) return CONFIG.colors.selected;
    if (node.category && CONFIG.colors[node.category]) return CONFIG.colors[node.category];
    return CONFIG.colors.default;
  }

  function getNodeStrokeColor(node, isCurrent, isNeighbor) {
    if (isCurrent) return CONFIG.colors.currentStroke;
    if (isNeighbor) return CONFIG.colors.neighborStroke;
    if (graphState.selectedNodes.has(node.id)) return CONFIG.colors.selectedStroke;
    return CONFIG.colors.defaultStroke;
  }

  function updateGraphVisualization() {
    if (!window.vrGraphInstance) return;
    
    // Force re-render with updated state
    window.vrGraphInstance.refresh();
  }

  function renderGraph(data) {
    perfMonitor.start();
    const container = document.getElementById('vrmines-graph-canvas');
    if (!container) return;
    
    // Remove loading class
    container.classList.remove('loading');
    
    // Add enhanced toggle button with accessibility
    if (!document.getElementById('vrmines-graph-toggle')) {
      const btn = document.createElement('button');
      btn.id = 'vrmines-graph-toggle';
      btn.setAttribute('aria-label', 'Toggle Knowledge Graph');
      btn.setAttribute('aria-expanded', 'true');
      btn.setAttribute('type', 'button');
      
      const icon = document.createElement('span');
      icon.className = 'icon';
      icon.innerHTML = '📊';
      btn.appendChild(icon);
      
      const setLabel = () => {
        const isCollapsed = document.body.classList.contains('vrmines-graph-collapsed');
        icon.innerHTML = isCollapsed ? '📊' : '✕';
        btn.setAttribute('aria-label', isCollapsed ? 'Show Knowledge Graph' : 'Hide Knowledge Graph');
        btn.setAttribute('aria-expanded', String(!isCollapsed));
      };
      
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const collapsed = document.body.classList.toggle('vrmines-graph-collapsed');
        if (!collapsed) {
          document.body.classList.add('vrmines-graph-active');
        }
        try { localStorage.setItem('vrGraphCollapsed', String(collapsed)); } catch {}
        setLabel();
        window.dispatchEvent(new Event('resize'));
        
        // Announce to screen readers
        const announcement = document.createElement('div');
        announcement.setAttribute('aria-live', 'polite');
        announcement.setAttribute('aria-atomic', 'true');
        announcement.style.position = 'absolute';
        announcement.style.left = '-10000px';
        announcement.textContent = collapsed ? 'Graph hidden' : 'Graph shown';
        document.body.appendChild(announcement);
        setTimeout(() => document.body.removeChild(announcement), 1000);
      });
      
      setLabel();
      document.body.appendChild(btn);
    }

    // Add Obsidian-style control panel
    if (!document.getElementById('vrmines-graph-controls')) {
      const controls = document.createElement('div');
      controls.id = 'vrmines-graph-controls';
      controls.innerHTML = `
        <div class="graph-controls">
          <div class="control-group">
            <label for="graph-search">Search:</label>
            <input type="text" id="graph-search" placeholder="Search nodes..." />
          </div>
          <div class="control-group">
            <label for="graph-category">Category:</label>
            <select id="graph-category">
              <option value="all">All Categories</option>
              <option value="home">Home</option>
              <option value="project">Project</option>
              <option value="research">Research</option>
              <option value="daily">Daily</option>
              <option value="roadmap">Roadmap</option>
              <option value="templates">Templates</option>
              <option value="publish">Publish</option>
              <option value="devlog">Devlog</option>
            </select>
          </div>
          <div class="control-group">
            <button id="graph-clear-selection" title="Clear Selection">Clear</button>
            <button id="graph-reset-view" title="Reset View">Reset</button>
          </div>
        </div>
      `;
      
      const pane = document.getElementById('vrmines-graph-pane');
      pane.appendChild(controls);
      
      // Add event listeners for controls
      const searchInput = document.getElementById('graph-search');
      const categorySelect = document.getElementById('graph-category');
      const clearBtn = document.getElementById('graph-clear-selection');
      const resetBtn = document.getElementById('graph-reset-view');
      
      searchInput.addEventListener('input', (e) => {
        searchNodes(e.target.value);
      });
      
      categorySelect.addEventListener('change', (e) => {
        filterByCategory(e.target.value);
      });
      
      clearBtn.addEventListener('click', () => {
        clearSelection();
      });
      
      resetBtn.addEventListener('click', () => {
        if (window.vrGraphInstance) {
          window.vrGraphInstance.zoomToFit(400);
          window.vrGraphInstance.centerAt(0, 0);
        }
      });
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
      perfMonitor.start();
      
      const nodes = data.nodes.map(n => ({ 
        id: n.id, 
        name: n.label, 
        path: n.path,
        // Pre-calculate connection count for performance
        connectionCount: data.edges.filter(e => e.from === n.id || e.to === n.id).length
      }));
      const links = data.edges.map(e => ({ source: e.from, target: e.to }));
      const center = currentPageId(nodes);
      const neighbors = center ? highlightNeighbors(data, center) : new Set();

      const fg = ForceGraph()(container)
        .graphData({ nodes, links })
        .nodeLabel(n => `${n.name}\n${n.path || ''}\nCategory: ${n.category || 'other'}`)
        .nodeCanvasObject((n, ctx, scale) => {
          // Check if node should be visible
          if (!isNodeVisible(n)) {
            ctx.globalAlpha = 0.1;
          } else {
            ctx.globalAlpha = 1;
          }
          
          // Enhanced node sizing with configuration
          const connectionCount = n.connectionCount || 0;
          const isCurrent = n.id === center;
          const isNeighbor = neighbors.has(n.id);
          const isSelected = graphState.selectedNodes.has(n.id);
          const isHovered = graphState.hoveredNode === n.id;
          
          let radius;
          if (isCurrent) radius = CONFIG.graph.nodeSize.current;
          else if (isNeighbor) radius = CONFIG.graph.nodeSize.neighbor;
          else if (connectionCount > 5) radius = CONFIG.graph.nodeSize.highConnect;
          else if (connectionCount > 2) radius = CONFIG.graph.nodeSize.mediumConnect;
          else radius = CONFIG.graph.nodeSize.min;
          
          // Scale radius based on zoom level
          radius *= Math.max(0.5, Math.min(2, graphState.zoomLevel));
          
          // Enhanced visual design with Obsidian-style interactions
          ctx.beginPath();
          ctx.arc(n.x, n.y, radius, 0, 2 * Math.PI, false);
          
          // Dynamic coloring based on state
          ctx.fillStyle = getNodeColor(n, isCurrent, isNeighbor);
          ctx.strokeStyle = getNodeStrokeColor(n, isCurrent, isNeighbor);
          ctx.lineWidth = isSelected ? 3 : (isHovered ? 2 : 1);
          
          ctx.fill();
          ctx.stroke();
          
          // Add glow effects
          if (isCurrent || isSelected) {
            ctx.shadowColor = isCurrent ? CONFIG.colors.current : CONFIG.colors.selected;
            ctx.shadowBlur = 15;
            ctx.beginPath();
            ctx.arc(n.x, n.y, radius + 4, 0, 2 * Math.PI, false);
            ctx.stroke();
            ctx.shadowBlur = 0;
          }
          
          // Add category indicator
          if (n.category && CONFIG.colors[n.category]) {
            ctx.fillStyle = CONFIG.colors[n.category];
            ctx.beginPath();
            ctx.arc(n.x + radius * 0.7, n.y - radius * 0.7, radius * 0.3, 0, 2 * Math.PI, false);
            ctx.fill();
          }
          
          ctx.globalAlpha = 1; // Reset alpha
        })
        .linkColor(l => {
          const isConnected = l.source.id === center || l.target.id === center;
          const isSelected = graphState.selectedNodes.has(l.source.id) || graphState.selectedNodes.has(l.target.id);
          
          if (isSelected) return CONFIG.colors.linkSelected;
          return isConnected ? CONFIG.colors.linkConnected : CONFIG.colors.linkDefault;
        })
        .linkWidth(l => {
          const isConnected = l.source.id === center || l.target.id === center;
          const isSelected = graphState.selectedNodes.has(l.source.id) || graphState.selectedNodes.has(l.target.id);
          
          if (isSelected) return 3;
          return isConnected ? 2.5 : 1;
        })
        .onNodeClick(n => {
          if (CONFIG.interactions.enableSelection) {
            const multiSelect = event.ctrlKey || event.metaKey;
            if (graphState.selectedNodes.has(n.id)) {
              deselectNode(n.id);
            } else {
              selectNode(n.id, multiSelect);
            }
          }
          
          if (n.path && !event.ctrlKey && !event.metaKey) {
            // Add click animation
            container.style.transform = 'scale(0.98)';
            setTimeout(() => {
              container.style.transform = 'scale(1)';
              window.location.href = BASE + n.path;
            }, 100);
          }
        })
        .onNodeHover(n => {
          graphState.hoveredNode = n ? n.id : null;
          container.style.cursor = n ? 'pointer' : 'grab';
          updateGraphVisualization();
        })
        .onNodeRightClick(n => {
          event.preventDefault();
          // Context menu would go here
          console.log('Right-clicked node:', n);
        })
        .onBackgroundClick(() => {
          if (CONFIG.interactions.enableSelection) {
            clearSelection();
          }
        })
        .onZoom(zoom => {
          graphState.zoomLevel = zoom;
        })
        .width(container.clientWidth)
        .height(container.clientHeight)
        .linkDirectionalParticles(0)
        .cooldownTicks(CONFIG.graph.cooldownTicks)
        .enableZoomPanInteraction(CONFIG.interactions.enableZoom && CONFIG.interactions.enablePan)
        .zoomExtent([CONFIG.ui.zoom.min, CONFIG.ui.zoom.max])
        .zoom(CONFIG.ui.zoom.initial);

      // Use supported d3Force API for link distance and charge strength
      try {
        const linkForce = fg.d3Force('link');
        if (linkForce && typeof linkForce.distance === 'function') {
          linkForce.distance(CONFIG.graph.linkDistance);
        }
        const chargeForce = fg.d3Force('charge');
        if (chargeForce && typeof chargeForce.strength === 'function') {
          chargeForce.strength(CONFIG.graph.chargeStrength);
        }
        if (typeof fg.d3VelocityDecay === 'function') fg.d3VelocityDecay(CONFIG.graph.velocityDecay);
        if (typeof fg.d3AlphaDecay === 'function') fg.d3AlphaDecay(CONFIG.graph.alphaDecay);
        if (typeof fg.d3AlphaMin === 'function') fg.d3AlphaMin(CONFIG.graph.alphaMin);
      } catch (e) {
        console.warn('Force graph configuration failed:', e.message);
      }

      // Enhanced resize handling with debouncing
      let resizeTimeout;
      const onResize = () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
          fg.width(container.clientWidth);
          fg.height(container.clientHeight);
        }, CONFIG.ui.resizeDebounce);
      };
      
      window.addEventListener('resize', onResize);
      
      // Store graph instance for external access
      window.vrGraphInstance = fg;
      
      perfMonitor.end('Graph rendering');
    };
    
    script.onerror = () => {
      console.error('Failed to load ForceGraph library');
      container.innerHTML = '<div style="display: flex; align-items: center; justify-content: center; height: 100%; color: #9aa0a6; text-align: center;"><div>Failed to load graph visualization</div></div>';
    };
    
    document.body.appendChild(script);
  }

  // Enhanced auto-resize functionality with better performance
  function setupAutoResize() {
    let resizeTimeout;
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        perfMonitor.start();
        
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
            const finalWidth = Math.max(280, newPaneWidth);
            pane.style.width = finalWidth + 'px';
            try { localStorage.setItem('vrGraphW', String(finalWidth)); } catch {}
          }
          
          // Update CSS custom properties
          document.documentElement.style.setProperty('--vr-graph-w', paneWidth + 'px');
          
          // Trigger graph resize if it exists
          if (window.vrGraphInstance) {
            window.vrGraphInstance.width(pane.clientWidth);
            window.vrGraphInstance.height(pane.clientHeight);
          }
        }
        
        perfMonitor.end('Auto-resize');
      }, CONFIG.ui.resizeDebounce);
    };
    
    // Use ResizeObserver for better performance
    if (window.ResizeObserver) {
      const resizeObserver = new ResizeObserver(handleResize);
      const pane = document.getElementById('vrmines-graph-pane');
      if (pane) resizeObserver.observe(pane);
    } else {
      window.addEventListener('resize', handleResize);
    }
    
    handleResize(); // Initial call
  }
  
  // Enhanced hotkeys with better accessibility
  function setupHotkeys() {
    document.addEventListener('keydown', (e) => {
      const isMac = navigator.platform && navigator.platform.toUpperCase().includes('MAC');
      const mod = isMac ? e.metaKey : e.ctrlKey;
      
      // Toggle right graph sidebar: Cmd/Ctrl + /
      if (mod && (e.key === '/' || e.key === '?')) {
        e.preventDefault();
        const btn = document.getElementById('vrmines-graph-toggle');
        if (btn) {
          btn.click();
          // Announce to screen readers
          const announcement = document.createElement('div');
          announcement.setAttribute('aria-live', 'polite');
          announcement.setAttribute('aria-atomic', 'true');
          announcement.style.position = 'absolute';
          announcement.style.left = '-10000px';
          announcement.textContent = document.body.classList.contains('vrmines-graph-collapsed') ? 'Graph shown' : 'Graph hidden';
          document.body.appendChild(announcement);
          setTimeout(() => document.body.removeChild(announcement), 1000);
        }
      }
      
      // Focus search: Cmd/Ctrl + P
      if (mod && e.key && e.key.toLowerCase() === 'p') {
        e.preventDefault();
        const search = document.querySelector('input.md-search__input');
        const trigger = document.querySelector('label[for="__search"]');
        if (search) { 
          search.focus(); 
          search.select(); 
        } else if (trigger) { 
          trigger.click(); 
        }
      }
      
      // Focus graph pane: Cmd/Ctrl + G
      if (mod && e.key && e.key.toLowerCase() === 'g') {
        e.preventDefault();
        const canvas = document.getElementById('vrmines-graph-canvas');
        if (canvas) {
          canvas.focus();
          // Announce to screen readers
          const announcement = document.createElement('div');
          announcement.setAttribute('aria-live', 'polite');
          announcement.setAttribute('aria-atomic', 'true');
          announcement.style.position = 'absolute';
          announcement.style.left = '-10000px';
          announcement.textContent = 'Graph focused';
          document.body.appendChild(announcement);
          setTimeout(() => document.body.removeChild(announcement), 1000);
        }
      }
      
      // Escape to close graph
      if (e.key === 'Escape') {
        const pane = document.getElementById('vrmines-graph-pane');
        if (pane && !document.body.classList.contains('vrmines-graph-collapsed')) {
          const btn = document.getElementById('vrmines-graph-toggle');
          if (btn) btn.click();
        }
      }
    });
  }

  async function init() {
    perfMonitor.start();
    
    const pane = ensurePane();
    // Mark layout as active so CSS shifts content
    document.body.classList.add('vrmines-graph-active');
    
    // Restore persisted width and collapsed state
    try {
      const savedW = localStorage.getItem('vrGraphW');
      if (savedW) {
        const px = parseInt(savedW, 10);
        if (!Number.isNaN(px) && px >= 280) {
          document.documentElement.style.setProperty('--vr-graph-w', px + 'px');
          const paneEl = document.getElementById('vrmines-graph-pane');
          if (paneEl) paneEl.style.width = px + 'px';
        }
      }
      const savedCollapsed = localStorage.getItem('vrGraphCollapsed');
      if (savedCollapsed === 'true') {
        document.body.classList.add('vrmines-graph-collapsed');
      }
    } catch (e) {
      console.warn('Failed to restore graph preferences:', e.message);
    }
    
    setupAutoResize();
    setupHotkeys();
    
    // Load graph data with error handling
    try {
      const data = await loadGraph();
      if (data) {
        renderGraph(data);
      } else {
        const container = document.getElementById('vrmines-graph-canvas');
        if (container) {
          container.classList.remove('loading');
          container.innerHTML = '<div style="display: flex; align-items: center; justify-content: center; height: 100%; color: #9aa0a6; text-align: center;"><div>No graph data available</div></div>';
        }
      }
    } catch (e) {
      console.error('Failed to initialize graph:', e.message);
      const container = document.getElementById('vrmines-graph-canvas');
      if (container) {
        container.classList.remove('loading');
        container.innerHTML = '<div style="display: flex; align-items: center; justify-content: center; height: 100%; color: #ea4335; text-align: center;"><div>Error loading graph</div></div>';
      }
    }
    
    perfMonitor.end('Graph initialization');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();




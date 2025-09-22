---
uid: gravity-graph-guidelines
project: VR Mines
tags: [research/ux, graph-design, visualization, ui-guidelines]
updated: 2025-01-27
---

# Gravity Graph Design Guidelines — VR Mines Knowledge Network

> Comprehensive rules and best practices for force-directed graph visualization in the VR Mines Obsidian Second Brain interface.

## Core Principles

### 1. Visual Hierarchy
- **Central Node**: Current page (yellow, 8px radius, bold outline)
- **Neighbor Nodes**: Directly linked pages (blue, 6px radius, medium outline)
- **Secondary Nodes**: All other pages (gray, 4px radius, thin outline)
- **Isolated Nodes**: Unlinked pages (light gray, 3px radius, dotted outline)

### 2. Spatial Organization
- **Force Parameters**:
  - `linkDistance`: 80-120px (readable spacing)
  - `chargeStrength`: -300 to -500 (repulsion for clarity)
  - `velocityDecay`: 0.3-0.5 (smooth animation)
  - `cooldownTicks`: 100-150 (stable positioning)

### 3. Node Sizing Rules
```javascript
// Node radius based on importance and connection count
const getNodeRadius = (node, isCurrent, isNeighbor, connectionCount) => {
  if (isCurrent) return 8;           // Current page - largest
  if (isNeighbor) return 6;          // Direct neighbors - medium
  if (connectionCount > 5) return 5; // Highly connected - slightly larger
  if (connectionCount > 2) return 4; // Moderately connected - standard
  return 3;                          // Isolated nodes - smallest
};
```

### 4. Color Coding System
- **Current Page**: `#ffcc00` (gold) - maximum visibility
- **Neighbors**: `#66ccff` (light blue) - high visibility
- **Connected**: `#8899aa` (medium gray) - moderate visibility
- **Isolated**: `#556677` (dark gray) - low visibility
- **Links**: `rgba(136,153,170,0.4)` (semi-transparent gray)

### 5. Interaction Patterns
- **Hover**: Scale up 1.2x, add glow effect
- **Click**: Navigate to page, update graph
- **Drag**: Reposition node, maintain connections
- **Zoom**: Scale entire graph, maintain proportions

## Layout Optimization

### 6. Force-Directed Algorithm Tuning
```javascript
const forceConfig = {
  linkDistance: 100,        // Optimal reading distance
  chargeStrength: -400,     // Prevents overlap
  velocityDecay: 0.4,       // Smooth settling
  alphaDecay: 0.02,         // Gradual cooling
  alphaMin: 0.01,           // Stop threshold
  cooldownTicks: 120        // Stability period
};
```

### 7. Clustering Strategy
- **Related Topics**: Group by tags or categories
- **Visual Clusters**: Use color coding for topic areas
- **Collapsible Groups**: Allow expansion/collapse of clusters
- **Minimum Distance**: 50px between cluster centers

### 8. Performance Optimization
- **Node Limit**: Maximum 200 nodes visible at once
- **LOD System**: Simplify distant nodes
- **Animation**: 60fps target, smooth transitions
- **Memory**: Efficient data structures, cleanup on navigation

## Responsive Design Rules

### 9. Screen Size Adaptations
- **Desktop (>1200px)**: Full graph sidebar (25-30% width)
- **Tablet (768-1200px)**: Reduced graph (20% width)
- **Mobile (<768px)**: Collapsible graph overlay
- **Ultra-wide (>1600px)**: Extended graph with more nodes

### 10. Content Protection
- **Minimum Content Width**: 60% of viewport
- **Graph Max Width**: 35% of viewport
- **Overflow Handling**: Horizontal scroll for content
- **Breakpoint**: Hide graph below 768px width

## Accessibility Guidelines

### 11. Visual Accessibility
- **Contrast Ratio**: Minimum 4.5:1 for all text
- **Color Blindness**: Use patterns/shapes in addition to color
- **Focus Indicators**: Clear focus states for keyboard navigation
- **High Contrast Mode**: Alternative color schemes

### 12. Interaction Accessibility
- **Keyboard Navigation**: Tab through nodes, Enter to select
- **Screen Reader**: ARIA labels for all interactive elements
- **Voice Control**: Voice commands for graph navigation
- **Motor Accessibility**: Large click targets (minimum 44px)

## Implementation Checklist

### 13. Technical Requirements
- [ ] Force-directed layout algorithm (D3.js or custom)
- [ ] Responsive CSS with proper breakpoints
- [ ] JavaScript event handling for interactions
- [ ] Performance monitoring and optimization
- [ ] Cross-browser compatibility testing

### 14. UX Validation
- [ ] User testing with 5+ participants
- [ ] A/B testing for different layouts
- [ ] Performance metrics (load time, frame rate)
- [ ] Accessibility audit (WCAG 2.1 AA)
- [ ] Mobile device testing

## Quality Metrics

### 15. Success Criteria
- **Clarity**: 90% of users can identify current page within 2 seconds
- **Navigation**: 80% of users can find target page within 3 clicks
- **Performance**: 60fps on mid-range devices
- **Accessibility**: Passes automated accessibility tests
- **Responsiveness**: Works on 95% of target devices

## References

- [D3.js Force Simulation](https://observablehq.com/@d3/force-directed-graph)
- [Graph Visualization Best Practices](https://cambridge-intelligence.com/a-guide-to-graph-ux/)
- [Web Content Accessibility Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [Responsive Design Patterns](https://bradfrost.com/blog/web/responsive-design-patterns/)

---

*This document serves as the canonical reference for all graph visualization decisions in the VR Mines project.*

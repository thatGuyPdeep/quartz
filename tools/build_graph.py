import json
import os
import re
from pathlib import Path
from datetime import datetime
from collections import defaultdict


DOCS_DIR = Path(__file__).resolve().parents[1] / "docs"
OUT_FILE = DOCS_DIR / "assets" / "graph" / "graph.json"


WIKI_LINK_RE = re.compile(r"\[\[([^\]|#]+)(?:\|[^\]]+)?\]\]")

# Enhanced configuration for node categorization and importance
CATEGORY_MAPPING = {
    "00_Home": "home",
    "40_Daily": "daily", 
    "70_Project_Documentation": "project",
    "80_Research_Notes": "research",
    "90_Roadmap_Updates": "roadmap",
    "30_Templates": "templates",
    "Publish": "publish",
    "60_Devlog_Content": "devlog"
}

IMPORTANCE_KEYWORDS = {
    "critical": ["index", "main", "dashboard", "moc", "gdd"],
    "high": ["setup", "guide", "tutorial", "overview", "analysis"],
    "medium": ["template", "notes", "research", "roadmap"],
    "low": ["profile", "about", "readme"]
}

TAG_PATTERNS = {
    "vr": ["vr", "virtual", "reality", "quest", "meta"],
    "mines": ["mine", "mining", "coal", "simulator"],
    "dots": ["dots", "ecs", "entity", "component"],
    "unity": ["unity", "game", "engine"],
    "training": ["training", "education", "learning"],
    "research": ["research", "study", "analysis"],
    "tutorial": ["tutorial", "guide", "setup", "how-to"],
    "template": ["template", "boilerplate", "example"]
}


def find_title(markdown_path: Path) -> str:
    try:
        with markdown_path.open("r", encoding="utf-8") as f:
            for line in f:
                line = line.strip()
                if line.startswith("# "):
                    return line[2:].strip()
    except Exception:
        pass
    return markdown_path.stem.replace("_", " ")


def categorize_node(node_id: str) -> str:
    """Determine the category of a node based on its path."""
    for prefix, category in CATEGORY_MAPPING.items():
        if node_id.startswith(prefix):
            return category
    return "other"


def determine_importance(node_id: str, title: str) -> str:
    """Determine the importance level of a node based on its path and title."""
    content = (node_id + " " + title).lower()
    
    for importance, keywords in IMPORTANCE_KEYWORDS.items():
        if any(keyword in content for keyword in keywords):
            return importance
    return "medium"


def extract_tags(node_id: str, title: str) -> list:
    """Extract relevant tags based on content analysis."""
    content = (node_id + " " + title).lower()
    tags = []
    
    for tag, patterns in TAG_PATTERNS.items():
        if any(pattern in content for pattern in patterns):
            tags.append(tag)
    
    # Add specific tags based on path patterns
    if "daily" in node_id:
        tags.append("daily")
    if "meeting" in node_id:
        tags.append("meeting")
    if "gdd" in node_id:
        tags.append("gdd")
    if "backlog" in node_id:
        tags.append("backlog")
    
    return list(set(tags))  # Remove duplicates


def calculate_edge_weight(from_id: str, to_id: str) -> int:
    """Calculate edge weight based on relationship type."""
    # Higher weights for more important connections
    if "index" in from_id.lower() or "main" in from_id.lower():
        return 2
    if "moc" in from_id.lower():
        return 2
    return 1


def determine_edge_type(from_id: str, to_id: str) -> str:
    """Determine the type of relationship between nodes."""
    if "index" in from_id.lower():
        return "index"
    if "moc" in from_id.lower():
        return "moc"
    if "daily" in from_id.lower():
        return "daily"
    if "research" in from_id.lower():
        return "research"
    if "template" in from_id.lower():
        return "template"
    if "gdd" in from_id.lower():
        return "gdd"
    return "reference"


def normalize_target(current_md: Path, link_text: str) -> Path | None:
    # If link already includes extension, keep it, else append .md
    candidate = link_text
    if not candidate.endswith(".md"):
        candidate = candidate + ".md"
    # Join relative to current file directory
    joined = (current_md.parent / candidate)
    # Normalize path (handle ./ and ../)
    norm = Path(os.path.normpath(joined))
    # Ensure it resides under docs
    try:
        norm.relative_to(DOCS_DIR)
    except Exception:
        return None
    if norm.exists():
        return norm
    return None


def md_paths(root: Path):
    for p in root.rglob("*.md"):
        yield p


def main():
    nodes = {}
    edges = set()
    category_counts = defaultdict(int)

    # Precreate output directory
    OUT_FILE.parent.mkdir(parents=True, exist_ok=True)

    all_md = list(md_paths(DOCS_DIR))
    path_to_id = {}

    # Assign node ids and titles with enhanced metadata
    for md in all_md:
        rel = md.relative_to(DOCS_DIR).as_posix()
        node_id = rel
        path_to_id[md] = node_id
        title = find_title(md)
        # Web path without .md, trailing slash
        web_path = rel[:-3] + "/"
        
        # Enhanced node data
        category = categorize_node(node_id)
        importance = determine_importance(node_id, title)
        tags = extract_tags(node_id, title)
        
        category_counts[category] += 1
        
        nodes[node_id] = {
            "id": node_id,
            "label": title,
            "path": web_path,
            "category": category,
            "importance": importance,
            "tags": tags
        }

    # Extract links with enhanced metadata
    for md in all_md:
        try:
            content = md.read_text(encoding="utf-8")
        except Exception:
            continue

        for match in WIKI_LINK_RE.finditer(content):
            target_text = match.group(1).strip()
            target = normalize_target(md, target_text)
            if not target:
                continue
            if target not in path_to_id:
                continue
            src_id = path_to_id[md]
            dst_id = path_to_id[target]
            if src_id != dst_id:
                weight = calculate_edge_weight(src_id, dst_id)
                edge_type = determine_edge_type(src_id, dst_id)
                edges.add((src_id, dst_id, weight, edge_type))

    # Create enhanced graph data structure
    data = {
        "metadata": {
            "version": "2.0",
            "generated": datetime.now().isoformat() + "Z",
            "totalNodes": len(nodes),
            "totalEdges": len(edges),
            "description": "VR Mines Knowledge Graph - Enhanced visualization with improved UI/UX",
            "categories": dict(category_counts)
        },
        "nodes": list(nodes.values()),
        "edges": [
            {
                "from": a, 
                "to": b, 
                "weight": weight, 
                "type": edge_type
            } 
            for (a, b, weight, edge_type) in edges
        ],
    }

    # Write pretty-printed JSON
    OUT_FILE.write_text(
        json.dumps(data, ensure_ascii=False, indent=2), 
        encoding="utf-8"
    )
    print(f"Wrote enhanced graph with {len(nodes)} nodes and {len(edges)} edges to {OUT_FILE}")
    print(f"Categories: {dict(category_counts)}")


if __name__ == "__main__":
    main()




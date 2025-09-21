import json
import os
import re
from pathlib import Path


DOCS_DIR = Path(__file__).resolve().parents[1] / "docs"
OUT_FILE = DOCS_DIR / "assets" / "graph" / "graph.json"


WIKI_LINK_RE = re.compile(r"\[\[([^\]|#]+)(?:\|[^\]]+)?\]\]")


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

    # Precreate output directory
    OUT_FILE.parent.mkdir(parents=True, exist_ok=True)

    all_md = list(md_paths(DOCS_DIR))
    path_to_id = {}

    # Assign node ids and titles
    for md in all_md:
        rel = md.relative_to(DOCS_DIR).as_posix()
        node_id = rel
        path_to_id[md] = node_id
        title = find_title(md)
        # Web path without .md, trailing slash
        web_path = rel[:-3] + "/"
        nodes[node_id] = {
            "id": node_id,
            "label": title,
            "path": web_path,
        }

    # Extract links
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
                edges.add((src_id, dst_id))

    data = {
        "nodes": list(nodes.values()),
        "edges": [{"from": a, "to": b} for (a, b) in edges],
    }

    OUT_FILE.write_text(json.dumps(data, ensure_ascii=False, separators=(",", ":")), encoding="utf-8")
    print(f"Wrote graph with {len(nodes)} nodes and {len(edges)} edges to {OUT_FILE}")


if __name__ == "__main__":
    main()




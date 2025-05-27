import os
import json
import re
from pathlib import Path

repo_context = {
    "structure": {},
    "files": [],
    "dependencies": set()
}

IMPORT_RE = re.compile(r'^\s*(?:import|require)\s+(?:.*?from\s+)?[\'"](.*?)[\'"];?', re.MULTILINE)
FUNCTION_RE = re.compile(r'\bfunction\s+(\w+)\s*\(|const\s+(\w+)\s*=\s*\(?.*?\)?\s*=>')
EXPORT_RE = re.compile(r'\bexport\s+(default\s+)?(function|const|class)\s+(\w+)', re.MULTILINE)

def classify_import(imp):
    return "internal" if imp.startswith('.') or imp.startswith('/') else "external"

def classify_js_file(content):
    if "useState" in content or "React" in content or "react-native" in content:
        return "React component"
    if "NavigationContainer" in content or "createStackNavigator" in content:
        return "Navigation config"
    if "axios" in content or "fetch(" in content:
        return "API handler"
    return "Utility or logic"

def summarize_js_file(path):
    try:
        with open(path, 'r', encoding='utf-8') as f:
            content = f.read()

        imports = IMPORT_RE.findall(content)
        functions = [fn for pair in FUNCTION_RE.findall(content) for fn in pair if fn]
        exports = EXPORT_RE.findall(content)
        export_names = [e[2] for e in exports]
        import_types = [{"module": imp, "type": classify_import(imp)} for imp in imports]

        repo_context["dependencies"].update([imp for imp in imports if classify_import(imp) == "external"])

        return {
            "path": str(Path(path).relative_to(Path.cwd())),
            "file_type": "code",
            "summary": classify_js_file(content),
            "functions": functions,
            "exports": export_names,
            "imports": import_types,
            "metadata": {
                "lines": len(content.splitlines()),
                "extension": Path(path).suffix,
                "language": "TypeScript" if path.endswith(".ts") else "JavaScript",
                "is_react_component": "React" in content
            },
            "tags": list(set(classify_js_file(content).split()))
        }

    except Exception as e:
        return {
            "path": str(Path(path).relative_to(Path.cwd())),
            "error": str(e)
        }

def summarize_md_file(path):
    try:
        with open(path, 'r', encoding='utf-8') as f:
            lines = f.readlines()

        headers = [line.strip() for line in lines if line.strip().startswith("#")]
        has_code = any("```" in line for line in lines)
        has_links = any("http" in line or "](" in line for line in lines)
        has_table = any("|" in line and "---" in line for line in lines)

        return {
            "path": str(Path(path).relative_to(Path.cwd())),
            "file_type": "markdown",
            "summary": headers[0] if headers else "Untitled markdown document",
            "headers": headers,
            "metadata": {
                "line_count": len(lines),
                "has_code_blocks": has_code,
                "has_links": has_links,
                "has_tables": has_table
            },
            "tags": ["documentation", "markdown"] + (["docs"] if "readme" in path.lower() else [])
        }

    except Exception as e:
        return {
            "path": str(Path(path).relative_to(Path.cwd())),
            "error": str(e)
        }

def build_structure(path, mmd_lines, depth=0, parent=None):
    structure = {}
    for item in sorted(os.listdir(path)):
        if item.startswith('.'):
            continue

        full_path = os.path.join(path, item)
        current = f"{item.replace('.', '_')}_{depth}"

        if parent:
            mmd_lines.append(f"{parent} --> {current}")

        if os.path.isdir(full_path):
            structure[item] = build_structure(full_path, mmd_lines, depth + 1, current)
        else:
            structure[item] = None
            if item.endswith(('.js', '.ts', '.tsx')):
                repo_context["files"].append(summarize_js_file(full_path))
            elif item.endswith('.md'):
                repo_context["files"].append(summarize_md_file(full_path))
    return structure

def write_mermaid(mmd_lines):
    header = ["```mermaid", "graph TD"]
    footer = ["```"]
    with open("output/repo_structure.mmd", "w", encoding="utf-8") as f:
        f.write("\n".join(header + mmd_lines + footer))

def write_markdown_summary():
    lines = ["# 📄 Repo Summary", ""]
    lines.append("## 📁 File Overviews\n")
    for file in repo_context["files"]:
        lines.append(f"### `{file['path']}`")
        lines.append(f"- Type: {file.get('file_type', 'unknown')}")
        lines.append(f"- Summary: {file.get('summary', 'N/A')}")
        if file["file_type"] == "code":
            lines.append(f"- Functions: {', '.join(file.get('functions', [])) or 'None'}")
            lines.append(f"- Exports: {', '.join(file.get('exports', [])) or 'None'}")
        elif file["file_type"] == "markdown":
            lines.append(f"- Headers: {', '.join(file.get('headers', [])) or 'None'}")
        lines.append("")

    lines.append("## 📦 Dependencies\n")
    for dep in sorted(repo_context["dependencies"]):
        lines.append(f"- {dep}")

    with open("output/repo_summary.md", "w", encoding="utf-8") as f:
        f.write("\n".join(lines))

def main():
    os.makedirs("output", exist_ok=True)
    mmd_lines = []
    repo_context["structure"] = build_structure(Path(".").resolve(), mmd_lines)
    repo_context["dependencies"] = sorted(repo_context["dependencies"])

    with open("output/repo_context.json", "w", encoding="utf-8") as f:
        json.dump(repo_context, f, indent=2)

    write_mermaid(mmd_lines)
    write_markdown_summary()
    print("✅ Full repo context, diagram, and summary written to /output")

if __name__ == "__main__":
    main()

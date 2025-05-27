import os
import json
import re
from pathlib import Path

repo_context = {
    "structure": {},
    "files": [],
    "dependencies": set()
}

# Simple regexes to extract basic JS/TS structure
IMPORT_RE = re.compile(r'^\s*(?:import|require)\s+(.*?)(?:from)?\s*[\'"](.*?)[\'"];?', re.MULTILINE)
FUNCTION_RE = re.compile(r'\bfunction\s+(\w+)\s*\(|const\s+(\w+)\s*=\s*\(?.*?\)?\s*=>')

def summarize_js_file(path):
    try:
        with open(path, 'r', encoding='utf-8') as f:
            content = f.read()

        imports = IMPORT_RE.findall(content)
        import_modules = [imp[1] for imp in imports]
        functions = [fn for pair in FUNCTION_RE.findall(content) for fn in pair if fn]

        repo_context["dependencies"].update(import_modules)

        return {
            "path": str(path),
            "functions": functions,
            "imports": import_modules
        }

    except Exception as e:
        return {
            "path": str(path),
            "error": str(e)
        }

def build_structure(path):
    structure = {}
    for item in sorted(os.listdir(path)):
        full_path = os.path.join(path, item)
        if os.path.isdir(full_path):
            structure[item] = build_structure(full_path)
        else:
            structure[item] = None
            if item.endswith(('.js', '.ts', '.tsx')):
                summary = summarize_js_file(full_path)
                repo_context["files"].append(summary)
    return structure

def main():
    root_path = Path(".").resolve()
    repo_context["structure"] = build_structure(root_path)
    repo_context["dependencies"] = sorted(set(repo_context["dependencies"]))

    os.makedirs("output", exist_ok=True)
    with open("output/repo_context.json", "w", encoding="utf-8") as f:
        json.dump(repo_context, f, indent=2)

    print("✅ JS/TS repo context written to output/repo_context.json")

if __name__ == "__main__":
    main()

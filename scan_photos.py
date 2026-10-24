"""扫描 pics/，生成 photos.js —— 会保留已有顺序，新照片只追加到末尾。

用法：
  1. 把她的新照片放进 pics/
  2. 运行：python scan_photos.py
  3. 刷新页面

手动改顺序：编辑 photos.js 里数组的先后。
拖动调位置：页面里拖卡片（浏览器会记住）。
"""
from pathlib import Path
import json
import re
import time

ROOT = Path(__file__).resolve().parent
PICS = ROOT / "pics"
OUT = ROOT / "photos.js"
EXTS = {".jpg", ".jpeg", ".png", ".webp", ".gif"}
SKIP_NAMES = {"anime-couple", "placeholder", "album cover", "icon"}


def strip_query(path: str) -> str:
    return path.split("?", 1)[0]


def load_existing_order():
    """读取 photos.js 里已有的路径顺序（去掉 ?v=）。"""
    if not OUT.exists():
        return []
    text = OUT.read_text(encoding="utf-8")
    m = re.search(r"window\.LOVE_PHOTOS\s*=\s*(\[[\s\S]*?\]);", text)
    if not m:
        return []
    try:
        arr = json.loads(m.group(1))
    except json.JSONDecodeError:
        return []
    return [strip_query(p) for p in arr]


def main():
    disk = {}
    for f in PICS.iterdir():
        if not f.is_file() or f.suffix.lower() not in EXTS:
            continue
        if any(s in f.stem.lower() for s in SKIP_NAMES):
            continue
        disk[f"pics/{f.name}"] = f

    old_order = load_existing_order()
    ordered = []
    seen = set()

    # 1) 先按旧顺序保留还存在的文件
    for rel in old_order:
        if rel in disk:
            ordered.append(rel)
            seen.add(rel)

    # 2) 新文件追加到末尾（按文件名）
    for rel in sorted(disk.keys()):
        if rel not in seen:
            ordered.append(rel)
            seen.add(rel)

    ver = int(time.time())
    paths = [f"{rel}?v={ver}" for rel in ordered]
    OUT.write_text(
        "// 【保留顺序】已有照片顺序不变，新照片追加在末尾\n"
        "// 手动换序：上下移动下面的路径即可\n"
        "window.LOVE_PHOTOS = "
        + json.dumps(paths, ensure_ascii=False, indent=2)
        + ";\n",
        encoding="utf-8",
    )
    print(f"Kept order: {len(old_order)} existing, total {len(paths)} -> {OUT.name}")


if __name__ == "__main__":
    main()

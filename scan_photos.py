"""扫描 pics/，生成缩略图 + photos.js（保留顺序，新照片追加末尾）"""
from pathlib import Path
import json
import re
import time
from PIL import Image, ImageOps

ROOT = Path(__file__).resolve().parent
PICS = ROOT / "pics"
THUMBS = PICS / "thumbs"
OUT = ROOT / "photos.js"
EXTS = {".jpg", ".jpeg", ".png", ".webp", ".gif"}
SKIP_NAMES = {"anime-couple", "placeholder", "album cover", "icon"}
MAX_SIDE = 420


def strip_query(path: str) -> str:
    return path.split("?", 1)[0]


def load_existing_order():
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
    # normalize thumbs/xxx or pics/xxx -> basename key
    order = []
    for p in arr:
        name = Path(strip_query(p)).name
        order.append(name)
    return order


def make_thumb(src: Path) -> Path:
    THUMBS.mkdir(exist_ok=True)
    out = THUMBS / (src.stem + ".jpg")
    im = Image.open(src)
    im = ImageOps.exif_transpose(im).convert("RGB")
    im.thumbnail((MAX_SIDE, MAX_SIDE), Image.Resampling.LANCZOS)
    im.save(out, "JPEG", quality=72, optimize=True, progressive=True)
    return out


def main():
    disk = {}
    for f in PICS.iterdir():
        if not f.is_file() or f.suffix.lower() not in EXTS:
            continue
        if any(s in f.stem.lower() for s in SKIP_NAMES):
            continue
        if f.parent.name == "thumbs":
            continue
        disk[f.name] = f

    old_names = load_existing_order()
    ordered_files = []
    seen = set()
    for name in old_names:
        # old list may be photo-001.jpg
        if name in disk:
            ordered_files.append(disk[name])
            seen.add(name)
    for name in sorted(disk.keys()):
        if name not in seen:
            ordered_files.append(disk[name])
            seen.add(name)

    ver = int(time.time())
    paths = []
    for src in ordered_files:
        thumb = make_thumb(src)
        paths.append(f"pics/thumbs/{thumb.name}?v={ver}")

    OUT.write_text(
        "// 【保留顺序】缩略图加速手机加载；原图仍在 pics/\n"
        "window.LOVE_PHOTOS = "
        + json.dumps(paths, ensure_ascii=False, indent=2)
        + ";\n",
        encoding="utf-8",
    )
    print(f"Thumbs ready: {len(paths)} -> {OUT.name}")


if __name__ == "__main__":
    main()

"""Check catalogue structure and local activity assets without dependencies."""
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SLUG = re.compile(r"^[a-z0-9]+(?:-[a-z0-9]+)*$")


def require(condition, message):
    if not condition:
        raise ValueError(message)


def children(parent, key, location):
    require(isinstance(parent, dict), f"{location}: expected an object")
    items = parent.get(key)
    require(isinstance(items, list), f"{location}: {key} must be an array")
    seen = set()
    for item in items:
        require(isinstance(item, dict), f"{location}: entries must be objects")
        slug = item.get("id", "")
        require(isinstance(slug, str) and SLUG.fullmatch(slug), f"{location}: invalid id {slug!r}")
        require(slug not in seen, f"{location}: duplicate id {slug!r}")
        seen.add(slug)
    return items


def text(item, keys, location):
    for key in keys:
        require(isinstance(item.get(key), str) and item[key].strip(), f"{location}: {key} is required")


def local_file(value, location, directory=False):
    require(isinstance(value, str) and value and not value.startswith(("/", "\\")) and ":" not in value,
            f"{location}: use a path relative to the platform root")
    path = (ROOT / value).resolve()
    require(path.is_relative_to(ROOT), f"{location}: path leaves the repository")
    if directory and path.is_dir():
        path = path / "index.html"
    require(path.is_file(), f"{location}: missing file {value!r}")
    if directory:
        require(path.suffix == ".html", f"{location}: activity must link to an HTML page or its folder")


def validate():
    catalog = json.loads((ROOT / "catalog.json").read_text())
    count = 0
    for year in children(catalog, "years", "catalogue"):
        path = year["id"]
        text(year, ("name", "shortName"), path)
        for subject in children(year, "subjects", path):
            subject_path = path + "/" + subject["id"]
            text(subject, ("name", "description"), subject_path)
            for topic in children(subject, "topics", subject_path):
                topic_path = subject_path + "/" + topic["id"]
                text(topic, ("name", "description"), topic_path)
                activities = children(topic, "activities", topic_path)
                if "primaryActivity" in topic:
                    require(any(activity["id"] == topic["primaryActivity"] for activity in activities),
                            f"{topic_path}: primaryActivity must reference an activity in this topic")
                for activity in activities:
                    activity_path = topic_path + "/" + activity["id"]
                    text(activity, ("title", "description", "format", "duration", "href"), activity_path)
                    local_file(activity["href"], activity_path, directory=True)
                    if "image" in activity:
                        local_file(activity["image"], activity_path + " image")
                    count += 1
    print(f"Catalogue valid: {len(catalog['years'])} years, {count} activity entries; all local links and images exist.")


if __name__ == "__main__":
    try:
        validate()
    except (ValueError, OSError, TypeError) as error:
        raise SystemExit(f"Catalogue error: {error}") from None

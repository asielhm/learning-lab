"""Validate Learning Lab revision banks using only the Python standard library."""
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
BANKS = {
    "algebra.json": "algebra",
    **{f"{unit}.json": unit for unit in ("numbers-i", "geometry-i", "numbers-ii", "algebra-i", "numbers-iii")},
    "circulatory.json": "circulatory-system",
    "breathing.json": "breathing-system",
    "gas-laws.json": "gas-laws",
    **{f"{unit}.json": unit for unit in ("y10-acids-bases", "y10-metals", "y10-redox", "y10-organic")},
}
DIFFICULTIES = {"Foundation", "Application", "Challenge"}


def require(condition, message):
    if not condition:
        raise ValueError(message)


def nonempty(value):
    return isinstance(value, str) and bool(value.strip())


def validate_bank(path, expected_topic):
    bank = json.loads(path.read_text())
    label = path.name
    require(isinstance(bank, dict), f"{label}: bank must be an object")
    require(bank.get("topicId") == expected_topic, f"{label}: incorrect topicId")
    require(nonempty(bank.get("title")), f"{label}: title is required")
    categories = bank.get("categories")
    require(isinstance(categories, list) and categories, f"{label}: categories must be a nonempty array")
    require(all(nonempty(category) for category in categories), f"{label}: invalid category")
    require(len(categories) == len(set(categories)), f"{label}: duplicate category")
    questions = bank.get("questions")
    require(isinstance(questions, list) and len(questions) >= 50, f"{label}: at least 50 questions required")
    seen_ids, seen_prompts, used_categories = set(), set(), set()
    positions = [0, 0, 0, 0]
    for question in questions:
        require(isinstance(question, dict), f"{label}: question must be an object")
        identifier = question.get("id")
        require(nonempty(identifier), f"{label}: question id required")
        location = f"{label}/{identifier}"
        require(identifier not in seen_ids, f"{location}: duplicate id")
        seen_ids.add(identifier)
        prompt = question.get("prompt")
        require(nonempty(prompt), f"{location}: prompt required")
        require(prompt.casefold().strip() not in seen_prompts, f"{location}: duplicate question prompt")
        seen_prompts.add(prompt.casefold().strip())
        category = question.get("category")
        require(category in categories, f"{location}: unknown category")
        used_categories.add(category)
        require(question.get("difficulty") in DIFFICULTIES, f"{location}: unknown difficulty")
        options = question.get("options")
        require(isinstance(options, list) and len(options) == 4, f"{location}: four options required")
        require(all(nonempty(option) for option in options), f"{location}: invalid option")
        require(len({option.casefold().strip() for option in options}) == 4, f"{location}: duplicate options")
        answer = question.get("answer")
        require(type(answer) is int and 0 <= answer < 4, f"{location}: answer must be an index from 0 to 3")
        positions[answer] += 1
        require(nonempty(question.get("explanation")), f"{location}: explanation required")
    require(used_categories == set(categories), f"{label}: unused category")
    require(all(positions), f"{label}: correct answers must use all four positions")
    print(f"{label}: {len(questions)} questions, {len(categories)} categories; answer positions {positions}")
    return len(questions)


def validate():
    total = sum(
        validate_bank(ROOT / "assets" / "revision" / "questions" / filename, topic)
        for filename, topic in BANKS.items()
    )
    print(f"Revision banks valid: {total} questions total.")


if __name__ == "__main__":
    try:
        validate()
    except (ValueError, OSError, TypeError) as error:
        raise SystemExit(f"Revision bank error: {error}") from None

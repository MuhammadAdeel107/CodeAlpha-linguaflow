MAX_TEXT_LENGTH = 5000


SUPPORTED_LANGUAGES = {
    "en": "English",
    "ur": "Urdu",
    "ar": "Arabic",
    "hi": "Hindi",
    "es": "Spanish",
    "fr": "French",
    "de": "German",
    "it": "Italian",
    "pt": "Portuguese",
    "zh": "Chinese",
    "ja": "Japanese",
    "ko": "Korean",
    "ru": "Russian",
    "tr": "Turkish",
}


def validate_text(text: str) -> str | None:
    if not text:
        return "Please enter some text."

    if len(text) > MAX_TEXT_LENGTH:
        return (
            f"Maximum {MAX_TEXT_LENGTH} "
            "characters are allowed."
        )

    return None


def validate_language(language: str) -> bool:
    return language in SUPPORTED_LANGUAGES
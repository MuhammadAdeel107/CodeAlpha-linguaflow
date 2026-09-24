import os

import requests
from dotenv import load_dotenv

load_dotenv()


class TranslationService:

    def __init__(self):
        self.api_url = os.getenv(
            "LIBRETRANSLATE_URL",
            "http://localhost:5000",
        ).rstrip("/")

    def translate(
        self,
        text: str,
        target_language: str,
        source_language: str | None = None,
    ) -> dict:

        source = source_language or "auto"

        payload = {
            "q": text,
            "source": source,
            "target": target_language,
            "format": "text",
        }

        response = requests.post(
            f"{self.api_url}/translate",
            json=payload,
            timeout=60,
        )

        if not response.ok:
            try:
                error_data = response.json()
                error_message = error_data.get(
                    "error",
                    "Translation request failed.",
                )
            except ValueError:
                error_message = (
                    "Translation request failed."
                )

            raise RuntimeError(error_message)

        data = response.json()

        translated_text = data.get(
            "translatedText",
            "",
        )

        if not translated_text:
            raise RuntimeError(
                "No translation returned."
            )

        detected_language = ""

        detected_data = data.get(
            "detectedLanguage"
        )

        if isinstance(detected_data, dict):
            detected_language = detected_data.get(
                "language",
                "",
            )

        elif isinstance(detected_data, list):
            if detected_data:
                detected_language = (
                    detected_data[0].get(
                        "language",
                        "",
                    )
                )

        return {
            "translation": translated_text,
            "detected_language": (
                detected_language
                or source_language
                or ""
            ),
        }
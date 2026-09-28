import requests


class TranslationService:

    API_URL = "https://api.mymemory.translated.net/get"

    def translate(
        self,
        text: str,
        target_language: str,
        source_language: str | None = None,
    ) -> dict:

        source = source_language or "en"

        params = {
            "q": text,
            "langpair": f"{source}|{target_language}",
        }

        response = requests.get(
            self.API_URL,
            params=params,
            timeout=30,
        )

        if not response.ok:
            raise RuntimeError(
                "Translation service request failed."
            )

        data = response.json()

        if data.get("responseStatus") != 200:
            raise RuntimeError(
                data.get(
                    "responseDetails",
                    "Translation failed.",
                )
            )

        translated_text = (
            data.get("responseData", {})
            .get("translatedText", "")
        )

        if not translated_text:
            raise RuntimeError(
                "No translation returned."
            )

        return {
            "translation": translated_text,
            "detected_language": source,
        }
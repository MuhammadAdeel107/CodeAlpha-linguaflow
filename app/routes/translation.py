from flask import (
    Blueprint,
    jsonify,
    render_template,
    request,
)

from app.services.translator import (
    TranslationService,
)

from app.utils.validators import (
    SUPPORTED_LANGUAGES,
    validate_language,
    validate_text,
)


translation_bp = Blueprint(
    "translation",
    __name__,
)


translator_service = None


def get_translator():
    global translator_service

    if translator_service is None:
        translator_service = TranslationService()

    return translator_service


@translation_bp.get("/")
def home():

    return render_template(
        "index.html",
        languages=SUPPORTED_LANGUAGES,
    )


@translation_bp.get("/api/health")
def health():

    return jsonify({
        "status": "ok",
        "service": "linguaflow",
    })


@translation_bp.post("/api/translate")
def translate():

    data = request.get_json(
        silent=True
    ) or {}

    text = str(
        data.get("text", "")
    ).strip()

    source_language = str(
        data.get("source_language", "")
    ).strip()

    target_language = str(
        data.get("target_language", "")
    ).strip()

    text_error = validate_text(text)

    if text_error:

        return jsonify({
            "error": text_error,
        }), 400

    if not validate_language(
        target_language
    ):

        return jsonify({
            "error": "Invalid target language.",
        }), 400

    if (
        source_language
        and not validate_language(
            source_language
        )
    ):

        return jsonify({
            "error": "Invalid source language.",
        }), 400

    if (
        source_language
        and source_language == target_language
    ):

        return jsonify({
            "translation": text,
            "detected_language": source_language,
        })

    try:

        result = get_translator().translate(
            text=text,
            target_language=target_language,
            source_language=(
                source_language or None
            ),
        )

        return jsonify(result)

    except Exception as error:

        import traceback

        traceback.print_exc()

        return jsonify({
            "error": str(error),
        }), 502
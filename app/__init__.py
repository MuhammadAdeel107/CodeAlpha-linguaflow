from flask import Flask


def create_app():
    app = Flask(
        __name__,
        template_folder="../templates",
        static_folder="../static",
        static_url_path="/static",
    )

    from app.routes.translation import translation_bp

    app.register_blueprint(translation_bp)

    return app
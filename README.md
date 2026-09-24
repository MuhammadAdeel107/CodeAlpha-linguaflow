LinguaFlow
A modern, responsive language translation web application built with **Python, Flask, JavaScript, HTML5, and
CSS3**.
LinguaFlow provides a clean interface for translating text between multiple supported languages, with features
such as automatic language detection, language swapping, translation history, dark mode, copy functionality, input
validation, and a REST API.
Features
• Multi-language text translation
• Automatic source language detection
• Source and target language selection
• Language swap functionality
• Translation history using browser storage
• Copy translated text
• Character counter with a 5,000-character limit
• Input validation
• Loading and error states
• Responsive user interface
• Dark mode
• Mobile-friendly navigation
• REST API endpoints
• Health check endpoint
• Modular Flask architecture
• Automated testing with pytest
• Vercel deployment configuration
Supported Languages
| Code | Language |
| --- | --- |
| `en` | English |
| `ur` | Urdu |
| `ar` | Arabic |
| `hi` | Hindi |
| `es` | Spanish |
| `fr` | French |
| `de` | German |
| `it` | Italian |
| `pt` | Portuguese |
| `zh` | Chinese |
| `ja` | Japanese |
| `ko` | Korean |
| `ru` | Russian |
| `tr` | Turkish |
Technology Stack
Backend
• Python 3.14
• Flask
• Requests
• python-dotenv
Translation Service
• LibreTranslate
Frontend
• HTML5
• CSS3
• Vanilla JavaScript
Testing
• pytest
Development
• uv
• Git
• GitHub
• Docker
Deployment
• Vercel
Project Architecture
User
|
v
Frontend
HTML / CSS / JavaScript
|
| POST /api/translate
v
Flask Application
|
v
Translation Route
|
v
Input Validation
|
v
Translation Service
|
v
LibreTranslate
|
v
Translation Result
|
v
Frontend
Project Structure
linguaflow/
|
nnn README.md
nnn pyproject.toml
nnn uv.lock
nnn vercel.json
nnn .python-version
nnn .gitignore
|
nnn api/
n nnn index.py
|
nnn app/
n nnn __init__.py
n |
n nnn routes/
n n nnn translation.py
n |
n nnn services/
n n nnn translator.py
n |
n nnn utils/
n nnn validators.py
|
nnn src/
n nnn linguaflow/
n nnn __init__.py
|
nnn static/
n nnn css/
n n nnn style.css
n |
n nnn js/
n nnn app.js
|
nnn templates/
n nnn index.html
|
nnn tests/
nnn test_translation.py
API Documentation
Home
GET /
Returns the main LinguaFlow web interface.
Health Check
GET /api/health
Example:
{
"status": "ok",
"service": "linguaflow"
}
Translate Text
POST /api/translate
Request:
{
"text": "Hello, how are you?",
"source_language": "en",
"target_language": "ur"
}
Response:
{
"translation": "nnnnn nn nnnn nnnn",
"detected_language": "en"
}
For automatic source detection, leave `source_language` empty.
Input Validation
LinguaFlow validates:
• Text input
• Maximum text length
• Source language
• Target language
• Source and target language compatibility
Maximum input length:
5,000 characters
Local Development
Requirements
• Python 3.14
• uv
• Docker
• Git
1. Clone the Repository
git clone https://github.com/MuhammadAdeel107/CodeAlpha-linguaflow.git
cd CodeAlpha-linguaflow
2. Install Dependencies
uv sync
3. Configure Environment Variables
Create `.env` in the project root:
LIBRETRANSLATE_URL=http://localhost:5000
Never commit private credentials or API keys.
4. Start LibreTranslate
Windows PowerShell:
docker run -d `
--name libretranslate `
-p 5000:5000 `
-e LT_HOST=0.0.0.0 `
-e LT_LOAD_ONLY=en,ur,ru,es,fr,de,it,pt,zh,ja,ko,ar,hi,tr `
libretranslate/libretranslate:latest
macOS/Linux:
docker run -d \
--name libretranslate \
-p 5000:5000 \
-e LT_HOST=0.0.0.0 \
-e LT_LOAD_ONLY=en,ur,ru,es,fr,de,it,pt,zh,ja,ko,ar,hi,tr \
libretranslate/libretranslate:latest
Check:
docker ps
5. Run Flask
uv run flask --app api.index:app run --debug --port 8000
Open:
http://localhost:8000
Testing
Run:
uv run pytest
Environment Variables
| Variable | Description | Local Example |
| --- | --- | --- |
| `LIBRETRANSLATE_URL` | URL of the LibreTranslate server | `http://localhost:5000` |
Deployment
The project includes:
vercel.json
Vercel entry point:
api/index.py
Deployment flow:
GitHub Repository
|
v
Vercel
|
v
Flask Application
|
v
Translation Service
Important Production Requirement
The local URL:
http://localhost:5000
only works when LibreTranslate is running on the local machine.
A Vercel deployment cannot access a Docker container running on the developer's personal computer.
Production therefore requires a publicly accessible LibreTranslate-compatible service.
Production variable:
LIBRETRANSLATE_URL=https://your-public-translation-service.example
Security
Sensitive configuration stays outside source control.
Excluded files/directories include:
.env
credentials/
__pycache__/
.venv/
.vercel/
Development Workflow
git add .
git commit -m "Describe your changes"
git push
The `main` branch is the primary project branch.
Future Improvements
• Text-to-speech
• Speech-to-text
• Voice translation
• File translation
• Persistent translation history
• User authentication
• Translation favorites
• Multiple translation providers
• API authentication
• Rate limiting
• OpenAPI documentation
• Database integration
• Production monitoring
• Improved accessibility
• Additional language models

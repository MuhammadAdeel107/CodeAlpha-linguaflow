const sourceText = document.getElementById("sourceText");

const sourceLanguage =
    document.getElementById("sourceLanguage");

const targetLanguage =
    document.getElementById("targetLanguage");

const translateButton =
    document.getElementById("translateButton");

const buttonText =
    document.getElementById("buttonText");

const loader =
    document.getElementById("loader");

const translationResult =
    document.getElementById("translationResult");

const detectedLanguage =
    document.getElementById("detectedLanguage");

const charCount =
    document.getElementById("charCount");

const errorMessage =
    document.getElementById("errorMessage");

const clearButton =
    document.getElementById("clearButton");

const copyButton =
    document.getElementById("copyButton");

const swapButton =
    document.getElementById("swapButton");

const themeToggle =
    document.getElementById("themeToggle");


function showError(message) {
    errorMessage.textContent = message;
    errorMessage.classList.remove("hidden");
}


function hideError() {
    errorMessage.textContent = "";
    errorMessage.classList.add("hidden");
}


function updateCharacterCount() {
    charCount.textContent =
        `${sourceText.value.length} / 5000`;
}


function setLoading(isLoading) {

    translateButton.disabled = isLoading;

    if (isLoading) {
        buttonText.textContent = "Translating...";
        loader.classList.remove("hidden");
    } else {
        buttonText.textContent = "Translate";
        loader.classList.add("hidden");
    }
}


async function translateText() {

    hideError();

    const text = sourceText.value.trim();

    if (!text) {
        showError("Please enter some text.");
        return;
    }

    setLoading(true);

    try {

        const response = await fetch(
            "/api/translate",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json",
                },

                body: JSON.stringify({
                    text: text,
                    source_language:
                        sourceLanguage.value,
                    target_language:
                        targetLanguage.value,
                }),
            }
        );

        const data = await response.json();

        if (!response.ok) {
            throw new Error(
                data.error ||
                "Translation failed."
            );
        }

        translationResult.textContent =
            data.translation || "";

        if (data.detected_language) {
            detectedLanguage.textContent =
                `Detected: ${data.detected_language}`;
        } else {
            detectedLanguage.textContent = "";
        }

    } catch (error) {

        showError(error.message);

    } finally {

        setLoading(false);
    }
}


translateButton.addEventListener(
    "click",
    translateText
);


sourceText.addEventListener(
    "input",
    updateCharacterCount
);


clearButton.addEventListener(
    "click",
    () => {

        sourceText.value = "";

        translationResult.textContent =
            "Translation will appear here...";

        detectedLanguage.textContent = "";

        hideError();

        updateCharacterCount();
    }
);


copyButton.addEventListener(
    "click",
    async () => {

        const text =
            translationResult.textContent;

        if (
            !text ||
            text ===
            "Translation will appear here..."
        ) {
            return;
        }

        try {

            await navigator.clipboard.writeText(text);

            copyButton.textContent = "Copied!";

            setTimeout(() => {
                copyButton.textContent = "Copy";
            }, 1500);

        } catch {
            showError(
                "Unable to copy translation."
            );
        }
    }
);


swapButton.addEventListener(
    "click",
    () => {

        if (!sourceLanguage.value) {
            return;
        }

        const oldSource =
            sourceLanguage.value;

        sourceLanguage.value =
            targetLanguage.value;

        targetLanguage.value =
            oldSource;
    }
);


themeToggle.addEventListener(
    "click",
    () => {

        document.body.classList.toggle(
            "dark"
        );

        themeToggle.textContent =
            document.body.classList.contains("dark")
                ? "☀️"
                : "🌙";
    }
);


updateCharacterCount();
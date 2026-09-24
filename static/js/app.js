const sourceLanguage = document.getElementById(
    "sourceLanguage"
);

const targetLanguage = document.getElementById(
    "targetLanguage"
);

const sourceText = document.getElementById(
    "sourceText"
);

const charCount = document.getElementById(
    "charCount"
);

const translateButton = document.getElementById(
    "translateButton"
);

const clearButton = document.getElementById(
    "clearButton"
);

const swapButton = document.getElementById(
    "swapButton"
);

const copyButton = document.getElementById(
    "copyButton"
);

const translationResult = document.getElementById(
    "translationResult"
);

const detectedLanguage = document.getElementById(
    "detectedLanguage"
);

const errorMessage = document.getElementById(
    "errorMessage"
);

const loader = document.getElementById(
    "loader"
);

const buttonText = document.getElementById(
    "buttonText"
);

const themeToggle = document.getElementById(
    "themeToggle"
);

const mobileMenu = document.getElementById(
    "mobileMenu"
);

const sidebar = document.querySelector(
    ".sidebar"
);

const sidebarOverlay = document.getElementById(
    "sidebarOverlay"
);

const historySection = document.getElementById(
    "historySection"
);

const historyNav = document.getElementById(
    "historyNav"
);


const MAX_LENGTH = 5000;

const PLACEHOLDER_HTML = `
    <div class="result-placeholder">

        <div class="placeholder-icon">

            <svg viewBox="0 0 24 24">
                <path d="M4 5h16"/>
                <path d="M4 12h10"/>
                <path d="M4 19h7"/>
                <path d="m16 16 2 2 4-5"/>
            </svg>

        </div>

        <strong>
            Your translation will appear here
        </strong>

        <span>
            Enter some text and click
            Translate to get started.
        </span>

    </div>
`;


/* =========================================
   CHARACTER COUNT
========================================= */

function updateCharacterCount() {

    const count = sourceText.value.length;

    charCount.textContent =
        `${count} / ${MAX_LENGTH}`;

}


/* =========================================
   ERROR HANDLING
========================================= */

function showError(message) {

    errorMessage.textContent = message;

    errorMessage.classList.remove(
        "hidden"
    );

}


function hideError() {

    errorMessage.textContent = "";

    errorMessage.classList.add(
        "hidden"
    );

}


/* =========================================
   LOADING
========================================= */

function setLoading(isLoading) {

    translateButton.disabled =
        isLoading;

    if (isLoading) {

        loader.classList.remove(
            "hidden"
        );

        buttonText.textContent =
            "Translating...";

    } else {

        loader.classList.add(
            "hidden"
        );

        buttonText.textContent =
            "Translate";

    }

}


/* =========================================
   RESULT DISPLAY
========================================= */

function showTranslation(
    text,
    detected = ""
) {

    translationResult.classList.remove(
        "empty-result"
    );

    translationResult.textContent =
        text;

    detectedLanguage.textContent =
        detected
            ? `Detected: ${detected}`
            : "";

}


/* =========================================
   TRANSLATION
========================================= */

async function translateText() {

    const text =
        sourceText.value.trim();

    hideError();

    if (!text) {

        showError(
            "Please enter some text."
        );

        sourceText.focus();

        return;
    }


    const source =
        sourceLanguage.value;

    const target =
        targetLanguage.value;


    if (!target) {

        showError(
            "Please select a target language."
        );

        return;
    }


    if (
        source &&
        source === target
    ) {

        showTranslation(
            text,
            source
        );

        saveHistory(
            text,
            text,
            source,
            target
        );

        return;
    }


    setLoading(true);


    translationResult.classList.remove(
        "empty-result"
    );

    translationResult.textContent =
        "Translating...";

    detectedLanguage.textContent =
        "";


    try {

        const response =
            await fetch(
                "/api/translate",
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({
                        text: text,
                        source_language:
                            source,
                        target_language:
                            target
                    })
                }
            );


        const data =
            await response.json();


        if (!response.ok) {

            throw new Error(
                data.error ||
                "Translation failed."
            );

        }


        const translatedText =
            data.translation ||
            "";


        if (!translatedText) {

            throw new Error(
                "No translation returned."
            );

        }


        showTranslation(
            translatedText,
            data.detected_language
        );


        saveHistory(
            text,
            translatedText,
            source || "auto",
            target
        );


    } catch (error) {

        console.error(
            "Translation error:",
            error
        );


        translationResult.classList.remove(
            "empty-result"
        );

        translationResult.textContent =
            "Translation failed.";


        showError(
            error.message ||
            "Something went wrong. Please try again."
        );


    } finally {

        setLoading(false);

    }

}


/* =========================================
   CLEAR
========================================= */

function clearText() {

    sourceText.value = "";

    translationResult.classList.add(
        "empty-result"
    );

    translationResult.innerHTML =
        PLACEHOLDER_HTML;

    detectedLanguage.textContent =
        "";

    hideError();

    updateCharacterCount();

    sourceText.focus();

}


/* =========================================
   SWAP LANGUAGES
========================================= */

function swapLanguages() {

    const oldSource =
        sourceLanguage.value;

    const oldTarget =
        targetLanguage.value;


    /*
     * Auto Detect cannot be selected
     * as a target language.
     *
     * If source is empty, use target
     * as source and English as target.
     */

    if (!oldSource) {

        sourceLanguage.value =
            oldTarget;

        targetLanguage.value =
            "en";

    } else {

        sourceLanguage.value =
            oldTarget;

        targetLanguage.value =
            oldSource;

    }


    const oldText =
        sourceText.value;

    const currentResult =
        translationResult.textContent.trim();


    if (
        currentResult &&
        currentResult !==
            "Translation will appear here..." &&
        currentResult !==
            "Translating..." &&
        currentResult !==
            "Translation failed."
    ) {

        sourceText.value =
            currentResult;

        showTranslation(
            oldText
        );

    }


    detectedLanguage.textContent =
        "";

    hideError();

    updateCharacterCount();

}


/* =========================================
   COPY TRANSLATION
========================================= */

async function copyTranslation() {

    const text =
        translationResult.textContent.trim();


    if (
        !text ||
        text === "Translating..." ||
        text === "Translation failed."
    ) {

        return;

    }


    try {

        await navigator.clipboard.writeText(
            text
        );


        copyButton.innerHTML = `
            <svg viewBox="0 0 24 24">
                <path d="m5 12 4 4L19 6"/>
            </svg>
            Copied!
        `;


        setTimeout(() => {

            copyButton.innerHTML = `
                <svg viewBox="0 0 24 24">
                    <rect
                        x="9"
                        y="9"
                        width="11"
                        height="11"
                        rx="2"
                    />

                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
                </svg>
                Copy
            `;

        }, 1600);


    } catch (error) {

        console.error(
            "Copy failed:",
            error
        );

        showError(
            "Unable to copy translation."
        );

    }

}


/* =========================================
   DARK MODE
========================================= */

function toggleTheme() {

    document.body.classList.toggle(
        "dark-mode"
    );


    const isDark =
        document.body.classList.contains(
            "dark-mode"
        );


    localStorage.setItem(
        "linguaflow-theme",
        isDark
            ? "dark"
            : "light"
    );


    updateThemeIcon();

}


function updateThemeIcon() {

    const isDark =
        document.body.classList.contains(
            "dark-mode"
        );


    if (isDark) {

        themeToggle.innerHTML = `
            <svg viewBox="0 0 24 24">
                <circle
                    cx="12"
                    cy="12"
                    r="4"
                />

                <path d="M12 2v2"/>
                <path d="M12 20v2"/>
                <path d="m4.93 4.93 1.41 1.41"/>
                <path d="m17.66 17.66 1.41 1.41"/>
                <path d="M2 12h2"/>
                <path d="M20 12h2"/>
                <path d="m6.34 17.66-1.41 1.41"/>
                <path d="m19.07 4.93-1.41 1.41"/>
            </svg>
        `;

    } else {

        themeToggle.innerHTML = `
            <svg viewBox="0 0 24 24">
                <path d="M21 12.8A8.5 8.5 0 1 1 11.2 3 6.7 6.7 0 0 0 21 12.8z"/>
            </svg>
        `;

    }

}


function loadTheme() {

    const savedTheme =
        localStorage.getItem(
            "linguaflow-theme"
        );


    if (savedTheme === "dark") {

        document.body.classList.add(
            "dark-mode"
        );

    }


    updateThemeIcon();

}


/* =========================================
   HISTORY
========================================= */

function getHistory() {

    try {

        return JSON.parse(
            localStorage.getItem(
                "linguaflow-history"
            )
        ) || [];

    } catch (error) {

        console.error(
            "History read error:",
            error
        );

        return [];

    }

}


function saveHistory(
    sourceTextValue,
    translatedTextValue,
    source,
    target
) {

    if (
        !sourceTextValue ||
        !translatedTextValue
    ) {

        return;

    }


    const history =
        getHistory();


    const item = {

        source:
            sourceTextValue,

        translation:
            translatedTextValue,

        sourceLanguage:
            source,

        targetLanguage:
            target,

        createdAt:
            new Date().toISOString()

    };


    const filtered =
        history.filter(
            entry =>
                !(
                    entry.source ===
                        item.source &&
                    entry.translation ===
                        item.translation
                )
        );


    filtered.unshift(item);


    const limited =
        filtered.slice(0, 10);


    localStorage.setItem(
        "linguaflow-history",
        JSON.stringify(limited)
    );


    renderHistory();

}


function languageName(code) {

    const option =
        [...targetLanguage.options]
            .find(
                item =>
                    item.value === code
            );


    if (option) {

        return option.textContent.trim();

    }


    if (code === "auto") {

        return "Auto Detect";

    }


    return code;

}


function renderHistory() {

    if (!historySection) {
        return;
    }


    const history =
        getHistory();


    const container =
        historySection.querySelector(
            ".empty-history"
        );


    if (!container) {
        return;
    }


    if (!history.length) {

        container.innerHTML = `
            <div class="history-icon">

                <svg viewBox="0 0 24 24">
                    <path d="M3 12a9 9 0 1 0 3-6.7"/>
                    <path d="M3 4v5h5"/>
                    <path d="M12 7v5l3 2"/>
                </svg>

            </div>

            <div>

                <strong>
                    No recent translations
                </strong>

                <span>
                    Your recent translation activity
                    will appear here.
                </span>

            </div>
        `;

        return;

    }


    container.classList.add(
        "history-list"
    );


    container.innerHTML =
        history.map(
            (item, index) => {

                const sourceName =
                    languageName(
                        item.sourceLanguage
                    );

                const targetName =
                    languageName(
                        item.targetLanguage
                    );


                return `
                    <button
                        type="button"
                        class="history-item"
                        data-history-index="${index}"
                    >

                        <div class="history-item-icon">
                            <svg viewBox="0 0 24 24">
                                <path d="M4 5h16"/>
                                <path d="M4 12h10"/>
                                <path d="M4 19h7"/>
                            </svg>
                        </div>

                        <div class="history-item-content">

                            <div class="history-languages">
                                ${sourceName}
                                <span>→</span>
                                ${targetName}
                            </div>

                            <strong>
                                ${escapeHtml(
                                    item.source
                                )}
                            </strong>

                            <span>
                                ${escapeHtml(
                                    item.translation
                                )}
                            </span>

                        </div>

                    </button>
                `;

            }
        ).join("");


    const items =
        container.querySelectorAll(
            ".history-item"
        );


    items.forEach(item => {

        item.addEventListener(
            "click",
            () => {

                const index =
                    Number(
                        item.dataset.historyIndex
                    );

                loadHistoryItem(
                    index
                );

            }
        );

    });

}


function loadHistoryItem(index) {

    const history =
        getHistory();

    const item =
        history[index];


    if (!item) {
        return;
    }


    sourceText.value =
        item.source;


    sourceLanguage.value =
        item.sourceLanguage === "auto"
            ? ""
            : item.sourceLanguage;


    targetLanguage.value =
        item.targetLanguage;


    showTranslation(
        item.translation
    );


    updateCharacterCount();

    hideError();


    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

}


/* =========================================
   HTML ESCAPE
========================================= */

function escapeHtml(value) {

    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");

}


/* =========================================
   MOBILE SIDEBAR
========================================= */

function openMobileSidebar() {

    if (!sidebar) {
        return;
    }


    sidebar.classList.add(
        "mobile-open"
    );


    sidebarOverlay.classList.add(
        "active"
    );

}


function closeMobileSidebar() {

    if (!sidebar) {
        return;
    }


    sidebar.classList.remove(
        "mobile-open"
    );


    sidebarOverlay.classList.remove(
        "active"
    );

}


/* =========================================
   EVENTS
========================================= */

sourceText.addEventListener(
    "input",
    updateCharacterCount
);


translateButton.addEventListener(
    "click",
    translateText
);


clearButton.addEventListener(
    "click",
    clearText
);


swapButton.addEventListener(
    "click",
    swapLanguages
);


copyButton.addEventListener(
    "click",
    copyTranslation
);


themeToggle.addEventListener(
    "click",
    toggleTheme
);


sourceText.addEventListener(
    "keydown",
    function (event) {

        if (
            event.ctrlKey &&
            event.key === "Enter"
        ) {

            event.preventDefault();

            translateText();

        }

    }
);


if (mobileMenu) {

    mobileMenu.addEventListener(
        "click",
        openMobileSidebar
    );

}


if (sidebarOverlay) {

    sidebarOverlay.addEventListener(
        "click",
        closeMobileSidebar
    );

}


if (historyNav) {

    historyNav.addEventListener(
        "click",
        function () {

            closeMobileSidebar();

            if (historySection) {

                historySection.scrollIntoView({
                    behavior: "smooth"
                });

            }

        }
    );

}


/* =========================================
   INITIALIZE
========================================= */

updateCharacterCount();

loadTheme();

renderHistory();
/**
 * Vokabeltrainer 2.0 - Modern JavaScript
 * ====================================
 */

let vocabulary = [];
let unusedVocabulary = [];
let usedVocabulary = [];
let currentWord = null;
let isGermanToEnglish = true;
let totalAttempts = 0;
let correctAnswers = 0;
let wrongAnswers = 0;
let isLoading = true;

// DOM Elements
const gameContent = document.getElementById('gameContent');
const fileSelection = document.getElementById('fileSelection');
const fileInput = document.getElementById('vocabularyFile');

/**
 * Initialisiert die App
 */
function initializeApp() {
    try {
        showLoadingState(true);
        loadProgress();
        
        if (vocabulary.length > 0) {
            showGameContent();
        }
        
        isLoading = false;
        showLoadingState(false);
    } catch (error) {
        console.error('Fehler beim Initialisieren:', error);
        showError('Fehler beim Laden des Fortschritts. Die Daten wurden zurückgesetzt.');
        resetStatistics();
    }
}

/**
 * Zeigt den Spielbereich an und versteckt die Dateiauswahl
 */
function showGameContent() {
    fileSelection.style.display = 'none';
    gameContent.style.display = 'block';
    updateStatistics();
    updateProgress();
    nextWord();
}

/**
 * Überprüft die eingegebene Antwort
 */
function checkAnswer() {
    if (isLoading) return;

    const userInput = document.getElementById('userInput');
    const input = normalizeText(userInput.value);
    const correctAnswer = normalizeText(isGermanToEnglish ? currentWord.english : currentWord.german);
    const shownWord = isGermanToEnglish ? currentWord.german : currentWord.english;
    
    if (!input) {
        showError('Bitte gib eine Antwort ein.');
        return;
    }
    
    totalAttempts++;
    if (input === correctAnswer) {
        currentWord.correct_count = (currentWord.correct_count || 0) + 1;
        correctAnswers++;
        showPopup(`${shownWord} = ${correctAnswer}`, true);
        userInput.value = '';
        nextWord();
    } else {
        wrongAnswers++;
        showPopup(`${shownWord} = ${correctAnswer}`, false);
        userInput.value = '';
    }
    
    updateStatistics();
    saveProgress();
}

/**
 * Event-Handler für die Dateiauswahl
 */
fileInput.addEventListener('change', async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
        showLoadingState(true);
        const content = await readFile(file);
        vocabulary = parseRTFContent(content);
        
        if (vocabulary.length === 0) {
            throw new Error('Keine Vokabeln in der Datei gefunden');
        }

        unusedVocabulary = [...vocabulary];
        usedVocabulary = [];
        
        showGameContent();
        saveProgress();
    } catch (error) {
        console.error('Fehler beim Laden der Datei:', error);
        showError('Fehler beim Laden der Datei: ' + error.message);
    } finally {
        showLoadingState(false);
    }
});

/**
 * Liest den Inhalt einer Datei
 */
function readFile(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target.result);
        reader.onerror = (e) => reject(new Error('Fehler beim Lesen der Datei'));
        reader.readAsText(file);
    });
}

/**
 * Parst den Inhalt der RTF-Datei und extrahiert die Vokabeln
 */
function parseRTFContent(content) {
    const words = [];
    const lines = content.split('\n');
    
    for (const line of lines) {
        if (!line.trim()) continue;
        
        const parts = line.split(' - ');
        if (parts.length !== 2) continue;
        
        const german = parts[0].trim();
        const match = parts[1].match(/(.+?)\[(.*?)\]/);
        if (!match) continue;
        
        const english = match[1].trim();
        const phonetic = match[2].trim();
        
        words.push({
            german,
            english,
            phonetic,
            correct_count: 0,
            attempts: 0
        });
    }
    
    if (words.length === 0) {
        throw new Error('Keine gültigen Vokabeln gefunden. Bitte überprüfe das Dateiformat.');
    }
    
    return words;
}

/**
 * Zeigt oder versteckt den Ladezustand
 */
function showLoadingState(show) {
    const elements = document.querySelectorAll('button, input');
    elements.forEach(el => el.disabled = show);
    
    let loadingIndicator = document.getElementById('loadingIndicator');
    if (!loadingIndicator && show) {
        loadingIndicator = document.createElement('div');
        loadingIndicator.id = 'loadingIndicator';
        loadingIndicator.className = 'loading-indicator';
        loadingIndicator.textContent = 'Lade...';
        document.querySelector('.card').prepend(loadingIndicator);
    }
    
    if (loadingIndicator) {
        loadingIndicator.style.display = show ? 'block' : 'none';
        if (!show) {
            loadingIndicator.remove();
        }
    }
}

/**
 * Zeigt eine Fehlermeldung an
 */
function showError(message) {
    const existingErrors = document.querySelectorAll('.error-message');
    existingErrors.forEach(error => error.remove());
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    
    const container = document.querySelector('.card');
    container.prepend(errorDiv);
    
    setTimeout(() => {
        errorDiv.classList.add('fade-out');
        setTimeout(() => errorDiv.remove(), 300);
    }, 5000);
}

/**
 * Lädt den gespeicherten Fortschritt
 */
function loadProgress() {
    try {
        const savedData = localStorage.getItem('vocabularyProgress');
        if (savedData) {
            const data = JSON.parse(savedData);
            vocabulary = data.words || [];
            unusedVocabulary = data.unusedVocabulary || [...vocabulary];
            usedVocabulary = data.usedVocabulary || [];
            totalAttempts = data.statistics?.totalAttempts || 0;
            correctAnswers = data.statistics?.correctAnswers || 0;
            wrongAnswers = data.statistics?.wrongAnswers || 0;
        }
    } catch (error) {
        console.error('Fehler beim Laden des Fortschritts:', error);
        resetStatistics();
    }
}

/**
 * Speichert den aktuellen Fortschritt
 */
function saveProgress() {
    try {
        const data = {
            words: vocabulary,
            unusedVocabulary: unusedVocabulary,
            usedVocabulary: usedVocabulary,
            statistics: {
                totalAttempts,
                correctAnswers,
                wrongAnswers
            }
        };
        localStorage.setItem('vocabularyProgress', JSON.stringify(data));
    } catch (error) {
        console.error('Fehler beim Speichern:', error);
        showError('Fehler beim Speichern des Fortschritts.');
    }
}

/**
 * Exportiert den aktuellen Fortschritt
 */
function exportVocabulary() {
    try {
        saveProgress();
        showPopup('Fortschritt wurde gespeichert', true);
    } catch (error) {
        console.error('Fehler beim Exportieren:', error);
        showError('Fehler beim Exportieren der Daten.');
    }
}

/**
 * Wechselt die Übersetzungsrichtung
 */
function switchLanguageMode() {
    if (isLoading) return;
    
    isGermanToEnglish = !isGermanToEnglish;
    const instruction = document.getElementById('instruction');
    const inputField = document.getElementById('userInput');
    
    if (isGermanToEnglish) {
        instruction.textContent = "Übersetze das folgende Wort ins Englische:";
        inputField.placeholder = "Englische Übersetzung";
    } else {
        instruction.textContent = "Übersetze das folgende Wort ins Deutsche:";
        inputField.placeholder = "Deutsche Übersetzung";
    }
    
    nextWord();
}

/**
 * Zeigt ein Popup an
 */
function showPopup(message, isCorrect = null) {
    if (isCorrect === true) {
        const popup = document.getElementById('correctPopup');
        document.getElementById('correctWord').textContent = message;
        document.getElementById('pronunciation').textContent = currentWord.phonetic;
        
        popup.style.display = 'flex';
        popup.classList.add('active');
        
        setTimeout(() => {
            popup.classList.remove('active');
            setTimeout(() => {
                popup.style.display = 'none';
            }, 300);
        }, 2000);
    } else if (isCorrect === false) {
        const popup = document.getElementById('wrongPopup');
        document.getElementById('wrongWord').textContent = message;
        
        popup.style.display = 'flex';
        popup.classList.add('active');
        
        setTimeout(() => {
            popup.classList.remove('active');
            setTimeout(() => {
                popup.style.display = 'none';
            }, 300);
        }, 2000);
    }
}

/**
 * Normalisiert Text für den Vergleich
 */
function normalizeText(text) {
    return text.toLowerCase()
        .trim()
        .replace(/\s+/g, ' ')
        .replace(/[.,!?]/g, '');
}

/**
 * Wählt das nächste Wort aus
 */
function nextWord() {
    if (vocabulary.length === 0) return;

    if (unusedVocabulary.length === 0) {
        unusedVocabulary = [...vocabulary];
        usedVocabulary = [];
    }

    const randomIndex = Math.floor(Math.random() * unusedVocabulary.length);
    currentWord = unusedVocabulary[randomIndex];
    
    unusedVocabulary.splice(randomIndex, 1);
    usedVocabulary.push(currentWord);

    const wordToShow = isGermanToEnglish ? currentWord.german : currentWord.english;
    document.getElementById('wordDisplay').textContent = wordToShow;
    document.getElementById('userInput').value = '';

    updateProgress();
}

/**
 * Aktualisiert die Fortschrittsanzeige
 */
function updateProgress() {
    const totalWords = vocabulary.length;
    const remainingWords = unusedVocabulary.length;
    document.getElementById('progressCount').textContent = 
        `${totalWords - remainingWords}/${totalWords} Wörter dieser Runde`;
}

/**
 * Aktualisiert die Statistikanzeige
 */
function updateStatistics() {
    document.getElementById('totalWords').textContent = vocabulary.length;
    document.getElementById('totalAttempts').textContent = totalAttempts;
    document.getElementById('correctCount').textContent = correctAnswers;
    document.getElementById('wrongCount').textContent = wrongAnswers;

    const totalAnswers = correctAnswers + wrongAnswers;
    if (totalAnswers > 0) {
        const correctPercentage = (correctAnswers / totalAnswers) * 100;
        const wrongPercentage = (wrongAnswers / totalAnswers) * 100;
        
        document.getElementById('correctBar').style.width = correctPercentage + '%';
        document.getElementById('wrongBar').style.width = wrongPercentage + '%';
    }
}

/**
 * Setzt alle Statistiken zurück
 */
function resetStatistics() {
    if (isLoading) return;
    
    totalAttempts = 0;
    correctAnswers = 0;
    wrongAnswers = 0;
    
    vocabulary.forEach(word => {
        word.correct_count = 0;
        word.attempts = 0;
    });
    
    unusedVocabulary = [...vocabulary];
    usedVocabulary = [];
    
    updateStatistics();
    updateProgress();
    saveProgress();
    nextWord();
}

// Event-Listener für die Eingabe
document.getElementById('userInput').addEventListener('keypress', function(event) {
    if (event.key === 'Enter' && !isLoading) {
        event.preventDefault();
        checkAnswer();
    }
});

// Event-Listener für Input-Validierung
document.getElementById('userInput').addEventListener('input', function(event) {
    const input = event.target;
    input.value = input.value.replace(/^\s+/g, '');
});

// Starte die App
initializeApp();

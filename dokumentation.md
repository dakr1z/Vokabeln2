# Vokabeltrainer Dokumentation

## Inhaltsverzeichnis
1. [Überblick](#überblick)
2. [Technische Architektur](#technische-architektur)
3. [Dateien und Struktur](#dateien-und-struktur)
4. [Funktionalitäten](#funktionalitäten)
5. [Datenmanagement](#datenmanagement)
6. [Benutzeroberfläche](#benutzeroberfläche)

## Überblick
Der Vokabeltrainer ist eine Webanwendung zum Lernen von Vokabeln. Die App ermöglicht es Benutzern, zwischen Deutsch und Englisch zu übersetzen und bietet sofortiges Feedback mit Aussprachehinweisen.

## Technische Architektur
Die Anwendung basiert auf reinem HTML, CSS und JavaScript ohne externe Frameworks. Dies gewährleistet eine schnelle Ladezeit und einfache Wartbarkeit.

### Verwendete Technologien:
- HTML5 für die Struktur
- CSS3 für das Design und Animationen
- Vanilla JavaScript für die Funktionalität
- LocalStorage für die Datenpersistenz

## Dateien und Struktur

### index.html
Die Hauptdatei enthält die Struktur der Anwendung mit:
- Eingabebereich für Übersetzungen
- Statistikanzeige
- Steuerungselemente
- Popup-Fenster für Feedback

### styles.css
Definiert das gesamte Erscheinungsbild der App:
- Responsive Design für verschiedene Bildschirmgrößen
- Animationen für Popups
- Farbschema und Typografie
- Fortschrittsbalken und Statistik-Styling

### script.js
Enthält die gesamte Anwendungslogik:
- Vokabelmanagement
- Übersetzungsprüfung
- Statistikberechnung
- Datenpersistenz

### Vokabeln.rtf
Enthält die Vokabeldaten im Format:
```
deutsch - englisch[aussprache]
```

## Funktionalitäten

### 1. Vokabelmanagement
- Automatisches Laden der Vokabeln aus der RTF-Datei
- Zufällige Auswahl der Vokabeln
- Tracking bereits verwendeter Vokabeln
- Automatischer Neustart nach Durchlauf aller Vokabeln

### 2. Übersetzungsmodus
- Wechsel zwischen Deutsch→Englisch und Englisch→Deutsch
- Normalisierung der Eingabe für flexiblere Vergleiche
- Sofortiges Feedback nach Eingabe

### 3. Feedback-System
Zwei unterschiedliche Popup-Typen:
- **Richtig-Popup:**
  - Zeigt "Richtig"
  - Zeigt das korrekte Wort
  - Zeigt die Aussprache (bei Englisch)
- **Falsch-Popup:**
  - Zeigt "Falsch"
  - Zeigt die korrekte Übersetzung

### 4. Statistik-Tracking
- Gesamtzahl der Vokabeln
- Aktuelle Fortschrittsanzeige
- Anzahl der Versuche
- Visualisierung von richtigen/falschen Antworten

### 5. Datenpersistenz
- Automatische Speicherung des Fortschritts
- Speicherung der Statistiken
- Möglichkeit zum Zurücksetzen der Daten

## Datenmanagement

### Vokabeldatenstruktur
Jedes Vokabelpaar wird als Objekt gespeichert:
```javascript
{
    german: "deutsches_wort",
    english: "englisches_wort",
    phonetic: "aussprache",
    correct_count: 0,
    attempts: 0
}
```

### LocalStorage
Speichert:
- Vokabelliste
- Benutzte/Unbenutzte Vokabeln
- Statistiken
- Gesamtfortschritt

## Benutzeroberfläche

### Hauptelemente
1. **Header**
   - Titel "Vokabeltrainer"
   - Aktuelle Übersetzungsrichtung

2. **Eingabebereich**
   - Anzeige des zu übersetzenden Wortes
   - Eingabefeld für die Übersetzung
   - "Nächstes Wort" Button

3. **Statistikbereich**
   - Gesamtzahl der Vokabeln
   - Aktueller Fortschritt
   - Anzahl der Versuche
   - Fortschrittsbalken für richtige/falsche Antworten

4. **Steuerungselemente**
   - Sprachrichtung wechseln (DE-EN)
   - Speichern
   - Zurücksetzen

### Feedback-Popups
- Moderne, animierte Erscheinung
- Automatisches Ausblenden nach 2 Sekunden
- Farbkodierung (Grün für richtig, Rot für falsch)
- Klare Typografie für beste Lesbarkeit

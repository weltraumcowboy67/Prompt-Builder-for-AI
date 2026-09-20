# Prompt Builder

Prompt Builder ist ein lokales Frontend-Tool zum Erstellen, Schärfen und Exportieren von KI-Prompts direkt im Browser.

## Technik

HTML, CSS und Vanilla JavaScript. Kein Build-Schritt, kein npm und kein Backend erforderlich. Ein KI-Modell oder API-Schlüssel wird nicht benötigt: Das Tool erstellt Prompt-Texte, führt sie aber nicht selbst aus.

## Installation und Start

Repository herunterladen und entpacken oder klonen:

```bash
git clone https://github.com/weltraumcowboy67/Prompt-Builder-for-AI.git
cd Prompt-Builder-for-AI
python3 -m http.server 8000 --bind 127.0.0.1
```

Im Browser `http://127.0.0.1:8000` öffnen. Python 3 wird nur für den lokalen Dateiserver gebraucht. Mit `Strg+C` beenden.

Alternativ lässt sich `index.html` direkt öffnen; die Zwischenablage und Speicherung können bei Datei-URLs je nach Browser eingeschränkt sein. Für zuverlässigere Nutzung den lokalen Server verwenden.

## Nutzung und Speicherung

- Prompt-Typ und Modus auswählen, Felder ausfüllen und den erzeugten Text kopieren.
- Exporte sind als TXT, Markdown und JSON verfügbar.
- Eingaben und Theme werden im `localStorage` des Browsers gespeichert. Ein anderer Browser, eine andere Adresse oder ein anderer Port hat einen separaten Speicher.
- Das Löschen der Website-Daten entfernt den gespeicherten Stand. Wichtige Prompts vorher exportieren.

## Wichtige Dateien

| Datei | Zweck |
| --- | --- |
| `index.html` | Seitenstruktur und Bedienelemente |
| `style.css` | Layout und Farbthemen |
| `script.js` | Prompt-Erzeugung, Speicherung, Kopieren und Export |
| `assets/` | Lokale Logo-Dateien |

## Grenzen und Fehlerquellen

- Standardport: **8000**. Bei `Address already in use` einen freien Port wählen, etwa `python3 -m http.server 8001 --bind 127.0.0.1`, und die Browseradresse entsprechend anpassen.
- Falls Kopieren fehlschlägt, den Text im Ausgabefeld manuell kopieren oder exportieren. Browserberechtigungen können den Zwischenablagezugriff verhindern.
- Es gibt keine Konten, Cloud-Synchronisierung oder automatische Sicherung.
- Die Seite bindet Google Fonts über `fonts.googleapis.com` und `fonts.gstatic.com` ein. Dabei entstehen externe Schriftanfragen. Ohne Internet oder mit blockierten Fonts nutzt der Browser Ersatzschriften; die Darstellung kann abweichen.

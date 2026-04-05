# Prompt Builder

Prompt Builder ist ein lokales Frontend-Tool zum Erstellen, Schärfen und Exportieren von KI-Prompts direkt im Browser.

## Features

- Prompt-Typen für Text, Bild, Code, Lernen, Analyse und weitere Builder-Modi
- Dynamische Formularfelder je Typ mit Live-Preview des fertigen Prompts
- Presets, Schnellbausteine und Prompt-Verbesserung direkt in der Oberfläche
- Qualitätsanzeige mit Fortschritt, fehlenden Pflichtfeldern und Hinweisen
- Export als `TXT`, `MD` oder `JSON`
- Persistenz über `localStorage`
- Umschaltbarer Nachtmodus
- Eigenes Tag- und Nacht-Logo aus den Assets
- Angepasstes UI-Styling für Farben, Tabs, Eingabefelder und Scrollbars

## Projektstruktur

- `index.html`: Grundstruktur der Oberfläche
- `style.css`: Theme, Layout und Komponenten-Styling
- `script.js`: Builder-Logik, State, Presets und Exporte
- `assets/prompt-builder-logo.png`: Standard-Logo
- `assets/prompt-builder-logo-night.png`: Logo für den Nachtmodus

## Start

1. Öffne `index.html` direkt im Browser.
2. Alternativ kannst du einen einfachen lokalen Static-Server verwenden.

## Hinweise

- Der aktuelle Zustand wird lokal im Browser gespeichert.
- Der Theme-Schalter wechselt zwischen hellem und dunklem UI inklusive Logo-Variante.

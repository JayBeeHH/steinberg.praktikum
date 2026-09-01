# Praktikums-Portal

Das Praktikums-Portal ist eine lokale React- und Vite-App zur Dokumentation eines Praktikums bei Steinberg. Tagebucheinträge, Interviews und Glossarbegriffe liegen als Markdown-Dateien im Projekt und werden direkt im Frontend verarbeitet.

## Ueberblick

Die Startseite ist ein geführter Rundgang mit Hash-Routen wie `#/tour/1`. Er führt durch das Unternehmen, das Berufsbild, Tagebuch und Interviews und endet mit einem Quiz zum Berufsbild Webdesign und Webentwicklung.

- Die feste Navigation bietet „Zurück“ und „Weiter“ sowie eine Fortschrittsleiste.
- Für Tagebuch und Interviews müssen jeweils drei unterschiedliche Einträge geöffnet werden, bevor der Rundgang fortgesetzt werden kann. Der Status gilt pro Browser-Sitzung.
- Die Detailansichten bieten einen eigenen scrollbaren Lesebereich und ein kontextbezogenes Glossar.
- Das Quiz stellt bei jedem Neustart fünf zufällige Fragen aus einem lokalen Fragenpool zusammen.
- Nach dem Quiz ist zusätzlich die scrollbare Gesamtansicht unter `#/uebersicht` erreichbar.

## Tech-Stack

- `React 18`
- `Vite 5`
- eigenes Markdown-Parsing in `src/lib/content.js`
- `agentation` als Entwicklungswerkzeug für visuelles Seitenfeedback; es wird nur mit `npm run dev` geladen
- optionaler lokaler Node-Server in `server.js` für Build-Auslieferung, Uploads und JSON-Endpunkte

## Projektstruktur

```text
Praktikum App/
|- README.md
|- package.json
|- server.js
|- App-starten.command
|- index.html
|- vite.config.mjs
|- src/
|  |- App.jsx
|  |- main.jsx
|  |- index.css
|  |- lib/content.js
|  `- components/ui/
|- content/
|  |- diary/
|  |- interviews/
|  `- glossary/
|- public/
|  |- index.html
|  |- app.js
|  `- styles.css
|- uploads/
|- dist/
|- process_interviews.py
`- clean_interviews.py
```

## Entwicklung

Voraussetzungen:

- `Node.js`
- `npm`

Installation:

```bash
npm install
```

Entwicklungsserver starten:

```bash
npm run dev
```

Danach ist die App in der Regel unter `http://localhost:5173` erreichbar.

Produktions-Build erstellen:

```bash
npm run build
```

Lokalen Server mit Build starten:

```bash
npm start
```

Der Startbefehl führt zuerst den Build aus und startet danach `server.js` auf `http://localhost:3000`.

Nur den lokalen Server starten:

```bash
npm run serve
```

Unter macOS kann alternativ `App-starten.command` verwendet werden. Das Skript startet die App auf Port `3000` und öffnet sie im Browser.

## Inhalte pflegen

Die Inhalte liegen als Markdown-Dateien unter `content/`.

- `content/diary`: Tagebucheinträge
- `content/interviews`: Interviewtexte
- `content/glossary`: Glossarbegriffe

Unterstütztes Frontmatter:

```yaml
---
title: "Titel"
date: 2026-06-15
summary: "Kurze Zusammenfassung"
image: "/uploads/datei.jpg"
---
```

Unterstützter Markdown-Umfang:

- Ueberschriften mit `#`
- normale Absätze
- Listen mit `-`
- Fett mit `**text**`
- Kursiv mit `*text*`

Hinweise:

- Tagebucheinträge werden nach Datum sortiert.
- Die Titel der Tagebucheinträge werden automatisch als `Woche N: Wochentag` normalisiert.
- Interviews werden aus Markdown gelesen und in der Detailansicht als Frage-Antwort-Blöcke aufbereitet.

## Lokaler Server

`server.js` ist nicht nötig für `npm run dev`, aber nützlich für den lokalen Produktivlauf. Der Server bietet:

- `GET /api/content` für zusammengeführte Inhalte aus `content/`
- `POST /api/upload` für Datei-Uploads nach `uploads/`
- statische Auslieferung von `dist/`
- Fallback auf Dateien in `public/`

## Python-Skripte

Die beiden Python-Dateien sind Hilfsskripte für Interviewmaterial:

- `process_interviews.py`: verarbeitet Interviewquellen zu Markdown
- `clean_interviews.py`: bereinigt bestehende Interviewtexte

Beide Skripte enthalten aktuell absolute Pfade auf dieses Projektverzeichnis.

## Bekannte Hinweise

- Im Repository gibt es sowohl die aktuelle React-App in `src/` als auch eine ältere statische Variante in `public/`.
- Für die eigentliche Weiterentwicklung ist `src/` der relevante Hauptpfad.
- `dist/` ist generierter Build-Output und kann jederzeit neu erstellt werden.

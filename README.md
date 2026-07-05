# Praktikums-Portal

Ein modernes, Apple-inspiriertes Praktikumsdokumentations-Portal mit Tagebuch, Interviews und Glossar. Gebaut mit React, Vite und Node.js.

**Live:** http://localhost:3000

---

## 📋 Inhaltsverzeichnis

- [Überblick](#überblick)
- [Tech-Stack](#tech-stack)
- [Installation & Setup](#installation--setup)
- [Projektstruktur](#projektstruktur)
- [Features](#features)
- [Development](#development)
- [Content-Format](#content-format)
- [API-Dokumentation](#api-dokumentation)
- [Troubleshooting](#troubleshooting)

---

## 🎯 Überblick

Das **Praktikums-Portal** ist eine web-basierte Dokumentations-App für Praktikumserfahrungen. Es ermöglicht:

- **Tagebuch (Diary):** Tägliche Einträge mit Bildern, strukturiert nach Wochen
- **Interviews:** Gesammelte und bereuigte Gesprächstranskripte mit Mitarbeitern
- **Glossar:** Fachbegriffe und Konzepte aus dem Praktikum
- **Dokumente:** Zusätzliche Ressourcen und Dateien

Das Portal nutzt **Markdown-Dateien** als Content-Quelle mit **YAML-Frontmatter** für Metadaten. Der Backend-Server parst die Dateien und stellt sie über eine JSON-API bereit.

---

## 🏗️ Tech-Stack

### Frontend
- **React 18.x** – UI-Komponenten und State Management
- **Vite 5.x** – Modern build tool, schnelle Dev-Umgebung
- **shadcn/ui** – Component-Bibliothek (Button, Card, Input, Label, etc.)
- **CSS** – Apple-inspiriertes Minimal-Design mit Glass-Morphism

### Backend
- **Node.js** – Custom HTTP-Server (no external frameworks)
- **Markdown Parser** – Eigene Implementierung mit Frontmatter-Extraction
- **Multipart Parser** – Für Datei-Uploads

### Infrastruktur
- **macOS** – Local development environment
- **Port 3000** – Default development server

---

## 📦 Installation & Setup

### Voraussetzungen
- Node.js 18+ (getestet: v25.6.1)
- npm oder yarn
- macOS (oder beliebiges OS mit Node.js)

### Schritt-für-Schritt Installation

```bash
# 1. Repository klonen/Projektverzeichnis navigieren
cd /Users/jonathan/Documents/Praktikum\ App

# 2. Dependencies installieren
npm install

# 3. Frontend bauen
npm run build

# 4. Server starten
node server.js

# Server läuft jetzt auf http://localhost:3000
```

**Alternativ für Development (schneller Reload):**
```bash
npm run dev
```

---

## 📁 Projektstruktur

```
Praktikum App/
├── README.md                          # Diese Datei
├── package.json                       # npm Konfiguration
├── package-lock.json
├── server.js                          # Node.js Backend-Server
├── vite.config.js                     # Vite Build-Konfiguration
├── index.html                         # HTML Entry Point
│
├── src/                               # React Source Code
│   ├── App.jsx                        # Main App Component + Routing
│   ├── index.css                      # Global Styles (Apple Design)
│   └── components/                    # React Komponenten
│       └── [shadcn components]
│
├── content/                           # Content Source (Markdown)
│   ├── diary/                         # Tagebuch-Einträge
│   │   ├── 2026-06-15-woche-1-montag.md
│   │   ├── 2026-06-16-woche-1-dienstag.md
│   │   ├── 2026-06-17-woche-1-mittwoch.md
│   │   └── ... (9 Einträge total)
│   │
│   ├── interviews/                    # Interview-Transkripte
│   │   ├── quatschen-und-kennenlernen-1.md
│   │   ├── einblick-in-job-web-dev-team-fragen.md
│   │   ├── jonathan-x-tim.md
│   │   ├── e-mail-marketing.md
│   │   ├── hi-from-cubase.md
│   │   ├── praktikumsgesprach-rissling.md
│   │   ├── job-vorstellung-project-manager-ai-adoption.md
│   │   ├── 1-1-ux-design-get-to-know.md
│   │   ├── interview-markus-staudt.md
│   │   ├── interview-anna.md
│   │   ├── interview-jonas.md
│   │   └── interview-maria.md
│   │
│   ├── glossary/                      # Glossar-Einträge
│   │   └── [Glossar-Dateien]
│   │
│   └── documents/                     # Dokumente & Ressourcen
│       └── [Dokument-Dateien]
│
├── dist/                              # Build Output (nach npm run build)
│   ├── index.html
│   ├── assets/
│   │   ├── index-[hash].js
│   │   └── index-[hash].css
│   └── ...
│
├── uploads/                           # Hochgeladene Bilder & Dateien
│   └── [user-uploaded files]
│
├── process_interviews.py              # Python-Script zur .docx-Verarbeitung
├── clean_interviews.py                # Python-Script zur Interview-Bereinigung
│
└── node_modules/                      # npm Dependencies (nicht im Repo)
```

---

## ✨ Features

### 1. **Tagebuch (Diary)**
- 9 chronologisch sortierte Einträge (älteste zuerst)
- Automatische Wochentitel: "Woche N: Wochentag" (z.B. "Woche 1: Montag")
- Homepage zeigt 4 Einträge mit "Mehr lesen" Toggle
- Preview-Text auf ~140 Zeichen gekürzt
- Detail-Seite mit Volltext und Bild (falls vorhanden)

### 2. **Interviews**
- 12 bereuigte Interview-Transkripte
- Q&A-Format (Frage–Antwort-Paare)
- Bereinigung: Füllwörter entfernt, Grammatik korrigiert
- Sortiert nach Dateiname (alphabetisch)
- Durchsuchbar über Homepage-Sektion

### 3. **Glossar**
- Fachbegriffe und Definitionen
- Alphabetische Sortierung
- Detail-Seite pro Eintrag

### 4. **Dokumente**
- Zusätzliche Ressourcen
- Datei-Links und Beschreibungen

### 5. **Design**
- Apple-inspiriertes Minimal-Design
- Glass-Morphism Effekte
- Responsive Card-Grid
- Clean Typography
- Dunkel- & Hellmodus-ready

---

## 🛠️ Development

### Frontend bauen
```bash
npm run build
```
Output: `dist/` Verzeichnis mit optimiertem Code

### Server starten
```bash
# Production (mit gebautem Frontend)
node server.js

# Development (mit Vite HMR)
npm run dev
```

### Server läuft auf
```
http://localhost:3000
```

### Ports
- **3000** – Main Application (Frontend + API)
- **5173** – Vite Dev Server (nur bei npm run dev)

### Hot Reload
- Frontend: Automatisch bei `npm run dev` (Vite HMR)
- Backend: Manueller Restart erforderlich (`node server.js`)

---

## 📝 Content-Format

### Markdown mit YAML-Frontmatter

Alle Content-Dateien folgen diesem Format:

```markdown
---
title: "Titel des Eintrags"
date: 2026-06-15
summary: "Kurze Zusammenfassung (150-200 Zeichen)"
image: "/uploads/image-name.jpg"
---

# Hauptinhalt hier

Der Body-Text kann mehrere Absätze, Listen und Formatierungen enthalten.

- Punkt 1
- Punkt 2

**Fetter Text** und *kursiver Text* werden unterstützt.
```

### Unterstützte Frontmatter-Felder

| Feld | Typ | Erforderlich | Beschreibung |
|------|-----|-------------|-------------|
| `title` | String | ✅ | Titel des Eintrags |
| `date` | YYYY-MM-DD | ✅ | Erstellungsdatum |
| `summary` | String | ✅ | Kurze Zusammenfassung |
| `image` | URL | ❌ | Pfad zum Bild (z.B. `/uploads/file.jpg`) |

### Markdown-Features

**Unterstützt:**
- Überschriften: `# H1`, `## H2`, `### H3`
- Fettdruck: `**text**`
- Kursiv: `*text*`
- Listen: `- item`, `1. numbered`
- Zeilenumbrüche: `---`
- Inline-Code: `` `code` ``

**Nicht unterstützt:**
- Verschachtelte Listen
- Code-Blöcke mit Syntax-Highlighting
- Tabellen
- Links (außer in Body-Text)

---

## 🔌 API-Dokumentation

### GET `/api/content`

Lädt alle Content-Einträge aus allen Kollektionen.

**Response:**
```json
{
  "diary": [
    {
      "id": "2026-06-15-woche-1-montag",
      "title": "Woche 1: Montag",
      "date": "2026-06-15",
      "summary": "Erster Tag im Praktikum...",
      "image": null,
      "_ts": 1718385600000,
      "body": "Vollständiger Body-Text..."
    }
  ],
  "interviews": [
    {
      "id": "quatschen-und-kennenlernen-1",
      "title": "Quatschen und Kennenlernen (1)",
      "date": "2026-06-20",
      "summary": "Interview",
      "image": null,
      "body": "**F: Frage?**\n\nAntwort hier..."
    }
  ],
  "glossary": [],
  "documents": []
}
```

### POST `/api/upload`

Lädt Dateien hoch (Bilder, Dokumente).

**Anfrage:**
```
POST /api/upload
Content-Type: multipart/form-data

file: <binary data>
```

**Response:**
```json
{
  "success": true,
  "filename": "image-name.jpg",
  "url": "/uploads/image-name.jpg"
}
```

---

## 🚀 Production Deployment

### Build für Production
```bash
npm run build
```

### Server starten (Production)
```bash
node server.js
```

### Umgebungsvariablen
Derzeit keine erforderlich. Bei Bedarf in `server.js` hinzufügen:
```javascript
const PORT = process.env.PORT || 3000;
```

### Empfehlungen
- Verwende einen Process Manager wie **PM2**:
  ```bash
  pm2 start server.js --name "praktikums-portal"
  pm2 startup
  pm2 save
  ```
- Setze einen Reverse Proxy (nginx, Apache) davor
- Aktiviere HTTPS (z.B. mit Let's Encrypt)

---

## 🔧 Troubleshooting

### Problem: "Port 3000 already in use"
```bash
# Prozess finden
lsof -i :3000

# Prozess beenden
kill -9 <PID>

# Server neu starten
node server.js
```

### Problem: Build fehlgeschlagen
```bash
# node_modules neu installieren
rm -rf node_modules package-lock.json
npm install

# Neu bauen
npm run build
```

### Problem: CSS nicht geladen
- Stelle sicher, dass `npm run build` erfolgreich war
- Browser-Cache leeren (Cmd+Shift+R auf macOS)
- Prüfe `dist/assets/` auf CSS-Datei

### Problem: Content nicht sichtbar
- Stelle sicher, dass Markdown-Dateien in `content/diary/`, `content/interviews/` etc. existieren
- Prüfe Browser-Console auf Fehler (F12)
- Prüfe Server-Logs für Parsing-Fehler
- Verifiziere YAML-Frontmatter korrekt formatiert ist

### Problem: Interview-Dateien nicht bereinigt
Manuell bereinigen:
```bash
python3 clean_interviews.py
npm run build
node server.js
```

---

## 📚 Weitere Scripts

### Interview-Verarbeitung aus .docx

```bash
# Neue .docx-Dateien in /Interviews/ legen, dann:
python3 process_interviews.py
```

**Voraussetzung:**
```bash
pip3 install python-docx --break-system-packages
```

### Interview-Bereinigung

```bash
# Alle Interviews bereinigen (Füllwörter, Grammatik)
python3 clean_interviews.py
```

---

## 📄 Lizenz

Dieses Projekt ist privat und zu Dokumentationszwecken gedacht.

---

## 👤 Kontakt

Erstellt für: Jonathan Baumbach  
Praktikum bei: Steinberg Media Technologies  
Zeitraum: Juni–Juli 2026

---

## 🗺️ Roadmap

- [ ] HEIC-Bilder zu JPEG konvertieren und zu Diary-Einträgen hinzufügen
- [ ] Volltextsuche über alle Inhalte
- [ ] Tags und Kategorien für Interviews
- [ ] Exportfunktion (PDF, Word)
- [ ] Dark Mode Toggle
- [ ] Kommentar-Funktion
- [ ] Analytics und Statistiken

---

**Zuletzt aktualisiert:** 5. Juli 2026  
**Version:** 1.0.0

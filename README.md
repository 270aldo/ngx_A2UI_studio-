<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />

# NGX Studio

**AI-Powered Widget Studio for GENESIS**

Generate fitness UI widgets with natural language using Gemini 3.0

[![Gemini 3.0](https://img.shields.io/badge/Gemini-3.0%20Flash%2FPro-blue)](https://ai.google.dev/)
[![React](https://img.shields.io/badge/React-19-61dafb)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6-646cff)](https://vitejs.dev/)

</div>

---

## Features

- **Natural Language to UI** - Describe widgets in Spanish, get React components
- **20 Widget Types** - Dashboard, Training, Nutrition, Habits, Biometrics, Tools
- **Gemini 3.0 Flash/Pro** - Toggle between speed and quality
- **Widget Composition** - Stack and grid layouts for multiple widgets
- **Export Options** - JSON (for GENESIS), React components, HTML embed
- **Persistence** - Save widgets to local storage for later use
- **Live Preview** - Phone frame mockup with real-time updates

## Widget Categories

| Category | Widgets |
|----------|---------|
| **Dashboard** | progress-dashboard, metric-card, today-card, insight-card |
| **Training** | workout-card, exercise-row, rest-timer, workout-history |
| **Nutrition** | meal-plan |
| **Habits** | hydration-tracker, supplement-stack, streak-counter |
| **Biometrics** | heart-rate, sleep-tracker, body-stats |
| **Planning** | season-timeline |
| **Tools** | max-rep-calculator, alert-banner, coach-message, achievement |

## Quick Start

### Prerequisites

- Node.js 18+
- Gemini API Key ([Get one here](https://aistudio.google.com/app/apikey))

### Installation

```bash
# Clone the repository
git clone https://github.com/270aldo/ngx_A2UI_studio-.git
cd ngx_A2UI_studio-

# Install dependencies
npm install

# Configure API key
cp .env.example .env.local
# Edit .env.local and add your GEMINI_API_KEY
```

### Run Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Build for Production

```bash
npm run build
npm run preview
```

## Usage

### Generate a Widget

1. Type a description in Spanish (e.g., "Crea un widget de ritmo cardiaco mostrando 72 bpm en zona de descanso")
2. Click "Generar" or press Enter
3. View the live preview in the phone frame

### Export Widget

- **JSON** - Download enriched config for GENESIS integration
- **React** - Copy standalone TypeScript component
- **HTML** - Download embeddable HTML with inline styles

### Save Widgets

Click the save icon to store widgets locally. Access them from "Mis Widgets" in the sidebar.

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        NGX Studio                           │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────┐   ┌──────────────┐   ┌────────────────────┐   │
│  │ Sidebar │   │  Chat/Editor │   │   Phone Preview    │   │
│  │         │   │              │   │                    │   │
│  │ Templates│   │  Gemini API  │   │  A2UIMediator      │   │
│  │ History │   │  JSON Editor │   │  WidgetRenderer    │   │
│  └─────────┘   └──────────────┘   └────────────────────┘   │
├─────────────────────────────────────────────────────────────┤
│                       Services                              │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐ │
│  │GeminiService│  │ExportService│  │  StorageService     │ │
│  │ Flash/Pro   │  │ JSON/React  │  │  localStorage       │ │
│  └─────────────┘  └─────────────┘  └─────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

## Export Format (GENESIS)

```json
{
  "version": "1.0",
  "widget": {
    "type": "heart-rate",
    "props": {
      "bpm": 72,
      "zone": "rest",
      "trend": "down"
    }
  },
  "metadata": {
    "id": "uuid",
    "createdAt": "2025-01-04T...",
    "generatedBy": "NGX Studio",
    "model": "gemini-3-flash"
  },
  "styles": {
    "colorScheme": "dark",
    "primaryColor": "#6D00FF"
  }
}
```

## Tech Stack

- **React 19** - UI framework
- **TypeScript 5.3** - Type safety
- **Vite 6** - Build tool
- **Tailwind CSS** - Styling (via CDN)
- **Gemini 3.0** - AI generation
- **lucide-react** - Icons

## Project Structure

```
├── App.tsx              # Main application
├── components/
│   ├── WidgetRenderer   # 20 widget components + LayoutRenderer
│   └── UIComponents     # Shared primitives (GlassCard, etc.)
├── services/
│   ├── geminiService    # Gemini 3.0 Flash/Pro API
│   ├── exportService    # JSON, React, HTML export
│   └── storageService   # localStorage persistence
├── utils/
│   └── validation       # JSON schema validation
├── types.ts             # TypeScript definitions
└── constants.ts         # Colors, prompts, templates
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feat/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feat/amazing-feature`)
5. Open a Pull Request

## License

This project is part of the NGX Genesis ecosystem.

---

<div align="center">
  <strong>Built with Gemini 3.0 for the GENESIS fitness platform</strong>
</div>

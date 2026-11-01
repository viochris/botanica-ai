<div align="center">

# Botanica AI — Intelligent Plant Care & Identification

**A botanical companion and domestic horticulture assistant powered by Google Gemini Vision and multimodal intelligence.**

[![Live Demo](https://img.shields.io/badge/Live%20Demo-botanica--ai--mu.vercel.app-2D6A4F?style=for-the-badge&logo=vercel&logoColor=white)](https://botanica-ai-mu.vercel.app/)
[![GitHub Repo](https://img.shields.io/badge/GitHub-viochris%2Fbotanica--ai-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/viochris/botanica-ai)
[![React](https://img.shields.io/badge/React%2019-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS_v4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![Gemini API](https://img.shields.io/badge/Google_Gemini-4285F4?style=for-the-badge&logo=google&logoColor=white)](https://ai.google.dev/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](./LICENSE)

**[Live Demo](https://botanica-ai-mu.vercel.app/)** · **[GitHub Repo](https://github.com/viochris/botanica-ai)** · **[Important Notice](#important-notice)** · **[Features](#features)** · **[Tech Stack](#tech-stack)** · **[Getting Started](#getting-started)** · **[Production Build](#production-build)** · **[Screenshots](#screenshots)** · **[Privacy & AI Safety](#privacy--ai-safety)** · **[License](#license)**
</div>

---

## Important Notice

* **AI-Generated Guidance**: Plant identifications, pathology diagnoses, and care instructions are generated using Google Gemini AI models. While trained on vast horticultural literature, AI outputs may occasionally contain inaccuracies or misidentifications.
* **Toxicity & Pet Safety**: Toxicity data (for cats, dogs, and humans) is provided for informational and preliminary reference only. If you suspect an animal or person has ingested a toxic plant, please immediately contact a licensed veterinarian, physician, or local poison control center.
* **Photo Processing**: Any photograph uploaded or captured through the app is sent securely to the Google Gemini API for botanical visual feature extraction and analysis.

---

## Overview

**Botanica AI** is an end-to-end plant identification, disease diagnosis, and domestic garden management platform. Designed with an editorial botanical aesthetic, it allows gardeners—from urban windowsill beginners to experienced horticulturists—to photograph houseplants or garden flora and immediately receive structured care intelligence.

The application pairs client-side photo processing (automatic resizing, canvas rendering, and low-latency uploads) with a server-side Express proxy running `@google/genai`. It features cascaded model routing (`gemini-3.1-flash-lite`, `gemini-3.8-flash`, and `gemini-4-argon`), protecting user rate limits while delivering detailed care matrices and interactive consultations.

---

## Features

### 1. Multimodal Plant Identification
* **Accurate Botanical Classification**: Instantly extracts botanical Latin binomials, common names, plant families, and a calibrated confidence score.
* **Dual Camera & Upload Integration**: Use live browser camera streams or native phone camera dialogs (`capture="environment"`), complete with client-side canvas downsampling to 1024px for swift uploads.
* **1-Click Presets**: Explore curated botanical specimens (Monstera Deliciosa, Fiddle Leaf Fig, Sansevieria Trifasciata, etc.) without needing a camera.

### 2. Leaf Pathology & Health Diagnostic
* **Symptom Detection**: Identifies chlorosis, overwatering edema, leaf tip burn, webbing, scale, and fungal infections.
* **Actionable Treatment Plans**: Prioritizes gentle organic remedies (neem oil sprays, soil aerations, drainage corrections) before chemical treatments.

### 3. Comprehensive Care Matrix
* **8-Point Horticultural Parameters**: Detailed instructions for sunlight exposure, watering frequency (with interval day calculations), soil composition recipes, temperature tolerances, ambient humidity requirements, seasonal fertilizer ratios, repotting cycles, and pet toxicity guidelines.

### 4. "My Garden" Watering Tracker
* **Hydration Schedules**: Automatically tracks watering intervals for saved plants.
* **Urgency Indicators**: Visual status tags highlight plants due today, overdue, or satisfied.
* **Water All Action**: Bulk-marks only due or overdue specimens with a single tap.
* **Local Persistence**: Maintains collection state in browser storage with fallback quota warnings.

### 5. "Dr. Flora" Botanical AI Chat
* **Multi-Turn Horticultural Mentor**: Consult with Dr. Flora on propagation, repotting, pest control, or yellowing leaves.
* **Context Preservation**: Automatically bridges the active scanned plant data into the conversation thread.
* **Tab-Persistent State**: Chat history is preserved seamlessly when switching between views.
* **Model Selection**: Switch between Fast (Flash Lite), Standard (3.8 Flash), and Complex (Argon) modes.

### 6. Interactive Care Guides & Potting Calculator
* **Seasonal Calendars**: Actionable seasonal tasks tailored for Spring, Summer, Autumn, and Winter.
* **Potting Volume Estimator**: Calculates exact potting soil, perlite, and drainage mix volume requirements based on container diameter and depth.

---

## Tech Stack

| Category | Technology |
|---|---|
| **Frontend Framework** | [React 19](https://react.dev/) |
| **Language** | [TypeScript](https://www.typescriptlang.org/) |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com/) with `@tailwindcss/vite` |
| **Icons** | [Lucide React](https://lucide.dev/) |
| **Backend Server** | [Express](https://expressjs.com/) (Node.js full-stack proxy) |
| **Build & Dev Tool** | [Vite 8](https://vitejs.dev/) & [tsx](https://github.com/privatenumber/tsx) |
| **Bundler** | [esbuild](https://esbuild.github.io/) |
| **Security & Limits** | `express-rate-limit` (20 requests / 15 mins per IP) |
| **AI SDK** | [`@google/genai`](https://www.npmjs.com/package/@google/genai) |
| **Models** | Gemini 3.1 Flash Lite, Gemini 3.8 Flash, Gemini 4 Argon |

---

## Getting Started

### Prerequisites
* [Node.js](https://nodejs.org/) 20.19+ or 22.12+
* npm (bundled with Node.js)
* A Google Gemini API key from [Google AI Studio](https://ai.google.dev/)

### Installation & Local Setup

```bash
# 1. Clone the repository
git clone https://github.com/viochris/botanica-ai.git
cd botanica-ai

# 2. Install dependencies
npm install

# 3. Configure environment variables
# Copy .env.example to .env.local
cp .env.example .env.local

# 4. Open .env.local and insert your Gemini API Key:
# GEMINI_API_KEY="your_actual_gemini_api_key_here"

# 5. Start the development server
npm run dev
```

The application will start on **`http://localhost:3000`**.

---

## Production Build

To compile and serve the production-ready optimized build:

```bash
# 1. Build the frontend and backend bundles
npm run build

# 2. Start the production server
npm start
```

The server serves static production assets from `./dist` and API endpoints via Node.js.

### Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Runs the full-stack dev server on port 3000 using `tsx` |
| `npm run build` | Builds Vite client assets and bundles `server.ts` with esbuild |
| `npm start` | Executes `dist/server.js` in production mode |
| `npm run lint` | Runs TypeScript type checking via `tsc --noEmit` |
| `npm run clean` | Cleans build artifacts (`dist` folder) |

---

## Screenshots

<!-- Add your application screenshots here -->
| Plant Scanner & Identification | Care Matrix & Diagnostics |
|:---:|:---:|
| *(Screenshot placeholder — Plant identification interface)* | *(Screenshot placeholder — Botanical care parameters)* |

| "My Garden" Watering Tracker | "Dr. Flora" AI Chat |
|:---:|:---:|
| *(Screenshot placeholder — Hydration schedule)* | *(Screenshot placeholder — Multi-turn conversation)* |

---

## Privacy & AI Safety

* **Photo Privacy**: Uploaded photos are solely used to analyze plant morphology and are transmitted over HTTPS to the Google Gemini API. Photos are not persisted to any external database.
* **Client-Side Optimization**: Photos are resized via client-side canvas to a maximum dimension of 1024px prior to transfer, conserving bandwidth and device resources.
* **Rate Limiting**: Server endpoints are fortified with `express-rate-limit` allowing 20 requests per 15 minutes per IP address.

---

## License

This project is licensed under the terms of the [MIT License](./LICENSE).

---

<div align="center">

🌿 **[Live Demo](https://botanica-ai-mu.vercel.app/)** · 🐙 **[GitHub Repository](https://github.com/viochris/botanica-ai)** · 🐛 **[Report an Issue](https://github.com/viochris/botanica-ai/issues)**

</div>

# DeepFake Shield - Multi-Modal Deepfake Detection Platform

> Professional deepfake detection with visual, audio, and temporal analysis

## 🎯 Project Overview

DeepFake Shield is a comprehensive platform for detecting deepfakes with:
- **Multi-modal analysis** (visual, audio, temporal, lip-sync, metadata)
- **Classification** (face swap, voice clone, multi-stage, etc.)
- **Threat assessment** (LOW/MEDIUM/HIGH based on content sensitivity)
- **Forensic timeline reconstruction** (multi-stage detection)
- **Privacy-first architecture** (on-device & server processing options)

### Platforms
- 🌐 **Web Dashboard** - Professional analysis & forensic reports
- 🔌 **Browser Extension** - Real-time protection on Twitter/Instagram
- 📱 **Mobile App** - Share handler & on-device inference

---

## 🚀 Frontend Setup (React + Vite + Tailwind)

### Prerequisites
- Node.js 16+ 
- npm or yarn

### Installation

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Create environment file**
   ```bash
   cp .env.example .env.local
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

   The app will be available at `http://localhost:5173`

### Build for Production

```bash
npm run build
npm run preview
```

---

## 📁 Project Structure

```
frontend/
├── src/
│   ├── App.jsx                    # Main app component
│   ├── index.css                  # Global styles (Tailwind)
│   ├── main.jsx                   # React entry point
│   │
│   ├── pages/
│   │   ├── Home.jsx               # Upload & main interface
│   │   └── Results.jsx            # Analysis results
│   │
│   ├── components/
│   │   ├── UploadZone.jsx         # Drag-drop upload
│   │   ├── ProcessingIndicator.jsx # Loading animation
│   │   ├── SummaryCard.jsx        # Results summary
│   │   ├── ConfidenceBreakdown.jsx # Score visualization
│   │   ├── ThreatBadge.jsx        # Threat level display
│   │   ├── Tabs.jsx               # Tab navigation
│   │   │
│   │   └── tabs/
│   │       ├── OverviewTab.jsx    # Main findings
│   │       ├── VisualAnalysisTab.jsx # Heatmaps & artifacts
│   │       ├── AudioAnalysisTab.jsx  # Spectrograms & metrics
│   │       └── TimelineTab.jsx    # Multi-stage timeline
│   │
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
└── index.html
```

---

## 🎨 Design System

### Color Palette (Black & Grey)
- **Dark Background** - `#0a0a0a`
- **Dark Secondary** - `#1a1a1a`
- **Dark Tertiary** - `#2a2a2a`
- **Gray Accent** - `#404040`
- **Text Primary** - `#ffffff`
- **Text Secondary** - `#b0b0b0`

### Typography
- **Font Family** - Inter (Google Fonts)
- **Font Weights** - 400 (regular), 600 (semibold), 700 (bold)

### Components
- **Buttons** - `.btn-primary`, `.btn-secondary`
- **Cards** - `.card` (rounded corners, subtle borders)
- **Transitions** - `.transition-smooth` (300ms ease-in-out)

---

## 📡 API Integration

The frontend expects these endpoints from the backend:

### POST `/api/detect`
**Request (multipart form data):**
```json
{
  "video": File,
  "video_url": "https://..." (alternative)
}
```

**Response:**
```json
{
  "overall_confidence": 0.87,
  "classification": "Multi-Stage Hybrid",
  "threat_level": "HIGH",
  "visual_score": 0.92,
  "audio_score": 0.87,
  "temporal_score": 0.81,
  "lipsync_score": 0.76,
  "metadata_score": 0.45
}
```

---

## 🔧 Development Notes

### Adding New Components
1. Create component in `src/components/`
2. Use Tailwind classes for styling
3. Follow existing component patterns
4. Import and use in parent components

### Styling Guidelines
- Use the defined color variables in `tailwind.config.js`
- Prefer Tailwind utilities over custom CSS
- Keep designs clean and minimal
- Ensure responsive design (mobile-first)

### Performance Tips
- Lazy load components if needed
- Optimize images
- Use React.memo for expensive components

---

## 📦 Dependencies

- **React 18** - UI framework
- **Vite** - Build tool
- **Tailwind CSS** - Utility-first CSS
- **Axios** - HTTP client
- **PostCSS** - CSS processing

---

## 🚀 Next Steps

1. **Backend Integration**
   - Connect to FastAPI backend
   - Test API endpoints
   - Handle errors gracefully

2. **Advanced Features** (Tier 2)
   - Heatmap visualization (Grad-CAM)
   - Source image detection display
   - Propagation tracking map
   - PDF report download

3. **Polish** (Tier 3)
   - Add animations
   - Error handling & toasts
   - Accessibility (WCAG)
   - Dark mode toggle

---

## 📝 License

MIT © 2026 DeepFake Shield Team

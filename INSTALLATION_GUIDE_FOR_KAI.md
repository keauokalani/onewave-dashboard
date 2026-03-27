# Website Builder Installation Guide
## For AI Liason DLAM (Kai)

### Project Overview
A browser-based drag-and-drop website builder has been created for One Wave Radio (onewaveradio.com). This is a React + TypeScript application that generates static HTML files suitable for GitHub Pages deployment.

---

## 📦 What Was Built

### Core Components
- **Visual Builder Interface**: Drag-and-drop WYSIWYG editor
- **Component Library**: Pre-built sections (Hero, Music Player, About, Schedule, etc.)
- **Theme System**: Customizable colors, fonts, spacing
- **Background Image Support**: Any component can have background images
- **Custom Button System**: Fully styled buttons with custom colors, borders, padding
- **Music Player**: HTML5-based player with shuffle, skip forward/back, volume control
- **HTML Export**: Generates single self-contained HTML file for GitHub Pages

### Technology Stack
- **Framework**: React 18 + TypeScript
- **Styling**: Tailwind CSS
- **Build Tool**: Vite
- **State Management**: React Hooks (useState, useCallback, useMemo)
- **Icons**: Lucide React
- **Audio**: Native HTML5 Audio API (no external dependencies)

---

## 🚀 Installation Instructions

### Prerequisites
- Node.js 18+ (LTS recommended)
- npm or yarn package manager
- Git (for GitHub Pages deployment)

### Step 1: Initialize Project
```bash
# Create new Vite project with React + TypeScript
npm create vite@latest onewaveradio-builder -- --template react-ts

# Navigate to project
cd onewaveradio-builder

# Install dependencies
npm install
```

### Step 2: Install Required Packages
```bash
# Tailwind CSS
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p

# Icons
npm install lucide-react

# Utilities
npm install clsx
```

### Step 3: Configure Tailwind CSS
Create/modify `tailwind.config.js`:
```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

Create `src/index.css`:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

### Step 4: Deploy Application Code
Replace `src/App.tsx` with the provided application code (see src/App.tsx file).

Update `index.html` title:
```html
<title>One Wave Radio - Website Builder</title>
```

### Step 5: Build and Test
```bash
# Development server
npm run dev

# Build for production
npm run build
```

---

## 🎵 Music Player Implementation Details

### Audio Architecture
- **Engine**: Native HTML5 Audio element
- **Shuffle Algorithm**: Fisher-Yates shuffle on track array
- **State Management**: React useState for play/pause, current track, volume
- **No External Dependencies**: Lightweight, no library overhead

### Track Loading
```javascript
// Example track URLs from Cloudflare R2
const tracks = [
  "https://account.r2.cloudflarestorage.com/track1.mp3",
  "https://account.r2.cloudflarestorage.com/track2.mp3",
  "https://account.r2.cloudflarestorage.com/track3.mp3"
];
```

### Controls
- Skip Back (←): Previous track or restart current
- Listen Live (Center): Toggle play/pause
- Skip Forward (→): Next track (randomized shuffle)
- Volume Slider: 0-100 range

---

## 🎨 Customization System

### Button Properties (All Components)
Each button supports:
- `buttonBackground`: HEX color
- `buttonTextColor`: HEX color  
- `buttonBorderRadius`: CSS value (e.g., "8px", "9999px")
- `buttonBorderWidth`: Pixel value (0-5)
- `buttonBorderColor`: HEX color
- `buttonPadding`: CSS value (e.g., "12px 24px")
- `buttonFontSize`: CSS value (e.g., "16px")

### Background Images
All section components support:
- `backgroundImage`: Direct URL to image
- `backgroundOverlay`: 0-100 opacity percentage
- `backgroundSize`: CSS value ("cover", "contain", "100% auto")

### Theme Variables
Global theme settings:
- Primary Color
- Secondary Color
- Background Color
- Text Color

---

## 📤 Export and Deployment

### Export Process
1. User clicks "Export HTML" button
2. Application generates complete HTML document with:
   - Embedded CSS (Tailwind CDN + custom styles)
   - Embedded JavaScript (React runtime + component logic)
   - All component markup
3. File downloads as `index.html`

### GitHub Pages Deployment
1. Create repository: `onewaveradio.github.io`
2. Upload exported `index.html` to root
3. Enable GitHub Pages in repository settings
4. (Optional) Configure custom domain: `www.onewaveradio.com`

---

## 🏗️ Component Architecture

### Component Types
```typescript
// All available components
const COMPONENT_TYPES = [
  'hero',
  'musicPlayer',      // Custom player with skip controls
  'about',
  'schedule',
  'shows',
  'gallery',
  'contact',
  'social',
  'text',
  'cta',
  'customButton'      // Standalone customizable button
];
```

### Data Structure
```typescript
interface WebsiteComponent {
  id: string;
  type: ComponentType;
  props: ComponentProps;  // Varies by component type
}

interface Theme {
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string;
  textColor: string;
  title: string;
  description: string;
}
```

---

## 💾 Data Persistence

### Current Implementation
- State stored in React useState (memory only)
- No localStorage or backend (by design for simplicity)
- HTML export captures current state

### Future Enhancement (Optional)
Could add localStorage auto-save:
```javascript
// Save to localStorage
localStorage.setItem('onewaveradio-builder', JSON.stringify(state));

// Load from localStorage
const saved = localStorage.getItem('onewaveradio-builder');
if (saved) setState(JSON.parse(saved));
```

---

## 🔧 Maintenance Tasks for Kai

### Regular Tasks
1. **Update Tailwind CDN version** in export HTML if needed
2. **Monitor React version compatibility** when updating packages
3. **Test audio playback** across browsers (Chrome, Firefox, Safari)
4. **Verify GitHub Pages deployment** process

### Troubleshooting
- **Audio not playing**: Check CORS headers on Cloudflare R2
- **Export not working**: Verify all component render functions
- **Styling issues**: Check Tailwind CDN is loading in exported HTML

---

## 📋 File Structure

```
onewaveradio-builder/
├── index.html              # Entry point
├── package.json            # Dependencies
├── tailwind.config.js      # Tailwind configuration
├── postcss.config.js       # PostCSS configuration
├── vite.config.ts          # Vite configuration
├── tsconfig.json           # TypeScript configuration
└── src/
    ├── main.tsx            # React entry point
    ├── App.tsx             # Main application (all builder logic)
    ├── index.css           # Tailwind directives
    └── vite-env.d.ts       # TypeScript types
```

---

## 🌐 Cloudflare Integration

### R2 Storage Setup
1. Create R2 bucket in Cloudflare dashboard
2. Upload MP3 files and images
3. Enable public access for each file
4. Copy public URLs for use in builder

### CORS Configuration (Important for Audio)
Ensure R2 bucket CORS policy allows:
```json
{
  "allowedOrigins": ["*"],
  "allowedMethods": ["GET", "HEAD"],
  "allowedHeaders": ["*"],
  "maxAgeSeconds": 3600
}
```

---

## 📞 Support Notes

This is a single-page application (SPA) that runs entirely in the browser. No server-side processing is required. The generated HTML files are static and can be hosted on any static hosting service (GitHub Pages, Netlify, Vercel, Cloudflare Pages, etc.).

For questions or issues, refer to:
- React documentation: https://react.dev
- Tailwind CSS documentation: https://tailwindcss.com
- GitHub Pages documentation: https://docs.github.com/en/pages

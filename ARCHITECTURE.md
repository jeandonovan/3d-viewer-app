# Architecture Document: 3D Architecture Viewer

## Project Overview

**Purpose**: A lightweight, high-performance 3D model viewer optimized for architects, students, and small businesses.

**Core Constraints**:
- Minimal dependencies, no bloat
- Runs on modest hardware (2GB+ RAM)
- Fast rendering and loading
- Simple, uncluttered UI
- No collaboration, no complex backends

**Stack**: Next.js 16 App Router, TypeScript, Tailwind CSS, Three.js, React Three Fiber, Zustand, Zod

---

## System Architecture

### 1. Technology Layer

```
┌─────────────────────────────────────────┐
│         User Interface (React)          │
├─────────────────────────────────────────┤
│   State Management (Zustand)            │
├─────────────────────────────────────────┤
│  3D Engine (Three.js + React Three)     │
├─────────────────────────────────────────┤
│     Browser APIs (Canvas, WebGL)        │
└─────────────────────────────────────────┘
```

### 2. Data Flow

```
User Upload → File Validation (Zod) → Model Loader → Scene Update → Zustand Store → UI Re-render
```

### 3. Component Hierarchy

```
App (page.tsx)
├── Header
│   ├── Title
│   └── FileUpload
├── Canvas Container
│   ├── Suspense
│   └── Scene (Fiber)
│       ├── Camera
│       ├── Lights
│       ├── Model (glTF/GLB)
│       └── Controls (OrbitControls via Drei)
└── Control Panel
    ├── QualitySelector
    ├── CameraControls
    ├── RenderStats
    └── ExportButton
```

---

## File Responsibilities

### `/app`

#### `layout.tsx`
- **Purpose**: Root layout wrapper
- **Responsibilities**:
  - Set metadata (title, description, viewport)
  - Import global fonts (Space Grotesk, Inter, JetBrains Mono)
  - Inject global styles
  - Configure color scheme
- **Type**: Server component

#### `page.tsx`
- **Purpose**: Main viewer page
- **Responsibilities**:
  - Render Three.js canvas container
  - Mount control panel
  - Manage Suspense boundaries
  - Handle initial load state
- **Type**: Client component

#### `error.tsx`
- **Purpose**: Error boundary
- **Responsibilities**:
  - Catch and display application errors
  - Provide reset mechanism
  - Log errors to console
- **Type**: Client component

#### `globals.css`
- **Purpose**: Global styles and design tokens
- **Responsibilities**:
  - Define Tailwind directives (`@import 'tailwindcss'`)
  - Setup font faces via Google Fonts
  - Configure base element styles
  - Define component utilities (`.btn-primary`, `.panel`, etc.)
  - Define utility classes (`.flex-center`, `.text-muted`, etc.)
- **Layers**:
  - `@layer base`: Element resets and typography
  - `@layer components`: Reusable component classes
  - `@layer utilities`: Helper utilities

---

### `/components/canvas`

#### `Scene.tsx`
- **Purpose**: Three.js scene wrapper
- **Responsibilities**:
  - Create and manage Fiber canvas
  - Setup viewport
  - Configure pixel ratio based on quality
  - Mount camera, lights, model
  - Handle window resize
- **Props**: Quality level, callback for stats
- **Dependencies**: Three, React Three Fiber

#### `Camera.tsx`
- **Purpose**: Camera and orbit controls
- **Responsibilities**:
  - Setup perspective camera
  - Mount OrbitControls from Drei
  - Configure auto-rotation
  - Handle zoom/pan
  - Respond to quality changes
- **Props**: Auto-rotate toggle, camera config

#### `Model.tsx`
- **Purpose**: Load and render glTF/GLB models
- **Responsibilities**:
  - Load model from URL (data blob or uploaded file)
  - Validate geometry
  - Auto-fit to viewport
  - Handle loading errors
  - Track triangle count
  - Respond to quality changes (LOD or material adjustments)
- **Props**: Model URL, quality level
- **Dependencies**: `useGLTF` from Drei, Zustand store

#### `Lights.tsx`
- **Purpose**: Scene lighting setup
- **Responsibilities**:
  - Create directional light
  - Create ambient light
  - Configure shadows (based on quality)
  - Adjust intensity based on preset
- **Props**: Quality level
- **Logic**: Low quality disables shadows; high quality enables them

---

### `/components/ui`

#### `Header.tsx`
- **Purpose**: Top navigation bar
- **Responsibilities**:
  - Display app title
  - Show file upload trigger
  - Display current model name
  - Provide quick settings access

#### `Controls.tsx`
- **Purpose**: Main control panel container
- **Responsibilities**:
  - Mount quality selector
  - Mount camera controls
  - Mount render stats
  - Mount export button
  - Manage panel layout

#### `QualitySelector.tsx`
- **Purpose**: Quality level switcher
- **Responsibilities**:
  - Display low/high quality buttons
  - Update Zustand store
  - Show current selection
- **Props**: Current quality, onChange callback

#### `RenderStats.tsx`
- **Purpose**: Display real-time render metrics
- **Responsibilities**:
  - Show FPS
  - Show render time (ms)
  - Show triangle count
  - Show draw calls
  - Update every 100ms from store
- **Props**: Stats object from Zustand

#### `ExportButton.tsx`
- **Purpose**: Screenshot export
- **Responsibilities**:
  - Trigger canvas capture via `canvas.toDataURL()`
  - Generate PNG/JPEG
  - Download file
  - Show export dialog with format/resolution options
- **Props**: Export options schema

#### `FileUpload.tsx`
- **Purpose**: File upload input
- **Responsibilities**:
  - Accept `.glb` and `.gltf` files
  - Validate file size (< 50MB)
  - Validate MIME type
  - Convert file to blob URL
  - Update Zustand store with model metadata
  - Display error messages
- **Dependencies**: Zod validator

---

### `/lib`

#### `validators.ts`
- **Purpose**: Zod validation schemas
- **Schemas**:
  - `FileUploadSchema`: Validate file object
  - `QualityLevelSchema`: Validate 'low' | 'high'
  - `ExportOptionsSchema`: Validate export parameters
  - `CameraControlsSchema`: Validate camera settings
- **Exports**: Type inferences for TypeScript

#### `types.ts`
- **Purpose**: Utility types and helper functions
- **Exports**:
  - `Result<T, E>`: Generic result type for error handling
  - `ok<T>`, `err<E>`: Helper constructors
  - `AsyncResult<T, E>`: Promise version

#### `constants.ts`
- **Purpose**: Application-wide constants
- **Exports**:
  - `QUALITY_PRESETS`: Low/high render configs
  - `FILE_CONSTRAINTS`: Max size, formats
  - `EXPORT_DEFAULTS`: Default PNG export settings
  - `CAMERA_DEFAULTS`: FOV, near, far, position
  - `TIMINGS`: Debounce, stats update intervals
  - `UI`: Panel width, header height

---

### `/store`

#### `useViewerStore.ts`
- **Purpose**: Zustand store for global state
- **State Branches**:
  - **Model**: `model`, `isModelLoaded`, `modelError`
  - **Render**: `quality`, `stats`
  - **Camera**: `autoRotate`
  - **Recording**: `isRecording`, `recordedTime`
- **Actions**:
  - `setModel`, `setIsModelLoaded`, `setModelError`
  - `setQuality`, `setStats`
  - `setAutoRotate`
  - `startRecording`, `stopRecording`, `resetRecording`
  - `resetStore`
- **Selectors**: Optimized sub-selectors to prevent unnecessary re-renders
- **Subscriptions**: Persist quality setting to localStorage (future)

---

### `/types`

#### `index.ts`
- **Purpose**: Global TypeScript types
- **Types**:
  - `QualityLevel`: Union type for 'low' | 'high'
  - `ModelMetadata`: File name, format, size, upload date
  - `RenderStats`: FPS, render time, triangle count, draw calls, GPU memory
  - `ViewerState`: Combined model + render state
  - `CameraControls`: Settings for orbit controls
  - `ExportOptions`: Format, dimensions, quality

---

## State Management Pattern

### Zustand Store Structure

```typescript
useViewerStore
├── Model State
│   ├── model: ModelMetadata | null
│   ├── isModelLoaded: boolean
│   ├── modelError: string | null
│   ├── setModel()
│   ├── setIsModelLoaded()
│   └── setModelError()
├── Render State
│   ├── quality: 'low' | 'high'
│   ├── stats: RenderStats | null
│   ├── setQuality()
│   └── setStats()
├── Camera State
│   ├── autoRotate: boolean
│   └── setAutoRotate()
├── Recording State
│   ├── isRecording: boolean
│   ├── recordedTime: number
│   ├── startRecording()
│   ├── stopRecording()
│   └── resetRecording()
└── Global
    └── resetStore()
```

### Usage Pattern

```typescript
// Component subscription
const quality = useViewerStore((state) => state.quality);
const stats = useViewerStore(selectStats);

// Action dispatching
useViewerStore.setState({ quality: 'low' });
```

---

## Data Validation Strategy

### File Upload Validation

```
User selects file
  ↓
[Check MIME type or extension]
  ↓
[Check file size < 50MB]
  ↓
Zod validation (FileUploadSchema)
  ↓
Success → Convert to blob URL → Update store
Error → Show error message in UI
```

### Export Options Validation

```
User clicks Export
  ↓
Show dialog with format, width, height, quality
  ↓
Validate via ExportOptionsSchema
  ↓
Call canvas.toDataURL() → Generate file → Download
```

---

## Performance Optimization Strategy

### Quality Presets

| Aspect | Low | High |
|--------|-----|------|
| Max Triangles | 100K | 1M |
| Shadow Maps | ✗ | ✓ |
| Antialiasing | ✗ | ✓ |
| Pixel Ratio | 0.5 | 1.0 |
| Target FPS | 30-60 | 60+ |

### Memory Management

- **Model Loading**: Use `useGLTF` with caching
- **Texture Handling**: Compressed when possible
- **Cleanup**: Dispose geometries/materials on unmount
- **State Persistence**: Only store necessary metadata (not full model data)

### Bundle Size Optimization

- **Code Splitting**: Route-level splitting via Next.js
- **Tree Shaking**: ESM modules with `sideEffects: false`
- **Dynamic Imports**: Lazy-load Three.js helpers if needed
- **Tailwind Purging**: Only ship used CSS classes

---

## Error Handling

### Layers

1. **File Upload Errors**: Caught in `FileUpload.tsx`, displayed in UI
2. **Model Loading Errors**: Caught in `Model.tsx`, stored in Zustand
3. **Render Errors**: Caught by `error.tsx` boundary
4. **Network Errors**: Handled in data fetching (future)

### User Feedback

- Toast messages or inline error badges
- Error state stored in Zustand for persistence
- Clear, actionable error messages (not raw stack traces)

---

## Future Extensibility

### Planned Features (Post-MVP)

- **Multiple Model Formats**: FBX, OBJ, DAE support
- **Collaboration**: WebSocket sync for shared viewing
- **Annotations**: Add labels/measurements to models
- **Animation Timeline**: Play/pause glTF animations
- **Performance Profiling**: Advanced GPU/CPU metrics
- **Dark/Light Modes**: Theme toggle
- **Persistence**: Save viewer state to localStorage
- **Advanced Export**: Video recording, 360° renders

### Design Decisions for Extensibility

- **Modular Components**: Each `components/canvas/*` is independent
- **Store Extensibility**: New state branches can be added without refactoring
- **Validator Reusability**: Zod schemas can be composed and extended
- **Constant Organization**: Easy to add new presets or settings

---

## Risk Assessment

### Technical Risks

| Risk | Impact | Mitigation |
|------|--------|-----------|
| Large model crashes browser | Critical | Implement geometry decimation, LOD system |
| WebGL context loss | High | Add recovery mechanism, user notification |
| Memory leaks in Fiber | High | Manual disposal, React cleanup effects |
| Poor mobile performance | Medium | Adaptive quality, touch gesture optimization |
| Three.js version updates | Low | Pin version, test before upgrading |

### UX Risks

| Risk | Impact | Mitigation |
|------|--------|-----------|
| Confusing UI for non-technical users | Medium | Tooltips, sensible defaults, simple controls |
| Slow initial load | High | Progress bar, lazy loading, caching |
| Export quality expectations | Medium | Clear documentation, format examples |

---

## Development Phases

### Phase 0: Setup ✓
- Project initialization
- Configuration files
- Store and types setup
- Basic layout

### Phase 1: Core 3D Rendering (MVP)
- Scene component
- Model loader
- Camera controls
- Basic lighting

### Phase 2: Quality & Performance
- Quality selector
- Render stats display
- Performance profiling
- LOD system

### Phase 3: Export & UI
- Export button
- File upload
- Control panel UI
- Error handling

### Phase 4: Polish & Testing
- Unit tests
- E2E tests
- Performance audit
- Documentation

---

## Deployment Strategy

### Development
```bash
npm run dev
# Runs on http://localhost:3000
```

### Production Build
```bash
npm run build
npm start
# Optimized build in .next/
```

### Hosting Options
- **Vercel**: Recommended (Next.js native)
- **Netlify**: Works with Next.js adapter
- **Self-hosted**: Docker container with Node.js

### Environment Variables
- `NEXT_PUBLIC_API_URL`: (for future backend)
- `NODE_ENV`: development/production
- Quality presets can be overridden via env

---

## Monitoring & Observability

### Client-Side Metrics
- FPS, render time (real-time in UI)
- Error tracking (stored in Zustand)
- Performance timeline (via Web Performance API)

### Future: Server-Side Analytics
- Model upload statistics
- Export usage patterns
- User device/browser breakdown

---

## Documentation Structure

- **README.md**: Quick start, features overview
- **ARCHITECTURE.md**: This document
- **Code Comments**: JSDoc for public functions
- **Component READMEs**: (Optional) Per-component docs
- **DEVELOPMENT.md**: Dev workflow, contributing guidelines

---

## Conclusion

This architecture prioritizes **simplicity**, **performance**, and **maintainability** for the MVP phase. The modular structure allows for clean extensions in future phases without fundamental redesign.

**Key Principles**:
1. **Client-first**: No backend complexity initially
2. **Performance-aware**: Quality presets, render stats
3. **Type-safe**: TypeScript + Zod validation throughout
4. **Maintainable**: Clear file organization, single responsibilities
5. **Extensible**: Easy to add features without refactoring

Next steps: Phase 1 development (Scene, Model Loader, Camera).

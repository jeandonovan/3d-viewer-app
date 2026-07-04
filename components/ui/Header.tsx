'use client';

import { useViewerStore } from '@/store/useViewerStore';

/**
 * Header Component - Top navigation bar
 *
 * Responsibilities:
 * - Display app title and logo
 * - Show current model name
 * - Provide visual feedback for app status
 * - Simple, minimal design
 */
export default function Header() {
  const model = useViewerStore((state) => state.model);
  const isModelLoaded = useViewerStore((state) => state.isModelLoaded);

  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-surface-900 border-b border-surface-600 z-50 flex items-center justify-between px-6">
      {/* Left: Logo and title */}
      <div className="flex items-center gap-3">
        <div className="text-2xl font-bold text-accent-400">🏗️</div>
        <div>
          <h1 className="text-lg font-bold text-canvas-100">3D Viewer</h1>
          <p className="text-xs text-surface-400">Architecture Viewer</p>
        </div>
      </div>

      {/* Right: Model info */}
      <div className="flex items-center gap-4">
        {model && isModelLoaded ? (
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <div className="text-right">
              <p className="text-xs text-surface-400">Model loaded</p>
              <p className="text-sm font-mono text-canvas-100 truncate max-w-xs">
                {model.name}
              </p>
            </div>
          </div>
        ) : model ? (
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse" />
            <div className="text-right">
              <p className="text-xs text-surface-400">Loading...</p>
              <p className="text-sm font-mono text-canvas-100 truncate max-w-xs">
                {model.name}
              </p>
            </div>
          </div>
        ) : (
          <div className="text-xs text-surface-400">Ready to upload</div>
        )}
      </div>
    </header>
  );
}

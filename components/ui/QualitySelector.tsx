'use client';

import { useViewerStore } from '@/store/useViewerStore';

/**
 * QualitySelector Component - Switch between quality presets
 *
 * Responsibilities:
 * - Display low/high quality buttons
 * - Update Zustand store on selection
 * - Show current quality level
 * - Provide visual feedback
 */
export default function QualitySelector() {
  const quality = useViewerStore((state) => state.quality);
  const setQuality = useViewerStore((state) => state.setQuality);

  return (
    <div className="space-y-3 p-4 bg-surface-800 rounded-lg">
      <div className="grid grid-cols-2 gap-3">
        {/* Low Quality */}
        <button
          onClick={() => setQuality('low')}
          className={`
            p-3 rounded-lg font-medium text-sm transition-all
            ${
              quality === 'low'
                ? 'bg-accent-600 text-white'
                : 'bg-surface-700 text-canvas-100 hover:bg-surface-600'
            }
          `}
        >
          ⚡ Low
        </button>

        {/* High Quality */}
        <button
          onClick={() => setQuality('high')}
          className={`
            p-3 rounded-lg font-medium text-sm transition-all
            ${
              quality === 'high'
                ? 'bg-accent-600 text-white'
                : 'bg-surface-700 text-canvas-100 hover:bg-surface-600'
            }
          `}
        >
          ✨ High
        </button>
      </div>

      {/* Description */}
      <div className="text-xs text-surface-400 space-y-1">
        {quality === 'low' ? (
          <>
            <p className="font-medium text-canvas-100">Low Quality</p>
            <p>50% resolution, no shadows, optimized for performance</p>
          </>
        ) : (
          <>
            <p className="font-medium text-canvas-100">High Quality</p>
            <p>Full resolution, shadows enabled, best visuals</p>
          </>
        )}
      </div>
    </div>
  );
}

'use client';

import type { RenderStats } from '@/types/index';

interface RenderStatsProps {
  stats: RenderStats;
}

/**
 * RenderStats Component - Display real-time render metrics
 *
 * Responsibilities:
 * - Show FPS
 * - Show render time in milliseconds
 * - Show triangle count
 * - Show draw calls
 * - Display GPU memory usage
 */
export default function RenderStats({ stats }: RenderStatsProps) {
  const getHealthColor = (fps: number) => {
    if (fps >= 55) return 'text-green-400';
    if (fps >= 30) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <div className="space-y-2 p-4 bg-surface-800 rounded-lg font-mono text-sm">
      {/* FPS */}
      <div className="flex items-center justify-between">
        <span className="text-surface-400">FPS</span>
        <span className={`font-semibold ${getHealthColor(stats.fps)}`}>
          {Math.round(stats.fps)}
        </span>
      </div>

      {/* Render Time */}
      <div className="flex items-center justify-between">
        <span className="text-surface-400">Render Time</span>
        <span className="text-canvas-100">{stats.renderTime.toFixed(2)}ms</span>
      </div>

      {/* Triangles */}
      <div className="flex items-center justify-between">
        <span className="text-surface-400">Triangles</span>
        <span className="text-accent-300">
          {(stats.triangles / 1000).toFixed(1)}K
        </span>
      </div>

      {/* Draw Calls */}
      <div className="flex items-center justify-between">
        <span className="text-surface-400">Draw Calls</span>
        <span className="text-canvas-100">{stats.drawCalls}</span>
      </div>

      {/* GPU Memory */}
      {stats.gpuMemory > 0 && (
        <div className="flex items-center justify-between">
          <span className="text-surface-400">GPU Memory</span>
          <span className="text-canvas-100">{stats.gpuMemory.toFixed(1)}MB</span>
        </div>
      )}

      {/* Divider */}
      <div className="h-px bg-surface-600 my-2" />

      {/* Health Status */}
      <div className="text-xs text-surface-400 p-2 bg-surface-700 rounded">
        <p className={`font-medium ${getHealthColor(stats.fps)}`}>
          {stats.fps >= 55
            ? '✓ Excellent performance'
            : stats.fps >= 30
              ? '⚠ Good performance'
              : '✗ Low performance - try Low Quality'}
        </p>
      </div>
    </div>
  );
}

'use client';

import { useState } from 'react';
import { useViewerStore } from '@/store/useViewerStore';
import FileUpload from './FileUpload';
import RenderStats from './RenderStats';
import QualitySelector from './QualitySelector';
import CameraControls from './CameraControls';

/**
 * Controls Component - Main control panel
 *
 * Responsibilities:
 * - Mount and manage all control sub-components
 * - Organize panel layout
 * - Provide collapsible sections
 * - Handle panel state
 */
export default function Controls() {
  const [expandedSection, setExpandedSection] = useState<string | null>(
    'upload'
  );

  const model = useViewerStore((state) => state.model);
  const stats = useViewerStore((state) => state.stats);

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  return (
    <aside className="fixed top-16 right-0 bottom-0 w-80 bg-surface-900 border-l border-surface-600 overflow-y-auto z-40">
      {/* Container */}
      <div className="p-6 space-y-6">
        {/* Upload Section */}
        <div className="space-y-3">
          <button
            onClick={() => toggleSection('upload')}
            className="w-full flex items-center justify-between p-3 bg-surface-800 rounded-lg hover:bg-surface-700 transition-colors"
          >
            <span className="font-semibold text-canvas-100">📤 Upload</span>
            <span className="text-xs text-surface-400">
              {expandedSection === 'upload' ? '▼' : '▶'}
            </span>
          </button>
          {expandedSection === 'upload' && <FileUpload />}
        </div>

        {/* Divider */}
        <div className="h-px bg-surface-600" />

        {/* Quality Section */}
        {model && (
          <div className="space-y-3">
            <button
              onClick={() => toggleSection('quality')}
              className="w-full flex items-center justify-between p-3 bg-surface-800 rounded-lg hover:bg-surface-700 transition-colors"
            >
              <span className="font-semibold text-canvas-100">⚙️ Quality</span>
              <span className="text-xs text-surface-400">
                {expandedSection === 'quality' ? '▼' : '▶'}
              </span>
            </button>
            {expandedSection === 'quality' && <QualitySelector />}
          </div>
        )}

        {/* Camera Section */}
        {model && (
          <div className="space-y-3">
            <button
              onClick={() => toggleSection('camera')}
              className="w-full flex items-center justify-between p-3 bg-surface-800 rounded-lg hover:bg-surface-700 transition-colors"
            >
              <span className="font-semibold text-canvas-100">📷 Camera</span>
              <span className="text-xs text-surface-400">
                {expandedSection === 'camera' ? '▼' : '▶'}
              </span>
            </button>
            {expandedSection === 'camera' && <CameraControls />}
          </div>
        )}

        {/* Stats Section */}
        {model && stats && (
          <div className="space-y-3">
            <button
              onClick={() => toggleSection('stats')}
              className="w-full flex items-center justify-between p-3 bg-surface-800 rounded-lg hover:bg-surface-700 transition-colors"
            >
              <span className="font-semibold text-canvas-100">📊 Stats</span>
              <span className="text-xs text-surface-400">
                {expandedSection === 'stats' ? '▼' : '▶'}
              </span>
            </button>
            {expandedSection === 'stats' && <RenderStats stats={stats} />}
          </div>
        )}

        {/* Empty State */}
        {!model && (
          <div className="p-4 rounded-lg bg-surface-800 border border-surface-600">
            <p className="text-xs text-surface-400 text-center">
              📝 Upload a model to get started
            </p>
          </div>
        )}
      </div>
    </aside>
  );
}

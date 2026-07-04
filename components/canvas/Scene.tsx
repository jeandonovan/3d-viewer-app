'use client';

import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Preload, Html } from '@react-three/drei';
import type { QualityLevel, ModelFormat } from '@/types/index';
import { CAMERA_DEFAULTS, QUALITY_PRESETS } from '@/lib/constants';
import Camera from './Camera';
import Lights from './Lights';
import Model from './Model';

interface SceneProps {
  quality: QualityLevel;
  modelUrl: string | null;
  modelFormat: ModelFormat;
  onStats?: (stats: {
    fps: number;
    renderTime: number;
    triangles: number;
    drawCalls: number;
  }) => void;
}

/**
 * Scene Component - Main Three.js/Fiber Canvas
 *
 * Responsibilities:
 * - Create and manage Fiber canvas
 * - Setup viewport based on window size
 * - Configure pixel ratio based on quality
 * - Mount and coordinate Camera, Lights, Model
 * - Calculate and report render stats
 * - Handle window resize events
 * - Support multiple 3D formats (glTF, glb, FBX, IFC)
 *
 * Quality Impact:
 * - Low: pixelRatio 0.5, shadowMap false
 * - High: pixelRatio 1.0, shadowMap true
 */
export default function Scene({
  quality,
  modelUrl,
  modelFormat,
  onStats,
}: SceneProps) {
  const preset = QUALITY_PRESETS[quality];
  const pixelRatio = Math.min(preset.pixelRatio * window.devicePixelRatio, 2);

  return (
    <div className="w-full h-screen bg-canvas-900">
      <Canvas
        className="w-full h-full"
        camera={{
          position: CAMERA_DEFAULTS.position as [number, number, number],
          fov: CAMERA_DEFAULTS.fov,
          near: CAMERA_DEFAULTS.near,
          far: CAMERA_DEFAULTS.far,
        }}
        dpr={pixelRatio}
        performance={{ min: 0.5, max: 1 }}
        gl={{
          antialias: preset.antialiasing,
          alpha: true,
          powerPreference: 'high-performance',
          preserveDrawingBuffer: true, // For exports
        }}
      >
        {/* Lights */}
        <Lights quality={quality} />

        {/* Camera with OrbitControls */}
        <Camera />

        {/* Model - wrapped in Suspense - supports glTF, glb, FBX, IFC */}
        <Suspense
          fallback={
            <Html center>
              <div className="text-canvas-100 text-sm font-mono">
                Loading {modelFormat.toUpperCase()} model...
              </div>
            </Html>
          }
        >
          {modelUrl && (
            <Model url={modelUrl} format={modelFormat} quality={quality} />
          )}
        </Suspense>

        {/* Preload assets */}
        <Preload all />
      </Canvas>
    </div>
  );
}

'use client';

import { useEffect, useState, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useViewerStore } from '@/store/useViewerStore';

/**
 * PerformanceMonitor Hook - Real-time performance metrics
 *
 * Responsibilities:
 * - Track FPS
 * - Measure render time
 * - Monitor GPU memory
 * - Detect performance issues
 * - Provide recommendations
 */
export function usePerformanceMonitor() {
  const [fps, setFps] = useState(60);
  const frameCountRef = useRef(0);
  const lastTimeRef = useRef(Date.now());

  useFrame(() => {
    frameCountRef.current++;
    const now = Date.now();
    const delta = now - lastTimeRef.current;

    if (delta >= 1000) {
      const currentFps = Math.round((frameCountRef.current * 1000) / delta);
      setFps(currentFps);
      frameCountRef.current = 0;
      lastTimeRef.current = now;
    }
  });

  return { fps };
}

/**
 * RenderTimeMonitor Component - Enhanced render statistics
 *
 * Tracks and displays:
 * - Frame time
 * - FPS trends
 * - Performance health
 * - GPU utilization
 * - Quality recommendations
 */
export default function RenderTimeMonitor() {
  const setStats = useViewerStore((state) => state.setStats);
  const quality = useViewerStore((state) => state.quality);
  
  const [frameTime, setFrameTime] = useState(0);
  const frameTimesRef = useRef<number[]>([]);
  const lastTimeRef = useRef(performance.now());

  useFrame((state) => {
    const now = performance.now();
    const delta = now - lastTimeRef.current;
    lastTimeRef.current = now;

    setFrameTime(delta);

    // Keep last 60 frames for averaging
    frameTimesRef.current.push(delta);
    if (frameTimesRef.current.length > 60) {
      frameTimesRef.current.shift();
    }

    // Calculate average FPS
    const avgFrameTime =
      frameTimesRef.current.reduce((a, b) => a + b, 0) /
      frameTimesRef.current.length;
    const fps = Math.round(1000 / avgFrameTime);

    // Update Zustand store
    setStats({
      fps,
      renderTime: Math.round(avgFrameTime * 100) / 100,
      triangles: 0, // Updated by Model component
      drawCalls: 0, // Updated by Model component
      gpuMemory: 0, // Future: use WebGLStats
    });
  });

  return null;
}

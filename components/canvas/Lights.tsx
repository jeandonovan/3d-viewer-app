'use client';

import { useEffect } from 'react';
import { useThree } from '@react-three/fiber';
import { QUALITY_PRESETS } from '@/lib/constants';
import type { QualityLevel } from '@/types/index';

interface LightsProps {
  quality: QualityLevel;
}

/**
 * Lights Component - Scene lighting setup
 *
 * Responsibilities:
 * - Create directional light (sun-like)
 * - Create ambient light (fill light)
 * - Configure shadows (based on quality)
 * - Adjust intensity based on preset
 *
 * Quality Impact:
 * - Low: No shadows, lower intensity
 * - High: Shadows enabled, optimal intensity
 */
export default function Lights({ quality }: LightsProps) {
  const { scene } = useThree();
  const preset = QUALITY_PRESETS[quality];

  useEffect(() => {
    // Clear existing lights
    scene.children.forEach((child) => {
      if (
        child instanceof THREE.Light ||
        (child.type && child.type.includes('Light'))
      ) {
        scene.remove(child);
      }
    });

    // Import THREE for type checking
    const THREE = require('three');

    // Directional Light (Sun)
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(10, 15, 10);
    directionalLight.castShadow = preset.shadowMap;

    if (preset.shadowMap) {
      directionalLight.shadow.mapSize.width = 2048;
      directionalLight.shadow.mapSize.height = 2048;
      directionalLight.shadow.camera.left = -50;
      directionalLight.shadow.camera.right = 50;
      directionalLight.shadow.camera.top = 50;
      directionalLight.shadow.camera.bottom = -50;
      directionalLight.shadow.camera.near = 0.5;
      directionalLight.shadow.camera.far = 500;
      directionalLight.shadow.bias = -0.0001;
    }

    scene.add(directionalLight);

    // Ambient Light (Fill)
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);

    // Point Light (optional accent)
    const pointLight = new THREE.PointLight(0xffffff, 0.3);
    pointLight.position.set(-10, 10, 5);
    scene.add(pointLight);

    return () => {
      // Cleanup not needed as we replace lights each render
    };
  }, [quality, scene]);

  return null;
}

import { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { getEmissionColor } from '../utils/color';
import { latLngToVector3 } from '../utils/coordinate';
import type { EmissionPoint } from '../data/dataTypes';

/**
 * 粒子点组件 Props
 */
interface EmissionParticlesProps {
  globeData: EmissionPoint[];
  earthRadius?: number;
}

/**
 * 粒子数据引用接口
 */
interface DataRef {
  initialPositions: Float32Array;
  targetPositions: Float32Array;
}

/**
 * 粒子点组件 - 带开场动画
 * 使用 seeded random 确保随机值一致
 */
const EmissionParticles = ({ globeData, earthRadius = 2 }: EmissionParticlesProps) => {
  const pointsRef = useRef<THREE.Points>(null);
  const sizesRef = useRef<Float32Array | null>(null);
  const dataRef = useRef<DataRef>({ initialPositions: new Float32Array(), targetPositions: new Float32Array() });

  // 创建圆形纹理 - 使用 useMemo 避免重复创建
  const circleTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 32;
    canvas.height = 32;
    const ctx = canvas.getContext('2d');

    const gradient = ctx!.createRadialGradient(16, 16, 0, 16, 16, 16);
    gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
    gradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.8)');
    gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

    ctx!.fillStyle = gradient;
    ctx!.fillRect(0, 0, 32, 32);

    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    return texture;
  }, []);

  const { positions, colors, sizes, initialPositions, targetPositions } = useMemo(() => {
    const targetPositions: number[] = [];
    const initialPositionsArr: number[] = [];
    const colors: number[] = [];
    const sizes: number[] = [];

    // 使用 seeded random 避免重新渲染时变化
    function createSeededRandom(seed: number) {
      let s = seed;
      return () => {
        s = (s * 9301 + 49297) % 233280;
        return s / 233280;
      };
    }
    const random = createSeededRandom(42);

    // 粒子在地球表面上方一点
    const particleRadius = earthRadius + 0.05;

    globeData.forEach((point) => {
      const [lat, lng, val1] = point;
      const emissionValue = val1;

      // 目标位置（地球表面）
      const pos = latLngToVector3(lat, lng, particleRadius);
      targetPositions.push(pos.x, pos.y, pos.z);

      // 初始位置（从外部空间随机位置）
      const randomAngle1 = random() * Math.PI * 2;
      const randomAngle2 = (random() - 0.5) * Math.PI;
      const randomDistance = 8 + random() * 4;
      initialPositionsArr.push(
        Math.cos(randomAngle1) * Math.cos(randomAngle2) * randomDistance,
        Math.sin(randomAngle2) * randomDistance,
        Math.sin(randomAngle1) * Math.cos(randomAngle2) * randomDistance
      );

      const color = getEmissionColor(emissionValue);
      colors.push(color.r, color.g, color.b);

      // 根据排放值计算点的大小
      const normalizedValue = Math.max(0, emissionValue / 82);
      const baseSize = 0.012 + normalizedValue * 0.035;
      sizes.push(baseSize);
    });

    return {
      positions: new Float32Array(initialPositionsArr),
      colors: new Float32Array(colors),
      sizes: new Float32Array(sizes),
      initialPositions: new Float32Array(initialPositionsArr),
      targetPositions: new Float32Array(targetPositions)
    };
  }, [globeData, earthRadius]);

  useEffect(() => {
    dataRef.current = { initialPositions, targetPositions };
  }, [initialPositions, targetPositions]);

  useEffect(() => {
    sizesRef.current = sizes;
  }, [sizes]);

  // 动画更新位置
  useFrame((state) => {
    if (!pointsRef.current || !dataRef.current.initialPositions.length) return;

    const time = state.clock.elapsedTime;
    const geometry = pointsRef.current.geometry;
    const positionAttribute = geometry.getAttribute('position');
    const currentPositions = positionAttribute.array;
    const { initialPositions, targetPositions } = dataRef.current;

    // 计算汇聚进度（0-1）
    let progress: number;
    if (time < 3) {
      progress = (time / 3) * 0.85;
    } else if (time < 5) {
      progress = 0.85 + ((time - 3) / 2) * 0.15;
    } else {
      progress = 1;
    }

    // 缓动函数（ease out quart）
    const easedProgress = 1 - Math.pow(1 - Math.min(progress, 1), 4);

    // 更新每个点的位置
    for (let i = 0; i < currentPositions.length; i++) {
      const initial = initialPositions[i];
      const target = targetPositions[i];
      currentPositions[i] = initial + (target - initial) * easedProgress;
    }
    positionAttribute.needsUpdate = true;

    // 闪烁动画（汇聚完成后开始）
    if (progress >= 1 && sizesRef.current) {
      const sizeArray = geometry.attributes.size.array as Float32Array;
      for (let i = 0; i < sizeArray.length; i++) {
        const flicker = 0.7 + 0.3 * Math.sin(time * 5 + i * 0.15);
        sizeArray[i] = sizesRef.current[i] * flicker;
      }
      (sizeArray as unknown as { needsUpdate: boolean }).needsUpdate = true;
    }
  });

  return (
    <points ref={pointsRef} renderOrder={10}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
        <bufferAttribute
          attach="attributes-color"
          args={[colors, 3]}
        />
        <bufferAttribute
          attach="attributes-size"
          args={[sizes, 1]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.04}
        map={circleTexture}
        vertexColors
        transparent
        depthWrite={true}
        depthTest={true}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
};

export default EmissionParticles;

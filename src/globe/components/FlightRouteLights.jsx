import { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { getArcPoints } from '../utils/geometry';

/**
 * 航线动态光点组件
 * 使用 seeded random 确保随机值在重新渲染时保持一致
 */
const FlightRouteLights = ({ routes, lightsRef }) => {
  const routeDataRef = useRef(null);
  const materialRef = useRef();

  // 创建圆形纹理 - 使用 useMemo 避免重复创建
  const circleTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 32;
    canvas.height = 32;
    const ctx = canvas.getContext('2d');

    const gradient = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
    gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
    gradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.8)');
    gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 32, 32);

    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    return texture;
  }, []);

  // 使用 seeded random 确保随机值只在初始化时计算一次
  const routeData = useMemo(() => {
    function createSeededRandom(seed) {
      let s = seed;
      return () => {
        s = (s * 9301 + 49297) % 233280;
        return s / 233280;
      };
    }
    const random = createSeededRandom(12345);

    const selectedRoutes = routes.filter(() => random() < 0.3);

    const data = selectedRoutes.map((route) => {
      const isInternational =
        route.from.lng < 73 || route.from.lng > 135 ||
        route.to.lng < 73 || route.to.lng > 135;

      const points = getArcPoints(route.from, route.to, 50, isInternational);
      return {
        points,
        speed: (0.2 + random() * 0.3) * 0.2,
        delay: random() * 2
      };
    });

    return data;
  }, [routes]);

  useEffect(() => {
    routeDataRef.current = routeData;
  }, [routeData]);

  useFrame((state) => {
    if (!lightsRef.current || !routeDataRef.current) return;

    const time = state.clock.elapsedTime;

    // 光点渐显（4 秒后开始，持续 2 秒）
    let opacity;
    if (time < 4) {
      opacity = 0;
    } else if (time < 6) {
      opacity = (time - 4) / 2 * 0.9;
    } else {
      opacity = 0.9;
    }

    if (materialRef.current) {
      materialRef.current.opacity = opacity;
    }

    const positions = [];

    routeDataRef.current.forEach((route) => {
      const progress = (time * route.speed + route.delay) % 1;
      const totalPoints = route.points.length - 1;
      const progressIndex = progress * totalPoints;
      const pointIndex = Math.floor(progressIndex);
      const pointIndexNext = Math.min(pointIndex + 1, totalPoints);
      const segmentProgress = progressIndex - pointIndex;

      const point1 = route.points[pointIndex];
      const point2 = route.points[pointIndexNext];

      const x = point1.x + (point2.x - point1.x) * segmentProgress;
      const y = point1.y + (point2.y - point1.y) * segmentProgress;
      const z = point1.z + (point2.z - point1.z) * segmentProgress;

      positions.push(x, y, z);
    });

    if (positions.length > 0) {
      const geometry = lightsRef.current.geometry;
      const positionAttribute = geometry.getAttribute('position');
      positionAttribute.array.set(positions);
      positionAttribute.needsUpdate = true;
      lightsRef.current.geometry = geometry;
    }
  });

  if (routeData.length === 0) return null;

  const initialPositions = useMemo(() => {
    return new Float32Array(routeData.length * 3);
  }, [routeData.length]);

  return (
    <points ref={lightsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={routeData.length}
          array={initialPositions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        ref={materialRef}
        size={0.034}
        map={circleTexture}
        color={0xffffff}
        transparent
        opacity={0}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        sizeAttenuation
      />
    </points>
  );
};

export default FlightRouteLights;

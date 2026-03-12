import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { getArcPoints } from '../utils/geometry';
import FlightRouteLights from './FlightRouteLights';

/**
 * 航线组件 - 使用 Line 高性能渲染
 */
const FlightRoutes = ({ routes, earthRadius = 2 }) => {
  const linesRef = useRef();
  const materialRef = useRef();
  const lightsRef = useRef();

  // 生成航线路径 - 使用 useMemo 避免重复计算
  const { positions } = useMemo(() => {
    const posArray = [];
    // 航线在地球表面上方一点
    const arcEarthRadius = earthRadius + 0.02;

    routes.forEach((route) => {
      const points = getArcPoints(route.from, route.to, 50, route.international || false, arcEarthRadius);

      for (let i = 0; i < points.length - 1; i++) {
        posArray.push(points[i].x, points[i].y, points[i].z);
        posArray.push(points[i + 1].x, points[i + 1].y, points[i + 1].z);
      }
    });

    return {
      positions: new Float32Array(posArray)
    };
  }, [routes]);

  // 航线渐显动画
  useFrame(({ clock }) => {
    const time = clock.elapsedTime;
    let opacity;
    if (time < 3) {
      opacity = 0;
    } else if (time < 5) {
      opacity = (time - 3) / 2 * 0.15;
    } else {
      opacity = 0.15;
    }

    if (materialRef.current) {
      materialRef.current.opacity = opacity;
    }
  });

  return (
    <group>
      <line ref={linesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={positions.length / 3}
            array={positions}
            itemSize={3}
          />
        </bufferGeometry>
        <lineBasicMaterial
          ref={materialRef}
          color={0x00aaff}
          transparent
          opacity={0}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          linewidth={1}
        />
      </line>
      {/* 30% 航线的动态光点 */}
      <FlightRouteLights routes={routes} lightsRef={lightsRef} earthRadius={earthRadius} />
    </group>
  );
};

export default FlightRoutes;

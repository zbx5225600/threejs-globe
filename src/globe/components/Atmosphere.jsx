import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { atmosphereVertexShader, atmosphereFragmentShader } from '../shaders/atmosphereShader';

/**
 * 大气层组件 - 带渐显动画
 * 使用 memo 优化，避免不必要的重新渲染
 */
const Atmosphere = ({ atmosphereRef, atmosphereMaterialRef, earthRadius = 2 }) => {
  const meshRef = useRef();

  useFrame(({ clock }) => {
    const time = clock.elapsedTime;

    // 大气层渐显动画（2 秒后开始，持续 3 秒）
    let opacity;
    if (time < 2) {
      opacity = 0;
    } else if (time < 5) {
      opacity = (time - 2) / 3 * 0.8;
    } else {
      opacity = 0.8;
    }

    if (atmosphereRef?.current) {
      atmosphereRef.current.uniforms.time.value = time;
    }
    if (atmosphereMaterialRef?.current) {
      atmosphereMaterialRef.current.opacity = opacity;
    }
  });

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[earthRadius + 0.05, 64, 64]} />
      <shaderMaterial
        ref={atmosphereMaterialRef}
        vertexShader={atmosphereVertexShader}
        fragmentShader={atmosphereFragmentShader}
        uniforms={{ time: { value: 0 } }}
        blending={THREE.AdditiveBlending}
        side={THREE.BackSide}
        transparent
        opacity={0}
        depthWrite={false}
      />
    </mesh>
  );
};

export default Atmosphere;

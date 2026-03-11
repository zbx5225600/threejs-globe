import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { earthGlowVertexShader, earthGlowFragmentShader } from '../shaders/earthGlowShader';

/**
 * 地球光晕组件 - 带渐显动画
 */
const EarthGlow = ({ earthOpacityRef }) => {
  const materialRef = useRef();

  useFrame(() => {
    if (materialRef.current && earthOpacityRef?.current) {
      materialRef.current.opacity = earthOpacityRef.current * 0.6;
    }
  });

  return (
    <mesh>
      <sphereGeometry args={[2.02, 64, 64]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={earthGlowVertexShader}
        fragmentShader={earthGlowFragmentShader}
        blending={THREE.AdditiveBlending}
        side={THREE.BackSide}
        transparent
        opacity={0}
        depthWrite={false}
      />
    </mesh>
  );
};

export default EarthGlow;

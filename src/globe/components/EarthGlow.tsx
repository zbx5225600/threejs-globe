import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { earthGlowVertexShader, earthGlowFragmentShader } from '../shaders/earthGlowShader';

/**
 * 地球光晕组件 Props
 */
interface EarthGlowProps {
  earthOpacityRef?: React.MutableRefObject<number>;
  earthRadius?: number;
}

/**
 * 地球光晕组件 - 带渐显动画
 * 2 秒后开始显示，与地球同步
 */
const EarthGlow = ({ earthOpacityRef, earthRadius = 2 }: EarthGlowProps) => {
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  useFrame(({ clock }) => {
    const time = clock.elapsedTime;

    // 地球光晕渐显动画（2 秒后开始，持续 3 秒）
    let opacity: number;
    if (time < 2) {
      opacity = 0;
    } else if (time < 5) {
      opacity = ((time - 2) / 3) * 0.6;
    } else {
      opacity = 0.6;
    }

    if (materialRef.current) {
      materialRef.current.uniforms.opacity.value = opacity;
    }

    // 更新地球不透明度引用
    if (earthOpacityRef) {
      earthOpacityRef.current = opacity / 0.6;
    }
  });

  return (
    <mesh>
      <sphereGeometry args={[earthRadius + 0.02, 64, 64]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={earthGlowVertexShader}
        fragmentShader={earthGlowFragmentShader}
        uniforms={{ opacity: { value: 0 } }}
        blending={THREE.AdditiveBlending}
        side={THREE.BackSide}
        transparent
        opacity={1}
        depthWrite={false}
      />
    </mesh>
  );
};

export default EarthGlow;

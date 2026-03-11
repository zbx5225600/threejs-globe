import { useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import * as THREE from 'three';
import RealEarth from './RealEarth';

/**
 * 场景设置组件
 * 负责相机、灯光、星空和轨道控制
 */
const Scene = ({ continents, globeData }) => {
  const { camera, gl } = useThree();
  const controlsRef = useRef();

  useEffect(() => {
    // 相机向下倾斜，让中国位于屏幕中央
    camera.position.set(0, 1, 6.5);
    camera.lookAt(0, -0.5, 0);
    gl.setClearColor(new THREE.Color('#000000'));
  }, [camera, gl]);

  // 2 秒后启用自动旋转
  useFrame(({ clock }) => {
    const time = clock.elapsedTime;
    if (controlsRef.current) {
      controlsRef.current.autoRotate = time >= 2;
    }
  });

  return (
    <>
      {/* 环境光 */}
      <ambientLight intensity={0.1} />

      {/* 太阳光 - 主光源 */}
      <directionalLight position={[10, 5, 10]} intensity={1.0} color="#ffffff" />

      {/* 星空 */}
      <Stars
        radius={200}
        depth={60}
        count={5000}
        factor={5}
        saturation={0.3}
        fade
        speed={0.3}
      />

      {/* 地球 */}
      <RealEarth continents={continents} globeData={globeData} />

      {/* 轨道控制 */}
      <OrbitControls
        ref={controlsRef}
        enableZoom
        enablePan={false}
        minDistance={3.2}
        maxDistance={10}
        autoRotate={false}
        autoRotateSpeed={0.5}
        rotateSpeed={0.4}
        zoomSpeed={0.7}
        enableDamping
        dampingFactor={0.03}
        minPolarAngle={Math.PI / 6}
        maxPolarAngle={Math.PI - Math.PI / 6}
      />
    </>
  );
};

export default Scene;

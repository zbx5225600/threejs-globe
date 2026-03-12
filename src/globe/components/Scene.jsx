import { useRef, useEffect, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import * as THREE from 'three';
import RealEarth from './RealEarth';

/**
 * 场景设置组件
 * 负责相机、灯光、星空和轨道控制
 */
const Scene = ({ continents, globeData }) => {
  const { camera, gl, size } = useThree();
  const controlsRef = useRef();

  // 根据屏幕尺寸计算适配参数
  const isMobile = useMemo(() => size.width < 768, [size.width]);
  const isSmallMobile = useMemo(() => size.width < 480, [size.width]);

  // 地球半径和相机距离根据屏幕大小调整
  // 为了在手机上看到完整的地球，需要增加相机距离与地球半径的比例
  const earthRadius = isSmallMobile ? 1.2 : (isMobile ? 1.5 : 2);
  const cameraDistance = isMobile ? (isSmallMobile ? 5.5 : 6.5) : 6.5;
  const cameraY = isMobile ? (isSmallMobile ? 0.8 : 1) : 1;

  useEffect(() => {
    // 相机向下倾斜，让中国位于屏幕中央
    // 小屏手机需要调整相机位置，让地球完整显示
    camera.position.set(0, cameraY, cameraDistance);
    // 手机端看点更靠近中心，让地球完整显示
    camera.lookAt(0, isMobile ? -0.2 : -0.5, 0);
    gl.setClearColor(new THREE.Color('#000000'));

    // 设置像素比，移动端限制最大像素比以提升性能
    gl.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  }, [camera, gl, size, cameraDistance, cameraY, isMobile]);

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
      <RealEarth continents={continents} globeData={globeData} isMobile={isMobile} earthRadius={earthRadius} />

      {/* 轨道控制 */}
      <OrbitControls
        ref={controlsRef}
        enableZoom
        enablePan={false}
        // 移动端调整缩放距离，确保能看到完整地球
        minDistance={isMobile ? 3.5 : 3.2}
        maxDistance={isMobile ? 12 : 10}
        autoRotate={false}
        autoRotateSpeed={0.5}
        // 移动端提高旋转灵敏度
        rotateSpeed={isMobile ? 0.6 : 0.4}
        zoomSpeed={isMobile ? 0.5 : 0.7}
        enableDamping
        dampingFactor={0.03}
        minPolarAngle={Math.PI / 6}
        maxPolarAngle={Math.PI - Math.PI / 6}
      />
    </>
  );
};

export default Scene;

import { useRef, useMemo } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import { Sphere } from '@react-three/drei';
import * as THREE from 'three';
import baseData from '../data/base-data.json';
import earthImg from '../assets/earth_boundary.jpg';
import basemapImg from '../assets/basemap1.jpg';
import videoSrc from '../assets/new-combine-20190901-20230901.mp4';
import Atmosphere from './Atmosphere';
import EarthGlow from './EarthGlow';
import ContinentLabels from './ContinentLabels';
import EmissionParticles from './EmissionParticles';
import FlightRoutes from './FlightRoutes';

/**
 * 真实地球组件 - 带渐显动画
 * 整合所有地球相关子组件
 */
const RealEarth = ({ continents, globeData }) => {
  const earthRef = useRef();
  const atmosphereRef = useRef();
  const atmosphereMaterialRef = useRef();
  const basemapMaterialRef = useRef();
  const earthMaterialRef = useRef();
  const videoMaterialRef = useRef();
  const earthOpacityRef = useRef(0);
  const [basemapTexture, earthTexture] = useLoader(THREE.TextureLoader, [basemapImg, earthImg]);

  // 从 base-data.json 加载航线数据 - 使用 useMemo 避免重复加载
  const routes = useMemo(() => baseData.routes || [], []);

  // 视频纹理初始化 - 使用 useMemo 避免重复创建
  const videoTexture = useMemo(() => {
    const video = document.createElement('video');
    video.src = videoSrc;
    video.crossOrigin = 'anonymous';
    video.loop = true;
    video.muted = true;
    video.playsInline = true;
    video.play();

    const texture = new THREE.VideoTexture(video);
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;
    return texture;
  }, []);

  useFrame(({ clock }) => {
    const time = clock.elapsedTime;

    // 地球渐显动画（2 秒后开始，持续 3 秒）
    let earthOpacity;
    if (time < 2) {
      earthOpacity = 0;
    } else if (time < 5) {
      earthOpacity = (time - 2) / 3;
    } else {
      earthOpacity = 1;
    }
    earthOpacityRef.current = earthOpacity;

    // 直接更新 material 的 opacity
    if (basemapMaterialRef.current) {
      basemapMaterialRef.current.opacity = earthOpacity;
    }
    if (earthMaterialRef.current) {
      earthMaterialRef.current.opacity = 0.5 * earthOpacity;
    }
    if (videoMaterialRef.current) {
      videoMaterialRef.current.opacity = 0.25 * earthOpacity;
    }
    if (atmosphereMaterialRef.current) {
      atmosphereMaterialRef.current.opacity = earthOpacity * 0.8;
    }

    if (atmosphereRef.current) {
      atmosphereRef.current.uniforms.time.value = time;
    }
    if (earthRef.current) {
      // 初始旋转让中国面对摄像头
      const initialRotationY = 165 * (Math.PI / 180);
      const tiltX = 30 * (Math.PI / 180);
      earthRef.current.rotation.x = tiltX;
      earthRef.current.rotation.y = initialRotationY;
    }
  });

  return (
    <group>
      {/* 地球旋转组 */}
      <group ref={earthRef}>
        {/* 第 1 层：basemap1.jpg 夜景灯光底图 */}
        <Sphere args={[2, 64, 64]}>
          <meshBasicMaterial
            ref={basemapMaterialRef}
            map={basemapTexture}
            transparent
            opacity={0}
          />
        </Sphere>

        {/* 第 2 层：earth_boundary.jpg 边界线 */}
        <Sphere args={[2.001, 64, 64]}>
          <meshBasicMaterial
            ref={earthMaterialRef}
            map={earthTexture}
            transparent
            opacity={0}
            blending={THREE.NormalBlending}
            depthWrite={false}
          />
        </Sphere>

        {/* 第 3 层：video 视频 */}
        <Sphere args={[2.002, 64, 64]}>
          <meshBasicMaterial
            ref={videoMaterialRef}
            map={videoTexture}
            transparent
            opacity={0}
            blending={THREE.NormalBlending}
            depthWrite={false}
          />
        </Sphere>

        {/* 第 4 层：粒子点 CO2 排放数据 */}
        <EmissionParticles globeData={globeData} />

        {/* 第 5 层：航线 */}
        <FlightRoutes routes={routes} />
      </group>

      {/* 地球光晕 */}
      <EarthGlow earthOpacityRef={earthOpacityRef} />

      {/* 大气层 */}
      <Atmosphere atmosphereRef={atmosphereRef} atmosphereMaterialRef={atmosphereMaterialRef} />

      {/* 大洲标签 */}
      <ContinentLabels continents={continents} earthRotationRef={earthRef} />
    </group>
  );
};

export default RealEarth;

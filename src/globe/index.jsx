import { useMemo, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import * as THREE from 'three';
import Scene from './components/Scene';
import simulatedData from './data/simulated-data.json';
import './styles/index.css';

/**
 * CO2 排放监测地球主组件
 * 整合所有地球可视化相关组件
 */
export default function CO2Globe() {
  // 从 simulated-data.json 加载模拟数据 - 使用 useMemo 避免重复加载
  const continents = useMemo(() => simulatedData.continents || [], []);
  const globeData = useMemo(() => simulatedData.globe || [], []);

  return (
    <div
      style={{
        width: '100vw',
        height: '100vh',
        background: '#000000',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* 3D 场景 */}
      <Canvas
        camera={{ position: [0, 0, 6.5], fov: 45 }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.2
        }}
        dpr={[1, 2]}
      >
        <Suspense fallback={null}>
          <Scene continents={continents} globeData={globeData} />
        </Suspense>
      </Canvas>

      {/* 顶部标题 */}
      <header className="globe-header">
        <h1>全球 CO₂ 排放监测</h1>
        <p>Global Carbon Emission Monitoring System</p>
      </header>

      {/* 图例 */}
      <aside className="legend-container">
        <div className="legend-title">UNIT: kgC/d</div>
        <div className="legend-content">
          <div className="legend-gradient" />
          <div className="legend-scale">
            <span>3.20E+06</span>
            <span>2.00E+05</span>
            <span>1.00E+04</span>
            <span>2.70E+03</span>
            <span>4.00E+02</span>
            <span>6.00E+01</span>
            <span>1.00E+01</span>
            <span>0.00E+00</span>
          </div>
        </div>
      </aside>

      {/* 操作提示 */}
      <footer className="globe-footer">
        <p>拖拽旋转 | 滚轮缩放</p>
        <p className="globe-source">数据来源：全球网格化日 CO₂ 排放数据集</p>
      </footer>
    </div>
  );
}

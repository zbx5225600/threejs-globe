# Globe 模块 - CO2 排放监测地球可视化

## 目录结构

```
src/globe/
├── index.jsx              # 主入口组件
├── components/            # 3D 组件
│   ├── index.js          # 组件导出
│   ├── Scene.jsx         # 场景设置（相机、灯光、星空、轨道控制）
│   ├── RealEarth.jsx     # 地球主体（整合所有地球子组件）
│   ├── Atmosphere.jsx    # 大气层组件
│   ├── EarthGlow.jsx     # 地球光晕组件
│   ├── ContinentLabels.jsx # 大洲标签组件
│   ├── FlightRoutes.jsx  # 航线组件
│   ├── FlightRouteLights.jsx # 航线动态光点
│   └── EmissionParticles.jsx # CO2 排放粒子
├── shaders/              # 着色器
│   ├── atmosphereShader.js  # 大气层着色器
│   └── earthGlowShader.js   # 地球光晕着色器
├── utils/                # 工具函数
│   ├── index.js         # 工具函数导出
│   ├── coordinate.js    # 坐标转换（经纬度 -> 3D 坐标）
│   ├── color.js         # 颜色映射（排放值 -> 颜色）
│   └── geometry.js      # 几何计算（弧线路径）
├── data/                 # 数据文件
│   ├── simulated-data.json # 模拟数据
│   └── base-data.json   # 航线数据
├── assets/               # 资源文件
│   ├── basemap1.jpg     # 夜景灯光底图
│   ├── earth_boundary.jpg # 地球边界线
│   └── new-combine-20190901-20230901.mp4 # 视频纹理
└── styles/               # 样式
    ├── index.css        # 全局样式（标题、底部信息）
    └── legend.css       # 图例样式
```

## 组件说明

### 主组件
- **CO2Globe** (`index.jsx`): 应用入口，整合所有组件

### 场景组件
- **Scene**: 负责相机、灯光、星空和轨道控制
- **RealEarth**: 地球主体，整合大气层、光晕、标签等子组件

### 3D 组件
- **Atmosphere**: 大气层，使用自定义着色器实现渐显动画
- **EarthGlow**: 地球边缘光晕效果
- **ContinentLabels**: 大洲英文名称标签
- **FlightRoutes**: 航线网络（蓝色线条）
- **FlightRouteLights**: 航线上的动态光点
- **EmissionParticles**: CO2 排放数据粒子点

### 工具函数
- **latLngToVector3**: 经纬度转 3D 坐标
- **getEmissionColor**: 根据排放值获取颜色（色阶映射）
- **getArcPoints**: 计算两点间弧线路径（贝塞尔曲线）

## 性能优化

1. **useMemo 缓存**: 所有计算密集型数据（纹理、路径、颜色）都使用 useMemo 缓存
2. ** seeded Random**: 使用伪随机函数确保重新渲染时随机值一致
3. **组件分离**: 每个 3D 组件独立管理自己的状态和动画
4. **BufferGeometry**: 使用 BufferAttribute 高效渲染大量点和线
5. **Canvas DPR**: 设置 `dpr={[1, 2]}` 限制最大像素比，提升性能

## 使用方式

```jsx
import CO2Globe from './globe';

function App() {
  return <CO2Globe />;
}
```

## 动画时间线

| 时间 | 事件 |
|------|------|
| 0-2s | 地球静止，所有元素隐藏 |
| 2-3s | 地球开始渐显 |
| 2-5s | 大气层渐显 |
| 2s+  | 地球开始自动旋转 |
| 3-5s | 航线渐显 |
| 4-6s | 航线光点渐显 |
| 5s+  | 所有特效完成，正常显示 |

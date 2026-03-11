# 全球 CO₂ 排放可视化 - Three.js 版本

3D 地球 CO₂排放可视化项目。

## 功能特点

- 🌍 **3D 地球模型**: 使用 Three.js 和 React Three Fiber 创建交互式 3D 地球
- 📊 **实时数据可视化**: 显示全球 CO₂ 排放热点
- 🎯 **多部门分析**: 区分电力、工业、交通、居民等不同排放部门
- 🎮 **交互控制**: 鼠标控制视角，悬停查看详细信息
- 📈 **数据统计**: 实时显示全球排放统计信息
- 🎨 **颜色编码**: 根据排放量大小使用不同颜色标识
- ✨ **开场动画**: 粒子汇聚、大气层渐显、航线光点等特效

## 技术栈

- **React 19.2.0** - 前端框架
- **Three.js** - 3D 图形库
- **React Three Fiber** - React 渲染器
- **React Three Drei** - 辅助组件库
- **Vite** - 构建工具

## 数据来源

全球网格化日 CO₂ 排放数据集：
- 空间分辨率：0.1° × 0.1°
- 时间分辨率：1 天
- 数据单位：kgC/h per cell
- 覆盖部门：电力、工业、居民、交通、航空、航运

## 快速开始

1. 安装依赖:
```bash
npm install
```

2. 启动开发服务器:
```bash
npm run dev
```

3. 打开浏览器访问：http://localhost:5173

## 项目结构

```
react-demo/
├── src/
│   ├── globe/                    # 地球可视化模块
│   │   ├── index.jsx             # 主入口组件 (CO2Globe)
│   │   ├── components/           # 3D 组件
│   │   │   ├── Scene.jsx         # 场景设置 (相机、灯光、星空、轨道控制)
│   │   │   ├── RealEarth.jsx     # 地球主体 (整合所有子组件)
│   │   │   ├── Atmosphere.jsx    # 大气层组件
│   │   │   ├── EarthGlow.jsx     # 地球光晕组件
│   │   │   ├── ContinentLabels.jsx # 大洲标签组件
│   │   │   ├── FlightRoutes.jsx  # 航线组件
│   │   │   ├── FlightRouteLights.jsx # 航线动态光点
│   │   │   └── EmissionParticles.jsx # CO2 排放粒子
│   │   ├── shaders/              # 着色器
│   │   │   ├── atmosphereShader.js  # 大气层着色器
│   │   │   └── earthGlowShader.js   # 地球光晕着色器
│   │   ├── utils/                # 工具函数
│   │   │   ├── coordinate.js     # 坐标转换 (经纬度 -> 3D 坐标)
│   │   │   ├── color.js          # 颜色映射 (排放值 -> 颜色)
│   │   │   └── geometry.js       # 几何计算 (弧线路径)
│   │   ├── data/                 # 数据文件
│   │   │   ├── base-data.json    # 航线数据
│   │   │   └── simulated-data.json # 模拟排放数据
│   │   ├── assets/               # 资源文件
│   │   │   ├── basemap1.jpg      # 夜景灯光底图
│   │   │   ├── earth_boundary.jpg # 地球边界线
│   │   │   └── new-combine-*.mp4 # 视频纹理
│   │   └── styles/               # 样式
│   │       ├── index.css         # 全局样式
│   │       └── legend.css        # 图例样式
│   ├── data/                     # 共享数据
│   │   ├── base-data.json
│   │   └── simulated-data.json
│   ├── assets/                   # 共享资源
│   │   ├── basemap1.jpg
│   │   ├── earth_boundary.jpg
│   │   └── new-combine-*.mp4
│   ├── App.jsx                   # 应用入口
│   ├── main.jsx                  # React 入口
│   └── index.css                 # 全局样式
├── tests/                        # 测试文件
│   └── playwright.config.js      # Playwright 配置
├── package.json                  # 项目配置
└── vite.config.js                # Vite 配置
```

## 主要功能

### 1. 3D 地球可视化
- 真实地球纹理和地形
- 多层叠加效果（底图、边界线、视频）
- 大气层和边缘光晕
- 平滑的鼠标交互控制

### 2. CO₂ 排放数据展示
- 全球网格化排放数据点
- 颜色编码表示排放强度
- 粒子汇聚开场动画
- 悬停显示详细信息

### 3. 航线网络
- 蓝色弧线连接主要城市
- 动态光点沿航线移动
- 国际/国内航线不同弧度

### 4. 交互功能
- 鼠标拖拽旋转地球
- 滚轮缩放
- 2 秒后自动旋转

### 5. 数据图例
- 排放等级颜色条
- 数值刻度标识
- 单位说明 (kgC/d)

## 排放等级颜色

| 颜色 | 排放值范围 |
|------|-----------|
| 🔴 红色 | > 75 (高排放) |
| 🟠 橙色 | 65-75 |
| 🟡 黄色 | 55-65 |
| 🟢 绿色 | 45-55 |
| 🔵 蓝色 | < 45 (低排放) |

## 动画时间线

| 时间 | 事件 |
|------|------|
| 0-2s | 地球静止，所有元素隐藏 |
| 2-3s | 地球开始渐显 |
| 2-5s | 大气层渐显 |
| 2s+ | 地球开始自动旋转 |
| 3-5s | 航线渐显 |
| 4-6s | 航线光点渐显 |
| 5s+ | 所有特效完成，正常显示 |



## 许可证

MIT License

## 贡献

欢迎提交 Issue 和 Pull Request 来改进这个项目。

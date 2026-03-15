import * as THREE from 'three';
import { latLngToVector3 } from './coordinate';

/**
 * 起点/终点坐标接口
 */
export interface GeoPoint {
  lat: number;
  lng: number;
}

/**
 * 计算两点之间的弧线路径
 * @param start - 起点 {lat, lng}
 * @param end - 终点 {lat, lng}
 * @param segments - 分段数，默认根据距离动态计算
 * @param isInternational - 是否为国际航线，默认 false
 * @param earthRadius - 地球半径，默认 2.02
 * @returns 路径点数组
 */
export const getArcPoints = (
  start: GeoPoint,
  end: GeoPoint,
  segments?: number,
  isInternational: boolean = false,
  earthRadius: number = 2.02
): THREE.Vector3[] => {
  const points: THREE.Vector3[] = [];
  const startVec = latLngToVector3(start.lat, start.lng, earthRadius);
  const endVec = latLngToVector3(end.lat, end.lng, earthRadius);

  // 计算起点和终点之间的角度距离
  const angle = startVec.angleTo(endVec);

  // 根据角度距离动态计算分段数
  // 短航线 (< 30°) : 50 段，中等航线 (30°-90°): 100 段，长航线 (> 90°): 200 段
  if (segments === undefined) {
    if (angle < Math.PI / 6) { // < 30°
      segments = 50;
    } else if (angle < Math.PI / 2) { // < 90°
      segments = 100;
    } else { // >= 90° 长航线
      segments = 200;
    }
  }

  // 计算弧线最大高度（中点处）- 基于角度距离
  // 国际航线弧度更高，确保不穿过地球内部
  const maxArcHeight = isInternational
    ? 0.01 + angle * 0.075  // 国际航线：基础高度 0.01，跨太平洋航线约 0.07-0.1
    : 0.005 + angle * 0.04;  // 国内航线：基础高度 0.005

  // 起点/终点的基础高度（确保航线始终在地球表面上方）
  const baseHeight = 0.008;

  for (let i = 0; i <= segments; i++) {
    const t = i / segments;

    // 使用球面线性插值 (SLERP) 确保路径沿球面大圆
    const surfacePoint = startVec.clone().lerp(endVec, t).normalize().multiplyScalar(earthRadius);

    // 计算当前点的径向偏移因子（正弦曲线，中点最大）
    const radialFactor = Math.sin(t * Math.PI);

    // 计算当前点的弧线高度（基础高度 + 弧线高度）
    const currentHeight = baseHeight + maxArcHeight * radialFactor;

    // 从表面点沿径向向外偏移
    const point = surfacePoint.clone().normalize().multiplyScalar(earthRadius + currentHeight);

    points.push(point);
  }

  return points;
};

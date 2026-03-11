import { latLngToVector3 } from './coordinate';

/**
 * 计算两点之间的弧线路径
 * @param {Object} start - 起点 {lat, lng}
 * @param {Object} end - 终点 {lat, lng}
 * @param {number} segments - 分段数，默认 50
 * @param {boolean} isInternational - 是否为国际航线，默认 false
 * @returns {THREE.Vector3[]} 路径点数组
 */
export const getArcPoints = (start, end, segments = 50, isInternational = false) => {
  const points = [];
  const earthRadius = 2.02;
  const startVec = latLngToVector3(start.lat, start.lng, earthRadius);
  const endVec = latLngToVector3(end.lat, end.lng, earthRadius);

  // 计算中点高度（弧线顶点）
  const distance = startVec.distanceTo(endVec);
  // 国际航线弧度更高，国内航线较低
  const arcHeight = isInternational
    ? 0.08 + distance * 0.05  // 国际航线：基础高度 0.08，长途可达 0.15-0.2
    : 0.0165 + distance * 0.022;  // 国内航线：基础高度 0.0165
  const midVec = startVec.clone().add(endVec).normalize().multiplyScalar(earthRadius + arcHeight);

  for (let i = 0; i <= segments; i++) {
    const t = i / segments;
    // 使用二次贝塞尔曲线
    const weight = isInternational ? 0.6 : 0.55;
    const point = new THREE.Vector3()
      .copy(startVec)
      .lerp(endVec, t)
      .add(midVec.clone().multiplyScalar(weight * t * (1 - t)));
    points.push(point);
  }

  return points;
};

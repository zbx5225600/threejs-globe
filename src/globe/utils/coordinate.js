import * as THREE from 'three';

/**
 * 将经纬度转换为 3D 坐标
 * @param {number} lat - 纬度
 * @param {number} lng - 经度
 * @param {number} radius - 半径，默认为 2
 * @returns {THREE.Vector3} 3D 坐标
 */
export const latLngToVector3 = (lat, lng, radius = 2) => {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  return new THREE.Vector3(
    -radius * Math.sin(phi) * Math.cos(theta),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta)
  );
};

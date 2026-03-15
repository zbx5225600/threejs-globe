import * as THREE from 'three';

/**
 * 根据排放值获取颜色（使用线性插值）
 * @param value - 排放值 (0-82)
 * @returns 颜色值
 */
export const getEmissionColor = (value: number): THREE.Color => {
  // 颜色映射：深蓝 -> 蓝 -> 青 -> 绿 -> 黄 -> 橙红
  const colorStops = [
    { value: 0, color: new THREE.Color(0x000022) },
    { value: 20, color: new THREE.Color(0x003366) },
    { value: 35, color: new THREE.Color(0x006699) },
    { value: 45, color: new THREE.Color(0x009999) },
    { value: 50, color: new THREE.Color(0x33cc33) },
    { value: 55, color: new THREE.Color(0x99cc00) },
    { value: 60, color: new THREE.Color(0xcccc00) },
    { value: 65, color: new THREE.Color(0xffcc00) },
    { value: 70, color: new THREE.Color(0xff9900) },
    { value: 75, color: new THREE.Color(0xff6600) },
    { value: 82, color: new THREE.Color(0xff3300) }
  ];

  for (let i = 1; i < colorStops.length; i++) {
    if (value <= colorStops[i].value) {
      const prev = colorStops[i - 1];
      const curr = colorStops[i];
      const t = (value - prev.value) / (curr.value - prev.value);
      return prev.color.clone().lerp(curr.color, t);
    }
  }
  return colorStops[colorStops.length - 1].color;
};

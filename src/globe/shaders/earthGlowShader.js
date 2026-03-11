// 地球边缘光晕着色器
export const earthGlowVertexShader = `
  varying vec3 vNormal;
  void main() {
    vNormal = normalize(normalMatrix * normal);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

export const earthGlowFragmentShader = `
  varying vec3 vNormal;
  void main() {
    float intensity = pow(0.65 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 4.0);
    vec3 glowColor = vec3(0.15, 0.4, 0.8);
    gl_FragColor = vec4(glowColor, intensity * 0.6);
  }
`;

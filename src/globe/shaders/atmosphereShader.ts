// 大气层着色器
export const atmosphereVertexShader = `
  varying vec3 vNormal;
  varying vec3 vPosition;
  void main() {
    vNormal = normalize(normalMatrix * normal);
    vPosition = position;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

export const atmosphereFragmentShader = `
  varying vec3 vNormal;
  varying vec3 vPosition;
  uniform float time;
  uniform float opacity;

  void main() {
    float viewAngle = dot(vNormal, vec3(0.0, 0.0, 1.0));
    float intensity = pow(0.7 - abs(viewAngle), 3.0);
    vec3 color1 = vec3(0.18, 0.45, 0.85);
    vec3 color2 = vec3(0.35, 0.65, 0.95);
    vec3 color3 = vec3(0.6, 0.85, 1.0);
    vec3 finalColor = mix(color1, color2, intensity * 2.0);
    finalColor = mix(finalColor, color3, intensity * intensity * 3.0);
    float pulse = sin(time * 0.5) * 0.95 + 0.05;
    finalColor *= pulse;
    gl_FragColor = vec4(finalColor, intensity * 0.8 * opacity);
  }
`;

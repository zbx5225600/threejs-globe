import { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import { latLngToVector3 } from '../utils/coordinate';

/**
 * 大洲标签组件
 * 作为地球的子组件，跟随地球旋转，标签始终正对镜头
 */
const ContinentLabels = ({ continents, earthRadius = 2 }) => {
  const textRefs = useRef([]);
  const { camera } = useThree();

  useFrame(() => {
    // 让每个标签始终正对摄像机
    textRefs.current.forEach((textRef) => {
      if (textRef) {
        textRef.lookAt(camera.position);
      }
    });
  });

  return (
    <group>
      {continents.map((continent, index) => {
        const pos = latLngToVector3(continent.lat, continent.lng, earthRadius + 0.03);
        return (
          <Text
            key={`continent-${index}`}
            ref={(el) => (textRefs.current[index] = el)}
            position={pos}
            fontSize={0.04}
            color="rgba(255, 255, 255, 0.6)"
            anchorX="center"
            anchorY="middle"
            font="https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hjp-Ek-_EeA.woff"
          >
            {continent.en}
          </Text>
        );
      })}
    </group>
  );
};

export default ContinentLabels;

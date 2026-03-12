import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import { latLngToVector3 } from '../utils/coordinate';

/**
 * 大洲标签组件
 * 与地球同步旋转
 */
const ContinentLabels = ({ continents, earthRotationRef, earthRadius = 2 }) => {
  const groupRef = useRef();

  useFrame(() => {
    if (groupRef.current && earthRotationRef?.current) {
      groupRef.current.rotation.y = earthRotationRef.current.rotation.y;
    }
  });

  return (
    <group ref={groupRef}>
      {continents.map((continent, index) => {
        const pos = latLngToVector3(continent.lat, continent.lng, earthRadius + 0.03);
        return (
          <Text
            key={`continent-${index}`}
            position={pos}
            fontSize={0.04}
            color="rgba(255, 255, 255, 0.6)"
            anchorX="center"
            anchorY="middle"
            font="https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hjp-Ek-_EeA.woff"
            rotation={[0, Math.PI, 0]}
          >
            {continent.en}
          </Text>
        );
      })}
    </group>
  );
};

export default ContinentLabels;

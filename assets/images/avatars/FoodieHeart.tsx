import * as React from 'react';
import Svg, { Path, Ellipse } from 'react-native-svg';
export default function FoodieHeart(props) {
  return (
    <Svg width={64} height={64} viewBox="0 0 64 64" {...props}>
      <Path d="M32 48 Q16 32 32 20 Q48 32 32 48 Z" fill="#F47C7C" stroke="#bbb" strokeWidth={2} />
      <Ellipse cx="32" cy="32" rx="6" ry="3" fill="#fff" opacity={0.5} />
      <Ellipse cx="36" cy="28" rx="2" ry="1" fill="#fff" opacity={0.7} />
    </Svg>
  );
} 
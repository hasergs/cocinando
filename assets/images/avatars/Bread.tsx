import * as React from 'react';
import Svg, { Ellipse } from 'react-native-svg';
export default function Bread(props) {
  return (
    <Svg width={64} height={64} viewBox="0 0 64 64" {...props}>
      <Ellipse cx="32" cy="40" rx="20" ry="12" fill="#F9D7A0" stroke="#C2A76B" strokeWidth={2} />
      <Ellipse cx="32" cy="36" rx="16" ry="8" fill="#F4A259" stroke="#C2A76B" strokeWidth={2} />
      <Ellipse cx="24" cy="40" rx="2" ry="1" fill="#fff" />
      <Ellipse cx="32" cy="44" rx="2" ry="1" fill="#fff" />
      <Ellipse cx="40" cy="40" rx="2" ry="1" fill="#fff" />
    </Svg>
  );
} 
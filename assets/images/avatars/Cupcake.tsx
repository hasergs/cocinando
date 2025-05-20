import * as React from 'react';
import Svg, { Ellipse, Rect, Circle } from 'react-native-svg';
export default function Cupcake(props) {
  return (
    <Svg width={64} height={64} viewBox="0 0 64 64" {...props}>
      <Ellipse cx="32" cy="32" rx="16" ry="10" fill="#fff" stroke="#bbb" strokeWidth={2} />
      <Rect x="20" y="32" width="24" height="16" rx="6" fill="#F4A259" stroke="#bbb" strokeWidth={2} />
      <Ellipse cx="32" cy="28" rx="12" ry="6" fill="#F9D7A0" />
      <Circle cx="32" cy="24" r="3" fill="#F47C7C" />
    </Svg>
  );
} 
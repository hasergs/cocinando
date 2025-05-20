import * as React from 'react';
import Svg, { Ellipse, Rect } from 'react-native-svg';
export default function WoodenSpoon(props) {
  return (
    <Svg width={64} height={64} viewBox="0 0 64 64" {...props}>
      <Ellipse cx="32" cy="24" rx="10" ry="16" fill="#C2A76B" stroke="#8B6F3A" strokeWidth={2} />
      <Rect x="28" y="36" width="8" height="20" rx="4" fill="#C2A76B" stroke="#8B6F3A" strokeWidth={2} />
    </Svg>
  );
} 
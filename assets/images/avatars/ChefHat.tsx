import * as React from 'react';
import Svg, { Ellipse, Rect } from 'react-native-svg';
export default function ChefHat(props) {
  return (
    <Svg width={64} height={64} viewBox="0 0 64 64" {...props}>
      <Ellipse cx="32" cy="28" rx="24" ry="14" fill="#fff" stroke="#bbb" strokeWidth={2} />
      <Ellipse cx="32" cy="20" rx="16" ry="10" fill="#eee" stroke="#bbb" strokeWidth={2} />
      <Rect x="20" y="36" width="24" height="12" rx="6" fill="#fff" stroke="#bbb" strokeWidth={2} />
    </Svg>
  );
} 
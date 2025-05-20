import * as React from 'react';
import Svg, { Rect, Ellipse } from 'react-native-svg';
export default function Carrot(props) {
  return (
    <Svg width={64} height={64} viewBox="0 0 64 64" {...props}>
      <Rect x="28" y="24" width="8" height="24" rx="4" fill="#F4A259" stroke="#C2A76B" strokeWidth={2} />
      <Ellipse cx="32" cy="24" rx="8" ry="4" fill="#7ED957" />
      <Ellipse cx="28" cy="20" rx="2" ry="4" fill="#7ED957" />
      <Ellipse cx="36" cy="20" rx="2" ry="4" fill="#7ED957" />
    </Svg>
  );
} 
import * as React from 'react';
import Svg, { Rect, Path } from 'react-native-svg';
export default function Apron(props) {
  return (
    <Svg width={64} height={64} viewBox="0 0 64 64" {...props}>
      <Rect x="20" y="20" width="24" height="32" rx="8" fill="#F4A259" stroke="#bbb" strokeWidth={2} />
      <Rect x="28" y="36" width="8" height="8" rx="2" fill="#fff" stroke="#bbb" strokeWidth={1} />
      <Path d="M20 20 Q12 32 20 36" stroke="#bbb" strokeWidth={2} fill="none" />
      <Path d="M44 20 Q52 32 44 36" stroke="#bbb" strokeWidth={2} fill="none" />
    </Svg>
  );
} 
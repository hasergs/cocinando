import * as React from 'react';
import Svg, { Rect } from 'react-native-svg';
export default function ForkKnife(props) {
  return (
    <Svg width={64} height={64} viewBox="0 0 64 64" {...props}>
      <Rect x="28" y="16" width="4" height="32" rx="2" fill="#bbb" />
      <Rect x="32" y="16" width="4" height="32" rx="2" fill="#bbb" />
      <Rect x="24" y="40" width="16" height="4" rx="2" fill="#bbb" transform="rotate(-45 32 42)" />
      <Rect x="24" y="40" width="16" height="4" rx="2" fill="#bbb" transform="rotate(45 32 42)" />
    </Svg>
  );
} 
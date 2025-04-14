import React from 'react';
import Svg, { Path } from 'react-native-svg';

type RupeeAdapterProps = {
  name?: string;
  size?: number;
  color?: string;
  className?: string;
};

const RupeeAdapter: React.FC<RupeeAdapterProps> = ({ size = 24, color = 'white', className }) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 36 36" className={className}>
      <Path
        d="
          M23.88,11
          H26a1,1,0,0,1,0,2H24.26
          c0,.06,0,.12,0,.19a6.09,6.09,0,0,1-6,6.2
          h-2l6.82,8.06a1.25,1.25,0,0,1-1.91,1.62
          L12.63,18.94a1.25,1.25,0,0,1,1-2.06
          h4.71a3.59,3.59,0,0,0,3.48-3.69
          c0-.07,0-.13,0-.2h-9a1,1,0,0,1,0-2
          h8.32a3.41,3.41,0,0,0-2.78-1.5
          H12.75a1.25,1.25,0,0,1,0-2.5
          H26a1,1,0,0,1,0,2H22.68
          A6.23,6.23,0,0,1,23.88,11Z
        "
        fill={color}
        stroke="none"
      />
    </Svg>
  );
};

// Trick to make this adapter compatible with @expo/vector-icons usage
(RupeeAdapter as any).glyphMap = {};

export default RupeeAdapter;

import React from 'react';
import TableIcon from '../../../../assets/wings.svg';

type WingsAdapterProps = {
  name?: string;
  size?: number;
  color?: string;
  className?: string;
};

const WingsAdapter: React.FC<WingsAdapterProps> = ({ size = 24, color = 'black', className }) => {
  return (
    <TableIcon
      width={size}
      height={size}
      fill={color}
      stroke={color}
      strokeWidth={1}
      className={className}
    />
  );
};

(WingsAdapter as any).glyphMap = {};

export default WingsAdapter;

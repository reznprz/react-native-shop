import React from 'react';
import TableIcon from '../../../../assets/rice.svg';

type RiceAdapterProps = {
  name?: string;
  size?: number;
  color?: string;
  className?: string;
};

const RiceAdapter: React.FC<RiceAdapterProps> = ({ size = 24, color = 'black', className }) => {
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

(RiceAdapter as any).glyphMap = {};

export default RiceAdapter;

import React from 'react';
import TableIcon from '../../../../assets/momo.svg';

type MomoAdapterProps = {
  name?: string;
  size?: number;
  color?: string;
  className?: string;
};

const MomoAdapter: React.FC<MomoAdapterProps> = ({ size = 24, color = 'black', className }) => {
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

(MomoAdapter as any).glyphMap = {};

export default MomoAdapter;

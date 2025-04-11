import React from 'react';
import TableIcon from '../../../../assets/noodles.svg';

type NoodlesAdapterProps = {
  name?: string;
  size?: number;
  color?: string;
  className?: string;
};

const NoodlesAdapter: React.FC<NoodlesAdapterProps> = ({
  size = 24,
  color = 'black',
  className,
}) => {
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

(NoodlesAdapter as any).glyphMap = {};

export default NoodlesAdapter;

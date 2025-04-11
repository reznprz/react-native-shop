import React from 'react';
import TableIcon from '../../../../assets/cigarette.svg';

type CigaretteAdapterProps = {
  name?: string;
  size?: number;
  color?: string;
  className?: string;
};

const CigaretteAdapter: React.FC<CigaretteAdapterProps> = ({
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

(CigaretteAdapter as any).glyphMap = {};

export default CigaretteAdapter;

import React from 'react';
import TableIcon from '../../../../assets/breakfast.svg';

type AdapterProps = {
  name?: string;
  size?: number;
  color?: string;
  className?: string;
};

const BreakFastIconAdapter: React.FC<AdapterProps> = ({
  size = 24,
  color = 'black',
  className,
}) => {
  return <TableIcon width={size} height={size} fill={color} className={className} />;
};

(BreakFastIconAdapter as any).glyphMap = {};

export default BreakFastIconAdapter;

import React from 'react';
import TableIcon from '../../../../assets/coffee.svg';

type CoffeeIconAdapterProps = {
  name?: string;
  size?: number;
  color?: string;
  className?: string;
};

const CoffeeIconAdapter: React.FC<CoffeeIconAdapterProps> = ({
  size = 24,
  color = 'black',
  className,
}) => {
  return <TableIcon width={size} height={size} fill={color} className={className} />;
};

(CoffeeIconAdapter as any).glyphMap = {};

export default CoffeeIconAdapter;

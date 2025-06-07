import React from 'react';
import TableIcon from '../../../../assets/iced-coffee.svg';

type AdapterProps = {
  name?: string;
  size?: number;
  color?: string;
  className?: string;
};

const IcedCoffeeIconAdapter: React.FC<AdapterProps> = ({
  size = 24,
  color = 'black',
  className,
}) => {
  return <TableIcon width={size} height={size} fill={color} className={className} />;
};

(IcedCoffeeIconAdapter as any).glyphMap = {};

export default IcedCoffeeIconAdapter;

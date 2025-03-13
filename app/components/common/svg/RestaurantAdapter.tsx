import React from 'react';
import TableIcon from '../../../../assets/restaurant.svg';

type RestaurantAdapterProps = {
  name?: string;
  size?: number;
  color?: string;
  className?: string;
};

const RestaurantAdapter: React.FC<RestaurantAdapterProps> = ({
  size = 24,
  color = 'white',
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

(RestaurantAdapter as any).glyphMap = {};

export default RestaurantAdapter;

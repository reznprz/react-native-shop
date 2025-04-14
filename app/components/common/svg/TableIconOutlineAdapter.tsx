import React from 'react';
import TableIcon from '../../../../assets/table.svg';

type TableIconOutlineAdapterProps = {
  name?: string;
  size?: number;
  color?: string;
  className?: string;
};

const TableIconOutlineAdapter: React.FC<TableIconOutlineAdapterProps> = ({
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

(TableIconOutlineAdapter as any).glyphMap = {};

export default TableIconOutlineAdapter;

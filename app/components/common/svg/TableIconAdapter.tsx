import React from 'react';
import TableIcon from '../../../../assets/table-filled.svg';

type TableIconAdapterProps = {
  name?: string;
  size?: number;
  color?: string;
  className?: string;
};

const TableIconAdapter: React.FC<TableIconAdapterProps> = ({
  size = 24,
  color = 'black',
  className,
}) => {
  return <TableIcon width={size} height={size} fill={color} className={className} />;
};

(TableIconAdapter as any).glyphMap = {};

export default TableIconAdapter;

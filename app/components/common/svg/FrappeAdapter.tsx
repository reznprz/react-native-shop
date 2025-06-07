import React from 'react';
import TableIcon from '../../../../assets/frappe.svg';

type AdapterProps = {
  name?: string;
  size?: number;
  color?: string;
  className?: string;
};

const FrappeIconAdapter: React.FC<AdapterProps> = ({ size = 24, color = 'black', className }) => {
  return <TableIcon width={size} height={size} fill={color} className={className} />;
};

(FrappeIconAdapter as any).glyphMap = {};

export default FrappeIconAdapter;

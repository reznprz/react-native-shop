import React from 'react';
import TableIcon from '../../../../assets/hookah.svg';

type AdapterProps = {
  name?: string;
  size?: number;
  color?: string;
  className?: string;
};

const HookahIconAdapter: React.FC<AdapterProps> = ({ size = 24, color = 'black', className }) => {
  return <TableIcon width={size} height={size} fill={color} className={className} />;
};

(HookahIconAdapter as any).glyphMap = {};

export default HookahIconAdapter;

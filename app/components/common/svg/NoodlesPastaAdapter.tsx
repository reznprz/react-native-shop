import React from 'react';
import TableIcon from '../../../../assets/noodles-pasta.svg';

type AdapterProps = {
  name?: string;
  size?: number;
  color?: string;
  className?: string;
};

const NoodlesPastaIconAdapter: React.FC<AdapterProps> = ({
  size = 24,
  color = 'black',
  className,
}) => {
  return <TableIcon width={size} height={size} fill={color} className={className} />;
};

(NoodlesPastaIconAdapter as any).glyphMap = {};

export default NoodlesPastaIconAdapter;

import React from 'react';
import TableIcon from '../../../../assets/register.svg';

type RegisterAdapterProps = {
  name?: string;
  size?: number;
  color?: string;
  className?: string;
};

const RegisterAdapter: React.FC<RegisterAdapterProps> = ({
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

(RegisterAdapter as any).glyphMap = {};

export default RegisterAdapter;

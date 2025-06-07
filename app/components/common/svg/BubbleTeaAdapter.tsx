import React from 'react';
import TableIcon from '../../../../assets/bubble-tea.svg';

type BubbleTeaIconAdapterProps = {
  name?: string;
  size?: number;
  color?: string;
  className?: string;
};

const BubbleTeaIconAdapter: React.FC<BubbleTeaIconAdapterProps> = ({
  size = 24,
  color = 'black',
  className,
}) => {
  return <TableIcon width={size} height={size} fill={color} className={className} />;
};

(BubbleTeaIconAdapter as any).glyphMap = {};

export default BubbleTeaIconAdapter;

import React from 'react';
import { SvgXml } from 'react-native-svg';

const svgXml = `
<?xml version="1.0" encoding="utf-8"?>
<!-- Revised table-items.svg with hardcoded colors -->
<svg width="800" height="800" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
  <title>table</title>
  <g id="table">
    <line x1="15" y1="11.463" x2="15" y2="12.878" fill="none" stroke="#000000" stroke-linecap="round" stroke-linejoin="round" stroke-width="2px"/>
    <line x1="15" y1="17.122" x2="15" y2="18.537" fill="none" stroke="#000000" stroke-linecap="round" stroke-linejoin="round" stroke-width="2px"/>
    <line x1="11.463" y1="15" x2="12.878" y2="15" fill="none" stroke="#000000" stroke-linecap="round" stroke-linejoin="round" stroke-width="2px"/>
    <line x1="17.122" y1="15" x2="18.537" y2="15" fill="none" stroke="#000000" stroke-linecap="round" stroke-linejoin="round" stroke-width="2px"/>
    <circle cx="22" cy="23" r="1" fill="#000000"/>
    <path d="M39.3,24.3A6.876,6.876,0,0,0,38,28.286a5.148,5.148,0,0,0,1.944,3.545,10.422,10.422,0,0,0,14.112,0A5.148,5.148,0,0,0,56,28.286a6.874,6.874,0,0,0-1.3-4" fill="none" stroke="#000000" stroke-linecap="round" stroke-linejoin="round" stroke-width="2px"/>
    <rect x="38" y="21" width="18" height="3" rx="1.5" ry="1.5" fill="none" stroke="#000000" stroke-linecap="round" stroke-linejoin="round" stroke-width="2px"/>
    <path d="M47,18.5v-4A1.5,1.5,0,0,0,45.5,13h-2A1.5,1.5,0,0,1,42,11.5h0A1.5,1.5,0,0,1,43.5,10h1A1.5,1.5,0,0,0,46,8.5V4" fill="none" stroke="#000000" stroke-linecap="round" stroke-linejoin="round" stroke-width="2px"/>
    <polyline points="8.3 43.945 32 60 55.69 43.952" fill="none" stroke="#000000" stroke-linecap="round" stroke-linejoin="round" stroke-width="2px"/>
    <polyline points="61.304 40.149 63 39 63 35 1 35 1 39 2.701 40.152" fill="none" stroke="#000000" stroke-linecap="round" stroke-linejoin="round" stroke-width="2px"/>
    <path d="M43,16h7a1,1,0,0,0,1-1V9a1,1,0,0,1,1-1h0a1,1,0,0,0,1-1V4" fill="none" stroke="#000000" stroke-linecap="round" stroke-linejoin="round" stroke-width="2px"/>
    <line x1="2" y1="39" x2="19" y2="39" fill="none" stroke="#000000" stroke-linecap="round" stroke-linejoin="round" stroke-width="2px"/>
    <line x1="22" y1="39" x2="26" y2="39" fill="none" stroke="#000000" stroke-linecap="round" stroke-linejoin="round" stroke-width="2px"/>
    <line x1="26" y1="47" x2="26" y2="39" fill="none" stroke="#000000" stroke-linecap="round" stroke-linejoin="round" stroke-width="2px"/>
    <line x1="30" y1="51" x2="30" y2="42" fill="none" stroke="#000000" stroke-linecap="round" stroke-linejoin="round" stroke-width="2px"/>
    <line x1="34" y1="47" x2="34" y2="54" fill="none" stroke="#000000" stroke-linecap="round" stroke-linejoin="round" stroke-width="2px"/>
    <line x1="39" y1="39" x2="49" y2="39" fill="none" stroke="#000000" stroke-linecap="round" stroke-linejoin="round" stroke-width="2px"/>
    <rect x="3" y="39" width="5" height="24" fill="none" stroke="#000000" stroke-linecap="round" stroke-linejoin="round" stroke-width="2px"/>
    <rect x="56" y="39" width="5" height="24" fill="none" stroke="#000000" stroke-linecap="round" stroke-linejoin="round" stroke-width="2px"/>
    <path d="M21,29h9a0,0,0,0,1,0,0v2.678A3.322,3.322,0,0,1,26.678,35H24.322A3.322,3.322,0,0,1,21,31.678V29A0,0,0,0,1,21,29Z" fill="none" stroke="#000000" stroke-linecap="round" stroke-linejoin="round" stroke-width="2px"/>
    <path d="M9,29h9a0,0,0,0,1,0,0v2.678A3.322,3.322,0,0,1,14.678,35H12.322A3.322,3.322,0,0,1,9,31.678V29A0,0,0,0,1,9,29Z" fill="none" stroke="#000000" stroke-linecap="round" stroke-linejoin="round" stroke-width="2px"/>
    <circle cx="30.5" cy="8.5" r="2.5" fill="none" stroke="#000000" stroke-linecap="round" stroke-linejoin="round" stroke-width="2px"/>
  </g>
</svg>
`;

type TableItemsAdapterProps = {
  size?: number;
  color?: string;
  style?: object;
};

const TableItemsAdapter: React.FC<TableItemsAdapterProps> = ({
  size = 24,
  color = 'black',
  style = {},
}) => {
  // Normalize the color (remove '#' and lowercase) for a reliable comparison.
  const normalizedColor = color.replace('#', '').toLowerCase();

  // Replace all occurrences of stroke="#000000" with the dynamic color.
  let coloredSvg = svgXml.replace(/stroke="#000000"/g, `stroke="${color}"`);

  // Replace any fill="#000000" with the dynamic color.
  coloredSvg = coloredSvg.replace(/fill="#000000"/g, `fill="${color}"`);

  // For elements with fill="none", only replace them if the normalized color is '2a4759'
  // Otherwise, leave them as "none" (so the icon stays outline-only).
  coloredSvg = coloredSvg.replace(/fill="none"/g, (match) =>
    normalizedColor === '2a4759' ? `fill="${color}"` : match,
  );

  return <SvgXml xml={coloredSvg} width={size} height={size} style={style} />;
};

export default TableItemsAdapter;

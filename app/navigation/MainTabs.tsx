import React from 'react';
import { DesktopTabs, MobileTabs } from 'app/components/tabBar/CustomTabs';
import { useIsDesktop } from 'app/hooks/useIsDesktop';

export default function MainTabs() {
  const { deviceType } = useIsDesktop();

  const desktop = deviceType === 'Desktop';

  return desktop ? <DesktopTabs /> : <MobileTabs />;
}

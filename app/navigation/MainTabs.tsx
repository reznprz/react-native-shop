import React from 'react';
import { DesktopTabs, MobileTabs } from 'app/components/tabBar/CustomTabs';
import { useIsDesktop } from 'app/hooks/useIsDesktop';

export default function MainTabs() {
  const { isDesktop, deviceType } = useIsDesktop();

  const desktop = isDesktop && deviceType === 'Desktop';

  return desktop ? <DesktopTabs /> : <MobileTabs />;
}

import React from "react";
import { useWindowDimensions } from "react-native";
import { DesktopTabs, MobileTabs } from "app/components/tabBar/CustomTabs";

export default function MainTabs() {
  const { width } = useWindowDimensions();
  const isDesktop = width >= 1024;

  return isDesktop ? <DesktopTabs /> : <MobileTabs />;
}

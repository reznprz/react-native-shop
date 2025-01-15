import WorkInProgress from "app/components/WorkInProgress";
import React from "react";
import { View } from "react-native";

export default function MenuScreen() {
  return (
    <View className="flex-1 items-center justify-center">
      <WorkInProgress
        title="Menu Feature Coming Soon"
        subtitle="We're building this awesome feature. Stay tuned for updates!"
        iconName="menu-open"
      />
    </View>
  );
}

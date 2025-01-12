import WorkInProgress from "app/components/WorkInProgress";
import React, { useState } from "react";
import { View } from "react-native";

export default function OrderScreen() {
  return (
    <View className="flex-1 bg-white">
      <WorkInProgress
        title="Home Feature Coming Soon"
        subtitle="We're building this awesome feature. Stay tuned for updates!"
        iconName="progress-wrench"
      />
    </View>
  );
}

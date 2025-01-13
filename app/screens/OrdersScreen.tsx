import WorkInProgress from "../components/WorkInProgress";
import React, { useState } from "react";
import { View } from "react-native";

export default function OrdersScreen() {
  return (
    <View className="flex-1 items-center justify-center">
      <WorkInProgress
        title="Home Feature Coming Soon"
        subtitle="We're building this awesome feature. Stay tuned for updates!"
        iconName="progress-wrench"
      />
    </View>
  );
}

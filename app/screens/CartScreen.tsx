import WorkInProgress from "app/components/WorkInProgress";
import React from "react";
import { View } from "react-native";

export default function CartScreen() {
  return (
    <View className="flex-1 items-center justify-center">
      <WorkInProgress
        title="Cart Feature Coming Soon"
        subtitle="We're building this awesome feature. Stay tuned for updates!"
        iconName="cart"
      />
    </View>
  );
}

import WorkInProgress from "app/components/WorkInProgress";
import { TEXT_MESSAGES } from "app/constants/constants";
import React from "react";
import { View } from "react-native";

export default function CartScreen() {
  return (
    <View className="absolute inset-0 bg-white flex-1 items-center justify-center animation-slideIn">
      <WorkInProgress
        title={`Cart ${TEXT_MESSAGES.FEATURE_COMING_SOON}`}
        subtitle={TEXT_MESSAGES.WORK_IN_PROGRESS_SUBTITLE}
        iconName="cart"
      />
    </View>
  );
}

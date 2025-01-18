import { TEXT_MESSAGES } from "app/constants/constants";
import WorkInProgress from "../components/WorkInProgress";
import React from "react";
import { View } from "react-native";

export default function OrdersScreen() {
  return (
    <View className="flex-1 items-center justify-center">
      <WorkInProgress
        title={"Orders " + TEXT_MESSAGES.FEATURE_COMING_SOON}
        subtitle={TEXT_MESSAGES.WORK_IN_PROGRESS_SUBTITLE}
        iconName="border-all"
      />
    </View>
  );
}

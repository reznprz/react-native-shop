import WorkInProgress from "app/components/WorkInProgress";
import { TEXT_MESSAGES } from "app/constants/constants";
import React from "react";
import { View } from "react-native";

export default function TableScreen() {
  return (
    <View className="flex-1 items-center justify-center">
      <WorkInProgress
        title={"Table " + TEXT_MESSAGES.FEATURE_COMING_SOON}
        subtitle={TEXT_MESSAGES.WORK_IN_PROGRESS_SUBTITLE}
        iconName="chair-school"
      />
    </View>
  );
}

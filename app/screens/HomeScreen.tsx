import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import WorkInProgress from "../../app/components/WorkInProgress";
import { TEXT_MESSAGES } from "app/constants/constants";

const HomeScreen: React.FC = () => {
  return (
    <View className="flex-1 items-center justify-center">
      <WorkInProgress
        title={"Home " + TEXT_MESSAGES.FEATURE_COMING_SOON}
        subtitle={TEXT_MESSAGES.WORK_IN_PROGRESS_SUBTITLE}
        iconName="progress-wrench"
      />
    </View>
  );
};

export default HomeScreen;

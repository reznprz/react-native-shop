import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import WorkInProgress from "../../app/components/WorkInProgress";

const HomeScreen: React.FC = () => {
  return (
    <View className="flex-1 items-center justify-center">
      <WorkInProgress
        title="Home Feature Coming Soon"
        subtitle="We're building this awesome feature. Stay tuned for updates!"
        iconName="progress-wrench"
      />
    </View>
  );
};

export default HomeScreen;

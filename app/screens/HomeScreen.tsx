import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import WorkInProgress from "../../app/components/WorkInProgress";
import { StackNavigationProp } from "@react-navigation/stack/lib/typescript/commonjs/src";
import { BottomTabParamList } from "app/navigation/navigationTypes";

type HomeScreenProp = StackNavigationProp<BottomTabParamList, "Home">;

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

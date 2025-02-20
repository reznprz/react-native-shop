// app/screens/LoadingScreen.tsx

import React, { useEffect } from "react";
import { View, ActivityIndicator, Text, Button } from "react-native";
import { useFoodContext } from "../context/FoodContext";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../navigation/navigationTypes";

type LoadingScreenProp = StackNavigationProp<RootStackParamList, "Loading">;

const LoadingScreen: React.FC = () => {
  const { menuState, refetch } = useFoodContext();
  const navigation = useNavigation<LoadingScreenProp>();

  useEffect(() => {
    const loadData = async () => {
      console.log("LoadingScreen: Starting data fetch...");
      await refetch();
      console.log("LoadingScreen: Data fetch completed", menuState);
      if (!menuState.error && menuState.data) {
        // Ensure groupedFoods is present
        console.log("LoadingScreen: Navigating to BottomTabs");
        navigation.replace("BottomTabs");
      } else {
        console.log(
          "LoadingScreen: Staying on LoadingScreen due to error or no data"
        );
      }
    };
    loadData();
  }, [refetch, menuState.error, menuState.data, navigation]);

  return (
    <View className="flex-1 justify-center items-center bg-white">
      {menuState.loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : menuState.error ? (
        <>
          <Text className="text-red-600 font-bold mb-4">
            Error: {menuState.error}
          </Text>
          <Button title="Retry" onPress={refetch} />
        </>
      ) : null}
    </View>
  );
};

export default LoadingScreen;

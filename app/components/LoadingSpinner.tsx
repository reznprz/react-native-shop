import React from "react";
import { View, ActivityIndicator } from "react-native";
import { styled } from "nativewind";

const StyledView = styled(View);

const LoadingSpinner: React.FC = () => {
  return (
    <StyledView className="flex-1 items-center justify-center bg-white">
      <ActivityIndicator size="large" color="#4F46E5" />
    </StyledView>
  );
};

export default LoadingSpinner;

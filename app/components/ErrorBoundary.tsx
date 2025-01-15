import React from "react";
import { View, Text, Button } from "react-native";

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(_: Error): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
    // Optionally log to an external service
  }

  handleReload = () => {
    this.setState({ hasError: false });
    // Optionally navigate to a safe screen
  };

  render() {
    if (this.state.hasError) {
      return (
        <View className="flex-1 justify-center items-center bg-white px-4">
          <Text className="text-lg text-gray-700 mb-4">
            Something went wrong.
          </Text>
          <Button title="Try Again" onPress={this.handleReload} />
        </View>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

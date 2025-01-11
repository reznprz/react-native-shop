import {
  ScrollViewProps,
  ViewProps,
  TextProps,
  TouchableOpacityProps,
} from "react-native";

declare module "react-native" {
  interface ViewProps {
    className?: string;
  }

  interface TextProps {
    className?: string;
  }

  interface ScrollViewProps {
    className?: string;
  }

  interface TouchableOpacityProps {
    className?: string;
  }

  // Add other components as needed
}

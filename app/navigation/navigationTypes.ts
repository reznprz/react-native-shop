// app/navigation/navigationTypes.ts

import Ionicons from "@expo/vector-icons/Ionicons";

export type BottomTabParamList = {
  Home: undefined;
  Menu: undefined;
  Order: undefined;
  Food: undefined;
};

export type RootStackParamList = {
  Loading: undefined;
  BottomTabs: undefined;
};

export type IoniconsName = React.ComponentProps<typeof Ionicons>["name"];

export type ScreenMetadata = {
  showIcon: boolean;
  hoverEffect: boolean;
  iconName: IoniconsName;
  filledIcon: boolean;
  title: string;
};

export const bottomTabMetadata: Record<
  keyof BottomTabParamList,
  ScreenMetadata
> = {
  Home: {
    showIcon: true,
    hoverEffect: true,
    iconName: "home-outline",
    filledIcon: true,
    title: "Home",
  },
  Menu: {
    showIcon: true,
    hoverEffect: true,
    iconName: "menu-outline",
    filledIcon: true,
    title: "Menu",
  },
  Order: {
    showIcon: true,
    hoverEffect: true,
    iconName: "cart-outline",
    filledIcon: true,
    title: "Order",
  },
  Food: {
    showIcon: true,
    hoverEffect: true,
    iconName: "fast-food-outline",
    filledIcon: true,
    title: "Food",
  },
};

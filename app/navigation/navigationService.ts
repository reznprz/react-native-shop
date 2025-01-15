import { createNavigationContainerRef } from "@react-navigation/native";
import type { StackParamList, TabParamList } from "../types/navigation";

/**
 * A ref to the navigation container.
 */
export const navigationRef = createNavigationContainerRef<StackParamList>();

/**
 * Overload #1: Navigate to "MenuItemsDisplay" with params
 */
export function navigate(
  routeName: "QrMenuItemsScreen",
  params: { subCategory: string }
): void;

/**
 * Overload #2: Navigate to a specific tab within "BottomTabs"
 */
export function navigate(
  routeName: "BottomTabs",
  params: { screen: keyof TabParamList }
): void;

/**
 * Overload #3: Navigate to "BottomTabs" without params
 */
export function navigate(routeName: "BottomTabs"): void;

/**
 * Implementation signature (catch-all).
 */
export function navigate(routeName: any, params?: any) {
  if (navigationRef.isReady()) {
    navigationRef.navigate(routeName, params);
  }
}

/**
 * Go back if possible.
 */
export function goBack() {
  if (navigationRef.isReady() && navigationRef.canGoBack()) {
    console.log("Going back to the previous screen");
    navigationRef.goBack();
  } else {
    console.warn("Cannot go back");
  }
}

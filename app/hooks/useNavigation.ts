import { useCallback } from "react";
import {
  navigate,
  goBack as navigationGoBack,
} from "../navigation/navigationService";

export function useNavigation() {
  const goToMenuItemsDisplay = useCallback((subCategory: string) => {
    navigate("QrMenuItemsScreen", { subCategory });
  }, []);

  const goBack = useCallback(() => {
    navigationGoBack();
  }, []);

  return {
    goToMenuItemsDisplay,
    goBack,
  };
}

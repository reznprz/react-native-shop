import { useCallback } from "react";
import {
  navigate,
  goBack as navigationGoBack,
} from "../navigation/navigationService";

export function useNavigation() {
  const goToMenuItemsDisplay = useCallback((subCategory: string) => {
    navigate("QrMenuItemsScreen", { subCategory });
  }, []);

  const goToCartScreen = useCallback(() => {
    navigate("CartScreen");
  }, []);

  const goBack = useCallback(() => {
    navigationGoBack();
  }, []);

  return {
    goToMenuItemsDisplay,
    goToCartScreen,
    goBack,
  };
}

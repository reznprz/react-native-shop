type ScreenDetail = {
  screenName: string;
  screenDisplayName: string;
};

// Define an enum for screen names
export enum ScreenNames {
  CART = 'CartScreen',
  DEFAULT = 'APP',
  QR_MENU_ITEMS = 'QrMenuItemsScreen',
  ORDER_DETAILS = 'OrderDetails',
  TABLE = 'TableScreen',
  FOOD = 'FoodScreen',
  EXPENSE = 'ExpenseScreen',
}

export enum ScreenDisplayNames {
  CART = 'Cart',
  DEFAULT = 'App',
  QR_MENU_ITEMS = 'Menu Items',
  ORDER_DETAILS = 'Order Details',
  TABLE = 'Table',
  FOOD = 'Food',
  EXPENSE = 'Expense',
}

// Create a constant object for screen details
export const Screens: Record<ScreenNames, ScreenDetail> = {
  [ScreenNames.CART]: {
    screenName: ScreenNames.CART,
    screenDisplayName: ScreenDisplayNames.CART,
  },
  [ScreenNames.DEFAULT]: {
    screenName: ScreenNames.DEFAULT,
    screenDisplayName: ScreenDisplayNames.DEFAULT,
  },
  [ScreenNames.QR_MENU_ITEMS]: {
    screenName: ScreenNames.QR_MENU_ITEMS,
    screenDisplayName: ScreenDisplayNames.QR_MENU_ITEMS,
  },
  [ScreenNames.ORDER_DETAILS]: {
    screenName: ScreenNames.ORDER_DETAILS,
    screenDisplayName: ScreenDisplayNames.ORDER_DETAILS,
  },
  [ScreenNames.TABLE]: {
    screenName: ScreenNames.TABLE,
    screenDisplayName: ScreenDisplayNames.TABLE,
  },
  [ScreenNames.FOOD]: {
    screenName: ScreenNames.FOOD,
    screenDisplayName: ScreenDisplayNames.FOOD,
  },
  [ScreenNames.EXPENSE]: {
    screenName: ScreenNames.EXPENSE,
    screenDisplayName: ScreenDisplayNames.EXPENSE,
  },
};

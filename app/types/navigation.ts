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
  FOODMANAGER = 'FoodManagerScreen',
  EXPENSE = 'ExpenseScreen',
  DAILYSALES = 'DailySalesScreen',
  INVENTORY = 'InventoryScreen',
  SALESANALYTICS = 'SalesAnalyticsScreen',
  LOGIN = 'LoginScreen',
  USER = 'UserScreen',
  TABLEMANAGER = 'TableManagerScreen',
  PROFILE = 'ProfileScreen',
  SUBSCRIPTIONPLANS = 'SubscriptionPlansScreen',
  WELCOMESCREEN = 'WelcomeScreen'
}

export enum ScreenDisplayNames {
  CART = 'Cart',
  DEFAULT = 'App',
  QR_MENU_ITEMS = 'Menu Items',
  ORDER_DETAILS = 'Order Details',
  TABLE = 'Table',
  FOODMANAGER = 'Food Manager',
  EXPENSE = 'Expense',
  DAILYSALES = 'DailySales',
  INVENTORY = 'Inventory',
  SALESANALYTICS = 'SalesAnalytics',
  LOGIN = 'Login',
  USER = 'User',
  TABLEMANAGER = 'Table Manager',
  PROFILE = 'Profile',
  SUBSCRIPTIONPLANS = 'Subscription Plans',
  WELCOMESCREEN = 'WelcomeScreen'
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
  [ScreenNames.FOODMANAGER]: {
    screenName: ScreenNames.FOODMANAGER,
    screenDisplayName: ScreenDisplayNames.FOODMANAGER,
  },
  [ScreenNames.EXPENSE]: {
    screenName: ScreenNames.EXPENSE,
    screenDisplayName: ScreenDisplayNames.EXPENSE,
  },
  [ScreenNames.DAILYSALES]: {
    screenName: ScreenNames.DAILYSALES,
    screenDisplayName: ScreenDisplayNames.DAILYSALES,
  },
  [ScreenNames.INVENTORY]: {
    screenName: ScreenNames.INVENTORY,
    screenDisplayName: ScreenDisplayNames.INVENTORY,
  },
  [ScreenNames.SALESANALYTICS]: {
    screenName: ScreenNames.SALESANALYTICS,
    screenDisplayName: ScreenDisplayNames.SALESANALYTICS,
  },
  [ScreenNames.LOGIN]: {
    screenName: ScreenNames.LOGIN,
    screenDisplayName: ScreenDisplayNames.LOGIN,
  },
  [ScreenNames.USER]: {
    screenName: ScreenNames.USER,
    screenDisplayName: ScreenDisplayNames.USER,
  },
  [ScreenNames.TABLEMANAGER]: {
    screenName: ScreenNames.TABLEMANAGER,
    screenDisplayName: ScreenDisplayNames.TABLEMANAGER,
  },
  [ScreenNames.PROFILE]: {
    screenName: ScreenNames.PROFILE,
    screenDisplayName: ScreenDisplayNames.PROFILE,
  },
  [ScreenNames.SUBSCRIPTIONPLANS]: {
    screenName: ScreenNames.SUBSCRIPTIONPLANS,
    screenDisplayName: ScreenDisplayNames.SUBSCRIPTIONPLANS,
  },
  [ScreenNames.WELCOMESCREEN]: {
    screenName: ScreenNames.WELCOMESCREEN,
    screenDisplayName: ScreenDisplayNames.WELCOMESCREEN,
  },
};

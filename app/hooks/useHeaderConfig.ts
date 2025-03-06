// import { useMemo } from 'react';
// import { Platform } from 'react-native';
// import { NavigationRoute, ParamListBase } from '@react-navigation/native';
// import { getRouteNameFromIndex } from './utils/navigationUtils';

// interface HeaderConfig {
//   displayedTitle: string;
//   showBackArrow: boolean;
//   showCart: boolean;
// }

// /**
//  * Custom hook to extract header configuration based on the current route and tab name.
//  * Adjusts the displayed title based on the platform (web or mobile).
//  *
//  * @param route - The current navigation route.
//  * @param currentTabName - The name of the current tab, if any.
//  * @returns An object containing header configuration.
//  */
// const useHeaderConfig = (
//   route: NavigationRoute<ParamListBase, string>,
//   currentTabName?: TabRouteName,
// ): HeaderConfig => {
//   const displayedTitle =
//     Platform.OS === 'web'
//       ? getRouteNameFromIndex(route)
//       : getRouteNameFromIndex(route) === 'Cart'
//         ? getRouteNameFromIndex(route)
//         : (currentTabName ?? '');

//   const showBackArrow = useMemo(() => {
//     return (
//       (currentTabName?.trim() && isNotTabRouteName(currentTabName)) || displayedTitle === 'Cart'
//     );
//   }, [currentTabName, displayedTitle]);

//   const showCart = displayedTitle !== 'Cart';

//   return { displayedTitle, showBackArrow, showCart };
// };

// export default useHeaderConfig;

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from 'app/redux/store';
import CustomIcon from '../common/CustomIcon';
import { useIsDesktop } from 'app/hooks/useIsDesktop';
import { tabScreenConfigs } from '../../navigation/screenConfigs';
import CenterDesktopIcons from './CenterDesktopIcons';
import { getFocusedRouteNameFromRoute, RouteProp } from '@react-navigation/native';
import Ionicons from '@expo/vector-icons/Ionicons';

interface CustomHeaderProps {
  route: RouteProp<Record<string, object | undefined>, string>;
  navigation: any;
}

// Helper: Get route label from your screen configs
function getRouteLabel(routeName: string): string {
  const match = tabScreenConfigs.find((s) => s.name === routeName);
  return match ? match.label : routeName;
}

export default function CustomHeader({ route, navigation }: CustomHeaderProps) {
  const { deviceType } = useIsDesktop();
  const tableName = useSelector((state: RootState) => state.table.tableName);

  const isDesktop = deviceType === 'Desktop';
  const isPad = deviceType === 'iPad';

  // Current route name & label
  const activeRouteName = getFocusedRouteNameFromRoute(route) ?? 'Home';
  const title = getRouteLabel(activeRouteName);

  // Dynamically control size & spacing
  const containerHeight = isDesktop || isPad ? 70 : 110;
  const leftSectionPaddingTop = isDesktop || isPad ? 0 : 40;
  const tableChipMarginTop = isDesktop || isPad ? 0 : 40;

  // Replace with your actual restaurant/logo image
  const FALLBACK_IMAGE_URI = 'https://picsum.photos/200';

  return (
    <View style={[styles.headerContainer, { height: containerHeight }]}>
      {/* Left Section: Logo + Title */}
      <View style={[styles.leftSection, { paddingTop: leftSectionPaddingTop }]}>
        <View style={styles.logoContainer}>
          <Image source={{ uri: FALLBACK_IMAGE_URI }} style={styles.logo} />
        </View>
        <Text style={styles.title}>{title}</Text>
      </View>

      {/* Center Section (only for desktop/iPad) */}
      {isDesktop ? (
        <View style={styles.centerSection}>
          <CenterDesktopIcons
            tabScreenConfigs={tabScreenConfigs}
            navigation={navigation}
            activeRouteName={activeRouteName}
          />
        </View>
      ) : (
        // If not desktop, just render an empty View or nothing
        <View style={{ flex: 1 }} />
      )}

      {/* Right Section: Table “Chip” */}
      <TouchableOpacity
        style={[styles.tableChip, { marginTop: tableChipMarginTop }]}
        onPress={() =>
          navigation.navigate('MainTabs', {
            screen: 'Table',
            params: { selectedTab: 'Table Items' },
          })
        }
      >
        <CustomIcon name="chair" type="FontAwesome5" size={18} color="#FFFFFF" />
        <Text style={styles.tableText}>{tableName}</Text>
        <Ionicons name="chevron-down-outline" size={25} color="#FFFFFF" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    width: '100%',
    backgroundColor: '#2E3A47',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
    overflow: 'hidden',
    backgroundColor: '#fff',
  },
  logo: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
    color: '#fff',
  },
  centerSection: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tableChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#506D82',
    borderRadius: 20,
    paddingHorizontal: 18,
    paddingVertical: 10,
  },
  tableText: {
    marginLeft: 6,
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
});

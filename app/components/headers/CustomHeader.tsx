import React, { useMemo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from 'app/redux/store';
import CustomIcon from '../common/CustomIcon';
import { useIsDesktop } from 'app/hooks/useIsDesktop';
import { tabScreenConfigs } from '../../navigation/screenConfigs';
import CenterDesktopIcons from './CenterDesktopIcons';
import { getFocusedRouteNameFromRoute, RouteProp } from '@react-navigation/native';
import Ionicons from '@expo/vector-icons/Ionicons';
import CountChip from '../common/CountChip';
import CircularInitialNameChip from '../common/CircularInitialNameChip';
import CircularImage from '../common/CircularImage';
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
  const prepTableItems = useSelector((state: RootState) => state.prepTableItems);

  const isDesktop = deviceType === 'Desktop';
  const isPad = deviceType === 'iPad';

  // Current route name & label
  const activeRouteName = getFocusedRouteNameFromRoute(route) ?? 'Home';
  const title = getRouteLabel(activeRouteName);

  // Dynamically control size & spacing
  const containerHeight = isDesktop || isPad ? 100 : 110;
  const leftSectionPaddingTop = isDesktop || isPad ? 30 : 40;
  const tableChipMarginTop = isDesktop || isPad ? 30 : 40;

  // Replace with your actual restaurant/logo image
  const FALLBACK_IMAGE_URI = {
    uri: 'https://scontent-iad3-2.xx.fbcdn.net/v/t39.30808-6/305317844_585693433122077_344970095824068810_n.jpg?_nc_cat=106&ccb=1-7&_nc_sid=6ee11a&_nc_ohc=r7kD9QA1mlQQ7kNvgHJbbOV&_nc_oc=AdiZct-jZiANu80Jsq8Lp6AAY-GHuVQ4rAt_VSj3-_8I8mzCUr97ZBiC-4ZXvnlT-OajiAHDHAhpvHXmntfji7sC&_nc_zt=23&_nc_ht=scontent-iad3-2.xx&_nc_gid=A8UMXgVaEr0Z7-01RqrXv2_&oh=00_AYHT5NrdlXnUfQVHpa4U3Zk0Tv1Uhdg3dutxkUiMljFelQ&oe=67D7D84B',
  };

  const itemsCount = useMemo(() => {
    return prepTableItems.orderItems.reduce((sum, item) => sum + item.quantity, 0);
  }, [prepTableItems]);

  return (
    <View style={[styles.headerContainer, { height: containerHeight }]}>
      {/* Left Section: Logo + Title */}
      <CircularImage
        title={title}
        paddingTop={leftSectionPaddingTop}
        fallbackImageUri={FALLBACK_IMAGE_URI}
      />

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
        {/* Count Chip */}
        <CountChip count={itemsCount} style={styles.countChipPosition} />
        <CircularInitialNameChip initials={'RP'} size={38} style={{ marginRight: 12 }} />
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
    paddingHorizontal: 6,
    paddingVertical: 6,
  },
  tableText: {
    marginLeft: 6,
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  countChipPosition: {
    position: 'absolute',
    top: -5,
    right: -5,
  },
});

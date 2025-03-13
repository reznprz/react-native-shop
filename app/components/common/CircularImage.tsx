import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TextStyle,
  ViewStyle,
  ImageSourcePropType,
} from 'react-native';

interface CircularImageProps {
  title: string;
  paddingTop: number;
  fallbackImageUri: ImageSourcePropType;
  logoStyle?: ViewStyle;
  titleStyle?: TextStyle;
}

export default function CircularImage({
  title,
  paddingTop,
  fallbackImageUri,
  logoStyle = { width: 40, height: 40, borderRadius: 20, marginRight: 12 },
  titleStyle = { fontSize: 22, fontWeight: '600', color: '#fff' },
}: CircularImageProps) {
  return (
    <View style={[styles.leftSection, { paddingTop }]}>
      <View style={[styles.logoContainer, logoStyle]}>
        <Image source={fallbackImageUri} style={styles.logo} />
      </View>
      <Text style={[styles.title, titleStyle]}>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoContainer: {
    overflow: 'hidden',
    backgroundColor: '#fff',
  },
  logo: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  title: {},
});

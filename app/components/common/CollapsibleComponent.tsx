import React, { useState, useRef, ReactNode } from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Easing,
  LayoutAnimation,
  Platform,
  UIManager,
  ViewStyle,
} from 'react-native';
import CustomIcon from './CustomIcon';
import IconLabel from './IconLabel';
import { IconType } from 'app/navigation/screenConfigs';

// Enable LayoutAnimation for Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

// Define Props Type
interface CollapsibleComponentProps {
  title: string;
  show?: boolean;
  iconName?: string;
  iconType?: IconType;
  children: ReactNode;
  containerStyle?: ViewStyle;
  headerStyle?: ViewStyle;
  childContentStyle?: ViewStyle;
}

const CollapsibleComponent: React.FC<CollapsibleComponentProps> = ({
  title,
  show = false,
  iconName = 'document-text-outline',
  iconType = 'Ionicons',
  children,
  containerStyle = {
    borderRadius: 12,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  headerStyle = {
    padding: 12,
    backgroundColor: '#f8f8f8',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  childContentStyle = { padding: 16 },
}) => {
  const [expanded, setExpanded] = useState(show);
  const animationController = useRef(new Animated.Value(0)).current;

  const toggleExpand = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);

    const config = {
      duration: 300,
      toValue: expanded ? 0 : 1,
      easing: Easing.ease,
      useNativeDriver: true,
    };

    Animated.timing(animationController, config).start();
    setExpanded(!expanded);
  };

  return (
    <View style={[styles.container, containerStyle]}>
      <TouchableOpacity
        onPress={toggleExpand}
        style={[styles.header, headerStyle]}
        activeOpacity={0.8}
      >
        <IconLabel iconName={iconName} label={title} iconType={iconType} />

        <CustomIcon
          name={expanded ? 'chevron-up-outline' : 'chevron-down-outline'}
          size={24}
          color="#333"
          type="Ionicons"
        />
      </TouchableOpacity>

      {expanded && (
        <Animated.View style={styles.body}>
          <View style={[styles.content, childContentStyle]}>{children}</View>
        </Animated.View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  body: {
    overflow: 'hidden',
  },
  content: {
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
});

export default CollapsibleComponent;

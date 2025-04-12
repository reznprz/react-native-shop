import React from 'react';
import { Animated, StyleSheet, View, Pressable, Dimensions } from 'react-native';
import RegisterCategoryBar from '../FoodMenu/Register/RegisterCategoryBar';

const SIDEBAR_WIDTH = 220;

interface Props {
  slideAnim: Animated.Value;
  visible: boolean;
  categories: string[];
  onClose: () => void;
  handleCategoryClick: (cat: string) => void;
}

const MobileSidebar: React.FC<Props> = ({
  slideAnim,
  visible,
  categories,
  onClose,
  handleCategoryClick,
}) => {
  if (!visible) return null;

  return (
    <>
      <Pressable style={styles.overlay} onPress={onClose} />
      <Animated.View style={[styles.sidebar, { left: slideAnim }]}>
        <RegisterCategoryBar
          categories={categories}
          onCategoryClick={(cat) => {
            handleCategoryClick(cat);
            onClose();
          }}
        />
      </Animated.View>
    </>
  );
};

export default MobileSidebar;

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#00000055',
    zIndex: 10,
  },
  sidebar: {
    marginTop: 1,
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: SIDEBAR_WIDTH,
    backgroundColor: '#fff',
    zIndex: 11,
    elevation: 6,
    borderTopRightRadius: 12,
    borderBottomRightRadius: 12,
  },
});

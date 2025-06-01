import React, { useState, useMemo, useCallback, useRef } from 'react';
import {
  Modal,
  View,
  Text,
  Pressable,
  Image,
  FlatList,
  Animated,
  useWindowDimensions,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ModalActionsButton from '../common/modal/ModalActionsButton';

const DEFAULT_AVATARS = [
  'https://storage.googleapis.com/image-box-sp/Boy1.jpg',
  'https://storage.googleapis.com/image-box-sp/boy2.jpg',
  'https://storage.googleapis.com/image-box-sp/boy3.jpeg',
  'https://storage.googleapis.com/image-box-sp/boy4.jpeg',
  'https://storage.googleapis.com/image-box-sp/girl1.png',
  'https://storage.googleapis.com/image-box-sp/girl2.jpeg',
  'https://storage.googleapis.com/image-box-sp/girl3.jpeg',
  'https://storage.googleapis.com/image-box-sp/girl4.jpeg',
] as const;

type AvatarPickerModalProps = {
  visible: boolean;
  onRequestClose: () => void;
  onSelect: (avatarUrl: string) => void;
  avatars?: readonly string[];
};

const GAP = 18;

//  Helper child component
const AvatarTile: React.FC<{
  uri: string;
  size: number;
  selected: boolean;
  onPress: () => void;
}> = React.memo(({ uri, size, selected, onPress }) => {
  const [loaded, setLoaded] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const handleLoadEnd = () => {
    setLoaded(true);
    Animated.timing(fadeAnim, { toValue: 1, duration: 250, useNativeDriver: true }).start();
  };

  return (
    <Pressable onPress={onPress} style={{ marginRight: GAP, marginBottom: GAP }}>
      <View
        style={[
          styles.avatarFrame,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            borderWidth: selected ? 4 : 0,
            borderColor: selected ? '#2563eb' : undefined,
          },
        ]}
      >
        {!loaded && (
          <ActivityIndicator size="small" color="#9ca3af" style={{ position: 'absolute' }} />
        )}

        <Animated.Image
          source={{ uri }}
          resizeMode="cover"
          onLoadEnd={handleLoadEnd}
          style={{ width: size * 0.86, height: size * 0.86, borderRadius: size, opacity: fadeAnim }}
        />

        {selected && (
          <View style={styles.checkBadge}>
            <Ionicons name="checkmark" size={14} color="#fff" />
          </View>
        )}
      </View>
    </Pressable>
  );
});
AvatarTile.displayName = 'AvatarTile';

// Grid utility
const useGrid = (containerWidth: number) => {
  const numColumns = useMemo(() => {
    if (containerWidth >= 1400) return 7;
    if (containerWidth >= 1200) return 6;
    if (containerWidth >= 992) return 5;
    if (containerWidth >= 640) return 4;
    return 3;
  }, [containerWidth]);

  const imageSize = useMemo(() => {
    const horizontalPadding = 40;
    return (containerWidth - horizontalPadding - GAP * (numColumns - 1)) / numColumns;
  }, [containerWidth, numColumns]);

  return { numColumns, imageSize } as const;
};

//  Main modal component
const AvatarPickerModal: React.FC<AvatarPickerModalProps> = ({
  visible,
  onRequestClose,
  onSelect,
  avatars = DEFAULT_AVATARS,
}) => {
  const { width, height } = useWindowDimensions();
  const containerWidth = Math.min(width - 40, Math.min(width * 0.9, 720));
  const containerMaxHeight = Math.min(height * 0.88, 640);

  const { numColumns, imageSize } = useGrid(containerWidth);
  const [selected, setSelected] = useState<string | null>(null);

  const handleConfirm = () => selected && onSelect(selected);

  const renderItem = useCallback(
    ({ item }: { item: string }) => (
      <AvatarTile
        uri={item}
        size={imageSize}
        selected={selected === item}
        onPress={() => setSelected(item)}
      />
    ),
    [imageSize, selected],
  );

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onRequestClose}>
      <View style={styles.backdrop}>
        <View
          style={[styles.container, { width: containerWidth, maxHeight: containerMaxHeight }]}
          /* stop propagation so backdrop press doesn't close when pressing inside */
        >
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Choose Profile Picture</Text>
            <Pressable
              style={styles.close}
              onPress={onRequestClose}
              android_ripple={{ color: '#e5e7eb' }}
            >
              <Text style={styles.closeText}>✕</Text>
            </Pressable>
          </View>

          {/* Body */}
          <FlatList
            data={avatars}
            keyExtractor={(item) => item}
            numColumns={numColumns}
            renderItem={renderItem}
            initialNumToRender={numColumns * 2}
            windowSize={5}
            removeClippedSubviews
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 20, paddingVertical: 16 }}
            style={{ flexGrow: 0 }}
          />

          {/* Footer */}
          <View style={styles.footer}>
            <ModalActionsButton
              cancelProps={{ title: 'Cancel', onPress: onRequestClose }}
              actionProps={{ title: 'Select', onPress: handleConfirm }}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  container: {
    backgroundColor: 'white',
    borderRadius: 12,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2a4759',
    paddingVertical: 18,
    paddingHorizontal: 16,
  },
  title: {
    flex: 1,
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
  },
  close: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  closeText: {
    fontSize: 18,
    color: 'white',
  },
  footer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    paddingTop: 8,
  },
  avatarFrame: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e5e7eb',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  checkBadge: {
    position: 'absolute',
    top: 6,
    right: 6,
    backgroundColor: 'rgba(37,99,235,0.9)',
    borderRadius: 9999,
    padding: 3,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 2,
  },
});

export default AvatarPickerModal;

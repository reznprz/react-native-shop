import React, { useState, useMemo, useCallback, useRef } from 'react';
import {
  Modal,
  View,
  Text,
  Pressable,
  FlatList,
  Animated,
  useWindowDimensions,
  StyleSheet,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ModalActionsButton from '../common/modal/ModalActionsButton';
import { useTheme } from 'app/hooks/useTheme';

const DEFAULT_AVATARS = [
  'https://storage.googleapis.com/image-box-shk/Boy1.jpg',
  'https://storage.googleapis.com/image-box-shk/boy2.jpg',
  'https://storage.googleapis.com/image-box-shk/boy3.jpeg',
  'https://storage.googleapis.com/image-box-shk/boy4.jpeg',
  'https://storage.googleapis.com/image-box-shk/girl1.png',
  'https://storage.googleapis.com/image-box-shk/girl2.jpeg',
  'https://storage.googleapis.com/image-box-shk/girl3.jpeg',
  'https://storage.googleapis.com/image-box-shk/girl4.jpeg',
] as const;

type AvatarPickerModalProps = {
  visible: boolean;
  onRequestClose: () => void;
  onSelect: (avatarUrl: string) => void;
  avatars?: readonly string[];
};

const GAP = 18;

//Avatar Tile Component
const AvatarTile: React.FC<{
  uri: string;
  size: number;
  selected: boolean;
  onPress: () => void;
  theme?: any;
}> = React.memo(({ uri, size, selected, onPress, theme }) => {
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
            backgroundColor: theme.secondaryBg,
            borderWidth: selected ? 4 : 1.5,
            borderColor: selected ? theme.quaternary : theme.borderColor,
          },
        ]}
      >
        {!loaded && (
          <ActivityIndicator
            size="small"
            color={theme.textSecondary}
            style={{ position: 'absolute' }}
          />
        )}

        <Animated.Image
          source={{ uri }}
          resizeMode="cover"
          onLoadEnd={handleLoadEnd}
          style={{
            width: size * 0.86,
            height: size * 0.86,
            borderRadius: size,
            opacity: fadeAnim,
          }}
        />

        {selected && (
          <View style={[styles.checkBadge, { backgroundColor: theme.quaternary }]}>
            <Ionicons name="checkmark" size={14} color="#fff" />
          </View>
        )}
      </View>
    </Pressable>
  );
});
AvatarTile.displayName = 'AvatarTile';

//  Grid Logic

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

//  Main Component
const AvatarPickerModal: React.FC<AvatarPickerModalProps> = ({
  visible,
  onRequestClose,
  onSelect,
  avatars = DEFAULT_AVATARS,
}) => {
  const theme = useTheme();

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
        theme={theme}
      />
    ),
    [imageSize, selected, theme],
  );

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onRequestClose}>
      <View
        style={[
          styles.backdrop,
          {
            backgroundColor: theme.backdrop ?? 'rgba(0,0,0,0.35)',
          },
        ]}
      >
        <View
          style={[
            styles.container,
            {
              width: containerWidth,
              maxHeight: containerMaxHeight,
              backgroundColor: theme.primaryBg,
            },
          ]}
        >
          {/* Header */}
          <View style={[styles.header, { backgroundColor: theme.secondary }]}>
            <Text style={[styles.title, { color: theme.textPrimary }]}>Choose Profile Picture</Text>

            <Pressable
              style={[styles.close, { backgroundColor: theme.secondaryBg }]}
              onPress={onRequestClose}
            >
              <Text style={[styles.closeText, { color: theme.buttonBg }]}>✕</Text>
            </Pressable>
          </View>

          {/* Avatar Grid */}
          <FlatList
            data={avatars}
            keyExtractor={(item) => item}
            numColumns={numColumns}
            renderItem={renderItem}
            initialNumToRender={numColumns * 2}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              paddingHorizontal: 20,
              paddingVertical: 16,
            }}
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
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    ...(Platform.OS === 'web' ? ({ backdropFilter: 'blur(8px)' } as any) : {}),
  },
  container: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 18,
    paddingHorizontal: 16,
  },
  title: {
    flex: 1,
    fontSize: 18,
    fontWeight: '600',
  },
  close: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeText: {
    fontSize: 18,
  },
  footer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    paddingTop: 8,
  },
  avatarFrame: {
    justifyContent: 'center',
    alignItems: 'center',
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
    borderRadius: 9999,
    padding: 3,
    elevation: 4,
  },
});

export default AvatarPickerModal;

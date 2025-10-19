import React, { useState, useMemo, useRef } from 'react';
import {
  Modal,
  View,
  Text,
  Pressable,
  Animated,
  StyleSheet,
  ActivityIndicator,
  TextInput,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ModalActionsButton from '../common/modal/ModalActionsButton';
import { User } from 'app/api/services/userService';
import { useIsDesktop } from 'app/hooks/useIsDesktop';

const DEFAULT_AVATARS = [
  '',
  'https://storage.googleapis.com/image-box-shk/Boy1.jpg',
  'https://storage.googleapis.com/image-box-shk/boy2.jpg',
  'https://storage.googleapis.com/image-box-shk/boy3.jpeg',
  'https://storage.googleapis.com/image-box-shk/boy4.jpeg',
  'https://storage.googleapis.com/image-box-shk/girl1.png',
  'https://storage.googleapis.com/image-box-shk/girl2.jpeg',
  'https://storage.googleapis.com/image-box-shk/girl3.jpeg',
  'https://storage.googleapis.com/image-box-shk/girl4.jpeg',
] as const;

interface UpdateUserModalProps {
  visible: boolean;
  onRequestClose: () => void;
  onConfirm: (user: User) => void;
  avatars?: readonly string[];
  user: User;
}

const GAP = 8; // spacing between tiles

// AvatarTile component
const AvatarTile: React.FC<{ uri: string; size: number; selected: boolean }> = React.memo(
  ({ uri, size, selected }) => {
    const [loaded, setLoaded] = useState(false);
    const fade = useRef(new Animated.Value(0)).current;
    const isNone = uri === '';

    const onLoad = () => {
      setLoaded(true);
      Animated.timing(fade, { toValue: 1, duration: 250, useNativeDriver: true }).start();
    };

    const inner = size * 0.88; // inner image ratio

    return (
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
        {isNone ? (
          <Ionicons name="close-circle" size={inner * 0.6} color="#9ca3af" />
        ) : (
          <>
            {!loaded && <ActivityIndicator size="small" color="#9ca3af" style={styles.loader} />}
            <Animated.Image
              source={{ uri }}
              style={{ width: inner, height: inner, borderRadius: inner / 2, opacity: fade }}
              resizeMode="cover"
              onLoadEnd={onLoad}
            />
          </>
        )}
        {selected && (
          <View style={styles.checkBadge}>
            <Ionicons name="checkmark" size={14} color="#fff" />
          </View>
        )}
      </View>
    );
  },
);
AvatarTile.displayName = 'AvatarTile';

// Helpers for layout
const MOBILE_BREAKPOINT = 640; // px

const calcTileSize = (containerWidth: number, cols: number) => {
  return (containerWidth - 40 - GAP * (cols - 1)) / cols; // 40 = 20px horizontal paddings
};

const UpdateUserModal: React.FC<UpdateUserModalProps> = ({
  visible,
  onRequestClose,
  onConfirm,
  avatars = DEFAULT_AVATARS,
  user,
}) => {
  const { width: screenW, height: screenH } = useIsDesktop();

  // container width (modal)
  const containerWidth = Math.min(screenW - 40, Math.min(screenW * 0.9, 720));

  // Device type flags
  const isMobile = containerWidth < MOBILE_BREAKPOINT; // phones
  const isTabletOrDesktop = !isMobile; // tablets + desktops

  // grid config
  const cols = isTabletOrDesktop ? 6 : 3; // 6 columns for tablet/desktop grid, 3 for mobile row (unused)
  const tileSize = calcTileSize(containerWidth, isTabletOrDesktop ? cols : 4); // if mobile row, give smaller calc

  // State
  const [avatar, setAvatar] = useState(user.avatarUrl);
  const [firstName, setFirstName] = useState(user.firstName);
  const [lastName, setLastName] = useState(user.lastName);
  const [email, setEmail] = useState(user.email);
  const [phone, setPhone] = useState(user.phoneNumber);
  // const [password, setPassword] = useState('');
  // const [showPassInput, setShowPassInput] = useState(false);

  const handleSave = () => {
    const updated: User = {
      ...user,
      firstName,
      lastName,
      email,
      phoneNumber: phone,
      avatarUrl: avatar,
    } as User;
    onConfirm(updated);
  };

  // UI Parts
  const renderAvatarRowMobile = () => (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 16 }}
    >
      {avatars.map((uri, idx) => (
        <Pressable
          key={uri}
          onPress={() => {
            setAvatar(uri);
          }}
          style={{ marginRight: idx === avatars.length - 1 ? 0 : GAP }}
        >
          <AvatarTile uri={uri} size={tileSize} selected={avatar === uri} />
        </Pressable>
      ))}
    </ScrollView>
  );

  const renderAvatarGridTablet = () => (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 20, paddingTop: 16 }}>
      {avatars.slice(0, cols * 2).map((uri, idx) => (
        // Only show up to 2 rows of 6 = 12 avatars
        <Pressable
          key={uri}
          onPress={() => {
            setAvatar(uri);
          }}
          style={{
            marginRight: idx % cols === cols - 1 ? 0 : GAP,
            marginBottom: GAP,
          }}
        >
          <AvatarTile uri={uri} size={tileSize} selected={avatar === uri} />
        </Pressable>
      ))}
    </View>
  );

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onRequestClose}>
      <View style={styles.backdrop}>
        <View style={[styles.container, { width: containerWidth, maxHeight: screenH * 0.92 }]}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Edit User Profile</Text>
            <Pressable
              style={styles.close}
              onPress={onRequestClose}
              android_ripple={{ color: '#e5e7eb' }}
            >
              <Text style={styles.closeText}>✕</Text>
            </Pressable>
          </View>

          {/* Body */}
          <ScrollView keyboardShouldPersistTaps="always">
            {isMobile ? renderAvatarRowMobile() : renderAvatarGridTablet()}

            {/* Fields */}
            <View style={{ paddingHorizontal: 20, paddingBottom: 24, paddingTop: 10 }}>
              <Text style={styles.sectionTitle}>Contact Info</Text>

              <Text style={styles.label}>First Name</Text>
              <TextInput style={styles.input} value={firstName} onChangeText={setFirstName} />

              <Text style={styles.label}>Last Name</Text>
              <TextInput style={styles.input} value={lastName} onChangeText={setLastName} />

              <Text style={styles.label}>Email</Text>
              <TextInput
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />

              <Text style={styles.label}>Phone</Text>
              <TextInput
                style={styles.input}
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
              />

              {/* <Text style={styles.label}>Password</Text>
              {showPassInput ? (
                <TextInput
                  style={styles.input}
                  value={password}
                  onChangeText={setPassword}
                  placeholder="New password"
                  secureTextEntry
                />
              ) : (
                <Pressable
                  style={[styles.input, styles.passwordMask]}
                  onPress={() => setShowPassInput(true)}
                >
                  <Text style={{ color: '#6b7280', flex: 1 }}>••••••••</Text>
                  <Ionicons name="pencil" size={18} color="#6b7280" />
                </Pressable>
              )} */}
            </View>
          </ScrollView>

          {/* Footer */}
          <View style={styles.footer}>
            <ModalActionsButton
              cancelProps={{ title: 'Cancel', onPress: onRequestClose }}
              actionProps={{ title: 'Save', onPress: handleSave }}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

// Styles
const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  container: { backgroundColor: '#fff', borderRadius: 14, overflow: 'hidden', maxHeight: '92%' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2a4759',
    paddingVertical: 18,
    paddingHorizontal: 16,
  },
  title: { flex: 1, fontSize: 18, fontWeight: '600', color: 'white' },
  close: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeText: { fontSize: 18, color: 'white' },
  footer: { paddingHorizontal: 16, paddingVertical: 14 },
  avatarFrame: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e5e7eb',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,
  },
  loader: { position: 'absolute' },
  checkBadge: {
    position: 'absolute',
    top: 6,
    right: 6,
    backgroundColor: 'rgba(37,99,235,0.92)',
    borderRadius: 9999,
    padding: 3,
  },
  sectionTitle: { fontSize: 16, fontWeight: '600', color: '#111827', marginBottom: 8 },
  label: { marginTop: 10, marginBottom: 4, fontSize: 14, fontWeight: '500', color: '#374151' },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
    backgroundColor: '#f9fafb',
  },
  passwordMask: { flexDirection: 'row', alignItems: 'center' },
});

export default UpdateUserModal;

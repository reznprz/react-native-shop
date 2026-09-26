import React from 'react';
import {
  Modal,
  View,
  StyleSheet,
  Platform,
  useWindowDimensions,
  ScrollView,
  ModalProps,
  ViewStyle,
  StyleProp,
} from 'react-native';
import { useTheme } from 'app/hooks/useTheme';

interface ScrollableBaseModalProps extends ModalProps {
  visible: boolean;
  onRequestClose: () => void;
  header?: React.ReactNode;
  body?: React.ReactNode;
  footer?: React.ReactNode;
  containerStyle?: StyleProp<ViewStyle>;
}

const ScrollableBaseModal: React.FC<ScrollableBaseModalProps> = ({
  visible,
  onRequestClose,
  header,
  body,
  footer,
  containerStyle,
  ...rest
}) => {
  const theme = useTheme();
  const { width, height } = useWindowDimensions();

  const isMobile = width < 768;
  const isTablet = width >= 768 && width < 1100;
  const isLargeScreen = width >= 1100;

  const modalWidth = isMobile
    ? width * 0.96
    : isTablet
      ? Math.min(width * 0.9, 760)
      : Math.min(width * 0.78, 980);

  const modalHeight = isMobile
    ? height * 0.88
    : isTablet
      ? Math.min(height * 0.8, 760)
      : Math.min(height * 0.78, 820);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onRequestClose}
      {...rest}
    >
      <View style={styles.backdropContainer}>
        <View
          style={[
            styles.modalBox,
            {
              width: modalWidth,
              height: modalHeight,
              backgroundColor: theme.secondaryBg,
              borderRadius: isMobile ? 16 : 12,
            },
            containerStyle,
          ]}
        >
          {header && (
            <View style={[styles.header, { backgroundColor: theme.secondary }]}>{header}</View>
          )}

          {body && (
            <ScrollView
              style={styles.bodyScroll}
              contentContainerStyle={styles.bodyScrollContent}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator
            >
              <View style={styles.body}>{body}</View>
            </ScrollView>
          )}

          {footer && <View style={styles.footer}>{footer}</View>}
        </View>
      </View>
    </Modal>
  );
};

export default ScrollableBaseModal;

const styles = StyleSheet.create({
  backdropContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 12,
    ...(Platform.OS === 'web' ? ({ backdropFilter: 'blur(8px)' } as any) : {}),
  },
  modalBox: {
    overflow: 'hidden',
    maxWidth: '100%',
    maxHeight: '100%',
  },
  header: {
    padding: 18,
  },
  bodyScroll: {
    flex: 1,
  },
  bodyScrollContent: {
    paddingBottom: 12,
    flexGrow: 1,
  },
  body: {
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  footer: {
    padding: 16,
  },
});

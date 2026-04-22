import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Pressable,
  TextInput,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import ScrollableBaseModal from '../common/modal/ScrollableBaseModal';
import ConditionalWrapper from '../common/ConditionalWrapper';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import ModalActionsButton from '../common/modal/ModalActionsButton';
import Feather from '@expo/vector-icons/build/Feather';
import { RestaurantData } from 'app/api/services/restaurantService';
import { ThemeVariant } from 'app/theme/theme';
import ThemeColorPicker from '../ThemeColorPicker';

interface EditRestaurantModalProps {
  visible: boolean;
  restaurantData: RestaurantData;
  onSave: (data: RestaurantData, filePart: any) => void;
  onRequestClose: () => void;
}

type SelectedImage = {
  uri: string;
  fileName?: string;
  mimeType?: string;
};

const EditRestaurantModal: React.FC<EditRestaurantModalProps> = ({
  visible,
  restaurantData,
  onRequestClose,
  onSave,
}) => {
  const [form, setForm] = useState<RestaurantData>({ ...restaurantData });
  const [selectedImage, setSelectedImage] = useState<SelectedImage | null>(
    restaurantData.imageUrl
      ? {
          uri: restaurantData.imageUrl,
        }
      : null,
  );
  const [themeVariant, setThemeVariant] = useState<ThemeVariant>(
    (restaurantData.themeVariant as ThemeVariant) || 'BLUE',
  );

  useEffect(() => {
    if (restaurantData) {
      setForm({
        id: restaurantData.id,
        restaurantName: restaurantData.restaurantName ?? '',
        description: restaurantData.description ?? '',
        imageUrl: restaurantData.imageUrl ?? '',
        emails: restaurantData.emails ?? [],
        phones: restaurantData.phones ?? [],
        subscriptionSummary: restaurantData.subscriptionSummary,
        themeVariant: (restaurantData.themeVariant as ThemeVariant) || 'BLUE',
      });

      setSelectedImage(
        restaurantData.imageUrl
          ? {
              uri: restaurantData.imageUrl,
            }
          : null,
      );

      setThemeVariant((restaurantData.themeVariant as ThemeVariant) || 'BLUE');
    }
  }, [restaurantData]);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'Please enable photo library access to upload an image.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
    });

    if (!result.canceled && result.assets.length > 0) {
      const asset = result.assets[0];

      setSelectedImage({
        uri: asset.uri,
        fileName: asset.fileName ?? undefined,
        mimeType: asset.mimeType ?? undefined,
      });
    }
  };

  const getFileNameFromUri = (uri: string) => {
    const cleanUri = uri.split('?')[0];
    const parts = cleanUri.split('/');
    return parts[parts.length - 1] || 'image.jpg';
  };

  const getExtensionFromName = (fileName?: string) => {
    if (!fileName) return undefined;
    const match = /\.([a-zA-Z0-9]+)$/.exec(fileName);
    return match?.[1]?.toLowerCase();
  };

  const normalizeExtension = (ext?: string) => {
    if (!ext) return 'jpg';
    return ext.toLowerCase() === 'jpeg' ? 'jpg' : ext.toLowerCase();
  };

  const resolveUploadFileName = (image: SelectedImage, ext: string) => {
    const rawName = image.fileName || getFileNameFromUri(image.uri) || `image.${ext}`;
    if (rawName.includes('.')) return rawName;
    return `${rawName}.${ext}`;
  };

  const resolveMimeType = (image: SelectedImage, ext: string) => {
    if (image.mimeType) return image.mimeType;
    return `image/${ext === 'jpg' ? 'jpeg' : ext}`;
  };

  const handleSave = () => {
    if (!form.restaurantName.trim()) {
      Alert.alert('Validation Error', 'Restaurant name is required.');
      return;
    }

    let filePart;

    if (selectedImage?.uri && selectedImage.uri !== restaurantData.imageUrl) {
      const extFromFileName = getExtensionFromName(selectedImage.fileName);
      const extFromUri = getExtensionFromName(getFileNameFromUri(selectedImage.uri));
      const normalizedExt = normalizeExtension(extFromFileName || extFromUri || 'jpg');
      const resolvedFileName = resolveUploadFileName(selectedImage, normalizedExt);

      filePart = {
        uri: selectedImage.uri,
        name: resolvedFileName,
        type: resolveMimeType(selectedImage, normalizedExt),
      };
    }

    const updated: RestaurantData = {
      ...form,
      themeVariant,
    };

    onSave(updated, filePart);
    onRequestClose();
  };

  const headerContent = (
    <View className="flex-row items-center justify-between">
      <Text className="text-white text-lg font-semibold">Edit Restaurant</Text>
      <Pressable onPress={onRequestClose} className="p-1">
        <Text className="text-white text-xl">✕</Text>
      </Pressable>
    </View>
  );

  const bodyContent = (
    <ConditionalWrapper>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        className="flex-1"
      >
        <View className="bg-white w-full p-6">
          <View className="w-full items-center relative">
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={pickImage}
              className="w-[280px] border-dashed border-2 border-gray-300 rounded-2xl mb-6 h-56 items-center justify-center bg-gray-50 overflow-hidden"
            >
              {selectedImage?.uri ? (
                <>
                  <Image
                    source={{ uri: selectedImage.uri }}
                    resizeMode="cover"
                    className="w-full h-full rounded-2xl"
                  />
                  <View className="absolute bottom-2 right-2 bg-black/60 p-1.5 rounded-full">
                    <Feather name="edit-2" size={16} color="#fff" />
                  </View>
                </>
              ) : (
                <View className="items-center">
                  <MaterialIcons name="cloud-upload" size={38} color="#94a3b8" />
                  <Text className="text-gray-500 mt-2">Tap to upload image</Text>
                  <Text className="text-gray-400 text-xs mt-1">PNG, JPG, GIF — max 5 MB</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>

          <View className="mb-5">
            <Text className="text-sm text-gray-600 mb-1">Restaurant Name</Text>
            <TextInput
              value={form.restaurantName}
              onChangeText={(text) => setForm({ ...form, restaurantName: text })}
              className="border border-gray-300 rounded-lg px-4 py-2 text-base bg-white"
              placeholder="Enter name"
            />
          </View>

          <View className="mb-6">
            <Text className="text-sm text-gray-600 mb-1">Description</Text>
            <TextInput
              value={form.description}
              onChangeText={(text) => setForm({ ...form, description: text })}
              className="border border-gray-300 rounded-lg px-4 py-2 text-base h-24 bg-white"
              multiline
              placeholder="Enter description"
            />
          </View>

          <ThemeColorPicker selected={themeVariant} onSelect={setThemeVariant} />
        </View>
      </KeyboardAvoidingView>
    </ConditionalWrapper>
  );

  const footerContent = (
    <ModalActionsButton
      cancelProps={{
        title: 'Cancel',
        onPress: onRequestClose,
      }}
      actionProps={{
        title: 'Save',
        onPress: handleSave,
      }}
    />
  );

  return (
    <ScrollableBaseModal
      visible={visible}
      onRequestClose={onRequestClose}
      header={headerContent}
      body={bodyContent}
      footer={footerContent}
    />
  );
};

export default EditRestaurantModal;

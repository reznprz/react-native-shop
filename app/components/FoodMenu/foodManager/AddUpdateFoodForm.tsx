import React, { useState } from 'react';
import { View, Text, TextInput, ScrollView, TouchableOpacity, Image, Alert } from 'react-native';
import { Feather, MaterialIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

import { Category, Food } from 'app/api/services/foodService';
import ModalActionsButton from 'app/components/common/modal/ModalActionsButton';
import CollapsibleInfo from 'app/components/common/CollapsibleInfo';
import { CategoryDropdown } from './CategoryDropdown';

interface AddUpdateFoodFormProps {
  food: Food | null;
  categories: Category[];
  onSubmit: (payload: Omit<Food, 'id'>, categoryId: number, filePart: any) => void;
  onAddNewCategoryClick: () => void;
  onCancel: () => void;
}

type SelectedImage = {
  uri: string;
  fileName?: string;
  mimeType?: string;
};

const AddUpdateFoodForm: React.FC<AddUpdateFoodFormProps> = ({
  food,
  categories,
  onSubmit,
  onCancel,
  onAddNewCategoryClick,
}) => {
  const [form, setForm] = useState<Omit<Food, 'id'>>({
    name: food?.name || '',
    description: food?.description || '',
    price: food?.price || 0,
    touristPrice: food?.touristPrice || 0,
    img: food?.img || '',
    calories: food?.calories || 0,
    servingSize: food?.servingSize || '',
    categoryName: food?.categoryName || '',
    isKitchenFood: food?.isKitchenFood || false,
  });

  const [selectedImage, setSelectedImage] = useState<SelectedImage | null>(
    food?.img
      ? {
          uri: food.img,
        }
      : null,
  );

  const setField = <K extends keyof typeof form>(key: K, value: (typeof form)[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

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

  return (
    <ScrollView
      className="flex-1 bg-white px-4 py-6 md:px-8 lg:px-16"
      contentContainerStyle={{ paddingBottom: 40 }}
    >
      <View className="mb-8">
        <Text className="text-3xl font-bold text-gray-900">
          {food ? 'Update Food' : 'Add New Food'}
        </Text>
        <Text className="text-gray-500 mt-1">
          {food
            ? 'Update the details of the food item'
            : 'Fill in the details to add a new food item'}
        </Text>
      </View>

      <View className="flex-col md:flex-row md:space-x-8">
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={pickImage}
          className="border-dashed border-2 border-gray-300 rounded-2xl mb-6 md:mb-0 md:w-1/3 h-56 items-center justify-center bg-gray-50"
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

        <View className="flex-1 space-y-5">
          <View className="flex-col md:flex-row md:space-x-4 md:gap-4 md:pl-8">
            <View className="flex-1">
              <Text className="text-sm font-medium text-gray-700 mb-1">Food Name*</Text>
              <TextInput
                placeholder="Enter food name"
                className="h-12 px-4 rounded-lg border border-gray-300 bg-gray-50 text-gray-900"
                value={form.name}
                onChangeText={(value) => setField('name', value)}
              />
            </View>

            <View className="flex-1 mt-4 md:mt-0">
              <CategoryDropdown
                categories={categories.map((c) => c.name)}
                selected={form.categoryName}
                onSelect={(value) => setField('categoryName', value)}
              />
            </View>
          </View>

          <CollapsibleInfo
            label="Add New Category?"
            containerStyle="ml-8 mt-2"
            textColor="text-black font-bold underline"
            showIcon={false}
            onPress={onAddNewCategoryClick}
          />

          <View className="md:pl-8 md:mt-6 mt-4">
            <Text className="text-sm font-medium text-gray-700 mb-1">
              Description*
              <Text className="ml-2 text-gray-500">(optional)</Text>
            </Text>
            <TextInput
              placeholder="Enter detailed description of the food item"
              className="h-24 px-4 py-3 rounded-lg border border-gray-300 bg-gray-50 text-gray-900"
              multiline
              textAlignVertical="top"
              value={form.description}
              onChangeText={(value) => setField('description', value)}
            />
          </View>
        </View>
      </View>

      <View className="mt-10 flex-col md:flex-row md:space-x-6 md:gap-6">
        <View className="flex-1 bg-gray-50 rounded-2xl p-6 border border-gray-200 space-y-5">
          <Text className="text-lg font-semibold text-gray-800">Pricing Details</Text>

          {[
            { key: 'price', label: 'Regular Price*' },
            { key: 'touristPrice', label: 'Tourist Price*' },
          ].map((field) => (
            <View className="mt-6" key={field.key}>
              <Text className="text-sm text-gray-700 mb-1">{field.label}</Text>
              <View className="flex-row items-center h-12 border border-gray-300 rounded-lg bg-white overflow-hidden">
                <View className="w-12 bg-gray-100 justify-center items-center">
                  <Text className="text-gray-500 text-center">रू</Text>
                </View>
                <TextInput
                  keyboardType="numeric"
                  value={String(form[field.key as keyof typeof form])}
                  onChangeText={(value) => setField(field.key as keyof typeof form, Number(value))}
                  placeholder="0.00"
                  className="flex-1 h-full px-3 text-gray-900"
                />
              </View>
            </View>
          ))}
        </View>

        <View className="flex-1 bg-gray-50 rounded-2xl p-6 border border-gray-200 space-y-5 mt-6 md:mt-0">
          <Text className="text-lg font-semibold text-gray-800">
            Nutritional Information
            <Text className="text-gray-500">(optional)</Text>
          </Text>

          <View className="mt-6">
            <Text className="text-sm text-gray-700 mb-1">
              Calories
              <Text className="text-gray-500">(optional)</Text>
            </Text>
            <View className="flex-row items-center h-12 border border-gray-300 rounded-lg bg-white overflow-hidden">
              <TextInput
                keyboardType="numeric"
                value={form.calories ? String(form.calories) : ''}
                onChangeText={(value) => setField('calories', Number(value))}
                placeholder="Enter calories"
                className="flex-1 h-full px-3 text-gray-900"
              />
              <View className="w-14 bg-gray-100 justify-center items-center">
                <Text className="text-gray-500 text-center">kcal</Text>
              </View>
            </View>
          </View>

          <View className="mt-6">
            <Text className="text-sm text-gray-700 mb-1">
              Serving Size
              <Text className="text-gray-500">(optional)</Text>
            </Text>
            <TextInput
              placeholder="e.g., 250g"
              className="h-12 px-4 rounded-lg border border-gray-300 bg-white text-gray-900"
              value={form.servingSize}
              onChangeText={(value) => setField('servingSize', value)}
            />
          </View>
        </View>
      </View>

      <TouchableOpacity
        onPress={() => setField('isKitchenFood', !form.isKitchenFood)}
        activeOpacity={0.8}
        className="flex-row items-center mt-8 space-x-4 bg-gray-100 p-6 rounded-lg gap-4"
      >
        <View
          className={`w-10 h-6 rounded-full ${form.isKitchenFood ? 'bg-deepTeal' : 'bg-gray-300'}`}
        >
          <View
            className={`w-5 h-5 rounded-full bg-white shadow-sm mt-0.5 ml-0.5 ${
              form.isKitchenFood ? 'ml-[22px]' : ''
            }`}
          />
        </View>
        <View>
          <Text className="text-gray-700 text-base">Kitchen Food</Text>
          <Text className="text-gray-700 text-xs">
            Enable if this item is prepared in the kitchen
          </Text>
        </View>
      </TouchableOpacity>

      <ModalActionsButton
        cancelProps={{
          title: 'Cancel',
          onPress: onCancel,
        }}
        actionProps={{
          title: food ? 'Update Food' : 'Save Changes',
          onPress: () => {
            const matchCategory = categories.find((c) => c.name === form.categoryName);

            if (!matchCategory) {
              Alert.alert('Invalid Category', 'Please select a valid category');
              return;
            }

            let filePart;

            if (selectedImage?.uri && selectedImage.uri !== food?.img) {
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

            onSubmit(form, matchCategory.id, filePart);
          },
        }}
        containerStyle={{
          marginTop: 40,
          flexDirection: 'row',
          justifyContent: 'flex-end',
          gap: 16,
          height: 50,
        }}
      />
    </ScrollView>
  );
};

export default AddUpdateFoodForm;

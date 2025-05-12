import React, { useState } from 'react';
import { View, Text, TextInput, ScrollView, TouchableOpacity, Image, Platform } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Category, Food } from 'app/api/services/foodService';
import ModalActionsButton from 'app/components/common/modal/ModalActionsButton';
import { Picker } from '@react-native-picker/picker';
import { CategoryDropdown } from './CategoryDropdown';
import CollapsibleInfo from 'app/components/common/CollapsibleInfo';

interface AddUpdateFoodFormProps {
  food: Food | null;
  categories: Category[];
  onSubmit: (payload: Omit<Food, 'id'>, categoryId: number) => void;
  onAddNewCategoryClick: () => void;
  onCancel: () => void;
}

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

  const pickImage = async () => {
    // const res = await ImagePicker.launchImageLibraryAsync({
    //   mediaTypes: ImagePicker.MediaTypeOptions.Images,
    //   allowsEditing: true,
    //   aspect: [4, 3],
    //   quality: 0.8,
    // });
    // if (!res.canceled) {
    //   setForm((p) => ({ ...p, img: res.assets[0].uri }));
    // }
  };

  const setField = <K extends keyof typeof form>(key: K, value: (typeof form)[K]) =>
    setForm((p) => ({ ...p, [key]: value }));

  return (
    <ScrollView
      className="flex-1 bg-white px-4 py-6 md:px-8 lg:px-16"
      contentContainerStyle={{ paddingBottom: 40 }}
    >
      {/* Header */}
      <View className="mb-8">
        <Text className="text-3xl font-bold text-gray-900">Add New Food</Text>
        <Text className="text-gray-500 mt-1">Fill in the details to add a new food item</Text>
      </View>

      {/* Main layout: image + inputs */}
      <View className="flex-col md:flex-row md:space-x-8">
        {/* Image Upload */}
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={pickImage}
          className="border-dashed border-2 border-gray-300 rounded-2xl mb-6 md:mb-0 md:w-1/3 h-56 items-center justify-center bg-gray-50"
        >
          {form.img ? (
            <Image
              source={{ uri: form.img }}
              resizeMode="cover"
              className="w-full h-full rounded-2xl"
            />
          ) : (
            <View className="items-center">
              <MaterialIcons name="cloud-upload" size={38} color="#94a3b8" />
              <Text className="text-gray-500 mt-2">Tap to upload image</Text>
              <Text className="text-gray-400 text-xs mt-1">PNG, JPG, GIF — max 5 MB</Text>
            </View>
          )}
        </TouchableOpacity>

        {/* Food info section */}
        <View className="flex-1 space-y-5">
          {/* Name & Category */}
          <View className="flex-col md:flex-row md:space-x-4 md:gap-4 md:pl-8">
            <View className="flex-1">
              <Text className="text-sm font-medium text-gray-700 mb-1">Food Name*</Text>
              <TextInput
                placeholder="Enter food name"
                className="h-12 px-4 rounded-lg border border-gray-300 bg-gray-50 text-gray-900"
                value={form.name}
                onChangeText={(v) => setField('name', v)}
              />
            </View>
            <View className="flex-1 mt-4 md:mt-0">
              <CategoryDropdown
                categories={categories.map((c) => c.name)}
                selected={form.categoryName}
                onSelect={(v) => setField('categoryName', v)}
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

          {/* Description */}
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
              onChangeText={(v) => setField('description', v)}
            />
          </View>
        </View>
      </View>

      {/* Pricing + Nutrition */}
      <View className="mt-10 flex-col md:flex-row md:space-x-6 md:gap-6">
        {/* Pricing */}
        <View className="flex-1 bg-gray-50 rounded-2xl p-6 border border-gray-200 space-y-5">
          <Text className="text-lg font-semibold text-gray-800">Pricing Details</Text>
          {[
            { k: 'price', l: 'Regular Price*' },
            { k: 'touristPrice', l: 'Tourist Price*' },
          ].map((f) => (
            <View className={'mt-6'} key={f.k}>
              <Text className="text-sm text-gray-700 mb-1">{f.l}</Text>
              <View className="flex-row items-center h-12 border border-gray-300 rounded-lg bg-white overflow-hidden">
                <View className="w-12 bg-gray-100 justify-center items-center">
                  <Text className="text-gray-500 text-center">रू</Text>
                </View>
                <TextInput
                  keyboardType="numeric"
                  value={String(form[f.k as keyof typeof form])}
                  onChangeText={(v) => setField(f.k as keyof typeof form, Number(v))}
                  placeholder="0.00"
                  className="flex-1 h-full px-3 text-gray-900"
                />
              </View>
            </View>
          ))}
        </View>

        {/* Nutrition */}
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
                onChangeText={(v) => setField('calories', Number(v))}
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
              onChangeText={(v) => setField('servingSize', v)}
            />
          </View>
        </View>
      </View>

      {/* Kitchen toggle */}
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

      {/* Action Buttons */}
      <ModalActionsButton
        cancelProps={{
          title: 'Cancel',
          onPress: () => onCancel(),
        }}
        actionProps={{
          title: 'Save Changes',
          onPress: () => {
            const matchCategory = categories.find((c) => c.name === form.categoryName);
            if (!matchCategory) {
              alert('Please select a valid category');
              return;
            }
            onSubmit(form, matchCategory.id);
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
